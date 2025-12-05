class PickupOccurrenceSubManager {
  processPickupOccurrence(pickupOccurrence) {
    let processedSuccessfully = false;

    let occurrenceHeader = pickupOccurrence.occurrenceHeader;
    let occurrenceId = occurrenceHeader.occurrenceId;

    if (occurrenceId === "mangoPickupOccurrence") {
      this.processBasicFruitPickup(pickupOccurrence, "mango");
      processedSuccessfully = true;
    } else if (occurrenceId === "stardustPickupOccurrence") {
      this.processStardustPickup(pickupOccurrence);
      processedSuccessfully = true;
    }

    return processedSuccessfully;
  }

  processBasicFruitPickup(pickupOccurrence, fruitType) {
    if (fruitType === "mango") {
      let itemData = this.getMangoItemData();
      let activePlayer =
        FundamentalSystemBridge["gameplayManagerComposite"].primaryActivePlayer;

      let activeInventory = activePlayer.mockInventory;

      activeInventory.addItem(itemData);
    }
  }

  getMangoItemData() {
    let itemData = new Item(
      "mango",
      "A tasty mango fruit.",
      "common",
      1,
      1,
      0,
      0,
      null,
      false,
      false,
      false,
      true,
      true
    );

    return itemData;
  }

  processStardustPickup(pickupOccurrence) {
    console.log("Stardust has been picked up!");
    // Future: Add stardust to player inventory or track collection
  }
}
