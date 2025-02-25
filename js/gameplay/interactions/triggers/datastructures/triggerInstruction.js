//trigger instructions are data objects retrieved from level data that are used by the level factory
//to create the actual trigger objects, which either the activeTriggerManager or specialized
//trigger managers may monitor and respond to / pop conditionally

/**
 * Represents a complete trigger instruction used by the level factory to create trigger objects.
 * Combines header, behavior, and special data while providing validation functionality.
 */
class TriggerInstruction {
  /**
   * Creates a new TriggerInstruction instance
   * @param {TriggerHeader} triggerHeader - Header containing trigger metadata
   * @param {TriggerBehaviorDetails} triggerBehaviorDetails - Details about trigger behavior and actions
   * @param {TriggerSpecialData} triggerSpecialData - Special handling data for sequences and resets
   */
  constructor(triggerHeader, triggerBehaviorDetails, triggerSpecialData) {
    this.triggerHeader = triggerHeader;
    this.triggerBehaviorDetails = triggerBehaviorDetails;
    this.triggerSpecialData = triggerSpecialData;

    this.validTrigger = TriggerInstruction.validateTrigger(triggerHeader);
  }

  /**
   * Validates a trigger instruction based on its header information
   * @param {TriggerHeader} triggerHeader - Header to validate
   * @returns {boolean} Whether the trigger instruction is valid
   */
  static validateTriggerInstruction(triggerHeader) {
    let passedValidation = false;
    let version = triggerHeader.triggerInstructionGameVersion;
    let regionalUseMetaData = triggerHeader.regionalUseMetaData;

    let passedVersionValidation =
      TriggerInstruction.validateTriggerInstructionVersion(version);
    let passedRegionalValidation =
      TriggerInstruction.validateTriggerRegionVersion(regionalUseMetaData);

    if (passedVersionValidation && passedRegionalValidation) {
      passedValidation = true;
    }

    if (!passedVersionValidation || !passedRegionalValidation) {
      TriggerInstruction.failedValidationLog(
        triggerNickname,
        passedVersionValidation,
        passedRegionalValidation
      );
    }

    return passedValidation;
  }

  /**
   * Validates the game version compatibility of a trigger instruction
   * @param {string} triggerInstructionGameVersion - Version to validate
   * @returns {boolean} Whether the version is compatible
   */
  static validateTriggerInstructionVersion(triggerInstructionGameVersion) {
    //to do - add version validation here

    return true;
  }

  /**
   * Validates regional compatibility of a trigger instruction
   * @param {Object} regionalUseMetaData - Regional metadata to validate
   * @returns {boolean} Whether the regional settings are valid
   */
  static validateTriggerRegionVersion(regionalUseMetaData) {
    //to do - add regional version validation here

    return true;
  }
}
