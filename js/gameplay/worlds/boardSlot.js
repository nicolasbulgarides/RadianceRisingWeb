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
  }

  hostObstacle(obstacle) {
    this.hostedObstacle = obstacle;
  }

  /**
   * Clears the obstacle from this slot.
   */
  clearObstacle() {
    if (this.hostedObstacle) {
      this.hostedObstacle.disposeOfObstacleModel();
      this.hostedObstacle = null;
    }
  }
}
