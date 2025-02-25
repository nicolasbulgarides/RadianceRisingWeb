/**
 * BoardSlot represents a single cell in the game's grid-based world.
 * It is the fundamental unit of the game's physical space, managed by LevelMap.
 * Each BoardSlot maintains its position and can host obstacles or interactive elements.
 *
 * Core Features:
 * - Maintains 3D position in the game world
 * - Can host obstacles or interactive elements
 * - Tracks directional blockages
 * - Manages obstacle lifecycle (hosting and disposal)
 *
 * BoardSlots form the building blocks of the game's grid system and are
 * primarily managed by the LevelMap class.
 */
class BoardSlot {
  /**
   * Creates a new BoardSlot instance representing a cell in the game grid.
   * Each slot is positioned in 3D space and can optionally contain an obstacle
   * or other interactive elements.
   *
   * @param {number} x - X position in 3D space coordinates
   * @param {number} y - Y position in 3D space coordinates
   * @param {number} z - Z position in 3D space coordinates
   */
  constructor(x, y, z) {
    /** @type {number} X coordinate in the game grid */
    this.x = x;
    /** @type {number} Y coordinate (typically height) */
    this.y = y;
    /** @type {number} Z coordinate in the game grid */
    this.z = z;
    /** @type {Obstacle|null} Reference to hosted obstacle, if any */
    this.hostedObstacle = null;
    /** @type {Object|null} Configuration of blocked directions */
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
