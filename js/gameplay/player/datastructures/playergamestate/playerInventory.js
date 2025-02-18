class PlayerInventory {
  constructor(player) {
    this.player = player;
    this.allPossessedItemBundles = [];
  }

  processInventoryJson(inventoryJson) {
    this.inventory = inventoryJson;
  }

  addItemToInventory(item) {
    this.inventory.push(item);
    FundamentalSys;
  }
  removeItemFromInventory(item) {
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }
}
