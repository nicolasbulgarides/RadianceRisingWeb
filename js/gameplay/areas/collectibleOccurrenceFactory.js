class CollectibleOccurrenceFactory {
  static convertMicroEventToOccurrence(microEvent) {
    if (microEvent.microEventCategory === "pickup") {
      let pickupCategory = microEvent.microEventValue;
      let occurrenceFormed = this.createOccurrenceByPickupType(pickupCategory);

      return occurrenceFormed;
    }
  }

  static createOccurrenceByPickupType(pickupType) {
    let occurrence = null;

    if (pickupType === "mango") {
      occurrence = this.createMangoPickupOccurrence();
    } else if (pickupType === "stardust") {
      occurrence = this.createStardustPickupOccurrence();
    }

    return occurrence;
  }

  static createMangoPickupOccurrence() {
    let mangoPickupHeader = this.getPickupHeader("mangoPickupOccurrence");
    let mangoPickupBasicData = this.getPickupBasicData(false, 1, 0, 0, 0.25, 0);
    let mangoPickupItemData = this.getPickupItemData(true, "mango", 1, 0, 0);


    let mangoPickupOccurrence = new SpecialOccurrenceComposite(
      mangoPickupHeader,
      mangoPickupBasicData,
      mangoPickupItemData,
    );

    return mangoPickupOccurrence;
  }

  static createStardustPickupOccurrence() {
    let stardustPickupHeader = this.getPickupHeader("stardustPickupOccurrence");
    let stardustPickupBasicData = this.getPickupBasicData(false, 0, 0, 0, 0, 0);
    let stardustPickupItemData = this.getPickupItemData(true, "stardust", 1, 0, 0);

    let stardustPickupOccurrence = new SpecialOccurrenceComposite(
      stardustPickupHeader,
      stardustPickupBasicData,
      stardustPickupItemData,
    );

    return stardustPickupOccurrence;
  }

  static createBasicPickupOccurrenceGeneralized() { }


  static getPickupItemData(
    singleItem,
    itemName,
    itemQuantity,
    sizeOfBundle,
    bundleQuatity
  ) {
    let itemData = new SpecialOccurrenceItemData(
      singleItem,
      itemName,
      itemQuantity,
      sizeOfBundle,
      bundleQuatity
    );

    return itemData;
  }

  static getPickupHeader(pickupId) {
    let timeStamp = TimestampGenie.getTimestamp();

    let pickupHeader = new SpecialOccurrenceHeader(
      pickupId,
      "event",
      "pickup",
      timeStamp
    );

    return pickupHeader;
  }

  static getPickupBasicData(
    fullRefresh,
    healthRefresh,
    magicRefresh,
    levelsGained,
    expGained,
    currencyGained
  ) {
    let pickupBasicData = new SpecialOccurrenceBasicData(
      fullRefresh,
      healthRefresh,
      magicRefresh,
      levelsGained,
      expGained,
      currencyGained
    );

    return pickupBasicData;
  }
}
