class LevelLoaderManager {
    constructor() {
        // Initialize loading screen instance
        this.loadingScreen = null;
        this.initializeLoadingScreen();
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
        loadingScreen.destroy();

    }

    async loadLevelTest1(gameplayManager) {

        const loadingScreen = this.getLoadingScreen();

        await this.loadTilesAndFactorySupportSystems();

        let levelDataUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/" + "level1LuckyTest.txt";
        this.loadLevelFromUrl(gameplayManager, levelDataUrl);





    }

    /**
     * Loads a level from JSON data received from the server/GUI
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {Object|string} levelJsonData - The level JSON data (object or JSON string)
     */
    /**
     * Fetches JSON level data from a URL
     * @param {string} url - The URL to fetch the level JSON data from
     * @returns {Promise<Object>} The parsed JSON level data
     * @throws {Error} If the fetch fails or the response is not valid JSON
     */
    async fetchLevelJsonFromUrl(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch level data: ${response.status} ${response.statusText}`);
            }

            const levelJsonData = await response.json();
            return levelJsonData;
        } catch (error) {
            console.error("Error fetching level JSON from URL:", error);
            throw error;
        }
    }

    /**
     * Fetches level JSON from a URL and loads it into the game
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {string} url - The URL to fetch the level JSON data from
     * @returns {Promise<ActiveGameplayLevel|null>} The loaded gameplay level or null if loading failed
     */
    async loadLevelFromUrl(gameplayManager, url) {
        try {
            const levelJsonData = await this.fetchLevelJsonFromUrl(url);
            return await this.receiveLevelMapFromServer(gameplayManager, levelJsonData);
        } catch (error) {
            console.error("Error loading level from URL:", error);
            this.logFailedToLoadLevel();
            return null;
        }
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
                console.log(`[LEVEL LOADER] CollectiblePlacementManager configured with activeGameplayLevel`);
                console.log(`[LEVEL LOADER] Player registered:`, !!gameplayLevel.currentPrimaryPlayer);
            } else {
                console.error(`[LEVEL LOADER] CollectiblePlacementManager not found in FundamentalSystemBridge!`);
            }

            if (loadingScreen) {
                loadingScreen.destroy();
            }

            return gameplayLevel;
        } catch (error) {
            console.error("Error loading level from server:", error);
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

        // Find spawn position
        const spawnElement = levelData.allMapElements?.find(el => el.element === "SPAWN_POSITION");
        const spawnCoords = spawnElement?.coordinates || { x: 10, y: 10 };
        const playerStart = {
            x: spawnCoords.x,
            y: 0.25, // Default height above ground
            z: spawnCoords.y // JSON y coordinate maps to 3D z coordinate
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

        for (const mountainEl of mountainElements) {
            const coords = mountainEl.coordinates;

            // Validate coordinates exist
            if (!coords || coords.x === undefined || coords.y === undefined) {
                console.warn("Skipping mountain obstacle with invalid coordinates:", mountainEl);
                continue;
            }

            // Convert 2D coordinates to 3D position (x, y=0, z)
            // JSON uses x,y for 2D grid, where y maps to z in 3D space
            const position = new BABYLON.Vector3(
                coords.x,
                0,
                coords.y // JSON y coordinate maps to 3D z coordinate
            );

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

        // Get levelId from the activeGameplayLevel's levelDataComposite if available
        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        //console.log(`[STARDUST CREATION] Creating ${stardustElements.length} stardust pickups for levelId: ${levelId}`);
        //console.log(`[STARDUST CREATION] ActiveGameplayLevel levelDataComposite levelId:`, activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId);
        //console.log(`[STARDUST CREATION] LevelData levelName:`, levelData.levelName);

        for (const stardustEl of stardustElements) {
            const coords = stardustEl.coordinates;
            // Convert 2D coordinates to 3D position
            // JSON uses x,y for 2D grid, where y maps to z in 3D space
            const position = new BABYLON.Vector3(
                coords.x,
                0.25, // Slightly above ground
                coords.y // JSON y coordinate maps to 3D z coordinate
            );

            // Create positioned object for stardust
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const stardustObject = new PositionedObject(
                "testSphereStarRed",
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
        }
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
     * Creates a custom test level with specific dimensions and obstacles
     * @param {string} levelId - The level ID
     * @param {string} levelNickname - The level nickname
     * @param {number} width - Grid width
     * @param {number} depth - Grid depth
     * @param {Object} playerStart - Player starting position {x, y, z}
     * @param {Array} obstacles - Array of obstacle definitions (optional)
     * @returns {LevelDataComposite} The configured level data composite
     */
    createCustomTestLevel(
        levelId,
        levelNickname,
        width,
        depth,
        playerStart,
        obstacles = []
    ) {
        let levelDataComposite;

        if (obstacles.length > 0) {
            // Create a level with custom obstacles
            levelDataComposite = TestLevelDataLoader.createLevelWithObstacles(
                levelId,
                levelNickname,
                obstacles
            );
        } else {
            // Create a level with just custom dimensions
            levelDataComposite = TestLevelDataLoader.createCustomTestLevel(
                levelId,
                levelNickname,
                width,
                depth,
                playerStart
            );
        }

        return levelDataComposite;
    }

}
