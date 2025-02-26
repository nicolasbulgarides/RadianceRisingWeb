/**
 * Utility class for validating accomplishment data.
 *
 * This class provides methods for validating accomplishment data structures
 * to ensure they meet the required format and contain all necessary fields.
 */
class AccomplishmentValidator {
  /**
   * Validates an accomplishment data composite.
   *
   * @param {AccomplishmentDataComposite} composite - The composite to validate
   * @returns {Object} - Validation result with success flag and error messages
   */
  static validateComposite(composite) {
    if (!composite) {
      return { success: false, errors: ["Composite is null or undefined"] };
    }

    const errors = [];

    // Check for required header
    if (!composite.accomplishmentHeader) {
      errors.push("Missing accomplishmentHeader");
    }

    // Ensure at least one data structure is present
    const hasAnyData = [
      "accomplishmentBasicMilestoneData",
      "accomplishmentAreaData",
      "accomplishmentEventData",
      "accomplishmentQuestData",
      "accomplishmentAchievementData",
      "accomplishmentLearnedData",
      "accomplishmentAcquiredObjectData",
      "accomplishmentCombatData",
      "accomplishmentCompetitiveData",
      "accomplishmentStatusData",
      "accomplishmentSocialData",
      "accomplishmentPetData",
      "accomplishmentAccountData",
      "accomplishmentMinigameData",
      "accomplishmentUsageData",
      "accomplishmentTechnicalData",
      "accomplishmentCraftingData",
      "accomplishmentEconomyData",
      "accomplishmentExplorationData",
      "accomplishmentProgressionData",
    ].some((prop) => !!composite[prop]);

    if (!hasAnyData) {
      errors.push("Composite does not contain any data structures");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an accomplishment header.
   *
   * @param {AccomplishmentHeader} header - The header to validate
   * @returns {Object} - Validation result with success flag and error messages
   */
  static validateHeader(header) {
    if (!header) {
      return { success: false, errors: ["Header is null or undefined"] };
    }

    const errors = [];

    // Check required fields
    if (!header.category) errors.push("Missing category in header");
    if (!header.subCategory) errors.push("Missing subCategory in header");
    if (!header.metaData) errors.push("Missing metaData in header");
    else {
      if (!header.metaData.nickName)
        errors.push("Missing nickName in header metadata");
      if (!header.metaData.description)
        errors.push("Missing description in header metadata");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a preset configuration.
   *
   * @param {Object} preset - The preset to validate
   * @returns {Object} - Validation result with success flag and error messages
   */
  static validatePreset(preset) {
    if (!preset) {
      return { success: false, errors: ["Preset is null or undefined"] };
    }

    const errors = [];

    // Check required fields
    if (!preset.category) errors.push("Missing category in preset");
    if (!preset.subCategory) errors.push("Missing subCategory in preset");
    if (!preset.metaData) errors.push("Missing metaData in preset");
    else {
      if (!preset.metaData.nickName)
        errors.push("Missing nickName in preset metadata");
      if (!preset.metaData.description)
        errors.push("Missing description in preset metadata");
    }
    if (!preset.defaultData) errors.push("Missing defaultData in preset");

    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that an emitter implements all required methods.
   *
   * @param {AccomplishmentEmitterBase} emitter - The emitter to validate
   * @returns {Object} - Validation result with success flag and error messages
   */
  static validateEmitter(emitter) {
    if (!emitter) {
      return { success: false, errors: ["Emitter is null or undefined"] };
    }

    const errors = [];

    // Check required methods
    if (typeof emitter.getPreset !== "function") {
      errors.push("Emitter does not implement getPreset method");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }
}
