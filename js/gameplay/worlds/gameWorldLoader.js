class GameWorldLoader {
  /**
   * Orchestrates the loading and setup of the game world.
   * Initializes grid, obstacles, lighting, and camera, based on world configurations.
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
    // Create a camera manager with a reference to the game world scene.
    this.cameraManager = new CameraManager(
      this.sceneBuilder.getGameWorldScene()
    );
  }

  /**
   * Loads the demo world using a preset configuration.
   * Builds the world map, loads tile assets, and generates the grid.
   *
   * @returns {Promise<WorldMap>} - A Promise resolving to a fully configured WorldMap instance.
   */
  async loadDemoWorldTest() {
    // Create a new world map to hold the grid and asset data.
    let demoMap = new WorldMap();
    // Load world configuration (dimensions, obstacles, start position) from preset data.
    demoMap.attemptToLoadMapComposite(Config.DEMO_WORLD);

    // Determine which tile IDs to load based on the world archetype.
    const tileIds = this.getTileIdsByWorldArchetype(Config.DEMO_WORLD);

    // Load tile assets and wait until done.
    const tilesLoaded = await this.gridManager.loadTilesThenGenerateGrid(tileIds, 1);

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
      this.sceneBuilder.getGameWorldScene(),
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
   * Returns an array of tile IDs based on the given world archetype.
   *
   * @param {string} archetype - The world preset identifier (e.g., "testWorld0").
   * @returns {Array<string>} - The list of tile IDs relevant to the world.
   */
  getTileIdsByWorldArchetype(archetype) {
    // Default tile set.
    let tileIds = ["tile1"];

    switch (archetype) {
      case "testWorld0":
        tileIds = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6"];
        break;
    }

    return tileIds;
  }
}
