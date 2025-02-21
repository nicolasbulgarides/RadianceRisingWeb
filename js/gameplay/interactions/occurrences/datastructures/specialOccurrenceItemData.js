class SpecialOccurrenceItemData {
  // Constructor for managing item-related data within an occurrence.
  constructor(
    isASingleItem = true, // Flag indicating if the occurrence involves a single item.
    singleItem = null, // The single item involved in the occurrence.
    singleItemQuantity = 0, // Quantity of the single item.
    itemBundle = null, // Bundle of items involved in the occurrence.
    itemBundleQuantity = 0 // Quantity of the item bundle.
  ) {
    this.isASingleItem = isASingleItem;
    this.singleItem = singleItem;
    this.singleItemQuantity = singleItemQuantity;
    this.itemBundle = itemBundle;
    this.itemBundleQuantity = itemBundleQuantity;
  }
}
