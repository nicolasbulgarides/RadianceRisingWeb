// Global flag to disable level factory logging (set to false to enable logging)
const LEVEL_FACTORY_LOGGING_ENABLED = false;

// Helper function for conditional level factory logging
function levelFactoryLog(...args) {
  if (LEVEL_FACTORY_LOGGING_ENABLED) {
    console.log(...args);
  }
}

class LevelFactoryComposite {
  /**
   * Orchestrates the loading and setup of the game level.
   * Initializes grid, obstacles, lighting, and camera, based on level configurations.
   */

  static TILES_LOADED = false;

  /**
   * Ensures tiles are loaded for the given hosting scene. If tiles were loaded
   * for a previous scene (e.g., before a scene recreation), we reset and reload
   * them so new thin instances render into the current scene.
   */
  async ensureTilesLoadedForScene(hostingScene) {
    levelFactoryLog(`[LEVEL FACTORY] ensureTilesLoadedForScene called`);

    if (!this.gridManager) {
      this.gridManager = new GameGridGenerator();
    }

    // If tiles belong to a different scene or none are loaded, reset and reload
    const hasTiles = this.gridManager.loadedTiles && this.gridManager.loadedTiles.length > 0;
    const tilesScene =
      hasTiles && this.gridManager.loadedTiles[0]?.meshes
        ? this.gridManager.loadedTiles[0].meshes[0]?.getScene()
        : null;

    levelFactoryLog(`[LEVEL FACTORY] hasTiles: ${hasTiles}, tilesScene matches: ${tilesScene === hostingScene}`);

    if (!hasTiles || tilesScene !== hostingScene) {
      levelFactoryLog(`[LEVEL FACTORY] Need to reload tiles - hasTiles: ${hasTiles}, sceneMatch: ${tilesScene === hostingScene}`);

      // Reset cache
      this.gridManager.initializeStorage();
      LevelFactoryComposite.TILES_LOADED = false;

      // Get scene builder for the hosting scene
      const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
      const sceneBuilder =
        renderSceneSwapper?.getSceneBuilderByScene(hostingScene) ||
        renderSceneSwapper?.getSceneBuilderForScene("BaseGameScene");

      if (!sceneBuilder) {
        console.error("[LevelFactoryComposite] SceneBuilder not found for hosting scene; cannot load tiles");
        return false;
      }

      const loaded = await this.gridManager.loadTilesModels(
        sceneBuilder,
        GameGridGenerator.getTileIdsByLevelArchetype(),
        1
      );

      LevelFactoryComposite.TILES_LOADED = loaded;
      levelFactoryLog(`[LEVEL FACTORY] Tiles reloaded: ${loaded}, count: ${this.gridManager.loadedTiles.length}`);
      return loaded;
    }

    levelFactoryLog(`[LEVEL FACTORY] Tiles already loaded for this scene, skipping reload`);
    return LevelFactoryComposite.TILES_LOADED;
  }

  async loadFactorySupportSystems() {
    levelFactoryLog(`[LEVEL FACTORY] loadFactorySupportSystems called`);

    // Initialize level obstacle generator (only if not already initialized)
    if (!this.levelMapObstacleGenerator) {
      this.levelMapObstacleGenerator = new LevelMapObstacleGenerator();
    }

    // Instantiate grid manager for handling tile loading and grid instancing (only if not already initialized)
    if (!this.gridManager) {
      this.gridManager = new GameGridGenerator();
    }

    // Load tiles (only if not already loaded)
    if (!LevelFactoryComposite.TILES_LOADED) {
      levelFactoryLog(`[LEVEL FACTORY] Loading tiles via loadTilesModelsDefault...`);
      LevelFactoryComposite.TILES_LOADED =
        await this.gridManager.loadTilesModelsDefault();
      levelFactoryLog(`[LEVEL FACTORY] Tiles loaded: ${LevelFactoryComposite.TILES_LOADED}, count: ${this.gridManager.loadedTiles.length}`);
    } else {
      levelFactoryLog(`[LEVEL FACTORY] Tiles already loaded, skipping`);
    }

    // CRITICAL: Only create these managers ONCE to prevent losing state (e.g., isResetting flag)
    // Creating new instances would reset their state, breaking death/reset logic

    if (!FundamentalSystemBridge["microEventManager"]) {
      FundamentalSystemBridge.registerMicroEventManager(new MicroEventManager());
    }

    // Initialize collectible manager (will be configured with actual gameplay level later)
    if (!FundamentalSystemBridge["collectiblePlacementManager"]) {
      FundamentalSystemBridge.registerCollectiblePlacementManager(
        new CollectiblePlacementManager()
      );
    }

    // Initialize movement tracker and replay manager
    if (!FundamentalSystemBridge["movementTracker"]) {
      FundamentalSystemBridge.registerManager(
        "movementTracker",
        new MovementTracker(),
        MovementTracker
      );
    }

    if (!FundamentalSystemBridge["levelReplayManager"]) {
      FundamentalSystemBridge.registerManager(
        "levelReplayManager",
        new LevelReplayManager(),
        LevelReplayManager
      );
    }

    // Explosion scheduling is now handled by the stateless ExplosionScheduler
    // No manager registration needed

    // CRITICAL: LevelResetHandler must only be created once!
    // If created multiple times, the isResetting flag gets reset, allowing ghost models
    if (!FundamentalSystemBridge["levelResetHandler"]) {
      FundamentalSystemBridge.registerManager(
        "levelResetHandler",
        new LevelResetHandler(),
        LevelResetHandler
      );
    }

    if (!FundamentalSystemBridge["sequentialLevelLoader"]) {
      FundamentalSystemBridge.registerManager(
        "sequentialLevelLoader",
        new SequentialLevelLoader(),
        SequentialLevelLoader
      );
    }
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

    // Apply starfield backdrop to the scene
    if (typeof StarfieldBackdrop !== "undefined" && gameplayLevel.hostingScene) {
      // Dispose of existing backdrop if it exists
      if (gameplayLevel.starfieldBackdrop) {
        gameplayLevel.starfieldBackdrop.dispose();
      }
      // Create new starfield backdrop
      // gameplayLevel.starfieldBackdrop = new StarfieldBackdrop(gameplayLevel.hostingScene);
    }

    // Get dimensions for grid generation
    const dimensions = this.getLevelDimensions(gameplayLevel);

    // Ensure tiles are loaded for the hosting scene (handles scene recreation)
    await this.ensureTilesLoadedForScene(gameplayLevel.hostingScene);

    // Generate the grid using dimensions from the level data
    let finalizedRendering = await this.gridManager.generateGrid(
      dimensions.width,
      dimensions.depth,
      1 // Scale factor
    );

    return finalizedRendering;
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
