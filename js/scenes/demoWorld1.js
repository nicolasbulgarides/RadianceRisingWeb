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

  /**
   * Loads additional test objects.
   */
  async loadTestObjects() {
    const object = new PositionedObject(
      "cube",
      0,
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      1
    );

    await this.sceneBuilder.loadSceneModel(object);

    // Load the sound and play it automatically once ready
    const music = new BABYLON.Sound(
      "Music",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/duskReverie.mp3",
      this.scene,
      null,
      {
        loop: true,
        autoplay: true,
      }
    );

    this.scene.clearCachedVertexData();
  }

  /**
   * Builds a demo world using SceneBuilder and other managers.
   * This is the main entry point that initializes everything.
   */
  async buildDemoWorld() {
    // Set the background color
    this.sceneBuilder.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
    /**
     *     const light = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(0, 10, 2),
      this.scene
    );

    const light2 = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(2, 0, 5),
      this.scene
    );
    const light3 = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(-2, 0, 5),
      this.scene
    );
    light.intensity = 1000;
    light2.intensity = 1000;
    light3.intensity = 1000;
     */

    // Await each loading step to ensure complete setup
    await this.loadTestObjects();

    console.log("DemoWorld1: Demo world built successfully.");
  }
}

// Expose DemoWorld1 globally to make it accessible in GameInitialization
window.DemoWorld1 = DemoWorld1;
console.log("Loaded DemoWorld1.js");
