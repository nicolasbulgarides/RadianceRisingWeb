class LevelLoaderManager {
    constructor() {
        // Initialize loading screen instance
        this.loadingScreen = null;
        this.initializeLoadingScreen();

        // Track which level number we're loading (for music selection)
        this.currentLevelNumber = 0; // 0 = first level, 1 = second level, etc.

        // Initialize level auditor for pathfinding analysis
        this.levelAuditor = null;
        this.initializeLevelAuditor();
    }

    /**
     * Initializes the level auditor if available.
     */
    initializeLevelAuditor() {
        if (typeof LevelAuditor !== "undefined") {
            this.levelAuditor = new LevelAuditor();
        }
    }

    /**
     * Gets or creates the level auditor instance.
     * @returns {LevelAuditor|null} The level auditor instance or null if not available.
     */
    getLevelAuditor() {
        if (!this.levelAuditor && typeof LevelAuditor !== "undefined") {
            this.initializeLevelAuditor();
        }
        return this.levelAuditor;
    }

    /**
     * Initializes the loading screen if available.
     */
    initializeLoadingScreen() {
        if (typeof LoadingScreen !== "undefined") {
            this.loadingScreen = new LoadingScreen();
        }
    }

    /**
     * Gets or creates the loading screen instance.
     * @returns {LoadingScreen|null} The loading screen instance or null if not available.
     */
    getLoadingScreen() {
        // Try to initialize if not already done
        if (!this.loadingScreen && typeof LoadingScreen !== "undefined") {
            this.initializeLoadingScreen();
        }
        return this.loadingScreen;
    }

    logFailedToLoadLevel() {
        GameplayLogger.lazyLog("Failed to load level");
        // Stop loading screen even on failure
        const loadingScreen = this.getLoadingScreen();
        if (loadingScreen) {
            loadingScreen.stop();
        }
    }

    logFailedToRenderLevel() {
        GameplayLogger.lazyLog("Failed to render level");
        // Stop loading screen even on failure
        const loadingScreen = this.getLoadingScreen();
        if (loadingScreen) {
            loadingScreen.stop();
        }
    }

    async loadTilesAndFactorySupportSystems() {
        await FundamentalSystemBridge[
            "levelFactoryComposite"
        ].loadFactorySupportSystems();

    }
    /**
     * Loads a basic test level, the player, and renders the level
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance to process orders for.
     */
    async loadLevelTest2(gameplayManager) {
        // Get loading screen instance once for the entire function
        const loadingScreen = this.getLoadingScreen();

        // Start loading screen before anything else
        if (loadingScreen) {
            loadingScreen.start();
        }

        await this.loadTilesAndFactorySupportSystems();
        let gameplayLevel = await this.loadLevelAndPlayer(gameplayManager);

        if (!gameplayLevel) {
            this.logFailedToLoadLevel();
        }

        let finalizedRendering = await FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(
            gameplayLevel
        );

        if (!finalizedRendering) {
            this.logFailedToRenderLevel();
        }
        gameplayManager.setActiveGameplayLevel(gameplayLevel);

        // Preload essential sounds to eliminate latency during gameplay
        console.log("[LEVEL LOADER] Loading initial sounds...");
        const soundEffectsManager = FundamentalSystemBridge["soundEffectsManager"];
        if (soundEffectsManager && gameplayLevel.hostingScene) {
            await soundEffectsManager.loadInitialSounds(gameplayLevel.hostingScene);
            console.log("[LEVEL LOADER] Initial sounds loaded");
        }

        loadingScreen.destroy();

        // Start music on loop (only if audio has been unlocked by user interaction)
        // First level plays "crystalVoyage", all subsequent levels play "duskReverie"
        const musicManager = FundamentalSystemBridge["musicManager"];
        const activeScene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
        if (musicManager && activeScene && Config.audioHasBeenUnlocked) {
            const songName = this.currentLevelNumber === 0 ? "crystalVoyage" : "duskReverie";
            console.log(`[LEVEL LOADER] Starting ${songName} music for level ${this.currentLevelNumber}`);
            await musicManager.playSong(activeScene, songName, true, true);
            console.log(`[LEVEL LOADER] ✓ Started ${songName} music on loop`);

            // Increment level number for next level
            this.currentLevelNumber++;
        } else if (musicManager && activeScene && !Config.audioHasBeenUnlocked) {
            console.log("[LEVEL LOADER] Skipping music start - waiting for user interaction to unlock audio");
        } else {
            console.warn(`[LEVEL LOADER] Cannot start music - musicManager:${!!musicManager}, scene:${!!activeScene}`);
        }

    }

    async loadLevelTest1(gameplayManager) {
        await this.loadTilesAndFactorySupportSystems();

        // Load level using the LevelProfileManifest
        // Available levels: level0Test2, level2Test, level3Spikes
        const levelId = "level3Spikes";

        try {
            const levelJsonData = await LevelProfileManifest.fetchLevelById(levelId);
            return await this.receiveLevelMapFromServer(gameplayManager, levelJsonData);
        } catch (error) {
            console.error(`[LEVEL LOADER] Error loading level ${levelId}:`, error);
            this.logFailedToLoadLevel();
            return null;
        }
    }

    /**
     * Loads a level from JSON data received from the server/GUI
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {Object|string} levelJsonData - The level JSON data (object or JSON string)
     */

    /**
     * Fetches level JSON from a URL and loads it into the game
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {string} url - The URL to fetch the level JSON data from
     * @returns {Promise<ActiveGameplayLevel|null>} The loaded gameplay level or null if loading failed
     */
    async loadLevelFromUrl(gameplayManager, url) {
        try {
            const levelJsonData = await LevelProfileManifest.fetchLevelJsonFromUrl(url);
            return await this.receiveLevelMapFromServer(gameplayManager, levelJsonData);
        } catch (error) {
            console.error("Error loading level from URL:", error);
            this.logFailedToLoadLevel();
            return null;
        }
    }

    getLevelDepth(levelData) {
        return levelData?.mapHeight || levelData?.mapDepth || levelData?.depth || 21;
    }

    /**
     * Loads a level from JSON data received from the server/GUI
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {Object|string} levelJsonData - The level JSON data (object or JSON string)
     */
    async receiveLevelMapFromServer(gameplayManager, levelJsonData) {
        // Get loading screen instance
        const loadingScreen = this.getLoadingScreen();

        // Start loading screen before anything else
        if (loadingScreen) {
            loadingScreen.start();
        }

        // CRITICAL: Reset flags for new level to allow player loading
        // This ensures the main player can be loaded and clears death-related flags
        if (gameplayManager && gameplayManager.resetForNewLevel) {
            gameplayManager.resetForNewLevel();
        }

        // Reset death-related flags for the new level
        const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
        if (levelResetHandler) {
            levelResetHandler.hasEverDied = false;
            levelResetHandler.isResetting = false;
            levelResetHandler.playerDiedThisAttempt = false;
        }

        // Reset replay manager for new level
        const replayManager = FundamentalSystemBridge["levelReplayManager"];
        if (replayManager) {
            replayManager.duplicatePlayerCreationBlocked = false;
        }

        // Reset pickup streak/experience for the new level so 4th pickup logic re-triggers
        const specialOccurrenceManager = FundamentalSystemBridge["specialOccurrenceManager"];
        specialOccurrenceManager?.pickupOccurrenceSubManager?.resetPickupProgress?.();

        try {
            // Parse JSON if it's a string
            let levelData = typeof levelJsonData === 'string'
                ? JSON.parse(levelJsonData)
                : levelJsonData;

            // Load factory support systems
            await this.loadTilesAndFactorySupportSystems();

            // Parse the level data and create LevelDataComposite
            let levelDataComposite = this.parseLevelJsonToComposite(levelData);

            if (!levelDataComposite) {
                this.logFailedToLoadLevel();
                return null;
            }

            // Create obstacles from the level data
            let obstacles = this.createObstaclesFromLevelData(levelData);
            if (obstacles.length > 0) {
                levelDataComposite.obstacles = obstacles;
                // Also store in levelGameplayTraitsData.featuredObjects for compatibility
                // But avoid duplication - check if obstacles already exist
                if (!levelDataComposite.levelGameplayTraitsData.featuredObjects) {
                    levelDataComposite.levelGameplayTraitsData.featuredObjects = [];
                }
                // Only add obstacles that aren't already in featuredObjects
                const existingObstacleIds = new Set(
                    levelDataComposite.levelGameplayTraitsData.featuredObjects
                        .filter(obj => obj.isObstacle)
                        .map(obj => obj.nickname)
                );
                const newObstacles = obstacles.filter(obs => !existingObstacleIds.has(obs.nickname));
                if (newObstacles.length > 0) {
                    levelDataComposite.levelGameplayTraitsData.featuredObjects.push(...newObstacles);
                }
            }

            // Create an active gameplay level instance
            let activeGameplayLevel = await this.prepareGameplayLevelObject(levelDataComposite);

            if (activeGameplayLevel == null) {
                this.logFailedToLoadLevel();
                return null;
            }

            // Create and register stardust pickups as microevents
            await this.createStardustPickups(activeGameplayLevel, levelData);

            // Create and register spike traps as microevents
            await this.createSpikeTraps(activeGameplayLevel, levelData);

            // Create and register heart pickups as microevents
            await this.createHeartPickups(activeGameplayLevel, levelData);

            // Render obstacles
            const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");



            const obstacleGenerator = FundamentalSystemBridge["levelFactoryComposite"].levelMapObstacleGenerator;
            if (obstacleGenerator && obstacles.length > 0) {
                // Validate obstacles have valid positions before rendering
                const validObstacles = obstacles.filter(obs => {
                    if (!obs.position || !(obs.position instanceof BABYLON.Vector3)) {
                        console.warn("Obstacle missing valid position:", obs);
                        return false;
                    }
                    return true;
                });

                if (validObstacles.length !== obstacles.length) {
                    console.warn(`Filtered out ${obstacles.length - validObstacles.length} invalid obstacles`);
                }

                // Ensure obstacles are accessible from activeGameplayLevel
                if (activeGameplayLevel.levelDataComposite) {
                    activeGameplayLevel.levelDataComposite.obstacles = validObstacles;
                }
                // Also ensure they're in levelMap for backward compatibility
                if (!activeGameplayLevel.levelMap) {
                    activeGameplayLevel.levelMap = {};
                }
                activeGameplayLevel.levelMap.obstacles = validObstacles;

                if (validObstacles.length > 0) {
                    obstacleGenerator.renderObstaclesForLevel(activeGameplayLevel, sceneBuilder);
                }
            }





            // Render the level
            let finalizedRendering = await FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(
                activeGameplayLevel
            );

            if (!finalizedRendering) {
                this.logFailedToRenderLevel();
            }

            // Load player into the level
            let gameplayLevel = await this.loadLevelAndPlayerFromComposite(gameplayManager, activeGameplayLevel);

            if (!gameplayLevel) {
                this.logFailedToLoadLevel();
                return null;
            }

            // Register microevents for the level
            // Note: Stardust microevents are already registered in createStardustPickups
            // Only call prepareAndRegisterMicroEventsForLevel if level doesn't already have microevents
            const microEventManager = FundamentalSystemBridge["microEventManager"];
            if (microEventManager) {
                const levelId = levelDataComposite.levelHeaderData?.levelId;
                // Only register if level doesn't already have microevents (from manual registration)
                if (!microEventManager.gameplayLevelToMicroEventsMap[levelId]) {
                    microEventManager.prepareAndRegisterMicroEventsForLevel(levelDataComposite);
                }
            }


            FundamentalSystemBridge["gameplayManagerComposite"].setActiveGameplayLevel(activeGameplayLevel);



            // Set the active gameplay level in the CollectiblePlacementManager
            // Note: We skip auto-placing mangos since we're manually placing stardust pickups
            const collectibleManager = FundamentalSystemBridge["collectiblePlacementManager"];
            if (collectibleManager) {
                collectibleManager.activeGameplayLevel = gameplayLevel;
                // Mark as initialized to prevent auto-placing mangos
                collectibleManager.isInitialized = true;
                // console.log(`[LEVEL LOADER] CollectiblePlacementManager configured with activeGameplayLevel`);
                // console.log(`[LEVEL LOADER] Player registered:`, !!gameplayLevel.currentPrimaryPlayer);
            } else {
                // console.error(`[LEVEL LOADER] CollectiblePlacementManager not found in FundamentalSystemBridge!`);
            }

            // Start movement tracking for replay
            const movementTracker = FundamentalSystemBridge["movementTracker"];
            if (movementTracker) {
                movementTracker.startTracking();
                //  console.log(`[LEVEL LOADER] Movement tracking started`);
            }

            // Create duplicate level for replay (100 units to the right, offscreen)
            const replayManager = FundamentalSystemBridge["levelReplayManager"];
            if (replayManager) {
                // Create duplicate level asynchronously (don't await to avoid blocking level load)
                console.log("[LEVEL LOADER] Starting duplicate level creation for replay...");
                replayManager.createDuplicateLevel(activeGameplayLevel).then(() => {
                    console.log("[LEVEL LOADER] ✓ Duplicate level creation complete");
                }).catch(error => {
                    console.error(`[LEVEL LOADER] ✗ Error creating duplicate level:`, error);
                });
            }

            // Preload essential sounds to eliminate latency during gameplay
            console.log("[LEVEL LOADER] Loading initial sounds...");
            const soundEffectsManager = FundamentalSystemBridge["soundEffectsManager"];
            if (soundEffectsManager && gameplayLevel.hostingScene) {
                await soundEffectsManager.loadInitialSounds(gameplayLevel.hostingScene);
                // console.log("[LEVEL LOADER] Initial sounds loaded");
            }

            if (loadingScreen) {
                loadingScreen.destroy();
            }

            // Start music on loop (only if audio has been unlocked by user interaction)
            // First level plays "crystalVoyage", all subsequent levels play "duskReverie"
            const musicManager = FundamentalSystemBridge["musicManager"];
            const activeScene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
            if (musicManager && activeScene && Config.audioHasBeenUnlocked) {
                const songName = this.currentLevelNumber === 0 ? "crystalVoyage" : "duskReverie";
                // console.log(`[LEVEL LOADER] Starting ${songName} music for level ${this.currentLevelNumber}`);
                musicManager.playSong(activeScene, songName, true, true);
                // console.log(`[LEVEL LOADER] ✓ Started ${songName} music on loop`);

                // Increment level number for next level
                this.currentLevelNumber++;
            } else if (musicManager && activeScene && !Config.audioHasBeenUnlocked) {
                // console.log("[LEVEL LOADER] Skipping music start - waiting for user interaction to unlock audio");
            }

            // Run level audit to determine minimum strokes and optimal path
            this.runLevelAudit(levelData, activeGameplayLevel);

            return gameplayLevel;
        } catch (error) {
            //console.error("Error loading level from server:", error);
            this.logFailedToLoadLevel();
            return null;
        }
    }

    /**
     * Parses JSON level data into a LevelDataComposite
     * @param {Object} levelData - The parsed level JSON data
     * @returns {LevelDataComposite} The created level data composite
     */
    parseLevelJsonToComposite(levelData) {
        const levelId = levelData.levelName || "level0";
        const levelNickname = levelData.levelName || "Level 0";
        const levelHint = levelData.levelHint || "";
        const width = levelData.mapWidth || 21;
        const depth = levelData.mapHeight || 21;

        // Find spawn position (builder space) and convert once
        const spawnElement = levelData.allMapElements?.find(el => el.element === "SPAWN_POSITION");
        const spawnCoords = spawnElement?.coordinates || { x: 10, y: 10 };
        const spawnWorld = this.builderToWorld(spawnCoords, depth);
        const playerStart = {
            x: spawnWorld.x,
            y: 0.25, // Default height above ground
            z: spawnWorld.z
        };

        // Create level data composite using TestLevelJsonBuilder
        const levelDataComposite = TestLevelJsonBuilder.buildCustomSizeLevel(
            levelId,
            levelNickname,
            width,
            depth,
            playerStart
        );

        // Store custom properties
        levelDataComposite.levelHint = levelHint;
        levelDataComposite.levelMapVersion = levelData.levelMapVersion;

        return levelDataComposite;
    }

    /**
     * Creates obstacle data objects from level JSON data
     * @param {Object} levelData - The parsed level JSON data
     * @returns {Array<Object>} Array of obstacle data objects (not Obstacle instances)
     */
    createObstaclesFromLevelData(levelData) {
        const obstacles = [];
        const mountainElements = levelData.allMapElements?.filter(el => el.element === "MOUNTAIN") || [];

        const depth = this.getLevelDepth(levelData);

        for (const mountainEl of mountainElements) {
            const coords = mountainEl.coordinates;

            // Validate coordinates exist
            if (!coords || coords.x === undefined || coords.y === undefined) {
                console.warn("Skipping mountain obstacle with invalid coordinates:", mountainEl);
                continue;
            }

            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, 0, worldCoords.z);

            // Validate position was created successfully
            if (!position || position.x === undefined) {
                console.warn("Failed to create position for mountain obstacle:", coords);
                continue;
            }

            // Create obstacle data object (not Obstacle instance)
            // renderObstaclesForLevel will create the Obstacle instances
            const obstacleData = {
                obstacleArchetype: "mountain",
                nickname: `mountain_${coords.x}_${coords.y}`,
                interactionId: "none",
                directionsBlocked: "all",
                position: position,
                isObstacle: true
            };

            obstacles.push(obstacleData);
        }

        return obstacles;
    }

    /**
     * Creates stardust pickups from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createStardustPickups(activeGameplayLevel, levelData) {
        const stardustElements = levelData.allMapElements?.filter(el => el.element === "STAR_DUST") || [];
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        // Get levelId from the activeGameplayLevel's levelDataComposite if available
        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        //console.log(`[STARDUST CREATION] Creating ${stardustElements.length} stardust pickups for levelId: ${levelId}`);
        //console.log(`[STARDUST CREATION] ActiveGameplayLevel levelDataComposite levelId:`, activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId);
        //console.log(`[STARDUST CREATION] LevelData levelName:`, levelData.levelName);

        for (const stardustEl of stardustElements) {
            const coords = stardustEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, 0.25, worldCoords.z);

            // Create positioned object for stardust
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const stardustObject = new PositionedObject(
                "lotus",
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                0.66, // Scale factor for stardust
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );

            // Load the model
            await sceneBuilder.loadModel(stardustObject);

            // Create microevent for stardust pickup
            const stardustEvent = MicroEventFactory.generatePickup(
                "Stardust Pickup",
                "You grasped the iridescent glow of a stardust fragment!",
                "stardust",
                1,
                position,
                stardustObject
            );

            // Register the microevent
            if (microEventManager) {
                /** 
                console.log(`[STARDUST CREATION] Registering stardust microevent for levelId: ${levelId}`);
                console.log(`[STARDUST CREATION] Event location:`, position);
                console.log(`[STARDUST CREATION] PositionedObject model loaded:`, !!stardustObject.model);
                console.log(`[STARDUST CREATION] MicroEvent structure:`, {
                    category: stardustEvent.microEventCategory,
                    value: stardustEvent.microEventValue,
                    hasPositionedObject: !!stardustEvent.microEventPositionedObject,
                    location: stardustEvent.microEventLocation
                });
*/
                // Use the actual levelDataComposite if available, otherwise create a minimal structure
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };

                /**
                console.log(`[STARDUST CREATION] Using levelDataForRegistration with levelId:`, levelDataForRegistration.levelHeaderData?.levelId);
                */
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    stardustEvent
                );
            } else {
                console.error(`[STARDUST CREATION] MicroEventManager not found!`);
            }

            // Spawn arrival VFX using centralized explosion system
            try {
                const predictiveManager = FundamentalSystemBridge["predictiveExplosionManager"];
                if (predictiveManager && sceneBuilder.scene) {
                    predictiveManager.createSpawnExplosion(position, sceneBuilder.scene, 0.4).catch(() => { /* ignore */ });
                }
            } catch (err) {
                console.warn("[STARDUST CREATION] Spawn effect failed:", err);
            }
        }

        // Verify that 4 stardusts were registered
        if (microEventManager) {
            const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
            const registeredEvents = microEventManager.getMicroEventsByLevelId(levelDataForRegistration.levelHeaderData?.levelId || levelId);
            const stardustEvents = registeredEvents.filter(e =>
                e.microEventCategory === "pickup" &&
                (e.microEventValue === "stardust" || e.microEventNickname?.includes("Stardust"))
            );

            if (stardustEvents.length !== 4) {
                console.warn(`[STARDUST VERIFICATION] Expected 4 stardusts, but found ${stardustEvents.length} registered for levelId: ${levelId}`);
            } else {
                //console.log(`[STARDUST VERIFICATION] ✓ Successfully registered 4 stardusts for levelId: ${levelId}`);
            }
        }
    }

    /**
     * Creates spike traps from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createSpikeTraps(activeGameplayLevel, levelData) {
        const spikeTrapElements = levelData.allMapElements?.filter(el => el.element === "SPIKE_TRAP") || [];
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        //console.log(`[SPIKE TRAP CREATION] Creating ${spikeTrapElements.length} spike traps for levelId: ${levelId}`);

        for (const spikeTrapEl of spikeTrapElements) {
            const coords = spikeTrapEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, 0.25, worldCoords.z);

            // Create positioned object for spike trap
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const spikeTrapObject = new PositionedObject(
                "testStarSpike",
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                0.5, // Scale factor for spike trap
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );

            // Load the model
            await sceneBuilder.loadModel(spikeTrapObject);

            // Create microevent for spike trap damage
            const spikeTrapEvent = MicroEventFactory.generateDamage(
                "Spike Trap",
                "Sharp spikes pierce through your defenses!",
                "spike",
                1,
                position,
                spikeTrapObject
            );

            // Initialize flag for movement-based damage system
            spikeTrapEvent.hasTriggeredThisMovement = false;

            // Register the microevent
            if (microEventManager) {
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    spikeTrapEvent
                );
            } else {
                console.error(`[SPIKE TRAP CREATION] MicroEventManager not found!`);
            }
        }

        //console.log(`[SPIKE TRAP CREATION] ✓ Created ${spikeTrapElements.length} spike traps for levelId: ${levelId}`);
    }

    /**
     * Creates heart pickups from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createHeartPickups(activeGameplayLevel, levelData) {
        const heartElements = levelData.allMapElements?.filter(el => el.element === "HEART") || [];
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        //console.log(`[HEART CREATION] Creating ${heartElements.length} hearts for levelId: ${levelId}`);

        for (const heartEl of heartElements) {
            const coords = heartEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, 0.25, worldCoords.z);

            // Create positioned object for heart
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const heartObject = new PositionedObject(
                "testHeartRed",
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                0.5, // Scale factor for heart
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );

            // Load the model
            await sceneBuilder.loadModel(heartObject);

            // Create microevent for heart pickup
            const heartEvent = MicroEventFactory.generatePickup(
                "Heart Pickup",
                "You absorbed the healing energy of a radiant heart!",
                "heart",
                1,
                position,
                heartObject
            );

            // Register the microevent
            if (microEventManager) {
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    heartEvent
                );
            } else {
                console.error(`[HEART CREATION] MicroEventManager not found!`);
            }
        }

        //console.log(`[HEART CREATION] ✓ Created ${heartElements.length} hearts for levelId: ${levelId}`);
    }

    /**
     * Converts builder (top-left origin) coordinates to Babylon world coords (bottom-left origin).
     * Optional offset allows re-use for duplicate/chamber grids.
     */
    builderToWorld(coords, depth, offset = { x: 0, z: 0 }) {
        const offX = offset.x || 0;
        const offZ = offset.z || 0;
        return {
            x: coords.x + offX,
            z: (depth - 1 - coords.y) + offZ
        };
    }

    /**
     * Loads player into a level that was already prepared
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager
     * @param {ActiveGameplayLevel} activeGameplayLevel - The prepared gameplay level
     * @returns {ActiveGameplayLevel} The gameplay level with player loaded
     */
    async loadLevelAndPlayerFromComposite(gameplayManager, activeGameplayLevel) {
        if (activeGameplayLevel == null) {
            GameplayLogger.lazyLog(
                "GameplayLevel is null at load, cannot load player to gameplay level"
            );
            return null;
        }

        // Create a player using the level data
        let demoPlayer = PlayerLoader.getFreshPlayer(activeGameplayLevel);
        demoPlayer.playerMovementManager.setMaxMovementDistance(5);

        let loadedPlayer = await gameplayManager.loadPlayerToGameplayLevel(
            activeGameplayLevel,
            demoPlayer
        ); // Load the player into the level.

        demoPlayer.setMockInventory(new PlayerMockInventory());

        return activeGameplayLevel;
    }






    async loadLevelAndPlayer(gameplayManager) {
        let gameplayLevel = await this.generateGameplayLevelComposite(
            gameplayManager
        );

        if (gameplayLevel == null) {
            GameplayLogger.lazyLog(
                "GameplayLevel is null at load, cannot load player to gameplay level"
            );
            return null;
        }

        // Create a player using the level data
        let demoPlayer = PlayerLoader.getFreshPlayer(gameplayLevel);
        demoPlayer.playerMovementManager.setMaxMovementDistance(5);

        let loadedPlayer = await gameplayManager.loadPlayerToGameplayLevel(
            gameplayLevel,
            demoPlayer
        ); // Load the player into the level.

        demoPlayer.setMockInventory(new PlayerMockInventory());

        return gameplayLevel;
    }




    /**
     * Core code that pulls gameplay testlevel data, currently a level full of mangos, needs to be paramaterized as of 12-2-2025
     */
    async generateGameplayLevelComposite(gameplayManager) {
        // Use the new TestLevelDataLoader to create a LevelDataComposite
        let levelDataComposite = TestLevelDataCompositeLoader.createTestLevelData();

        // Create an active gameplay level instance with the loaded configurations.
        let activeDemoGameplayLevel = await this.prepareGameplayLevelObject(
            levelDataComposite
        );

        if (activeDemoGameplayLevel == null) {
            GameplayLogger.lazyLog(
                "ActiveDemoGameplayLevel is null at generate, post setting active gameplay level cannot generate gameplay level"
            );
            return null;
        }

        gameplayManager.setActiveGameplayLevel(activeDemoGameplayLevel); // Set the loaded level as active.

        // Set the active gameplay level in the CollectiblePlacementManager - currently places mangos
        await FundamentalSystemBridge[
            "collectiblePlacementManager"
        ].setActiveGameplayLevel(activeDemoGameplayLevel);


        return activeDemoGameplayLevel; // Return the configured gameplay level.
    }

    generateAndRegisterCameraAndLightingManagers() {
        let primaryCameraManager = new CameraManager();
        let primaryLightingManager = new LightingManager();
        FundamentalSystemBridge.registerPrimaryGameplayCameraManager(
            primaryCameraManager
        );
        FundamentalSystemBridge.registerPrimaryGameplayLightingManager(
            primaryLightingManager
        );
        return { primaryCameraManager, primaryLightingManager };
    }

    async prepareGameplayLevelObject(levelDataComposite) {
        let { primaryCameraManager, primaryLightingManager } =
            this.generateAndRegisterCameraAndLightingManagers();
        let gameMode = GamemodeFactory.initializeSpecifiedGamemode("test");

        let activeGameLevelScene =
            FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();

        // Register the scene with the camera manager and set up the camera
        primaryCameraManager.registerPrimaryGameScene(activeGameLevelScene);
        const camera = primaryCameraManager.setupGameLevelTestCamera();
        if (camera) {
            // Set the camera as the active camera for the scene
            activeGameLevelScene.activeCamera = camera;
            // Also register it with the render scene swapper
            FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[activeGameLevelScene] = camera;
        }

        let activeDemoGameplayLevel = new ActiveGameplayLevel(
            activeGameLevelScene,
            gameMode,
            levelDataComposite,
            primaryCameraManager,
            primaryLightingManager
        );

        // Ensure obstacles are properly transferred to the active gameplay level
        if (
            levelDataComposite &&
            levelDataComposite.obstacles &&
            levelDataComposite.obstacles.length > 0
        ) {
            // Ensure the level map exists
            if (!activeDemoGameplayLevel.levelMap) {
                activeDemoGameplayLevel.levelMap = {};
            }

            // Store obstacles in multiple locations to ensure they're found
            activeDemoGameplayLevel.obstacles = levelDataComposite.obstacles;
            activeDemoGameplayLevel.levelMap.obstacles = levelDataComposite.obstacles;
        }

        return activeDemoGameplayLevel;
    }

    /**
     * Runs the level audit to determine minimum strokes and optimal path.
     * Logs results to console for developer review.
     * @param {Object} levelData - The raw level JSON data
     * @param {ActiveGameplayLevel} activeGameplayLevel - The loaded gameplay level
     */
    runLevelAudit(levelData, activeGameplayLevel) {
        const auditor = this.getLevelAuditor();
        if (!auditor) {
            console.warn("[LEVEL LOADER] Level auditor not available - skipping audit");
            return;
        }

        try {
            const result = auditor.auditLevel(levelData, activeGameplayLevel);

            // Optionally generate visual map for debugging
            if (result && result.valid) {
                const parsedLevel = auditor.parseLevelData(levelData);
                auditor.generateVisualMap(parsedLevel, result);
            }
        } catch (error) {
            console.error("[LEVEL LOADER] Error running level audit:", error);
        }
    }

}
