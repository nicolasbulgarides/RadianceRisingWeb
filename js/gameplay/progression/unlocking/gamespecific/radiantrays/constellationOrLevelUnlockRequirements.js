/**
 * Class representing unlock requirements for either a game level or a constellation.
 *
 * This module defines the criteria needed to unlock specific game content in the context
 * of Radiant Rays. The unlock requirements may include minimum player level, required spells or
 * artifacts, various other capabilities, achievement-related criteria, constellation-based
 * conditions, and additional special requirements.
 *
 * Example usage:
 *   const unlockReq = new ConstellationOrLevelUnlockRequirements(
 *     new AreaUnlockHeaderData("level", "MysticLevel", "1.0.0", []),
 *     new AreaUnlockFeasibilityData(["fireSpell", "waterSpell"], ["ancientArtifact"], [], [], 10),
 *     new AreaUnlockProgressData(["firstBlood"], 100, ["orion"], ["specialEvent"]),
 *     new AreaUnlockPartnerData(["asia"], ["partnerA"]),
 *     new AreaUnlockTechnicalData(["futureTag"], ["emergencyTag"])
 *   );
 *
 * @class ConstellationOrLevelUnlockRequirements
 */
class ConstellationOrLevelUnlockRequirements extends AreaUnlockRequirements {
  /**
   * Construct a set of unlock requirements for a level or constellation.
   *
   * @param {AreaUnlockHeaderData} headerData - Basic identification and classification data
   * @param {AreaUnlockFeasibilityData} feasibilityData - Capability requirements data
   * @param {AreaUnlockProgressData} progressData - Player progression requirements data
   * @param {AreaUnlockPartnerData} partnerData - Business partnership requirements data
   * @param {AreaUnlockTechnicalData} technicalData - Technical and future-proofing requirements data
   */
  constructor(
    headerData = new AreaUnlockHeaderData(),
    feasibilityData = new AreaUnlockFeasibilityData(),
    progressData = new AreaUnlockProgressData(),
    partnerData = new AreaUnlockPartnerData(),
    technicalData = new AreaUnlockTechnicalData()
  ) {
    super(
      headerData,
      feasibilityData,
      progressData,
      partnerData,
      technicalData
    );
  }

