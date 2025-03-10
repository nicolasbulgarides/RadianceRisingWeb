class GameplayLogger {
  static LOG_ALL_GAMEPLAY_EVENTS_OVERRIDE = false;
  static LOG_ALL_GAMEPLAY_EVENTS = true;

  static lazyLog(logMessage, sender, importance) {
    let finalDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.LOG_ALL_GAMEPLAY_EVENTS_OVERRIDE,
      this.LOG_ALL_GAMEPLAY_EVENTS,
      importance
    );

    if (finalDecision) {
      LoggerOmega.SmartLogger(finalDecision, logMessage, sender);
    }
  }

  static gameplayLoggerCentralized(
    specificLogBooleanToCheck,
    logMessage,
    sender,
    errorType,
    importance,
    hasCooldown
  ) {
    let finalDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.LOG_ALL_GAMEPLAY_EVENTS_OVERRIDE,
      specificLogBooleanToCheck,
      importance
    );

    if (finalDecision) {
      if (hasCooldown) {
        LoggerOmega.SmartLoggerWithCooldown(
          finalDecision,
          logMessage,
          errorType,
          sender
        );
      } else {
        LoggerOmega.SmartLogger(finalDecision, logMessage, sender);
      }
    }
  }
}
