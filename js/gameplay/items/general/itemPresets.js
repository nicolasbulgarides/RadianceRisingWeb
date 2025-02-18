/**
 * Class managing defined in-game item templates.
 * This class holds a set of valid item names and provides factory methods to create copies of items.
 */
class ItemPresets {
  // Set of valid defined item names.
  static definedItems = new Set(["SAMPLE_ITEM"]);

  constructor() {
    this.loadAllItemDefinitions();
  }

  loadAllItemDefinitions() {
    // this.definedItems.add("SAMPLE_ITEM");
  }

  /**
   * Retrieves a defined item copy based on the provided itemName.
   * Iterates through the defined items set and returns a cloned item if a match is found.
   * @param {string} itemName - The name of the item to retrieve.
   * @returns {Item|null} A cloned item instance or null if item creation fails.
   */
  static getADefinedItem(itemName) {
    // Iterate through defined items to find a matching name.
    for (const definedName of this.definedItems) {
      if (definedName === itemName) {
        const templateItem = this.createItemByItemName(itemName);
        return templateItem ? templateItem.clone() : null;
      }
    }
    // If the item name is not found, return a clone of the invalid item as a fallback.
    const invalidItem = this.createItemByItemName("INVALID-ITEM");
    return invalidItem ? invalidItem.clone() : null;
  }

  /**
   * Creates an item instance based on the item name.
   * Chooses the correct template method depending on the item name.
   * @param {string} itemName - The name of the item.
   * @returns {Item|null} An item instance template or null if no matching template is found.
   */
  static createItemByItemName(itemName) {
    let formedItem = null;
    if (itemName === "SAMPLE_ITEM") {
      formedItem = this.formSampleItem();
    } else if (itemName === "INVALID-ITEM") {
      formedItem = this.formInvalidItem();
    } else if (this.definedItems.has(itemName)) {
      formedItem = this.formDefinedItem(itemName);
    }
    return formedItem;
  }

  /**
   * Forms a generic defined item for item names not covered by specific templates.
   * @param {string} itemName - The name of the defined item.
   * @returns {Item} A generic defined item instance.
   */
  static formDefinedItem(itemName) {
    // Create a generic defined item with default common properties.
    return new Item(
      itemName,
      `This is a defined item: ${itemName}`,
      "COMMON",
      0,
      1,
      0,
      1,
      null,
      false,
      false,
      false,
      false,
      false
    );
  }

  /**
   * Forms a sample item used for demonstration or testing.
   * @returns {Item} A sample item instance.
   */
  static formSampleItem() {
    const sampleItem = new Item(
      "SAMPLE_ITEM",
      "This is a sample item!",
      "COMMON",
      10,
      1,
      0,
      1,
      null,
      false,
      false,
      false,
      false,
      false
    );
    return sampleItem;
  }

  /**
   * Forms an invalid item as a fallback for unknown item names.
   * @returns {Item} An invalid item instance.
   */
  static formInvalidItem() {
    const invalidItem = new Item(
      "INVALID-ITEM",
      "This is an invalid item!",
      "INVALID-RARITY",
      -1,
      -1,
      0,
      99,
      null,
      false,
      false,
      false,
      false,
      false
    );
    return invalidItem;
  }
}
