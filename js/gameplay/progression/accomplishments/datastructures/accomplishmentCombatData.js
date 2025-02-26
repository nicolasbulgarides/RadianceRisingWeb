/**
 * Data structure for tracking combat-related accomplishments.
 *
 * Tracks battles against various enemy types including basic enemies (foes),
 * minibosses, bosses, and special/super bosses. Combat events can be categorized
 * as random encounters, triggered encounters, quest encounters, boss encounters, etc.
 *
 * Combat outcomes can include victory, defeat, escape, surrender, stalemate,
 * scorched earth, and other possible results.
 */
class AccomplishmentCombatData {
  /**
   * Creates a new combat accomplishment data instance
   * @param {string} combatEventType - Type of combat event (e.g., "randomEncounter", "bossEncounter")
   * @param {string} combatOutcome - Result of the combat (e.g., "victory", "defeat", "escape")
   * @param {Array<string>} idsOfDefeatedEntities - IDs of entities that were defeated
   * @param {Array<string>} idsOfVictorEntities - IDs of entities that were victorious
   * @param {string} combatEventLocation - Where the combat took place
   * @param {string|number} combatEventDifficultyTier - Difficulty rating of the combat
   * @param {string|number} combatEventRarityTier - Rarity rating of the combat event
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    combatEventType,
    combatOutcome,
    idsOfDefeatedEntities,
    idsOfVictorEntities,
    combatEventLocation,
    combatEventDifficultyTier,
    combatEventRarityTier,
    otherRelevantData
  ) {
    this.combatEventType = combatEventType;
    this.combatOutcome = combatOutcome;
    this.idsOfDefeatedEntities = idsOfDefeatedEntities;
    this.idsOfVictorEntities = idsOfVictorEntities;
    this.otherRelevantData = otherRelevantData;
    this.combatEventLocation = combatEventLocation;
    this.combatEventDifficultyTier = combatEventDifficultyTier;
    this.combatEventRarityTier = combatEventRarityTier;
  }
}
