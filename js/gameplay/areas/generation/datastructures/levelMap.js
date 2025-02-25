/**
 * LevelMap represents the physical layout and structure of a game level.
 * It manages a 2D grid of BoardSlot instances that form the playable area.
 *
 * Core Responsibilities:
 * - Maintains a 2D grid of BoardSlot objects
 * - Tracks level dimensions and boundaries
 * - Manages player spawn position
 * - Handles obstacle placement and grid occupancy
 *
 * This class serves as the bridge between the abstract level data and the
 * physical representation of the game world. It's used by ActiveGameplayLevel
 * to manage the actual gameplay space.
 */
class LevelMap {
  /**
   * Constructs an in-memory representation of the game level.
   * Initializes an empty grid that can be populated through level loading.
   * The grid is represented as a 2D array of BoardSlot instances, where each
   * BoardSlot can contain obstacles or other interactive elements.
   */
  constructor() {
    /** @type {BoardSlot[][]} 2D array containing BoardSlot instances representing each grid cell */
    this.boardSlots = [];
    /** @type {number} Grid width (number of columns) */
    this.mapWidth = 1;
    /** @type {number} Grid depth (number of rows) */
    this.mapDepth = 1;
    /** @type {BABYLON.Vector3} Starting position for the player in the level */
    this.startingPosition = null;
    /** @type {Object} Container for obstacle references and state */
    this.obstacles = {};
  }

  /**
   * Loads the composite level configuration based on a preset.
   * Sets grid dimensions, initializes board slots, and configures the player's starting position.
   * @param {string} levelPreset - The preset nickname to load (e.g., "testLevel0").
   */
  attemptToLoadMapComposite(levelPreset) {
    // Retrieve level configuration data from LevelData.
    let levelToLoad = LevelData.getLevelByNickname(levelPreset);

    this.mapWidth = levelToLoad.width; // Set the map width.
    this.mapDepth = levelToLoad.depth; // Set the map depth.

    // Initialize the 2D grid of board slots.
    this.initializeBoardSlots(this.mapWidth, this.mapDepth);
    // Set the player's starting position based on configuration.
    this.initializeStartingPosition(levelToLoad);
  }

  /**
   * Sets the player's starting position using configuration data.
   * @param {Object} levelToLoad - The configuration object for the level.
   */
  initializeStartingPosition(levelToLoad) {
    this.startingPosition = new BABYLON.Vector3(
      levelToLoad.playerStartX,
      levelToLoad.playerStartY,
      levelToLoad.playerStartZ
    ); // Create a vector for the starting position.
  }

  /**
   * Initializes the grid of board slots.
   * Each grid cell is an instance of BoardSlot.
   * @param {number} width - The number of columns in the grid.
   * @param {number} depth - The number of rows in the grid.
   */
  initializeBoardSlots(width, depth) {
    this.boardSlots = new Array(width); // Create an array for the board slots.
    for (let x = 0; x < width; x++) {
      this.boardSlots[x] = new Array(depth); // Create a 2D array for the grid.
      for (let z = 0; z < depth; z++) {
        this.boardSlots[x][z] = new BoardSlot(x, 0, z); // Initialize each board slot.
      }
    }
  }

  /**
   * Retrieves the player's starting position in the level.
   * @returns {BABYLON.Vector3} - The vector representing the player's start position.
   */
  getPlayerStartingPosition() {
    return this.startingPosition; // Return the starting position.
  }
  /**
   * Describes the level map in a readable format.
   * @returns {string} - A formatted description of the level map.
   */
  describeLevelMap() {
    return `Level Map Description:
    Dimensions: ${this.mapWidth}x${this.mapDepth}
    Total Board Slots: ${this.mapWidth * this.mapDepth}
    Starting Position: (${this.startingPosition.x}, ${
      this.startingPosition.y
    }, ${this.startingPosition.z})`;
  }
}
