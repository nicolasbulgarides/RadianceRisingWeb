/**
 * Data structure for tracking usage-related accomplishments.
 *
 * Tracks the usage count and milestones for items, artifacts, abilities,
 * spells, and other game elements that can be used repeatedly.
 */
class AccomplishmentUsageData {
  /**
   * Creates a new usage accomplishment data instance
   * @param {string} usageCategory - Primary classification of the usage
   * @param {string} usageSubCategory - Secondary classification of the usage
   * @param {string} usageNickName - User-friendly name for the usage accomplishment
   * @param {string|number} usageValue - Primary value associated with the usage
   * @param {number} usageMagnitude - Numeric measure of the usage's significance
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    usageCategory,
    usageSubCategory,
    usageNickName,
    usageValue,
    usageMagnitude,
    otherRelevantData
  ) {
    this.usageCategory = usageCategory;
    this.usageSubCategory = usageSubCategory;
    this.usageNickName = usageNickName;
    this.usageValue = usageValue;
    this.usageMagnitude = usageMagnitude;
    this.otherRelevantData = otherRelevantData;
  }
}
