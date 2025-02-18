class NetworkingLogger {
  static NETWORK_LOGGER_OVERRIDE_ENABLED = false;
  static NETWORK_LOGGER_OVERRIDE_LOG_LEVEL = 0;
  static NETWORK_LOGGER_ENABLED = true;
  static NETWORK_LOGGER_COOLDOWN_OVERRIDE = false;
  static NETWORK_LOGGER_COOLDOWN_ENABLED = false;

  static informOfNetworkEvent(
    msg,
    sender,
    importance,
    cooldownActive = false,
    errorCooldown = "-blank-network-log-error-cooldown-"
  ) {
    let loggingAbsoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.NETWORK_LOGGER_OVERRIDE_ENABLED,
      this.NETWORK_LOGGER_ENABLED,
      importance
    );

    if (loggingAbsoluteDecision) {
      let networkLogMessage =
        "Network event: " + msg + " , sent from: " + sender;

      if (
        cooldownActive ||
        this.NETWORK_LOGGER_COOLDOWN_ENABLED ||
        this.NETWORK_LOGGER_COOLDOWN_OVERRIDE ||
        Config.LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE_ACTIVE
      ) {
        LoggerOmega.SmartLoggerWithCooldown(
          loggingAbsoluteDecision,
          networkLogMessage,
          errorCooldown,
          sender
        );
      } else if (!cooldownActive && !this.NETWORK_LOGGER_COOLDOWN_ENABLED) {
        LoggerOmega.SmartLogger(
          loggingAbsoluteDecision,
          networkLogMessage,
          sender
        );
      }
    }
  }

  static logErrorShortcut(errorMessage, sender) {
    this.informOfNetworkEvent(
      errorMessage,
      "NetworkingLogger" + sender,
      0,
      false,
      "-blank-network-log-error-cooldown-"
    );
  }
}
