/**
 * 
 * LevelReplayManager
 * 
 * Manages the replay system that shows a 3D perspective replay of the level completion.
 * Creates a duplicate level, player copy, and replays movements with camera following.
 */
class LevelReplayManager {
    constructor() {
        this.duplicateLevel = null;
        this.duplicatePlayer = null;
        this.duplicateLevelOffset = new BABYLON.Vector3(20, 0, 0); // 20 units to the right
        this.isReplaying = false;
        this.replayIndex = 0;
        this.replayMovements = [];
        this.replayPickupPositions = [];
        this.duplicatePickupMicroEvents = new Map(); // Map of positions to duplicate microevents for disposal
    }

    /**
     * Creates a duplicate level 20 units to the right of the original
     * @param {ActiveGameplayLevel} originalLevel - The original level to duplicate
     * @returns {Promise<ActiveGameplayLevel>} The duplicated level
     */
    async createDuplicateLevel(originalLevel) {
        console.log("[REPLAY] Creating duplicate level...");

        const scene = originalLevel.hostingScene;
        const levelDataComposite = originalLevel.levelDataComposite;

        // Create a new level data composite for the duplicate
        const duplicateLevelData = this.cloneLevelDataComposite(levelDataComposite);

        // Create camera and lighting managers for duplicate level
        const cameraManager = new CameraManager();
        const lightingManager = new LightingManager();
        cameraManager.registerPrimaryGameScene(scene);

        // Create duplicate gameplay level
        const gameMode = GamemodeFactory.initializeSpecifiedGamemode("test");
        const duplicateLevel = new ActiveGameplayLevel(
            scene,
            gameMode,
            duplicateLevelData,
            cameraManager,
            lightingManager
        );

        // Render the duplicate level (this generates the grid at original positions)
        await FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(duplicateLevel);

        // Generate duplicate grid shifted 20 units to the right using thin instances
        await this.generateDuplicateGrid(duplicateLevel, originalLevel);

        // Render obstacles for duplicate level with offset positions
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const obstacleGenerator = FundamentalSystemBridge["levelFactoryComposite"].levelMapObstacleGenerator;

        // Get obstacles from the original level (they should already be in duplicateLevelData from cloneLevelDataComposite)
        const originalObstacles = originalLevel.obstacles ||
            originalLevel.levelDataComposite?.obstacles ||
            originalLevel.levelMap?.obstacles ||
            [];

        if (obstacleGenerator && originalObstacles.length > 0) {
            // Create duplicate obstacles with offset positions
            const duplicateObstacles = originalObstacles.map(obs => {
                // Clone the obstacle data
                const clonedObs = { ...obs };

                // Clone and offset the position (with -0.5 y offset to show height)
                if (clonedObs.position) {
                    if (clonedObs.position instanceof BABYLON.Vector3) {
                        const offsetWithY = this.duplicateLevelOffset.clone();
                        offsetWithY.y = -0.5; // Set y offset to -0.5 to show obstacle height
                        clonedObs.position = clonedObs.position.clone().add(offsetWithY);
                    } else if (clonedObs.position.x !== undefined) {
                        // If it's a plain object with x, y, z
                        clonedObs.position = {
                            x: clonedObs.position.x + this.duplicateLevelOffset.x,
                            y: (clonedObs.position.y || 0) - 0.5, // Add -0.5 y offset to show height
                            z: clonedObs.position.z + this.duplicateLevelOffset.z
                        };
                    }
                }

                return clonedObs;
            });

            // Store obstacles in the duplicate level
            duplicateLevel.obstacles = duplicateObstacles;
            duplicateLevel.levelDataComposite.obstacles = duplicateObstacles;
            duplicateLevel.levelMap = duplicateLevel.levelMap || {};
            duplicateLevel.levelMap.obstacles = duplicateObstacles;

            // Render the obstacles
            console.log(`[REPLAY] Rendering ${duplicateObstacles.length} duplicate obstacles with offset`);
            obstacleGenerator.renderObstaclesForLevel(duplicateLevel, sceneBuilder);
        } else {
            console.log(`[REPLAY] No obstacles to duplicate (found ${originalObstacles.length} obstacles)`);
        }

        // Create duplicate pickups (stardust)
        await this.createDuplicatePickups(duplicateLevel, originalLevel);

        // Create duplicate player immediately when level is created
        const originalPlayer = originalLevel.currentPrimaryPlayer;
        if (originalPlayer) {
            await this.createDuplicatePlayer(duplicateLevel, originalPlayer);
        }

        this.duplicateLevel = duplicateLevel;
        console.log("[REPLAY] Duplicate level created");

        return duplicateLevel;
    }

