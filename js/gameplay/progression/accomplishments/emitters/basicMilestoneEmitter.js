/**
 * Emitter for basic milestone accomplishments.
 *
 * This class provides presets for common milestone accomplishments such as
 * reaching numeric milestones, completing collections, and progression milestones.
 */
class BasicMilestoneEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      numericMilestone: {
        category: "basicMilestone",
        subCategory: "numeric",
        metaData: {
          nickName: "Numeric Milestone",
          description: "Player has reached a numeric milestone",
        },
        defaultData: {
          accomplishmentCategory: "numeric",
          accomplishmentSubCategory: "",
          accomplishmentNickName: "",
          accomplishmentValue: 0,
          accomplishmentMagnitude: 1,
          otherRelevantData: {},
        },
      },
      collectionMilestone: {
        category: "basicMilestone",
        subCategory: "collection",
        metaData: {
          nickName: "Collection Milestone",
          description: "Player has reached a collection milestone",
        },
        defaultData: {
          accomplishmentCategory: "collection",
          accomplishmentSubCategory: "",
          accomplishmentNickName: "",
          accomplishmentValue: 0,
          accomplishmentMagnitude: 1,
          otherRelevantData: {
            collectionType: "",
            collectionTotal: 0,
            collectionCurrent: 0,
          },
        },
      },
      progressionMilestone: {
        category: "basicMilestone",
        subCategory: "progression",
        metaData: {
          nickName: "Progression Milestone",
          description: "Player has reached a progression milestone",
        },
        defaultData: {
          accomplishmentCategory: "progression",
          accomplishmentSubCategory: "",
          accomplishmentNickName: "",
          accomplishmentValue: 0,
          accomplishmentMagnitude: 1,
          otherRelevantData: {
            progressionType: "",
            progressionLevel: 0,
          },
        },
      },
      explorationMilestone: {
        category: "basicMilestone",
        subCategory: "exploration",
        metaData: {
          nickName: "Exploration Milestone",
          description: "Player has reached an exploration milestone",
        },
        defaultData: {
          accomplishmentCategory: "exploration",
          accomplishmentSubCategory: "",
          accomplishmentNickName: "",
          accomplishmentValue: 0,
          accomplishmentMagnitude: 1,
          otherRelevantData: {
            explorationType: "",
            explorationArea: "",
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
