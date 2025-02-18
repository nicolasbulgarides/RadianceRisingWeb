class ItemAcquisitionEvent {
  constructor(
    itemOrBundle = "item",
    itemOrBundleItemId = "-placeholder-item-id",
    itemBundleIsSpecial = false,
    itemBundleSpecialId = "-non-special-bundle-",
    itemOrBundleQuantity = 1,
    itemSubmittedJustification,
    acquisitionWasSuccessful,
    itemGenerated = new Item(
      "-failed-item-generation-",
      "-failed-item-description-",
      "-failed-item-rarity-",
      0,
      0,
      0,
      0,
      null,
      false,
      false,
      false,
      false,
      false
    )
  ) {
    this.itemOrBundle = itemOrBundle;
    this.itemOrBundleItemId = itemOrBundleItemId;
    this.itemBundleIsSpecial = itemBundleIsSpecial;
    this.itemBundleSpecialId = itemBundleSpecialId;
    this.itemOrBundleQuantity = itemOrBundleQuantity;
    this.itemSubmittedJustification = itemSubmittedJustification;
    this.acquisitionWasSuccessful = acquisitionWasSuccessful;
    this.itemGenerated = itemGenerated;
  }
}
