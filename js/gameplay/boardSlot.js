class BoardSlot {
  /**
   * Represents a slot on the game board grid.
   * @param {number} x - X position in 3D space (world coordinates).
   * @param {number} y - Y position in 3D space (world coordinates).
   * @param {number} z - Z position in 3D space (world coordinates).
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.hostedObstacle = null; // Holds a PositionedObject instance
    this.directionsBlocked = null; // Stores blocked directions as strings (e.g., 'north', 'south')
    this.obstacleNickname = ""; // Friendly identifier for the obstacle
  }

  /**
   * Hosts an obstacle in this slot and positions it correctly.
   * @param {PositionedObject} positionedObject - The obstacle to place in this slot.
   * @param {string} nickname - Friendly name for the obstacle.
   */
  hostObstacle(obstacle) {
    this.hostedObstacle = obstacle;
  }

  /**
   * Blocks movement in specific directions.
   * @param {Array<string>} directions - Array of directions to block (e.g., ['up', 'down','left','right']).
   */
  blockDirections(directions) {
    directions.forEach((dir) => this.directionsBlocked.add(dir));
  }

  /**
   * Unblocks movement in specific directions.
   * @param {Array<string>} directions - Array of directions to unblock.
   */
  unblockDirections(directions) {
    directions.forEach((dir) => this.directionsBlocked.delete(dir));
  }

  /**
   * Clears the obstacle from this slot.
   */
  clearObstacle() {
    if (this.hostedObstacle) {
      this.hostedObstacle.disposeModel();
      this.hostedObstacle = null;
      this.obstacleNickname = "";
    }
  }
}
