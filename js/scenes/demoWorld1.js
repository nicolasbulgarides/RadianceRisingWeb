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
    const tileIds = [
      "testTile1",
      "testTile2",
      "testTile3",
      "testTile4",
      "testTile5",
      "testTile6",
    ];
    const gridGenerator = new GameGridGenerator(
      this.sceneBuilder,
      tileIds,
      this.scene
    );

    await gridGenerator.loadTiles();
    // Generate a 20x20 grid of tiles
    await gridGenerator.generateGrid();
  }
  /**
   * Loads additional test objects.
   */
  async loadTestObjects() {
    /** 
    const object = new PositionedObject(
      "animatedSphere",
      0,
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      100,
      true,
      false,
      true
    );
*/
    const optionsPass = {
      x: -10,
      y: 10,
      z: -20,
      pitch: 0,
      yaw: 0,
      roll: 0,
      scale: 5,
    };

    const optionsPass2 = {
      x: 0,
      y: 0,
      z: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      scale: 2,
    };
    await window.animatedModelLoader.loadModel("animatedSphere", optionsPass);
    await window.animatedModelLoader.loadModel("spaceSky1", optionsPass2);

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
        autoplay: true,
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
