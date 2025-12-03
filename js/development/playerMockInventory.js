class PlayerMockInventory {
  constructor() {
    // Using a Map to store items with their quantities
    this.inventory = new Map();
  }

  addItem(itemData) {
    const itemName = itemData.itemName;

    if (this.inventory.has(itemName)) {
      // If item exists, increment quantity
      const existingEntry = this.inventory.get(itemName);
      existingEntry.quantity += 1;

    } else {
      // If new item, add it with quantity 1
      this.inventory.set(itemName, {
        itemData: itemData,
        quantity: 1,
      });
    }
  }

  // Helper method to get item quantity
  getItemQuantity(itemName) {
    const entry = this.inventory.get(itemName);
    return entry ? entry.quantity : 0;
  }

  // Helper method to get item data
  getItemData(itemName) {
    const entry = this.inventory.get(itemName);
    return entry ? entry.itemData : null;
  }
}
