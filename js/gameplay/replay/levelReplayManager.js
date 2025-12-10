/**
 * 
 * LevelReplayManager
 * 
 * Manages the replay system that shows a 3D perspective replay of the level completion.
 * Uses the SAME level board and player - no duplicates.
 * Resets item visibility, replays movements with camera following, and applies perspective shifts.
 */

// Global flag to disable replay logging (set to false to enable logging)
const REPLAY_LOGGING_ENABLED = false;

// Helper function for conditional replay logging
function replayLog(...args) {
    if (REPLAY_LOGGING_ENABLED) {
        console.log(...args);
    }
}

class LevelReplayManager {
    constructor() {
        // NO DUPLICATE LEVEL OR PLAYER - replay uses the same board and original player
        this.isReplaying = false;
        this.replayIndex = 0;
        this.replayMovements = [];
        this.replayPickupPositions = [];
        this.replayDamagePositions = [];
        this.replayPickupCount = 0; // Count of pickups collected during replay
        this.replayPlayer = null; // Reference to the player being replayed

        // Perspective shift tracker for managing model transformations during camera transitions
        this.perspectiveShiftTracker = new PerspectiveShiftModelTracker();

        // F1 hotkey for testing visibility toggle on stardust
        this.setupDebugHotkeys();
    }

