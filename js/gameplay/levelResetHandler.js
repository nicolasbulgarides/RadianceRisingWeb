/**
 * LevelResetHandler
 * 
 * Handles player death and level reset logic.
 * - Plays death sound and effects
 * - Resets player position and health
 * - Clears and re-instantiates microevents (spike traps, hearts, stardust)
 * - Resets the replay system
 */
class LevelResetHandler {
    constructor() {
        this.isResetting = false;
        this.playerDiedThisAttempt = false; // Track if player died (prevents replay)
        this.hasEverDied = false; // Track if player has EVER died (persists across resets, prevents ghost models)
    }

    /**
     * Handles the player death sequence
     * DISABLED FOR DEBUGGING
     */
    async handlePlayerDeath() {
        if (this.isResetting) {
            console.log("[DEATH] Already resetting, ignoring duplicate death call");
            return;
        }

        this.isResetting = true;
        this.playerDiedThisAttempt = true; // Mark that player died (prevents replay)
        this.hasEverDied = true; // Mark that player has died at least once (persists, prevents ghost models)

        try {
            // Step 0: Store player position IMMEDIATELY before anything else
            const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
            const activePlayer = gameplayManager?.primaryActivePlayer;
            const playerModel = activePlayer?.getPlayerModelDirectly?.();
            const deathPosition = playerModel?.position ? playerModel.position.clone() : null;

            // Step 1: Immediately stop player movement
            this.stopPlayerMovement();

            // Step 2: Play death sound
            await this.playDeathSound();

            // Step 3: Play red explosion effect at stored position
            if (deathPosition) {
                this.playDeathExplosionAtPosition(deathPosition);
            } else {
                console.warn("[DEATH] Could not get death position for explosion");
            }

            // Step 5: Reset the level
            await this.resetLevel();

        } catch (error) {
            console.error("[DEATH] !!!ERROR during death sequence:", error);
        } finally {
            this.isResetting = false;
        }
    }

    /**
     * Immediately stops player movement
     */
    stopPlayerMovement() {
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const activePlayer = gameplayManager?.primaryActivePlayer;

        if (!activePlayer || !activePlayer.playerMovementManager) {
            return;
        }

        // Cancel any active movement
        const movementManager = activePlayer.playerMovementManager;
        if (movementManager.movementActive) {
            movementManager.movementActive = false;
            movementManager.cancelCurrentMovement?.();
        }
    }

    /**
     * Delays execution for specified milliseconds
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Plays the character failure sound
     */
    async playDeathSound() {
        const scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
        if (!scene) {
            console.warn("[DEATH] Cannot play death sound: scene not found");
            return;
        }

        try {
            SoundEffectsManager.playSound("characterFailure", scene); // Fire-and-forget for immediate playback
            //console.log("[DEATH] Played characterFailure sound");
        } catch (error) {
            console.error("[DEATH] Error playing death sound:", error);
        }
    }

    /**
     * Plays a red explosion effect at a specific position
     * @param {BABYLON.Vector3} explosionPosition - The position where the explosion should occur
     */
    async playDeathExplosionAtPosition(explosionPosition) {
        try {
            // Normalize / fallback position so the effect still plays even if the initial position is missing
            let position = explosionPosition;

            // If caller passed a plain object with x/y/z, convert it
            if (position && !(position instanceof BABYLON.Vector3) && typeof position.x === "number" && typeof position.y === "number" && typeof position.z === "number") {
                position = new BABYLON.Vector3(position.x, position.y, position.z);
            }

            // If position is still invalid, try to pull the current player model position
            if (!position || !(position instanceof BABYLON.Vector3)) {
                const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
                const fallbackPlayer = gameplayManager?.primaryActivePlayer;
                const fallbackModel = fallbackPlayer?.getPlayerModelDirectly?.();
                const fallbackPos = fallbackModel?.position || fallbackModel?.absolutePosition;
                if (fallbackPos) {
                    position = fallbackPos.clone ? fallbackPos.clone() : new BABYLON.Vector3(fallbackPos.x, fallbackPos.y, fallbackPos.z);
                }
            }

            if (!position || !(position instanceof BABYLON.Vector3)) {
                console.error("[DEATH] Cannot play explosion: invalid position provided");
                return;
            }

            const scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
            if (!scene) {
                console.warn("[DEATH] Cannot play explosion: scene not found");
                return;
            }

            // Create red explosion effect manually (similar to EffectGenerator)
            const maxParticles = 4000; // 2.0 intensity * 2000
            let particleSystem = new BABYLON.ParticleSystem("deathExplosion", maxParticles, scene);

            // Texture
            particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);

            // Set position as emitter
            particleSystem.emitter = position;

            // Explosion shape
            particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);

