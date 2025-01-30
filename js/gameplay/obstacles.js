class Obstacles {
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
    xPosition,
    yPosition,
    zPosition,
    pitch,
    roll,
    yaw,
    offsetX,
    offsetY,
    offsetZ,
    scale
  ) {
    this.modelId = modelId;
    this.obstacleNickname = obstacleNickname;
    this.interactionId = interactionId;
    this.directionsBlocked = directionsBlocked;

    // Create PositionedObject with default position (to be updated when placed)
    this.positionedObject = new PositionedObject(
      modelId,
      xPosition,
      yPosition,
      zPosition, // x, y, z (will be set during placement)
      offsetX,
      offsetY,
      offsetZ, // pitch, roll, yaw
      pitch,
      roll,
      yaw, // offsets
      "",
      "",
      "", // animation IDs
      scale, // scale
      false, // freeze
      true, // interactive
      false // cloneBase
    );
  }

  /**
   * Updates obstacle's position when placed in a BoardSlot
   * @param {number} x - World X coordinate
   * @param {number} y - World Y coordinate
   * @param {number} z - World Z coordinate
   */
  setWorldPosition(x, y, z) {
    this.positionedObject.setPosition(x, y, z);
  }

  /**
   * Gets reference to the underlying PositionedObject
   * @returns {PositionedObject} The positioned object instance
   */
  getPositionedObject() {
    return this.positionedObject;
  }
  /**
   * Static factory method for preset obstacles
   */
  static getObstacleByPreset(
    obstacleArchetype,
    nickname,
    interactionId,
    xPosition,
    yPosition,
    zPosition,
    scale = 1
  ) {
    let modelId = "testMountain";
    let offset = { offsetX: 0, offsetY: 0, offsetZ: 0 };
    let rotation = { pitch: 0, roll: 0, yaw: 0 };

    switch (obstacleArchetype.toLowerCase()) {
      case "mountain":
        modelId = "testMountain";
        rotation = { pitch: 0, roll: 0, yaw: 0 };
        break;
      default:
        throw new Error(`No preset found for modelId: ${modelId}`);
    }

    return new Obstacle(
      modelId,
      nickname,
      interactionId,
      xPosition,
      yPosition,
      zPosition,
      offset.offsetX,
      offset.offsetY,
      offset.offsetZ,
      rotation.pitch,
      rotation.roll,
      rotation.yaw,
      scale
    );
  }
}
