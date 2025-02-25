/**
 * TriggerEvent represents an active trigger instance in the game world.
 * It maintains the state and lifecycle of a trigger based on its instructions.
 */
class TriggerEvent {
  /**
   * Creates a new TriggerEvent instance.
   * @param {TriggerInstruction} instructions - The instructions defining the trigger's behavior
   * @param {string} hostedLevel - The level ID where this trigger exists
   * @param {number} timestampLoaded - The timestamp when this trigger was created
   */
  constructor(instructions, hostedLevel, timestampLoaded) {
    this.triggerInstructions = instructions;
    this.triggerHostedLevel = hostedLevel;
    this.triggerTimestampLoaded = timestampLoaded;
    this.numberOfFailedActivationAttempts = 0;
    this.numberOfTimesActuallyActivated = 0;
    this.startsAsActive =
      this.triggerInstructions.triggerBehaviorDetails.startsActive;
    this.isCurrentlyActive = this.startsAsActive;
  }

  /**
   * Deactivates the trigger, preventing it from being triggered.
   */
  deactivateTrigger() {
    this.isReadyToBeActivated = false;
  }

  /**
   * Activates the trigger, allowing it to be triggered.
   */
  activateTrigger() {
    this.isReadyToBeActivated = true;
  }

  /**
   * Resets the trigger to its initial state.
   * @param {boolean} alsoResetCounters - Whether to also reset activation counters
   */
  resetTriggerState(alsoResetCounters = false) {
    this.isReadyToBeActivated = this.startsAsActive;
    if (alsoResetCounters) {
      this.resetTriggerCounters();
    }
  }

  /**
   * Resets and reactivates the trigger, notifying the trigger manager.
   * @param {boolean} alsoResetCounters - Whether to also reset activation counters
   */
  resetTriggerAndReactivate(alsoResetCounters = false) {
    this.resetTriggerState(alsoResetCounters);

    if (FundamentalSystemBridge.activeTriggerManager) {
      FundamentalSystemBridge.activeTriggerManager.processTriggerResetActivation(
        this
      );
    }
  }

  /**
   * Resets all activation counters to their initial values.
   */
  resetTriggerCounters() {
    this.numberOfFailedActivationAttempts = 0;
    this.numberOfTimesActuallyActivated = 0;
  }
}
