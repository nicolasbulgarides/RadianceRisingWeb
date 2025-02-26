/**
 * Data structure for tracking common numerical milestone accomplishments.
 *
 * These represent quantifiable achievements like experience gained, levels reached,
 * currency earned/spent, items used, or enemies defeated. Basic milestones can trigger
 * chain reactions of other accomplishments.
 *
 * For example, defeating the 100th enemy might:
 * 1. Trigger a combat milestone
 * 2. Potentially generate an item acquisition accomplishment
 * 3. Unlock an achievement
 * 4. Increase achievement points to reach another milestone
 *
 * This interconnected nature requires careful handling of accomplishment propagation
 * and clear presentation to players through the UI.
 */
class AccomplishmentBasicMilestoneData {
  /**
   * Creates a new basic milestone accomplishment data instance
   * @param {string} accomplishmentCategory - Primary classification of the milestone
   * @param {string} accomplishmentSubCategory - Secondary classification of the milestone
   * @param {string} accomplishmentNickName - User-friendly name for the milestone
   * @param {string|number} accomplishmentValue - Primary value associated with the milestone
   * @param {number} accomplishmentMagnitude - Numeric measure of the milestone's significance
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    accomplishmentCategory,
    accomplishmentSubCategory,
    accomplishmentNickName,
    accomplishmentValue,
    accomplishmentMagnitude,
    otherRelevantData
  ) {
    this.accomplishmentCategory = accomplishmentCategory;
    this.accomplishmentSubCategory = accomplishmentSubCategory;
    this.accomplishmentNickName = accomplishmentNickName;
    this.accomplishmentValue = accomplishmentValue;
    this.accomplishmentMagnitude = accomplishmentMagnitude;
    this.otherRelevantData = otherRelevantData;
  }
}
