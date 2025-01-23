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
    scene = null
  ) {
    this.sceneBuilder = sceneBuilder;
    this.cameraManager = cameraManager;
    this.lightingManager = lightingManager;
    this.scene = scene;
  }

  async loadTestGrid() {
    // Initialize GridGenerator
    const tileIds = ["cube", "cube", "cube", "cube", "cube", "cube"];
    const gridGenerator = new GameGridGenerator(
      this.sceneBuilder,
      tileIds,
      this.scene
    );

    await gridGenerator.loadTiles();
    // Generate a 20x20 grid of tiles
    await gridGenerator.generateGrid(20, 1);
  }
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

    const object2 = new PositionedObject(
      "testSphereUnit",
      5,
      0,
      5,
      0,
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      1,
      false,
      false,
      false
    );

    this.sceneBuilder.loadAnimatedModel(object1);
    this.sceneBuilder.loadModel(object2);

    // this.sceneBuilder.loadModel(object5);
    //  this.sceneBuilder.loadModel(object6);

    console.log("Finished loading sphere");
    //this.cameraManager.setCameraToChase(object2.model);

    // window.animatedModelLoader.loadModel("spaceSky1", optionsPass2);

    // await this.sceneBuilder.loadSceneModel(object2);
    //  await this.sceneBuilder.loadSceneModel(object3);

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
    await this.loadTestObjects();
    await this.loadTestGrid();
    console.log("DemoWorld1: Demo world built successfully.");
  }
}

// Expose DemoWorld1 globally to make it accessible in GameInitialization
window.DemoWorld1 = DemoWorld1;
console.log("Loaded DemoWorld1.js");
