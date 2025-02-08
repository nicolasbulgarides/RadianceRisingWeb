class WorldMap {
  /**
   * Constructs an in-memory representation of the game world.
   * Holds grid configuration, board slots, obstacles, and player start position.
   */
  constructor() {
    // 2D array containing BoardSlot instances representing each grid cell.
    this.boardSlots = [];
    // Grid dimensions (default values; updated on load).
    this.mapWidth = 1;
    this.mapDepth = 1;
    // Starting position for the player in the world.
    this.startingPosition = null;
    // Container for obstacles (if needed in further logic).
    this.obstacles = {};
  }

  /**
   * Loads the composite world configuration based on a preset.
   * Sets grid dimensions, initializes board slots, and configures the player's starting position.
   *
   * @param {string} worldPreset - The preset nickname to load (e.g., "testWorld0").
   */
  attemptToLoadMapComposite(worldPreset) {
    // Retrieve world configuration data from WorldData.
    let worldToLoad = WorldData.getWorldByNickname(worldPreset);
    this.mapWidth = worldToLoad.width;
    this.mapDepth = worldToLoad.depth;

    // Initialize the 2D grid of board slots.
    this.initializeBoardSlots(this.mapWidth, this.mapDepth);
    // Set the player's starting position based on configuration.
    this.initializeStartingPosition(worldToLoad);
  }

  /**
   * Sets the player's starting position using configuration data.
   *
   * @param {Object} worldToLoad - The configuration object for the world.
   */
  initializeStartingPosition(worldToLoad) {
    this.startingPosition = new BABYLON.Vector3(
      worldToLoad.playerStartX,
      worldToLoad.playerStartY,
      worldToLoad.playerStartZ
    );
    // Debug logging can be enabled here if needed.
    /**
    console.log(
      "Starting position of map:" + this.startingPosition.x + " , " +
      this.startingPosition.y + ", " + this.startingPosition.z
    );
    */
  }

  /**
   * A helper function to test obstacle generation within the world map.
   * Utilizes a generator to add edge mountains and initialize obstacles.
   *
   * @param {WorldMapObstacleGenerator} generator - The generator instance for obstacles.
   */
  worldObstacleTest(generator) {
    generator.generateEdgeMountains(this);
    generator.initializeObstacles(this);
  }

  /**
   * Initializes the grid of board slots.
   * Each grid cell is an instance of BoardSlot.
   *
   * @param {number} width - The number of columns in the grid.
   * @param {number} depth - The number of rows in the grid.
   */
  initializeBoardSlots(width, depth) {
    this.boardSlots = new Array(width);
    for (let x = 0; x < width; x++) {
      this.boardSlots[x] = new Array(depth);
      for (let z = 0; z < depth; z++) {
        this.boardSlots[x][z] = new BoardSlot(x, 0, z);
      }
    }
  }

  /**
   * Retrieves the player's starting position in the world.
   *
   * @returns {BABYLON.Vector3} - The vector representing the player's start position.
   */
  getPlayerStartingPosition() {
    return this.startingPosition;
  }
}
