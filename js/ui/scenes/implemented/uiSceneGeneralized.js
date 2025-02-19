class UISceneGeneralized extends BABYLON.Scene {
  constructor(engine, uiSceneType) {
    super(engine);
    this.baseContainer = null;
    this.autoClear = false;
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
    this.initAdvancedTexture(uiSceneType);
    this.assembleUI();
    this.initCamera();
  }

  assembleUI() {}
  /**
   * Creates the full-screen advanced UI overlay.
   */
  initAdvancedTexture(uiSceneType) {
    // Create a full-screen advanced UI overlay over the scene
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        uiSceneType,
        true,
        this
      );
    // Set ideal width/height and scaling options for resolution independence
    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;
  }
  /**
   * Initializes the camera for the UI scene.
   */
  initCamera() {
    // Create and set up the primary camera for the UI scene
    const cameraBase = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 0, 0),
      this
    );
    cameraBase.setTarget(BABYLON.Vector3.Zero());
  }
  updateScaleBasedOnWindowWidth() {
    // For example, using the width as the baseline

    if (this.baseContainer != null) {
      const scaleFactor = window.innerWidth / Config.IDEAL_UI_WIDTH;
      this.baseContainer.scaleX = scaleFactor;
      this.baseContainer.scaleY = scaleFactor;
    }
  }
  updateScaleBasedOnWindowHeight() {
    // For example, using the width as the baseline

    if (this.baseContainer != null) {
      const scaleFactor = window.innerHeight / Config.IDEAL_UI_HEIGHT;
      this.baseContainer.scaleX = scaleFactor;
      this.baseContainer.scaleY = scaleFactor;
    }
  }

  /**
   * Sets the background color for the scene.
   * @param {BABYLON.Color4} color - The new background color.
   */
  setBackgroundColor(color) {
    this.clearColor = color;
  }
}
