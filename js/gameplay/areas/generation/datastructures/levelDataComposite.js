/**
 * LevelDataComposite serves as a structured data container for all level-related information.
 * This class is the primary data carrier used to initialize gameplay levels, combining
 * multiple aspects of level design into a single cohesive structure.
 *
 * Data Structure Hierarchy:
 * - LevelHeaderData: Basic level metadata and identification
 * - LevelGameplayTraitsData: Gameplay mechanics and special features
 * - LevelCompletionRewards: Rewards and achievements
 *
 * This class is typically instantiated from JSON configuration files and serves
 * as the blueprint from which ActiveGameplayLevel instances are created.
 * It separates the concerns of data storage from runtime gameplay mechanics.
 */
class LevelDataComposite {
  /**
   * Creates a new LevelDataComposite instance.
   * @param {LevelHeaderData} levelHeaderData - Contains basic level information like name, ID, and description
   * @param {LevelGameplayTraitsData} levelGameplayTraitsData - Defines gameplay mechanics and rules specific to this level
   * @param {RewardBundleComposite} levelCompletionRewardBundle - Specifies rewards granted upon level completion
   */
  constructor(
    levelHeaderData,
    levelGameplayTraitsData,
    levelCompletionRewardBundle
  ) {
    /** @type {LevelHeaderData} Basic level metadata and identification information */
    this.levelHeaderData = levelHeaderData;
    /** @type {LevelGameplayTraitsData} Gameplay mechanics and special features configuration */
    this.levelGameplayTraitsData = levelGameplayTraitsData;
    /** @type {RewardBundleComposite} Rewards and achievements granted upon level completion */
    this.levelCompletionRewardBundle = levelCompletionRewardBundle;
  }
}
