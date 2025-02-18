/**
 * BatchUpdateAndMergeFactory
 *
 * Responsible for combining or merging compatible save batches.
 * If two batches are of the same type, a conflict is detected and resolved.
 * Otherwise, both batches are returned as separate valid entities.
 */
class BatchUpdateAndMergeFactory {
  /**
   * Combines or merges two batches that may or may not be compatible.
   * @param {object} batchToEvaluateA - The first batch to evaluate.
   * @param {object} batchToEvaluateB - The second batch to evaluate.
   * @returns {BatchConflict|Array} A resolved batch conflict or an array of both batches if no conflict exists.
   */
  static combineOrMergeCompatibleBatches(batchToEvaluateA, batchToEvaluateB) {
    let possibleBatchConflict = null;

    // If both batches are of the same type, evaluate for conflicts.
    if (typeof batchToEvaluateA === typeof batchToEvaluateB) {
      possibleBatchConflict =
        BatchConflictDetector.detectAndWrapBatchConflictComposite(
          batchToEvaluateA,
          batchToEvaluateB
        );
      return BatchConflictResolver.resolveBatchConflict(possibleBatchConflict);
    } else {
      // No conflict: simply return both batches as a valid pair.
      let validAndSeparateBatches = [batchToEvaluateA, batchToEvaluateB];
      return validAndSeparateBatches;
    }
  }
}
