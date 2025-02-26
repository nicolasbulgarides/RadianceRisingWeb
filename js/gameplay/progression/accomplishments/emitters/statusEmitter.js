/**
 * Emitter for status-related accomplishments.
 *
 * This class provides presets for common status accomplishments such as
 * reaching status levels, gaining titles, and special status achievements.
 */
class StatusEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      statusLevelReached: {
        category: "status",
        subCategory: "level",
        metaData: {
          nickName: "Status Level Reached",
          description: "Player has reached a status level",
        },
        defaultData: {
          statusId: "",
          statusCategory: "level",
          nameOfSpecialStatus: "",
          statusPossiblyRelevantValue: 0,
        },
      },
      titleGained: {
        category: "status",
        subCategory: "title",
        metaData: {
          nickName: "Title Gained",
          description: "Player has gained a title",
        },
        defaultData: {
          statusId: "",
          statusCategory: "title",
          nameOfSpecialStatus: "",
          statusPossiblyRelevantValue: 1,
        },
      },
      reputationMilestone: {
        category: "status",
        subCategory: "reputation",
        metaData: {
          nickName: "Reputation Milestone",
          description: "Player has reached a reputation milestone",
        },
        defaultData: {
          statusId: "",
          statusCategory: "reputation",
          nameOfSpecialStatus: "",
          statusPossiblyRelevantValue: 0,
        },
      },
      specialStatus: {
        category: "status",
        subCategory: "special",
        metaData: {
          nickName: "Special Status Achieved",
          description: "Player has achieved a special status",
        },
        defaultData: {
          statusId: "",
          statusCategory: "special",
          nameOfSpecialStatus: "",
          statusPossiblyRelevantValue: 1,
        },
      },
    };

    return presets[presetName] || null;
  }
}
