class MovementPathManager {
  constructor(player) {
    this.activeWorld = null;
    this.activePlayer = player;
    this.playerModelMovementManager = new PlayerModelMovementManager(
      this.activePlayer
    );
  }

  setActiveWorld(worldToSet) {
    this.activeWorld = worldToSet;
  }

  processMovementByDirection(player, direction) {
    const directionString = direction.toUpperCase();

    let currentPositionVector =
      player.getPlayerPositionAndModelManager().currentPosition;

    let xShift = 0;
    let yShift = 0;
    let zShift = 0;

    if (directionString == "UP") {
      zShift += 2;
    } else if (directionString == "DOWN") {
      zShift -= 2;
    } else if (directionString == "LEFT") {
      xShift -= 2;
    } else if (directionString == "RIGHT") {
      xShift += 2;
    }

    let destinationVector = new BABYLON.Vector3(
      currentPositionVector.x + xShift,
      currentPositionVector.y + yShift,
      currentPositionVector.z + zShift
    );

    player
      .getPlayerPositionAndModelManager()
      .setCurrentPathingDestination(destinationVector);

    this.playerModelMovementManager.initMovement(Config.DEFAULT_SPEED);
  }

  processPossiblePlayerModelMovements() {
    this.playerModelMovementManager.processPossibleModelMovements();
  }
}
