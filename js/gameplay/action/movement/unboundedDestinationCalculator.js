/**
 * Handles calculation of movement destinations for unbounded movement scenarios,
 * where movement continues until reaching a boundary or obstacle.
 */
class UnboundedDestinationCalculator {
  /**
   * Calculates the destination vector for unbounded movement
   * @param {string} direction - Movement direction ("LEFT", "RIGHT", "UP", "DOWN")
   * @param {boolean} ignoreObstacles - Whether to ignore obstacles during movement
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The calculated destination position
   */
  static getDestinationVector(
    direction,
    ignoreObstacles,
    activeGameplayLevel,
    relevantPlayer
  ) {
    let currentPositionVector =
      relevantPlayer.playerMovementManager.currentPosition;

    // Ensure we have a valid current position
    if (!currentPositionVector) {
      console.error("Missing current position for player");
      return new BABYLON.Vector3(0, 0.25, 0); // Safe fallback
    }

    let destinationVector = null;

    if (ignoreObstacles) {
      destinationVector = this.getBoundaryDestinationVectorBypassingObstacles(
        activeGameplayLevel,
        direction,
        currentPositionVector
      );
    } else {
      destinationVector = this.getLastValidPosition(
        activeGameplayLevel,
        currentPositionVector,
        direction
      );
    }

    return destinationVector;
  }

  /**
   * Calculates destination vector when moving to boundary edge while ignoring obstacles
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @param {string} direction - Movement direction
   * @param {BABYLON.Vector3} currentPositionVector - Current position of the player
   * @returns {BABYLON.Vector3} The destination vector at the boundary
   */
  static getBoundaryDestinationVectorBypassingObstacles(
    activeGameplayLevel,
    direction,
    currentPositionVector
  ) {
    // Safely get boundary with fallback values
    let boundary = activeGameplayLevel?.getActiveGameLevelBoundary() || {
      minX: 0,
      maxX: 10,
      minZ: 0,
      maxZ: 10,
    };

    let destinationVector = null;

    switch (String(direction)) {
      case "LEFT":
        destinationVector = new BABYLON.Vector3(
          boundary.minX,
          currentPositionVector.y,
          currentPositionVector.z
        );
        break;
      case "RIGHT":
        destinationVector = new BABYLON.Vector3(
          boundary.maxX,
          currentPositionVector.y,
          currentPositionVector.z
        );
        break;
      case "UP":
        destinationVector = new BABYLON.Vector3(
          currentPositionVector.x,
          currentPositionVector.y,
          boundary.maxZ
        );
        break;
      case "DOWN":
        destinationVector = new BABYLON.Vector3(
          currentPositionVector.x,
          currentPositionVector.y,
          boundary.minZ
        );
        break;
    }

    return destinationVector;
  }

  /**
   * Determines the last valid position before encountering an obstacle
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @param {BABYLON.Vector3} startPosition - Starting position for the search
   * @param {string} direction - Movement direction
   * @returns {BABYLON.Vector3} The last valid position before any obstacles
   */
  static getLastValidPosition(activeGameplayLevel, startPosition, direction) {
    // Validate inputs
    if (!activeGameplayLevel || !startPosition || !direction) {
      console.error("Invalid parameters provided to getLastValidPosition:", {
        activeGameplayLevel: activeGameplayLevel ? "valid" : "null",
        startPosition: startPosition ? "valid" : "null",
        direction: direction ? "valid" : "null",
      });
      return startPosition;
    }

    // Standardize direction format
    const normalizedDirection = direction.toUpperCase().trim();

    let x = Math.floor(startPosition.x);
    let y = startPosition.y;
    let z = Math.floor(startPosition.z);

    // Begin tracking with the starting position
    let lastValidPosition = new BABYLON.Vector3(x, y, z);

    // Get boundary for bounds checking
    const boundary = activeGameplayLevel.getActiveGameLevelBoundary() || {
      minX: 0,
      maxX: 10,
      minZ: 0,
      maxZ: 10,
    };

    // Iterate until reaching an obstacle or out-of-bounds
    while (
      x >= boundary.minX &&
      x <= boundary.maxX &&
      z >= boundary.minZ &&
      z <= boundary.maxZ
    ) {
      // Check for obstacles - gather from multiple potential sources
      let allObstacles = [];

      // From levelDataComposite obstacles
      if (activeGameplayLevel.levelDataComposite?.obstacles) {
        allObstacles = allObstacles.concat(
          activeGameplayLevel.levelDataComposite.obstacles
        );
      }

      // From levelMap obstacles
      if (activeGameplayLevel.levelMap?.obstacles) {
        allObstacles = allObstacles.concat(
          activeGameplayLevel.levelMap.obstacles
        );
      }

      // From featuredObjects with isObstacle flag
      if (
        activeGameplayLevel.levelDataComposite?.levelGameplayTraitsData
          ?.featuredObjects
      ) {
        const featuredObstacles =
          activeGameplayLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects.filter(
            (obj) => obj.isObstacle
          );
        allObstacles = allObstacles.concat(featuredObstacles);
      }

      // Safely check for obstacles
      const hasObstacle = allObstacles.some((obstacle) => {
        // Skip invalid obstacles
        if (!obstacle) return false;

        // Try to get position from different possible properties
        const obstaclePos =
          obstacle.position ||
          (obstacle.positionedObject
            ? obstacle.positionedObject.position
            : null);

        // If still no valid position, skip this obstacle
        if (!obstaclePos) return false;

        // Check if position matches current cell
        return (
          Math.floor(obstaclePos.x) === x && Math.floor(obstaclePos.z) === z
        );
      });

      if (hasObstacle) {
        return lastValidPosition;
      }

      // Update the last valid position
      lastValidPosition = new BABYLON.Vector3(x, y, z);

      // Move the coordinates according to the specified direction
      switch (normalizedDirection) {
        case "UP":
          z += 1;
          break;
        case "DOWN":
          z -= 1;
          break;
        case "LEFT":
          x -= 1;
          break;
        case "RIGHT":
          x += 1;
          break;
        default:
          console.error("Invalid direction:", direction);
          return lastValidPosition;
      }
    }

    return lastValidPosition;
  }
}
