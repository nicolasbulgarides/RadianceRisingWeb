// -----------------------------------------------------------------
// Child Class: ItemUniformBundle
// -----------------------------------------------------------------
// A uniform bundle holds many copies of the same item type. Each copy
// is an instance of the Item class. This class implements logic to
// add new copies, remove usages intelligently (using the copy with
// the fewest remaining usages first), and “use” an item (consume one or
// more usages).
class ItemUniformBundle extends ItemBundle {
  /**
   * Create a uniform bundle for a specific item type.
   * @param {string|number} itemId - The identifier for the item type.
   */
  constructor(itemId) {
    super();
    this.itemId = itemId;
    // Array of Item copies for this item type.
    this.copies = [];
  }

  /**
   * Add new copies to this bundle.
   * @param {string|number} itemId - The item id (must match the bundle’s itemId).
   * @param {number} quantity - Number of copies to add.
   * @param {number} initialUsages - Initial usage count for each copy.
   */
  addItem(itemId, quantity, initialUsages) {
    if (itemId !== this.itemId) {
      throw new Error(
        `Item ID mismatch: this bundle holds items of type ${this.itemId} but received ${itemId}`
      );
    }
    for (let i = 0; i < quantity; i++) {
      this.copies.push(new Item(itemId, initialUsages));
    }
  }

  /**
   * Remove a specified number of usages from the bundle.
   * This method always removes usages from the copy with the fewest
   * usages remaining first. If a copy’s usages drop to 0, it is removed.
   * @param {string|number} itemId - The item id (must match the bundle).
   * @param {number} quantity - Total number of usages to remove.
   * @returns {boolean} - True if removal was successful; false if insufficient usages.
   */
  removeItem(itemId, quantity) {
    if (itemId !== this.itemId) {
      throw new Error(
        `Item ID mismatch in removeItem: expected ${this.itemId}, got ${itemId}`
      );
    }
    // Calculate total available usages.
    let totalUsages = this.copies.reduce(
      (acc, copy) => acc + copy.usagesRemaining,
      0
    );
    if (totalUsages < quantity) {
      console.warn(
        `Not enough usages available for item ${itemId}. Requested: ${quantity}, Available: ${totalUsages}`
      );
      return false;
    }
    let remainingToRemove = quantity;
    // Remove usages one “chunk” at a time.
    while (remainingToRemove > 0) {
      // Find the copy with the fewest usages (but still > 0).
      let minIndex = -1;
      let minUsage = Infinity;
      for (let i = 0; i < this.copies.length; i++) {
        const usage = this.copies[i].usagesRemaining;
        if (usage > 0 && usage < minUsage) {
          minUsage = usage;
          minIndex = i;
        }
      }
      if (minIndex === -1) {
        // (This should not happen because we checked totalUsages first.)
        console.error("No available copy found to remove usage from.");
        return false;
      }
      // Remove as many usages as possible from this copy without exceeding what it has.
      const removalAmount = Math.min(
        this.copies[minIndex].usagesRemaining,
        remainingToRemove
      );
      this.copies[minIndex].usagesRemaining -= removalAmount;
      remainingToRemove -= removalAmount;
      // If the copy is now depleted, remove it from the bundle.
      if (this.copies[minIndex].usagesRemaining === 0) {
        this.copies.splice(minIndex, 1);
      }
    }
    return true;
  }

  /**
   * Attempt to “use” an item by consuming usages.
   * The method finds the copy with the fewest usages remaining that can cover
   * a single use and deducts one usage. If the copy’s usages reach 0, it is removed.
   * If multiple usages are requested, the process repeats.
   * @param {string|number} itemId - The item id (must match the bundle).
   * @param {number} quantity - Number of usages to consume (default: 1).
   * @returns {boolean} - True if the operation was successful; false otherwise.
   */
  useItem(itemId, quantity = 1) {
    if (itemId !== this.itemId) {
      ItemLogger.logItemFailure(
        "Invalid Item Id For Bundle!: " + itemId,
        " use of item",
        0,
        "-use-Item-error"
      );
    }

    let itemManager = FundamentalSystemBridge.itemManager;

    // Process each usage individually.
    for (let i = 0; i < quantity; i++) {
      let minIndex = -1;
      let minUsage = Infinity;
      // Find the copy with the lowest positive usage count.
      for (let j = 0; j < this.copies.length; j++) {
        const usage = this.copies[j].usagesRemaining;
        if (usage > 0 && usage < minUsage) {
          minUsage = usage;
          minIndex = j;
        }
      }
      if (minIndex === -1) {
        itemManager.process;
        return false;
      }
      // Consume one usage from the selected copy.
      this.copies[minIndex].usagesRemaining -= 1;
      // If the copy is now fully used, remove it.
      if (this.copies[minIndex].usagesRemaining === 0) {
        let itemFinished = this.copies[minIndex];

        this.copies.splice(minIndex, 1);
      }
    }
    return true;
  }

  /**
   * Utility: Get the total number of usages available in this bundle.
   * @returns {number} Total usages remaining across all copies.
   */
  getTotalUsages() {
    return this.copies.reduce((acc, copy) => acc + copy.usagesRemaining, 0);
  }
}
