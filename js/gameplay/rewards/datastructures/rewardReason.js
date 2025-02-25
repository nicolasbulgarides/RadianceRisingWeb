/**
 * Data structure that encapsulates the reason for a reward being granted.
 * Used for validation, tracking, and analytics of reward distribution.
 */
class RewardReason {
  /**
   * Creates a new reward reason instance.
   * @param {string} reasonId - Unique identifier for this reward reason
   * @param {string} reasonName - Human-readable name of the reward reason
   * @param {string} reasonDescription - Detailed description of why this reward was granted
   */
  constructor(reasonId, reasonName, reasonDescription) {
    this.reasonId = reasonId;
    this.reasonName = reasonName;
    this.reasonDescription = reasonDescription;
  }
}
