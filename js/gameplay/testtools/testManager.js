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
      await FundamentalSystemBridge.levelFactoryComposite.loadFactorySupportSystems();
    }

    let gameplayLevel = await this.loadLevelAndPlayer(gameplayManager);
    await this.renderLevel(gameplayLevel);
    await this.levelObstacleTest();
  }
  async loadLevelAndPlayer(gameplayManager) {
    let gameplayLevel = await this.generateBasicTestLevel(gameplayManager);
    let demoPlayer = PlayerLoader.getFreshPlayer(gameplayLevel.levelMap); // Retrieve the demo player model.
    gameplayManager.loadPlayerToGameplayLevel(gameplayLevel, demoPlayer); // Load the player into the level.
    return gameplayLevel;
  }

  async generateBasicTestLevel(gameplayManager) {
    // Load level configuration (dimensions, obstacles, start position) from preset data.

    let levelMapDemo = new LevelMap(); // Create a new LevelMap instance.
    levelMapDemo.attemptToLoadMapComposite(Config.DEMO_LEVEL); // Load the demo level configuration.

    // Register camera and lighting managers for the gameplay level.
    FundamentalSystemBridge.registerPrimaryGameplayCameraManager(
      new CameraManager()
    );
    FundamentalSystemBridge.registerPrimaryGameplayLightingManager(
      new LightingManager()
    );

    // Create an active gameplay level instance with the loaded configurations.
    let activeDemoGameplayLevel = new ActiveGameplayLevel(
      FundamentalSystemBridge.renderSceneSwapper.getActiveGameLevelScene(),
      GamemodeFactory.initializeSpecifiedGamemode("DemoLevel", "standard"),
      levelMapDemo,
      FundamentalSystemBridge.primaryGameplayCameraManager,
      FundamentalSystemBridge.primaryGameplayLightingManager
    );
    gameplayManager.setActiveGameplayLevel(activeDemoGameplayLevel); // Set the loaded level as active.
    return activeDemoGameplayLevel; // Return the configured gameplay level.
  }

  async renderLevel(gameplayLevel) {
    FundamentalSystemBridge.levelFactoryComposite.renderGameplayLevel(
      gameplayLevel
    );
  }

  /**
   * A helper function to test obstacle generation within the level map.
   * Utilizes a generator to add edge mountains and initialize obstacles.
   * @param {LevelMapObstacleGenerator} generator - The generator instance for obstacles.
   */
  async levelObstacleTest() {
    let relevantSceneBuilder =
      FundamentalSystemBridge.renderSceneSwapper.getSceneBuilderForScene(
        "BaseGameScene" // Get the scene builder for the base game scene.
      );

    // Ensure the obstacle generator is initialized before generating mountains.
    let obstacleGenerator =
      FundamentalSystemBridge.levelFactoryComposite.levelMapObstacleGenerator; // Get the obstacle generator.

    obstacleGenerator.generateEdgeMountains(this, relevantSceneBuilder); // Generate edge mountains.
  }
}
