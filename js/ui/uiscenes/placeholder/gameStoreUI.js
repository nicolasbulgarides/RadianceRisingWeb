class GameStoreUI extends BABYLON.Scene {
  /**
   * GameStoreUI
   *
   * Placeholder UI scene for the in-game store.
   * Sets up the basic camera and advanced UI overlay.
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
    // Create a full-screen advanced UI overlay for the GameStoreUI.
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "GameStoreUI",
        true,
        this
      );
    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;
  }

  /**
   * Initializes the camera for the GameStoreUI scene.
   */
  initCamera() {
    // Create and set up the primary camera for the UI scene.
    const cameraBase = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 0, 0),
      this
    );
    cameraBase.setTarget(BABYLON.Vector3.Zero());
  }

  /**
   * Assembles the GameStoreUI by setting the background, camera, and advanced UI overlay.
   */
  assembleUI() {
    this.autoClear = false;
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
    this.initCamera();
    this.initAdvancedTexture();
  }
}

// Expose the GameStoreUI globally if required.
window.GameStoreUI = GameStoreUI;
