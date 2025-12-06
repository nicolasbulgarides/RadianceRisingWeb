/**
 * ModelLoader provides functionality to load GLB models directly from a URL into a Babylon.js scene.
 * Includes caching to prevent reloading the same model multiple times.
 */
class ModelLoader {
  static modelCache = new Map(); // Static cache to store loaded models
  static maxConcurrentLoads = 5; // Maximum number of concurrent model loads
  static activeLoads = 0; // Current number of active loads
  static loadQueue = []; // Queue for pending model loads
  static minDelayBetweenLoads = 250; // Minimum delay between model loads in ms

  constructor() { }

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
   * Processes the next model in the loading queue
   */
  static async processQueue() {
    if (
      this.loadQueue.length === 0 ||
      this.activeLoads >= this.maxConcurrentLoads
    ) {
      return;
    }

    const { scene, modelUrl, useCache, resolve, reject } =
      this.loadQueue.shift();
    this.activeLoads++;

    try {
      // Only add delay if the model isn't already cached
      if (!this.modelCache.has(modelUrl)) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.minDelayBetweenLoads)
        );
      }

      const importResult = await BABYLON.SceneLoader.ImportMeshAsync(
        "", // Import all meshes
        "", // Empty path since full URL is provided
        modelUrl,
        scene
      );

      if (useCache) {
        this.modelCache.set(modelUrl, importResult);
      }

      resolve(importResult);
    } catch (error) {
      console.error(`Failed to load model from URL: ${modelUrl}`, error);
      reject(error);
    } finally {
      this.activeLoads--;
      this.processQueue(); // Process next item in queue
    }
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
          // If cached model belongs to the same scene, clone; otherwise re-import into the target scene
          const cachedScene =
            cachedModel.meshes && cachedModel.meshes[0]
              ? cachedModel.meshes[0].getScene()
              : null;
          if (cachedScene === scene) {
            const clonedModel = this.cloneModel(cachedModel, scene);
            return clonedModel;
          } else {
            // Different scene: import into the target scene to avoid clones bound to old scenes
            try {
              const importResult = await BABYLON.SceneLoader.ImportMeshAsync(
                "",
                "",
                modelUrl,
                scene
              );
              // Optionally update cache to the latest import
              ModelLoader.modelCache.set(modelUrl, importResult);
              return importResult;
            } catch (error) {
              console.error(
                `Failed to load model into target scene for URL: ${modelUrl}`,
                error
              );
              return null;
            }
          }
        }
      }

      // Add to queue and process
      return new Promise((resolve, reject) => {
        ModelLoader.loadQueue.push({
          scene,
          modelUrl,
          useCache,
          resolve,
          reject,
        });
        ModelLoader.processQueue();
      });
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
