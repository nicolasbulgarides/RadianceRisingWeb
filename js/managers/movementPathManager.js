class MovementPathManager {
  constructor(player, world) {
    this.activeWorld = world;
    this.activePlayer = player;
    this.playerModelMovementManager = new PlayerModelMovementManager(
      this.activePlayer
    );
  }

  setActiveWorld(worldToSet) {
    this.activeWorld = worldToSet;
  }

  getArbitraryShiftVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  getArbitraryDestinationVector(x, y, z) {
    return new BABYLON.Vector3(x, y, z);
  }

  getDeterminedDestinationVector(startVector, shiftVector) {
    let destination = new BABYLON.Vector3(
      startVector.x + shiftVector.x,
      startVector.y + shiftVector.y,
      startVector.z + shiftVector.z
    );
    return destination;
  }

  getFinalPositionNoObstacles(direction, startPosition, axisDelta) {
    let xShift = 0;
    let yShift = 0;
    let zShift = 0;

    let directionString = String(direction);

    if (directionString === "UP") {
      zShift += axisDelta;
    } else if (directionString === "DOWN") {
      zShift -= axisDelta;
    } else if (directionString === "LEFT") {
      xShift -= axisDelta;
    } else if (directionString === "RIGHT") {
      xShift += axisDelta;
    }

    let adjustmentVector = this.getArbitraryShiftVector(xShift, yShift, zShift);

    let finalPosition = this.getDeterminedDestinationVector(
      startPosition,
      adjustmentVector
    );

    return finalPosition;
  }

  getGameWorldBoundary() {
    let boundary = {
      minX: 0,
      minY: 0,
      minZ: 0,
      maxX: this.activeWorld.mapWidth - 1,
      maxY: 0,
      maxZ: this.activeWorld.mapDepth - 1,
    };

    return boundary;
  }

  processUnboundedMovement(direction, ignoreObstacles) {
    let currentPositionVector =
      this.activePlayer.getPlayerPositionAndModelManager().currentPosition;

    let boundary = this.getGameWorldBoundary();
    let destinationVector = null;

    if (ignoreObstacles) {
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
      //ChadUtilities.describeVector("Test", destinationVector);
      this.setDestinationAndBeginMovement(destinationVector);
    } else if (!ignoreObstacles) {
      let stoppingPosition = ObstacleFinder.getLastValidPosition(
        this.activeWorld,
        this.activePlayer.getPlayerPositionAndModelManager().currentPosition,
        direction
      );

      //ChadUtilities.describeVector("Stopping at: ", stoppingPosition);
      this.setDestinationAndBeginMovement(stoppingPosition);
    }
  }

  setDestinationAndBeginMovement(destinationVector) {
    this.activePlayer
      .getPlayerPositionAndModelManager()
      .setCurrentPathingDestination(destinationVector);

    this.playerModelMovementManager.initMovement(Config.DEFAULT_SPEED);
  }

  processBoundedMovement(direction, ignoreObstacles, maxDistance) {}
  processMovementByDirection(
    direction,
    unbounded,
    maxDistance,
    ignoreObstacles
  ) {
    if (unbounded) {
      this.processUnboundedMovement(direction, ignoreObstacles);
    } else if (!unbounded) {
      this.processBoundedMovement(direction, ignoreObstacles, maxDistance);
    }
  }

  processPossiblePlayerModelMovements() {
    this.playerModelMovementManager.processPossibleModelMovements();
  }

  displayCurrentPositionAndDestination(
    currentPositionVector,
    destinationVector
  ) {
    console.log(
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
        destinationVector.z
    );
  }
}
