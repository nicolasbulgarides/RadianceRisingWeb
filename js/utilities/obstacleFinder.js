class ObstacleFinder {
  static getFirstObstacle(worldMap, startingPosition, direction) {
    let x = startingPosition.x;
    let y = startingPosition.y;
    let z = startingPosition.z;

    while (this.isWithinBounds(x, y, z)) {
      let boardSlot = worldMap.boardSlots[x]?.[z];
      if (boardSlot && boardSlot.hostedObstacle) {
        return boardSlot.hostedObstacle; // Found an obstacle
      }

      // Move in the given direction
      switch (direction.toUpperCase()) {
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
          return null;
      }
    }

    return null; // No obstacle found
  }

  static isWithinBounds(worldMap, x, y, z) {
    return x >= 0 && x < worldMap.mapWidth && z >= 0 && z < worldMap.mapDepth;
  }
  static getLastValidPosition(worldMap, startPosition, direction) {
    let x = startPosition.x;
    let y = startPosition.y;
    let z = startPosition.z;
    let lastValidPosition = new BABYLON.Vector3(
      startPosition.x,
      startPosition.y,
      startPosition.z
    );

    while (this.isWithinBounds(worldMap, x, y, z)) {
      let boardSlot = worldMap.boardSlots[x]?.[z];

      if (boardSlot && boardSlot.hostedObstacle) {
        return lastValidPosition; // Stop at the last valid position before the obstacle
      }

      // Update last valid position before moving
      lastValidPosition = new BABYLON.Vector3(x, y, z);

      // Move in the given direction
      switch (direction.toUpperCase()) {
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

    return lastValidPosition; // If no obstacle is found, return the farthest valid position
  }
}
