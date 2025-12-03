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
    async loadLevelTest1(gameplayManager) {
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
     * Core code thjat pulls gameplay testlevel data, currently a level full of mangos, needs to be paramaterized as of 12-2-2025
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

        // Set the active gameplay level in the CollectiblePlacementManager
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
