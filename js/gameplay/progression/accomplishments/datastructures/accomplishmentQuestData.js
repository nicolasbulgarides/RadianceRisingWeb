/**
 * Data structure for tracking quest-related accomplishments.
 *
 * Used to identify and track essential qualities for quests that have been
 * either completed or progressed in stage. Quests have special rewards that
 * are validated, assembled, delivered, and displayed in a specialized manner.
 *
 * This will integrate with a future quest system including manager, factory,
 * UI manager, presets, and data structures/loaders.
 */
class AccomplishmentQuestData {
  /**
   * Creates a new quest accomplishment data instance
   * @param {string} questId - Unique identifier for the quest
   * @param {string} questName - Display name of the quest
   * @param {string} questDescription - Detailed description of the quest
   * @param {string|number} questProgressStage - Current progress stage of the quest
   * @param {string|number} questRarityTier - Rarity tier of the quest
   * @param {string|number} questDifficultyTier - Difficulty rating of the quest
   * @param {string} questLocation - Where the quest takes place
   */
  constructor(
    questId,
    questName,
    questDescription,
    questProgressStage,
    questRarityTier,
    questDifficultyTier,
    questLocation
  ) {
    this.questId = questId;
    this.questName = questName;
    this.questDescription = questDescription;
    this.questProgressStage = questProgressStage;
    this.questRarityTier = questRarityTier;
    this.questDifficultyTier = questDifficultyTier;
    this.questLocation = questLocation;
  }
}
