/**
 * MovementPathManager class
 *
 * This class is responsible for calculating and managing movement paths for a player in the game level.
 * It integrates player movement with the game level boundaries, obstacles, and animations, ensuring
 * that movement follows the game rules. All movement vectors are constructed using BabylonJS conventions.
 */

class MovementPathManager {
  /**
   * Creates an instance of MovementPathManager.
   * @param {Object} player - The player entity controlled by this manager.
   * @param {Object} level - The game level in which the movement is processed.
   */

  //to do / TODO - refactor for multiplayer

  constructor(player, level) {
    // Store the active level and player references.
    this.activeLevel = level;
    this.activePlayer = player;
    // Initialize the player's model movement manager which handles model animations.
    this.playerModelMovementManager = new PlayerModelMovementManager(
      this.activePlayer
    );
  }

  /**
   * Sets or updates the active game level.
   * @param {Object} levelToSet - A new level object to be used as the active level.
   */
  setActiveLevel(levelToSet) {
    this.activeLevel = levelToSet;
  }

  /**
   * Generates a BabylonJS vector for shifting positions.
   * @param {number} x - The X-axis component of the shift.
   * @param {number} y - The Y-axis component of the shift.
   * @param {number} z - The Z-axis component of the shift.
   * @returns {BABYLON.Vector3} A vector representing the desired shift.
   */
  getArbitraryShiftVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  /**
   * Generates a BabylonJS vector for a designated destination.
   * @param {number} x - The X-coordinate of the destination.
   * @param {number} y - The Y-coordinate of the destination.
   * @param {number} z - The Z-coordinate of the destination.
   * @returns {BABYLON.Vector3} A vector representing the destination position.
   */
  getArbitraryDestinationVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  /**
   * Calculates a destination position by adding a shift vector to the starting position.
   * @param {BABYLON.Vector3} startVector - The initial position vector.
   * @param {BABYLON.Vector3} shiftVector - The vector representing positional change.
   * @returns {BABYLON.Vector3} The computed destination vector after applying the shift.
   */
  getDeterminedDestinationVector(startVector, shiftVector) {
    let destination = new BABYLON.Vector3(
      startVector.x + shiftVector.x,
      startVector.y + shiftVector.y,
      startVector.z + shiftVector.z
    );
    return destination;
  }

  /**
   * Computes the final destination vector based on movement direction when there are no obstacles.
   * @param {string} direction - The intended direction of movement ("UP", "DOWN", "LEFT", "RIGHT").
   * @param {BABYLON.Vector3} startPosition - The starting position of the player.
   * @param {number} axisDelta - The magnitude of movement along the specified axis.
   * @returns {BABYLON.Vector3} The final destination position vector after movement.
   */
  getFinalPositionNoObstacles(direction, startPosition, axisDelta) {
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
    let adjustmentVector = this.getArbitraryShiftVector(xShift, yShift, zShift);

    // Calculate and return the final destination vector.
    let finalPosition = this.getDeterminedDestinationVector(
      startPosition,
      adjustmentVector
    );

    return finalPosition;
  }

  getBoundaryDestinationVectorByDirection(
    activeGameLevelPlane,
    direction,
    currentPositionVector
  ) {
    // Retrieve game level boundaries to constrain movement if necessary.
    let boundary = activeGameLevelPlane.getActiveGameLevelBoundary();
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
      "MovementPathManager destination vector determined"
    );
    return destinationVector;
  }

  getDestinationVectorForUnboundedMovement(
    direction,
    ignoreObstacles,
    activeGameLevelPlane
  ) {
    // Retrieve the current player's position.
    let currentPositionVector =
      this.activePlayer.getPlayerPositionAndModelManager().currentPosition;

    let destinationVector = null;
    if (ignoreObstacles) {
      destinationVector = this.getBoundaryDestinationVectorByDirection(
        activeGameLevelPlane,
        direction,
        currentPositionVector
      );

      return destinationVector;
      // Initiate movement to the computed edge destination.
    } else if (!ignoreObstacles) {
      // If obstacles are considered, get the last valid position until an obstacle is encountered.
      destinationVector = ObstacleFinder.getLastValidPosition(
        this.activeLevel,
        this.activePlayer.getPlayerPositionAndModelManager().currentPosition,
        direction
      );
    }

    return destinationVector;
  }

  setDestinationAndBeginMovement(destinationVector) {
    // Set the player's destination in the position/model manager.
    this.activePlayer
      .getPlayerPositionAndModelManager()
      .setCurrentPathingDestination(destinationVector);

    this.this.playerModelMovementManager // Initiate the player model movement with the configuration default speed.
      .initMovement(Config.DEFAULT_SPEED);
  }

  /**
   * Processes movement under bounded conditions with obstacles and maximum distance.
   * NOTE: The detailed implementation is pending and should handle constraints and obstacles.
   * @param {string} direction - The intended movement direction ("LEFT", "RIGHT", "UP", "DOWN").
   * @param {boolean} ignoreObstacles - Flag indicating if obstacles can be bypassed.
   * @param {number} maxDistance - The maximum distance allowed for the movement.
   */
  getDestinationVectorForBoundedMovement(
    direction,
    ignoreObstacles,
    maxDistance
  ) {
    // TODO: Implement movement restrictions based on maxDistance and obstacle collisions.
  }

  /**
   * Determines the type of movement (bounded or unbounded) and processes it accordingly.
   * @param {string} direction - The movement direction ("LEFT", "RIGHT", "UP", "DOWN").
   * @param {boolean} unbounded - If true, movement is unbounded; otherwise, bounded.
   * @param {number} maxDistance - The maximum allowed distance for bounded movements.
   * @param {boolean} ignoreObstacles - Whether obstacles should be ignored during movement.
   */
  processMovementByDirection(
    direction,
    unbounded,
    maxDistance,
    ignoreObstacles,
    activeGameLevelPlane
  ) {
    let destinationVector = null;
    if (unbounded) {
      // Process unbounded movement logic.

      destinationVector = this.getDestinationVectorForUnboundedMovement(
        direction,
        ignoreObstacles,
        activeGameLevelPlane
      );
    } else if (!unbounded) {
      // Process bounded movement logic according to provided constraints.

      destinationVector = this.getDestinationVectorForBoundedMovement(
        direction,
        ignoreObstacles,
        maxDistance,
        activeGameLevelPlane
      );
    }

    return destinationVector;
  }

  /**
   * Invokes the update routine on the player's model manager to process potential model position updates.
   */
  processPossiblePlayerModelMovements() {
    this.playerModelMovementManager.processPossibleModelMovements();
  }

  /**
   * Logs both the current and destination positions to the console for debugging purposes.
   * @param {BABYLON.Vector3} currentPositionVector - The player's current position.
   * @param {BABYLON.Vector3} destinationVector - The intended destination position.
   */
  displayCurrentPositionAndDestination(
    currentPositionVector,
    destinationVector
  ) {
    let logMessage =
      "Current position: X" +
      currentPositionVector.x +
      ", " +
      currentPositionVector.y +
      " , " +
      currentPositionVector.z +
      " destination of: X" +
      destinationVector.x +
      " , Y: " +
      destinationVector.y +
      " , " +
      destinationVector.z;

    LoggerOmega.SmartLogger(
      true,
      logMessage,
      "MovementPathManager-DisplayCurrentPositionAndDestination"
    );
  }
}
