/**
 * ItemLogger Class
 *
 * Provides logging utilities designed for item-related failure events within the gameplay system.
 * It leverages the LoggerOmega module to decide whether to log based on system-wide logging configurations,
 * importance levels, and optional cooldown behavior.
 *
 * Static Members:
 *  - ITEM_LOG_OVERRIDE: Boolean flag to override default logging configurations.
 *  - ITEM_LOG_ENABLED: Global setting to enable or disable item logging.
 *  - ITEM_LOG_IMPORTANCE_LEVEL: Baseline importance level for logging item failures.
 *  - ITEM_LOG_COOLDOWN_ENABLED: If true, uses cooldown-based logging via LoggerOmega.
 */
class ItemLogger {
  static ITEM_LOG_OVERRIDE = false;
  static ITEM_LOG_ENABLED = true;
  static ITEM_LOG_IMPORTANCE_LEVEL = 0;
  static ITEM_LOG_COOLDOWN_ENABLED = false;

  /**
   * Logs an item failure event.
   *
   * This method determines whether an item failure should be logged based on the event's importance
   * level compared to a system threshold. It then generates a detailed debug message and dispatches
   * it through LoggerOmega. Depending on the configuration, logging is applied instantly or using a
   * cooldown to prevent log spamming.
   *
   * @param {string} itemName - The name of the item that encountered an error.
   * @param {string} itemProcessPhase - The processing phase during which the failure occurred.
   * @param {number} itemImportance - The importance level associated with the failure (lower numeric values imply higher significance).
   * @param {string|number} itemErrorCooldownId - Identifier used for managing the logging cooldown period.
   */
  static logItemFailure(
    itemName,
    itemProcessPhase,
    itemImportance,
    itemErrorCooldownId
  ) {
    // Determine the decisive importance level for logging,
    // choosing the lower (more critical) between the passed and fundamental levels.
    let importanceLevel = ItemLogger.getMinimumImportanceLevel(
      itemImportance,
      this.ITEM_LOG_IMPORTANCE_LEVEL
    );

    // Use LoggerOmega to check if logging should proceed per current config.
    let finalizedDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.ITEM_LOG_OVERRIDE,
      this.ITEM_LOG_ENABLED,
      importanceLevel
    );

    // Generate a formatted debug message with the item name and processing phase.
    let debugMsg = ItemLogger.formulateItemDebugMsg(itemName, itemProcessPhase);

    // Exit if the logging decision indicates no logging is needed.
    if (!finalizedDecision) return;

    // Log using a cooldown method if enabled, otherwise use standard logging.
    if (this.ITEM_LOG_COOLDOWN_ENABLED) {
      LoggerOmega.SmartLoggerWithCooldown(
        finalizedDecision,
        debugMsg,
        itemErrorCooldownId
      );
    } else {
      LoggerOmega.SmartLogger(
        finalizedDecision,
        debugMsg,
        "Item Failure Sender"
      );
    }
  }

  /**
   * Constructs a debug message for a failed item event.
   *
   * Concatenates the item name with the processing phase into a readable message,
   * which provides context on where in the item workflow the problem occurred.
   *
   * @param {string} itemName - The name of the item.
   * @param {string} itemProcessPhase - The phase of the item workflow during which the error occurred.
   * @returns {string} A detailed debug message for logging purposes.
   */
  static formulateItemDebugMsg(itemName, itemProcessPhase) {
    let debugMsg =
      "-PROBLEM-WITH-ITEM-NAMED: " +
      itemName +
      ", AT Phase - " +
      itemProcessPhase;
    return debugMsg;
  }

  /**
   * Determines the minimum logging importance level.
   *
   * Compares the importance level passed in from a particular item event against the
   * system's fundamental importance threshold, returning the lower (i.e., more critical) value.
   *
   * @param {number} passedInImportanceLevel - The importance level for the current event.
   * @param {number} fundamentalImportanceLevel - The baseline importance threshold.
   * @returns {number} The minimum importance level to use for logging decisions.
   */
  static getMinimumImportanceLevel(
    passedInImportanceLevel,
    fundamentalImportanceLevel
  ) {
    let minimumImportanceLevel = fundamentalImportanceLevel;
    if (passedInImportanceLevel < minimumImportanceLevel) {
      minimumImportanceLevel = passedInImportanceLevel;
    }
    return minimumImportanceLevel;
  }
}
