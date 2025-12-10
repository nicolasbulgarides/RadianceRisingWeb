/**
 * PerspectiveShiftModelTracker
 * 
 * Tracks 3D models that have perspective shift configurations and manages
 * their transformation when the camera perspective changes (e.g., from overhead
 * to behind-player view during replay).
 * 
 * Models can have different rotation, scale, position, and offset values for:
 * - Default view (overhead camera)
 * - Perspective shift view (3D behind-player camera)
 */

// Global flag to disable perspective shift logging (set to true to enable logging)
const PERSPECTIVE_SHIFT_LOGGING_ENABLED = false;

// Helper function for conditional perspective shift logging
function perspectiveLog(...args) {
    if (PERSPECTIVE_SHIFT_LOGGING_ENABLED) {
        perspectiveLog(...args);
    }
}

class PerspectiveShiftModelTracker {
    constructor() {
        // Map of model instances to their asset configurations
        // Key: model instance, Value: { assetName, assetConfig, positionedObject, originalTransform }
        this.trackedModels = new Map();

        // Current perspective state: 'default' or 'perspective'
        this.currentPerspective = 'default';

        perspectiveLog("[PerspectiveShiftTracker] Tracker initialized");
    }

    /**
     * Registers a model for perspective shift tracking
     * @param {BABYLON.AbstractMesh|BABYLON.TransformNode} model - The model instance
     * @param {string} assetName - The asset name (e.g., 'testHeartRed')
     * @param {AssetConfig} assetConfig - The asset configuration with perspective shift data
     * @param {PositionedObject} positionedObject - The positioned object containing the model
     */
    registerModel(model, assetName, assetConfig, positionedObject = null) {
        if (!model) {
            console.warn("[PerspectiveShiftTracker] Cannot register null model");
            return;
        }

        if (!assetConfig || !assetConfig.hasPerspectiveShift) {
            // No perspective shift for this asset, skip registration
            return;
        }

        // Safety check: ensure model has required properties
        if (!model.position || !model.scaling) {
            console.warn(`[PerspectiveShiftTracker] Model ${assetName} missing position or scaling properties, skipping registration`);
            return;
        }

        // Store original transform state
        const originalTransform = {
            position: model.position.clone(),
            rotation: model.rotation ? model.rotation.clone() : new BABYLON.Vector3(0, 0, 0),
            scaling: model.scaling.clone()
        };

        this.trackedModels.set(model, {
            assetName,
            assetConfig,
            positionedObject,
            originalTransform
        });

        perspectiveLog(`[PerspectiveShiftTracker] ✓ Registered model: ${assetName} (has perspective shift)`);
        perspectiveLog(`[PerspectiveShiftTracker]   - Position: (${originalTransform.position.x.toFixed(2)}, ${originalTransform.position.y.toFixed(2)}, ${originalTransform.position.z.toFixed(2)})`);
        perspectiveLog(`[PerspectiveShiftTracker]   - Scaling: (${originalTransform.scaling.x.toFixed(2)}, ${originalTransform.scaling.y.toFixed(2)}, ${originalTransform.scaling.z.toFixed(2)})`);
    }

    /**
     * Unregisters a model from perspective shift tracking
     * @param {BABYLON.AbstractMesh|BABYLON.TransformNode} model - The model instance
     */
    unregisterModel(model) {
        if (this.trackedModels.has(model)) {
            const data = this.trackedModels.get(model);
            perspectiveLog(`[PerspectiveShiftTracker] Unregistered model: ${data.assetName}`);
            this.trackedModels.delete(model);
        }
    }

    /**
     * Switches all tracked models to default perspective (overhead view)
     * @param {number} transitionDuration - Duration of transition in milliseconds (0 for instant)
     */
    switchToDefaultPerspective(transitionDuration = 0) {
        if (this.currentPerspective === 'default') {
            perspectiveLog("[PerspectiveShiftTracker] Already in default perspective");
            return;
        }

        perspectiveLog(`[PerspectiveShiftTracker] Switching to default perspective (${this.trackedModels.size} models)`);
        this.currentPerspective = 'default';

        for (const [model, data] of this.trackedModels.entries()) {
            this.applyDefaultTransform(model, data, transitionDuration);
        }

        perspectiveLog("[PerspectiveShiftTracker] ✓ Switched to default perspective");
    }

    /**
     * Switches all tracked models to perspective shift view (3D behind-player view)
     * @param {number} transitionDuration - Duration of transition in milliseconds (0 for instant)
     */
    switchToPerspectiveShift(transitionDuration = 0) {
        if (this.currentPerspective === 'perspective') {
            perspectiveLog("[PerspectiveShiftTracker] Already in perspective shift mode");
            return;
        }

        perspectiveLog(`[PerspectiveShiftTracker] Switching to perspective shift (${this.trackedModels.size} models)`);
        this.currentPerspective = 'perspective';

        for (const [model, data] of this.trackedModels.entries()) {
            this.applyPerspectiveShiftTransform(model, data, transitionDuration);
        }

        perspectiveLog("[PerspectiveShiftTracker] ✓ Switched to perspective shift");
    }

