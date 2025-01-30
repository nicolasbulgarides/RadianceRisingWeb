class RenderSceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scenes = {}; // Stores scenes with their rendering status
    this.activeUIScene = null;
    this.activeGameScene = null;
    this.baseGameCamera = null;
  }

  /**
   * Registers a new scene with a specified ID.
   * @param {string} sceneId - The unique identifier for the scene.
   * @param {BABYLON.Scene} scene - The scene instance to be registered.
   */
  registerScene(sceneId, scene) {
    if (!this.scenes[sceneId]) {
      this.scenes[sceneId] = scene;
    } else {
      console.warn(`Scene with ID '${sceneId}' is already registered.`);
    }
  }

  /**
   * Sets the game world scene to be rendered.
   * @param {string} sceneId - The ID of the scene to render as the game world.
   */
  setActiveGameWorldScene(sceneId) {
    Object.keys(this.scenes).forEach((id) => {
      this.scenes[id].isRendering = false;
    });
    if (this.scenes[sceneId]) {
      this.scenes[sceneId].isRendering = true;
      this.activeGameScene = this.scenes[sceneId];
      console.log("Set scene to active game world scene: " + sceneId);
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }
  }

  /**
   * Sets the UI scene to be rendered on top of the game world.
   * @param {string} sceneId - The ID of the scene to render as the UI scene.
   */
  setActiveUIScene(sceneId) {
    if (this.scenes[sceneId]) {
      this.scenes[sceneId].isRendering = true;
      this.activeUIScene = this.scenes[sceneId];
      console.log("UI Scene set");
    } else {
      console.error(`Scene with ID '${sceneId}' not found.`);
    }
  }

  /**
   * Returns the active game world scene that is currently being rendered.
   * @returns {BABYLON.Scene | null} - The active game world scene, or null if none is active.
   */
  getActiveGameWorldScene() {
    console.log("ACTIVE!");
    return this.activeGameScene;
  }

  /**
   * Returns the active UI scene that is currently being rendered.
   * @returns {BABYLON.Scene | null} - The active UI scene, or null if none is active.
   */
  getActiveUIScene() {
    return this.activeUIScene;
  }

  render() {
    if (this.baseGameCamera != null) {
      //console.log("TRYING!");
      this.activeGameScene.render();
    } else {
      console.log("NULL camera!");
    }
    this.activeUIScene.render();
  }
}
