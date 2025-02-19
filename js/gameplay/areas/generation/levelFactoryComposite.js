class LevelFactoryComposite {
  /**
   * Orchestrates the loading and setup of the game level.
   * Initializes grid, obstacles, lighting, and camera, based on level configurations.
   */

  constructor() {
    FundamentalSystemBridge.registerLevelFactoryComposite(this);
  }

  async loadFactorySupportSystems() {
    // Instantiate grid manager for handling tile loading and grid instancing.
    this.gridManager = new GameGridGenerator();
    // Initialize level obstacle generator for the demo level.
    this.levelMapObstacleGeneator = new LevelMapObstacleGenerator();

    const tilesLoaded = await this.gridManager.loadTilesModelsDefault();
  }
  /**
   * Loads the demo level using a preset configuration.
   * Builds the level map, loads tile assets, and generates the grid.
   *
   * @returns {Promise<LevelMap>} - A Promise resolving to a fully configured LevelMap instance.
   */

  async loadDemoLevelTest() {
    // Load level configuration (dimensions, obstacles, start position) from preset data.

    let levelMapDemo = new LevelMap();
    levelMapDemo.attemptToLoadMapComposite(Config.DEMO_LEVEL);

    FundamentalSystemBridge.registerPrimaryGameplayCameraManager(
      new CameraManager()
    );
    FundamentalSystemBridge.registerPrimaryGameplayLightingManager(
      new LightingManager()
    );

    let activeDemoGameplayLevel = new ActiveGameplayLevel(
      FundamentalSystemBridge.renderSceneSwapper.getActiveGameLevelScene(),
      levelMapDemo,
      FundamentalSystemBridge.primaryGameplayCameraManager,
      FundamentalSystemBridge.primaryGameplayLightingManager
    );

    return activeDemoGameplayLevel;
  }

  async renderActiveDemoGameplayLevel(activeDemoGameplayLevelToRender) {
    await this.gridManager.generateGrid(
      activeDemoGameplayLevelToRender.levelMap,
      1
    );

    // Run any test obstacle generation functions on the current map.
    activeDemoGameplayLevelToRender.levelMap.levelObstacleTest();
    activeDemoGameplayLevelToRender.initializeLevelLighting();
  }
}
