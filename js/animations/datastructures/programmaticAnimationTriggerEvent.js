/**
 * Defines an event that can be triggered by the end of an animation or animation sequence.
 * Contains identification and categorization information for event handling
 * and animation triggering logic.
 */
class ProgrammaticAnimationTriggerEvent {
  /**
   * Represents a trigger event for animations.
   * @param {string} eventTriggerUniqueId - Unique identifier for the event trigger.
   * @param {string} eventTriggerLevelNickname - Nickname for the event trigger level.
   * @param {string} eventTriggerNickname - Nickname for the event trigger.
   * @param {string} eventTriggerArchetype - Archetype of the event trigger.
   */
  constructor(
    eventTriggerUniqueId = "-no-event-trigger-unique-id-",
    eventTriggerLevelNickname = "-no-event-trigger-level-nickname-",
    eventTriggerNickname = "-no-event-trigger-nickname-",
    eventTriggerArchetype = "-no-event-trigger-archetype-"
  ) {
    this.eventTriggerUniqueId = eventTriggerUniqueId;
    this.eventTriggerArchetype = eventTriggerArchetype;
    this.eventTriggerLevelNickname = eventTriggerLevelNickname;
    this.eventTriggerNickname = eventTriggerNickname;
  }
}
