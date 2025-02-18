/**
 * BatchCritical
 *
 * A save update batch class for critical updates.
 * Critical batches are marked as urgent and handled with high priority.
 */
class BatchCritical extends BatchAbstract {
  /**
   * Constructs a critical save batch.
   * @param {string} playerId - The player's unique identifier.
   * @param {string} sessionBatchId - The session-specific batch identifier.
   * @param {number} timestamp - The creation timestamp.
   */
  constructor(playerId, sessionBatchId, timestamp) {
    super(playerId, sessionBatchId, timestamp);
    this.batchType = "CRITICAL";
    // Automatically mark critical batches as urgent.
    this.markAsUrgent();
  }
}
