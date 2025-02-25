/**
 * Records and tracks individual reward events in the game.
 * Maintains a historical record of rewards for auditing, analytics, and player history.
 */
class RewardEventRecord {
  /**
   * Creates a new reward event record.
   * @param {string} rewardEventId - Unique identifier for this reward event
   * @param {Date} timestamp - When the reward was granted
   * @param {RewardBundle} rewardBundle - Collection of rewards granted in this event
   * @param {RewardReason} rewardReason - The reason this reward was granted
   */
  constructor(rewardEventId, timestamp, rewardBundle, rewardReason) {
    this.rewardEventId = rewardEventId;
    this.timestamp = timestamp;
    this.rewardBundle = rewardBundle;
    this.rewardReason = rewardReason;
  }
}