            // Emission - burst effect
            particleSystem.manualEmitCount = 1000; // 2.0 intensity * 500
            particleSystem.emitRate = 0;

            // Lifetime
            particleSystem.minLifeTime = 0.9; // 0.3 * 3.0
            particleSystem.maxLifeTime = 4.5; // 1.5 * 3.0

            // Size
            particleSystem.minSize = 0.6; // 0.3 * 2.0
            particleSystem.maxSize = 3.0; // 1.5 * 2.0
            particleSystem.minSizeScale = 0.2;
            particleSystem.maxSizeScale = 0.8;

            // Speed
            particleSystem.minEmitPower = 10; // 5 * 2.0
            particleSystem.maxEmitPower = 24; // 12 * 2.0
            particleSystem.updateSpeed = 0.01;

            // Direction - spherical explosion
            particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
            particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

            // Red/orange fire colors
            particleSystem.color1 = new BABYLON.Color4(1.0, 0.8, 0.2, 1.0);
            particleSystem.color2 = new BABYLON.Color4(1.0, 0.3, 0.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0.3, 0.0, 0.0, 0.0);
            particleSystem.gravity = new BABYLON.Vector3(0, -5, 0);

            // Visual effects
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.minAngularSpeed = -2;
            particleSystem.maxAngularSpeed = 2;
            particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;

            // Start the effect
            particleSystem.start();
            //console.log("[DEATH] Started red explosion effect");

