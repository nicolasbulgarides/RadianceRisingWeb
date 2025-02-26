/**
 * Emitter for crafting-related accomplishments.
 *
 * This class provides presets for common crafting accomplishments such as
 * crafting items, discovering recipes, and crafting milestones.
 */
class CraftingEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      itemCrafted: {
        category: "crafting",
        subCategory: "item",
        metaData: {
          nickName: "Item Crafted",
          description: "Player has crafted an item",
        },
        defaultData: {
          itemId: "",
          itemName: "",
          itemCategory: "standard",
          itemRarity: "common",
          craftingSkillUsed: "",
          craftingSkillLevel: 1,
          isMasterwork: false,
          isFirstTimeCrafting: false,
          materialsUsed: [],
          craftingStationUsed: "basic",
        },
      },
      recipeLearned: {
        category: "crafting",
        subCategory: "recipe",
        metaData: {
          nickName: "Recipe Learned",
          description: "Player has learned a new crafting recipe",
        },
        defaultData: {
          itemId: "",
          itemName: "",
          itemCategory: "recipe",
          itemRarity: "common",
          craftingSkillUsed: "",
          craftingSkillLevel: 1,
          isMasterwork: false,
          isFirstTimeCrafting: false,
          materialsUsed: [],
          craftingStationUsed: "none",
        },
      },
      rareCraftingSuccess: {
        category: "crafting",
        subCategory: "rare",
        metaData: {
          nickName: "Rare Item Crafted",
          description: "Player has crafted a rare or valuable item",
        },
        defaultData: {
          itemId: "",
          itemName: "",
          itemCategory: "standard",
          itemRarity: "rare",
          craftingSkillUsed: "",
          craftingSkillLevel: 5,
          isMasterwork: false,
          isFirstTimeCrafting: false,
          materialsUsed: [],
          craftingStationUsed: "advanced",
        },
      },
      masterworkCreated: {
        category: "crafting",
        subCategory: "masterwork",
        metaData: {
          nickName: "Masterwork Created",
          description: "Player has created a masterwork quality item",
        },
        defaultData: {
          itemId: "",
          itemName: "",
          itemCategory: "standard",
          itemRarity: "rare",
          craftingSkillUsed: "",
          craftingSkillLevel: 10,
          isMasterwork: true,
          isFirstTimeCrafting: false,
          materialsUsed: [],
          craftingStationUsed: "master",
        },
      },
      craftingMilestone: {
        category: "crafting",
        subCategory: "milestone",
        metaData: {
          nickName: "Crafting Milestone",
          description: "Player has reached a crafting milestone",
        },
        defaultData: {
          itemId: "",
          itemName: "",
          itemCategory: "milestone",
          itemRarity: "common",
          craftingSkillUsed: "",
          craftingSkillLevel: 1,
          isMasterwork: false,
          isFirstTimeCrafting: false,
          materialsUsed: [],
          craftingStationUsed: "variable",
          totalItemsCrafted: 0,
          milestoneThreshold: 10,
        },
      },
    };

    return presets[presetName] || null;
  }
}
