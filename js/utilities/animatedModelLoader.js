// Modify AnimatedModelLoader
class AnimatedModelLoader {
  constructor(scene) {
    this.scene = scene;
    console.log("Modular AnimatedModelLoader initialized");
  }

  /**
   * Loads a GLB model using a PositionedObject.
   * @param {PositionedObject} positionedObject - The PositionedObject containing model details.
   * @returns {Promise<PositionedModel|null>} - A promise resolving to a PositionedModel instance or null if loading fails.
   */
  loadModel(positionedObject) {
    const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
    if (!modelUrl) {
      console.error(
        `AnimatedModelLoader: Asset '${positionedObject.modelId}' not found in AssetManifest.`
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

          // Apply transformations from PositionedObject
          root.position = new BABYLON.Vector3(
            positionedObject.position.x,
            positionedObject.position.y,
            positionedObject.position.z
          );
          root.rotation = new BABYLON.Vector3(
            BABYLON.Tools.ToRadians(positionedObject.rotation.pitch),
            BABYLON.Tools.ToRadians(positionedObject.rotation.yaw),
            BABYLON.Tools.ToRadians(positionedObject.rotation.roll)
          );
          root.scaling = new BABYLON.Vector3(
            positionedObject.scaling,
            positionedObject.scaling,
            positionedObject.scaling
          );

          // Start animations if available
          if (result.animationGroups && result.animationGroups.length > 0) {
            result.animationGroups.forEach((animationGroup) => {
              animationGroup.start(true); // Loop animations
            });
          }

          positionedObject.setModel(result);
          resolve(positionedObject.model);
        })
        .catch((error) => {
          console.error("Error loading model:", error);
          reject(error);
        });
    });
  }
}