            // Clean up after effect duration (4.5s max particle life + 0.1s buffer)
            setTimeout(() => {
                particleSystem.stop();
                particleSystem.dispose();
                //console.log("[DEATH] Explosion effect disposed");
            }, 4600);

        } catch (error) {
            console.error("[DEATH] Error playing explosion effect:", error);
        }
    }

    /**
     * Resets the level - player position, health, microevents, and replay system
     */
    async resetLevel() {
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const activeLevel = gameplayManager?.primaryActiveGameplayLevel;
        const oldPlayer = gameplayManager?.primaryActivePlayer;

        if (!activeLevel || !oldPlayer) {
            console.error("[DEATH] Cannot reset level: active level or player not found");
            return;
        }

        // Reset replay system
        this.resetReplaySystem();

        // Reset microevents (marks them as incomplete so they can be triggered again)
        this.resetMicroEvents(activeLevel);

        // Clear any existing scheduled explosions after death/reset
        if (window.ExplosionScheduler) {
            window.ExplosionScheduler.clearAllScheduledExplosions();
        }
        // Reset pickup progress (stardust count, experience) for fresh level attempt
        this.resetPickupProgress();

        // Instead of recreating the player (which risks ghost copies), stop all movement and teleport to spawn
        this.resetExistingPlayerToSpawn(activeLevel, oldPlayer, gameplayManager);

        // Reset player health to maximum (after reposition)
        this.resetPlayerHealth();

        // Verify the level is properly set as active
        if (gameplayManager.primaryActiveGameplayLevel !== activeLevel) {
            gameplayManager.setActiveGameplayLevel(activeLevel);
        }

        // Ensure lighting is properly initialized (recreates light if it was disposed)
        activeLevel.initializeLevelLighting();

        // Clear death flag - player gets a fresh attempt
        this.playerDiedThisAttempt = false;

        // Clean up any duplicate directional lights that may have accumulated
        this.cleanupDuplicateDirectionalLights(activeLevel.hostingScene);

    }

    /**
     * Resets the replay system - clears tracking data
     */
    resetReplaySystem() {
        const replayManager = FundamentalSystemBridge["levelReplayManager"];
        const movementTracker = FundamentalSystemBridge["movementTracker"];

        // Stop tracking if active
        if (movementTracker && movementTracker.isTracking) {
            movementTracker.stopTracking();
        }

        // Clear all tracked movements, pickups, and damage
        if (movementTracker) {
            movementTracker.clear();
        }

        // Restart tracking for the reset level
        if (movementTracker) {
            movementTracker.startTracking();
        }

        //console.log("[DEATH] Replay system reset");
    }

    /**
     * Moves the existing player back to spawn and resets movement state.
     * CRITICAL: This does NOT create a new player. It only teleports the existing model.
     * @param {ActiveGameplayLevel} activeLevel
     * @param {PlayerUnit} player
     * @param {GameplayManagerComposite} gameplayManager
     */
    resetExistingPlayerToSpawn(activeLevel, player, gameplayManager) {
        if (!player || !player.playerMovementManager) {
            console.warn("[DEATH] Cannot reset player to spawn - missing player or movement manager");
            return;
        }

        const movementManager = player.playerMovementManager;

        // Step 1: Stop any active movement and sounds
        movementManager.resetMovement();
        movementManager.movementActive = false;
        movementManager.pathingDestination = null;
        movementManager.startPosition = null;
        movementManager.endPosition = null;
        movementManager.direction = BABYLON.Vector3.Zero();
        movementManager.movementPerFrame = BABYLON.Vector3.Zero();
        movementManager.totalDistance = 0;
        movementManager.totalFrames = 0;
        movementManager.currentFrame = 0;

        // Step 2: Get spawn position
        const startPosition = this.getPlayerStartPosition(activeLevel);

        // Step 3: Teleport the existing model to spawn (NO new model creation)
        // Update the movement manager's internal position tracking
        movementManager.currentPosition = startPosition.clone();
        movementManager.lastCrossedTileBoundary = startPosition.clone();

        // Move the actual model by setting position on the positioned object
        const positionedObject = movementManager.playerModelPositionedObject;
        if (positionedObject && positionedObject.model) {
            positionedObject.setPosition(startPosition);
        } else {
            console.error("[DEATH] Cannot teleport - positioned object or model is missing!");
        }

        // Step 4: Ensure references are correct (DO NOT call registerCurrentPrimaryPlayer - it adds to array)
        // Just set the reference directly if needed
        if (activeLevel.currentPrimaryPlayer !== player) {
            activeLevel.currentPrimaryPlayer = player; // Direct assignment, no array push
        }
        if (gameplayManager.primaryActivePlayer !== player) {
            gameplayManager.primaryActivePlayer = player;
        }
    }

    /**
     * Remove duplicate directional lights (e.g., SunLight) to prevent brightness accumulation
     * @param {BABYLON.Scene} scene
     */
    cleanupDuplicateDirectionalLights(scene) {
        if (!scene || !scene.lights) return;

        const directionalLights = scene.lights.filter(l => l && l instanceof BABYLON.DirectionalLight);
        if (directionalLights.length <= 1) {
            return;
        }

        // Find the "SunLight" (our main light) and keep it, dispose the rest
        // If no SunLight found, keep the last one (most recently created)
        let lightToKeep = directionalLights.find(l => l.name === "SunLight") || directionalLights[directionalLights.length - 1];

        for (let i = 0; i < directionalLights.length; i++) {
            if (directionalLights[i] !== lightToKeep) {
                try {
                    directionalLights[i].dispose();
                } catch (err) {
                    console.warn("[DEATH] Failed to dispose duplicate directional light:", err);
                }
            }
        }
    }

    /**
     * Resets all microevents for the level (spike traps, hearts, stardust)
     * Marks them as incomplete and makes their models visible again
     */
    resetMicroEvents(activeLevel) {
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) {
            console.warn("[DEATH] MicroEventManager not found");
            return;
        }

        const levelId = activeLevel?.levelDataComposite?.levelHeaderData?.levelId;
        if (!levelId) {
            console.warn("[DEATH] Cannot reset microevents: level ID not found");
            return;
        }

        // Get all microevents for this level
        const allMicroEvents = microEventManager.getMicroEventsByLevelId(levelId);
        if (!allMicroEvents || allMicroEvents.length === 0) {
            return;
        }


        // Reset each microevent
        allMicroEvents.forEach(microEvent => {
            // Mark as incomplete (so it can be triggered again)
            microEvent.markAsIncomplete();

            // Reset damage event flags (for spike traps)
            if (microEvent.microEventCategory === "damage") {
                microEvent.hasTriggeredThisMovement = false;
            }

            // Explosion flags are now managed by PredictiveExplosionManager per movement

            // For pickups (hearts, stardust), restore the model visibility
            if (microEvent.microEventCategory === "pickup" && microEvent.microEventPositionedObject) {
                const positionedObject = microEvent.microEventPositionedObject;

                // If the model was disposed, we need to reload it
                if (!positionedObject.model || !positionedObject.model.meshes) {
                    // Model was disposed, need to reload it
                    this.reloadMicroEventModel(microEvent);
                } else {
                    // Model exists but might be hidden, make it visible
                    if (positionedObject.model.meshes) {
                        positionedObject.model.meshes.forEach(mesh => {
                            if (mesh) {
                                mesh.isVisible = true;
                                mesh.setEnabled(true);
                            }
                        });
                    }
                }
            }
        });
    }

    /**
     * Reloads a microevent's model (for disposed pickups)
     * @param {MicroEvent} microEvent - The microevent to reload
     */
    async reloadMicroEventModel(microEvent) {
        if (!microEvent.microEventPositionedObject) {
            return;
        }

        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"]?.getSceneBuilderForScene("BaseGameScene");
        if (!sceneBuilder) {
            console.warn("[DEATH] SceneBuilder not found, cannot reload microevent model");
            return;
        }

        try {
            // Reload the model using the positioned object
            await sceneBuilder.loadModel(microEvent.microEventPositionedObject);
        } catch (error) {
            console.error(`[DEATH] Error reloading microevent model:`, error);
        }
    }

    /**
     * DEPRECATED: Player recreation is disabled to prevent ghost models.
     * This function now does nothing and logs a warning.
     */
    async recreatePlayer(activeLevel, oldPlayer, gameplayManager) {
        console.error("[DEATH] ⚠️ recreatePlayer was called but is DISABLED. No new player will be created.");
        // DO NOTHING - player recreation causes ghost models
    }

    /**
     * DEPRECATED: Player disposal is disabled since we no longer recreate players.
     * @param {PlayerUnit} player - The player to dispose (ignored)
     * @param {ActiveGameplayLevel} activeLevel - The active gameplay level (ignored)
     */
    async thoroughlyDisposeOldPlayer(player, activeLevel) {
        console.error("[DEATH] ⚠️ thoroughlyDisposeOldPlayer was called but is DISABLED.");
        // DO NOTHING - we keep the existing player model
    }

    /**
     * OLD thoroughlyDisposeOldPlayer implementation (kept for reference, never called)
     * @deprecated
     */
    async _old_thoroughlyDisposeOldPlayer(player, activeLevel) {
        if (!player) return;

        // Keep scene reference accessible across try/finally
        let scene = null;
        // Track disposed meshes for scene cleanup
        let meshesToDispose = [];

        try {
            const movementManager = player.playerMovementManager;
            const positionedObject = movementManager?.getPlayerModelPositionedObject?.();
            const playerModel = player.getPlayerModelDirectly?.();

            // Collect every mesh the movement manager knows about up front (safest)
            const preCollectedMeshes = new Set(
                movementManager?.collectAllPlayerMeshes?.() || []
            );

            // Step 1: Remove from SceneBuilder's loadedModels array
            const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"]?.getSceneBuilderForScene("BaseGameScene");
            if (sceneBuilder && sceneBuilder.loadedModels) {
                // Find and remove the player model from loaded models
                const initialLength = sceneBuilder.loadedModels.length;
                sceneBuilder.loadedModels = sceneBuilder.loadedModels.filter(model => {
                    // Check if this model matches the player model
                    if (model === playerModel) return false;
                    if (positionedObject && positionedObject.model === model) return false;
                    return true;
                });
                const removed = initialLength - sceneBuilder.loadedModels.length;
                if (removed > 0) {
                    console.warn(`[DEATH] Removed ${removed} player model(s) from SceneBuilder.loadedModels`);
                }
            }

            // Step 2: Dispose via positioned object (this should remove meshes from scene)
            if (positionedObject) {
                positionedObject.disposeModel();
            }

            // Step 3: Direct mesh disposal from scene
            if (playerModel) {
                scene = activeLevel.hostingScene;
                meshesToDispose = [];

                // Include any meshes gathered from the movement manager
                if (preCollectedMeshes.size > 0) {
                    preCollectedMeshes.forEach(mesh => meshesToDispose.push(mesh));
                }

                // If it's a loaded model with meshes array
                if (playerModel.meshes && Array.isArray(playerModel.meshes)) {
                    meshesToDispose.push(...playerModel.meshes);
                }

                // If it's a transform node with child meshes
                if (playerModel.getChildMeshes && typeof playerModel.getChildMeshes === 'function') {
                    const childMeshes = playerModel.getChildMeshes();
                    meshesToDispose.push(...childMeshes);
                }

                // If it's a single mesh
                if (playerModel instanceof BABYLON.Mesh || playerModel instanceof BABYLON.AbstractMesh) {
                    meshesToDispose.push(playerModel);
                }

                // Dispose all collected meshes with aggressive cleanup
                meshesToDispose.forEach((mesh, index) => {
                    if (mesh && mesh.dispose) {
                        try {
                            // Make mesh invisible first
                            mesh.isVisible = false;
                            mesh.setEnabled(false);

                            // Remove from scene if it has a scene reference
                            if (mesh.getScene && mesh.getScene() === scene) {
                                // Dispose with aggressive cleanup
                                mesh.dispose(false, true); // Don't dispose shared materials, do dispose textures
                            }
                        } catch (disposeError) {
                            console.error(`[DEATH]   Error disposing mesh ${index + 1}:`, disposeError);
                        }
                    }
                });

                // Dispose the root model if it has a dispose method
                if (playerModel.dispose && typeof playerModel.dispose === 'function') {
                    try {
                        playerModel.dispose();
                    } catch (rootDisposeError) {
                        console.warn("[DEATH] Error disposing player model root:", rootDisposeError);
                    }
                }
            }

            // Step 4: Dispose skeletons if any
            if (playerModel && playerModel.skeletons && Array.isArray(playerModel.skeletons)) {
                playerModel.skeletons.forEach((skeleton, index) => {
                    if (skeleton && skeleton.dispose) {
                        skeleton.dispose();
                    }
                });
            }

            // Step 5: Dispose animation groups if any
            if (playerModel && playerModel.animationGroups && Array.isArray(playerModel.animationGroups)) {
                playerModel.animationGroups.forEach((animGroup, index) => {
                    if (animGroup && animGroup.dispose) {
                        animGroup.dispose();
                    }
                });
            }

            // Step 6: Force scene mesh cache update
            if (scene) {
                // Force the scene to rebuild its internal mesh lists
                scene.meshes = scene.meshes.filter(mesh => {
                    // Remove any mesh that was part of the player model
                    return !meshesToDispose.includes(mesh);
                });
            }

            // Step 7: Clear all references
            if (movementManager) {
                movementManager.playerModel = null;
                movementManager.playerModelPositionedObject = null;
            }

            if (positionedObject) {
                positionedObject.model = null;
                positionedObject.baseMesh = null;
            }

        } catch (error) {
            console.error("[DEATH] Error during thorough player disposal:", error);
        }

        // Step 8: Force scene to clean up its internal references
        if (scene) {
            // Force the scene to recalculate its bounding box (cleans up references)
            try {
                scene.resetCachedMaterial();
                scene.freeActiveMeshes();
                scene.freezeActiveMeshes(false);
            } catch (cleanupError) {
                console.warn("[DEATH] Error during scene cleanup:", cleanupError);
            }
        }
    }

    /**
     * Check if player died this attempt (prevents replay from triggering)
     * @returns {boolean} True if player died
     */
    hasPlayerDied() {
        return this.playerDiedThisAttempt;
    }

    /**
     * Gets the player start position from level data
     * @param {ActiveGameplayLevel} activeLevel - The active gameplay level
     * @returns {BABYLON.Vector3} The start position
     */
    getPlayerStartPosition(activeLevel) {
        // Try multiple sources for the start position
        let position = null;

        // Source 1: levelDataComposite.playerStartPosition
        if (activeLevel.levelDataComposite?.playerStartPosition) {
            const pos = activeLevel.levelDataComposite.playerStartPosition;
            position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
        }
        // Source 2: levelGameplayTraitsData.playerStartPosition
        else if (activeLevel.levelDataComposite?.levelGameplayTraitsData?.playerStartPosition) {
            const pos = activeLevel.levelDataComposite.levelGameplayTraitsData.playerStartPosition;
            position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
        }
        // Source 3: Default center position
        else {
            const dimensions = activeLevel.getGridDimensions?.() || { width: 21, depth: 21 };
            const centerX = Math.floor(dimensions.width / 2);
            const centerZ = Math.floor(dimensions.depth / 2);
            position = new BABYLON.Vector3(centerX, Config.PLAYER_HEIGHT, centerZ);
        }

        return position;
    }

    /**
     * Resets player health to maximum
     */
    resetPlayerHealth() {
        const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
        if (!playerStatusTracker) {
            console.warn("[DEATH] PlayerStatusTracker not found");
            return;
        }

        // Reset damage processing lock
        playerStatusTracker.isDamageProcessing = false;

        // Set health to maximum
        const maxHealth = playerStatusTracker.getMaxHealth();
        playerStatusTracker.setCurrentHealth(maxHealth);

        // Update UI
        playerStatusTracker.updateHealthUI();
    }

    /**
     * Check if level is currently resetting
     * @returns {boolean} True if resetting
     */
    isCurrentlyResetting() {
        return this.isResetting;
    }

    /**
     * Verifies that the player is properly set up to receive movement input
     * @param {ActiveGameplayLevel} activeLevel - The active gameplay level
     * @param {PlayerUnit} player - The player unit
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager
     */
    verifyPlayerMovementSetup(activeLevel, player, gameplayManager) {
        console.log("[DEATH] Verifying player movement setup...");

        // Verify 0: GameplayManager has correct level reference (CRITICAL for movement)
        if (gameplayManager.primaryActiveGameplayLevel === activeLevel) {
        } else {
            console.error("[DEATH] ✗ GameplayManager.primaryActiveGameplayLevel is NOT correctly set!");
            console.error("[DEATH]   Expected:", activeLevel);
            console.error("[DEATH]   Got:", gameplayManager.primaryActiveGameplayLevel);
        }

        // Verify 1: Level has correct player reference (CRITICAL - this is where movement gets the player!)
        if (activeLevel.currentPrimaryPlayer === player) {
        } else {
            console.error("[DEATH] ✗ Level.currentPrimaryPlayer is NOT correctly set! (MOVEMENT WILL FAIL)");
            console.error("[DEATH]   Expected:", player);
            console.error("[DEATH]   Got:", activeLevel.currentPrimaryPlayer);
        }

        // Verify 2: GameplayManager has correct player reference
        if (gameplayManager.primaryActivePlayer === player) {
        } else {
            console.error("[DEATH] ✗ GameplayManager.primaryActivePlayer is NOT correctly set!");
            console.error("[DEATH]   Expected:", player);
            console.error("[DEATH]   Got:", gameplayManager.primaryActivePlayer);
        }

        // Verify 3: Player has movement manager
        if (player.playerMovementManager) {
        } else {
            console.error("[DEATH] ✗ Player is missing playerMovementManager!");
        }

        // Verify 4: Player model is loaded
        const playerModel = player.getPlayerModelDirectly?.();
        if (playerModel) {
        } else {
            console.error("[DEATH] ✗ Player model is NOT loaded!");
        }

        // Verify 5: Player is in the allActivePlayers array
        if (gameplayManager.allActivePlayers && gameplayManager.allActivePlayers.includes(player)) {
        } else {
            console.error("[DEATH] ✗ Player is NOT in allActivePlayers array!");
        }

        // Verify 6: Movement is not blocked
        if (player.playerMovementManager && !player.playerMovementManager.movementActive) {
            console.log("[DEATH] ✓ Movement is not currently active (ready for new input)");
        } else if (player.playerMovementManager && player.playerMovementManager.movementActive) {
            console.warn("[DEATH] ⚠ Movement is currently active (might block new input)");
        }
    }

    /**
     * Resets pickup progress (stardust count, experience) for a fresh level attempt
     */
    resetPickupProgress() {
        const specialOccurrenceManager = FundamentalSystemBridge["specialOccurrenceManager"];
        if (specialOccurrenceManager && specialOccurrenceManager.pickupOccurrenceSubManager) {
            specialOccurrenceManager.pickupOccurrenceSubManager.resetPickupProgress();
        } else {
            console.warn("[DEATH] Cannot reset pickup progress - specialOccurrenceManager or pickupOccurrenceSubManager not found");
        }
    }
}

