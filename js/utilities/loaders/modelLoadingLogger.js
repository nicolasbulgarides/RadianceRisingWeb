class ModelLoadingLogger {
  /**
   *
   * @param {string} msg
   * @param {PositionedObject} object
   * Intelligently determines an object's importance and calculates the logging level of whether or not
   * to display the objects position
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
      desciptionOfObjectStatus += "-positioned-object-null";
      informOfError = true;
    } else if (
      positionedObject !== null &&
      positionedObject["position"] == null
    ) {
      desciptionOfObjectStatus +=
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
