/**
 * MicroEvent represents a simple, atomic game event that doesn't require complex chaining or dependencies.
 * These events are typically used for common gameplay elements like pickups, simple interactions, or basic achievements.
 */
class MicroEvent {
  /**
   * Creates a new MicroEvent instance.
   * @param {string} microEventCategory - The category of the event (e.g., 'pickup', 'foe-defeat')
   * @param {string} microEventNickname - A friendly name for the event
   * @param {string} microEventDescription - A detailed description of what the event represents
   * @param {string} microEventValue - The qualitative value or type of the event (e.g., what was picked up)
   * @param {number} microEventMagnitude - The numerical value or quantity associated with the event
   * @param {BABYLON.Vector3} microEventLocation - The 3D location where the event occurred
   * @param {PositionedObject} microEventPositionedObject - The positioned object associated with the event
   */
  constructor(
    microEventCategory, //category might be for example, pick-up, foe defeat,
    microEventNickname,
    microEventDescription,
    microEventValue, //qualitative / descriptive value of the micro event = WHAT was picked up, who was defeated, etc.
    microEventMagnitude, //This is the actual numerical value of the micro event, whiich theoretically could be useful
    //for example if multiple enemies were defeated at the same time, the magnitude would be the sum of the defeated enemies
    microEventLocation, //location of the micro event, which might be useful for certain events
    microEventPositionedObject //object that is positioned in the world, which might be useful for certain events
  ) {
    this.microEventNickname = microEventNickname;
    this.microEventDescription = microEventDescription;
    this.microEventCategory = microEventCategory;
    this.microEventValue = microEventValue;
    this.microEventMagnitude = microEventMagnitude;
    this.microEventLocation = microEventLocation;
    this.microEventPositionedObject = microEventPositionedObject;
    this.microEventCompletionStatus = false;
    //console.log(`[MICROEVENT] Created ${microEventNickname} (${microEventCategory}) - completion status: ${this.microEventCompletionStatus}`);
  }

  /**
   * Marks the micro event as completed.
   */
  markAsCompleted() {
    this.microEventCompletionStatus = true;
  }

  /**
   * Marks the micro event as incomplete.
   */
  markAsIncomplete() {
    this.microEventCompletionStatus = false;
  }
}
