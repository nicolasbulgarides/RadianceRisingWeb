/**
 * Header class that identifies the type of accomplishment being recognized.
 *
 * This class serves as a metadata container that helps the AccomplishmentRecognitionFactory
 * determine which specific accomplishment data structure to create and populate.
 * Various game systems will generate these headers to initiate the accomplishment
 * recognition process.
 */
class AccomplishmentProfileHeader {
  /**
   * Creates a new accomplishment profile header
   * @param {string} accomplishmentCategory - Primary classification of the accomplishment (e.g., "quest", "combat", "pet")
   * @param {string} accomplishmentSubCategory - Secondary classification within the category
   * @param {string} sourceSystem - The game system that generated this accomplishment
   * @param {string} uniqueIdentifier - A unique identifier for this specific accomplishment instance
   * @param {number} timestamp - When this accomplishment occurred
   * @param {Object} metaData - Additional metadata about this accomplishment
   */
  constructor(
    accomplishmentCategory,
    accomplishmentSubCategory,
    sourceSystem,
    uniqueIdentifier,
    timestamp = Date.now(),
    metaData = {}
  ) {
    this.accomplishmentCategory = accomplishmentCategory;
    this.accomplishmentSubCategory = accomplishmentSubCategory;
    this.sourceSystem = sourceSystem;
    this.uniqueIdentifier = uniqueIdentifier;
    this.timestamp = timestamp;
    this.metaData = metaData;
  }

  /**
   * Creates a standardized string representation of this header for logging and debugging
   * @returns {string} A string representation of this header
   */
  toString() {
    return `[${this.accomplishmentCategory}:${this.accomplishmentSubCategory}] from ${this.sourceSystem} (${this.uniqueIdentifier})`;
  }

  /**
   * Validates that this header contains all required fields with valid values
   * @returns {boolean} Whether this header is valid
   */
  isValid() {
    return (
      !!this.accomplishmentCategory &&
      !!this.accomplishmentSubCategory &&
      !!this.sourceSystem &&
      !!this.uniqueIdentifier
    );
  }

  /**
   * Factory method to create a header for a quest accomplishment
   * @param {string} questId - The ID of the quest
   * @param {string} questStage - The stage of the quest (e.g., "started", "completed")
   * @param {Object} metaData - Additional metadata
   * @returns {AccomplishmentProfileHeader} A new quest accomplishment header
   */
  static createQuestHeader(questId, questStage, metaData = {}) {
    return new AccomplishmentProfileHeader(
      "quest",
      questStage,
      "questSystem",
      `quest_${questId}_${questStage}`,
      Date.now(),
      metaData
    );
  }

  /**
   * Factory method to create a header for a combat accomplishment
   * @param {string} combatType - The type of combat (e.g., "boss", "pvp")
   * @param {string} combatOutcome - The outcome of the combat (e.g., "victory", "defeat")
   * @param {string} combatId - A unique identifier for this combat instance
   * @param {Object} metaData - Additional metadata
   * @returns {AccomplishmentProfileHeader} A new combat accomplishment header
   */
  static createCombatHeader(
    combatType,
    combatOutcome,
    combatId,
    metaData = {}
  ) {
    return new AccomplishmentProfileHeader(
      "combat",
      combatType,
      "combatSystem",
      `combat_${combatId}_${combatOutcome}`,
      Date.now(),
      metaData
    );
  }

  /**
   * Factory method to create a header for a pet accomplishment
   * @param {string} petId - The ID of the pet
   * @param {string} eventType - The type of pet event (e.g., "acquired", "levelUp")
   * @param {Object} metaData - Additional metadata
   * @returns {AccomplishmentProfileHeader} A new pet accomplishment header
   */
  static createPetHeader(petId, eventType, metaData = {}) {
    return new AccomplishmentProfileHeader(
      "pet",
      eventType,
      "petSystem",
      `pet_${petId}_${eventType}`,
      Date.now(),
      metaData
    );
  }

  /**
   * Factory method to create a header for an achievement accomplishment
   * @param {string} achievementId - The ID of the achievement
   * @param {string} achievementGroup - The group the achievement belongs to
   * @param {Object} metaData - Additional metadata
   * @returns {AccomplishmentProfileHeader} A new achievement accomplishment header
   */
  static createAchievementHeader(
    achievementId,
    achievementGroup,
    metaData = {}
  ) {
    return new AccomplishmentProfileHeader(
      "achievement",
      achievementGroup,
      "achievementSystem",
      `achievement_${achievementId}`,
      Date.now(),
      metaData
    );
  }
}
