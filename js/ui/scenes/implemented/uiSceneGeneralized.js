class UISceneGeneralized extends BABYLON.Scene {
  constructor(uiSceneType) {
    super(FundamentalSystemBridge["babylonEngine"]);

    // Initialize components synchronously first
    this.baseContainer = null;
    this.autoClear = false;
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
    this.initAdvancedTexture(uiSceneType);
    this.initCamera();

    // Initialize AudioEngine asynchronously for Babylon.js v8+
    this.initializeAudioEngine();

    // console.log("[UI SCENE] UI scene initialized");
  }

  async initializeAudioEngine() {
    try {
      // console.log("[UI SCENE] Ensuring AudioEngine is ready...");
      await Config.ensureAudioEngineReady();
      // console.log("[UI SCENE] AudioEngine ready for scene");
    } catch (error) {
      // console.warn("[UI SCENE] Failed to ensure AudioEngine ready:", error);
    }
  }

  assembleUIGeneralized(aspectRatioPreset) {
    this.currentAspectRatioPreset = aspectRatioPreset;
  }

  rebuildUICompletely() {
    this.advancedTexture.clear();
  }
  augmentUIDueToAspectRatioPreset(aspectRatioPreset) { }
  rebuildUIDueToResize(newAspectRatioPreset) {
    this.currentAspectRatioPreset = newAspectRatioPreset;
  }
  updateScaleFactorForFixedContainers(scaleFactor) {
    if (this.baseUIControlsContainer != null) {
      this.baseUIControlsContainer.scaleX = scaleFactor;
      this.baseUIControlsContainer.scaleY = scaleFactor;
    }
  }
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
    this.advancedTexture.idealHeight = Config.IDEAL_UI_HEIGHT;
    this.advancedTexture.idealWidth = Config.IDEAL_UI_WIDTH;
    this.advancedTexture.useSmallestIdeal = true;
    
    // Adjust renderScale based on device DPI for optimal performance
    const devicePixelRatio = window.devicePixelRatio || 1;
    if (devicePixelRatio > 2) {
      // High DPI devices (iPhone) - reduce renderScale for performance
      this.advancedTexture.renderScale = 1;
      console.log('[UI] High-DPI device detected, UI renderScale set to 1');
    } else if (devicePixelRatio > 1.5) {
      // Mid DPI devices - balanced quality/performance
      this.advancedTexture.renderScale = 1.5;
      console.log('[UI] Mid-DPI device detected, UI renderScale set to 1.5');
    } else {
      // Low DPI devices - keep higher quality
      this.advancedTexture.renderScale = 2;
      console.log('[UI] Low-DPI device detected, UI renderScale set to 2');
    }
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

  /**
   * Sets the background color for the scene.
   * @param {BABYLON.Color4} color - The new background color.
   */
  setBackgroundColor(color) {
    this.clearColor = color;
  }
}
