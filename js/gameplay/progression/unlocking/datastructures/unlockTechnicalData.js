/**
 * Class representing the technical data for unlock requirements.
 *
 * This class encapsulates technical requirements related to future-proofing,
 * debugging, and emergency situations. These requirements are typically used
 * for administrative purposes rather than normal gameplay progression.
 *
 * @class UnlockTechnicalData
 */
class UnlockTechnicalData {
  /**
   * Constructs a new set of unlock technical data.
   * @param {Array} currentPlatformRequirements - Array of current platform requirements
   * @param {Array} regionalPartnershipRequirements - Array of regional partnership requirements
   * @param {Array} businessPartnershipRequirements - Array of business partnership requirements
   * @param {Array} preemptiveFutureProofRequirements - Array of preemptive future-proof requirements
   * @param {Array} emergencyFutureProofRequirements - Array of emergency future-proof requirements
   */
  constructor(
    currentPlatformRequirements = [],
    regionalPartnershipRequirements = [],
    businessPartnershipRequirements = [],
    preemptiveFutureProofRequirements = [],
    emergencyFutureProofRequirements = []
  ) {
    // Requirements for the current platform to  be X, Y - assumed to not be relevant unless otherwise specified
    this.currentPlatformRequirements = currentPlatformRequirements;

    // Requirements for regional partnerships
    this.regionalPartnershipRequirements = regionalPartnershipRequirements;

    // Requirements for business partnerships
    this.businessPartnershipRequirements = businessPartnershipRequirements;

    // Requirements for future-proofing in case of anticipated changes
    this.preemptiveFutureProofRequirements = preemptiveFutureProofRequirements;

    // Requirements for emergency situations or major updates
    this.emergencyFutureProofRequirements = emergencyFutureProofRequirements;
  }

  /**
   * Creates technical data with no special requirements.
   *
   * @returns {UnlockTechnicalData} Basic technical data with no requirements
   */
  static createNoTechnicalRequirement() {
    return new UnlockTechnicalData();
  }

  /**
   * Creates technical data for content that may be affected by future updates.
   *
   * @param {Array} futureProofTags - Array of future-proof tag identifiers
   * @returns {UnlockTechnicalData} Future-proof technical data
   */
  static createPartnerlessFutureProofRequirement(futureProofTags = []) {
    return new UnlockTechnicalData([], [], futureProofTags, []);
  }

  /**
   * Creates technical data for content that involves some form of partnership.
   * @param {Array} currentPlatformRequirements - Array of current platform requirements
   * @param {Array} regionalPartnershipTags - Array of regional partnership tag identifiers
   * @param {Array} businessPartnershipTags - Array of business partnership tag identifiers
   * @param {Array} futureProofTags - Array of future-proof tag identifiers
   * @returns {UnlockTechnicalData} Future-proof technical data
   */
  static createPartneredFutureProofRequirement(
    currentPlatformRequirements = [],
    regionalPartnershipTags = [],
    businessPartnershipTags = [],
    futureProofTags = []
  ) {
    return new UnlockTechnicalData(
      currentPlatformRequirements,
      regionalPartnershipTags,
      businessPartnershipTags,
      futureProofTags,
      []
    );
  }

  /**
   * Creates technical data for content with all necessary technical requirements including
   * future proof, regional and business partnerships, and emergency tags.
   *
   * @param {Array} regionalPartnershipTags - Array of regional partnership tag identifiers
   * @param {Array} businessPartnershipTags - Array of business partnership tag identifiers
   * @param {Array} futureProofTags - Array of future-proof tag identifiers
   * @param {Array} emergencyTags - Array of emergency tag identifiers
   * @returns {UnlockTechnicalData} Comprehensive technical data
   */
  static createComprehensiveTechnicalRequirement(
    futureProofTags = [],
    regionalPartnershipTags = [],
    businessPartnershipTags = [],
    emergencyTags = []
  ) {
    return new UnlockTechnicalData(
      futureProofTags,
      regionalPartnershipTags,
      businessPartnershipTags,
      emergencyTags
    );
  }

  /**
   * Creates technical data for debugging purposes.
   * Note that this will create a debug requirement which also includes hypothetical future proof requirements.
   * @param {Array} debugRequirementFlags - The debug flag identifier
   * @param {Array} futureProofRequirements - The future proof requirements
   * @returns {UnlockTechnicalData} Debug technical data
   */
  static createDebugRequirementWithFutureProof(
    debugRequirementFlags = ["debug-mode"],
    futureProofRequirements = []
  ) {
    let regionalRequirements = [];
    let businessRequirements = [];

    return new UnlockTechnicalData(
      futureProofRequirements,
      regionalRequirements,
      businessRequirements,
      debugRequirementFlags
    );
  }

