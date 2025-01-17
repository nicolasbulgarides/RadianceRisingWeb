class AnimatedModelLoader {
  /**
   * Constructor for AnimatedModelLoader.
   * Initializes basic parameters for animation control.
   */
  constructor(scene) {
    this.scene = scene;
    console.log("Modular AnimatedModelLoader initialized");
  }

  /**
   * Loads a GLB model with specified position, rotation, scale, and animation setup.
   * @param {string} assetName - Name of the asset in the AssetManifest.
   * @param {object} options - Options for model loading including position, rotation, and scale.
   * @param {number} options.x - X position in the scene.
   * @param {number} options.y - Y position in the scene.
   * @param {number} options.z - Z position in the scene.
   * @param {number} options.pitch - Pitch rotation angle (in degrees).
   * @param {number} options.yaw - Yaw rotation angle (in degrees).
   * @param {number} options.roll - Roll rotation angle (in degrees).
   * @param {number} options.scale - Scale factor for the model.
   * @returns {Promise<BABYLON.Mesh|null>} - A promise that resolves with the loaded model mesh or null if loading fails.
   */
  loadModel(assetName, optionsPass) {
    const modelUrl = AssetManifest.getAssetUrl(assetName);
    if (!modelUrl) {
      console.error(
        `AnimatedModelLoader: Asset '${assetName}' not found in AssetManifest.`
      );
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      BABYLON.SceneLoader.ImportMeshAsync(null, "", modelUrl, this.scene)
        .then((result) => {
          const root = result.meshes[0];

          if (!root) {
            console.error("No root mesh found in the model.");
            reject("No root mesh found in the model.");
            return;
          }

          // Apply transformations to the root mesh
          root.getChildMeshes().forEach((child) => {
            child.position = new BABYLON.Vector3(
              optionsPass.x,
              optionsPass.y,
              optionsPass.z
            );
            child.rotation = new BABYLON.Vector3(
              BABYLON.Tools.ToRadians(optionsPass.pitch),
              BABYLON.Tools.ToRadians(optionsPass.yaw),
              BABYLON.Tools.ToRadians(optionsPass.roll)
            );
            child.scaling = new BABYLON.Vector3(
              optionsPass.scale,
              optionsPass.scale,
              optionsPass.scale
            );
          });

          window.Logger.log(
            `Model loaded with position: x=${root.position.x}, y=${root.position.y}, z=${root.position.z}`
          );

          // Start animations if available
          if (result.animationGroups && result.animationGroups.length > 0) {
            result.animationGroups.forEach((animationGroup) => {
              animationGroup.start(true); // Loop animations
            });
          }

          resolve(root); // Resolve with the loaded mesh
        })
        .catch((error) => {
          console.error("Error loading model:", error);
          reject(error); // Reject if there's an error
        });
    });
  }
}
