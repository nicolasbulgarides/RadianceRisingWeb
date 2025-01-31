// PositionedObject.js

class PositionedObject {
  /**
   * Constructor for PositionedObject.
   * @param {string} modelId - Unique identifier for the model (used to look up URL in AssetManifest).
   * @param {number} position 
   * @param {number} rotation
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
    position,
    rotation,
    offset,
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
    this.baseMesh = null;

    // Retrieve the default configuration
    const config = AssetManifestOverrides.getConfig(modelId);
    // Apply default values and augmentations
    this.offset = new BABYLON.Vector3(
      offset.x + config.offset.x,
      offset.y + config.offset.y,
      offset.z + config.offset.z
    );

    // Apply default values and augmentations
    this.position = new BABYLON.Vector3(
      position.x + config.position.x,
      position.y + config.position.y,
      position.z + config.position.z
    );

    this.rotation = new BABYLON.Vector3(
      BABYLON.Tools.ToRadians(rotation.x + config.rotation.pitch),
      BABYLON.Tools.ToRadians(rotation.y + config.rotation.roll),
      BABYLON.Tools.ToRadians(rotation.z + config.rotation.yaw)
    );
    this.scaling = new BABYLON.Vector3(
      scale * config.scale.x,
      scale * config.scale.y,
      scale * config.scale.z
    );
    //console.log("Scale: ", this.scaling);

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

  static getPositionedObjectQuick(
    modelId,
    position,
    scale,
    freeze,
    interactive,
    cloneBase
  ) {
    let offset = new BABYLON.Vector3(0, 0, 0);
    let rotation = new BABYLON.Vector3(0, 0, 0);

    let object = new PositionedObject(
      modelId,
      position,
      rotation,
      offset,
      "",
      "",
      "",
      scale,
      freeze,
      interactive,
      cloneBase
    );

    return object;
  }

  /**
   * Sets the Babylon.js model reference after it has been loaded.
   * @param {BABYLON.AbstractMesh} model - The loaded Babylon.js model.
   */
  setModel(model) {
    this.model = model;
    //console.log("Model set! ", name);
  }

  getCompositePositionBaseline() {
    let adjustedX = this.offset.x + this.position.x;
    let adjustedY = this.offset.y + this.position.y;
    let adjustedZ = this.offset.z + this.position.z;

    let finalizedPosition = new BABYLON.Vector3(
      adjustedX,
      adjustedY,
      adjustedZ
    );
    return finalizedPosition;
  }

  /**
   * Updates the position of the object.
   * @param {number} x - New X position.
   * @param {number} y - New Y position.
   * @param {number} z - New Z position.
   */
  setPosition(positionVector) {
    if (!this.model) {
      return;
    } else {
      let adjustedX = this.offset.x + positionVector.x;
      let adjustedY = this.offset.y + positionVector.y;
      let adjustedZ = this.offset.z + positionVector.z;

      this.position = positionVector;

      this.finalizedPosition = new BABYLON.Vector3(
        adjustedX,
        adjustedY,
        adjustedZ
      );
      this.model.position = this.finalizedPosition;
    }
  }

  /**
   * Updates the rotation of the object.
   * @param {number} pitch - New pitch rotation angle (in degrees).
   * @param {number} roll - New roll rotation angle (in degrees).
   * @param {number} yaw - New yaw rotation angle (in degrees).
   */
  setRotation(rotation) {
    this.rotation = rotation;
    if (this.model) {
      this.model.rotation = this.rotation;
    }
  }

  adjustRotation(rotation) {
    let totalRotation = new BABYLON.Vector3(
      this.rotation.x + rotation.x,
      this.rotation.y + rotation.y,
      this.rotation.z + rotation.z
    );
    this.rotation = totalRotation;
    if (this.model) {
      this.model.rotation = this.rotation;
    }
  }

  unfreeze() {
    if (this.model) {
      this.model.meshes[0].freezeWorldMatrix();
      this.model.meshes[0].convertToUnIndexedMesh();
    }
  }
  makeInteractive() {
    if (this.model) {
      this.model.meshes[0].isPickable = false;
      this.model.meshes[0].doNotSyncBoundingInfo = true;
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
      offset: this.offset,
      rotation: this.rotation,
      animationIDs: this.animationIDs,
      scaling: this.scaling,
    };
  }
}
