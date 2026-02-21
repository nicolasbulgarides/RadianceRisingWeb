/**
 * AnimatedModelLoader is responsible for loading animated GLB models into the Babylon.js scene.
 * It applies transformations (position, rotation, scaling) from a PositionedObject to the loaded model.
 */

// Global flag to disable animated model loader logging (set to false to enable logging)
const ANIMATED_MODEL_LOADER_LOGGING_ENABLED = false;

// Helper function for conditional animated model loader logging
function animatedModelLog(...args) {
  if (ANIMATED_MODEL_LOADER_LOGGING_ENABLED) {
    console.log(...args);
  }
}

class AnimatedModelLoader {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Loads a GLB model using a PositionedObject.
   * @param {PositionedObject} positionedObject - The PositionedObject containing model details.
   * @returns {Promise<PositionedModel|null>} - A promise resolving to a PositionedModel instance or null if loading fails.
   */
  loadModel(positionedObject) {
    // DEBUG: Check if this is the player model being loaded during reset
    const isPlayerModel = positionedObject.modelId === "testPlayer" ||
      positionedObject.modelId === "player" ||
      positionedObject.modelId === "mechaSphereBlueBase" ||
      positionedObject.modelId?.toLowerCase().includes("player") ||
      positionedObject.modelId?.toLowerCase().includes("mecha");

    if (isPlayerModel) {
      animatedModelLog(`[ANIMATED MODEL] ▶▶▶ Loading PLAYER model: ${positionedObject.modelId}`);
      if (ANIMATED_MODEL_LOADER_LOGGING_ENABLED) {
        console.trace("[ANIMATED MODEL] Stack trace for player model load:");
      }

      // Check if we're in reset sequence
      const levelResetHandler = FundamentalSystemBridge?.["levelResetHandler"];
      if (levelResetHandler && levelResetHandler.isResetting) {
        animatedModelLog("[ANIMATED MODEL] ⛔ BLOCKED - Cannot load player model during reset!");
        return Promise.resolve(null);
      }
    }

    // Retrieve the model URL from the centralized AssetManifest
    const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
    if (!modelUrl) {
      console.error(
        `AnimatedModelLoader: Asset '${positionedObject.modelId}' not found in AssetManifest.`
      );
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      // Import the mesh from the GLB file
      BABYLON.SceneLoader.ImportMeshAsync(null, "", modelUrl, this.scene)
        .then((result) => {
          const root = result.meshes[0];
          if (!root) {
            console.error("No root mesh found in the model.");
            reject("No root mesh found in the model.");
            return;
          }
          // Apply transformations from the PositionedObject
          root.position = positionedObject.getCompositePositionBaseline();
          root.rotation = positionedObject.rotation;
          root.scaling = positionedObject.scaling;
          // Stop animations — game is turn-based; static render throttling requires no continuous animation
          if (result.animationGroups && result.animationGroups.length > 0) {
            result.animationGroups.forEach((animationGroup) => {
              animationGroup.stop();
            });
          }
          positionedObject.setModel(root, positionedObject.modelId);

          if (isPlayerModel) {
            animatedModelLog(`[ANIMATED MODEL] ✓ Player model loaded at position:`, root.position);
          }

          resolve(positionedObject.model);
        })
        .catch((error) => {
          console.error(`[ANIMATED MODEL] ✗ BABYLON loader FAILED for ${positionedObject.modelId}:`, error);
          reject(error);
        });
    });
  }
}
