/**
 * Data structure for tracking status-related accomplishments.
 *
 * Tracks accomplishments related to status effects, auras, buffs, debuffs,
 * blessings, and other persistent conditions that affect the player.
 * This includes special perks that grant ongoing effects or status changes.
 */
class AccomplishmentStatusData {
  /**
   * Creates a new status accomplishment data instance
   * @param {string} statusId - Unique identifier for the status
   * @param {string} statusCategory - Category of the status effect
   * @param {string} nameOfSpecialStatus - Display name of the status effect
   * @param {number|string} statusPossiblyRelevantValue - Optional value associated with the status
   */
  constructor(
    statusId,
    statusCategory,
    nameOfSpecialStatus,
    statusPossiblyRelevantValue
  ) {
    this.statusId = statusId;
    this.statusCategory = statusCategory;
    this.nameOfSpecialStatus = nameOfSpecialStatus;
    this.statusPossiblyRelevantValue = statusPossiblyRelevantValue;
  }
}
