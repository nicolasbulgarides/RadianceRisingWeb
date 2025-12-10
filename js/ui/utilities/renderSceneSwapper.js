/**
 * RenderSceneSwapper
 *
 * This class manages the registration and rendering of multiple Babylon.js scenes.
 * It supports dual scenes: one for the game level and one for the UI overlay.
 * Scene switching is handled by setting corresponding flags for rendering.
 */

class RenderSceneSwapper {
  constructor() {
    this.initializeStorage();
    this.loadBasicScenes();
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
  loadSceneAndBuilder(sceneId, scene) {
    if (scene && sceneId) {
      this.sceneBuilders[sceneId] = new SceneBuilder(scene);
      this.registerScene(sceneId, scene);
    } else {
      console.error(
        "Invalid scene or sceneId provided to loadSceneBuilderForScene"
      );
    }
  }
  disposeAndDeleteCamera(cameraToDispose) {
    if (cameraToDispose != null) {
      // Retrieve the scene that owns this camera.
      const scene = cameraToDispose.getScene();
      if (scene) {
        // Find and remove the camera from the scene's camera list.
        const index = scene.cameras.indexOf(cameraToDispose);
        if (index !== -1) {
          scene.cameras.splice(index, 1);
        }
      }
      // Dispose of the camera.
      cameraToDispose.dispose();
    }
  }
  /**
   * Loads the basic scenes and sets them up.
   * Creates and assigns separate SceneBuilders for each scene.
   */
  loadBasicScenes() {
    // Create separate SceneBuilders for each scene.
    this.loadSceneAndBuilder("BaseGameScene", new BaseGameWorldScene());

    // Create world loader scene (placeholder transition scene)
    this.loadSceneAndBuilder("WorldLoaderScene", new WorldLoaderScene());

    let baseUIScene =
      ResponsiveUIManager.assembleUIScreenAsInstructed("BaseGameUI");
    this.loadSceneAndBuilder("BaseUIScene", baseUIScene);

    // Set active scenes.
    this.setActiveGameLevelScene("BaseGameScene");
    this.setActiveUIScene("BaseUIScene");
  }

  /**
   * Disposes and recreates the BaseGameScene to ensure a clean slate
   * (e.g., player starts at origin for each level load).
   * @returns {BABYLON.Scene} newly created BaseGameScene instance
   */
  recreateBaseGameScene() {
    const existingScene = this.allStoredScenes["BaseGameScene"];
    if (existingScene) {
      // If the base scene is currently active, temporarily switch to world loader to avoid render errors
      if (this.activeGameScene === existingScene && this.allStoredScenes["WorldLoaderScene"]) {
        this.setActiveGameLevelScene("WorldLoaderScene");
      }

      // Dispose existing camera if we stored one
      const storedCamera = this.allStoredCameras[existingScene];
      if (storedCamera) {
        this.disposeAndDeleteCamera(storedCamera);
        delete this.allStoredCameras[existingScene];
      }

      // Dispose the scene itself
      existingScene.dispose();
      delete this.allStoredScenes["BaseGameScene"];
      delete this.sceneBuilders["BaseGameScene"];
    }

    // Create and register a fresh base game scene and builder
    const newBaseScene = new BaseGameWorldScene();
    this.loadSceneAndBuilder("BaseGameScene", newBaseScene);

    // Pre-create and store a placeholder camera so the scene is render-safe if activated later
    const placeholderCamera = CameraManager.setAndGetPlaceholderCamera(newBaseScene);
    this.allStoredCameras[newBaseScene] = placeholderCamera;
    newBaseScene.activeCamera = placeholderCamera;

    return newBaseScene;
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
    // Disable rendering on all game scenes first, but keep UI scenes untouched.
    Object.keys(this.allStoredScenes).forEach((id) => {
      const scene = this.allStoredScenes[id];
      if (scene === this.activeUIScene) {
        return; // don't disable UI
      }
      scene.isRendering = false;
    });
    const targetScene = this.allStoredScenes[sceneId];
    if (targetScene) {
      targetScene.isRendering = true;
      this.activeGameScene = targetScene;

      // Reuse an existing camera if the scene already configured one
      let cameraToUse = targetScene.activeCamera;

      // If no camera is present, fall back to the placeholder camera
      if (!cameraToUse) {
        cameraToUse = CameraManager.setAndGetPlaceholderCamera(targetScene);
      }

      // Explicitly bind the camera to the scene and cache it
      targetScene.activeCamera = cameraToUse;
      this.allStoredCameras[targetScene] = cameraToUse;
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }

    // Ensure UI scene stays rendering if it was active
    if (this.activeUIScene) {
      this.activeUIScene.isRendering = true;
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
   * Ensures a scene has a valid camera
   * Optimized to avoid redundant checks on every frame
   */
  ensureCamera(scene) {
    if (!scene) return null;
    
    // If camera is already set and valid, skip checks (performance optimization)
    if (scene.activeCamera) {
      return scene.activeCamera;
    }
    
    let cam = this.allStoredCameras[scene];
    if (!cam) {
      cam = CameraManager.setAndGetPlaceholderCamera(scene);
    }
    scene.activeCamera = cam;
    this.allStoredCameras[scene] = cam;
    return cam;
  }

  /**
   * Renders both the active game and UI scenes. It assumes that
   * the active game scene uses a specific camera (baseGameCamera).
   * Optimized to reduce per-frame overhead.
   */
  render() {
    // Render game scene if available
    if (this.activeGameScene) {
      // Only ensure camera if it's not already set (optimization)
      if (!this.activeGameScene.activeCamera) {
        this.ensureCamera(this.activeGameScene);
      }
      this.activeGameScene.render();
    }

    // Render the UI scene
    if (this.activeUIScene) {
      // Only ensure camera if it's not already set (optimization)
      if (!this.activeUIScene.activeCamera) {
        this.ensureCamera(this.activeUIScene);
      }
      this.activeUIScene.render();
    }
  }

  resizeUIDynamically() {
    //this.activeGameScene.resize();
    this.activeUIScene.scaleUIElements();
  }
}
