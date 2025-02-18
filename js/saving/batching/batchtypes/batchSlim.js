/**
 * BatchSlim
 *
 * A save update batch for slim (lightweight) updates.
 * Slim batches are used for routine updates that require minimal processing.
 */
class BatchSlim extends BatchAbstract {
  /**
   * Constructs a slim save batch.
   * @param {string} playerId - The player's unique identifier.
   * @param {string} sessionBatchId - The session-specific batch identifier.
   * @param {number} timestamp - The creation timestamp.
   */
  constructor(playerId, sessionBatchId, timestamp) {
    super(playerId, sessionBatchId, timestamp);
    this.batchType = "SLIM";
  }
}
