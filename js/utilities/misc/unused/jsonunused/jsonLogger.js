class JSONLogger {
  static JSON_LOGGING_OVERRIDE = false;
  static JSON_LOGGING_ENABLED = true;
  static JSON_LOGGING_IMPORTANCE_LEVEL = 0;
  static JSON_LOGGING_COOLDOWN_ENABLED = false;

  static logJsonValidationSkipped(
    jsonFieldValue,
    jsonValidationCategory,
    specificJsonImportanceLevel,
    jsonErrorCooldownId
  ) {
    let importanceLevel = JSONLogger.getMinimumImportanceLevel(
      specificJsonImportanceLevel,
      JSONLogger.JSON_LOGGING_IMPORTANCE_LEVEL
    );
    let finalizedDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.JSON_LOGGING_OVERRIDE,
      this.JSON_LOGGING_ENABLED,
      importanceLevel
    );

    let debugMsg = JSONLogger.formulateJsonDebugMsg(
      jsonFieldValue,
      jsonValidationCategory
    );

    if (!finalizedDecision) {
      return;
    } else {
      if (this.JSON_LOGGING_COOLDOWN_ENABLED) {
        LoggerOmega.SmartLoggerWithCooldown(
          finalizedDecision,
          debugMsg,
          jsonErrorCooldownId
        );
      } else {
        LoggerOmega.SmartLogger(finalizedDecision, debugMsg);
      }
    }
  }

  static formulateJsonDebugMsg(jsonFieldValue, validationCategory) {
    let debugMsg =
      "-PROBLEM-JSON-FIELD: " +
      jsonFieldValue +
      " , -VALIDATION-CATEGORY: " +
      validationCategory +
      " -";
    return debugMsg;
  }
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
