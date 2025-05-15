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
    }

    return occurrence;
  }

  static createMangoPickupOccurrence() {
    let mangoPickupHeader = this.getPickupHeader("mangoPickupOccurrence");
    let mangoPickupBasicData = this.getPickupBasicData(false, 1, 0, 0, 0.25, 0);
    let mangoPickupItemData = this.getPickupItemData(true, "mango", 1, 0, 0);
    let mangoPickupProgressData = this.getPickupProgressData(
      "-no-quest",
      "-no-quest-data",
      "task-mango-pickup",
      1
    );

    let mangoPickupOccurrence = new SpecialOccurrenceComposite(
      mangoPickupHeader,
      mangoPickupBasicData,
      mangoPickupItemData,
      mangoPickupProgressData,
      null,
      null,
      null
    );

    return mangoPickupOccurrence;
  }

  static createBasicPickupOccurrenceGeneralized() {}

  static getPickupProgressData(
    questId,
    questProgressValue,
    taskId,
    taskProgressValue
  ) {
    let pickupProgressData = new SpecialOccurrenceProgressData(
      "not-level-progress",
      "no-level-progress-data",
      "no-achievement-progress-data",
      questId,
      questProgressValue,
      taskId,
      taskProgressValue
    );

    return pickupProgressData;
  }

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
