/**
 * BatchSuperBackup
 *
 * A save update batch designed for super backup purposes.
 * These batches are marked as urgent to ensure that backup data is quickly saved.
 */
class BatchSuperBackup extends BatchAbstract {
  /**
   * Constructs a super backup save batch.
   * @param {string} playerId - The player's unique identifier.
   * @param {string} sessionBatchId - The session-specific batch identifier.
   * @param {number} timestamp - The creation timestamp.
   */
  constructor(playerId, sessionBatchId, timestamp) {
    super(playerId, sessionBatchId, timestamp);
    this.batchType = "SUPERBACKUP";
    // Super backup batches must be delivered urgently.
    this.markAsUrgent();
  }
}
