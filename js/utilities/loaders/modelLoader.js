/**
 * ModelLoader provides functionality to load GLB models directly from a URL into a Babylon.js scene.
 * Includes caching to prevent reloading the same model multiple times.
 */
class ModelLoader {
  static modelCache = new Map(); // Static cache to store loaded models

  constructor() {}

  /**
   * Gets a cached model or loads it if not in cache
   * @param {string} modelUrl - The URL of the model
   * @returns {Promise<BABYLON.SceneLoader.ImportMeshAsyncResult|null>} - The cached or newly loaded model
   */
  static async getCachedModel(modelUrl) {
    if (this.modelCache.has(modelUrl)) {
      return this.modelCache.get(modelUrl);
    }
    return null;
  }

  /**
   * Loads a .glb model directly from a given URL into the provided Babylon.js scene.
   * Will use cached model if available.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   * @param {string} modelUrl - The URL of the .glb model file.
   * @param {boolean} useCache - Whether to use cached model if available
   * @returns {Promise<BABYLON.SceneLoader.ImportMeshAsyncResult|null>} - The import result containing the loaded meshes, or null if loading fails.
   */
  async loadModelFromUrl(scene, modelUrl, useCache = true) {
    try {
      // Check cache first if enabled
      if (useCache) {
        const cachedModel = await ModelLoader.getCachedModel(modelUrl);
        if (cachedModel) {
          // Clone the cached model for this instance
          const clonedModel = this.cloneModel(cachedModel, scene);
          return clonedModel;
        }
      }

      // Import the model using SceneLoader.ImportMeshAsync with a full URL
      const importResult = await BABYLON.SceneLoader.ImportMeshAsync(
        "", // Import all meshes
        "", // Empty path since full URL is provided
        modelUrl,
        scene
      );

      // Cache the model if caching is enabled
      if (useCache) {
        ModelLoader.modelCache.set(modelUrl, importResult);
      }

      return importResult;
    } catch (error) {
      console.error(`Failed to load model from URL: ${modelUrl}`, error);
      return null;
    }
  }

  /**
   * Clones a cached model for reuse
   * @param {BABYLON.SceneLoader.ImportMeshAsyncResult} cachedModel - The cached model to clone
   * @param {BABYLON.Scene} scene - The scene to clone into
   * @returns {BABYLON.SceneLoader.ImportMeshAsyncResult} - The cloned model
   */
  cloneModel(cachedModel, scene) {
    const clonedMeshes = [];
    const clonedSkeletons = [];
    const clonedAnimationGroups = [];

    // Clone all meshes
    cachedModel.meshes.forEach((mesh) => {
      const clonedMesh = mesh.clone();
      clonedMesh.setEnabled(true);
      clonedMeshes.push(clonedMesh);
    });

    // Clone all skeletons
    cachedModel.skeletons.forEach((skeleton) => {
      const clonedSkeleton = skeleton.clone();
      clonedSkeletons.push(clonedSkeleton);
    });

    // Clone all animation groups
    cachedModel.animationGroups.forEach((animationGroup) => {
      const clonedAnimationGroup = animationGroup.clone();
      clonedAnimationGroups.push(clonedAnimationGroup);
    });

    return {
      meshes: clonedMeshes,
      skeletons: clonedSkeletons,
      animationGroups: clonedAnimationGroups,
    };
  }

  /**
   * Clears the model cache
   */
  static clearCache() {
    this.modelCache.clear();
  }
}
