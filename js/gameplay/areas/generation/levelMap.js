class LevelMap {
  /**
   * Constructs an in-memory representation of the game level.
   * Holds grid configuration, board slots, obstacles, and player start position.
   */
  constructor(gameModeRules) {
    // 2D array containing BoardSlot instances representing each grid cell.
    this.boardSlots = [];
    // Grid dimensions (default values; updated on load).
    this.mapWidth = 1;
    this.mapDepth = 1;
    // Starting position for the player in the level.
    this.startingPosition = null;
    // Container for obstacles (if needed in further logic).
    this.obstacles = {};
  }

  /**
   * Loads the composite level configuration based on a preset.
   * Sets grid dimensions, initializes board slots, and configures the player's starting position.
   *
   * @param {string} levelPreset - The preset nickname to load (e.g., "testLevel0").
   */
  attemptToLoadMapComposite(levelPreset) {
    // Retrieve level configuration data from LevelData.
    let levelToLoad = LevelData.getLevelByNickname(levelPreset);

    this.mapWidth = levelToLoad.width;
    this.mapDepth = levelToLoad.depth;

    // Initialize the 2D grid of board slots.
    this.initializeBoardSlots(this.mapWidth, this.mapDepth);
    // Set the player's starting position based on configuration.
    this.initializeStartingPosition(levelToLoad);
  }

  /**
   * Sets the player's starting position using configuration data.
   *
   * @param {Object} levelToLoad - The configuration object for the level.
   */

  initializeStartingPosition(levelToLoad) {
    this.startingPosition = new BABYLON.Vector3(
      levelToLoad.playerStartX,
      levelToLoad.playerStartY,
      levelToLoad.playerStartZ
    );
  }

  /**
   * A helper function to test obstacle generation within the level map.
   * Utilizes a generator to add edge mountains and initialize obstacles.
   *
   * @param {LevelMapObstacleGenerator} generator - The generator instance for obstacles.
   */

  levelObstacleTest() {
    let relevantSceneBuilder =
      FundamentalSystemBridge.renderSceneSwapper.getSceneBuilderForScene(
        "BaseGameScene"
      );

    let obstacleGenerator =
      FundamentalSystemBridge.levelFactoryComposite.levelMapObstacleGeneator;

    obstacleGenerator.generateEdgeMountains(this, relevantSceneBuilder);
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
   * Retrieves the player's starting position in the level.
   *
   * @returns {BABYLON.Vector3} - The vector representing the player's start position.
   */

  getPlayerStartingPosition() {
    return this.startingPosition;
  }
}
