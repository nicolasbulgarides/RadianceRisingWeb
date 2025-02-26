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

  /**
   * Renders the gameplay level by initializing lighting and generating the grid
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level to render
   * @returns {Promise<boolean>} - Resolves to true if rendering was successful
   */
  async renderGameplayLevel(gameplayLevel) {
    // Initialize lighting based on level data
    gameplayLevel.initializeLevelLighting();

    // Get dimensions for grid generation
    const dimensions = this.getLevelDimensions(gameplayLevel);

    // Generate the grid using dimensions from the level data
    let finalizedRendering = await this.gridManager.generateGrid(
      dimensions.width,
      dimensions.depth,
      1 // Scale factor
    );

    return true;
  }

  /**
   * Gets the dimensions of the level for grid generation
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level
   * @returns {Object} Object containing width and depth
   */
  getLevelDimensions(gameplayLevel) {
    // If the level has a getGridDimensions method, use it
    if (typeof gameplayLevel.getGridDimensions === "function") {
      return gameplayLevel.getGridDimensions();
    }

    // If the level has a levelDataComposite with customGridSize, use it
    if (
      gameplayLevel.levelDataComposite &&
      gameplayLevel.levelDataComposite.customGridSize
    ) {
      return {
        width: gameplayLevel.levelDataComposite.customGridSize.width,
        depth: gameplayLevel.levelDataComposite.customGridSize.depth,
      };
    }

    // Fallback to level map dimensions for backward compatibility
    if (gameplayLevel.levelMap) {
      return {
        width: gameplayLevel.levelMap.mapWidth,
        depth: gameplayLevel.levelMap.mapDepth,
      };
    }

    // Default dimensions if nothing else is available
    return { width: 11, depth: 21 };
  }
}
