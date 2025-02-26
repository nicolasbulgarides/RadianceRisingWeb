class TestManager {
  /**
   * Processes test orders for the gameplay manager.
   * Loads a basic test level and sets it as the active gameplay level.
   * Also loads a demo player into the level.
   * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance to process orders for.
   */
  async processTestOrders(gameplayManager) {
    // Ensure tiles are loaded before proceeding
    if (!LevelFactoryComposite.checkTilesLoaded()) {
      await FundamentalSystemBridge[
        "levelFactoryComposite"
      ].loadFactorySupportSystems();
    }

    let gameplayLevel = await this.loadLevelAndPlayer(gameplayManager);

    if (!gameplayLevel) {
      GameplayLogger.lazyLog("Failed to load gameplay level");
      return;
    }

    let finalizedRendering = await this.renderLevel(gameplayLevel);

    if (!finalizedRendering) {
      GameplayLogger.lazyLog("Failed to render level");
      return;
    }

    // Double check that the level is properly set in the gameplay manager
    if (!gameplayManager.primaryActiveGameplayLevel) {
      gameplayManager.setActiveGameplayLevel(gameplayLevel);
    } else if (gameplayManager.primaryActiveGameplayLevel !== gameplayLevel) {
      gameplayManager.setActiveGameplayLevel(gameplayLevel);
    }

    await this.levelObstacleTest();
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

    return gameplayLevel;
  }

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
    return activeDemoGameplayLevel;
  }

  async renderLevel(gameplayLevel) {
    let finalizedRendering =
      FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(
        gameplayLevel
      );

    return finalizedRendering;
  }

  /**
   * A helper function to test obstacle generation within the level map.
   * Utilizes a generator to add edge mountains and initialize obstacles.
   * @param {LevelMapObstacleGenerator} generator - The generator instance for obstacles.
   */
  async levelObstacleTest() {
    let gameplayManagerComposite =
      FundamentalSystemBridge["gameplayManagerComposite"];

    if (gameplayManagerComposite == null) {
      GameplayLogger.lazyLog(
        "GameplayManagerComposite is null, cannot generate obstacles"
      );
      return;
    }

    let gameLevel = gameplayManagerComposite.primaryActiveGameplayLevel;

    if (gameLevel == null) {
      GameplayLogger.lazyLog("GameLevel is null, cannot generate obstacles");
      return;
    }

    if (!(gameLevel instanceof ActiveGameplayLevel)) {
      GameplayLogger.lazyLog(
        "GameLevel is not an instance of ActiveGameplayLevel, cannot generate obstacles"
      );
      return;
    }

    let relevantSceneBuilder =
      FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene(
        "BaseGameScene"
      );

    let obstacleGenerator =
      FundamentalSystemBridge["levelFactoryComposite"]
        .levelMapObstacleGenerator;

    obstacleGenerator.generateEdgeMountainsObstacles(gameLevel);
    obstacleGenerator.renderObstaclesForLevel(gameLevel, relevantSceneBuilder);
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

  checkifGameLevelisValid(gameLevel) {
    if (gameLevel == null) {
      GameplayLogger.lazyLog("GameLevel is null, cannot generate obstacles");
      return false;
    } else if (
      gameLevel != null &&
      !(gameLevel instanceof ActiveGameplayLevel)
    ) {
      GameplayLogger.lazyLog(
        "GameLevel is not an instance of ActiveGameplayLevel, cannot generate obstacles"
      );
      return false;
    } else {
      return true;
    }
  }
}
