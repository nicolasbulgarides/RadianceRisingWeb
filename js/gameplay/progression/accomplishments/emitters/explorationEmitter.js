/**
 * Emitter for exploration-related accomplishments.
 *
 * This class provides presets for common exploration accomplishments such as
 * discovering new areas, finding landmarks, and completing map exploration.
 */
class ExplorationEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      areaDiscovered: {
        category: "exploration",
        subCategory: "discovery",
        metaData: {
          nickName: "Area Discovered",
          description: "Player has discovered a new area",
        },
        defaultData: {
          areaId: "",
          areaName: "",
          areaType: "standard",
          areaSize: "medium",
          areaRarity: "common",
          isSecretArea: false,
          isFirstPlayerToDiscover: false,
          discoveryMethod: "walking",
          containsSpecialLandmarks: false,
          explorationPercentage: 0,
        },
      },
      landmarkDiscovered: {
        category: "exploration",
        subCategory: "landmark",
        metaData: {
          nickName: "Landmark Discovered",
          description: "Player has discovered a significant landmark",
        },
        defaultData: {
          areaId: "",
          areaName: "",
          areaType: "landmark",
          areaSize: "small",
          areaRarity: "uncommon",
          isSecretArea: false,
          isFirstPlayerToDiscover: false,
          discoveryMethod: "walking",
          containsSpecialLandmarks: true,
          explorationPercentage: 0,
        },
      },
      secretAreaFound: {
        category: "exploration",
        subCategory: "secret",
        metaData: {
          nickName: "Secret Area Found",
          description: "Player has found a hidden or secret area",
        },
        defaultData: {
          areaId: "",
          areaName: "",
          areaType: "secret",
          areaSize: "variable",
          areaRarity: "rare",
          isSecretArea: true,
          isFirstPlayerToDiscover: false,
          discoveryMethod: "investigation",
          containsSpecialLandmarks: true,
          explorationPercentage: 0,
        },
      },
      mapCompleted: {
        category: "exploration",
        subCategory: "completion",
        metaData: {
          nickName: "Map Completed",
          description: "Player has fully explored a map area",
        },
        defaultData: {
          areaId: "",
          areaName: "",
          areaType: "standard",
          areaSize: "large",
          areaRarity: "common",
          isSecretArea: false,
          isFirstPlayerToDiscover: false,
          discoveryMethod: "walking",
          containsSpecialLandmarks: false,
          explorationPercentage: 100,
        },
      },
      worldFirstDiscovery: {
        category: "exploration",
        subCategory: "world-first",
        metaData: {
          nickName: "World First Discovery",
          description: "Player is the first to discover an area",
        },
        defaultData: {
          areaId: "",
          areaName: "",
          areaType: "variable",
          areaSize: "variable",
          areaRarity: "legendary",
          isSecretArea: false,
          isFirstPlayerToDiscover: true,
          discoveryMethod: "variable",
          containsSpecialLandmarks: false,
          explorationPercentage: 0,
        },
      },
    };

    return presets[presetName] || null;
  }
}
