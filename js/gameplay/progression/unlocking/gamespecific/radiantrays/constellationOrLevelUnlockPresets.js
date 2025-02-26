/**
 * Factory class providing preset configurations for constellation and level unlock requirements.
 *
 * This class extends the base AreaUnlockPresets to add game-specific presets for
 * Radiant Rays constellations and levels. It provides factory methods to create
 * commonly used configurations with appropriate defaults.
 *
 * @class ConstellationOrLevelPresets
 * @extends AreaUnlockPresets
 */
class ConstellationOrLevelPresets extends AreaUnlockPresets {
  /**
   * Creates a basic unlock requirement with a minimum level requirement for either
   * a constellation or a level.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {number} playerMinimumLevelRequirement - The minimum player level required.
   * @returns {ConstellationOrLevelUnlockRequirements} A constellation unlock requirement.
   */
  static getBasicUnlockWithMinimumLevelRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    playerMinimumLevelRequirement = 5
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      constellationOrLevelType,
      constellationOrLevelName
    );
    const feasibilityData =
      AreaUnlockFeasibilityData.createBasicLevelRequirement(
        playerMinimumLevelRequirement
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
   * Creates a basic unlock requirement with an area unlocked requirement for either
   * a constellation or a level. Note this bypasses level requirements, though there
   * may be indirect level requirements based on the areas that must be previously unlocked.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {Array} requiredPrerequisiteAreas - Array of prerequisite area identifiers.
   * @returns {ConstellationOrLevelUnlockRequirements} A constellation unlock requirement.
   */
  static getBasicUnlockWithAreaUnlockedRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    requiredPrerequisiteAreas
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      constellationOrLevelType,
      constellationOrLevelName
    );
    const progressData = AreaUnlockProgressData.createPrerequisiteRequirement(
      requiredPrerequisiteAreas
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      progressData,
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates an unlock requirement based off a necessary premium status.
   * Note that this allows for various categories of premium status, though
   * community goodwill may depend on good value premium / no nickle-and-diming.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {string} premiumStatusRequired - The type of premium status required.
   * @returns {ConstellationOrLevelUnlockRequirements} A premium constellation unlock requirement.
   */
  static getPremiumUnlockRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    premiumTypeRequired = "standard-subscription"
  ) {
    return ConstellationOrLevelUnlockRequirements.createPremiumContentRequirement(
      constellationOrLevelType,
      constellationOrLevelName,
      premiumTypeRequired
    );
  }

  /**
   * Creates an advanced level unlock requirement with spell and artifact requirements
   * to ensure that a player has access to the necessary spells and artifacts
   * to unlock the constellation and solve the levels it contains.
   * AKA - if it is not feasible, then don't show it as available to the player.
   *
   * @param {string} constellationName - The name of the constellation to unlock.
   * @param {Array} requiredSpells - Array of spell identifiers required.
   * @param {Array} requiredArtifacts - Array of artifact identifiers required.
   * @param {Array} specialRequirements - Array of special requirements.
   * @returns {ConstellationOrLevelUnlockRequirements} An advanced level unlock requirement.
   */
  static getFeasibilityConstellationUnlockRequirement(
    constellationName,
    requiredSpells = [],
    requiredArtifacts = [],
    specialRequirements = []
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );
    const feasibilityData = AreaUnlockFeasibilityData.createAdvancedRequirement(
      requiredSpells,
      requiredArtifacts,
      [],
      [],
      0
    );
    const progressData =
      AreaUnlockProgressData.createSpecialRequirement(specialRequirements);

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      feasibilityData,
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates an advanced level unlock requirement with requirements that
   * depend on a player's progress in the game - their level, total achievements, or
   * specific achievements in some unusual cases. Note that for this specific preset
   * factory method, no spells or artifacts are directly assumed as required,
   * but may be indirectly required through the achievement requirements.
   *
   * For example "Elemental Master" may mean Wind, Water, Fire, Earth are unlocked
   * and that requirement would create an indirect dependency.
   *
   * @param {string} constellationName - The name of the constellation to unlock.
   * @param {number} playerMinimumLevelRequirement - The minimum player level required.
   * @param {number} requiredMinimumAchievementPoints - The minimum achievement points required.
   * @param {Array} requiredSpecificAchievements - Array of specific achievement identifiers required.
   * @returns {ConstellationOrLevelUnlockRequirements} An advanced level unlock requirement.
   */
  static getMilestoneConstellationUnlockRequirement(
    constellationName,
    playerMinimumLevelRequirement = 10,
    requiredMinimumAchievementPoints = 0,
    requiredSpecificAchievements = []
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      "constellation",
      constellationName
    );
    const feasibilityData =
      AreaUnlockFeasibilityData.createBasicLevelRequirement(
        playerMinimumLevelRequirement
      );
    const progressData = AreaUnlockProgressData.createComprehensiveRequirement(
      requiredSpecificAchievements,
      requiredMinimumAchievementPoints,
      [],
      []
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      feasibilityData,
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a sequential level unlock requirement where a player must complete
   * previous levels in a sequence before unlocking this one. This is useful for
   * creating a linear progression path through a constellation.
   *
   * @param {string} levelName - The name of the level to unlock.
   * @param {Array} prerequisiteLevels - Array of level names that must be completed before this one.
   * @returns {ConstellationOrLevelUnlockRequirements} A sequential level unlock requirement.
   */
  static getSequentialLevelUnlockRequirement(
    levelName,
    prerequisiteLevels = []
  ) {
    return ConstellationOrLevelUnlockRequirements.createSequentialLevelRequirement(
      levelName,
      prerequisiteLevels
    );
  }

  /**
   * Creates a time-limited event unlock requirement for special events,
   * seasonal content, or holiday-themed constellations/levels.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {string} eventName - The name of the event this content is associated with.
   * @param {Date} startDate - The date when this content becomes available.
   * @param {Date} endDate - The date when this content is no longer available.
   * @returns {ConstellationOrLevelUnlockRequirements} A time-limited event unlock requirement.
   */
  static getTimeLimitedEventUnlockRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    eventName,
    startDate,
    endDate
  ) {
    return ConstellationOrLevelUnlockRequirements.createTimeLimitedEventRequirement(
      constellationOrLevelType,
      constellationOrLevelName,
      eventName,
      startDate,
      endDate
    );
  }

  /**
   * Creates a difficulty-based unlock requirement where content is unlocked
   * based on the player's chosen difficulty level. This allows for providing
   * different progression paths for casual vs hardcore players.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {string} minimumDifficulty - The minimum difficulty level required ("easy", "normal", "hard", "expert").
   * @returns {ConstellationOrLevelUnlockRequirements} A difficulty-based unlock requirement.
   */
  static getDifficultyBasedUnlockRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    minimumDifficulty = "normal"
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      constellationOrLevelType,
      constellationOrLevelName
    );
    const progressData = AreaUnlockProgressData.createSpecialRequirement([
      {
        type: "difficulty-requirement",
        minimumDifficulty: minimumDifficulty,
      },
    ]);

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      progressData,
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }

  /**
   * Creates a social unlock requirement where content is unlocked based on
   * social interactions or community participation. This encourages community
   * engagement and can be used for special community events or challenges.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {Array} socialRequirements - Array of social requirements (e.g., "refer-friend", "join-guild").
   * @returns {ConstellationOrLevelUnlockRequirements} A social-based unlock requirement.
   */
  static getSocialUnlockRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    socialRequirements = ["refer-friend"]
  ) {
    const headerData = AreaUnlockHeaderData.createFreeContentHeader(
      constellationOrLevelType,
      constellationOrLevelName
    );
    const progressData = AreaUnlockProgressData.createSpecialRequirement(
      socialRequirements.map((req) => ({
        type: "social-requirement",
        requirement: req,
      }))
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
   * Creates a game version requirement where content is only available in
   * specific versions of the game. This is useful for managing feature rollouts
   * or ensuring players have updated to a version with necessary features.
   *
   * @param {string} constellationOrLevelType - The type of constellation or level to unlock.
   * @param {string} constellationOrLevelName - The name of the constellation or level to unlock.
   * @param {string} minimumGameVersion - The minimum game version required.
   * @returns {ConstellationOrLevelUnlockRequirements} A version-based unlock requirement.
   */
  static getGameVersionUnlockRequirement(
    constellationOrLevelType,
    constellationOrLevelName,
    minimumGameVersion = "1.0.0"
  ) {
    const headerData = AreaUnlockHeaderData.createVersionSpecificHeader(
      constellationOrLevelType,
      constellationOrLevelName,
      minimumGameVersion
    );

    return new ConstellationOrLevelUnlockRequirements(
      headerData,
      new AreaUnlockFeasibilityData(),
      new AreaUnlockProgressData(),
      new AreaUnlockPartnerData(),
      new AreaUnlockTechnicalData()
    );
  }
}
