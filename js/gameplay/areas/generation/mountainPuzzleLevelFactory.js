/**
 * MountainPuzzleLevelFactory creates complete mountain puzzle levels with
 * different difficulty configurations.
 *
 * This factory provides a simplified interface to create levels with mountain
 * obstacles that form solvable paths between start and end positions, with
 * presets for different difficulty levels.
 */
class MountainPuzzleLevelFactory {
  /**
   * Creates a new MountainPuzzleLevelFactory instance
   */
  constructor() {
    this.generator = new MountainPathGenerator();
  }

  /**
   * Creates an easy puzzle level with a straightforward path
   * @param {string} levelId - Unique ID for the level
   * @param {string} levelNickname - User-friendly name for the level
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async createEasyLevel(
    levelId = "mountain_easy",
    levelNickname = "Easy Mountain Path",
    useFallbackVisualization = false
  ) {
    // Easy level has:
    // - Small size (9x9)
    // - Few obstacles (20%)
    // - Close start and end positions
    const gridWidth = 9;
    const gridDepth = 9;
    const obstacleRatio = 0.2;

    // Start position (bottom left-ish)
    const startPosition = { x: 2, y: 0.25, z: 2 };

    // End position (top right-ish)
    const endPosition = { x: 6, y: 0.25, z: 6 };

    return this.generator.loadGeneratedLevel(
      levelId,
      levelNickname,
      startPosition,
      endPosition,
      gridWidth,
      gridDepth,
      obstacleRatio,
      useFallbackVisualization
    );
  }

  /**
   * Creates a medium difficulty puzzle level
   * @param {string} levelId - Unique ID for the level
   * @param {string} levelNickname - User-friendly name for the level
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async createMediumLevel(
    levelId = "mountain_medium",
    levelNickname = "Medium Mountain Path",
    useFallbackVisualization = false
  ) {
    // Medium level has:
    // - Medium size (11x11)
    // - Moderate obstacles (30%)
    // - More distant start and end positions
    const gridWidth = 11;
    const gridDepth = 11;
    const obstacleRatio = 0.3;

    // Start position (bottom left)
    const startPosition = { x: 1, y: 0.25, z: 1 };

    // End position (top right)
    const endPosition = { x: 9, y: 0.25, z: 9 };

    return this.generator.loadGeneratedLevel(
      levelId,
      levelNickname,
      startPosition,
      endPosition,
      gridWidth,
      gridDepth,
      obstacleRatio,
      useFallbackVisualization
    );
  }

  /**
   * Creates a hard puzzle level with complex paths
   * @param {string} levelId - Unique ID for the level
   * @param {string} levelNickname - User-friendly name for the level
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async createHardLevel(
    levelId = "mountain_hard",
    levelNickname = "Hard Mountain Path",
    useFallbackVisualization = false
  ) {
    // Hard level has:
    // - Larger size (15x15)
    // - More obstacles (40%)
    // - Distant start and end positions
    const gridWidth = 15;
    const gridDepth = 15;
    const obstacleRatio = 0.4;

    // Start position (bottom left corner)
    const startPosition = { x: 1, y: 0.25, z: 1 };

    // End position (top right corner)
    const endPosition = { x: 13, y: 0.25, z: 13 };

    return this.generator.loadGeneratedLevel(
      levelId,
      levelNickname,
      startPosition,
      endPosition,
      gridWidth,
      gridDepth,
      obstacleRatio,
      useFallbackVisualization
    );
  }

  /**
   * Creates a very challenging puzzle level with complex maze-like paths
   * @param {string} levelId - Unique ID for the level
   * @param {string} levelNickname - User-friendly name for the level
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async createExpertLevel(
    levelId = "mountain_expert",
    levelNickname = "Expert Mountain Path",
    useFallbackVisualization = false
  ) {
    // Expert level has:
    // - Large size (21x21)
    // - Many obstacles (45%)
    // - Distant start and end positions with likely winding path
    const gridWidth = 21;
    const gridDepth = 21;
    const obstacleRatio = 0.45;

    // Start position (bottom left corner)
    const startPosition = { x: 1, y: 0.25, z: 1 };

    // End position (top right corner)
    const endPosition = { x: 19, y: 0.25, z: 19 };

    return this.generator.loadGeneratedLevel(
      levelId,
      levelNickname,
      startPosition,
      endPosition,
      gridWidth,
      gridDepth,
      obstacleRatio,
      useFallbackVisualization
    );
  }

  /**
   * Creates a custom mountain puzzle level with specific parameters
   * @param {Object} options - Configuration options
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async createCustomLevel(options = {}) {
    const {
      levelId = "mountain_custom",
      levelNickname = "Custom Mountain Path",
      startPosition = { x: 1, y: 0.25, z: 1 },
      endPosition = { x: 9, y: 0.25, z: 9 },
      gridWidth = 11,
      gridDepth = 11,
      obstacleRatio = 0.3,
      useFallbackVisualization = false,
    } = options;

    return this.generator.loadGeneratedLevel(
      levelId,
      levelNickname,
      startPosition,
      endPosition,
      gridWidth,
      gridDepth,
      obstacleRatio,
      useFallbackVisualization
    );
  }

  /**
   * Creates a random mountain puzzle level with unpredictable parameters
   * @param {string} levelId - Unique ID for the level
   * @param {string} levelNickname - User-friendly name for the level
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async createRandomLevel(
    levelId = "mountain_random",
    levelNickname = "Random Mountain Path",
    useFallbackVisualization = false
  ) {
    // Generate random level parameters
    const sizeOptions = [9, 11, 15, 19, 21];
    const sizeIndex = Math.floor(Math.random() * sizeOptions.length);

    const gridWidth = sizeOptions[sizeIndex];
    const gridDepth = sizeOptions[sizeIndex];

    // Random obstacle ratio between 20% and 45%
    const obstacleRatio = 0.2 + Math.random() * 0.25;

    // Ensure start and end have some distance between them
    const margin = 1;
    const maxCoord = gridWidth - 1 - margin;

    // Start position (random, but in the first quarter of the grid)
    const startX = Math.floor(Math.random() * (maxCoord / 2)) + margin;
    const startZ = Math.floor(Math.random() * (maxCoord / 2)) + margin;
    const startPosition = { x: startX, y: 0.25, z: startZ };

    // End position (random, but in the last quarter of the grid)
    const endX = Math.floor(Math.random() * (maxCoord / 2)) + maxCoord / 2;
    const endZ = Math.floor(Math.random() * (maxCoord / 2)) + maxCoord / 2;
    const endPosition = { x: endX, y: 0.25, z: endZ };

    console.log(
      `Creating random mountain level (${gridWidth}x${gridDepth}) with ${Math.round(
        obstacleRatio * 100
      )}% obstacles`
    );
    console.log(
      `Start: (${startPosition.x}, ${startPosition.z}), End: (${endPosition.x}, ${endPosition.z})`
    );

    return this.generator.loadGeneratedLevel(
      levelId,
      levelNickname,
      startPosition,
      endPosition,
      gridWidth,
      gridDepth,
      obstacleRatio,
      useFallbackVisualization
    );
  }
}
