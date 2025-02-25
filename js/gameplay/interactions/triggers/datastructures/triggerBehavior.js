/**
 * Represents a configurable behavior for game triggers and interactions.
 * This class defines how triggers respond to player actions, including
 * validation, timing, sound effects, and occurrence tracking.
 */
class TriggerBehavior {
  /** Default value for unspecified valid targets */
  static ASSUMED_VALID_TARGETS = "-trigger-valid-targets-not-set-";
  /** Default value for unspecified inherent trait */
  static ASSUMED_INHERENT_TRAIT = "-no-trigger-inherent-trait-specified-";
  /** Default sound effect for failed trigger actions */
  static ASSUMED_FAILURE_SOUND = "invalidUserActionError";
  /** Default identifier for failure occurrences */
  static ASSUMED_FAILURE_OCCURRENCE_ID =
    "-no-trigger-failure-occurrence-id-specified-";
  /** Default time delay for trigger actions */
  static ASSUMED_TIME_DELAY = 0;
  /** Default cooldown period between trigger actions */
  static ASSUMED_ACTION_COOLDOWN = 0;
  /** Default initial state for triggers */
  static ASSUMED_TRIGGER_STARTS_ACTIVE = true;

  /**
   * Creates a new TriggerBehavior instance.
   * @param {string} triggerValidTargets - Valid targets that can activate this trigger
   * @param {boolean} startsActive - Whether the trigger starts in an active state
   * @param {string} triggerAction - The action to perform when triggered
   * @param {number} triggerTimeDelay - Delay before the trigger action occurs
   * @param {number} triggerActionCooldown - Cooldown period between trigger activations
   * @param {string} triggerSuccessSound - Sound to play on successful trigger
   * @param {string} triggerFailureSound - Sound to play on failed trigger
   * @param {string} triggerInherentRelevantTrait - Inherent trait affecting trigger behavior
   * @param {string} triggerSuccessOccurrenceId - Identifier for successful trigger events
   * @param {string} triggerFailureOccurrenceId - Identifier for failed trigger events
   */
  constructor(
    triggerValidTargets = "-trigger-valid-targets-not-set-",
    startsActive = true,
    triggerAction = "-trigger-action-not-set-",
    triggerTimeDelay = 0,
    triggerActionCooldown = 0,
    triggerSuccessSound = "-trigger-success-sound-not-set-",
    triggerFailureSound = "-trigger-failure-sound-not-set-",
    triggerInherentRelevantTrait = "-trigger-inherent-relevant-trait-not-set-",
    triggerSuccessOccurrenceId = "-trigger-success-occurrence-id-not-set-",
    triggerFailureOccurrenceId = "-trigger-failure-occurrence-id-not-set-"
  ) {
    this.startsActive = startsActive;
    this.triggerValidTargets = triggerValidTargets;
    this.triggerAction = triggerAction;
    this.triggerTimeDelay = triggerTimeDelay;
    this.triggerActionCooldown = triggerActionCooldown;
    this.triggerSuccessSound = triggerSuccessSound;
    this.triggerFailureSound = triggerFailureSound;
    this.triggerInherentRelevantTrait = triggerInherentRelevantTrait;
    this.triggerSuccessOccurrenceId = triggerSuccessOccurrenceId;
    this.triggerFailureOccurrenceId = triggerFailureOccurrenceId;
  }

  /**
   * Creates a generic item pickup trigger behavior.
   * @param {string} specifiedPickupSound - Sound to play when item is picked up
   * @param {string} itemPickupPosition - Position where the item can be picked up
   * @param {string} itemPickupOccurrenceId - Identifier for the pickup event
   * @returns {TriggerBehavior} A new trigger behavior configured for item pickup
   */
  static getGenericBehaviorItemPickup(
    specifiedPickupSound,
    itemPickupPosition,
    itemPickupOccurrenceId
  ) {
    let inherentRelevantTrait = itemPickupPosition;
    return new TriggerBehavior(
      TriggerBehavior.ASSUMED_VALID_TARGETS,
      TriggerBehavior.ASSUMED_TRIGGER_STARTS_ACTIVE,
      "pickup",
      TriggerBehavior.ASSUMED_TIME_DELAY,
      TriggerBehavior.ASSUMED_ACTION_COOLDOWN,
      specifiedPickupSound,
      TriggerBehavior.ASSUMED_FAILURE_SOUND,
      inherentRelevantTrait,
      itemPickupOccurrenceId,
      TriggerBehavior.ASSUMED_FAILURE_OCCURRENCE_ID
    );
  }

  /**
   * Creates a generic trigger behavior with basic configuration.
   * @param {string} validTargets - Valid targets that can activate this trigger
   * @param {string} triggerAction - The action to perform when triggered
   * @param {number} triggerActionCooldown - Cooldown period between trigger activations
   * @param {string} triggerSuccessSound - Sound to play on successful trigger
   * @param {string} triggerSuccessOccurrenceId - Identifier for successful trigger events
   * @returns {TriggerBehavior} A new trigger behavior with specified configuration
   */
  static getGenericBehavior(
    validTargets,
    triggerAction,
    triggerActionCooldown,
    triggerSuccessSound,
    triggerSuccessOccurrenceId
  ) {
    return new TriggerBehavior(
      validTargets,
      TriggerBehavior.ASSUMED_TRIGGER_STARTS_ACTIVE,
      triggerAction,
      TriggerBehavior.ASSUMED_TIME_DELAY,
      triggerActionCooldown,
      triggerSuccessSound,
      TriggerBehavior.ASSUMED_FAILURE_SOUND,
      TriggerBehavior.ASSUMED_INHERENT_TRAIT,
      triggerSuccessOccurrenceId,
      TriggerBehavior.ASSUMED_FAILURE_OCCURRENCE_ID
    );
  }

  /**
   * Creates a generic trigger behavior with additional failure occurrence tracking.
   * @param {string} validTargets - Valid targets that can activate this trigger
   * @param {string} triggerAction - The action to perform when triggered
   * @param {number} triggerActionCooldown - Cooldown period between trigger activations
   * @param {string} triggerSuccessSound - Sound to play on successful trigger
   * @param {string} triggerSuccessOccurrenceId - Identifier for successful trigger events
   * @param {string} triggerFailureOccurrenceId - Identifier for failed trigger events
   * @returns {TriggerBehavior} A new trigger behavior with failure tracking
   */
  static getGenericBehaviorWithFailureOccurrence(
    validTargets,
    triggerAction,
    triggerActionCooldown,
    triggerSuccessSound,
    triggerSuccessOccurrenceId,
    triggerFailureOccurrenceId
  ) {
    return new TriggerBehavior(
      validTargets,
      TriggerBehavior.ASSUMED_TRIGGER_STARTS_ACTIVE,
      triggerAction,
      TriggerBehavior.ASSUMED_TIME_DELAY,
      triggerActionCooldown,
      triggerSuccessSound,
      TriggerBehavior.ASSUMED_FAILURE_SOUND,
      TriggerBehavior.ASSUMED_INHERENT_TRAIT,
      triggerSuccessOccurrenceId,
      triggerFailureOccurrenceId
    );
  }
}
