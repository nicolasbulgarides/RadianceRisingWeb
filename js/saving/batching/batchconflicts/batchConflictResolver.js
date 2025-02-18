/**
 * BatchConflictResolver
 *
 * Contains methods to resolve conflicts between save batches. Depending on the urgency
 * and special markers, it applies specific conflict resolution logic.
 */
class BatchConflictResolver {
  /**
   * Resolves a conflict between save batches by choosing the appropriate strategy.
   * @param {BatchConflict} batchConflict - The conflict to resolve.
   * @returns {BatchConflict} The batch conflict with an updated placeholder message.
   */
  static resolveBatchConflict(batchConflict) {
    // Determine resolution based on whether a special conflict marker is in use.
    if (batchConflict.utilizeSpecialBatchMarkerFlag)
      return this.resolveSpecialBatchConflict(batchConflict);
    else return this.resolveNormalBatchConflict(batchConflict);
  }

  /**
   * Resolves a conflict that requires special handling.
   * @param {BatchConflict} batchConflict - The conflict to resolve.
   * @returns {BatchConflict} The updated conflict object with special messaging.
   */
  static resolveSpecialBatchConflict(batchConflict) {
    // Update the placeholder message to indicate a special conflict resolution was applied.
    batchConflict.placeholderMsg =
      "placeholder-special-batch-conflict-msg-update-";
    return batchConflict;
  }

  /**
   * Resolves a standard (normal) conflict.
   * @param {BatchConflict} batchConflict - The conflict to resolve.
   * @returns {BatchConflict} The updated conflict object with normal resolution messaging.
   */
  static resolveNormalBatchConflict(batchConflict) {
    // Update the placeholder message to indicate a standard conflict resolution was applied.
    batchConflict.placeholderMsg =
      "placeholder-normal-batch-conflict-msg-update-";
    return batchConflict;
  }
}