    /**
     * Clones level data composite
     * @param {LevelDataComposite} original - The original level data
     * @returns {LevelDataComposite} Cloned level data
     */
    cloneLevelDataComposite(original) {
        // Clone level header data
        const clonedHeaderData = new LevelHeaderData(
            `duplicate_${original.levelHeaderData.levelId}`,
            original.levelHeaderData.levelNickname,
            original.levelHeaderData.worldId,
            original.levelHeaderData.worldNickname,
            original.levelHeaderData.description,
            original.levelHeaderData.unlockRequirements,
            original.levelHeaderData.complexityLevel,
            original.levelHeaderData.backgroundMusic
        );

        // Clone gameplay traits data
        const clonedGameplayTraits = { ...original.levelGameplayTraitsData };
        if (clonedGameplayTraits.featuredObjects) {
            clonedGameplayTraits.featuredObjects = original.levelGameplayTraitsData.featuredObjects.map(obj => {
                const clonedObj = { ...obj };
                if (clonedObj.position && clonedObj.position instanceof BABYLON.Vector3) {
                    clonedObj.position = clonedObj.position.clone().add(this.duplicateLevelOffset);
                }
                return clonedObj;
            });
        }

        // Create new LevelDataComposite
        const cloned = new LevelDataComposite(
            clonedHeaderData,
            clonedGameplayTraits,
            original.levelCompletionRewardBundle
        );

        // Copy additional properties that might be added dynamically
        // Set player start position to (7, 0.25, 7) shifted right by 20 units = (27, 0.25, 7)
        cloned.playerStartPosition = {
            x: 27, // 7 + 20
            y: 0.25,
            z: 7
        };
        if (original.obstacles) {
            cloned.obstacles = original.obstacles.map(obs => {
                const clonedObs = { ...obs };
                if (clonedObs.position && clonedObs.position instanceof BABYLON.Vector3) {
                    clonedObs.position = clonedObs.position.clone().add(this.duplicateLevelOffset);
                }
                return clonedObs;
            });
        }
        if (original.customGridSize) {
            cloned.customGridSize = { ...original.customGridSize };
        }

        return cloned;
    }

    /**
     * Generates a duplicate grid for the duplicate level using thin instances
     * @param {ActiveGameplayLevel} duplicateLevel - The duplicate level
     * @param {ActiveGameplayLevel} originalLevel - The original level
     */
    async generateDuplicateGrid(duplicateLevel, originalLevel) {
        console.log("[REPLAY] Generating duplicate grid with offset...");

        // Get grid dimensions from the duplicate level
        const dimensions = duplicateLevel.getGridDimensions();

        // Get the grid manager
        const gridManager = FundamentalSystemBridge["levelFactoryComposite"].gridManager;

        if (!gridManager) {
            console.error("[REPLAY] Grid manager not found");
            return;
        }

        // Generate grid with offset (20 units to the right)
        const offset = this.duplicateLevelOffset;
        const success = await gridManager.generateGridWithOffset(
            dimensions.width,
            dimensions.depth,
            offset,
            1 // tileSize
        );

        if (success) {
            console.log(`[REPLAY] Duplicate grid generated successfully (${dimensions.width}x${dimensions.depth} with offset ${offset.x}, ${offset.y}, ${offset.z})`);
        } else {
            console.error("[REPLAY] Failed to generate duplicate grid");
        }
    }