    /**
     * Sets up debug hotkeys for testing visibility
     */
    setupDebugHotkeys() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'F1') {
                event.preventDefault();
                replayLog("[DEBUG] F1 pressed - toggling stardust visibility");
                this.toggleStardustVisibility();
            }
        });
    }

    /**
     * Toggles stardust visibility for debugging
     */
    toggleStardustVisibility() {
        replayLog("[DEBUG] Attempting to toggle stardust visibility...");

        // Try multiple ways to get the active level
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        replayLog("[DEBUG] gameplayManager exists:", !!gameplayManager);

        let level = null;
        if (gameplayManager) {
            replayLog("[DEBUG] Checking gameplayManager.currentActiveLevel...");
            level = gameplayManager.currentActiveLevel;
            if (!level) {
                replayLog("[DEBUG] Checking gameplayManager.primaryActiveGameplayLevel...");
                level = gameplayManager.primaryActiveGameplayLevel;
            }
        }

        replayLog("[DEBUG] Level found:", !!level);

        if (!level) {
            console.warn("[DEBUG] No active level found");
            console.warn("[DEBUG] Available properties:", gameplayManager ? Object.keys(gameplayManager) : "gameplayManager is null");
            return;
        }

        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            console.warn("[DEBUG] No microEventManager found");
            return;
        }

        const levelId = level.levelDataComposite?.levelHeaderData?.levelId || "level0";
        replayLog("[DEBUG] Level ID:", levelId);

        const allEvents = microEventManager.getMicroEventsByLevelId(levelId);
        replayLog("[DEBUG] Total events found:", allEvents.length);

        const stardustEvents = allEvents.filter(e =>
            e.microEventCategory === "pickup" &&
            e.microEventValue !== "heart" &&
            !e.microEventNickname?.includes("Heart")
        );

        replayLog(`[DEBUG] Found ${stardustEvents.length} stardust events`);

        let toggledCount = 0;
        let skippedNoModel = 0;

        for (const event of stardustEvents) {
            replayLog(`[DEBUG] Processing event: ${event.microEventNickname}`);
            replayLog(`[DEBUG]   - Has positioned object: ${!!event.microEventPositionedObject}`);
            replayLog(`[DEBUG]   - Has model: ${!!event.microEventPositionedObject?.model}`);

            if (event.microEventPositionedObject?.model) {
                const posObj = event.microEventPositionedObject;
                const model = posObj.model;

                replayLog(`[DEBUG]   - Model type: ${model.constructor.name}`);

                // Get all meshes
                const meshes = [];
                if (model.meshes && Array.isArray(model.meshes)) {
                    meshes.push(...model.meshes);
                    replayLog(`[DEBUG]   - Found ${model.meshes.length} meshes in model.meshes`);
                }
                if (typeof model.getChildMeshes === "function") {
                    const childMeshes = model.getChildMeshes();
                    meshes.push(...childMeshes);
                    replayLog(`[DEBUG]   - Found ${childMeshes.length} child meshes`);
                }
                if (model instanceof BABYLON.Mesh || model instanceof BABYLON.AbstractMesh) {
                    meshes.push(model);
                    replayLog(`[DEBUG]   - Model itself is a mesh`);
                }

                replayLog(`[DEBUG]   - Total meshes: ${meshes.length}`);

                if (meshes.length === 0) {
                    replayLog(`[DEBUG]   - No meshes found for ${event.microEventNickname}!`);
                    skippedNoModel++;
                    continue;
                }

                // Toggle visibility
                const currentVisibility = meshes[0].isVisible;
                const newVisibility = !currentVisibility;

                replayLog(`[DEBUG]   - Current visibility: ${currentVisibility}`);
                replayLog(`[DEBUG]   - New visibility: ${newVisibility}`);

                meshes.forEach((mesh, idx) => {
                    replayLog(`[DEBUG]   - Setting mesh ${idx} visibility to ${newVisibility}`);
                    mesh.isVisible = newVisibility;
                    if (mesh.setEnabled) {
                        mesh.setEnabled(newVisibility);
                    }
                });

                toggledCount++;
                replayLog(`[DEBUG]   ✓ Toggled visibility for ${event.microEventNickname}`);
            } else {
                skippedNoModel++;
                replayLog(`[DEBUG]   ✗ Skipped ${event.microEventNickname} - no model`);
            }
        }

        replayLog(`[DEBUG] ═══════════════════════════════════`);
        replayLog(`[DEBUG] Visibility toggle complete:`);
        replayLog(`[DEBUG]   - Toggled: ${toggledCount} stardust items`);
        replayLog(`[DEBUG]   - Skipped (no model): ${skippedNoModel}`);
        replayLog(`[DEBUG] ═══════════════════════════════════`);
    }

    /**
     * Clears replay state so a fresh replay can be created for the next level.
     * NOTE: This method only cleans up REPLAY-related resources. 
     * It does NOT touch the main gameplay grid or level state.
     */
    resetForNewLevel() {
        replayLog("[REPLAY] Resetting for new level...");

        // Clear perspective shift tracked models
        if (this.perspectiveShiftTracker) {
            this.perspectiveShiftTracker.clearAllTrackedModels();
        }

        // Reset replay state
        this.isReplaying = false;
        this.replayIndex = 0;
        this.replayMovements = [];
        this.replayPickupPositions = [];
        this.replayDamagePositions = [];
        this.replayPickupCount = 0;
        this.replayPlayer = null;

        // Stop tracking to avoid carrying movements between levels
        const movementTracker = FundamentalSystemBridge["movementTracker"];
        if (movementTracker) {
            movementTracker.stopTracking();
        }

        replayLog("[REPLAY] ✓ Reset complete");
    }

    // REMOVED: createDuplicateLevel, cloneLevelDataComposite, generateDuplicateGrid
    // Replay now uses the same board with visibility toggling

    /**
     * Registers a model with the perspective shift tracker if it has perspective shift configuration
     * @param {PositionedObject} positionedObject - The positioned object containing the model
     * @param {string} assetName - The asset name
     */
    registerModelForPerspectiveShift(positionedObject, assetName) {
        replayLog(`[REPLAY]   >>> registerModelForPerspectiveShift called for: ${assetName}`);

        if (!positionedObject || !positionedObject.model) {
            replayLog(`[REPLAY]   >>> FAILED: No positioned object or model`);
            return;
        }

        let modelToRegister = positionedObject.model;

        replayLog(`[REPLAY]   >>> Model has position: ${!!modelToRegister.position}`);
        replayLog(`[REPLAY]   >>> Model has scaling: ${!!modelToRegister.scaling}`);

        // If model doesn't have direct transform properties, try to use the first child mesh
        if (!modelToRegister.position || !modelToRegister.scaling) {
            replayLog(`[REPLAY]   >>> Model is a root node, looking for child meshes...`);

            // Try to get meshes from the model
            let meshes = [];
            if (modelToRegister.meshes && Array.isArray(modelToRegister.meshes)) {
                meshes = modelToRegister.meshes;
            } else if (typeof modelToRegister.getChildMeshes === "function") {
                meshes = modelToRegister.getChildMeshes();
            }

            if (meshes.length > 0) {
                // Find the first mesh with transform properties
                const meshWithTransform = meshes.find(m => m.position && m.scaling);
                if (meshWithTransform) {
                    modelToRegister = meshWithTransform;
                    replayLog(`[REPLAY]   >>> Using child mesh instead (has transform properties)`);
                } else {
                    replayLog(`[REPLAY]   >>> FAILED: No child meshes have transform properties`);
                    return;
                }
            } else {
                replayLog(`[REPLAY]   >>> FAILED: No child meshes found`);
                return;
            }
        }

        // Get asset config
        const assetConfig = AssetManifestOverrides.getConfig(assetName);
        replayLog(`[REPLAY]   >>> Asset config hasPerspectiveShift: ${assetConfig.hasPerspectiveShift}`);

        // Register with perspective shift tracker if it has perspective shifts
        if (assetConfig.hasPerspectiveShift) {
            replayLog(`[REPLAY]   >>> REGISTERING with perspective shift tracker`);
            this.perspectiveShiftTracker.registerModel(
                modelToRegister,
                assetName,
                assetConfig,
                positionedObject
            );
        } else {
            replayLog(`[REPLAY]   >>> SKIPPED: Asset has no perspective shift config`);
        }
    }

    /**
     * Resets all level items to initial state for replay
     * - Pickups (hearts, stardust): Restored to VISIBLE, marked as NOT completed
     * - Damage (spikes): Reset flags, remain VISIBLE (never hidden)
     * This allows the same event system to trigger again during replay
     * @param {ActiveGameplayLevel} level - The level whose items should be reset
     */
    resetLevelItemsVisibility(level) {
        replayLog("[REPLAY] Resetting level items to initial state for replay...");

        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            console.warn("[REPLAY] MicroEventManager not found");
            return;
        }

        const levelId = level.levelDataComposite?.levelHeaderData?.levelId || "level0";
        const allEvents = microEventManager.getMicroEventsByLevelId(levelId);

        replayLog(`[REPLAY] Processing ${allEvents.length} events for visibility reset`);

        let resetCount = 0;
        let skippedNoPositionedObject = 0;
        let skippedNoModel = 0;
        let damageEventsReset = 0;

        for (const event of allEvents) {
            // Reset completion status for ALL events
            if (event.microEventCompletionStatus) {
                event.microEventCompletionStatus = false;
                replayLog(`[REPLAY] Reset completion for: ${event.microEventNickname} (${event.microEventCategory})`);
            }

            // DON'T hide spike traps - they should remain visible
            // Only restore visibility for pickups (hearts and stardust)
            const shouldRestoreVisibility = event.microEventCategory === "pickup";

            if (!event.microEventPositionedObject) {
                skippedNoPositionedObject++;
                continue;
            }

            if (!event.microEventPositionedObject.model) {
                skippedNoModel++;
                replayLog(`[REPLAY] No model for: ${event.microEventNickname} (${event.microEventCategory})`);
                continue;
            }

            // Restore visibility for pickups only
            if (shouldRestoreVisibility) {
                // Use the restoreModel method if available (cleaner approach)
                if (typeof event.microEventPositionedObject.restoreModel === 'function') {
                    replayLog(`[REPLAY] Restoring visibility via restoreModel() for: ${event.microEventNickname}`);
                    event.microEventPositionedObject.restoreModel();
                    resetCount++;
                } else {
                    // Fallback: manually restore visibility
                    const model = event.microEventPositionedObject.model;
                    replayLog(`[REPLAY] Manually restoring visibility for: ${event.microEventNickname}`);

                    if (model.isVisible !== undefined) {
                        model.isVisible = true;
                    }
                    if (model.setEnabled) {
                        model.setEnabled(true);
                    }

                    // If model has child meshes, make them visible too
                    if (model.getChildMeshes) {
                        model.getChildMeshes().forEach(mesh => {
                            if (mesh.isVisible !== undefined) {
                                mesh.isVisible = true;
                            }
                            if (mesh.setEnabled) {
                                mesh.setEnabled(true);
                            }
                        });
                    }
                    resetCount++;
                }
            }

            // Reset damage event flags (spikes stay visible but can damage again)
            if (event.microEventCategory === "damage") {
                event.hasTriggeredThisMovement = false;
                damageEventsReset++;
                replayLog(`[REPLAY] Reset damage flag for: ${event.microEventNickname}`);
            }
        }

        replayLog(`[REPLAY] ✓ Visibility reset complete:`);
        replayLog(`[REPLAY]   - ${resetCount} pickup items restored to visible`);
        replayLog(`[REPLAY]   - ${damageEventsReset} damage events reset (spikes remain visible)`);
        replayLog(`[REPLAY]   - ${skippedNoPositionedObject} items had no positioned object`);
        replayLog(`[REPLAY]   - ${skippedNoModel} items had no model reference`);
    }

    /**
     * Registers original level items for perspective shift tracking
     * @param {ActiveGameplayLevel} level - The level whose items should be registered
     */
    registerLevelItemsForPerspectiveShift(level) {
        replayLog("[REPLAY] Registering original level items for perspective shift...");

        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            console.warn("[REPLAY] MicroEventManager not found");
            return;
        }

        const levelId = level.levelDataComposite?.levelHeaderData?.levelId || "level0";
        const allEvents = microEventManager.getMicroEventsByLevelId(levelId);

        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);
        replayLog(`[REPLAY] REGISTERING ITEMS FOR PERSPECTIVE SHIFT`);
        replayLog(`[REPLAY] Level ID: ${levelId}`);
        replayLog(`[REPLAY] Found ${allEvents.length} total events to check`);
        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);

        let registeredCount = 0;
        let skippedNoModel = 0;
        let skippedNoAsset = 0;
        let skippedNoPositionedObject = 0;

        for (const event of allEvents) {
            replayLog(`[REPLAY] Checking event: ${event.microEventNickname} (${event.microEventCategory})`);

            if (!event.microEventPositionedObject) {
                skippedNoPositionedObject++;
                replayLog(`[REPLAY]   ✗ No positioned object`);
                continue;
            }

            if (event.microEventPositionedObject) {
                const positionedObject = event.microEventPositionedObject;
                replayLog(`[REPLAY]   ✓ Has positioned object`);

                // Determine asset name based on event type
                let assetName = positionedObject.modelName || null;

                // If no model name, try to infer from event
                if (!assetName) {
                    if (event.microEventValue === "heart" || event.microEventNickname?.includes("Heart")) {
                        assetName = "testHeartRed";
                    } else if (event.microEventCategory === "pickup") {
                        assetName = "lotus"; // stardust
                    } else if (event.microEventCategory === "damage") {
                        assetName = "testStarSpike"; // spike trap
                    }
                }

                replayLog(`[REPLAY]   Asset name: ${assetName || 'NONE'}`);

                if (!assetName) {
                    skippedNoAsset++;
                    replayLog(`[REPLAY]   ✗ No asset name - SKIPPING`);
                    continue;
                }

                replayLog(`[REPLAY]   Model reference: ${positionedObject.model ? 'EXISTS' : 'NULL'}`);
                if (positionedObject.model) {
                    replayLog(`[REPLAY]   Model type: ${positionedObject.model.constructor.name}`);

                    // Check actual mesh visibility, not root model visibility
                    const meshes = [];
                    if (positionedObject.model.meshes && Array.isArray(positionedObject.model.meshes)) {
                        meshes.push(...positionedObject.model.meshes);
                    }
                    if (typeof positionedObject.model.getChildMeshes === "function") {
                        meshes.push(...positionedObject.model.getChildMeshes());
                    }
                    if (positionedObject.model instanceof BABYLON.Mesh || positionedObject.model instanceof BABYLON.AbstractMesh) {
                        meshes.push(positionedObject.model);
                    }

                    if (meshes.length > 0) {
                        const firstMeshVisible = meshes[0].isVisible;
                        replayLog(`[REPLAY]   First mesh isVisible: ${firstMeshVisible} (${meshes.length} total meshes)`);
                    } else {
                        replayLog(`[REPLAY]   No meshes found in model!`);
                    }
                }

                if (!positionedObject.model) {
                    skippedNoModel++;
                    replayLog(`[REPLAY]   ✗ No model reference - SKIPPING`);
                    continue;
                }

                // Register immediately (no async needed - models should be loaded by now)
                replayLog(`[REPLAY]   ✓ REGISTERING ${assetName} for ${event.microEventNickname}`);
                this.registerModelForPerspectiveShift(positionedObject, assetName);
                registeredCount++;
            }
        }

        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);
        replayLog(`[REPLAY] PERSPECTIVE SHIFT REGISTRATION COMPLETE (MICROEVENTS)`);
        replayLog(`[REPLAY]   ✓ Registered: ${registeredCount} items`);
        replayLog(`[REPLAY]   ✗ Skipped (no positioned object): ${skippedNoPositionedObject}`);
        replayLog(`[REPLAY]   ✗ Skipped (no model reference): ${skippedNoModel}`);
        replayLog(`[REPLAY]   ✗ Skipped (no asset name): ${skippedNoAsset}`);
        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);
    }

    /**
     * Registers obstacles for perspective shift tracking (mountains, rocks, etc.)
     * @param {ActiveGameplayLevel} level - The level whose obstacles should be registered
     */
    registerObstaclesForPerspectiveShift(level) {
        replayLog("[REPLAY] ═══════════════════════════════════════════════");
        replayLog("[REPLAY] REGISTERING OBSTACLES FOR PERSPECTIVE SHIFT");
        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);

        // Get obstacles from level (they're separate from microevents)
        let obstacles = [];

        if (level.obstacles && Array.isArray(level.obstacles)) {
            obstacles = level.obstacles;
        } else if (level.levelDataComposite?.obstacles) {
            obstacles = level.levelDataComposite.obstacles;
        } else if (level.levelMap?.obstacles) {
            obstacles = level.levelMap.obstacles;
        }

        replayLog(`[REPLAY] Found ${obstacles.length} obstacles to check`);

        let registeredCount = 0;
        let skippedNoPositionedObject = 0;
        let skippedNoModel = 0;
        let skippedNoAsset = 0;

        for (const obstacle of obstacles) {
            replayLog(`[REPLAY] Checking obstacle: ${obstacle.nickname || 'unnamed'}`);

            if (!obstacle.positionedObject) {
                skippedNoPositionedObject++;
                replayLog(`[REPLAY]   ✗ No positioned object`);
                continue;
            }

            const positionedObject = obstacle.positionedObject;
            replayLog(`[REPLAY]   ✓ Has positioned object`);

            // Get asset name from the positioned object's modelId
            const assetName = positionedObject.modelId || obstacle.obstacleArchetype;
            replayLog(`[REPLAY]   Asset name: ${assetName || 'NONE'}`);

            if (!assetName) {
                skippedNoAsset++;
                replayLog(`[REPLAY]   ✗ No asset name - SKIPPING`);
                continue;
            }

            replayLog(`[REPLAY]   Model reference: ${positionedObject.model ? 'EXISTS' : 'NULL'}`);
            if (positionedObject.model) {
                replayLog(`[REPLAY]   Model type: ${positionedObject.model.constructor.name}`);

                // Check actual mesh visibility
                const meshes = [];
                if (positionedObject.model.meshes && Array.isArray(positionedObject.model.meshes)) {
                    meshes.push(...positionedObject.model.meshes);
                }
                if (typeof positionedObject.model.getChildMeshes === "function") {
                    meshes.push(...positionedObject.model.getChildMeshes());
                }

                if (meshes.length > 0) {
                    const firstMeshVisible = meshes[0].isVisible;
                    replayLog(`[REPLAY]   First mesh isVisible: ${firstMeshVisible} (${meshes.length} total meshes)`);
                }
            }

            if (!positionedObject.model) {
                skippedNoModel++;
                replayLog(`[REPLAY]   ✗ No model reference - SKIPPING`);
                continue;
            }

            // Register the obstacle
            replayLog(`[REPLAY]   ✓ REGISTERING ${assetName} for ${obstacle.nickname || 'unnamed'}`);
            this.registerModelForPerspectiveShift(positionedObject, assetName);
            registeredCount++;
        }

        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);
        replayLog(`[REPLAY] PERSPECTIVE SHIFT REGISTRATION COMPLETE (OBSTACLES)`);
        replayLog(`[REPLAY]   ✓ Registered: ${registeredCount} obstacles`);
        replayLog(`[REPLAY]   ✗ Skipped (no positioned object): ${skippedNoPositionedObject}`);
        replayLog(`[REPLAY]   ✗ Skipped (no model reference): ${skippedNoModel}`);
        replayLog(`[REPLAY]   ✗ Skipped (no asset name): ${skippedNoAsset}`);
        replayLog(`[REPLAY] ═══════════════════════════════════════════════`);
    }


    // REMOVED: createDuplicatePlayer
    // Replay now uses the original player on the same board

    /**
     * Starts the replay sequence
     * 
     * HOW IT WORKS:
     * - Uses the SAME board, SAME player, SAME event system as normal gameplay
     * - Resets all pickup items (hearts, stardust) to visible and completable
     * - Spikes remain visible and can damage again
     * - Disables player controls (movement is automated from recorded path)
     * - Switches camera from overhead to behind-player (3D view)
     * - Applies perspective shifts to models (hearts rotate to show 3D profile)
     * - Replays the exact movement path taken during the winning run
     * 
     * @param {ActiveGameplayLevel} originalLevel - The level (reused, not duplicated)
     * @param {PlayerUnit} originalPlayer - The player (reused, not duplicated)
     * @param {MovementTracker} movementTracker - The movement tracker with recorded moves
     */
    async startReplay(originalLevel, originalPlayer, movementTracker) {
        if (this.isReplaying) {
            console.warn("[REPLAY] Replay already in progress");
            return;
        }

        replayLog("[REPLAY] ═══════════════════════════════════════════════════════");
        replayLog("[REPLAY] STARTING REPLAY SEQUENCE");
        replayLog("[REPLAY] - Using SAME board (no duplication)");
        replayLog("[REPLAY] - Using SAME player (controls disabled)");
        replayLog("[REPLAY] - Using SAME event system (items reset)");
        replayLog("[REPLAY] ═══════════════════════════════════════════════════════");

        // Restore player health to full before replay
        if (originalPlayer && originalPlayer.playerStatusComposite) {
            replayLog("[REPLAY] Restoring player health to full before replay...");
            originalPlayer.playerStatusComposite.restoreHealthToFull();

            // Lock experience gain during replay to prevent XP from stardust pickups
            originalPlayer.playerStatusComposite.lockExperienceGain();

            // Update heart socket bar UI to reflect full health
            const heartSocketBar = FundamentalSystemBridge["heartSocketBar"];
            if (heartSocketBar) {
                heartSocketBar.setCurrentHearts(originalPlayer.playerStatusComposite.maximumHealthPoints);
                replayLog(`[REPLAY] Heart socket bar updated to ${originalPlayer.playerStatusComposite.maximumHealthPoints} hearts`);
            }
        }

        // Reset original level items visibility (hearts, pickups, spikes back to visible)
        replayLog("[REPLAY] Resetting original level items for replay...");
        this.resetLevelItemsVisibility(originalLevel);

        // Register original level items for perspective shift (microevents: hearts, stardust, spikes)
        this.registerLevelItemsForPerspectiveShift(originalLevel);

        // Register obstacles for perspective shift (mountains, rocks, etc.)
        this.registerObstaclesForPerspectiveShift(originalLevel);

        // NO DUPLICATE LEVEL OR PLAYER - using original level and player
        replayLog("[REPLAY] Using original level and player (no duplicates)");

        // Verify player and its movement manager
        if (!originalPlayer || !originalPlayer.playerMovementManager) {
            console.error("[REPLAY] Original player has no movement manager - aborting replay");
            return;
        }

        // Get movements, pickup positions, and damage positions
        this.replayMovements = movementTracker.getMovements();
        this.replayPickupPositions = movementTracker.getPickupPositions();
        this.replayDamagePositions = movementTracker.getDamagePositions();

        replayLog(`[REPLAY] Replay data loaded: ${this.replayMovements.length} movements, ${this.replayPickupPositions.length} pickups, ${this.replayDamagePositions.length} damage events`);

        if (this.replayMovements.length === 0) {
            console.warn("[REPLAY] No movements recorded! Replay will be empty.");
        }

        // Reset player to starting position (7, 0.25, 7)
        const startPosition = new BABYLON.Vector3(7, 0.25, 7);
        originalPlayer.playerMovementManager.setPositionRelocateModelInstantly(startPosition);
        replayLog(`[REPLAY] Player reset to starting position: (7, 0.25, 7)`);

        // Verify player model exists
        const playerModel = originalPlayer.playerMovementManager.getPlayerModelDirectly();
        if (!playerModel) {
            console.error("[REPLAY] Player model not found!");
        } else {
            replayLog("[REPLAY] Player model exists and is ready");
        }

        // Switch camera to follow player from behind
        replayLog("[REPLAY] Switching camera to replay view...");
        await this.switchCameraToReplayView(originalLevel, originalPlayer);

        // Start loading next level in the background
        // DISABLED: Sequential level loader disabled to fix base game tiles
        // this.startLoadingNextLevelInBackground(originalLevel);

        // Start replaying movements
        replayLog("[REPLAY] Starting movement replay sequence...");
        this.isReplaying = true;
        this.replayIndex = 0;
        this.replayPlayer = originalPlayer; // Store reference for end-of-frame checking

        await this.replayMovementsSequence(originalLevel, originalPlayer);
    }

    /**
     * Switches camera to follow the player from behind (3D replay view)
     * @param {ActiveGameplayLevel} level - The level
     * @param {PlayerUnit} player - The player to follow
     */
    async switchCameraToReplayView(level, player) {
        replayLog("[REPLAY] Switching camera to replay view...");

        const scene = level.hostingScene;

        // Get the player model
        let playerModel = player.playerMovementManager.getPlayerModelDirectly();

        if (!playerModel) {
            // Try to get the model from the positioned object directly
            const positionedObject = player.playerMovementManager.getPlayerModelPositionedObject();
            if (positionedObject && positionedObject.model) {
                playerModel = positionedObject.model;
                replayLog("[REPLAY] Found player model via positioned object");
            } else {
                console.error("[REPLAY] Could not find player model, aborting camera switch");
                return;
            }
        }

        // Handle case where model might be a root node with child meshes
        // If it's not a direct mesh, try to get the first child mesh or the root itself
        if (!(playerModel instanceof BABYLON.AbstractMesh)) {
            if (playerModel.getChildMeshes && playerModel.getChildMeshes().length > 0) {
                // Use the first child mesh as the target
                const childMeshes = playerModel.getChildMeshes();
                playerModel = childMeshes.find(m => m instanceof BABYLON.Mesh) || childMeshes[0];
                replayLog("[REPLAY] Using child mesh as camera target");
            } else if (playerModel.meshes && playerModel.meshes.length > 0) {
                // Use the first mesh from the meshes array
                playerModel = playerModel.meshes[0];
                replayLog("[REPLAY] Using first mesh from meshes array as camera target");
            }
        }

        // Create a follow camera positioned behind the player
        const followCamera = new BABYLON.FollowCamera(
            "replayFollowCamera",
            new BABYLON.Vector3(0, 0, 0),
            scene
        );

        followCamera.lockedTarget = playerModel;
        followCamera.radius = 8; // Distance behind the player
        followCamera.heightOffset = 3; // Height above the player
        followCamera.rotationOffset = 0; // Behind the player (0 degrees)
        followCamera.cameraAcceleration = 0.1;
        followCamera.maxCameraSpeed = 2;

        // Set as active camera
        scene.activeCamera = followCamera;
        level.cameraManager.currentCamera = followCamera;

        // Dispose old camera
        const oldCamera = FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[scene];
        if (oldCamera && oldCamera !== followCamera) {
            replayLog("[REPLAY] Disposing old camera...");
            FundamentalSystemBridge["renderSceneSwapper"].disposeAndDeleteCamera(oldCamera);
        }

        FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[scene] = followCamera;

        replayLog("[REPLAY] ✓ Camera switched to replay view (following player)");

        // Trigger perspective shift for all registered models (instant transition)
        if (this.perspectiveShiftTracker) {
            const trackedCount = this.perspectiveShiftTracker.getTrackedModelCount();
            replayLog("[REPLAY] ═══════════════════════════════════════════════════════");
            replayLog("[REPLAY] PERSPECTIVE SHIFT TRIGGERED");
            replayLog(`[REPLAY] - Camera changed from OVERHEAD to BEHIND-PLAYER (3D)`);
            replayLog(`[REPLAY] - ${trackedCount} model(s) will transform instantly (0ms)`);
            replayLog(`[REPLAY] - Models will show 3D profile instead of overhead view`);
            replayLog("[REPLAY] ═══════════════════════════════════════════════════════");
            this.perspectiveShiftTracker.switchToPerspectiveShift(0); // Instant transition to match camera switch
            replayLog("[REPLAY] ✓ Perspective shift complete");
        }
    }

    /**
     * Replays the movement sequence using the original player on the same board
     * @param {ActiveGameplayLevel} level - The level
     * @param {PlayerUnit} player - The player to animate
     */
    async replayMovementsSequence(level, player) {
        replayLog("[REPLAY] ▶ Starting movement replay sequence...");
        const scene = level.hostingScene;
        this.replayPickupCount = 0;

        // NOTE: No need to start interval - pickups and damage are checked via end-of-frame tick
        replayLog("[REPLAY] Pickup/damage detection will use core engine end-of-frame tick");

        replayLog(`[REPLAY] Replaying ${this.replayMovements.length} movements...`);

        try {
            for (let i = 0; i < this.replayMovements.length; i++) {
                const movement = this.replayMovements[i];
                replayLog(`[REPLAY] Movement ${i + 1}/${this.replayMovements.length}: ${movement.startPosition.x},${movement.startPosition.z} → ${movement.destinationPosition.x},${movement.destinationPosition.z}`);

                // Use original positions (no offset - same board at x=0)
                const adjustedStart = movement.startPosition.clone();
                adjustedStart.y = 0.25; // Set y to 0.25 (player height above ground)
                const adjustedDestination = movement.destinationPosition.clone();
                adjustedDestination.y = 0.25; // Set y to 0.25 (player height above ground)

                replayLog(`[REPLAY] Using positions (same board): (${adjustedStart.x},${adjustedStart.y},${adjustedStart.z}) → (${adjustedDestination.x},${adjustedDestination.y},${adjustedDestination.z})`);

                // Verify player exists
                if (!player) {
                    console.error("[REPLAY] Player is null! Cannot replay movement.");
                    break;
                }

                // Schedule predictive explosions for this replay movement
                // Replay uses fixed 500ms duration, so calculate effective speed
                const distance = BABYLON.Vector3.Distance(adjustedStart, adjustedDestination);
                const replayDurationSeconds = 0.5; // 500ms
                const effectiveSpeed = distance / replayDurationSeconds; // units per second

                const predictiveExplosionManager = FundamentalSystemBridge["predictiveExplosionManager"];
                if (predictiveExplosionManager) {
                    predictiveExplosionManager.predictAndScheduleExplosions(
                        player,
                        adjustedStart,
                        adjustedDestination,
                        effectiveSpeed,
                        GameplayEndOfFrameCoordinator.frameCounter
                    );
                }

                // Use smooth interpolated movement instead of the standard movement system
                await this.animatePlayerMovement(player, adjustedStart, adjustedDestination);
                replayLog(`[REPLAY] Movement ${i + 1} complete`);
            }

            // If we collected 4 pickups, trigger explosion
            if (this.replayPickupCount >= 4) {
                replayLog("[REPLAY] Collected all 4 pickups, triggering end of level explosion");
                await this.triggerEndOfLevelExplosion(scene);
            } else {
                replayLog(`[REPLAY] Replay complete with ${this.replayPickupCount}/4 pickups collected`);
            }
        } catch (error) {
            console.error("[REPLAY] Error during replay sequence:", error);
        } finally {
            // Unlock experience gain after replay
            const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
            const player = gameplayManager?.primaryActivePlayer;
            if (player && player.playerStatusComposite) {
                player.playerStatusComposite.unlockExperienceGain();
            }

            // Clear replay state
            this.isReplaying = false;
            this.replayPlayer = null;
            replayLog("[REPLAY] ✓ Replay sequence complete");

            // Transition to WorldLoaderScene (placeholder transition scene)
            replayLog("[REPLAY] Transitioning to WorldLoaderScene...");
            const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
            if (renderSceneSwapper) {
                renderSceneSwapper.setActiveGameLevelScene("WorldLoaderScene");
                replayLog("[REPLAY] ✓ Successfully transitioned to WorldLoaderScene");
            } else {
                console.error("[REPLAY] RenderSceneSwapper not found, cannot transition");
            }
        }
    }

    /**
     * Animates player movement smoothly from start to destination using frame-by-frame interpolation
     * @param {PlayerUnit} player - The player to animate
     * @param {BABYLON.Vector3} startPosition - Starting position
     * @param {BABYLON.Vector3} destinationPosition - Ending position
     * @returns {Promise<void>}
     */
    async animatePlayerMovement(player, startPosition, destinationPosition) {
        return new Promise((resolve) => {
            const duration = 500; // Movement duration in milliseconds (0.5 seconds per move)
            const startTime = Date.now();

            // Calculate total distance for speed calculation
            const distance = BABYLON.Vector3.Distance(startPosition, destinationPosition);
            replayLog(`[REPLAY] Animating movement over ${duration}ms, distance: ${distance.toFixed(2)}`);

            const animateFrame = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1.0); // Clamp to [0, 1]

                // Use easeInOutQuad for smooth acceleration/deceleration
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                // Interpolate position
                const currentPosition = BABYLON.Vector3.Lerp(startPosition, destinationPosition, eased);

                // Update player position directly (bypass movement manager to avoid conflicts)
                player.playerMovementManager.setPositionRelocateModelInstantly(currentPosition);

                // Also update the current position tracker
                player.playerMovementManager.currentPosition = currentPosition.clone();

                // Continue animation or complete
                if (progress < 1.0) {
                    requestAnimationFrame(animateFrame);
                } else {
                    // Ensure we're exactly at destination
                    player.playerMovementManager.setPositionRelocateModelInstantly(destinationPosition);
                    player.playerMovementManager.currentPosition = destinationPosition.clone();
                    replayLog(`[REPLAY] Animation complete at (${destinationPosition.x.toFixed(2)}, ${destinationPosition.y.toFixed(2)}, ${destinationPosition.z.toFixed(2)})`);
                    resolve();
                }
            };

            // Start animation
            requestAnimationFrame(animateFrame);
        });
    }

    // REMOVED: waitForMovementComplete (no longer needed with frame-based animation)

    /**
     * Called by GameplayEndOfFrameCoordinator every frame during replay
     * Checks for pickups and damage based on player position
     */
    onReplayEndOfFrameTick() {
        if (!this.isReplaying || !this.replayPlayer) {
            return;
        }

        this.checkReplayPickups(this.replayPlayer);
        this.checkReplayDamage(this.replayPlayer);
    }

    /**
     * Checks for pickups during replay when the player passes over them
     * Uses the same event system as normal gameplay
     * @param {PlayerUnit} player - The player being replayed
     */
    checkReplayPickups(player) {
        if (!player) {
            return;
        }

        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            return;
        }

        // Get current level's microevents
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const level = gameplayManager?.currentActiveLevel || gameplayManager?.primaryActiveGameplayLevel;
        if (!level) {
            return;
        }

        const levelId = level.levelDataComposite?.levelHeaderData?.levelId;
        if (!levelId) {
            return;
        }

        const allMicroEvents = microEventManager.getMicroEventsByLevelId(levelId);
        if (!allMicroEvents) {
            return;
        }

        // Filter to only incomplete pickup events
        const incompletePickupEvents = allMicroEvents.filter(
            event => event.microEventCategory === "pickup" && !event.microEventCompletionStatus
        );

        // Check each pickup event
        for (const microEvent of incompletePickupEvents) {
            if (!microEvent.microEventLocation) {
                continue;
            }

            // Check if player is near this pickup
            const playerPosition = player.playerMovementManager.currentPosition;
            const collectiblePosition = microEvent.microEventLocation;

            // Calculate absolute distances in x and z dimensions (same logic as CollectiblePlacementManager)
            const dx = collectiblePosition.x - playerPosition.x;
            const dz = collectiblePosition.z - playerPosition.z;
            const absDx = Math.abs(dx);
            const absDz = Math.abs(dz);

            // Pickup occurs if both absolute x and z distances are less than 0.3
            if (absDx < 0.3 && absDz < 0.3) {
                // Player is near the pickup - process it
                this.handleReplayPickup(microEvent);
            }
        }
    }

    /**
     * Checks for damage events during replay when the player passes over them
     * Uses the same event system as normal gameplay
     * @param {PlayerUnit} player - The player being replayed
     */
    checkReplayDamage(player) {
        if (!player) {
            return;
        }

        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            return;
        }

        // Get current level's microevents
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const level = gameplayManager?.currentActiveLevel || gameplayManager?.primaryActiveGameplayLevel;
        if (!level) {
            return;
        }

        const levelId = level.levelDataComposite?.levelHeaderData?.levelId;
        if (!levelId) {
            return;
        }

        const allMicroEvents = microEventManager.getMicroEventsByLevelId(levelId);
        if (!allMicroEvents) {
            return;
        }

        // Filter to only incomplete damage events (spikes that haven't triggered yet)
        const incompleteDamageEvents = allMicroEvents.filter(
            event => event.microEventCategory === "damage" && !event.microEventCompletionStatus
        );

        // Check each damage event
        for (const microEvent of incompleteDamageEvents) {
            if (!microEvent.microEventLocation) {
                continue;
            }

            // Check if player is near this damage trigger
            const playerPosition = player.playerMovementManager.currentPosition;
            const damagePosition = microEvent.microEventLocation;

            // Calculate absolute distances in x and z dimensions
            const dx = damagePosition.x - playerPosition.x;
            const dz = damagePosition.z - playerPosition.z;
            const absDx = Math.abs(dx);
            const absDz = Math.abs(dz);

            // Damage occurs if both absolute x and z distances are less than 0.3
            if (absDx < 0.3 && absDz < 0.3) {
                // Player is near the damage trigger - process it
                this.handleReplayDamage(microEvent);
            }
        }
    }

    /**
     * Handles a damage event detected during replay
     * NOTE: Spikes are NEVER hidden - they remain visible during and after replay
     * @param {MicroEvent} microEvent - The damage microevent
     */
    async handleReplayDamage(microEvent) {
        if (!microEvent || microEvent.microEventCompletionStatus) {
            return; // Already processed
        }

        // Mark as completed to prevent re-processing in this replay pass
        microEvent.markAsCompleted();

        // Get scene
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const level = gameplayManager?.currentActiveLevel || gameplayManager?.primaryActiveGameplayLevel;
        const scene = level?.hostingScene || FundamentalSystemBridge["renderSceneSwapper"]?.allStoredScenes?.["BaseGameScene"];

        replayLog(`[REPLAY DAMAGE] ⚔ Damage detected! Position: ${microEvent.microEventLocation.x}, ${microEvent.microEventLocation.y}, ${microEvent.microEventLocation.z}`);

        // Play damage sound (BEFORE damage to match normal gameplay timing)
        try {
            SoundEffectsManager.playSound("magicWallBreak", scene); // Fire-and-forget for immediate playback
            replayLog(`[REPLAY DAMAGE] Playing magic wall break sound`);
        } catch (error) {
            replayLog(`[REPLAY DAMAGE] Error playing magic wall break sound:`, error);
        }

        // Deal 1 damage to the player (updates health and UI)
        const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
        if (playerStatusTracker && playerStatusTracker.damagePlayer) {
            replayLog(`[REPLAY DAMAGE] Calling damagePlayer(1)...`);
            const resultingHealth = playerStatusTracker.damagePlayer(1);
            replayLog(`[REPLAY DAMAGE] ✓ Player damaged. Resulting health: ${resultingHealth}`);
        } else {
            replayLog(`[REPLAY DAMAGE] ✗ PlayerStatusTracker not available`);
        }

        // NOTE: Explosion effects are handled by PredictiveExplosionManager for perfect timing
    }

    /**
     * Handles a pickup detected during replay
     * @param {MicroEvent} microEvent - The pickup microevent
     */
    async handleReplayPickup(microEvent) {
        if (!microEvent || microEvent.microEventCompletionStatus) {
            return; // Already processed
        }

        // Mark as completed to prevent re-processing
        microEvent.markAsCompleted();

        // Get scene
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const level = gameplayManager?.currentActiveLevel || gameplayManager?.primaryActiveGameplayLevel;
        const scene = level?.hostingScene || FundamentalSystemBridge["renderSceneSwapper"]?.allStoredScenes?.["BaseGameScene"];

        // Determine if this is a heart or stardust
        const isHeart = microEvent.microEventValue === "heart" || microEvent.microEventNickname?.includes("Heart");

        if (isHeart) {
            replayLog(`[REPLAY] ❤ Heart pickup detected! Position: ${microEvent.microEventLocation.x}, ${microEvent.microEventLocation.y}, ${microEvent.microEventLocation.z}`);

            // Heal the player by 1 heart (updates health and UI)
            const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
            if (playerStatusTracker && playerStatusTracker.healPlayer) {
                replayLog(`[REPLAY] Calling healPlayer(1)...`);
                const resultingHealth = playerStatusTracker.healPlayer(1);
                replayLog(`[REPLAY] ✓ Player healed. Resulting health: ${resultingHealth}`);
            } else {
                replayLog(`[REPLAY] ✗ PlayerStatusTracker not available`);
            }

            // Play healing sound
            try {
                SoundEffectsManager.playSound("healthRestoration", scene); // Fire-and-forget for immediate playback
                replayLog(`[REPLAY] Playing health restoration sound`);
            } catch (error) {
                replayLog(`[REPLAY] Error playing health restoration sound:`, error);
            }

            // NOTE: Explosion effects are handled by PredictiveExplosionManager for perfect timing
        } else {
            // Stardust pickup
            this.replayPickupCount++;
            replayLog(`[REPLAY] ✨ Stardust pickup detected! Count: ${this.replayPickupCount}, Position: ${microEvent.microEventLocation.x}, ${microEvent.microEventLocation.y}, ${microEvent.microEventLocation.z}`);

            // NOTE: Stardust does NOT grant experience during replay (matching intended behavior)
            // Normal gameplay grants 1 XP per stardust, but replay bypasses this for visual-only playback

            // Play pickup sound
            await this.playPickupSoundForReplay(this.replayPickupCount, scene);
        }

        // Hide the model instead of disposing it
        if (microEvent.microEventPositionedObject) {
            const positionedObject = microEvent.microEventPositionedObject;
            if (positionedObject.model) {
                // Set model invisible
                if (positionedObject.model.isVisible !== undefined) {
                    positionedObject.model.isVisible = false;
                } else if (positionedObject.model.setEnabled) {
                    positionedObject.model.setEnabled(false);
                }

                // Hide child meshes too
                if (positionedObject.model.getChildMeshes) {
                    positionedObject.model.getChildMeshes().forEach(mesh => {
                        if (mesh.isVisible !== undefined) {
                            mesh.isVisible = false;
                        }
                    });
                }
                replayLog(`[REPLAY] ✓ Hidden pickup model (not disposed)`);
            }
        }

        // NOTE: Explosion effects are handled by PredictiveExplosionManager for perfect timing
    }


    /**
     * Plays pickup sound for replay
     * @param {number} pickupCount - The pickup count (1-4)
     * @param {BABYLON.Scene} scene - The scene
     */
    async playPickupSoundForReplay(pickupCount, scene) {
        let soundName;
        if (pickupCount === 1) {
            soundName = "streakBonusStart";
        } else if (pickupCount === 2) {
            soundName = "streakBonusCombo";
        } else if (pickupCount === 3) {
            soundName = "streakBonusSuperCombo";
        } else if (pickupCount === 4) {
            soundName = "streakBonusUltimateCombo";
        } else {
            soundName = "streakBonusUltimateCombo";
        }

        try {
            SoundEffectsManager.playSound(soundName, scene); // Fire-and-forget for immediate playback
            //  replayLog(`[REPLAY] Playing pickup sound: ${soundName} for pickup #${pickupCount}`);
        } catch (error) {
            //   replayLog(`[REPLAY] Error playing pickup sound:`, error);
        }
    }

    /**
     * Starts loading the next level in the background
     * @param {ActiveGameplayLevel} currentLevel - The current level
     */
    startLoadingNextLevelInBackground(currentLevel) {
        const sequentialLoader = FundamentalSystemBridge["sequentialLevelLoader"];
        if (!sequentialLoader) {
            console.warn("[REPLAY] SequentialLevelLoader not found, skipping next level preload");
            return;
        }

        // Determine next level URL (for now, use a default or get from level data)
        // TODO: Implement proper level progression system
        const currentLevelId = currentLevel?.levelDataComposite?.levelHeaderData?.levelId || "level0";
        const nextLevelUrl = this.getNextLevelUrl(currentLevelId);

        if (nextLevelUrl) {
            const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
            const currentPlayer = gameplayManager?.primaryActivePlayer;

            if (currentPlayer) {
                sequentialLoader.startLoadingNextLevel(nextLevelUrl, currentPlayer).catch(error => {
                    console.error("[REPLAY] Error starting next level load:", error);
                });
                replayLog("[REPLAY] Started loading next level in background");
            } else {
                console.warn("[REPLAY] Cannot start next level load: current player not found");
            }
        } else {
            console.warn("[REPLAY] Next level URL not determined, skipping preload");
        }
    }

    /**
     * Gets the URL for the next level
     * @param {string} currentLevelId - The current level ID
     * @returns {string|null} The next level URL or null if not found
     */
    getNextLevelUrl(currentLevelId) {
        // For now, use a simple increment pattern
        // TODO: Replace with proper level progression system
        const baseUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/";

        return baseUrl + "level2Test.txt";

        // Try to extract level number and increment
        const match = currentLevelId.match(/(\d+)/);
        if (match) {
            const levelNum = parseInt(match[1]);
            const nextLevelNum = levelNum + 1;
            return `${baseUrl}level${nextLevelNum}Test2.txt`;
        }

        // Fallback: try level1 if current is level0
        if (currentLevelId.includes("level0") || currentLevelId.includes("testLevel0")) {
            return `${baseUrl}level1Test2.txt`;
        }

        return null;
    }

    /**
     * Triggers the end of level explosion effect
     * @param {BABYLON.Scene} scene - The scene
     */
    async triggerEndOfLevelExplosion(scene) {
        // console.log("[REPLAY] Triggering end of level explosion");

        // Play end of level sound
        try {
            SoundEffectsManager.playSound("endOfLevelPerfect", scene); // Fire-and-forget for immediate playback
        } catch (error) {
            //  replayLog(`[REPLAY] Error playing endOfLevelPerfect sound:`, error);
        }

        // Trigger explosion effect
        const effectGenerator = new EffectGenerator();
        effectGenerator.explosionEffect({
            type: 'magic',
            intensity: 1.5,
            duration: 5.0
        }).catch(error => {
            // replayLog(`[REPLAY] Error triggering explosion effect:`, error);
        });
    }
}

