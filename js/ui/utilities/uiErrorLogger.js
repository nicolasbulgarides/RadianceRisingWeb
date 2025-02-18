class UIErrorLogger {
  static UI_ERROR_LOGGER_OVERRIDE_ENABLED = false;
  static UI_ERROR_LOGGER_OVERRIDE_LOG_LEVEL = 0;
  static UI_ERROR_LOGGER_ENABLED = true;
  static UI_ERROR_LOGGER_COOLDOWN_OVERRIDE = false;
  static UI_ERROR_LOGGER_COOLDOWN_ENABLED = false;

  static informOfUIErrorEvent(
    msg,
    sender,
    importance,
    cooldownActive = false,
    errorCooldown = "-blank-ui-error-log-error-cooldown-"
  ) {
    let loggingAbsoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.UI_ERROR_LOGGER_OVERRIDE_ENABLED,
      this.UI_ERROR_LOGGER_ENABLED,
      importance
    );

    if (loggingAbsoluteDecision) {
      let uiErrorLogMessage =
        "UI Error Event: " + msg + " , sent from: " + sender;

      if (
        cooldownActive ||
        this.UI_ERROR_LOGGER_COOLDOWN_ENABLED ||
        this.UI_ERROR_LOGGER_COOLDOWN_OVERRIDE ||
        Config.LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE_ACTIVE
      ) {
        LoggerOmega.SmartLoggerWithCooldown(
          loggingAbsoluteDecision,
          uiErrorLogMessage,
          errorCooldown,
          sender
        );
      } else if (!cooldownActive && !this.UI_ERROR_LOGGER_COOLDOWN_ENABLED) {
        LoggerOmega.SmartLogger(
          loggingAbsoluteDecision,
          uiErrorLogMessage,
          sender
        );
      }
    }
  }

  static convertAssetFailuresToErrorMsg(assetFailures) {
    if (!failedAssets || failedAssets.length === 0) {
      return "No asset failures.";
    }
    return (
      "Failed Asset Load: " +
      failedAssets.join("... ") +
      " , sent from: " +
      sender
    );
  }
}
