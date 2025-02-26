/**
 * Data structure for tracking crafting-related accomplishments.
 * Used to record crafting activities such as creating items, learning recipes,
 * crafting rare items, creating masterworks, and reaching crafting milestones.
 * Supports tracking of materials used, crafting stations, and skill levels.
 */
class AccomplishmentCraftingData {
  /**
   * Creates a new crafting accomplishment data instance
   * @param {string} itemId - Unique identifier for the crafted item
   * @param {string} itemName - Display name of the crafted item
   * @param {string} itemCategory - Category of the crafted item (standard, recipe, etc.)
   * @param {string} itemRarity - Rarity tier of the crafted item (common, rare, etc.)
   * @param {string} craftingSkillUsed - The crafting skill used to create the item
   * @param {number} craftingSkillLevel - The player's level in the crafting skill
   * @param {boolean} isMasterwork - Whether the item is of masterwork quality
   * @param {boolean} isFirstTimeCrafting - Whether this is the first time crafting this item
   * @param {Array} materialsUsed - List of materials used in crafting
   * @param {string} craftingStationUsed - The crafting station used (basic, advanced, master)
   * @param {number} totalItemsCrafted - Total number of items crafted (for milestones)
   * @param {number} milestoneThreshold - Threshold for crafting milestone (if applicable)
   */
  constructor(
    itemId,
    itemName,
    itemCategory,
    itemRarity,
    craftingSkillUsed,
    craftingSkillLevel,
    isMasterwork,
    isFirstTimeCrafting,
    materialsUsed,
    craftingStationUsed,
    totalItemsCrafted,
    milestoneThreshold
  ) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.itemCategory = itemCategory;
    this.itemRarity = itemRarity;
    this.craftingSkillUsed = craftingSkillUsed;
    this.craftingSkillLevel = craftingSkillLevel;
    this.isMasterwork = isMasterwork;
    this.isFirstTimeCrafting = isFirstTimeCrafting;
    this.materialsUsed = materialsUsed;
    this.craftingStationUsed = craftingStationUsed;
    this.totalItemsCrafted = totalItemsCrafted;
    this.milestoneThreshold = milestoneThreshold;
  }
}
