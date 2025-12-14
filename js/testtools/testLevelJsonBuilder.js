/**
 * TestLevelJsonBuilder provides a modular approach to constructing test levels
 * for development and testing purposes. It builds complete LevelDataComposite
 * objects with all required nested components.
 *
 * The builder follows a modular design where each component (header, gameplay traits,
 * rewards) can be constructed independently and then assembled into a complete level.
 */
class TestLevelJsonBuilder {
  static #instance = null;

  static getInstance() {
    if (!TestLevelJsonBuilder.#instance) {
      TestLevelJsonBuilder.#instance = new TestLevelJsonBuilder();
    }
    return TestLevelJsonBuilder.#instance;
  }

  constructor() {
    // Debug mode - set to true for detailed logging
    this.DEBUG_MODE = false;

    // Only allow instantiation through getInstance
    if (TestLevelJsonBuilder.#instance) {
      throw new Error(
        "Use TestLevelJsonBuilder.getInstance() instead of new operator"
      );
    }
  }

  /**
   * Builds a complete test level with default values
   * @param {string} [levelId="testLevel0"] - The level ID
   * @param {string} [levelNickname="Test Level 0"] - The level nickname
   * @returns {LevelDataComposite} A fully constructed level data composite
   */
  static buildDefaultTestLevel(
    levelId = "testLevel0",
    levelNickname = "Test Level 0"
  ) {
    console.log("Building test level with id: ", levelId);

    // Build the header data
    const levelHeaderData = this.buildLevelHeaderData(levelId, levelNickname);

    // Build gameplay traits
    const levelGameplayTraits = this.buildGameplayTraits(levelId);

    // Build reward bundle (or use empty/placeholder rewards)
    let rewardBundle = null;

    if (Config.ITEMS_AND_REWARDS_ACTIVE) {
      rewardBundle = this.buildEmptyRewardBundle();
    }

    // Assemble the complete level data composite
    return new LevelDataComposite(
      levelHeaderData,
      levelGameplayTraits,
      rewardBundle
    );
  }

  /**
   * Builds a level header data object with the specified parameters
   * @param {string} levelId - The level ID
   * @param {string} levelNickname - The level nickname
   * @param {string} [description="A test level for development"] - Level description
   * @returns {LevelHeaderData} The constructed level header data
   */
  static buildLevelHeaderData(
    levelId,
    levelNickname,
    description = "A test level for development"
  ) {
    return new LevelHeaderData(
      levelId,
      levelNickname,
      "developer", // worldId
      "Test World", // worldNickname
      description,
      "none", // unlockRequirements
      "easy", // complexityLevel
      "none" // backgroundMusic
    );
  }

  /**
   * Builds gameplay traits for a test level
   * @param {string} levelId - The level ID to associate with the gameplay traits
   * @returns {LevelGameplayTraitsData} The constructed gameplay traits
   */
  static buildGameplayTraits(levelId) {
    // Build victory conditions with objectives
    const victoryConditions = this.buildVictoryConditions(levelId);

    // Build featured objects (obstacles, decorations, etc.)
    const featuredObjects = this.buildFeaturedObjects();

    // Build empty arrays for optional components
    const microEvents = [];
    const levelTriggers = [];
    const levelOccurrences = [];
    const lightingPresets = [];
    const specialUIElements = [];
    const specialCameraEffects = [];

    return new LevelGameplayTraitsData(
      victoryConditions,
      featuredObjects,
      microEvents,
      levelTriggers,
      levelOccurrences,
      lightingPresets,
      specialUIElements,
      specialCameraEffects
    );
  }

  /**
   * Builds a simple victory condition with basic objectives
   * @param {string} levelId - The level ID to associate with the victory condition
   * @returns {Array<LevelVictoryCondition>} Array of victory conditions
   */
  static buildVictoryConditions(levelId) {
    // Create a simple objective to reach a specific position
    const reachEndObjective = new LevelObjective(
      "reach_end",
      "Reach the End",
      "Reach the end of the level",
      "position",
      "end",
      true, // earns full victory
      "" // no special trigger
    );

    // Create the victory condition with the objective
    const victoryCondition = new LevelVictoryCondition(
      levelId,
      "Complete the Level",
      "Reach the end of the level to complete it",
      [reachEndObjective]
    );

    return [victoryCondition];
  }

  /**
   * Builds a collection of featured objects for the level
   * @returns {Array<LevelFeaturedObject>} Array of featured objects
   */
  static buildFeaturedObjects() {
    // For now, return an empty array as these will be populated by the obstacle generator
    return [];
  }

