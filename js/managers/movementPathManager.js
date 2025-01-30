class MovementPathManager {
  constructor() {
    this.activeWorld = null;
    this.activePlayer = null;
    this.playerModelMovementManager = new PlayerModelMovementManager();
  }

  registerPlayer(playerToRegister) {
    this.activePlayer = playerToRegister;
    this.playerModelMovementManager.registerPlayer(this.activePlayer);
  }

  setActiveWorld(worldToSet) {
    this.activeWorld = worldToSet;
  }

  processMovementByDirection(player, direction) {
    const directionString = direction.toUpperCase();
    let playerPosition = {
      x: player.currentXPosition,
      y: player.currentYPosition,
      z: player.currentZPosition,
    };

    if (directionString == "UP") {
      playerPosition.z += 2;
    } else if (directionString == "DOWN") {
      playerPosition.z -= 2;
    } else if (directionString == "LEFT") {
      playerPosition.x -= 2;
    } else if (directionString == "RIGHT") {
      playerPosition.x += 2;
    }
  }

  processPossiblePlayerModelMovements() {
    this.playerModelMovementManager.processPossibleModelMovements();
  }
}
