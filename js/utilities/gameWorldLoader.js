class GameWorldLoader {
  /**

    * Constructor for DemoWorld1.
    * @param {SceneBuilder} sceneBuilder - An instance of SceneBuilder to manage and load assets.
    */
  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;
    this.loadLighting();
    this.loadCamera();
    this.gridManager = new GameGridGenerator(this.sceneBuilder);
  }

  async loadDemoWorldTest() {
    const tileIds = this.getTileIdsByWorldArchetype("demoWorld");
    await this.gridManager.loadTiles(tileIds);
    this.gridManager.generateGrid(
      Config.TEST_MAP_WIDTH,
      Config.TEST_MAP_DEPTH,
      1
    );

    let demoWorldMap = new WorldMap(
      Config.TEST_MAP_WIDTH,
      Config.TEST_MAP_DEPTH
    );
    return demoWorldMap;
  }
  loadCamera() {
    this.cameraManager = new CameraManager(
      this.sceneBuilder.getGameWorldScene(),
      Config.CAMERA_PRESET,
      null
    );
  }

  loadLighting() {
    this.lightingManager = new LightingManager(
      this.sceneBuilder.getGameWorldScene(),
      Config.LIGHTING_PRESET
    );
  }

  getTileIdsByWorldArchetype(archetype) {
    const tileIds = ["tile1"];

    switch (archetype) {
      case "demoWorld":
        tileIds = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6"];
        break;
    }

    return tileIds;
  }
}