    /**
     * Applies default transformation to a model
     * @param {BABYLON.AbstractMesh|BABYLON.TransformNode} model - The model
     * @param {Object} data - The tracked model data
     * @param {number} transitionDuration - Transition duration in ms
     */
    applyDefaultTransform(model, data, transitionDuration = 0) {
        const config = data.assetConfig;

        perspectiveLog(`[PerspectiveShiftTracker] Applying DEFAULT transform to ${data.assetName}`);
        perspectiveLog(`  - Rotation: pitch=${config.rotation.pitch}°, yaw=${config.rotation.yaw}°, roll=${config.rotation.roll}°`);
        perspectiveLog(`  - Scale: x=${config.scale.x}, y=${config.scale.y}, z=${config.scale.z}`);
        perspectiveLog(`  - Offset: x=${config.offset.x}, y=${config.offset.y}, z=${config.offset.z}`);
        perspectiveLog(`  - Transition: ${transitionDuration}ms`);

        // Target rotation (from default rotation config)
        const targetRotation = new BABYLON.Vector3(
            BABYLON.Tools.ToRadians(config.rotation.pitch),
            BABYLON.Tools.ToRadians(config.rotation.yaw),
            BABYLON.Tools.ToRadians(config.rotation.roll)
        );

        // Target scale (from default scale config)
        const targetScale = new BABYLON.Vector3(
            config.scale.x,
            config.scale.y,
            config.scale.z
        );

        // Apply offset (relative to base position)
        const targetOffset = new BABYLON.Vector3(
            config.offset.x,
            config.offset.y,
            config.offset.z
        );

        if (transitionDuration > 0) {
            this.animateTransform(model, targetRotation, targetScale, targetOffset, transitionDuration);
        } else {
            // Instant transform
            perspectiveLog(`[PerspectiveShiftTracker] Applying instant DEFAULT transform to ${data.assetName}...`);

            // Apply rotation
            if (model.rotation) {
                model.rotation = targetRotation.clone();
                perspectiveLog(`[PerspectiveShiftTracker]   Applied rotation: (${BABYLON.Tools.ToDegrees(targetRotation.x).toFixed(1)}°, ${BABYLON.Tools.ToDegrees(targetRotation.y).toFixed(1)}°, ${BABYLON.Tools.ToDegrees(targetRotation.z).toFixed(1)}°)`);
            } else {
                model.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
                    targetRotation.x, targetRotation.y, targetRotation.z
                );
                perspectiveLog(`[PerspectiveShiftTracker]   Applied rotation quaternion`);
            }

            // Apply scale
            model.scaling = targetScale.clone();
            perspectiveLog(`[PerspectiveShiftTracker]   Applied scale: (${targetScale.x.toFixed(2)}, ${targetScale.y.toFixed(2)}, ${targetScale.z.toFixed(2)})`);

            // NOTE: Position/offset are already baked into the model when loaded
            // We don't modify position here - only rotation and scale change for perspective shift
            perspectiveLog(`[PerspectiveShiftTracker] ✓ Default transform applied to ${data.assetName}`);
        }
    }

    /**
     * Applies perspective shift transformation to a model
     * @param {BABYLON.AbstractMesh|BABYLON.TransformNode} model - The model
     * @param {Object} data - The tracked model data
     * @param {number} transitionDuration - Transition duration in ms
     */
    applyPerspectiveShiftTransform(model, data, transitionDuration = 500) {
        const config = data.assetConfig;

        perspectiveLog(`[PerspectiveShiftTracker] Applying PERSPECTIVE SHIFT transform to ${data.assetName}`);
        perspectiveLog(`  - Rotation: pitch=${config.perspectiveShiftRotation.pitch}°, yaw=${config.perspectiveShiftRotation.yaw}°, roll=${config.perspectiveShiftRotation.roll}°`);
        perspectiveLog(`  - Scale: x=${config.perspectiveShiftScale.x}, y=${config.perspectiveShiftScale.y}, z=${config.perspectiveShiftScale.z}`);
        perspectiveLog(`  - Offset: x=${config.perspectiveShiftOffset.x}, y=${config.perspectiveShiftOffset.y}, z=${config.perspectiveShiftOffset.z}`);
        perspectiveLog(`  - Transition: ${transitionDuration}ms (instant if 0ms)`);

        // Target rotation (from perspective shift rotation config)
        const targetRotation = new BABYLON.Vector3(
            BABYLON.Tools.ToRadians(config.perspectiveShiftRotation.pitch),
            BABYLON.Tools.ToRadians(config.perspectiveShiftRotation.yaw),
            BABYLON.Tools.ToRadians(config.perspectiveShiftRotation.roll)
        );

        // Target scale (from perspective shift scale config)
        const targetScale = new BABYLON.Vector3(
            config.perspectiveShiftScale.x,
            config.perspectiveShiftScale.y,
            config.perspectiveShiftScale.z
        );

        // Apply offset (relative to base position)
        const targetOffset = new BABYLON.Vector3(
            config.perspectiveShiftOffset.x,
            config.perspectiveShiftOffset.y,
            config.perspectiveShiftOffset.z
        );

        if (transitionDuration > 0) {
            this.animateTransform(model, targetRotation, targetScale, targetOffset, transitionDuration);
        } else {
            // Instant transform
            perspectiveLog(`[PerspectiveShiftTracker] Applying instant PERSPECTIVE SHIFT transform to ${data.assetName}...`);

            // Apply rotation
            if (model.rotation) {
                model.rotation = targetRotation.clone();
                perspectiveLog(`[PerspectiveShiftTracker]   Applied rotation: (${BABYLON.Tools.ToDegrees(targetRotation.x).toFixed(1)}°, ${BABYLON.Tools.ToDegrees(targetRotation.y).toFixed(1)}°, ${BABYLON.Tools.ToDegrees(targetRotation.z).toFixed(1)}°)`);
            } else {
                model.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
                    targetRotation.x, targetRotation.y, targetRotation.z
                );
                perspectiveLog(`[PerspectiveShiftTracker]   Applied rotation quaternion`);
            }

            // Apply scale
            model.scaling = targetScale.clone();
            perspectiveLog(`[PerspectiveShiftTracker]   Applied scale: (${targetScale.x.toFixed(2)}, ${targetScale.y.toFixed(2)}, ${targetScale.z.toFixed(2)})`);

            // NOTE: Position/offset are already baked into the model when loaded
            // We don't modify position here - only rotation and scale change for perspective shift
            perspectiveLog(`[PerspectiveShiftTracker] ✓ Perspective shift transform applied to ${data.assetName}`);
        }
    }

    /**
     * Animates transformation smoothly over time
     * @param {BABYLON.AbstractMesh|BABYLON.TransformNode} model - The model
     * @param {BABYLON.Vector3} targetRotation - Target rotation
     * @param {BABYLON.Vector3} targetScale - Target scale
     * @param {BABYLON.Vector3} targetOffset - Target offset
     * @param {number} duration - Animation duration in ms
     */
    animateTransform(model, targetRotation, targetScale, targetOffset, duration) {
        const startTime = Date.now();

        // Store starting values
        const startRotation = model.rotation ? model.rotation.clone() :
            model.rotationQuaternion ? model.rotationQuaternion.toEulerAngles() :
                new BABYLON.Vector3(0, 0, 0);
        const startScale = model.scaling.clone();
        const startPosition = model.position.clone();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            // Ease in-out cubic for smooth animation
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Interpolate rotation
            const currentRotation = BABYLON.Vector3.Lerp(startRotation, targetRotation, eased);
            if (model.rotation) {
                model.rotation = currentRotation;
            } else {
                model.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
                    currentRotation.x, currentRotation.y, currentRotation.z
                );
            }

            // Interpolate scale
            model.scaling = BABYLON.Vector3.Lerp(startScale, targetScale, eased);

            // Interpolate position (with offset)
            // Note: This assumes the base position remains constant
            const targetPosition = startPosition.clone().add(targetOffset);
            model.position = BABYLON.Vector3.Lerp(startPosition, targetPosition, eased);

            // Continue animation or complete
            if (progress < 1.0) {
                requestAnimationFrame(animate);
            } else {
                // Ensure we're exactly at target values
                if (model.rotation) {
                    model.rotation = targetRotation;
                } else {
                    model.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
                        targetRotation.x, targetRotation.y, targetRotation.z
                    );
                }
                model.scaling = targetScale;
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Clears all tracked models (useful for level transitions)
     */
    clearAllTrackedModels() {
        perspectiveLog(`[PerspectiveShiftTracker] Clearing ${this.trackedModels.size} tracked models`);
        this.trackedModels.clear();
        this.currentPerspective = 'default';
    }

    /**
     * Gets the count of currently tracked models
     * @returns {number} Number of tracked models
     */
    getTrackedModelCount() {
        return this.trackedModels.size;
    }

    /**
     * Gets the current perspective state
     * @returns {string} 'default' or 'perspective'
     */
    getCurrentPerspective() {
        return this.currentPerspective;
    }
}

