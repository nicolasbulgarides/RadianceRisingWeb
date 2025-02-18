/**
 * BatchAbstract
 *
 * An abstract base class representing a save update batch.
 * Contains common properties and methods used by various types
 * of save update batches (e.g., CRITICAL, HEAVY, SLIM, SUPERBACKUP).
 */
class BatchAbstract {
  /**
   * Constructs the abstract save batch.
   * @param {string} playerId - The unique player identifier.
   * @param {string} sessionBatchId - The unique session batch identifier.
   * @param {number} timestamp - Time when the batch was created.
   * @param {string} batchWeightCategory - Category reflecting the batch's importance.
   */
  constructor(playerId, sessionBatchId, timestamp, batchWeightCategory) {
    this.playerId = playerId;
    this.sessionBatchId = sessionBatchId;
    this.timestamp = timestamp;
    // Holds transformed database instructions for the update.
    this.convertedDatabaseInstructions = [];
    // Flag indicating if this batch is urgent.
    this.isUrgent = false;
    // Alias for isUrgent to ease reference in other parts of the code.
    this.isUrgentBatch = this.isUrgent;
  }

  /**
   * Adds a converted database instruction to the batch.
   * @param {object} convertedDatabaseInstruction - The instruction to add.
   */
  addConvertedDatabaseInstruction(convertedDatabaseInstruction) {
    this.convertedDatabaseInstructions.push(convertedDatabaseInstruction);
  }

  /**
   * Finalizes the update batch by packaging all instructions for delivery.
   * @returns {object} The finalized batch data.
   */
  finalizeUpdateBatch() {
    return {
      playerId: this.playerId,
      sessionBatchId: this.sessionBatchId,
      timestamp: this.timestamp,
      instructions: this.convertedDatabaseInstructions,
    };
  }

  /**
   * Marks the batch as urgent for immediate delivery.
   * Also updates the convenience alias.
   */
  markAsUrgent() {
    this.isUrgent = true;
    this.isUrgentBatch = this.isUrgent;
  }

  /**
   * Marks the batch as not urgent.
   * Also updates the convenience alias.
   */
  markAsNotUrgent() {
    this.isUrgent = false;
    this.isUrgentBatch = this.isUrgent;
  }
}
