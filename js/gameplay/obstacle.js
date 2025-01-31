class Obstacle {
  /**
   * Represents an interactive obstacle placed on the game board.
   * @param {string} modelId - Model identifier from AssetManifest.
   * @param {string} obstacleNickname - Friendly name for the obstacle.
   * @param {number} interactionId - Identifier for interaction behavior.
   */
  constructor(
    modelId,
    obstacleNickname,
    interactionId,
    directionsBlocked,
    position
  ) {
    this.modelId = modelId;
    this.obstacleNickname = obstacleNickname;
    this.interactionId = interactionId;
    this.directionsBlocked = directionsBlocked;

    // Create PositionedObject with default position (to be updated when placed)
    this.positionedObject = PositionedObject.getPositionedObjectQuick(
      modelId,
      position,
      1, // scale
      true, // freeze
      false, // interactive
      false // cloneBase
    );
    //ChadUtilities.describePositionedObject(this, this.positionedObject);
  }

  disposeOfObstacleModel() {
    if (this.positionedObject.model != null) {
      this.positionedObject.model.dispose();
    }
  }
  /**
   * Updates obstacle's position when placed in a BoardSlot
   * @param {number} x - World X coordinate
   * @param {number} y - World Y coordinate
   * @param {number} z - World Z coordinate
   */
  setWorldPosition(x, y, z) {
    this.positionedObject.setPosition(new BABYLON.Vector3(x, y, z));
  }

  /**
   * Gets reference to the underlying PositionedObject
   * @returns {PositionedObject} The positioned object instance
   */
  getPositionedObject() {
    return this.positionedObject;
  }
}
