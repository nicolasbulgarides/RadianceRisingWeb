/**
 * Emitter for acquired object accomplishments.
 *
 * This class provides presets for common object acquisition accomplishments such as
 * finding items, collecting rare objects, and crafting items.
 */
class AcquiredObjectEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      itemFound: {
        category: "acquiredObject",
        subCategory: "found",
        metaData: {
          nickName: "Item Found",
          description: "Player has found an item",
        },
        defaultData: {
          idOfAcquisition: "",
          acquisitionCategory: "found",
          acquisitionLocation: "",
          acquisitionMethod: "discovery",
          acquisitionNumericValue: 1,
          acquisitionRarityTier: "common",
        },
      },
      rareItemCollected: {
        category: "acquiredObject",
        subCategory: "rare-collection",
        metaData: {
          nickName: "Rare Item Collected",
          description: "Player has collected a rare item",
        },
        defaultData: {
          idOfAcquisition: "",
          acquisitionCategory: "collection",
          acquisitionLocation: "",
          acquisitionMethod: "discovery",
          acquisitionNumericValue: 1,
          acquisitionRarityTier: "rare",
        },
      },
      itemCrafted: {
        category: "acquiredObject",
        subCategory: "crafted",
        metaData: {
          nickName: "Item Crafted",
          description: "Player has crafted an item",
        },
        defaultData: {
          idOfAcquisition: "",
          acquisitionCategory: "crafted",
          acquisitionLocation: "",
          acquisitionMethod: "crafting",
          acquisitionNumericValue: 1,
          acquisitionRarityTier: "common",
        },
      },
      legendaryItemAcquired: {
        category: "acquiredObject",
        subCategory: "legendary",
        metaData: {
          nickName: "Legendary Item Acquired",
          description: "Player has acquired a legendary item",
        },
        defaultData: {
          idOfAcquisition: "",
          acquisitionCategory: "legendary",
          acquisitionLocation: "",
          acquisitionMethod: "special",
          acquisitionNumericValue: 1,
          acquisitionRarityTier: "legendary",
        },
      },
    };

    return presets[presetName] || null;
  }
}
