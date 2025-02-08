/**
 * RenderSceneManager
 *
 * This class manages the registration and rendering of multiple Babylon.js scenes.
 * It supports dual scenes: one for the game world and one for the UI overlay.
 * Scene switching is handled by setting corresponding flags for rendering.
 */
class RenderSceneManager {
  /**
   * @param {BABYLON.Engine} engine - The Babylon.js engine used for rendering.
   */
  constructor(engine) {
    this.engine = engine;
    // Dictionary to store scenes by a unique ID.
    this.scenes = {};
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
    if (!this.scenes[sceneId]) {
      this.scenes[sceneId] = scene;
    } else {
      console.warn(`Scene with ID '${sceneId}' is already registered.`);
    }
  }

  /**
   * Sets the specified scene as the active game world scene and disables rendering
   * for all other scenes.
   * @param {string} sceneId - The ID of the scene to use as the game world.
   */
  setActiveGameWorldScene(sceneId) {
    // Disable rendering on all scenes first.
    Object.keys(this.scenes).forEach((id) => {
      this.scenes[id].isRendering = false;
    });
    if (this.scenes[sceneId]) {
      this.scenes[sceneId].isRendering = true;
      this.activeGameScene = this.scenes[sceneId];
      // Debug log: active game world scene set.
      // console.log("Set active game world scene: " + sceneId);
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }
  }

  /**
   * Sets the specified scene as the active UI scene.
   * @param {string} sceneId - The ID of the scene to use as the UI overlay.
   */
  setActiveUIScene(sceneId) {
    if (this.scenes[sceneId]) {
      this.scenes[sceneId].isRendering = true;
      this.activeUIScene = this.scenes[sceneId];
      // Debug log: active UI scene set.
      // console.log("UI Scene set");
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }
  }

  /**
   * Returns the active game world scene.
   * @returns {BABYLON.Scene|null} The active game scene or null if none is active.
   */
  getActiveGameWorldScene() {
    // Debug log can be enabled for troubleshooting.
    // console.log("Returning active game world scene");
    return this.activeGameScene;
  }

  /**
   * Returns the active UI scene.
   * @returns {BABYLON.Scene|null} The active UI scene or null if none is active.
   */
  getActiveUIScene() {
    return this.activeUIScene;
  }

  /**
   * Renders both the active game and UI scenes. It assumes that
   * the active game scene uses a specific camera (baseGameCamera).
   */
  render() {
    if (this.baseGameCamera != null) {
      // Render the game scene.
      this.activeGameScene.render();
    } else {
      console.log("NULL camera!");
    }
    // Render the UI scene.
    this.activeUIScene.render();
  }
}
