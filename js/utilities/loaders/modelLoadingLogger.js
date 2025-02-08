/**
 * ModelLoadingLogger provides logging functionality specifically for model loading operations.
 * It integrates with LoggerOmega to output detailed status messages about PositionedObject instances.
 */
class ModelLoadingLogger {
  /**
   * Logs details and status information about a PositionedObject.
   * @param {string} positionedObjectMsg - Descriptive message for the PositionedObject.
   * @param {string} loggingMsg - Additional logging message.
   * @param {boolean} loggingEnabled - Flag indicating whether logging is enabled.
   * @param {boolean} doesLoggingOverride - Flag indicating whether to override default logging settings.
   * @param {number} loggingImportance - The importance level for logging.
   * @param {PositionedObject} positionedObject - The object being described.
   * @param {boolean} adjustImportance - Flag to adjust the importance level if needed.
   */
  static describePositionedObject(
    positionedObjectMsg = "blank-positioned-object-msg",
    loggingMsg = "blank-logging-msg-positioned-object",
    loggingEnabled = true,
    doesLoggingOverride = false,
    loggingImportance = 3,
    positionedObject,
    adjustImportance = false
  ) {
    let descriptionOfObjectStatus = "";
    let informOfError = false;
    if (
      positionedObject != null &&
      positionedObject instanceof PositionedObject &&
      positionedObject.position != null &&
      positionedObject.modelId != null &&
      positionedObject.modelId != ""
    ) {
      let loggingImportanceLowest =
        ModelLoadingLogger.getPositionedObjectImportance(
          positionedObject,
          loggingMsg,
          doesLoggingOverride,
          loggingImportance,
          adjustImportance
        );
      let loggingDecision = LoggerOmega.GetFinalizedLoggingDecision(
        doesLoggingOverride,
        loggingEnabled,
        loggingImportanceLowest
      );
      let positionCheckedMsg =
        "MSG: " +
        positionedObjectMsg +
        ", model: " +
        positionedObject.modelId +
        " , Vector: X: " +
        positionedObject.position.x +
        " , y: " +
        positionedObject.position.y +
        " , Z: " +
        positionedObject.position.z;
      LoggerOmega.SmartLoggerWithCooldown(
        loggingDecision,
        positionCheckedMsg,
        "ModelLoadError"
      );
      return;
    } else if (positionedObject == null) {
      descriptionOfObjectStatus += "-positioned-object-null";
      informOfError = true;
    } else if (
      positionedObject !== null &&
      positionedObject["position"] == null
    ) {
      descriptionOfObjectStatus +=
        "-positioned-object-not-null-but-position-null";
      informOfErrorStatus = true;
    }
    if (!informOfError) {
      descriptionOfObjectStatus = "-no-positioned-object-status-error-found-";
    } else if (informOfError) {
      descriptionOfObjectStatus = "-positioned-object-status-error-found-";
    }
    let compositeErrorMsg =
      "Positioned object msg: " +
      positionedObjectMsg +
      " , logging msg: " +
      loggingMsg +
      ", determined status: " +
      descriptionOfObjectStatus;
    let loggingImportanceLowest =
      ModelLoadingLogger.getPositionedObjectImportance(
        positionedObject,
        loggingMsg,
        doesLoggingOverride,
        loggingImportance,
        adjustImportance
      );
    if (
      typeof loggingImportanceLowest === "number" &&
      loggingImportanceLowest > loggingImportance
    ) {
      loggingImportanceLowest = loggingImportance;
    }
    let finalizedDecision = ModelLoadingLogger.GetFinalizedLoggingDecision(
      doesLoggingOverride,
      loggingEnabled,
      loggingImportanceLowest
    );
    LoggerOmega.SmartLoggerWithCooldown(
      finalizedDecision,
      compositeErrorMsg,
      "ModelLoadError"
    );
  }

  /**
   * Determines the logging importance for a PositionedObject.
   * @param {PositionedObject} positionedObject - The object to evaluate.
   * @param {string} loggingMsg - Message used during evaluation.
   * @param {boolean} doesLoggingOverride - Whether to override default logging settings.
   * @param {boolean} loggingEnabled - Whether logging is enabled.
   * @param {number} loggingImportance - Default logging importance level.
   * @param {boolean} adjustImportance - Whether to adjust the object's importance value.
   * @returns {number} - The determined logging importance level.
   */
  static getPositionedObjectImportance(
    positionedObject,
    loggingMsg,
    doesLoggingOverride,
    loggingEnabled,
    loggingImportance,
    adjustImportance
  ) {
    let loggingImportanceLowest = LoggerOmega.getMostSevereImportance(
      positionedObject,
      loggingMsg,
      doesLoggingOverride,
      loggingEnabled,
      loggingImportance,
      adjustImportance
    );
    return loggingImportanceLowest;
  }
}
