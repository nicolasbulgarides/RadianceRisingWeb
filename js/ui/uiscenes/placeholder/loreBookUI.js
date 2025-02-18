class LoreBookUI extends BABYLON.Scene {
  /**
   * LoreBookUI
   *
   * Placeholder UI scene for displaying the in-game lore book.
   * This scaffold sets up the advanced UI overlay and camera.
   * @param {BABYLON.Engine} engine - The BabylonJS engine instance.
   */
  constructor(engine) {
    super(engine);
    // Initialize UI components upon scene creation.
    this.assembleUI();
  }

  /**
   * Creates the full-screen advanced UI overlay.
   */
  initAdvancedTexture() {
    // Create a full-screen advanced UI overlay for LoreBookUI.
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "LoreBookUI",
        true,
        this
      );
    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;
  }

  /**
   * Initializes the camera for the LoreBookUI scene.
   */
  initCamera() {
    // Create and set up the primary camera for this UI scene.
    const cameraBase = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 0, 0),
      this
    );
    cameraBase.setTarget(BABYLON.Vector3.Zero());
  }

  /**
   * Assembles the LoreBookUI by setting the background color,
   * initializing the camera, and adding the advanced UI overlay.
   */
  assembleUI() {
    this.autoClear = false;
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
    this.initCamera();
    this.initAdvancedTexture();
  }
}
