// PositionedObject.js

class PositionedObject {
  /**
   * Constructor for PositionedObject.
   * @param {string} modelId - Unique identifier for the model (used to look up URL in AssetManifest).
   * @param {number} x - X position in the scene.
   * @param {number} y - Y position in the scene.
   * @param {number} z - Z position in the scene.
   * @param {number} pitch - Pitch rotation angle (in degrees).
   * @param {number} roll - Roll rotation angle (in degrees).
   * @param {number} yaw - Yaw rotation angle (in degrees).
   * @param {string} animationID1 - First animation ID to pair with specific animations.
   * @param {string} animationID2 - Second animation ID to pair with specific animations.
   * @param {string} animationID3 - Third animation ID to pair with specific animations.
   *  @param {number} scale - scale in the scene.

   * @param {boolean} freeze - if the model is frozen / doesn't move for performance
  * @param {boolean} interactive - if the model is interactive for performance
   * @param {boolean} cloneBase - if the model is a base model to be cloned for performance

   */
  constructor(
    modelId,
    x = 0,
    y = 0,
    z = 0,
    pitch = 0,
    roll = 0,
    yaw = 0,
    animationID1 = "",
    animationID2 = "",
    animationID3 = "",
    scale = 1,
    freeze = false,
    interactive = true,
    cloneBase = false
  ) {
    this.modelId = modelId;
    this.scaling = scale;
    this.freeze = freeze;
    this.interactive = interactive;
    this.cloneBase = cloneBase;

    // Retrieve the default configuration
    const config = AssetManifestOverrides.getConfig(modelId);

    // Apply default values and augmentations
    this.position = {
      x: config.position.x + x,
      y: config.position.y + y,
      z: config.position.z + z,
    };
    this.rotation = {
      pitch: config.rotation.pitch + pitch,
      roll: config.rotation.roll + roll,
      yaw: config.rotation.yaw + yaw,
    };
    this.scaling = config.scale * scale;

    // Retrieve the model URL from AssetManifest
    const modelUrl = AssetManifest.getAssetUrl(modelId);
    if (modelUrl) {
      this.modelUrl = modelUrl;
    } else {
      console.error(
        `PositionedObject: URL for modelId '${modelId}' not found in AssetManifest.`
      );
      this.modelUrl = null;
    }

    this.animationIDs = {
      AnimationID1: animationID1,
      AnimationID2: animationID2,
      AnimationID3: animationID3,
    };

    // Placeholder for the Babylon.js model (mesh) reference
    this.model = null;
  }

  /**
   * Sets the Babylon.js model reference after it has been loaded.
   * @param {BABYLON.AbstractMesh} model - The loaded Babylon.js model.
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Updates the position of the object.
   * @param {number} x - New X position.
   * @param {number} y - New Y position.
   * @param {number} z - New Z position.
   */
  setPosition(x, y, z) {
    this.position = { x, y, z };
    if (this.model) {
      this.model.position.set(x, y, z);
    }
  }

  /**
   * Updates the rotation of the object.
   * @param {number} pitch - New pitch rotation angle (in degrees).
   * @param {number} roll - New roll rotation angle (in degrees).
   * @param {number} yaw - New yaw rotation angle (in degrees).
   */
  setRotation(pitch, roll, yaw) {
    this.rotation = { pitch, roll, yaw };
    if (this.model) {
      this.model.rotation = new BABYLON.Vector3(
        BABYLON.Tools.ToRadians(pitch),
        BABYLON.Tools.ToRadians(yaw),
        BABYLON.Tools.ToRadians(roll)
      );
    }
  }

  /**
   * Updates the animation IDs for pairing the object with specific behaviors.
   * @param {string} animationID1 - Updated ID for the first animation.
   * @param {string} animationID2 - Updated ID for the second animation.
   * @param {string} animationID3 - Updated ID for the third animation.
   */
  setAnimationIDs(animationID1, animationID2, animationID3) {
    this.animationIDs = {
      AnimationID1: animationID1,
      AnimationID2: animationID2,
      AnimationID3: animationID3,
    };
  }

  /**
   * Disposes of the model if it has been loaded.
   */
  disposeModel() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      console.log(
        `PositionedObject: Model for '${this.modelId}' has been disposed.`
      );
    }
  }

  /**
   * Retrieves the full set of object properties.
   * @returns {Object} - All properties of the positioned object.
   */
  getObjectProperties() {
    return {
      modelId: this.modelId,
      modelUrl: this.modelUrl,
      position: this.position,
      rotation: this.rotation,
      animationIDs: this.animationIDs,
      scaling: this.scaling,
    };
  }
}
