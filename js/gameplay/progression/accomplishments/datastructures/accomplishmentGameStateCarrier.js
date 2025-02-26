/**
 * A flexible container for relevant game state data needed for accomplishment recognition.
 *
 * This class serves as a data carrier that provides the AccomplishmentRecognitionFactory
 * with all necessary context to create the appropriate accomplishment data structure.
 * Different accomplishment types require different state information, so this carrier
 * uses a flexible property bag approach.
 */
class AccomplishmentGameStateCarrier {
  /**
   * Creates a new game state carrier for accomplishment recognition
   * @param {Object} stateData - Object containing all relevant state data for the accomplishment
   */
  constructor(stateData = {}) {
    this.stateData = stateData;
  }

  /**
   * Gets a value from the state data
   * @param {string} key - The key to retrieve
   * @param {*} defaultValue - Value to return if key doesn't exist
   * @returns {*} The value associated with the key, or the default value
   */
  getValue(key, defaultValue = null) {
    return this.stateData.hasOwnProperty(key)
      ? this.stateData[key]
      : defaultValue;
  }

  /**
   * Sets a value in the state data
   * @param {string} key - The key to set
   * @param {*} value - The value to associate with the key
   * @returns {AccomplishmentGameStateCarrier} This instance for chaining
   */
  setValue(key, value) {
    this.stateData[key] = value;
    return this;
  }

  /**
   * Checks if the state data contains a specific key
   * @param {string} key - The key to check
   * @returns {boolean} Whether the key exists in the state data
   */
  hasKey(key) {
    return this.stateData.hasOwnProperty(key);
  }

  /**
   * Creates a specialized state carrier for quest accomplishments
   * @param {string} questId - ID of the quest
   * @param {string} questName - Name of the quest
   * @param {string} questDescription - Description of the quest
   * @param {string|number} progressStage - Current progress stage
   * @param {string|number} rarityTier - Rarity tier of the quest
   * @param {string|number} difficultyTier - Difficulty tier of the quest
   * @param {string} location - Location of the quest
   * @returns {AccomplishmentGameStateCarrier} A new state carrier for quest data
   */
  static forQuest(
    questId,
    questName,
    questDescription,
    progressStage,
    rarityTier,
    difficultyTier,
    location
  ) {
    return new AccomplishmentGameStateCarrier({
      questId,
      questName,
      questDescription,
      questProgressStage: progressStage,
      questRarityTier: rarityTier,
      questDifficultyTier: difficultyTier,
      questLocation: location,
    });
  }

  /**
   * Creates a specialized state carrier for combat accomplishments
   * @param {string} eventType - Type of combat event
   * @param {string} outcome - Outcome of the combat
   * @param {Array<string>} defeatedEntities - IDs of defeated entities
   * @param {Array<string>} victorEntities - IDs of victorious entities
   * @param {string} location - Location of the combat
   * @param {string|number} difficultyTier - Difficulty tier of the combat
   * @param {string|number} rarityTier - Rarity tier of the combat
   * @param {Object} additionalData - Any additional relevant data
   * @returns {AccomplishmentGameStateCarrier} A new state carrier for combat data
   */
  static forCombat(
    eventType,
    outcome,
    defeatedEntities,
    victorEntities,
    location,
    difficultyTier,
    rarityTier,
    additionalData = {}
  ) {
    return new AccomplishmentGameStateCarrier({
      combatEventType: eventType,
      combatOutcome: outcome,
      idsOfDefeatedEntities: defeatedEntities,
      idsOfVictorEntities: victorEntities,
      combatEventLocation: location,
      combatEventDifficultyTier: difficultyTier,
      combatEventRarityTier: rarityTier,
      otherRelevantData: additionalData,
    });
  }

  /**
   * Creates a specialized state carrier for achievement accomplishments
   * @param {string} achievementId - ID of the achievement
   * @param {string} achievementName - Name of the achievement
   * @param {number} pointsValue - Points value of the achievement
   * @param {string} group - Group the achievement belongs to
   * @returns {AccomplishmentGameStateCarrier} A new state carrier for achievement data
   */
  static forAchievement(achievementId, achievementName, pointsValue, group) {
    return new AccomplishmentGameStateCarrier({
      achievementId,
      nameOfAcheivement: achievementName,
      achivementPointsValue: pointsValue,
      achievementGroup: group,
    });
  }

  /**
   * Creates a specialized state carrier for basic milestone accomplishments
   * @param {string} category - Primary category of the milestone
   * @param {string} subCategory - Sub-category of the milestone
   * @param {string} nickName - User-friendly name for the milestone
   * @param {string|number} value - Primary value associated with the milestone
   * @param {number} magnitude - Numeric measure of the milestone's significance
   * @param {Object} additionalData - Any additional relevant data
   * @returns {AccomplishmentGameStateCarrier} A new state carrier for basic milestone data
   */
  static forBasicMilestone(
    category,
    subCategory,
    nickName,
    value,
    magnitude,
    additionalData = {}
  ) {
    return new AccomplishmentGameStateCarrier({
      accomplishmentCategory: category,
      accomplishmentSubCategory: subCategory,
      accomplishmentNickName: nickName,
      accomplishmentValue: value,
      accomplishmentMagnitude: magnitude,
      otherRelevantData: additionalData,
    });
  }
}
