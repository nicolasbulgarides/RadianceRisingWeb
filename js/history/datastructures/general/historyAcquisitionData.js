// Represents data related to an acquisition event in the game.
// This includes items, currency, spells, and artifacts acquired by the player.
class HistoryAcquisitionData {
  constructor(
    acquisitionCategory, // Category of the acquisition (e.g., "item", "currency").
    acquisitionName, // Name of the acquisition.
    acquisitionDescription, // Description of the acquisition.
    currencyNameAcquired, // Name of the currency acquired.
    currencyQuantityAcquired, // Quantity of the currency acquired.
    spellUnlockedName, // Name of the spell unlocked.
    artifactAcquiredName, // Name of the artifact acquired.
    specificItemAcquired, // Specific item acquired.
    specificItemQuantity, // Quantity of the specific item acquired.
    itemBundleAcquired, // Name of the item bundle acquired.
    itemBundleQuantity // Quantity of the item bundle acquired.
  ) {
    // Initialize properties with provided values.
    this.acquisitionCategory = acquisitionCategory;
    this.acquisitionName = acquisitionName;
    this.acquisitionDescription = acquisitionDescription;
    this.currencyNameAcquired = currencyNameAcquired;
    this.currencyQuantityAcquired = currencyQuantityAcquired;
    this.spellUnlockedName = spellUnlockedName;
    this.artifactAcquiredName = artifactAcquiredName;
    this.specificItemAcquired = specificItemAcquired;
    this.specificItemQuantity = specificItemQuantity;
    this.itemBundleAcquired = itemBundleAcquired;
    this.itemBundleQuantity = itemBundleQuantity;
  }
}
