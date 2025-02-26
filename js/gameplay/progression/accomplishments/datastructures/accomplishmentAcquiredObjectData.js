/**
 * Data structure for tracking the acquisition of items and artifacts.
 * This tracks physical objects obtained in the game, distinct from spells/abilities (which are "learned")
 * and status effects/auras/buffs (which are tracked as "status").
 */
class AccomplishmentAcquiredObjectData {
  /**
   * Creates a new object acquisition accomplishment data instance
   * @param {string} idOfAcquisition - Unique identifier for the acquisition event
   * @param {string} acquisitionCategory - Category of the acquired object
   * @param {string} acquisitionLocation - Where the object was acquired
   * @param {string} acquisitionMethod - How the object was acquired (e.g., "found", "crafted", "purchased")
   * @param {number} acquisitionNumericValue - Numeric value associated with the acquisition
   * @param {string|number} acquisitionRarityTier - Rarity tier of the acquired object
   */
  constructor(
    idOfAcquisition,
    acquisitionCategory,
    acquisitionLocation,
    acquisitionMethod,
    acquisitionNumericValue,
    acquisitionRarityTier
  ) {
    this.idOfAcquisition = idOfAcquisition;
    this.acquisitionCategory = acquisitionCategory;
    this.acquisitionMethod = acquisitionMethod;
    this.acquisitionNumericValue = acquisitionNumericValue;
    this.acquisitionRarityTier = acquisitionRarityTier;
    this.acquisitionLocation = acquisitionLocation;
  }
}
