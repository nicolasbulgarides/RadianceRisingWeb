/**
 * Represents special behavior data for game triggers.
 * Handles sequence-based triggers and reset functionality.
 */
class TriggerSpecialData {
  /**
   * Creates a new TriggerSpecialData instance
   * @param {string} resetOccurrenceId - Identifier for reset event handling
   * @param {boolean} isSequenceMember - Whether this trigger is part of a sequence
   * @param {string} sequenceGroupId - Identifier for the sequence group this trigger belongs to
   * @param {number} sequenceGroupRequiredOrder - Order position in the sequence (if part of one)
   * @param {Object} preemptiveFutureProofTriggerSpecialData - Reserved for future compatibility
   * @param {Object} emergencyFutureProofTriggerSpecialData - Reserved for emergency updates
   */
  constructor(
    resetOccurrenceId = "-not-special-reset-occurrence-id-",
    isSequenceMember = false,
    sequenceGroupId = "-not-in-sequence-group-",
    sequenceGroupRequiredOrder = -1,
    preemptiveFutureProofTriggerSpecialData = {},
    emergencyFutureProofTriggerSpecialData = {}
  ) {
    this.resetOccurrenceId = resetOccurrenceId;
    this.isSequenceMember = isSequenceMember;
    this.sequenceGroupId = sequenceGroupId;
    this.sequenceGroupRequiredOrder = sequenceGroupRequiredOrder;
    this.preemptiveFutureProofTriggerSpecialData =
      preemptiveFutureProofTriggerSpecialData;
    this.emergencyFutureProofTriggerSpecialData =
      emergencyFutureProofTriggerSpecialData;
  }

  /**
   * Creates a TriggerSpecialData instance configured for sequence-based triggers
   * @param {string} sequenceGroupId - Identifier for the sequence group
   * @param {number} sequenceGroupRequiredOrder - Position in the sequence
   * @returns {TriggerSpecialData} A new TriggerSpecialData instance configured for sequences
   */
  static getGenericSpecialDataForSequence(
    sequenceGroupId,
    sequenceGroupRequiredOrder
  ) {
    return new TriggerSpecialData(
      true,
      sequenceGroupId,
      sequenceGroupRequiredOrder,
      {},
      {}
    );
  }

  /**
   * Creates a TriggerSpecialData instance with inactive sequence settings
   * @returns {TriggerSpecialData} A new TriggerSpecialData instance with default inactive settings
   */
  static getGenericSpecialDataInactive() {
    return new TriggerSpecialData(false, "-not-in-sequence-group-", -1, {}, {});
  }
}
