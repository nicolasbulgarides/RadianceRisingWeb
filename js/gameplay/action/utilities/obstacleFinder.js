class ObstacleFinder {
  /**
   * Searches for the first obstacle encountered in a given direction from a starting position.
   *
   * @param {ActiveGameplayLevel} activeGamePlayLevel - The gameplay level  which contains the map with board slot data.
   * @param {BABYLON.Vector3} startingPosition - The starting point of the search.
   * @param {string} direction - Direction to search ("UP", "DOWN", "LEFT", or "RIGHT").
   * @returns {Obstacle|null} - The first encountered obstacle or null if none found.
   */

  static getFirstObstacle(activeGamePlayLevel, startingPosition, direction) {
    let levelMap = activeGamePlayLevel.levelMap;

    // Validate inputs
    if (!levelMap || !startingPosition || !direction) {
      console.error("Invalid parameters provided to getFirstObstacle");
      return null;
    }

    // Standardize direction format
    const normalizedDirection = direction.toUpperCase().trim();

    // Initialize search coordinates
    let x = Math.floor(startingPosition.x);
    let y = startingPosition.y;
    let z = Math.floor(startingPosition.z);

    // Continue searching while within grid boundaries
    while (this.isWithinBounds(levelMap, x, y, z)) {
      // Retrieve the board slot at the current coordinates
      let boardSlot = levelMap.boardSlots[x]?.[z];
      if (boardSlot && boardSlot.hostedObstacle) {
        return boardSlot.hostedObstacle;
      }

      // Adjust coordinates based on the search direction
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
          return null;
      }
    }

    return null;
  }

  /**
   * Checks if the given coordinates lie within the bounds of the level map.
   * Only X and Z dimensions are considered for the grid.
   *
   * @param {LevelMap} levelMap - The level containing grid dimensions.
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate (unused for grid boundary check).
   * @param {number} z - Z coordinate.
   * @returns {boolean} - True if within bounds; false otherwise.
   */
  static isWithinBounds(levelMap, x, y, z) {
    // Check if levelMap exists and has valid dimensions
    if (
      !levelMap ||
      typeof levelMap.mapWidth !== "number" ||
      typeof levelMap.mapDepth !== "number"
    ) {
      console.error("Invalid level map or dimensions");
      return false;
    }

    // Use strict 0-based indexing check
    return x >= 0 && x < levelMap.mapWidth && z >= 0 && z < levelMap.mapDepth;
  }

  /**
   * Determines the last valid position on the grid before encountering an obstacle.
   *
   * @param {LevelMap} levelMap - The game level map.
   * @param {BABYLON.Vector3} startPosition - Starting position for the search.
   * @param {string} direction - Direction to traverse ("UP", "DOWN", "LEFT", "RIGHT").
   * @returns {BABYLON.Vector3} - The last valid grid position before an obstacle or the farthest in-bound position.
   */

  static getLastValidPosition(gameplayLevel, startPosition, direction) {
    let levelMap = gameplayLevel.levelMap;
    // Validate inputs
    if (!levelMap || !startPosition || !direction) {
      console.error("Invalid parameters provided to getLastValidPosition");
      return startPosition;
    }

    // Standardize direction format
    const normalizedDirection = direction.toUpperCase().trim();

    let x = Math.floor(startPosition.x);
    let y = startPosition.y;
    let z = Math.floor(startPosition.z);

    // Begin tracking with the starting position
    let lastValidPosition = new BABYLON.Vector3(x, y, z);

    // Iterate until reaching an obstacle or out-of-bounds
    while (this.isWithinBounds(levelMap, x, y, z)) {
      let boardSlot = levelMap.boardSlots[x]?.[z];

      if (boardSlot && boardSlot.hostedObstacle) {
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