    /**
     * Creates duplicate pickups in the duplicate level
     * @param {ActiveGameplayLevel} duplicateLevel - The duplicate level
     * @param {ActiveGameplayLevel} originalLevel - The original level
     */
    async createDuplicatePickups(duplicateLevel, originalLevel) {
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (!microEventManager) return;

        const levelId = originalLevel.levelDataComposite?.levelHeaderData?.levelId || "level0";
        const originalEvents = microEventManager.getMicroEventsByLevelId(levelId);
        const pickupEvents = originalEvents.filter(e => e.microEventCategory === "pickup");

        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const duplicateLevelId = `duplicate_${levelId}`;

        for (const event of pickupEvents) {
            if (event.microEventLocation) {
                const duplicatePosition = event.microEventLocation.clone().add(this.duplicateLevelOffset);

                // Create positioned object for duplicate stardust
                const offset = new BABYLON.Vector3(0, 0, 0);
                const rotation = new BABYLON.Vector3(0, 0, 0);
                const stardustObject = new PositionedObject(
                    "lotus",
                    duplicatePosition,
                    rotation,
                    offset,
                    "",
                    "",
                    "",
                    0.66,
                    false,
                    true,
                    false
                );

                // Load the model
                await sceneBuilder.loadModel(stardustObject);

                // Create microevent for duplicate stardust pickup
                const stardustEvent = MicroEventFactory.generatePickup(
                    `Duplicate ${event.microEventNickname}`,
                    event.microEventDescription,
                    event.microEventValue,
                    event.microEventMagnitude,
                    duplicatePosition,
                    stardustObject
                );

                // Register the microevent for the duplicate level
                const duplicateLevelData = { levelHeaderData: { levelId: duplicateLevelId } };
                microEventManager.addNewMicroEventToLevel(duplicateLevelData, stardustEvent);

                // Store the duplicate microevent for later disposal during replay
                // Use position as key (rounded to avoid floating point issues)
                const positionKey = `${Math.round(duplicatePosition.x * 10)}_${Math.round(duplicatePosition.y * 10)}_${Math.round(duplicatePosition.z * 10)}`;
                this.duplicatePickupMicroEvents.set(positionKey, stardustEvent);
            }
        }
    }

    /**
     * Creates a duplicate player in the duplicate level
     * @param {ActiveGameplayLevel} duplicateLevel - The duplicate level
     * @param {PlayerUnit} originalPlayer - The original player
     * @returns {Promise<PlayerUnit>} The duplicate player
     */
    async createDuplicatePlayer(duplicateLevel, originalPlayer) {
        console.log("[REPLAY] Creating duplicate player...");

        // Get the starting position for duplicate player (27, 0.25, 7)
        const startPosition = new BABYLON.Vector3(27, 0.25, 7);

        // Create a new player using the same model
        const duplicatePlayer = PlayerLoader.getFreshPlayer(duplicateLevel);
        duplicatePlayer.playerMovementManager.setMaxMovementDistance(originalPlayer.playerMovementManager.maxMovementDistance);

        // Set the player position to the duplicate level start position
        duplicatePlayer.playerMovementManager.setPositionRelocateModelInstantly(startPosition);

        // Load the player into the duplicate level (this loads the model)
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        await gameplayManager.loadPlayerToGameplayLevel(duplicateLevel, duplicatePlayer);

        // Wait a bit to ensure the model is fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify the model is loaded
        const playerModel = duplicatePlayer.playerMovementManager.getPlayerModelDirectly();
        if (!playerModel) {
            console.warn("[REPLAY] Player model not immediately available, will retry during replay");
        } else {
            console.log("[REPLAY] Duplicate player model loaded successfully");
        }

        this.duplicatePlayer = duplicatePlayer;
        console.log("[REPLAY] Duplicate player created");

        return duplicatePlayer;
    }

