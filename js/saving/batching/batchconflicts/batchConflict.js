/**
 * BatchConflict
 *
 * Represents a conflict between two save batches that need to be resolved or merged.
 * The conflict can incorporate a special marker and resolution function if needed.
 */
class BatchConflict {
  /**
   * Constructs a BatchConflict instance.
   * @param {object} olderBatch - The older batch identified during conflict detection.
   * @param {object} youngerBatch - The newer batch corresponding to the conflict.
   * @param {string} updateCategory - The category identifier for the update.
   * @param {string} conflictArchetype - Describes the archetype or type of conflict.
   * @param {boolean} utilizeSpecialBatchMarkerFlag - Flag indicating special conflict resolution usage.
   * @param {any} specialBatchUtilityMarker - A marker (or identifier) for specialized conflict handling.
   * @param {Function} specialBatchFunctionPassedIn - A callback function for special conflict resolution.
   */
  constructor(
    olderBatch,
    youngerBatch,
    updateCategory,
    conflictArchetype,
    utilizeSpecialBatchMarkerFlag,
    specialBatchUtilityMarker,
    specialBatchFunctionPassedIn
  ) {
    this.olderBatch = olderBatch;
    this.youngerBatch = youngerBatch;
    this.updateCategory = updateCategory;
    this.conflictArchetype = conflictArchetype;
    this.utilizeSpecialBatchMarkerFlag = utilizeSpecialBatchMarkerFlag;
    // Placeholder message that can be updated as part of conflict resolution.
    this.placeholderMsg = "placeholder";

    // If a special conflict marker is in use, assign the extra properties.
    if (this.utilizeSpecialBatchMarkerFlag) {
      this.specialBatchUtilityMarker = specialBatchUtilityMarker;
      this.specialBatchFunctionPassedIn = specialBatchFunctionPassedIn;
    }
  }
}
