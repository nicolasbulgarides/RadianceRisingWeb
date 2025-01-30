class MovementPathManager {
  constructor() {
    this.activeWorld = null;
    this.activePlayer = null;
    this.modelMovementManager = new ModelMovementManager();
  }

  registerPlayer(playerToRegister) {
    this.activePlayer = playerToRegister;
    this.modelMovementManager.registerPlayer(this.activePlayer);
  }

  setActiveWorld(worldToSet) {
    this.activeWorld = worldToSet;
  }

  processMovementByDirection(player, direction) {
    direction = direction.toUpperCase();
    let playerPosition = {
      x: player.currentXPosition,
      y: player.currentYPosition,
      z: player.currentZPosition,
    };

    if (direction == "UP") {
      playerPosition.z += 2;
    } else if (direction == "DOWN") {
      playerPosition.z -= 2;
    } else if (direction == "LEFT") {
      playerPosition.x -= 2;
    } else if (direction == "RIGHT") {
      playerPosition.x += 2;
    }
    return playerPosition;
  }
}
