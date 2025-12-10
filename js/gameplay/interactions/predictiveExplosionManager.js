/**
 * PredictiveExplosionManager
 * 
 * Triggers explosion effects preemptively based on predicted player movement.
 * This ensures explosions appear right when the player lands on tiles with pickups/spikes,
 * rather than waiting until after they've already landed (which causes visible delay).
 */

// Global flag to disable predictive explosion logging (set to false to enable logging)
const PREDICTIVE_EXPLOSION_LOGGING_ENABLED = false;

// Helper function for conditional predictive explosion logging
function predictiveExplosionLog(...args) {
    if (PREDICTIVE_EXPLOSION_LOGGING_ENABLED) {
        console.log(...args);
    }
}

class PredictiveExplosionManager {
    constructor() {
        this.scheduledExplosions = new Map(); // Track scheduled explosions: eventKey -> targetFrame
        this.triggeredExplosions = new Set(); // Track which events already had preemptive explosions
    }

    /**
     * Predicts and schedules explosions for a player's movement
     * @param {PlayerUnit} player - The player that's moving
     * @param {BABYLON.Vector3} startPosition - Starting position
     * @param {BABYLON.Vector3} destinationPosition - Destination position
     * @param {number} speed - Movement speed (from Config.DEFAULT_MAX_SPEED)
     * @param {number} currentFrame - Current frame count for frame-based scheduling
     */
    predictAndScheduleExplosions(player, startPosition, destinationPosition, speed, currentFrame) {
        const totalDistance = BABYLON.Vector3.Distance(startPosition, destinationPosition);
        // Calculate total frames needed for movement at target speed (60 FPS)
        const totalTravelTimeMs = (totalDistance / speed) * 1000;
        const totalTravelFrames = Math.ceil((totalTravelTimeMs / 1000) * 60); // Convert to frames at 60 FPS

        // Calculate the position 0.25 units into the destination tile
        // This is where we want the explosion to trigger (when player model is 1/4 into the tile)
        const direction = destinationPosition.subtract(startPosition).normalize();
        const destTile = {
            x: Math.floor(destinationPosition.x),
            z: Math.floor(destinationPosition.z)
        };

        // Find the boundary of the DESTINATION tile (not the first boundary crossed)
        // We need to determine which edge of the destination tile the player enters from
        const startTile = {
            x: Math.floor(startPosition.x),
            z: Math.floor(startPosition.z)
        };

        // Calculate the entry boundary of the destination tile
        let destTileBoundaryX = destTile.x;
        let destTileBoundaryZ = destTile.z;

        // If coming from left (smaller x), enter at left edge of dest tile
        // If coming from right (larger x), enter at right edge (+ 1)
        if (startTile.x < destTile.x) {
            destTileBoundaryX = destTile.x; // Left edge
        } else if (startTile.x > destTile.x) {
            destTileBoundaryX = destTile.x + 1; // Right edge
        }

        if (startTile.z < destTile.z) {
            destTileBoundaryZ = destTile.z; // Front edge
        } else if (startTile.z > destTile.z) {
            destTileBoundaryZ = destTile.z + 1; // Back edge
        }

        let destTileBoundaryPosition = new BABYLON.Vector3(
            destTileBoundaryX,
            destinationPosition.y,
            destTileBoundaryZ
        );

        // Position 0.25 units into the destination tile from its boundary
        const positionIntoTile = destTileBoundaryPosition.add(direction.scale(0.25));

        // Calculate distance from start to the 0.25-into-tile position
        const distanceToExplosionPoint = BABYLON.Vector3.Distance(startPosition, positionIntoTile);

        // Calculate time to reach that position (speed is in units per second)
        const explosionTriggerTimeMs = (distanceToExplosionPoint / speed) * 1000;

        predictiveExplosionLog(`[PREDICTIVE EXPLOSION] Movement detected:`);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Start position: (${startPosition.x.toFixed(2)}, ${startPosition.z.toFixed(2)})`);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Destination: (${destinationPosition.x.toFixed(2)}, ${destinationPosition.z.toFixed(2)})`);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Start tile: (${startTile.x}, ${startTile.z})`);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Dest tile: (${destTile.x}, ${destTile.z})`);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Total distance: ${totalDistance.toFixed(2)} units`);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Speed: ${speed} units/sec`);

        // Calculate ALL tiles that will be passed through (including destination)
        const tilesPassedThrough = this.calculateTilesPassedThrough(startPosition, destinationPosition);
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION]   Tiles to check: ${tilesPassedThrough.length} tiles`);

        // Check for microevents at ALL passed-through tiles
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            return;
        }

        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const level = gameplayManager?.primaryActiveGameplayLevel;
        if (!level) {
            return;
        }

        const levelId = level.levelDataComposite?.levelHeaderData?.levelId;
        const allMicroEvents = microEventManager.getMicroEventsByLevelId(levelId);
        if (!allMicroEvents) {
            return;
        }

        // Find microevents at ALL tiles passed through
        for (const tileInfo of tilesPassedThrough) {
            for (const microEvent of allMicroEvents) {
                if (!microEvent.microEventLocation || microEvent.microEventCompletionStatus) {
                    continue;
                }

                const eventTile = {
                    x: Math.floor(microEvent.microEventLocation.x),
                    z: Math.floor(microEvent.microEventLocation.z)
                };

                // Check if event is at this passed-through tile
                if (eventTile.x === tileInfo.tileX && eventTile.z === tileInfo.tileZ) {
                    const eventKey = `${microEvent.microEventNickname}_${tileInfo.tileX}_${tileInfo.tileZ}`;

                    // Skip if already scheduled
                    if (this.scheduledExplosions.has(eventKey)) {
                        predictiveExplosionLog(`[PREDICTIVE EXPLOSION] Already scheduled: ${microEvent.microEventNickname}`);
                        continue;
                    }

                    predictiveExplosionLog(`[PREDICTIVE EXPLOSION] ✓ Found event at tile (${tileInfo.tileX}, ${tileInfo.tileZ}): ${microEvent.microEventNickname} (${microEvent.microEventCategory})`);

                    // Calculate when player will be 0.25 units into THIS tile
                    const explosionTimeMs = this.calculateExplosionTimeForTile(
                        startPosition,
                        destinationPosition,
                        tileInfo.tileX,
                        tileInfo.tileZ,
                        direction,
                        speed
                    );

                    if (explosionTimeMs >= 0) {
                        // Convert milliseconds to frames and calculate target frame
                        const explosionFrames = Math.ceil((explosionTimeMs / 1000) * 60);
                        const targetFrame = currentFrame + explosionFrames;

                        // Schedule explosion by storing target frame
                        this.scheduledExplosions.set(eventKey, targetFrame);
                        predictiveExplosionLog(`[PREDICTIVE EXPLOSION] ⏰ Scheduled ${microEvent.microEventCategory} explosion for tile (${tileInfo.tileX}, ${tileInfo.tileZ}) at frame ${targetFrame} (in ${explosionFrames} frames from frame ${currentFrame})`);
                    }
                }
            }
        }
    }

    /**
     * Processes scheduled explosions that are ready to trigger
     * Called by GameplayEndOfFrameCoordinator every few frames
     * @param {number} currentFrame - Current frame count from GameplayEndOfFrameCoordinator
     */
    processScheduledExplosions(currentFrame) {

        // Check each scheduled explosion
        for (const [eventKey, targetFrame] of this.scheduledExplosions) {
            if (currentFrame >= targetFrame) {
                // Find the microevent for this explosion
                const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
                const level = gameplayManager?.primaryActiveGameplayLevel;
                if (!level) continue;

                const levelId = level.levelDataComposite?.levelHeaderData?.levelId;
                const microEventManager = FundamentalSystemBridge["microEventManager"];
                const allMicroEvents = microEventManager?.getMicroEventsByLevelId(levelId);

                if (!allMicroEvents) continue;

                // Find the matching microevent
                const microEvent = allMicroEvents.find(event => {
                    const eventTile = {
                        x: Math.floor(event.microEventLocation.x),
                        z: Math.floor(event.microEventLocation.z)
                    };
                    const expectedKey = `${event.microEventNickname}_${eventTile.x}_${eventTile.z}`;
                    return expectedKey === eventKey;
                });

                if (microEvent) {
                    predictiveExplosionLog(`[PREDICTIVE EXPLOSION] 🎯 Triggering scheduled explosion for ${eventKey} at frame ${currentFrame}`);
                    this.triggerPreemptiveExplosion(microEvent);
                }

                // Remove from scheduled list regardless of whether we found the event
                this.scheduledExplosions.delete(eventKey);
            }
        }
    }

    /**
     * Calculates all tiles the player will pass through during movement
     * @param {BABYLON.Vector3} startPosition - Starting position
     * @param {BABYLON.Vector3} destinationPosition - Destination position
     * @returns {Array<{tileX: number, tileZ: number}>} Array of tile coordinates
     */
    calculateTilesPassedThrough(startPosition, destinationPosition) {
        const startTile = {
            x: Math.floor(startPosition.x),
            z: Math.floor(startPosition.z)
        };
        const destTile = {
            x: Math.floor(destinationPosition.x),
            z: Math.floor(destinationPosition.z)
        };

        const tiles = [];

        // Use Bresenham-like algorithm to find all tiles along the path
        const dx = Math.abs(destTile.x - startTile.x);
        const dz = Math.abs(destTile.z - startTile.z);
        const sx = startTile.x < destTile.x ? 1 : -1;
        const sz = startTile.z < destTile.z ? 1 : -1;

        let currentX = startTile.x;
        let currentZ = startTile.z;
        let err = dx - dz;

        // Don't include the starting tile (player is already there)
        // Do include all tiles along the path including destination
        const visited = new Set();

        while (true) {
            // Move to next tile
            const e2 = 2 * err;
            if (e2 > -dz) {
                err -= dz;
                currentX += sx;
            }
            if (e2 < dx) {
                err += dx;
                currentZ += sz;
            }

            const tileKey = `${currentX}_${currentZ}`;
            if (!visited.has(tileKey)) {
                tiles.push({ tileX: currentX, tileZ: currentZ });
                visited.add(tileKey);
            }

            // Stop when we reach destination tile
            if (currentX === destTile.x && currentZ === destTile.z) {
                break;
            }
        }

        return tiles;
    }

    /**
     * Calculates when the player will be 0.25 units into a specific tile
     * @param {BABYLON.Vector3} startPosition - Starting position
     * @param {BABYLON.Vector3} destinationPosition - Destination position
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileZ - Tile Z coordinate
     * @param {BABYLON.Vector3} direction - Movement direction (normalized)
     * @param {number} speed - Movement speed
     * @returns {number} Time in milliseconds when player will be 0.25 into tile
     */
    calculateExplosionTimeForTile(startPosition, destinationPosition, tileX, tileZ, direction, speed) {
        const startTile = {
            x: Math.floor(startPosition.x),
            z: Math.floor(startPosition.z)
        };

        // Determine which edge of this tile the player enters from
        let tileBoundaryX = tileX;
        let tileBoundaryZ = tileZ;

        // Calculate entry boundary based on direction
        if (direction.x > 0) {
            tileBoundaryX = tileX; // Entering from left edge
        } else if (direction.x < 0) {
            tileBoundaryX = tileX + 1; // Entering from right edge
        } else {
            // Moving purely in Z direction, use current x position
            tileBoundaryX = startPosition.x;
        }

        if (direction.z > 0) {
            tileBoundaryZ = tileZ; // Entering from front edge
        } else if (direction.z < 0) {
            tileBoundaryZ = tileZ + 1; // Entering from back edge
        } else {
            // Moving purely in X direction, use current z position
            tileBoundaryZ = startPosition.z;
        }

        const tileBoundaryPosition = new BABYLON.Vector3(
            tileBoundaryX,
            startPosition.y,
            tileBoundaryZ
        );

        // Position 0.25 units into this tile
        const positionIntoTile = tileBoundaryPosition.add(direction.scale(0.25));

        // Calculate distance from start to the 0.25-into-tile position
        const distanceToExplosionPoint = BABYLON.Vector3.Distance(startPosition, positionIntoTile);

        // Calculate time to reach that position
        const explosionTriggerTimeMs = (distanceToExplosionPoint / speed) * 1000;

        return explosionTriggerTimeMs;
    }

    /**
     * Triggers a preemptive explosion based on microevent type
     * @param {MicroEvent} microEvent - The microevent to trigger explosion for
     */
    triggerPreemptiveExplosion(microEvent) {
        const scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
        if (!scene || !microEvent.microEventLocation) {
            return;
        }

        const category = microEvent.microEventCategory;
        const isHeart = microEvent.microEventValue === "heart" || microEvent.microEventNickname?.includes("Heart");

        predictiveExplosionLog(`[PREDICTIVE EXPLOSION] 💥 Triggering preemptive explosion: ${microEvent.microEventNickname} (${category})`);

        // Mark this event as having a preemptive explosion
        const eventKey = `${microEvent.microEventNickname}_${Math.floor(microEvent.microEventLocation.x)}_${Math.floor(microEvent.microEventLocation.z)}`;
        this.triggeredExplosions.add(eventKey);

        // Store reference on microEvent to prevent duplicate explosion in normal system
        microEvent.hasPreemptiveExplosion = true;

        // Trigger appropriate explosion using our own methods
        if (category === "pickup" && isHeart) {
            this.createHeartExplosion(microEvent.microEventLocation, scene).catch(error => {
                console.error(`[PREDICTIVE EXPLOSION] Heart explosion failed:`, error);
            });
        } else if (category === "pickup") {
            this.createStardustExplosion(microEvent.microEventLocation, scene).catch(error => {
                console.error(`[PREDICTIVE EXPLOSION] Stardust explosion failed:`, error);
            });
        } else if (category === "damage") {
            this.createDamageExplosion(microEvent.microEventLocation, scene).catch(error => {
                console.error(`[PREDICTIVE EXPLOSION] Damage explosion failed:`, error);
            });
        }
    }

    /**
     * Shared texture cache for all particle effects
     */
    static cachedParticleTexture = null;

    /**
     * Ensures the particle texture is loaded and cached
     * @param {BABYLON.Scene} scene - The scene to load texture into
     * @returns {BABYLON.Texture} The cached texture
     */
    static ensureParticleTextureLoaded(scene) {
        if (!PredictiveExplosionManager.cachedParticleTexture && scene) {
            PredictiveExplosionManager.cachedParticleTexture = new BABYLON.Texture(
                "https://assets.babylonjs.com/textures/flare.png",
                scene
            );
            predictiveExplosionLog(`[EXPLOSION] Particle texture loaded and cached`);
        }
        return PredictiveExplosionManager.cachedParticleTexture;
    }

    /**
     * Creates a parameterized particle explosion effect
     * @param {Object} config - Explosion configuration
     * @param {BABYLON.Vector3} config.position - Position for the explosion
     * @param {BABYLON.Scene} config.scene - The scene
     * @param {number} config.maxParticles - Maximum number of particles
     * @param {number} config.emitCount - Number of particles to emit
     * @param {BABYLON.Vector3} config.emitBox - Emission box size
     * @param {number} config.minLifeTime - Minimum particle lifetime
     * @param {number} config.maxLifeTime - Maximum particle lifetime
     * @param {number} config.minSize - Minimum particle size
     * @param {number} config.maxSize - Maximum particle size
     * @param {number} config.minEmitPower - Minimum emission power
     * @param {number} config.maxEmitPower - Maximum emission power
     * @param {BABYLON.Color4} config.color1 - Primary color
     * @param {BABYLON.Color4} config.color2 - Secondary color
     * @param {BABYLON.Color4} config.colorDead - Death color
     * @param {BABYLON.Vector3} config.gravity - Gravity vector
     * @param {number} config.cleanupTimeMs - Time before cleanup (ms)
     * @param {string} config.name - Name for the particle system
     * @returns {Promise<void>}
     */
    async createParameterizedExplosion(config) {
        const particleSystem = new BABYLON.ParticleSystem(
            config.name || `explosion_${Date.now()}`,
            config.maxParticles,
            config.scene
        );

        // Texture - use cached texture for instant start
        const texture = PredictiveExplosionManager.ensureParticleTextureLoaded(config.scene);
        particleSystem.particleTexture = texture;

        // Set position as emitter
        particleSystem.emitter = config.position.clone();

        // Explosion shape
        particleSystem.minEmitBox = config.emitBox.scale(-1);
        particleSystem.maxEmitBox = config.emitBox;

        // Emission - burst effect
        particleSystem.manualEmitCount = config.emitCount;
        particleSystem.emitRate = 0;

        // Lifetime
        particleSystem.minLifeTime = config.minLifeTime;
        particleSystem.maxLifeTime = config.maxLifeTime;

        // Size
        particleSystem.minSize = config.minSize;
        particleSystem.maxSize = config.maxSize;

        // Speed
        particleSystem.minEmitPower = config.minEmitPower;
        particleSystem.maxEmitPower = config.maxEmitPower;
        particleSystem.updateSpeed = 0.01;

        // Direction - spherical explosion
        particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

        // Colors
        particleSystem.color1 = config.color1;
        particleSystem.color2 = config.color2;
        particleSystem.colorDead = config.colorDead;
        particleSystem.gravity = config.gravity;

        // Visual effects
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.minAngularSpeed = -2;
        particleSystem.maxAngularSpeed = 2;
        particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;

        // Start the effect
        particleSystem.start();

        // Clean up after specified time
        return new Promise((resolve) => {
            setTimeout(() => {
                particleSystem.stop();
                particleSystem.dispose(false); // Keep texture cached
                resolve();
            }, config.cleanupTimeMs);
        });
    }

    /**
     * Creates a damage explosion (red/orange burst for spikes)
     * @param {BABYLON.Vector3} position - Position for the explosion
     * @param {BABYLON.Scene} scene - The scene
     * @returns {Promise<void>}
     */
    async createDamageExplosion(position, scene) {
        return this.createParameterizedExplosion({
            position: position,
            scene: scene,
            maxParticles: 200,
            emitCount: 100,
            emitBox: new BABYLON.Vector3(0.2, 0.2, 0.2),
            minLifeTime: 0.15,
            maxLifeTime: 0.35,
            minSize: 0.1,
            maxSize: 0.4,
            minEmitPower: 2,
            maxEmitPower: 5,
            color1: new BABYLON.Color4(1.0, 0.2, 0.0, 1.0), // Red
            color2: new BABYLON.Color4(1.0, 0.5, 0.0, 1.0), // Orange
            colorDead: new BABYLON.Color4(0.5, 0.0, 0.0, 0.0),
            gravity: new BABYLON.Vector3(0, -5, 0), // Falls down
            cleanupTimeMs: 350,
            name: `damageExplosion_${Date.now()}`
        });
    }

    /**
     * Creates a stardust explosion (blue/purple burst)
     * @param {BABYLON.Vector3} position - Position for the explosion
     * @param {BABYLON.Scene} scene - The scene
     * @returns {Promise<void>}
     */
    async createStardustExplosion(position, scene) {
        return this.createParameterizedExplosion({
            position: position,
            scene: scene,
            maxParticles: 500,
            emitCount: 300,
            emitBox: new BABYLON.Vector3(0.3, 0.3, 0.3),
            minLifeTime: 0.25,
            maxLifeTime: 0.5,
            minSize: 0.2,
            maxSize: 0.8,
            minEmitPower: 3,
            maxEmitPower: 8,
            color1: new BABYLON.Color4(0.2, 0.4, 1.0, 1.0), // Bright blue
            color2: new BABYLON.Color4(0.6, 0.2, 1.0, 1.0), // Purple
            colorDead: new BABYLON.Color4(0.1, 0.0, 0.5, 0.0),
            gravity: new BABYLON.Vector3(0, 2, 0), // Floats up
            cleanupTimeMs: 500,
            name: `stardustExplosion_${Date.now()}`
        });
    }

    /**
     * Creates a heart explosion (pink burst)
     * @param {BABYLON.Vector3} position - Position for the explosion
     * @param {BABYLON.Scene} scene - The scene
     * @returns {Promise<void>}
     */
    async createHeartExplosion(position, scene) {
        return this.createParameterizedExplosion({
            position: position,
            scene: scene,
            maxParticles: 150,
            emitCount: 100,
            emitBox: new BABYLON.Vector3(0.2, 0.2, 0.2),
            minLifeTime: 0.2,
            maxLifeTime: 0.4,
            minSize: 0.15,
            maxSize: 0.5,
            minEmitPower: 2,
            maxEmitPower: 5,
            color1: new BABYLON.Color4(1.0, 0.4, 0.7, 1.0), // Bright pink
            color2: new BABYLON.Color4(1.0, 0.7, 0.9, 1.0), // Light pink
            colorDead: new BABYLON.Color4(0.8, 0.2, 0.5, 0.0),
            gravity: new BABYLON.Vector3(0, 1, 0), // Floats up gently
            cleanupTimeMs: 400,
            name: `heartExplosion_${Date.now()}`
        });
    }

    /**
     * Creates a spawn/arrival explosion (magic burst for level start)
     * @param {BABYLON.Vector3} position - Position for the explosion
     * @param {BABYLON.Scene} scene - The scene
     * @param {number} intensity - Explosion intensity (0.1 to 2.0)
     * @returns {Promise<void>}
     */
    async createSpawnExplosion(position, scene, intensity = 0.4) {
        const scale = Math.max(0.1, Math.min(2.0, intensity));
        return this.createParameterizedExplosion({
            position: position,
            scene: scene,
            maxParticles: Math.floor(300 * scale),
            emitCount: Math.floor(200 * scale),
            emitBox: new BABYLON.Vector3(0.25 * scale, 0.25 * scale, 0.25 * scale),
            minLifeTime: 0.3,
            maxLifeTime: 0.6,
            minSize: 0.15 * scale,
            maxSize: 0.6 * scale,
            minEmitPower: 2 * scale,
            maxEmitPower: 6 * scale,
            color1: new BABYLON.Color4(0.3, 0.7, 1.0, 1.0), // Cyan
            color2: new BABYLON.Color4(0.8, 0.3, 1.0, 1.0), // Magenta
            colorDead: new BABYLON.Color4(0.2, 0.1, 0.6, 0.0),
            gravity: new BABYLON.Vector3(0, 1.5, 0), // Floats up
            cleanupTimeMs: 800,
            name: `spawnExplosion_${Date.now()}`
        });
    }

    /**
     * Clears all scheduled explosions (call when movement is cancelled or level changes)
     */
    clearAllScheduledExplosions() {
        predictiveExplosionLog(`[PREDICTIVE EXPLOSION] Clearing ${this.scheduledExplosions.size} scheduled explosions`);
        this.scheduledExplosions.clear();
    }

    /**
     * Clears scheduled explosions for a specific level (call on level transition)
     */
    clearScheduledExplosionsForLevel() {
        this.clearAllScheduledExplosions();
        this.triggeredExplosions.clear();
    }

    /**
     * Checks if a microevent already had a preemptive explosion
     * @param {MicroEvent} microEvent - The microevent to check
     * @returns {boolean} True if explosion already triggered
     */
    hasPreemptiveExplosion(microEvent) {
        return microEvent.hasPreemptiveExplosion === true;
    }
}


