/**
 * RenderSceneSwapper
 *
 * This class manages the registration and rendering of multiple Babylon.js scenes.
 * It supports dual scenes: one for the game level and one for the UI overlay.
 * Scene switching is handled by setting corresponding flags for rendering.
 */

class RenderSceneSwapper {
  /**
   * @param {BABYLON.Engine} babylonEngine - The Babylon.js engine used for rendering.
   */
  constructor(babylonEngine) {
    FundamentalSystemBridge.registerRenderSceneSwapper(this);
    this.initializeStorage();
    if (babylonEngine instanceof BABYLON.Engine) {
      this.babylonEngine = babylonEngine;
    } else {
      this.catastropicConstruction();
    }
  }
  /**
   * Retrieves the SceneBuilder associated with the given scene instance.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   * @returns {SceneBuilder|null} The corresponding SceneBuilder instance, or null if not found.
   */
  getSceneBuilderByScene(scene) {
    // Iterate through stored SceneBuilders and return the one with the matching scene.
    for (const key in this.sceneBuilders) {
      if (this.sceneBuilders[key].scene === scene) {
        return this.sceneBuilders[key];
      }
    }
    console.warn("SceneBuilder for the provided scene reference not found.");
    return null;
  }
  /**
   * Creates and registers a SceneBuilder for a specific scene.
   * @param {string} sceneId - The unique identifier for the scene.
   * @param {BABYLON.Scene} scene - The scene instance for which to build.
   */
  loadSceneBuilderForScene(sceneId, scene) {
    if (scene && sceneId) {
      this.sceneBuilders[sceneId] = new SceneBuilder(scene);
    } else {
      console.error(
        "Invalid scene or sceneId provided to loadSceneBuilderForScene"
      );
    }
  }
  /**
   * Loads the basic scenes and sets them up.
   * Creates and assigns separate SceneBuilders for each scene.
   */
  loadBasicScenes() {
    // Initialize the game scene.
    this.baseGameScene = new BABYLON.Scene(this.babylonEngine);
    this.baseGameScene.clearColor = new BABYLON.Color3(255, 0, 0);
    // Initialize the UI scene.
    this.baseUIScene = new BaseGameUI(this.babylonEngine);

    // Create separate SceneBuilders for each scene.
    this.loadSceneBuilderForScene("BaseGameScene", this.baseGameScene);
    this.loadSceneBuilderForScene("BaseUIScene", this.baseUIScene);

    // Register scenes with a unique identifier.
    this.registerScene("BaseUIScene", this.baseUIScene);
    this.registerScene("BaseGameScene", this.baseGameScene);

    // Set active scenes.
    this.setActiveGameLevelScene("BaseGameScene");
    this.setActiveUIScene("BaseUIScene");

    this.allStoredCameras[this.baseGameScene] =
      CameraManager.setAndGetPlaceholderCamera(this.baseGameScene);
    // Set the placeholder camera (typically for debugging or an initial view).
  }

  catastropicConstruction() {
    let catastrophe =
      "RenderSceneManager constructor - Babylon Engine not an instance of BABYLON.Engine!";
    CatastropheManager.logCatastrophe(catastrophe);
    InitializationDiagnosticsLogger.logPhaseError(
      "RenderSceneManager constructor - Babylon Engine not an instance of BABYLON.Engine!",
      catastrophe
    );
    CatastropheManager.displayCatastrophePage();
  }
  /**
   * Returns the SceneBuilder associated with the given scene ID.
   * @param {string} sceneId - The unique identifier for the scene.
   * @returns {SceneBuilder|null} The corresponding SceneBuilder instance, or null if not found.
   */
  getSceneBuilderForScene(sceneId) {
    if (this.sceneBuilders[sceneId]) return this.sceneBuilders[sceneId];
    console.warn(`SceneBuilder with ID '${sceneId}' not found.`);
    return null;
  }
  initializeStorage() {
    // Dictionary to store scenes by a unique ID.
    this.allStoredScenes = {};
    this.sceneBuilders = {};
    this.allStoredCameras = {};

    this.fundamentalTestingScene = null;
    // References to the active UI and game scenes.
    this.activeUIScene = null;
    this.activeGameScene = null;
    // An optional base game camera reference, if needed.
    this.baseGameCamera = null;
  }

  /**
   * Initializes the fundamental testing scene, used for diagnostics or experimental purposes.
   */
  initializeFundamentalTestingScene() {
    this.fundamentalTestingScene = new BABYLON.Scene(this.babylonEngine);
  }

  /**
   * Registers a new scene with a unique identifier.
   * @param {string} sceneId - The unique ID for the scene.
   * @param {BABYLON.Scene} scene - The scene instance to register.
   */
  registerScene(sceneId, scene) {
    if (!this.allStoredScenes[sceneId]) {
      this.allStoredScenes[sceneId] = scene;
    } else {
      console.warn(`Scene with ID '${sceneId}' is already registered.`);
    }
  }

  /**
   * Sets the specified scene as the active game level scene and disables rendering
   * for all other scenes.
   * @param {string} sceneId - The ID of the scene to use as the game level.
   */

  setActiveGameLevelScene(sceneId) {
    // Disable rendering on all scenes first.
    Object.keys(this.allStoredScenes).forEach((id) => {
      this.allStoredScenes[id].isRendering = false;
    });
    if (this.allStoredScenes[sceneId]) {
      this.allStoredScenes[sceneId].isRendering = true;
      this.activeGameScene = this.allStoredScenes[sceneId];
      // Debug log: active game level scene set.
      // console.log("Set active game level scene: " + sceneId);
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }
  }

  /**
   * Sets the specified scene as the active UI scene.
   * @param {string} sceneId - The ID of the scene to use as the UI overlay.
   */
  setActiveUIScene(sceneId) {
    if (this.allStoredScenes[sceneId]) {
      this.allStoredScenes[sceneId].isRendering = true;
      this.activeUIScene = this.allStoredScenes[sceneId];
      // Debug log: active UI scene set.
      // console.log("UI Scene set");
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }
  }

  /**
   * Returns the active game level scene.
   * @returns {BABYLON.Scene|null} The active game level scene or null if none is active.
   */

  getActiveGameLevelScene() {
    // Debug log can be enabled for troubleshooting.
    // console.log("Returning active game level scene");
    return this.activeGameScene;
  }

  /**
   * Returns the active UI scene.
   * @returns {BABYLON.Scene|null} The active UI scene or null if none is active.
   */
  getActiveUIScene() {
    return this.activeUIScene;
  }

  getSceneByName(sceneName) {
    return this.allStoredScenes[sceneName];
  }

  /**
   * Renders both the active game and UI scenes. It assumes that
   * the active game scene uses a specific camera (baseGameCamera).
   * //to do add a check for the camera.
   */
  render() {
    if (true) {
      // Render the game scene.
      this.activeGameScene.render();
    } else {
      console.log("NULL camera!");
    }
    // Render the UI scene.
    this.activeUIScene.render();
  }
}
