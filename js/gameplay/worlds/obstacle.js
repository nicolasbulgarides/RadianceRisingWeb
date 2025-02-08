class Obstacle {
  /**
   * Represents an interactive obstacle on the game board.
   * Obstacles can block paths and provide specific interactions.
   *
   * @param {string} modelId - Identifier for the obstacle model (from AssetManifest).
   * @param {string} obstacleNickname - Friendly name for identification and logging.
   * @param {number} interactionId - Identifier indicating specific interaction behavior.
   * @param {string} directionsBlocked - Indicates which directions are blocked (e.g., "north", "all").
   * @param {BABYLON.Vector3} position - Initial placement position for the obstacle.
   */
  constructor(
    modelId,
    obstacleNickname,
    interactionId,
    directionsBlocked,
    position
  ) {
    // Assign properties for obstacle identification and behavior.
    this.modelId = modelId;
    this.obstacleNickname = obstacleNickname;
    this.interactionId = interactionId;
    this.directionsBlocked = directionsBlocked;

    // Create a PositionedObject instance to wrap the actual model.
    // This handles position, scaling, and additional loading flags.
    this.positionedObject = PositionedObject.getPositionedObjectQuick(
      modelId,
      position,
      1,    // Scale factor.
      true, // Freeze during loading.
      false, // Non-interactive by default.
      false  // Do not clone the base model.
    );
    // Uncomment the next line for detailed debugging information.
    // ChadUtilities.describePositionedObject(this, this.positionedObject);
  }

  /**
   * Disposes the obstacle's 3D model resource.
   * Important for freeing memory when obstacles are removed.
   */
  disposeOfObstacleModel() {
    if (this.positionedObject.model != null) {
      this.positionedObject.model.dispose();
    }
  }

  /**
   * Updates the world position of the obstacle, typically when assigning it to a board slot.
   *
   * @param {number} x - World X coordinate.
   * @param {number} y - World Y coordinate.
   * @param {number} z - World Z coordinate.
   */
  setWorldPosition(x, y, z) {
    this.positionedObject.setPosition(new BABYLON.Vector3(x, y, z));
  }

  /**
   * Retrieves the underlying PositionedObject instance.
   *
   * @returns {PositionedObject} - The instance wrapping the 3D model.
   */
  getPositionedObject() {
    return this.positionedObject;
  }
}