    /**
     * Starts the replay sequence
     * @param {ActiveGameplayLevel} originalLevel - The original level
     * @param {PlayerUnit} originalPlayer - The original player
     * @param {MovementTracker} movementTracker - The movement tracker with recorded moves
     */
    async startReplay(originalLevel, originalPlayer, movementTracker) {
        if (this.isReplaying) {
            console.warn("[REPLAY] Replay already in progress");
            return;
        }

        console.log("[REPLAY] Starting replay sequence...");

        // Wait for duplicate level to be created if it's still being created
        if (!this.duplicateLevel) {
            console.log("[REPLAY] Duplicate level not ready, creating now...");
            await this.createDuplicateLevel(originalLevel);
        }

        // Create duplicate player if not already created
        if (!this.duplicatePlayer) {
            await this.createDuplicatePlayer(this.duplicateLevel, originalPlayer);
        }

        // Get movements and pickup positions
        this.replayMovements = movementTracker.getMovements();
        this.replayPickupPositions = movementTracker.getPickupPositions();

        // Switch camera to follow duplicate player from behind
        await this.switchCameraToReplayView();

        // Start replaying movements
        this.isReplaying = true;
        this.replayIndex = 0;

        await this.replayMovementsSequence();
    }

    /**
     * Switches camera to follow the duplicate player from behind
     */
    async switchCameraToReplayView() {
        console.log("[REPLAY] Switching camera to replay view...");

        const scene = this.duplicateLevel.hostingScene;

        // Wait for the player model to be available (with retries)
        let duplicatePlayerModel = this.duplicatePlayer.playerMovementManager.getPlayerModelDirectly();
        let retries = 0;
        const maxRetries = 20; // Wait up to 2 seconds (20 * 100ms)

        while (!duplicatePlayerModel && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            duplicatePlayerModel = this.duplicatePlayer.playerMovementManager.getPlayerModelDirectly();
            retries++;
        }

        if (!duplicatePlayerModel) {
            console.error("[REPLAY] Duplicate player model not found after waiting");
            // Try to get the model from the positioned object directly
            const positionedObject = this.duplicatePlayer.playerMovementManager.getPlayerModelPositionedObject();
            if (positionedObject && positionedObject.model) {
                duplicatePlayerModel = positionedObject.model;
                console.log("[REPLAY] Found player model via positioned object");
            } else {
                console.error("[REPLAY] Could not find duplicate player model, aborting camera switch");
                return;
            }
        }

        // Handle case where model might be a root node with child meshes
        // If it's not a direct mesh, try to get the first child mesh or the root itself
        if (!(duplicatePlayerModel instanceof BABYLON.AbstractMesh)) {
            if (duplicatePlayerModel.getChildMeshes && duplicatePlayerModel.getChildMeshes().length > 0) {
                // Use the first child mesh as the target
                const childMeshes = duplicatePlayerModel.getChildMeshes();
                duplicatePlayerModel = childMeshes.find(m => m instanceof BABYLON.Mesh) || childMeshes[0];
                console.log("[REPLAY] Using child mesh as camera target");
            } else if (duplicatePlayerModel.meshes && duplicatePlayerModel.meshes.length > 0) {
                // Use the first mesh from the meshes array
                duplicatePlayerModel = duplicatePlayerModel.meshes[0];
                console.log("[REPLAY] Using first mesh from meshes array as camera target");
            }
        }

        // Create a follow camera positioned behind the player
        const followCamera = new BABYLON.FollowCamera(
            "replayFollowCamera",
            new BABYLON.Vector3(0, 0, 0),
            scene
        );

        followCamera.lockedTarget = duplicatePlayerModel;
        followCamera.radius = 8; // Distance behind the player
        followCamera.heightOffset = 3; // Height above the player
        followCamera.rotationOffset = 0; // Behind the player (0 degrees)
        followCamera.cameraAcceleration = 0.1;
        followCamera.maxCameraSpeed = 2;

        // Set as active camera
        scene.activeCamera = followCamera;
        this.duplicateLevel.cameraManager.currentCamera = followCamera;

        // Dispose old camera
        const oldCamera = FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[scene];
        if (oldCamera && oldCamera !== followCamera) {
            FundamentalSystemBridge["renderSceneSwapper"].disposeAndDeleteCamera(oldCamera);
        }

        FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[scene] = followCamera;

        console.log("[REPLAY] Camera switched to replay view");
    }

