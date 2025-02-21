class TriggerFactory {
  // Factory class for creating trigger events.
  static createTriggerDirectlyGeneralized(
    triggerType, // Type of the trigger to create.
    triggerUniqueId, // Unique ID for the trigger.
    triggerModularValuesIfNeeded, // Modular values for the trigger if needed.
    postActivationDelayToStart, // Delay before the trigger activates.
    resetFunctionUniqueId, // Unique ID for the reset function.
    resetFunctionModularValuesIfNeeded // Modular values for the reset function if needed.
  ) {
    // Create a new TriggerEvent instance with the provided parameters.
    let generatedTrigger = new TriggerEvent(
      triggerUniqueId,
      triggerType,
      triggerModularValuesIfNeeded,
      postActivationDelayToStart,
      resetFunctionUniqueId,
      resetFunctionModularValuesIfNeeded
    );

    return generatedTrigger; // Return the newly created trigger.
  }
}
