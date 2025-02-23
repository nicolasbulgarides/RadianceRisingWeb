class MovementDestinationCalculator {
  // to do - change this so there is a specific modular game mode per level
  static getProposedDestination(
    proposedDirection,
    ponderedPlayer,
    activeGameplayLevel
  ) {
    let gamemodeRules = activeGameplayLevel.gameModeRules;

    let currentPosition = ponderedPlayer.playerMovementManager.currentPosition;

    console.log("Current: ", currentPosition);

    let destinationVector = MovementDestinationCalculator.getDestinationVector(
      proposedDirection,
      gamemodeRules,
      activeGameplayLevel,
      ponderedPlayer
    );

    MovementLogger.autoDisplayInvalidMovement(
      currentPosition,
      destinationVector
    );

    return destinationVector;
  }
  /**
   * Calculates a destination position by adding a shift vector to the starting position.
   * @param {BABYLON.Vector3} startVector - The initial position vector.
   * @param {BABYLON.Vector3} shiftVector - The vector representing positional change.
   * @returns {BABYLON.Vector3} The computed destination vector after applying the shift.
   */
  static getDeterminedDestinationVector(startVector, shiftVector) {
    let destination = new BABYLON.Vector3(
      startVector.x + shiftVector.x,
      startVector.y + shiftVector.y,
      startVector.z + shiftVector.z
    );
    return destination;
  }

  /**
   * Generates a BabylonJS vector for shifting positions.
   * @param {number} x - The X-axis component of the shift.
   * @param {number} y - The Y-axis component of the shift.
   * @param {number} z - The Z-axis component of the shift.
   * @returns {BABYLON.Vector3} A vector representing the desired shift.
   */
  static getArbitraryShiftVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  /**
   * Computes the final destination vector based on movement direction when there are no obstacles.
   * @param {string} direction - The intended direction of movement ("UP", "DOWN", "LEFT", "RIGHT").
   * @param {BABYLON.Vector3} startPosition - The starting position of the player.
   * @param {number} axisDelta - The magnitude of movement along the specified axis.
   * @returns {BABYLON.Vector3} The final destination position vector after movement.
   */
  static getFinalPositionNoObstacles(direction, startPosition, axisDelta) {
    // Default shifts for each axis are initially zero.
    let xShift = 0;
    let yShift = 0;
    let zShift = 0;

    // Convert the direction input to a string to ensure proper matching.
    let directionString = String(direction);

    // Determine which axis to adjust based on movement direction.
    if (directionString === "UP") {
      zShift += axisDelta;
    } else if (directionString === "DOWN") {
      zShift -= axisDelta;
    } else if (directionString === "LEFT") {
      xShift -= axisDelta;
    } else if (directionString === "RIGHT") {
      xShift += axisDelta;
    }

    // Generate the adjustment vector based on the computed shifts.
    let adjustmentVector =
      MovementDestinationCalculator.getArbitraryShiftVector(
        xShift,
        yShift,
        zShift
      );

    // Calculate and return the final destination vector.
    let finalPosition =
      MovementDestinationCalculator.getDeterminedDestinationVector(
        startPosition,
        adjustmentVector
      );

    return finalPosition;
  }

  /**
   * Generates a BabylonJS vector for a designated destination.
   * @param {number} x - The X-coordinate of the destination.
   * @param {number} y - The Y-coordinate of the destination.
   * @param {number} z - The Z-coordinate of the destination.
   * @returns {BABYLON.Vector3} A vector representing the destination position.
   */
  static getArbitraryDestinationVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  /**
   * Processes movement under bounded conditions with obstacles and maximum distance.
   * NOTE: The detailed implementation is pending and should handle constraints and obstacles.
   * @param {string} direction - The intended movement direction ("LEFT", "RIGHT", "UP", "DOWN").
   * @param {boolean} ignoreObstacles - Flag indicating if obstacles can be bypassed.
   * @param {number} maxDistance - The maximum distance allowed for the movement.
   * @param {BABYLON.Vector3} activeGameLevelPlane - The active game level plane.
   * @param {Player} relevantPlayer - The relevant player.
   */
  static getDestinationVectorForBoundedMovement(
    direction,
    ignoreObstacles,
    maxDistance,
    activeGameLevelPlane,
    relevantPlayer
  ) {
    // Retrieve the current player position.
    // In this example, we assume that the current position is stored as a static property.
    // Replace this with your actual method of retrieving the player's current position.
    let finalDestinationVector = null;

    // If obstacles are to be ignored, we ensure the destination remains within level boundaries.
    // Note: When obstacles are not ignored, you will add your own collision logic later.
    if (ignoreObstacles) {
      finalDestinationVector =
        MovementDestinationCalculator.clampStopPositionDueToBoundary(
          relevantPlayer,
          activeGameLevelPlane
        );
    } else if (!ignoreObstacles) {
      finalDestinationVector =
        MovementDestinationCalculator.determineWhenToStopDueToObstacle(
          direction,
          maxDistance,
          activeGameLevelPlane,
          relevantPlayer
        );
    }

    return finalDestinationVector;
  }

  static clampStopPositionDueToBoundary(
    theoreticalStopPosition,
    activeGameLevelPlane
  ) {
    let boundary = activeGameLevelPlane.getActiveGameLevelBoundary();
    // For the x-coordinate:
    let originalX = theoreticalStopPosition.x;
    let clampedX = Math.min(boundary.maxX, originalX); // First, cap at the maximum
    clampedX = Math.max(boundary.minX, clampedX); // Then, ensure it's above the minimum

    // For the z-coordinate:
    let originalZ = theoreticalStopPosition.z;
    let clampedZ = Math.min(boundary.maxZ, originalZ); // First, cap at the maximum
    clampedZ = Math.max(boundary.minZ, clampedZ); // Then, ensure it's above the minimum

    return new BABYLON.Vector3(clampedX, theoreticalStopPosition.y, clampedZ);
  }

  //Using the direction and max distance, determine the theoreticalposition which in theory could exceed a maps boundaries, as an initial phase BEFORE checking for obstacles that stop the movement
  static determineTheoreticalStopPosition(
    direction,
    maxDistance,
    relevantPlayer
  ) {
    let currentPosition = relevantPlayer.playerMovementManager.currentPosition;

    // Determine the shift vector based on the given direction and maxDistance.
    let xShift = 0;
    let yShift = 0;
    let zShift = 0;
    let directionString = String(direction);

    if (directionString === "UP") {
      zShift = maxDistance;
    } else if (directionString === "DOWN") {
      zShift = -maxDistance;
    } else if (directionString === "LEFT") {
      xShift = -maxDistance;
    } else if (directionString === "RIGHT") {
      xShift = maxDistance;
    }

    // Calculate the tentative destination vector.
    let tentativeDestination = new BABYLON.Vector3(
      currentPosition.x + xShift,
      currentPosition.y + yShift,
      currentPosition.z + zShift
    );

    return tentativeDestination;
  }
  //Determines the last valid position (capped by the max distance for a player's motion) before an obstacle is encountered
  static determineWhenToStopDueToObstacle(
    direction,
    maxDistance,
    activeGameLevelPlane,
    relevantPlayer
  ) {
    // Retrieve the level map and current player position.
    const levelMap = activeGameLevelPlane.levelMap;
    const currentPosition =
      relevantPlayer.playerMovementManager.currentPosition;
    let lastValidPosition = currentPosition;

    // Iterate one slot at a time, up to maxDistance.
    for (let step = 0; step < maxDistance; step++) {
      // Calculate the next position based on the current valid position.
      let nextX = lastValidPosition.x;
      let nextZ = lastValidPosition.z;

      // Adjust the coordinates based on the direction.
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
          console.error("Invalid direction:", direction);
          return lastValidPosition;
      }

      // Stop if the next position is out of bounds.
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

      // Stop if an obstacle is found in the next board slot.
      let boardSlot = levelMap.boardSlots[nextX]?.[nextZ];
      if (boardSlot && boardSlot.hostedObstacle) {
        break;
      }

      // Update the last valid position.
      lastValidPosition = new BABYLON.Vector3(nextX, currentPosition.y, nextZ);
    }

    return lastValidPosition;
  }

  /**
   * Determines the type of movement (bounded or unbounded) and processes it accordingly.
   * @param {string} direction - The movement direction ("LEFT", "RIGHT", "UP", "DOWN").
   * @param {boolean} unbounded - If true, movement is unbounded; otherwise, bounded.
   * @param {number} maxDistance - The maximum allowed distance for bounded movements.
   * @param {boolean} ignoreObstacles - Whether obstacles should be ignored during movement.
   */
  static getDestinationVector(
    direction,
    currentGamemodeRules,
    activeGameLevelPlane,
    relevantPlayer
  ) {
    let destinationVector = null;
    let bounded = currentGamemodeRules.MOVEMENT_IS_BOUNDED;
    let maxDistance = currentGamemodeRules.MAX_MOVEMENT_DISTANCE;
    let ignoreObstacles = currentGamemodeRules.OBSTACLES_ARE_IGNORED;

    if (!bounded) {
      // Process unbounded movement logic.

      destinationVector =
        MovementDestinationCalculator.getDestinationVectorForUnboundedMovement(
          direction,
          ignoreObstacles,
          activeGameLevelPlane,
          relevantPlayer
        );
    } else if (bounded) {
      // Process bounded movement logic according to provided constraints.

      destinationVector =
        MovementDestinationCalculator.getDestinationVectorForBoundedMovement(
          direction,
          ignoreObstacles,
          maxDistance,
          activeGameLevelPlane
        );
    }

    return destinationVector;
  }

  static getDestinationVectorForUnboundedMovement(
    direction,
    ignoreObstacles,
    activeGameLevel,
    relevantPlayer
  ) {
    // Retrieve the current player's position.
    let currentPositionVector =
      relevantPlayer.playerMovementManager.currentPosition;

    let destinationVector = null;
    if (ignoreObstacles) {
      destinationVector =
        MovementDestinationCalculator.getBoundaryDestinationVectorBypassingObstacles(
          activeGameLevel,
          direction,
          currentPositionVector
        );

      return destinationVector;
      // Initiate movement to the computed edge destination.
    } else if (!ignoreObstacles) {
      // If obstacles are considered, get the last valid position until an obstacle is encountered.
      destinationVector = ObstacleFinder.getLastValidPosition(
        activeGameLevel,
        currentPositionVector,
        direction
      );
    }

    return destinationVector;
  }

  static getBoundaryDestinationVectorBypassingObstacles(
    activeGameLevel,
    direction,
    currentPositionVector
  ) {
    // Retrieve game level boundaries to constrain movement if necessary.
    let boundary = activeGameLevel.getActiveGameLevelBoundary();
    let destinationVector = null;

    // If obstacles are to be ignored, compute the destination slightly differently.
    if (direction === "LEFT") {
      destinationVector = new BABYLON.Vector3(
        boundary.minX,
        0,
        currentPositionVector.z
      );
    } else if (direction === "RIGHT") {
      destinationVector = new BABYLON.Vector3(
        boundary.maxX,
        0,
        currentPositionVector.z
      );
    } else if (direction == "UP") {
      destinationVector = new BABYLON.Vector3(
        currentPositionVector.x,
        0,
        boundary.maxZ
      );
    } else if (direction == "DOWN") {
      destinationVector = new BABYLON.Vector3(
        currentPositionVector.x,
        0,
        boundary.minZ
      );
    }

    ChadUtilities.describeVector(
      "Destination Vector: ",
      destinationVector,
      "MovementDestinationCalculator destination vector determined"
    );
    return destinationVector;
  }
}
