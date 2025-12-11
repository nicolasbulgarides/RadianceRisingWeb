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
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The calculated destination position
   */
  static getDestinationVector(
    direction,
    ignoreObstacles,
    maxDistance,
    activeGameplayLevel,
    relevantPlayer
  ) {
    let finalDestinationVector = null;

    if (ignoreObstacles) {
      let theoreticalPosition = this.determineTheoreticalStopPosition(
        direction,
        maxDistance,
        relevantPlayer,
        activeGameplayLevel
      );
      finalDestinationVector = this.clampStopPositionDueToBoundary(
        theoreticalPosition,
        activeGameplayLevel
      );
    } else {
      finalDestinationVector = this.determineWhenToStopDueToObstacle(
        direction,
        maxDistance,
        activeGameplayLevel,
        relevantPlayer
      );
    }

    return finalDestinationVector;
  }

  /**
   * Clamps a theoretical position to within the game level boundaries
   * @param {BABYLON.Vector3} theoreticalStopPosition - The unclamped position
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @returns {BABYLON.Vector3} The clamped position within boundaries
   */
  static clampStopPositionDueToBoundary(
    theoreticalStopPosition,
    activeGameplayLevel
  ) {
    let boundary = activeGameplayLevel.getActiveGameLevelBoundary();

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
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @returns {BABYLON.Vector3} The theoretical stop position before boundary/obstacle checks
   */
  static determineTheoreticalStopPosition(
    direction,
    maxDistance,
    relevantPlayer,
    activeGameplayLevel
  ) {
    let currentPosition = relevantPlayer.playerMovementManager.currentPosition;
    let effectiveMaxDistance = maxDistance;

    let gameModeRules = activeGameplayLevel.gameModeRules;
    // If player's gamemode uses player movement distance, use the lower value
    if (gameModeRules.USE_PLAYER_MOVEMENT_DISTANCE) {
      const playerMaxDistance =
        relevantPlayer.playerMovementManager.maxMovementDistance;

      effectiveMaxDistance = playerMaxDistance;
    } else {
      const playerMaxDistance =
        gameModeRules.currentEnforcings.maximumMovementDistance;
      effectiveMaxDistance = Math.min(maxDistance, playerMaxDistance);
    }

    let xShift = 0;
    let yShift = 0;
    let zShift = 0;

    switch (String(direction)) {
      case "UP":
        zShift = effectiveMaxDistance;
        break;
      case "DOWN":
        zShift = -effectiveMaxDistance;
        break;
      case "LEFT":
        xShift = -effectiveMaxDistance;
        break;
      case "RIGHT":
        xShift = effectiveMaxDistance;
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
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The last valid position before any obstacles
   */
  static determineWhenToStopDueToObstacle(
    direction,
    maxDistance,
    activeGameplayLevel,
    relevantPlayer
  ) {
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

      // Check if position is within bounds using ActiveGameplayLevel's boundary
      const boundary = activeGameplayLevel.getActiveGameLevelBoundary();
      if (
        nextX < boundary.minX ||
        nextX > boundary.maxX ||
        nextZ < boundary.minZ ||
        nextZ > boundary.maxZ
      ) {
        break;
      }

      // Check for obstacles using the level's obstacle data
      const obstacles = activeGameplayLevel.levelDataComposite?.obstacles || [];
      const hasObstacle = obstacles.some(
        (obstacle) =>
          obstacle.position.x === nextX &&
          obstacle.position.z === nextZ &&
          !obstacle.passthroughAllowed // Skip obstacles that allow passthrough
      );

      if (hasObstacle) {
        break;
      }

      lastValidPosition = new BABYLON.Vector3(nextX, currentPosition.y, nextZ);
    }

    return lastValidPosition;
  }
}
