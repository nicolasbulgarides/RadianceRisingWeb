/**
 * Data structure for tracking area-related accomplishments.
 * Used to record completion levels for specific areas or levels in the game,
 * such as "basicComplete", "goodComplete", "greatComplete", or "perfectComplete".
 * Can track accomplishments for individual levels or broader game areas.
 */
class AccomplishmentAreaData {
  /**
   * Creates a new area accomplishment data instance
   * @param {boolean} isAreaOrLevel - Whether this is an area (true) or level (false)
   * @param {string} areaId - Unique identifier for the area or level
   * @param {string} areaName - Display name of the area or level
   * @param {string} accomplishmentCategory - Primary classification of the accomplishment
   * @param {string} accomplishmentSubCategory - Secondary classification of the accomplishment
   * @param {string|number} accomplishmentValue - Primary value associated with the accomplishment
   * @param {number} accomplishmentMagnitude - Numeric measure of the accomplishment's significance
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    isAreaOrLevel,
    areaId,
    areaName,
    accomplishmentCategory,
    accomplishmentSubCategory,
    accomplishmentValue,
    accomplishmentMagnitude,
    otherRelevantData
  ) {
    this.isAreaOrLevel = isAreaOrLevel;
    this.areaId = areaId;
    this.areaName = areaName;
    this.accomplishmentCategory = accomplishmentCategory;
    this.accomplishmentSubCategory = accomplishmentSubCategory;
    this.accomplishmentValue = accomplishmentValue;
    this.accomplishmentMagnitude = accomplishmentMagnitude;
    this.otherRelevantData = otherRelevantData;
  }
}
