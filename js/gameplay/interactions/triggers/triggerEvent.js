class TriggerEvent {
  // Constructor for initializing a trigger event with essential properties.
  constructor(
    triggerUniqueId = "-no-trigger-unique-id", // Unique identifier for the trigger.
    triggerType = "-no-trigger-type", // Type of the trigger (e.g., collision, time-based).
    triggerModularValuesIfNeeded = null, // Modular values for the trigger if needed.
    postActivationDelayToStart = 0, // Delay before the trigger activates.
    resetFunctionUniqueId = "-no-reset-function-unique-id", // Unique ID for the reset function.
    resetFunctionModularValuesIfNeeded = null // Modular values for the reset function if needed.
  ) {
    this.hasBeenTriggered = false; // Flag indicating if the trigger has been activated.
    this.timestampOfLastTriggerActivation = null; // Timestamp of the last activation.
    this.timestampOfLastReset = null; // Timestamp of the last reset.
    this.timesTriggerActivationHasBeenAttempted = 0; // Count of activation attempts.
    this.triggerUniqueId = triggerUniqueId;
    this.triggerType = triggerType;
    this.postActivationDelayToStart = postActivationDelayToStart;
    this.resetFunctionUniqueId = resetFunctionUniqueId;
    this.triggerModularValuesIfNeeded = triggerModularValuesIfNeeded;
    this.resetFunctionModularValuesIfNeeded =
      resetFunctionModularValuesIfNeeded;
  }
}