  /**
   * Builds default lighting presets for the level
   * @returns {Object} Lighting preset configuration
   */
  static buildDefaultLightingPresets() {
    return {
      ambientIntensity: 0.3,
      directionalIntensity: 0.7,
      shadowsEnabled: true,
    };
  }

  /**
   * Builds an empty reward bundle for testing
   * This allows the level to function without requiring the reward system
   * @returns {RewardBundleComposite} A minimal reward bundle
   */
  static buildEmptyRewardBundle() {
    // Create empty/minimal components for the reward bundle
    const rewardHeader = {
      bundleId: "test_bundle",
      bundleName: "Test Reward Bundle",
      bundleDescription: "A placeholder reward bundle for testing",
    };

    const rewardBasic = {
      experiencePoints: 0,
      currencyAmount: 0,
    };

    const rewardUnlocks = {
      unlockedLevels: [],
      unlockedItems: [],
    };

    const rewardSpecial = {
      specialRewards: [],
    };

    // If the RewardBundleComposite class is available, use it
    // Otherwise return a plain object with the same structure
    try {
      return new RewardBundleComposite(
        rewardHeader,
        rewardBasic,
        rewardUnlocks,
        rewardSpecial
      );
    } catch (e) {
      // Fallback to plain object if class isn't available
      return {
        rewardBundleHeader: rewardHeader,
        rewardBasic: rewardBasic,
        rewardUnlocks: rewardUnlocks,
        rewardSpecial: rewardSpecial,
      };
    }
  }

  /**
   * Creates a test level with a specific grid size and player start position
   * @param {string} levelId - The level ID
   * @param {string} levelNickname - The level nickname
   * @param {number} width - Grid width
   * @param {number} depth - Grid depth
   * @param {Object} playerStart - Player starting position {x, y, z}
   * @returns {LevelDataComposite} The constructed level data
   */
  static buildCustomSizeLevel(
    levelId,
    levelNickname,
    width,
    depth,
    playerStart
  ) {
    if (this.DEBUG_MODE) console.log("Building custom size level with id: ", levelId);

    // Build the header data
    const levelHeaderData = this.buildLevelHeaderData(levelId, levelNickname);

    // Build gameplay traits
    const levelGameplayTraits = this.buildGameplayTraits(levelId);

    // Build reward bundle if needed
    let rewardBundle = null;
    if (Config.ITEMS_AND_REWARDS_ACTIVE) {
      rewardBundle = this.buildEmptyRewardBundle();
    }

    // Create the level data composite
    const levelData = new LevelDataComposite(
      levelHeaderData,
      levelGameplayTraits,
      rewardBundle
    );

    // Add custom size and player start information
    levelData.customGridSize = { width, depth };
    levelData.playerStartPosition = {
      x: playerStart.x || Math.floor(width / 2),
      y: playerStart.y || 0.25,
      z: playerStart.z || Math.floor(depth / 2),
    };

    return levelData;
  }

  /**
   * Builds a level with predefined obstacles
   * @param {string} levelId - The level ID
   * @param {string} levelNickname - The level nickname
   * @param {Array} obstacles - Array of obstacle definitions
   * @returns {LevelDataComposite} The constructed level data
   */
  static buildLevelWithObstacles(levelId, levelNickname, obstacles) {
    //   console.log("Building level with obstacles, id: ", levelId);

    // Build the header data
    const levelHeaderData = this.buildLevelHeaderData(levelId, levelNickname);

    // Build gameplay traits
    const levelGameplayTraits = this.buildGameplayTraits(levelId);

    // Add obstacles to the featured objects
    levelGameplayTraits.featuredObjects = obstacles;

    // Build reward bundle if needed
    let rewardBundle = null;
    if (Config.ITEMS_AND_REWARDS_ACTIVE) {
      rewardBundle = this.buildEmptyRewardBundle();
    }

    // Create and return the level data composite
    return new LevelDataComposite(
      levelHeaderData,
      levelGameplayTraits,
      rewardBundle
    );
  }

  /**
   * Converts a LevelDataComposite to a JSON string for storage or transmission
   * @param {LevelDataComposite} levelData - The level data to convert
   * @returns {string} JSON string representation of the level data
   */
  static convertToJson(levelData) {
    return JSON.stringify(levelData, null, 2);
  }

  /**
   * Creates a LevelDataComposite from a JSON string
   * @param {string} jsonString - JSON string representation of level data
   * @returns {LevelDataComposite} The reconstructed level data
   */
  static createFromJson(jsonString) {
    const data = JSON.parse(jsonString);

    // Reconstruct the LevelDataComposite from the parsed data
    return new LevelDataComposite(
      data.levelHeaderData,
      data.levelGameplayTraitsData,
      data.levelCompletionRewardBundle
    );
  }
}
