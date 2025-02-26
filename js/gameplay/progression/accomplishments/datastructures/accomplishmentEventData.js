/**
 * Data structure for tracking non-quest accomplishment events.
 * Events can be seasonal, regional, global, player-specific, premium-specific, and many others.
 * These represent significant occurrences within Radiant Rays or other game contexts.
 */
class AccomplishmentEventData {
  /**
   * Creates a new event accomplishment data instance
   * @param {string} eventId - Unique identifier for the event
   * @param {string} eventNickName - User-friendly name for the event
   * @param {string} eventCategory - Primary classification of the event
   * @param {string} eventSubCategory - Secondary classification of the event
   * @param {string} eventDescription - Detailed description of the event
   * @param {string} eventLocation - Where the event occurred
   * @param {Object} eventDateRange - Start and end dates for the event
   * @param {Date} eventDateCompleted - When the event was completed
   * @param {string|number} eventAccomplishmentValue - Primary value associated with the accomplishment
   * @param {number} eventAccomplishmentMagnitude - Numeric measure of the accomplishment's significance
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    eventId,
    eventNickName,
    eventCategory,
    eventSubCategory,
    eventDescription,
    eventLocation,
    eventDateRange,
    eventDateCompleted,
    eventAccomplishmentValue,
    eventAccomplishmentMagnitude,
    otherRelevantData
  ) {
    this.eventId = eventId;
    this.eventNickName = eventNickName;
    this.eventCategory = eventCategory;
    this.eventSubCategory = eventSubCategory;
    this.eventDescription = eventDescription;
    this.eventLocation = eventLocation;
    this.eventDateRange = eventDateRange;
    this.eventDateCompleted = eventDateCompleted;
    this.eventAccomplishmentValue = eventAccomplishmentValue;
    this.eventAccomplishmentMagnitude = eventAccomplishmentMagnitude;
    this.otherRelevantData = otherRelevantData;
  }
}
