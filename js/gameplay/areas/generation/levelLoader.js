class LevelLoader {
  /**
   * Orchestrates the loading and setup of the game level.
   * Initializes grid, obstacles, lighting, and camera, based on level configurations.
   *
   * @param {SceneBuilder} sceneBuilder - Instance used to load models and manage scenes.
   */

  constructor(sceneBuilder) {
    // Save the scene builder for accessing scene and asset management functions.
    this.sceneBuilder = sceneBuilder;
    // Initialize lighting early to prepare the scene.
    this.loadLighting();
    // Instantiate grid manager for handling tile loading and grid instancing.
    this.gridManager = new GameGridGenerator(this.sceneBuilder);
    // Create a camera manager with a reference to the game level scene.
    this.cameraManager = new CameraManager(
      this.sceneBuilder.getGameLevelScene()
    );
  }

  /**
   * Loads the demo level using a preset configuration.
   * Builds the level map, loads tile assets, and generates the grid.
   *
   * @returns {Promise<LevelMap>} - A Promise resolving to a fully configured LevelMap instance.
   */

  async loadDemoLevelTest() {
    // Create a new level map to hold the grid and asset data.
    let demoMap = new LevelMap();
    // Load level configuration (dimensions, obstacles, start position) from preset data.
    demoMap.attemptToLoadMapComposite(Config.DEMO_LEVEL);

    // Determine which tile IDs to load based on the level archetype.
    const tileIds = this.getTileIdsByLevelArchetype(Config.DEMO_LEVEL);

    // Load tile assets and wait until done.
    const tilesLoaded = await this.gridManager.loadTilesThenGenerateGrid(
      tileIds,
      1
    );

    if (tilesLoaded) {
      // Proceed to generate the grid only after assets are ready.
      await this.gridManager.generateGrid(demoMap, 1);
    } else {
      console.error("Failed to load tiles. Grid generation aborted.");
    }

    return demoMap;
  }

  /**
   * Sets a temporary placeholder camera.
   * Useful during loading or testing stages.
   */
  setPlaceholderCamera() {
    this.cameraManager.setPlaceholderCamera();
  }

  /**
   * Configures the camera to follow the player and sets lighting for the player model.
   *
   * @param {Player} player - The player instance to follow.
   */
  setPlayerCamera(player) {
    // Update the camera to chase the player's model.
    this.cameraManager.setCameraToChase(
      player.getPlayerPositionAndModelManager().getPlayerModelDirectly()
    );
    // Load player light using the new modular lighting system.
    this.lightingManager.loadPlayerLightFromConfigurationTemplate(
      player,
      Config.DEFAULT_PLAYER_LIGHTING_TEMPLATE
    );
  }

  /**
   * Initializes the scene's lighting manager using preset configurations.
   * Handles runtime lighting updates.
   */
  loadLighting() {
    this.lightingManager = new LightingManager(
      this.sceneBuilder.getGameLevelScene()
    );
  }

  /**
   * Called on every frame to update dynamic lighting effects.
   */
  onFrameEvents() {
    if (this.lightingManager != null) {
      this.lightingManager.processLightFrameCaller();
    }
  }

  /**
   * Returns an array of tile IDs based on the given level archetype.
   *
   * @param {string} archetype - The level preset identifier (e.g., "testLevel0").
   * @returns {Array<string>} - The list of tile IDs relevant to the level.
   */

  getTileIdsByLevelArchetype(archetype) {
    // Default tile set.
    let tileIds = ["tile1"];

    switch (archetype) {
      case "testLevel0":
        tileIds = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6"];
        break;
    }

    return tileIds;
  }
}
