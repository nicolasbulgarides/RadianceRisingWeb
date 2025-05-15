// PositionedObject.js

/**
 * PositionedObject represents an object in the scene with positional, rotational, and scaling properties.
 * It is used to link a model with transformation data and optional animations.
 */
class PositionedObject {
  /**
   * Constructs a new PositionedObject.
   * @param {string} modelId - Unique identifier for the model.
   * @param {Object} position - Object containing x, y, z coordinates.
   * @param {Object} rotation - Object containing rotation angles.
   * @param {Object} offset - Object containing offset values to adjust position.
   * @param {string} animationID1 - First animation ID (optional).
   * @param {string} animationID2 - Second animation ID (optional).
   * @param {string} animationID3 - Third animation ID (optional).
   * @param {number} scale - Scale factor for the object.
   * @param {boolean} freeze - If true, the model is frozen for performance.
   * @param {boolean} interactive - If true, the model can be interacted with.
   * @param {boolean} cloneBase - If true, marks the model as a base model for cloning.
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
    // Default importance level for logging purposes
    this.importance = "secondary";
    this.loggingOverride = false;
    // Retrieve configuration overrides for the given modelId
    const config = AssetManifestOverrides.getConfig(modelId);
    // Apply offset adjustments using configuration data
    this.offset = new BABYLON.Vector3(
      offset.x + config.offset.x,
      offset.y + config.offset.y,
      offset.z + config.offset.z
    );
    // Apply position adjustments using configuration data
    this.position = new BABYLON.Vector3(
      position.x + config.position.x,
      position.y + config.position.y,
      position.z + config.position.z
    );
    // Apply rotation adjustments (convert degrees to radians)
    this.rotation = new BABYLON.Vector3(
      BABYLON.Tools.ToRadians(rotation.x + config.rotation.pitch),
      BABYLON.Tools.ToRadians(rotation.y + config.rotation.roll),
      BABYLON.Tools.ToRadians(rotation.z + config.rotation.yaw)
    );
    // Apply scaling adjustments using configuration data
    this.scaling = new BABYLON.Vector3(
      scale * config.scale.x,
      scale * config.scale.y,
      scale * config.scale.z
    );
    // Retrieve the model URL from AssetManifest; log error if not found
    const modelUrl = AssetManifest.getAssetUrl(modelId);
    if (modelUrl) {
      this.modelUrl = modelUrl;
    } else {
      console.error(
        `PositionedObject: URL for modelId '${modelId}' not found in AssetManifest.`
      );
      this.modelUrl = null;
    }
    // Store animation identifiers
    this.animationIDs = {
      AnimationID1: animationID1,
      AnimationID2: animationID2,
      AnimationID3: animationID3,
    };
    // Placeholder for the loaded Babylon.js model (mesh)
    this.model = null;
  }

  /**
   * Factory method to quickly create a PositionedObject with default rotation and offset.
   * @param {string} modelId - Unique identifier for the model.
   * @param {Object} position - Object containing x, y, z coordinates.
   * @param {number} scale - Scale factor for the object.
   * @param {boolean} freeze - If true, the model should be frozen for performance.
   * @param {boolean} interactive - If true, the model is interactive.
   * @param {boolean} cloneBase - If true, the model is intended for cloning.
   * @returns {PositionedObject} - A new PositionedObject with default rotation and offset.
   */
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
   * Sets the reference to the loaded Babylon.js model.
   * @param {BABYLON.AbstractMesh} model - The loaded model.
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Calculates and returns the combined position based on the object's position and offset.
   * @returns {BABYLON.Vector3} - The computed composite position.
   */
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
   * Updates the object's position and applies the corresponding offset.
   * @param {BABYLON.Vector3} positionVector - The new position.
   */
  setPosition(positionVector) {
    let adjustedX = this.offset.x + positionVector.x;
    let adjustedY = this.offset.y + positionVector.y;
    let adjustedZ = this.offset.z + positionVector.z;
    this.position = positionVector;
    this.finalizedPosition = new BABYLON.Vector3(
      adjustedX,
      adjustedY,
      adjustedZ
    );
    if (this.model) {
      this.model.position = this.finalizedPosition;
    }
  }

  setOffset(offsetVector) {
    // To be implemented if dynamic offset updates are required
  }

  /**
   * Updates the object's rotation.
   * @param {BABYLON.Vector3} rotation - The new rotation vector.
   */
  setRotation(rotation) {
    this.rotation = rotation;
    if (this.model) {
      this.model.rotation = this.rotation;
    }
  }

  /**
   * Adjusts the object's current rotation by adding the provided rotation vector.
   * @param {BABYLON.Vector3} rotation - The rotation delta to add.
   */
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

  /**
   * Unfreezes the model by converting the root mesh to an unindexed mesh, if applicable.
   */
  unfreeze() {
    if (this.model) {
      this.model.meshes[0].freezeWorldMatrix();
      this.model.meshes[0].convertToUnIndexedMesh();
    }
  }

  /**
   * Configures the model to be interactive by enabling pickability and disabling bounding info syncing.
   */
  makeInteractive() {
    if (this.model) {
      this.model.meshes[0].isPickable = false;
      this.model.meshes[0].doNotSyncBoundingInfo = true;
    }
  }

  /**
   * Updates the object's animation identifiers.
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
   * Disposes of the loaded model to free up resources.
   */
  disposeModel() {
    if (this.model) {
      this.model.meshes[0].dispose();
      this.model = null;
    }
  }
}
