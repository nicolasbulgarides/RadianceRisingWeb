class ItemManager {
  constructor(playerStatusComposite) {
    this.playerStatusComposite = playerStatusComposite;
    this.itemFactory = new ItemFactory(this);
    this.inventoryUI = null;
  }

  attemptToAddItemToInventory(itemId, quantity, itemJustification) {
    let itemAcquisitionEvent = this.itemFactory.createItemAcquisitionEvent(
      itemId,
      quantity,
      itemJustification
    );

    let itemAcquisitionOutcome =
      this.itemFactory.processItemAcquisitionEvent(itemAcquisitionEvent);

    if (itemAcquisitionOutcome instanceof ItemAcquisitionOutcome) {
      if (itemAcquisitionOutcome.acquisitionWasSuccessful) {
        this.process;
      } else if (!itemAcquisitionOutcome.acquisitionWasSuccessful) {
        this.processFailureToAddItemToInventory(itemAcquisitionOutcome);
      }
    }
  }

  addItemToInventory(item) {
    if (
      item instanceof Item &&
      this.playerStatusComposite instanceof PlayerStatusComposite
    ) {
      let playerInventory = this.playerStatusComposite.getPlayerInventory();

      if (playerInventory instanceof PlayerInventory) {
        playerInventory.addItemToInventory(item);
        this.calculateInventoryUIUpdate("add");
      }
    }
  }

  subtractItemFromInventory(item) {
    if (
      item instanceof Item &&
      this.playerStatusComposite instanceof PlayerStatusComposite
    ) {
      let playerInventory = this.playerStatusComposite.getPlayerInventory();

      if (playerInventory instanceof PlayerInventory) {
        playerInventory.subtractItemFromInventory(item);
        this.calculateInventoryUIUpdate("subtract", item);
      }
    }
  }

  calculateInventoryUIUpdate(addOrSubtract, item) {
    if (addOrSubtract === "add") {
      this.addItemToInventoryUI(item);
    } else if (addOrSubtract === "subtract") {
      this.subtractItemFromInventoryUI(item);
    }
  }

  processFailureToUseItem(failureReason, itemId) {}

  addItemToInventoryUI(item) {
    let inventoryUI = FundamentalSystemBridge[playerInventoryUI];
    inventoryUI.updatePlayerInventoryUI("add", item);
  }

  subtractItemFromInventoryUI(item) {
    let inventoryUI = FundamentalSystemBridge[playerInventoryUI];
    inventoryUI.updatePlayerInventoryUI("subtract", item);
  }
}
