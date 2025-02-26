/**
 * Emitter for area-related accomplishments.
 *
 * This class provides presets for common area accomplishments such as
 * discovering new areas, completing area exploration, and area-specific challenges.
 */
class AreaEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      areaDiscovered: {
        category: "area",
        subCategory: "discovery",
        metaData: {
          nickName: "Area Discovered",
          description: "Player has discovered a new area",
        },
        defaultData: {
          isAreaOrLevel: true,
          areaId: "",
          areaName: "",
          accomplishmentCategory: "discovery",
          accomplishmentSubCategory: "",
          accomplishmentValue: 1,
          accomplishmentMagnitude: 1,
          otherRelevantData: {},
        },
      },
      areaExplored: {
        category: "area",
        subCategory: "exploration",
        metaData: {
          nickName: "Area Fully Explored",
          description: "Player has fully explored an area",
        },
        defaultData: {
          isAreaOrLevel: true,
          areaId: "",
          areaName: "",
          accomplishmentCategory: "exploration",
          accomplishmentSubCategory: "complete",
          accomplishmentValue: 100,
          accomplishmentMagnitude: 2,
          otherRelevantData: {
            explorationPercentage: 100,
          },
        },
      },
      areaChallenge: {
        category: "area",
        subCategory: "challenge",
        metaData: {
          nickName: "Area Challenge Completed",
          description: "Player has completed an area-specific challenge",
        },
        defaultData: {
          isAreaOrLevel: true,
          areaId: "",
          areaName: "",
          accomplishmentCategory: "challenge",
          accomplishmentSubCategory: "",
          accomplishmentValue: 1,
          accomplishmentMagnitude: 2,
          otherRelevantData: {
            challengeType: "",
            challengeDifficulty: 1,
          },
        },
      },
      secretAreaFound: {
        category: "area",
        subCategory: "secret",
        metaData: {
          nickName: "Secret Area Found",
          description: "Player has discovered a secret area",
        },
        defaultData: {
          isAreaOrLevel: true,
          areaId: "",
          areaName: "",
          accomplishmentCategory: "discovery",
          accomplishmentSubCategory: "secret",
          accomplishmentValue: 1,
          accomplishmentMagnitude: 3,
          otherRelevantData: {
            secretType: "",
            secretRarity: "rare",
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
