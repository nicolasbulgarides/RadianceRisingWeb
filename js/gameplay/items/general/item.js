/**
 * Class representing an in-game item.
 *
 * Each item encapsulates properties such as name, description, rarity, and usage information,
 * along with additional flags for premium status, uniqueness, and trade/sell/salvage capabilities.
 * This modular design allows for easy extension and maintenance.
 */
class Item {
  /**
   * Creates a new Item instance.
   *
   * @param {string} itemName - The name of the item. Defaults to "INVALID-ITEM".
   * @param {string} description - A brief description of the item.
   * @param {string} rarity - The rarity level of the item. Defaults to "INVALID-RARITY".
   * @param {number} value - The monetary or in-game value of the item. Defaults to -1.
   * @param {number} baseUseCount - The base number of uses allowed for the item.
   * @param {number} cooldown - The cooldown duration (in seconds) between uses.
   * @param {number} unlockLevel - The player level required to unlock the item.
   * @param {any} specialCriteria - Special conditions or criteria for using the item.
   * @param {boolean} isPremiumItem - Flag indicating if the item is premium.
   * @param {boolean} isUnique - Flag indicating if the item entry is unique.
   * @param {boolean} isSalvageable - Flag indicating if the item can be salvaged.
   * @param {boolean} isSellable - Flag indicating if the item can be sold.
   * @param {boolean} isTradeable - Flag indicating if the item can be traded.
   */
  constructor(
    // Item name with a fallback default.
    itemName = "INVALID-ITEM",
    // Descriptive text for the item.
    description = "This is an invalid item!",
    // Defines the rarity classification.
    rarity = "INVALID-RARITY",
    // In-game value, where negative signifies an uninitialized state.
    value = -1,
    // Maximum allowable uses prior to item exhaustion.
    baseUseCount = -1,
    // Time delay between consecutive uses (in seconds).
    cooldown = 0,
    // Minimum player level needed to unlock this item.
    unlockLevel = 99,
    // Special criteria that might affect usage or availability.
    specialCriteria = null,
    // Boolean flag for premium status features.
    isPremiumItem = false,
    // Boolean flag for uniqueness.
    isUnique = false,
    // Boolean flag indicating salvageability.
    isSalvageable = false,
    // Boolean flag indicating sellability.
    isSellable = false,
    // Boolean flag indicating tradeability.
    isTradeable = false
  ) {
    this.itemName = itemName; // Set the item name.
    this.description = description; // Set a description for the item.
    this.rarity = rarity; // Set the item's rarity level.
    this.value = value; // Set the in-game value.
    this.baseUseCount = baseUseCount; // Define the maximum usage count.
    this.currentUseCount = 0; // Initialize current use count to zero.
    this.cooldown = cooldown; // Set the cooldown period between uses.
    this.unlockLevel = unlockLevel; // Set the required level to unlock the item.
    this.specialCriteria = specialCriteria; // Assign any special usage criteria.
    this.isPremiumItem = isPremiumItem; // Flag the item as premium if applicable.
    this.isUnique = isUnique; // Flag the item as unique.
    this.isSalvageable = isSalvageable; // Indicate if the item can be salvaged.
    this.isSellable = isSellable; // Indicate if the item is available for sale.
    this.isTradeable = isTradeable; // Indicate if the item can be traded.
  }

  cloneItem() {
    return new Item(
      this.itemName,
      this.description,
      this.rarity,
      this.value,
      this.baseUseCount,
      this.cooldown,
      this.unlockLevel,
      this.specialCriteria,
      this.isPremiumItem,
      this.isUnique,
      this.isSalvageable,
      this.isSellable,
      this.isTradeable
    );
  }
}
