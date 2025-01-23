class ModelLoader {
  constructor() {
    console.log(
      "ModelLoader initialized for loading models from a direct URL."
    );
  }

  /**
   * Loads a .glb model directly from a given URL into the Babylon.js scene.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance to load the model into.
   * @param {string} modelUrl - The URL of the .glb model file.
   * @returns {BABYLON.Mesh} - The root mesh of the loaded model.
   */
  async loadModelFromUrl(scene, modelUrl) {
    //console.log(`Attempting to load model from URL: ${modelUrl}`);

    try {
      // Import the model using SceneLoader.ImportMeshAsync directly from the URL
      const importResult = await BABYLON.SceneLoader.ImportMeshAsync(
        "", // Import all meshes
        "", // Empty path since we're using a full URL
        modelUrl, // Full URL to the .glb model
        scene // Scene to load into
      );

      // Access the root mesh of the loaded model
      // Example: Add a ground plane with a material for the scene (optional)
      //   const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 300, height: 15 }, scene);

      return importResult;
    } catch (error) {
      console.error(`Failed to load model from URL: ${modelUrl}`, error);
      return null; // Return null if loading fails
    }
  }
}
