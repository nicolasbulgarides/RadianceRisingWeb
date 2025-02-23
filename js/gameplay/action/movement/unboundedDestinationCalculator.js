/**
 * Handles calculation of movement destinations for unbounded movement scenarios,
 * where movement continues until reaching a boundary or obstacle.
 */
class UnboundedDestinationCalculator {
  /**
   * Calculates the destination vector for unbounded movement
   * @param {string} direction - Movement direction ("LEFT", "RIGHT", "UP", "DOWN")
   * @param {boolean} ignoreObstacles - Whether to ignore obstacles during movement
   * @param {GameLevelPlane} activeGameLevel - The active game level
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The calculated destination position
   */
  static getDestinationVector(
    direction,
    ignoreObstacles,
    activeGameLevel,
    relevantPlayer
  ) {
    let currentPositionVector =
      relevantPlayer.playerMovementManager.currentPosition;
    let destinationVector = null;

    if (ignoreObstacles) {
      destinationVector = this.getBoundaryDestinationVectorBypassingObstacles(
        activeGameLevel,
        direction,
        currentPositionVector
      );
    } else {
      destinationVector = ObstacleFinder.getLastValidPosition(
        activeGameLevel,
        currentPositionVector,
        direction
      );
    }

    return destinationVector;
  }

  /**
   * Calculates destination vector when moving to boundary edge while ignoring obstacles
   * @param {GameLevelPlane} activeGameLevel - The active game level
   * @param {string} direction - Movement direction
   * @param {BABYLON.Vector3} currentPositionVector - Current position of the player
   * @returns {BABYLON.Vector3} The destination vector at the boundary
   */
  static getBoundaryDestinationVectorBypassingObstacles(
    activeGameLevel,
    direction,
    currentPositionVector
  ) {
    let boundary = activeGameLevel.getActiveGameLevelBoundary();
    let destinationVector = null;

    switch (String(direction)) {
      case "LEFT":
        destinationVector = new BABYLON.Vector3(
          boundary.minX,
          0,
          currentPositionVector.z
        );
        break;
      case "RIGHT":
        destinationVector = new BABYLON.Vector3(
          boundary.maxX,
          0,
          currentPositionVector.z
        );
        break;
      case "UP":
        destinationVector = new BABYLON.Vector3(
          currentPositionVector.x,
          0,
          boundary.maxZ
        );
        break;
      case "DOWN":
        destinationVector = new BABYLON.Vector3(
          currentPositionVector.x,
          0,
          boundary.minZ
        );
        break;
    }

    return destinationVector;
  }
}