    /**
     * Replays the movement sequence
     */
    async replayMovementsSequence() {
        const scene = this.duplicateLevel.hostingScene;
        let pickupIndex = 0;

        for (let i = 0; i < this.replayMovements.length; i++) {
            const movement = this.replayMovements[i];

            // Adjust positions for duplicate level offset
            const adjustedStart = movement.startPosition.add(this.duplicateLevelOffset);
            const adjustedDestination = movement.destinationPosition.add(this.duplicateLevelOffset);

            // Set player position to start
            this.duplicatePlayer.playerMovementManager.setPositionRelocateModelInstantly(adjustedStart);

            // Check if we should play pickup sound at this position
            while (pickupIndex < this.replayPickupPositions.length) {
                const pickupPos = this.replayPickupPositions[pickupIndex];
                const adjustedPickupPos = pickupPos.position.add(this.duplicateLevelOffset);

                // Check if this pickup position is near the start position
                const distance = BABYLON.Vector3.Distance(adjustedStart, adjustedPickupPos);
                if (distance < 0.5) {
                    // Dispose the stardust model and trigger explosion
                    await this.processReplayPickup(adjustedPickupPos, pickupIndex + 1, scene);
                    pickupIndex++;
                } else {
                    break;
                }
            }

            // Move player to destination
            this.duplicatePlayer.playerMovementManager.setDestinationAndBeginMovement(
                adjustedDestination,
                this.duplicatePlayer
            );

            // Wait for movement to complete
            await this.waitForMovementComplete();

            // Check for pickups at destination
            while (pickupIndex < this.replayPickupPositions.length) {
                const pickupPos = this.replayPickupPositions[pickupIndex];
                const adjustedPickupPos = pickupPos.position.add(this.duplicateLevelOffset);

                const distance = BABYLON.Vector3.Distance(adjustedDestination, adjustedPickupPos);
                if (distance < 0.5) {
                    // Dispose the stardust model and trigger explosion
                    await this.processReplayPickup(adjustedPickupPos, pickupIndex + 1, scene);
                    pickupIndex++;
                } else {
                    break;
                }
            }
        }

        // If this was the 4th pickup, trigger explosion
        if (pickupIndex >= 4) {
            await this.triggerEndOfLevelExplosion(scene);
        }

        this.isReplaying = false;
        console.log("[REPLAY] Replay sequence complete");
    }

