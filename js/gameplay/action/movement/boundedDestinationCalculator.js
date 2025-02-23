/**
 * Handles calculation of movement destinations for bounded movement scenarios,
 * where movement is limited by a maximum distance and potentially by obstacles.
 */
class BoundedDestinationCalculator {
  /**
   * Processes movement under bounded conditions with obstacles and maximum distance.
   * @param {string} direction - The intended movement direction ("LEFT", "RIGHT", "UP", "DOWN")
   * @param {boolean} ignoreObstacles - Flag indicating if obstacles can be bypassed
   * @param {number} maxDistance - The maximum distance allowed for the movement
   * @param {GameLevelPlane} activeGameLevelPlane - The active game level plane
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The calculated destination position
   */
  static getDestinationVector(
    direction,
    ignoreObstacles,
    maxDistance,
    activeGameLevelPlane,
    relevantPlayer
  ) {
    let finalDestinationVector = null;

    if (ignoreObstacles) {
      let theoreticalPosition = this.determineTheoreticalStopPosition(
        direction,
        maxDistance,
        relevantPlayer
      );
      finalDestinationVector = this.clampStopPositionDueToBoundary(
        theoreticalPosition,
        activeGameLevelPlane
      );
    } else {
      finalDestinationVector = this.determineWhenToStopDueToObstacle(
        direction,
        maxDistance,
        activeGameLevelPlane,
        relevantPlayer
      );
    }

    return finalDestinationVector;
  }

  /**
   * Clamps a theoretical position to within the game level boundaries
   * @param {BABYLON.Vector3} theoreticalStopPosition - The unclamped position
   * @param {GameLevelPlane} activeGameLevelPlane - The active game level plane
   * @returns {BABYLON.Vector3} The clamped position within boundaries
   */
  static clampStopPositionDueToBoundary(
    theoreticalStopPosition,
    activeGameLevelPlane
  ) {
    let boundary = activeGameLevelPlane.getActiveGameLevelBoundary();

    let clampedX = Math.min(boundary.maxX, theoreticalStopPosition.x);
    clampedX = Math.max(boundary.minX, clampedX);

    let clampedZ = Math.min(boundary.maxZ, theoreticalStopPosition.z);
    clampedZ = Math.max(boundary.minZ, clampedZ);

    return new BABYLON.Vector3(clampedX, theoreticalStopPosition.y, clampedZ);
  }

  /**
   * Calculates theoretical stop position based on direction and max distance
   * @param {string} direction - Movement direction
   * @param {number} maxDistance - Maximum movement distance
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The theoretical stop position before boundary/obstacle checks
   */
  static determineTheoreticalStopPosition(
    direction,
    maxDistance,
    relevantPlayer
  ) {
    let currentPosition = relevantPlayer.playerMovementManager.currentPosition;
    let xShift = 0;
    let yShift = 0;
    let zShift = 0;

    switch (String(direction)) {
      case "UP":
        zShift = maxDistance;
        break;
      case "DOWN":
        zShift = -maxDistance;
        break;
      case "LEFT":
        xShift = -maxDistance;
        break;
      case "RIGHT":
        xShift = maxDistance;
        break;
    }

    let tentativeDestination = new BABYLON.Vector3(
      currentPosition.x + xShift,
      currentPosition.y + yShift,
      currentPosition.z + zShift
    );

    return tentativeDestination;
  }

  /**
   * Determines the last valid position before encountering an obstacle
   * @param {string} direction - Movement direction
   * @param {number} maxDistance - Maximum movement distance
   * @param {GameLevelPlane} activeGameLevelPlane - The active game level plane
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The last valid position before any obstacles
   */
  static determineWhenToStopDueToObstacle(
    direction,
    maxDistance,
    activeGameLevelPlane,
    relevantPlayer
  ) {
    const levelMap = activeGameLevelPlane.levelMap;
    const currentPosition =
      relevantPlayer.playerMovementManager.currentPosition;
    let lastValidPosition = currentPosition;

    for (let step = 0; step < maxDistance; step++) {
      let nextX = lastValidPosition.x;
      let nextZ = lastValidPosition.z;

      switch (direction) {
        case "UP":
          nextZ += 1;
          break;
        case "DOWN":
          nextZ -= 1;
          break;
        case "LEFT":
          nextX -= 1;
          break;
        case "RIGHT":
          nextX += 1;
          break;
        default:
          return lastValidPosition;
      }

      if (
        !ObstacleFinder.isWithinBounds(
          levelMap,
          nextX,
          currentPosition.y,
          nextZ
        )
      ) {
        break;
      }

      let boardSlot = levelMap.boardSlots[nextX]?.[nextZ];
      if (boardSlot && boardSlot.hostedObstacle) {
        break;
      }

      lastValidPosition = new BABYLON.Vector3(nextX, currentPosition.y, nextZ);
    }

    return lastValidPosition;
  }
}
