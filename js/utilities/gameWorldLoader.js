class GameWorldLoader {
  /**

    * Constructor for DemoWorld1.
    * @param {SceneBuilder} sceneBuilder - An instance of SceneBuilder to manage and load assets.
    */
  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;
    this.loadLighting();
    this.gridManager = new GameGridGenerator(this.sceneBuilder);
    this.cameraManager = new CameraManager(
      this.sceneBuilder.getGameWorldScene()
    );
    console.log("Default camera loaded!");
  }

  async loadDemoWorldTest() {
    let demoMap = new WorldMap();
    demoMap.attemptToLoadMapComposite(Config.DEMO_WORLD);

    const tileIds = this.getTileIdsByWorldArchetype(Config.DEMO_WORLD);

    // Load tiles and wait for them to finish loading
    const tilesLoaded = await this.gridManager.loadTilesThenGenerateGrid(
      tileIds,
      1
    );

    if (tilesLoaded) {
      // Generate the grid only after tiles are loaded
      await this.gridManager.generateGrid(demoMap, 1);
    } else {
      console.error("Failed to load tiles. Grid generation aborted.");
    }

    return demoMap;
  }
  setPlaceholderCamera() {
    this.cameraManager.setPlaceholderCamera();
  }
  setPlayerCamera(player) {
    this.cameraManager.setCameraToChase(player);
  }

  loadLighting() {
    this.lightingManager = new LightingManager(
      this.sceneBuilder.getGameWorldScene(),
      Config.LIGHTING_PRESET
    );
  }

  onFrameEvents() {
    if (this.lightingManager != null) {
      this.lightingManager.onFrameCall();
    }
  }
  getTileIdsByWorldArchetype(archetype) {
    let tileIds = ["tile1"];

    switch (archetype) {
      case "testWorld0":
        tileIds = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6"];
        break;
    }

    return tileIds;
  }
}
