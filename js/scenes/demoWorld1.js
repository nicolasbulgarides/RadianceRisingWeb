// demoWorld1.js

class DemoWorld1 {
  /**
   * Constructor for DemoWorld1.
   * @param {SceneBuilder} sceneBuilder - An instance of SceneBuilder to manage and load assets.
   * @param {CameraManager} cameraManager - Optional reference to the CameraManager.
   * @param {LightingManager} lightingManager - Optional reference to the LightingManager.
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   */
  constructor(
    sceneBuilder,
    cameraManager = null,
    lightingManager = null,
    scene = null,
    gameplayManager = null
  ) {
    this.sceneBuilder = sceneBuilder;
    this.cameraManager = cameraManager;
    this.lightingManager = lightingManager;
    this.scene = scene;
    this.gameplayerManager = gameplayManager;
    this.worldMap = null;
  }

  async loadTestGrid() {
    // Initialize GridGenerator
    const gridGenerator = new GameGridGenerator(this.sceneBuilder, this.scene);

    await gridGenerator.loadTiles();
    // Generate a 20x20 grid of tiles
    await gridGenerator.generateGrid(
      Config.TEST_MAP_DEPTH,
      Config.TEST_MAP_WIDTH,
      1
    );
  }
  async addTestMountains() {}
  /**
   * Loads additional test objects.
   */
  async loadTestObjects() {
    const object1 = new PositionedObject(
      "animatedSphere",
      -10,
      10,
      -20,
      0,
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      5,
      false,
      false,
      false
    );

    this.sceneBuilder.loadAnimatedModel(object1);

    console.log("Finished loading sphere");

    // Load the sound and play it automatically once ready
    const music = new BABYLON.Sound(
      "Music",
      "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/duskReverie.mp3",
      this.scene,
      null,
      {
        loop: true,
        autoplay: false,
      }
    );

    // this.scene.clearCachedVertexData();
  }

  /**
   * Builds a demo world using SceneBuilder and other managers.
   * This is the main entry point that initializes everything.
   */
  async buildDemoWorld() {
    // Set the background color
    this.sceneBuilder.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));

    // Await each loading step to ensure complete setup

    this.worldMap = new WorldMap(Config.TEST_MAP_WIDTH, Config.TEST_MAP_DEPTH);
    await this.loadTestObjects();
    await this.loadTestGrid();
    console.log("DemoWorld1: Demo world built successfully.");
  }
}

// Expose DemoWorld1 globally to make it accessible in GameInitialization
window.DemoWorld1 = DemoWorld1;
console.log("Loaded DemoWorld1.js");
