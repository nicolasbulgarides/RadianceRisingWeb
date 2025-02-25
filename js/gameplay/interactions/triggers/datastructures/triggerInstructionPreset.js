/**
 * TriggerInstructionPreset provides convenient factory methods for creating common trigger patterns
 * while abstracting away rarely used advanced properties of TriggerInstruction.
 */
class TriggerInstructionPreset {
  /**
   * Creates a basic interaction trigger instruction
   * @param {number} absoluteIndex - Unique index for the trigger
   * @param {string} nickname - Descriptive name for the trigger
   * @param {string} category - Category of trigger (e.g., 'interaction', 'collision')
   * @param {string} validTargets - What can activate this trigger
   * @param {string} action - What happens when triggered
   * @param {string} successSound - Sound to play on successful trigger
   * @param {string} successOccurrenceId - ID of the success event
   * @returns {TriggerInstruction} A new trigger instruction with basic settings
   */
  static createBasicInteractionTrigger(
    index,
    nickname,
    category,
    validTargets,
    action,
    successSound,
    successOccurrenceId
  ) {
    let header = TriggerHeader.getGenericHeader(index, nickname, category);

    let behaviorDetails = TriggerBehaviorDetails.getGenericBehaviorDetails(
      validTargets,
      action,
      successSound,
      successOccurrenceId
    );

    let specialData = TriggerSpecialData.getGenericSpecialDataInactive();

    return new TriggerInstruction(header, behaviorDetails, specialData);
  }

  //to do - rename fireCast1

  static getElementalSoundIdByElement(element) {
    let soundId = "magicalSpellCastNeutral";

    switch (element) {
      case "fire":
        return "fireCast1";
      case "water":
        return "magicalSpellCastWaterSplash";
      case "earth":
        return "magicalSpellCastEarthCrunch";
      case "wind":
        return "magicalSpellCastWindWhoosh";
    }
    return soundId;
  }

  static createItemPickupTrigger(
    index,
    itemId,
    itemName,
    pickupSound,
    pickupPosition,
    pickupOccurrenceId
  ) {
    let nickname =
      "Item Pickup Trigger (Item ID: " + itemId + "): Known As" + itemName;
    let category = "actiontrigger";

    let header = TriggerHeader.getGenericHeader(index, nickname, category);

    let behaviorDetails =
      TriggerBehaviorDetails.getGenericBehaviorItemPickupDetails(
        pickupSound,
        pickupPosition,
        pickupOccurrenceId
      );

    let specialData = TriggerSpecialData.getGenericSpecialDataInactive();

    let triggerInstruction = new TriggerInstruction(
      header,
      behaviorDetails,
      specialData
    );

    return triggerInstruction;
  }

  static createElementalMagicTrigger(
    index,
    element,
    targets,
    successOccurrenceId
  ) {
    let elementalSound =
      TriggerInstructionPreset.getElementalSoundIdByElement(element);

    let nickname = "Elemental Magic Trigger: " + element;
    let category = "actiontrigger";
    let action = "spellcast";

    let triggerInstruction =
      TriggerInstructionPreset.createBasicInteractionTrigger(
        index,
        nickname,
        category,
        targets,
        action,
        elementalSound,
        successOccurrenceId
      );

    return triggerInstruction;
  }
}
