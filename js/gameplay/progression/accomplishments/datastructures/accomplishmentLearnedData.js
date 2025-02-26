/**
 * Data structure for tracking the learning of capabilities and lore facts.
 * Tracks when players learn new abilities, spells, skills, or discover
 * important lore information within the game world.
 */
class AccomplishmentLearnedData {
  /**
   * Creates a new learning accomplishment data instance
   * @param {string} idOfLearnedThing - Unique identifier for the learned capability or lore fact
   * @param {boolean} wasACapabilityLearned - Whether a capability (ability/spell/skill) was learned
   * @param {string} capabilityCategory - Category of the learned capability (if applicable)
   * @param {boolean} wasALoreFactLearned - Whether a lore fact was learned
   * @param {string} loreFactCategory - Category of the learned lore fact (if applicable)
   * @param {number|string} possiblyRelevantValue - Optional value associated with the learning
   */
  constructor(
    idOfLearnedThing,
    wasACapabilityLearned,
    capabilityCategory,
    wasALoreFactLearned,
    loreFactCategory,
    possiblyRelevantValue
  ) {
    this.idOfLearnedThing = idOfLearnedThing;
    this.wasACapabilityLearned = wasACapabilityLearned;
    this.capabilityCategory = capabilityCategory;
    this.wasALoreFactLearned = wasALoreFactLearned;
    this.loreFactCategory = loreFactCategory;
    this.possiblyRelevantValue = possiblyRelevantValue;
  }
}