  /**
   * Creates a basic constellation unlock requirement.
   *
   * @param {string} constellationName - The name of the constellation
   * @returns {ConstellationOrLevelUnlockRequirements} A basic constellation unlock requirement
   */
  static createBasicConstellationRequirement(constellationName) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      new AreaUnlockProgressData(),
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a basic level unlock requirement.
   *
   * @param {string} levelName - The name of the level
   * @returns {ConstellationOrLevelUnlockRequirements} A basic level unlock requirement
   */
  static createBasicLevelRequirement(levelName) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "level",
      levelName
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      new AreaUnlockProgressData(),
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a spell-focused constellation unlock requirement.
   *
   * @param {string} constellationName - The name of the constellation
   * @param {Array} requiredSpells - Array of required spell identifiers
   * @returns {ConstellationOrLevelUnlockRequirements} A spell-focused constellation unlock requirement
   */
  static createSpellFocusedConstellationRequirement(
    constellationName,
    requiredSpells
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );
    const feasibilityData =
      AreaUnlockFeasibilityData.createSpellFocusedRequirement(requiredSpells);

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      feasibilityData,
      new AreaUnlockProgressData(),
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates an artifact-focused constellation unlock requirement.
   *
   * @param {string} constellationName - The name of the constellation
   * @param {Array} requiredArtifacts - Array of required artifact identifiers
   * @returns {ConstellationOrLevelUnlockRequirements} An artifact-focused constellation unlock requirement
   */
  static createArtifactFocusedConstellationRequirement(
    constellationName,
    requiredArtifacts
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );
    const feasibilityData =
      AreaUnlockFeasibilityData.createArtifactFocusedRequirement(
        requiredArtifacts
      );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      feasibilityData,
      new AreaUnlockProgressData(),
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a sequential level unlock requirement.
   *
   * @param {string} levelName - The name of the level
   * @param {Array} prerequisiteLevels - Array of prerequisite level identifiers
   * @returns {ConstellationOrLevelUnlockRequirements} A sequential level unlock requirement
   */
  static createSequentialLevelRequirement(levelName, prerequisiteLevels) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "level",
      levelName
    );
    const progressData =
      AreaUnlockProgressData.createPrerequisiteRequirement(prerequisiteLevels);

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a premium constellation or level unlock requirement.
   *
   * @param {string} contentType - The type of content ("constellation" or "level")
   * @param {string} contentName - The name of the content
   * @param {string} premiumType - The type of premium status required
   * @returns {ConstellationOrLevelUnlockRequirements} A premium content unlock requirement
   */
  static createPremiumContentRequirement(
    contentType,
    contentName,
    premiumType
  ) {
    const headerData = AreaUnlockHeaderData.createPremiumContentHeader(
      contentType,
      contentName,
      premiumType
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      new AreaUnlockProgressData(),
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates an achievement-based constellation unlock requirement.
   *
   * @param {string} constellationName - The name of the constellation
   * @param {Array} requiredAchievements - Array of required achievement identifiers
   * @param {number} requiredPoints - The total achievement points required
   * @returns {ConstellationOrLevelUnlockRequirements} An achievement-based constellation unlock requirement
   */
  static createAchievementBasedConstellationRequirement(
    constellationName,
    requiredAchievements = [],
    requiredPoints = 0
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );
    const progressData = AreaUnlockProgressData.createComprehensiveRequirement(
      requiredAchievements,
      requiredPoints,
      [],
      []
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a time-limited event constellation or level unlock requirement.
   *
   * @param {string} contentType - The type of content ("constellation" or "level")
   * @param {string} contentName - The name of the content
   * @param {string} eventName - The name of the event
   * @param {Date} startDate - The start date of the event
   * @param {Date} endDate - The end date of the event
   * @returns {ConstellationOrLevelUnlockRequirements} A time-limited event content unlock requirement
   */
  static createTimeLimitedEventRequirement(
    contentType,
    contentName,
    eventName,
    startDate,
    endDate
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      contentType,
      contentName
    );
    const progressData =
      AreaUnlockProgressData.createTimeLimitedEventRequirement(
        eventName,
        startDate,
        endDate
      );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a comprehensive constellation unlock requirement with multiple conditions.
   *
   * @param {string} constellationName - The name of the constellation
   * @param {number} playerLevel - The minimum player level required
   * @param {Array} requiredSpells - Array of required spell identifiers
   * @param {Array} requiredArtifacts - Array of required artifact identifiers
   * @param {Array} requiredPerks - Array of required perk identifiers
   * @param {Array} requiredEnhancements - Array of required enhancement identifiers
   * @param {Array} requiredAchievements - Array of required achievement identifiers
   * @param {number} requiredPoints - The total achievement points required
   * @param {Array} prerequisiteConstellations - Array of prerequisite constellation identifiers
   * @param {Array} specialRequirements - Array of special requirement identifiers
   * @returns {ConstellationOrLevelUnlockRequirements} A comprehensive constellation unlock requirement
   */
  static createComprehensiveConstellationRequirement(
    constellationName,
    playerLevel = 0,
    requiredSpells = [],
    requiredArtifacts = [],
    requiredPerks = [],
    requiredEnhancements = [],
    requiredAchievements = [],
    requiredPoints = 0,
    prerequisiteConstellations = [],
    specialRequirements = []
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );
    const feasibilityData = AreaUnlockFeasibilityData.createAdvancedRequirement(
      requiredSpells,
      requiredArtifacts,
      requiredPerks,
      requiredEnhancements,
      playerLevel
    );
    const progressData = AreaUnlockProgressData.createComprehensiveRequirement(
      requiredAchievements,
      requiredPoints,
      prerequisiteConstellations,
      specialRequirements
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      feasibilityData,
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }
}
