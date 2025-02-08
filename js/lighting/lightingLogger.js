class LightingLogger {
  static lightingLoggingEnabled = true;
  static forcefullyOverrideLoggingConfig = false;

  constructor(lightingManager) {
    this.lightingManager = lightingManager;
  }
  deregisterLightingLogger(index, lightObject) {
    let deregisterMessage = "";
    let loggingAbsoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      forcefullyOverrideLoggingConfig,
      lightingLoggingEnabled,
      "secondary"
    );

    if (loggingAbsoluteDecision) {
      if (
        index != -1 &&
        lightObject != null &&
        lightObject instanceof LightingObject
      ) {
        deregisterMessage =
          "Light object found in array of active lights and was not null and is in fact a lighting object";
      } else if (index == -1) {
        deregisterMessage =
          "Light object not found in the array to remove from";
      } else if (lightObject == null) {
        deregisterMessage = "Light object null";
      } else if (
        lightObject != null &&
        !lightObject instanceof LightingObject
      ) {
        deregisterMessage =
          "Light object isn't a light object somehow, but isn't null";
      }

      LoggerOmega.SmartLoggerWithCooldown(
        loggingAbsoluteDecision,
        deregisterMessage,
        "LightDeregistration"
      );
    }
  }
}
