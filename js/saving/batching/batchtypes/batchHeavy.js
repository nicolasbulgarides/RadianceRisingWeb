/**
 * BatchHeavy
 *
 * A save update batch for heavy updates.
 * Heavy batches might contain a large volume of instructions and are generally not urgent.
 */
class BatchHeavy extends BatchAbstract {
  /**
   * Constructs a heavy save batch.
   * @param {string} playerId - The player's unique identifier.
   * @param {string} sessionBatchId - The session-specific batch identifier.
   * @param {number} timestamp - The creation timestamp.
   */
  constructor(playerId, sessionBatchId, timestamp) {
    super(playerId, sessionBatchId, timestamp);
    this.batchType = "HEAVY";
  }
}