    /**
     * Waits for player movement to complete
     */
    async waitForMovementComplete() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (!this.duplicatePlayer.playerMovementManager.movementActive) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 16); // Check every frame (60fps)
        });
    }

    /**
     * Processes a pickup during replay: disposes the stardust model, plays sound, and triggers explosion
     * @param {BABYLON.Vector3} pickupPosition - The position of the pickup
     * @param {number} pickupCount - The pickup count (1-4)
     * @param {BABYLON.Scene} scene - The scene
     */
    async processReplayPickup(pickupPosition, pickupCount, scene) {
        // Find and dispose the duplicate stardust model
        // Try multiple position key formats to find the matching microevent
        let duplicateMicroEvent = null;

        // Try exact position key
        const positionKey = `${Math.round(pickupPosition.x * 10)}_${Math.round(pickupPosition.y * 10)}_${Math.round(pickupPosition.z * 10)}`;
        duplicateMicroEvent = this.duplicatePickupMicroEvents.get(positionKey);

        // If not found, try to find by proximity (within 0.5 units)
        if (!duplicateMicroEvent) {
            for (const [key, event] of this.duplicatePickupMicroEvents.entries()) {
                if (event && event.microEventLocation) {
                    const distance = BABYLON.Vector3.Distance(pickupPosition, event.microEventLocation);
                    if (distance < 0.5) {
                        duplicateMicroEvent = event;
                        console.log(`[REPLAY] Found duplicate pickup by proximity at distance ${distance}`);
                        break;
                    }
                }
            }
        }

        if (duplicateMicroEvent && duplicateMicroEvent.microEventPositionedObject) {
            // Dispose the stardust model (lotus)
            duplicateMicroEvent.microEventPositionedObject.disposeModel();
            console.log(`[REPLAY] Disposed stardust lotus model at position ${pickupPosition.x}, ${pickupPosition.y}, ${pickupPosition.z}`);
        } else {
            console.warn(`[REPLAY] Could not find duplicate microevent to dispose at position ${pickupPosition.x}, ${pickupPosition.y}, ${pickupPosition.z}`);
        }

        // Play pickup sound
        await this.playPickupSoundForReplay(pickupCount, scene);

        // Trigger magic explosion effect at pickup position (don't await, let it run)
        this.triggerPickupExplosion(pickupPosition, scene).catch(error => {
            console.error(`[REPLAY] Error triggering pickup explosion:`, error);
        });
    }

    /**
     * Triggers a magic explosion effect at a specific position
     * @param {BABYLON.Vector3} position - The position for the explosion
     * @param {BABYLON.Scene} scene - The scene
     */
    async triggerPickupExplosion(position, scene) {
        console.log(`[REPLAY] Triggering magic explosion at position ${position.x}, ${position.y}, ${position.z}`);

        // Create a custom explosion at the specified position
        const maxParticles = 500;
        let particleSystem = new BABYLON.ParticleSystem(`pickupExplosion_${Date.now()}`, maxParticles, scene);

        // Texture
        particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);

        // Set position as emitter
        particleSystem.emitter = position.clone();

        // Explosion shape
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.3, -0.3, -0.3);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.3, 0.3, 0.3);

        // Emission - burst effect
        particleSystem.manualEmitCount = 300;
        particleSystem.emitRate = 0;

        // Lifetime (1 second duration)
        particleSystem.minLifeTime = 0.5;
        particleSystem.maxLifeTime = 1.0;

        // Size
        particleSystem.minSize = 0.2;
        particleSystem.maxSize = 0.8;
        particleSystem.minSizeScale = 0.1;
        particleSystem.maxSizeScale = 0.5;

        // Speed
        particleSystem.minEmitPower = 3;
        particleSystem.maxEmitPower = 8;
        particleSystem.updateSpeed = 0.01;

        // Direction - spherical explosion
        particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

        // Magic colors (purple/pink)
        particleSystem.color1 = new BABYLON.Color4(1.0, 0.3, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.6, 0.2, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.3, 0.0, 0.5, 0.0);
        particleSystem.gravity = new BABYLON.Vector3(0, 2, 0); // Floats up

        // Visual effects
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.minAngularSpeed = -2;
        particleSystem.maxAngularSpeed = 2;
        particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;

        // Start the effect
        particleSystem.start();
        console.log(`[REPLAY] Magic explosion started at position ${position.x}, ${position.y}, ${position.z}`);

        // Clean up after 1 second
        return new Promise((resolve) => {
            setTimeout(() => {
                particleSystem.stop();
                particleSystem.dispose();
                console.log(`[REPLAY] Magic explosion cleaned up`);
                resolve();
            }, 1000);
        });
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
            await SoundEffectsManager.playSound(soundName, scene);
            console.log(`[REPLAY] Playing pickup sound: ${soundName} for pickup #${pickupCount}`);
        } catch (error) {
            console.error(`[REPLAY] Error playing pickup sound:`, error);
        }
    }

    /**
     * Triggers the end of level explosion effect
     * @param {BABYLON.Scene} scene - The scene
     */
    async triggerEndOfLevelExplosion(scene) {
        console.log("[REPLAY] Triggering end of level explosion");

        // Play end of level sound
        try {
            await SoundEffectsManager.playSound("endOfLevelPerfect", scene);
        } catch (error) {
            console.error(`[REPLAY] Error playing endOfLevelPerfect sound:`, error);
        }

        // Trigger explosion effect
        const effectGenerator = new EffectGenerator();
        effectGenerator.explosionEffect({
            type: 'magic',
            intensity: 1.5,
            duration: 5.0
        }).catch(error => {
            console.error(`[REPLAY] Error triggering explosion effect:`, error);
        });
    }
}

