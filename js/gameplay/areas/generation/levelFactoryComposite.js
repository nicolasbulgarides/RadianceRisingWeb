class LevelFactoryComposite {
  /**
   * Orchestrates the loading and setup of the game level.
   * Initializes grid, obstacles, lighting, and camera, based on level configurations.
   */

  static TILES_LOADED = false;

  async loadFactorySupportSystems() {
    // Initialize level obstacle generator
    this.levelMapObstacleGenerator = new LevelMapObstacleGenerator();
    // Instantiate grid manager for handling tile loading and grid instancing.
    this.gridManager = new GameGridGenerator();

    LevelFactoryComposite.TILES_LOADED =
      await this.gridManager.loadTilesModelsDefault();
  }

  static checkTilesLoaded() {
    // Check if the tiles are fully loaded.
    return LevelFactoryComposite.TILES_LOADED;
  }

  async renderGameplayLevel(gameplayLevel) {
    await this.gridManager.generateGrid(gameplayLevel.levelMap, 1);

    gameplayLevel.initializeLevelLighting();
  }
}
