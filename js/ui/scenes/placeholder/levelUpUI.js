class LevelUpUI extends BABYLON.Scene {
  /**
   * LevelUpUI
   *
   * Placeholder UI scene for level up notifications.
   * Sets up advanced UI overlay and camera for level up interactions.
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
    // Create a full-screen advanced UI overlay for LevelUpUI.
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "LevelUpUI",
        true,
        this
      );
    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;
  }

  /**
   * Initializes the camera for the LevelCompleteUI scene.
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
   * Assembles the LevelUpUI by setting the background, camera,
   * and advanced UI overlay.
   */
  assembleUI() {
    this.autoClear = false;
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
    this.initCamera();
    this.initAdvancedTexture();
  }
}
