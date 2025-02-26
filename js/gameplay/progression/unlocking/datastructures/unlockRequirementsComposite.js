/**
 * Base class for defining requirements to unlock game content.
 *
 * This class provides the foundation for creating unlock requirements that can be
 * validated against a player's progress or state. Game-specific implementations
 * should extend this class to add specialized requirements.
 *
 * Example usage:
 *   const unlockReq = new UnlockRequirementsComposite(
 *     new UnlockHeaderData("feature", "MysticSpell", "1.0.0", []),
 *     new UnlockFeasibilityData(["fireSpell", "waterSpell"], ["ancientArtifact"], [], [], 10),
 *     new UnlockProgressData(["firstBlood"], 100, ["forestRegion"], ["specialEvent"]),
 *     new UnlockPartnerData(["asia"], ["partnerA"]),
 *     new UnlockTechnicalData(["futureTag"], ["emergencyTag"])
 *   );
 *
 * @class UnlockRequirementsComposite
 */
class UnlockRequirementsComposite {
  /**
   * Constructs a new set of unlock requirements.
   *
   * @param {UnlockHeaderData} headerData - Basic identification and classification data
   * @param {UnlockFeasibilityData} feasibilityData - Capability requirements data
   * @param {UnlockProgressData} progressData - Player progression requirements data
   * @param {UnlockTechnicalData} technicalData - Technical and future-proofing requirements data as well as partner data
   */
  constructor(
    headerData = new UnlockHeaderData(),
    feasibilityData = new UnlockFeasibilityData(),
    progressData = new UnlockProgressData(),
    technicalData = new UnlockTechnicalData()
  ) {
    // Basic identification and classification data
    this.headerData = headerData;

    // Capability requirements data
    this.feasibilityData = feasibilityData;

    // Player progression requirements data
    this.progressData = progressData;

    // Technical and future-proofing requirements data
    this.technicalData = technicalData;
  }

  /**
   * Converts the requirements to a plain object for serialization.
   *
   * @returns {Object} A plain object representation of the requirements.
   */
  toJSON() {
    return {
      headerData: this.headerData.toJSON(),
      feasibilityData: this.feasibilityData.toJSON(),
      progressData: this.progressData.toJSON(),
      technicalData: this.technicalData.toJSON(),
    };
  }

  /**
   * Creates an instance from a plain object (deserialization).
   *
   * @param {Object} data - The plain object to create an instance from.
   * @returns {UnlockRequirementsComposite} A new instance with the provided data.
   */
  static fromJSON(data) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.fromJSON(data.headerData),
      UnlockFeasibilityData.fromJSON(data.feasibilityData),
      UnlockProgressData.fromJSON(data.progressData),
      UnlockTechnicalData.fromJSON(data.technicalData)
    );
  }

  /**
   * Creates a basic requirements object with minimal settings.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @returns {UnlockRequirementsComposite} A basic requirements object
   */
  static createBasicRequirements(contentType, contentName) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createBasicLevelRequirement(0),
      UnlockProgressData.createNoProgressRequirement(),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a requirements object for level-gated content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockRequirementsComposite} A level-gated requirements object
   */
  static createLevelGatedRequirements(contentType, contentName, playerLevel) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createBasicLevelRequirement(playerLevel),
      UnlockProgressData.createNoProgressRequirement(),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a requirements object for premium content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {string} premiumType - The type of premium status required
   * @returns {UnlockRequirementsComposite} A premium content requirements object
   */
  static createPremiumRequirements(contentType, contentName, premiumType) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createPremiumContentHeader(
        contentType,
        contentName,
        premiumType
      ),
      UnlockFeasibilityData.createBasicLevelRequirement(0),
      UnlockProgressData.createNoProgressRequirement(),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a requirements object for progression-based content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {Array} prerequisites - Array of prerequisite content identifiers
   * @returns {UnlockRequirementsComposite} A progression-based requirements object
   */
  static createProgressionRequirements(
    contentType,
    contentName,
    prerequisites
  ) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createBasicLevelRequirement(0),
      UnlockProgressData.createPrerequisiteRequirement(prerequisites),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a requirements object for capability-based content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {Array} requiredSpells - Array of required spells
   * @param {Array} requiredArtifacts - Array of required artifacts
   * @returns {UnlockRequirementsComposite} A capability-based requirements object
   */
  static createCapabilityRequirements(
    contentType,
    contentName,
    requiredSpells,
    requiredArtifacts
  ) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createAdvancedRequirement(
        requiredSpells,
        requiredArtifacts,
        [],
        [],
        0
      ),
      UnlockProgressData.createNoProgressRequirement(),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a requirements object for achievement-based content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {Array} requiredAchievements - Array of required achievement identifiers
   * @param {number} requiredPoints - The total achievement points required
   * @returns {UnlockRequirementsComposite} An achievement-based requirements object
   */
  static createAchievementRequirements(
    contentType,
    contentName,
    requiredAchievements,
    requiredPoints
  ) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createBasicLevelRequirement(0),
      UnlockProgressData.createComprehensiveRequirement(
        requiredAchievements,
        requiredPoints,
        [],
        []
      ),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a requirements object for time-limited event content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {string} eventName - The name of the event
   * @param {Date} startDate - The start date of the event
   * @param {Date} endDate - The end date of the event
   * @returns {UnlockRequirementsComposite} A time-limited event requirements object
   */
  static createEventRequirements(
    contentType,
    contentName,
    eventName,
    startDate,
    endDate
  ) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createBasicLevelRequirement(0),
      UnlockProgressData.createTimeLimitedEventRequirement(
        eventName,
        startDate,
        endDate
      ),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }

  /**
   * Creates a comprehensive requirements object with multiple requirement types.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {number} playerLevel - The minimum player level required
   * @param {Array} requiredSpells - Array of required spells
   * @param {Array} requiredArtifacts - Array of required artifacts
   * @param {Array} requiredAchievements - Array of required achievement identifiers
   * @param {Array} prerequisites - Array of prerequisite content identifiers
   * @returns {UnlockRequirementsComposite} A comprehensive requirements object
   */
  static createComprehensiveRequirements(
    contentType,
    contentName,
    playerLevel,
    requiredSpells,
    requiredArtifacts,
    requiredAchievements,
    prerequisites
  ) {
    return new UnlockRequirementsComposite(
      UnlockHeaderData.createFreeContentHeader(contentType, contentName),
      UnlockFeasibilityData.createAdvancedRequirement(
        requiredSpells,
        requiredArtifacts,
        [],
        [],
        playerLevel
      ),
      UnlockProgressData.createComprehensiveRequirement(
        requiredAchievements,
        0,
        prerequisites,
        []
      ),
      UnlockPartnerData.createNoPartnerRequirement(),
      UnlockTechnicalData.createNoTechnicalRequirement()
    );
  }
}
