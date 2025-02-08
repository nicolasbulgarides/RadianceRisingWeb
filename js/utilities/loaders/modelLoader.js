/**
 * ModelLoader provides functionality to load GLB models directly from a URL into a Babylon.js scene.
 */
class ModelLoader {
  constructor() {}

  /**
   * Loads a .glb model directly from a given URL into the provided Babylon.js scene.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   * @param {string} modelUrl - The URL of the .glb model file.
   * @returns {Promise<BABYLON.SceneLoader.ImportMeshAsyncResult|null>} - The import result containing the loaded meshes, or null if loading fails.
   */
  async loadModelFromUrl(scene, modelUrl) {
    try {
      // Import the model using SceneLoader.ImportMeshAsync with a full URL
      const importResult = await BABYLON.SceneLoader.ImportMeshAsync(
        "", // Import all meshes
        "", // Empty path since full URL is provided
        modelUrl,
        scene
      );
      return importResult;
    } catch (error) {
      console.error(`Failed to load model from URL: ${modelUrl}`, error);
      return null;
    }
  }
}
