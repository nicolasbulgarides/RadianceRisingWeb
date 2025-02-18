class BoardSlot {
  /**
   * Represents a slot on the game board grid.
   * This class models a discrete cell on the game grid.
   * Each board slot has a position in 3D space coordinates and can
   * optionally host an obstacle. It also holds which directions may be blocked.
   *
   * @param {number} x - X position in 3D space coordinates).
   * @param {number} y - Y position in 3D space coordinates).
   * @param {number} z - Z position in 3D space  coordinates).
   */
  constructor(x, y, z) {
    // Store the grid coordinates for this board slot.
    this.x = x;
    this.y = y;
    this.z = z;
    // The obstacle instance that occupies this slot (if any).
    this.hostedObstacle = null;
    // Represents which directions (if any) are blocked by the slot.
    this.directionsBlocked = null;
  }

  /**
   * Assigns an obstacle to this board slot.
   * @param {Obstacle} obstacle - The obstacle object to host in this slot.
   */
  hostObstacle(obstacle) {
    this.hostedObstacle = obstacle;
  }

  /**
   * Clears and disposes the obstacle from this board slot.
   * This includes cleanup of the underlying model to free resources.
   */
  clearObstacle() {
    if (this.hostedObstacle) {
      // Dispose of the obstacle's model resources.
      this.hostedObstacle.disposeOfObstacleModel();
      // Remove the reference, marking the slot as empty.
      this.hostedObstacle = null;
    }
  }
}
