/**
 * Emitter for event-related accomplishments.
 *
 * This class provides presets for common event accomplishments such as
 * participating in events, completing event challenges, and seasonal events.
 */
class EventEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      eventParticipation: {
        category: "event",
        subCategory: "participation",
        metaData: {
          nickName: "Event Participation",
          description: "Player has participated in an event",
        },
        defaultData: {
          eventId: "",
          eventNickName: "",
          eventCategory: "general",
          eventSubCategory: "participation",
          eventDescription: "",
          eventLocation: "",
          eventDateRange: "",
          eventDateCompleted: "",
          eventAccomplishmentValue: 1,
          eventAccomplishmentMagnitude: 1,
          otherRelevantData: {},
        },
      },
      eventChallenge: {
        category: "event",
        subCategory: "challenge",
        metaData: {
          nickName: "Event Challenge Completed",
          description: "Player has completed an event challenge",
        },
        defaultData: {
          eventId: "",
          eventNickName: "",
          eventCategory: "challenge",
          eventSubCategory: "",
          eventDescription: "",
          eventLocation: "",
          eventDateRange: "",
          eventDateCompleted: "",
          eventAccomplishmentValue: 5,
          eventAccomplishmentMagnitude: 2,
          otherRelevantData: {
            challengeDifficulty: 1,
            challengeType: "",
          },
        },
      },
      seasonalEvent: {
        category: "event",
        subCategory: "seasonal",
        metaData: {
          nickName: "Seasonal Event Completed",
          description: "Player has completed a seasonal event",
        },
        defaultData: {
          eventId: "",
          eventNickName: "",
          eventCategory: "seasonal",
          eventSubCategory: "",
          eventDescription: "",
          eventLocation: "",
          eventDateRange: "",
          eventDateCompleted: "",
          eventAccomplishmentValue: 10,
          eventAccomplishmentMagnitude: 3,
          otherRelevantData: {
            season: "",
            year: "",
          },
        },
      },
      worldEvent: {
        category: "event",
        subCategory: "world",
        metaData: {
          nickName: "World Event Completed",
          description: "Player has participated in a world event",
        },
        defaultData: {
          eventId: "",
          eventNickName: "",
          eventCategory: "world",
          eventSubCategory: "",
          eventDescription: "",
          eventLocation: "",
          eventDateRange: "",
          eventDateCompleted: "",
          eventAccomplishmentValue: 20,
          eventAccomplishmentMagnitude: 4,
          otherRelevantData: {
            worldImpact: "",
            participantCount: 0,
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
