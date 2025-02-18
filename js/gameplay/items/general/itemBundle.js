// --------------------------------------------------
// Abstract Base Class: ItemBundle
// --------------------------------------------------
// This class is designed to be abstract. It “declares” methods
// for adding, removing, and using items. Child classes must
// override these methods.
class ItemBundle {
  constructor(itemId, quantity) {
    if (new.target === ItemBundle) {
      this.logAttemptTOUseAbstractItemBundle(itemId, quantity);
    }
  }

  /**
   * Add item(s) to the bundle.
   * @param {string|number} itemId - The item identifier.
   * @param {number} quantity - Number of copies to add.
   * @param {number} initialUsages - Initial usages per copy.
   */
  addItem(itemId, quantity, initialUsages) {
    throw new Error("addItem() must be implemented by subclass");
  }

  /**
   * Remove a number of usages from items in the bundle.
   * @param {string|number} itemId - The item identifier.
   * @param {number} quantity - Number of usages to remove.
   */
  removeItem(itemId, quantity) {
    this.logAttemptTOUseAbstractItemBundle(itemId, quantity);
  }

  /**
   * Attempt to use an item by consuming a number of usages.
   * @param {string|number} itemId - The item identifier.
   * @param {number} quantity - Number of usages to consume.
   */
  useItem(itemId, quantity = 1) {
    this.logAttemptTOUseAbstractItemBundle(itemId, quantity);
  }

  logAttemptTOUseAbstractItemBundle(itemId, quantity) {
    let timestamp = TimestampGenie.getStandardTimeStampISO8601();

    ItemLogger.logItemFailure(
      "ItemBundle: " +
        itemId +
        ", quantity: " +
        quantity +
        ", timestamp: " +
        timestamp,
      "Attempt to constructor Item Bundle",
      0,
      "attemptToUseAbstractItemBundle"
    );
  }
}
