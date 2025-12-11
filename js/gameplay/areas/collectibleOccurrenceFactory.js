class CollectibleOccurrenceFactory {
  static convertMicroEventToOccurrence(microEvent) {
    if (microEvent.microEventCategory === "pickup") {
      let pickupCategory = microEvent.microEventValue;
      let occurrenceFormed = this.createOccurrenceByPickupType(pickupCategory);

      // Transfer location from microEvent to occurrence
      if (microEvent.microEventLocation) {
        occurrenceFormed.occurrenceLocation = microEvent.microEventLocation;
      }

      // Transfer preemptive explosion flag (used to prevent duplicate explosions)
      if (microEvent.hasPreemptiveExplosion) {
        occurrenceFormed.hasPreemptiveExplosion = true;
      }

      return occurrenceFormed;
    } else if (microEvent.microEventCategory === "damage") {
      let damageType = microEvent.microEventValue;
      let occurrenceFormed = this.createOccurrenceByDamageType(damageType);

      // Transfer location from microEvent to occurrence
      if (microEvent.microEventLocation) {
        occurrenceFormed.occurrenceLocation = microEvent.microEventLocation;
      }

      // Transfer preemptive explosion flag (used to prevent duplicate explosions)
      if (microEvent.hasPreemptiveExplosion) {
        occurrenceFormed.hasPreemptiveExplosion = true;
      }

      return occurrenceFormed;
    }
  }

  static createOccurrenceByPickupType(pickupType) {
    let occurrence = null;

    if (pickupType === "mango") {
      occurrence = this.createMangoPickupOccurrence();
    } else if (pickupType === "stardust") {
      occurrence = this.createStardustPickupOccurrence();
    } else if (pickupType === "heart") {
      occurrence = this.createHeartPickupOccurrence();
    } else if (pickupType === "key") {
      occurrence = this.createKeyPickupOccurrence();
    }

    return occurrence;
  }

  static createOccurrenceByDamageType(damageType) {
    let occurrence = null;

    if (damageType === "spike") {
      occurrence = this.createSpikeTrapDamageOccurrence();
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

  static createHeartPickupOccurrence() {
    let heartPickupHeader = this.getPickupHeader("heartPickupOccurrence");
    // Hearts heal 1 health
    let heartPickupBasicData = this.getPickupBasicData(false, 1, 0, 0, 0, 0);
    let heartPickupItemData = this.getPickupItemData(true, "heart", 1, 0, 0);

    let heartPickupOccurrence = new SpecialOccurrenceComposite(
      heartPickupHeader,
      heartPickupBasicData,
      heartPickupItemData,
    );

    return heartPickupOccurrence;
  }

  static createKeyPickupOccurrence() {
    let keyPickupHeader = this.getPickupHeader("keyPickupOccurrence");
    // Keys don't provide health or other benefits, just inventory item
    let keyPickupBasicData = this.getPickupBasicData(false, 0, 0, 0, 0, 0);
    let keyPickupItemData = this.getPickupItemData(true, "key", 1, 0, 0);

    let keyPickupOccurrence = new SpecialOccurrenceComposite(
      keyPickupHeader,
      keyPickupBasicData,
      keyPickupItemData,
    );

    return keyPickupOccurrence;
  }

  static createSpikeTrapDamageOccurrence() {
    let spikeHeader = this.getDamageHeader("spikePickupOccurrence");
    // Spike traps don't give any positive effects, only deal damage
    let spikeBasicData = this.getPickupBasicData(false, 0, 0, 0, 0, 0);
    let spikeItemData = this.getPickupItemData(false, "spike", 0, 0, 0);

    let spikeDamageOccurrence = new SpecialOccurrenceComposite(
      spikeHeader,
      spikeBasicData,
      spikeItemData,
    );

    return spikeDamageOccurrence;
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

  static getDamageHeader(damageId) {
    let timeStamp = TimestampGenie.getTimestamp();

    let damageHeader = new SpecialOccurrenceHeader(
      damageId,
      "event",
      "damage",
      timeStamp
    );

    return damageHeader;
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