  /**
   * Creates technical data for debugging purposes.
   * Note that this will create a debug requirement which does not include future proof requirements / assumes a classic or basic game design without
   * major "future changes" type structural changes
   * @param {Array} debugRequirementFlags - The debug flag identifier
   * @returns {UnlockTechnicalData} Debug technical data
   */
  static createDebugRequirementClassic(debugRequirementFlags = ["debug-mode"]) {
    let emptyRegionalRequirements = [];
    let emptyBusinessRequirements = [];
    let classicRequirements = [];

    return new UnlockTechnicalData(
      emptyRegionalRequirements,
      emptyBusinessRequirements,
      classicRequirements,
      debugRequirementFlags
    );
  }

  /**
   * Creates technical data for debugging purposes.
   * Note that this will create a debug requirement which does not include future proof requirements / assumes a classic or basic game design without
   * major "future changes" type structural changes
   * @param {Array} debugRequirementFlags - The debug flag identifier
   * @returns {UnlockTechnicalData} Debug technical data
   */
  static createPartneredDebugRequirementClassic(
    regionalDebugRequirementFlags = [],
    businessDebugRequirementFlags = [],
    debugRequirementFlags = ["debug-mode"]
  ) {
    let classicRequirements = [];

    return new UnlockTechnicalData(
      regionalDebugRequirementFlags,
      businessDebugRequirementFlags,
      classicRequirements,
      debugRequirementFlags
    );
  }

  /**
   * Creates technical requirements for emergency purposes.
   * Note that this will create an emergency requirement which does not include future proof requirements / assumes a classic or basic game design without
   * major "future changes" type structural changes
   * @param {Array} emergencyRequirementFlags - The emergency flag identifier
   * @returns {UnlockTechnicalData} Emergency technical data
   */
  static createEmergencyRequirementClassic(
    emergencyRequirementFlags = ["emergency-mode"]
  ) {
    let emptyRegionalRequirements = [];
    let emptyBusinessRequirements = [];
    let classicRequirements = [];

    return new UnlockTechnicalData(
      emptyRegionalRequirements,
      emptyBusinessRequirements,
      classicRequirements,
      emergencyRequirementFlags
    );
  }

  /**
   * Creates technical requirements for emergency purposes.
   * Note that this will create an emergency requirement which does not include future proof requirements / assumes a classic or basic game design without
   * major "future changes" type structural changes
   * @param {Array} futureProofRequirements - The future proof requirements
   * @param {Array} emergencyRequirementFlags - The emergency flag identifier
   * @returns {UnlockTechnicalData} Emergency technical data
   */
  static createEmergencyRequirementWithFutureProof(
    futureProofRequirements = [],
    emergencyRequirementFlags = ["emergency-mode"]
  ) {
    let emptyRegionalRequirements = [];
    let emptyBusinessRequirements = [];

    return new UnlockTechnicalData(
      emptyRegionalRequirements,
      emptyBusinessRequirements,
      futureProofRequirements,
      emergencyRequirementFlags
    );
  }

  /**
   * Creates technical requirements for emergency purposes.
   * Note that this will create an emergency requirement which does not include future proof requirements / assumes a classic or basic game design without
   * major "future changes" type structural changes
   * @param {Array} futureProofRequirements - The future proof requirements
   * @param {Array} emergencyRequirementFlags - The emergency flag identifier
   * @returns {UnlockTechnicalData} Emergency technical data
   */
  static createPartneredEmergencyRequirementComprehensive(
    regionalFutureProofRequirements = [],
    businessFutureProofRequirements = [],
    futureProofRequirements = [],
    emergencyRequirementFlags = ["emergency-mode"]
  ) {
    return new UnlockTechnicalData(
      regionalFutureProofRequirements,
      businessFutureProofRequirements,
      futureProofRequirements,
      emergencyRequirementFlags
    );
  }

  /**
   * Converts the technical data to a plain object for serialization.
   *
   * @returns {Object} A plain object representation of the technical data
   */
  toJSON() {
    return {
      regionalPartnershipRequirements: this.regionalPartnershipRequirements,
      businessPartnershipRequirements: this.businessPartnershipRequirements,
      preemptiveFutureProofRequirements: this.preemptiveFutureProofRequirements,
      emergencyFutureProofRequirements: this.emergencyFutureProofRequirements,
    };
  }

  /**
   * Creates an instance from a plain object (deserialization).
   *
   * @param {UnlockRequirementsComposite} unlockRequirementsComposite - The plain object to create an instance from
   * @returns {UnlockTechnicalData} A new instance with the provided data
   */
  static fromJSON(unlockRequirementsComposite) {
    return new UnlockTechnicalData(
      unlockRequirementsComposite.regionalPartnershipRequirements,
      unlockRequirementsComposite.businessPartnershipRequirements,
      unlockRequirementsComposite.preemptiveFutureProofRequirements,
      unlockRequirementsComposite.emergencyFutureProofRequirements
    );
  }

  /**
   * Creates a copy of this technical data.
   *
   * @returns {UnlockTechnicalData} A new instance with the same properties
   */
  clone() {
    return new UnlockTechnicalData(
      [...this.preemptiveFutureProofRequirements],
      [...this.emergencyFutureProofRequirements]
    );
  }
}
