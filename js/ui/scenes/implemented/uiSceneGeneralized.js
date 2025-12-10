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

    // Adjust renderScale for optimal balance between performance and quality
    // The key insight: UI should render at ~ideal resolution for crispness,
    // but not multiply by device pixel ratio (that's overkill)
    const devicePixelRatio = window.devicePixelRatio || 1;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isIOS) {
      // iPhone/iPad: These have very high DPI but we render 3D at lower res
      // UI should be crisp, so we keep it at ideal resolution (1x of ideal)
      // This gives sharp text/icons without the performance cost of 3x rendering
      this.advancedTexture.renderScale = 1;
      console.log('[UI] iOS detected, UI renderScale set to 1 (renders at ideal resolution)');
    } else if (devicePixelRatio >= 2.5) {
      // High-end Android - also use 1x for performance
      this.advancedTexture.renderScale = 1;
      console.log('[UI] High-DPI Android detected, UI renderScale set to 1');
    } else if (devicePixelRatio >= 1.5) {
      // Mid-range Android - can afford a bit more quality
      this.advancedTexture.renderScale = 1.25;
      console.log('[UI] Mid-DPI Android detected, UI renderScale set to 1.25');
    } else {
      // Low DPI devices (budget phones, older devices) - higher renderScale for quality
      this.advancedTexture.renderScale = 1.5;
      console.log('[UI] Low-DPI device detected, UI renderScale set to 1.5');
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
