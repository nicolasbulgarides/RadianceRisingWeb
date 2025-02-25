/**
 * Represents the header information for a game trigger.
 * Contains metadata about the trigger including its identification, category, and version information.
 */
class TriggerHeader {
  /**
   * Creates a new TriggerHeader instance
   * @param {number} absoluteIndex - Unique identifier for the trigger
   * @param {string} triggerNickname - Human-readable name for the trigger
   * @param {string} triggerCategory - Category classification of the trigger
   * @param {string} triggerInstructionGameVersion - Game version this trigger is compatible with
   * @param {Object} regionalUseMetaData - Region-specific metadata for the trigger
   * @param {Object} preemptiveFutureProofHeaderMetaData - Reserved for future compatibility
   * @param {Object} emergencyFutureProofHeaderMetaData - Reserved for emergency updates
   */
  constructor(
    absoluteIndex = -1,
    triggerNickname = "-trigger-instruction-not-set-",
    triggerCategory = "-trigger-category-not-set-",
    triggerInstructionGameVersion = Config.ASSUMED_GAME_VERSION,
    regionalUseMetaData = {},
    preemptiveFutureProofHeaderMetaData = {},
    emergencyFutureProofHeaderMetaData = {}
  ) {
    this.absoluteIndex = absoluteIndex;
    this.triggerNickname = triggerNickname;
    this.triggerCategory = triggerCategory;
    this.triggerInstructionGameVersion = triggerInstructionGameVersion;
    this.regionalUseMetaData = regionalUseMetaData;
    this.preemptiveFutureProofHeaderMetaData =
      preemptiveFutureProofHeaderMetaData;
    this.emergencyFutureProofHeaderMetaData =
      emergencyFutureProofHeaderMetaData;
  }

  /**
   * Creates a simplified trigger header with basic required fields
   * @param {number} index - Unique identifier for the trigger
   * @param {string} nickname - Human-readable name for the trigger
   * @param {string} category - Category classification of the trigger
   * @returns {TriggerHeader} A new TriggerHeader instance with default values for optional fields
   */
  static getGenericHeader(index, nickname, category) {
    return new TriggerHeader(
      index,
      nickname,
      category,
      Config.ASSUMED_GAME_VERSION,
      {},
      {},
      {}
    );
  }
}
