/**
 * Factory class providing preset configurations for unlock requirements.
 *
 * This class contains static methods that create commonly used configurations
 * for unlock requirements. Game-specific presets can extend this class
 * to add specialized configurations.
 *
 * @class UnlockPresets
 */
class UnlockPresets {
  /**
   * Creates an easy access unlock requirement with minimal restrictions.
   * Suitable for tutorial content, starting zones, or free content.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @returns {UnlockRequirementsComposite} An easy access unlock requirement.
   */
  static getEasyAccessUnlockRequirement(
    contentType = "tutorial",
    contentName = "introduction"
  ) {
    return UnlockRequirementsComposite.createBasicRequirements(
      contentType,
      contentName
    );
  }

  /**
   * Creates a generic unlock requirement with standard restrictions.
   * Suitable for normal progression content.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {number} playerLevelRequirement - The minimum player level required.
   * @returns {UnlockRequirementsComposite} A generic unlock requirement.
   */
  static getGenericUnlockRequirement(
    contentType = "standard-content",
    contentName = "standard-level",
    playerLevelRequirement = 5
  ) {
    const headerData = UnlockHeaderData.createFreeContentHeader(
      contentType,
      contentName
    );
    const feasibilityData = UnlockFeasibilityData.createBasicLevelRequirement(
      playerLevelRequirement
    );
    const progressData = UnlockProgressData.createPrerequisiteRequirement([
      "complete-previous-content",
    ]);

    return new UnlockRequirementsComposite(
      headerData,
      feasibilityData,
      progressData,
      new UnlockPartnerData(),
      new UnlockTechnicalData()
    );
  }

  /**
   * Creates a premium unlock requirement that requires premium status.
   * Suitable for premium or DLC content.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {string} premiumType - The type of premium status required.
   * @returns {UnlockRequirementsComposite} A premium unlock requirement.
   */
  static getPremiumUnlockRequirement(
    contentType = "premium-content",
    contentName = "premium-content",
    premiumType = "standard-subscription"
  ) {
    return UnlockRequirementsComposite.createPremiumRequirements(
      contentType,
      contentName,
      premiumType
    );
  }

  /**
   * Creates a challenge unlock requirement with high restrictions.
   * Suitable for endgame or challenge content.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {number} playerLevelRequirement - The minimum player level required.
   * @returns {UnlockRequirementsComposite} A challenge unlock requirement.
   */
  static getChallengeUnlockRequirement(
    contentType = "challenge-content",
    contentName = "challenge-content",
    playerLevelRequirement = 30
  ) {
    const headerData = UnlockHeaderData.createFreeContentHeader(
      contentType,
      contentName
    );
    const feasibilityData = UnlockFeasibilityData.createBasicLevelRequirement(
      playerLevelRequirement
    );
    const progressData = UnlockProgressData.createComprehensiveRequirement(
      [], // No specific achievements
      0, // No achievement points
      ["complete-main-story"], // Prerequisite content
      ["obtain-special-item", "defeat-boss"] // Special requirements
    );

    return new UnlockRequirementsComposite(
      headerData,
      feasibilityData,
      progressData,
      new UnlockPartnerData(),
      new UnlockTechnicalData()
    );
  }

  /**
   * Creates a region-specific unlock requirement.
   * Suitable for content that is only available in certain regions.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {Array} regions - Array of region identifiers where the content is available.
   * @returns {UnlockRequirementsComposite} A region-specific unlock requirement.
   */
  static getRegionSpecificUnlockRequirement(
    contentType = "regional-content",
    contentName = "regional-content",
    regions = ["global"]
  ) {
    const headerData = UnlockHeaderData.createFreeContentHeader(
      contentType,
      contentName
    );
    const partnerData =
      UnlockPartnerData.createRegionSpecificRequirement(regions);

    return new UnlockRequirementsComposite(
      headerData,
      new UnlockFeasibilityData(),
      new UnlockProgressData(),
      partnerData,
      new UnlockTechnicalData()
    );
  }

  /**
   * Creates a time-limited event unlock requirement.
   * Suitable for seasonal or holiday events.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {string} eventName - The name of the event.
   * @param {Date} startDate - The start date of the event.
   * @param {Date} endDate - The end date of the event.
   * @returns {UnlockRequirementsComposite} A time-limited event unlock requirement.
   */
  static getTimeLimitedEventUnlockRequirement(
    contentType = "event-content",
    contentName = "event-content",
    eventName = "special-event",
    startDate = new Date(),
    endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // One week from now
  ) {
    return UnlockRequirementsComposite.createEventRequirements(
      contentType,
      contentName,
      eventName,
      startDate,
      endDate
    );
  }

  /**
   * Creates an achievement-based unlock requirement.
   * Suitable for content that requires specific achievements or achievement points.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {Array} achievements - Array of required achievement identifiers.
   * @param {number} achievementPoints - The total achievement points required.
   * @returns {UnlockRequirementsComposite} An achievement-based unlock requirement.
   */
  static getAchievementBasedUnlockRequirement(
    contentType = "achievement-content",
    contentName = "achievement-content",
    achievements = [],
    achievementPoints = 100
  ) {
    return UnlockRequirementsComposite.createAchievementRequirements(
      contentType,
      contentName,
      achievements,
      achievementPoints
    );
  }

  /**
   * Creates a capability-based unlock requirement.
   * Suitable for content that requires specific player capabilities.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {Array} requiredSpells - Array of required spell identifiers.
   * @param {Array} requiredArtifacts - Array of required artifact identifiers.
   * @returns {UnlockRequirementsComposite} A capability-based unlock requirement.
   */
  static getCapabilityBasedUnlockRequirement(
    contentType = "capability-content",
    contentName = "capability-content",
    requiredSpells = [],
    requiredArtifacts = []
  ) {
    return UnlockRequirementsComposite.createCapabilityRequirements(
      contentType,
      contentName,
      requiredSpells,
      requiredArtifacts
    );
  }

  /**
   * Creates a comprehensive unlock requirement with multiple conditions.
   * Suitable for complex content with various requirements.
   *
   * @param {string} contentType - The type of content this requirement applies to.
   * @param {string} contentName - The name of the content to be unlocked.
   * @param {number} playerLevel - The minimum player level required.
   * @param {Array} requiredSpells - Array of required spell identifiers.
   * @param {Array} requiredArtifacts - Array of required artifact identifiers.
   * @param {Array} requiredAchievements - Array of required achievement identifiers.
   * @param {Array} prerequisites - Array of prerequisite content identifiers.
   * @returns {UnlockRequirementsComposite} A comprehensive unlock requirement.
   */
  static getComprehensiveUnlockRequirement(
    contentType = "advanced-content",
    contentName = "advanced-content",
    playerLevel = 20,
    requiredSpells = [],
    requiredArtifacts = [],
    requiredAchievements = [],
    prerequisites = []
  ) {
    return UnlockRequirementsComposite.createComprehensiveRequirements(
      contentType,
      contentName,
      playerLevel,
      requiredSpells,
      requiredArtifacts,
      requiredAchievements,
      prerequisites
    );
  }
}
