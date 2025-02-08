/**
 * LightingLogger Class
 *
 * Offers logging utilities tailored for the lighting system. It outputs descriptive
 * messages about preset values and deregistration events, based on globally managed logging flags.
 */
class LightingLogger {
  static lightingLoggingEnabled = true;
  static forcefullyOverrideLoggingConfig = false;

  constructor(lightingManager) {
    this.lightingManager = lightingManager;
  }

  /**
   * Logs details of a lighting preset.
   *
   * @param {string} nickname - The preset identifier.
   * @param {Object} presetValues - The preset values.
   */
  static describeLightingPresetValues(nickname, presetValues) {
    let loggingAbsoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.forcefullyOverrideLoggingConfig,
      this.lightingLoggingEnabled,
      "secondary"
    );

    if (loggingAbsoluteDecision) {
      let msg = "";

      if (presetValues == null) {
        msg = "Preset: " + nickname + " null!";
      } else {
        msg = "-display-of-light-preset-values-" + nickname;
      }
      LoggerOmega.SmartLogger(true, "I was called: ", "A1");
    }
  }

  /**
   * Logs a message when a lighting object is deregistered.
   *
   * @param {number} index - Index in the active lights array.
   * @param {LightingObject} lightObject - The object being deregistered.
   */
  static deregisterLightingLogger(index, lightObject) {
    let deregisterMessage = "";
    let loggingAbsoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.forcefullyOverrideLoggingConfig,
      this.lightingLoggingEnabled,
      "secondary"
    );

    if (loggingAbsoluteDecision) {
      if (
        index != -1 &&
        lightObject != null &&
        lightObject instanceof LightingObject
      ) {
        deregisterMessage =
          "Light object found and is a valid LightingObject.";
      } else if (index == -1) {
        deregisterMessage =
          "Light object not found in the array to remove from.";
      } else if (lightObject == null) {
        deregisterMessage = "Light object is null.";
      } else if (
        lightObject != null &&
        !(lightObject instanceof LightingObject)
      ) {
        deregisterMessage =
          "Light object is not a LightingObject.";
      }

      LoggerOmega.SmartLoggerWithCooldown(
        loggingAbsoluteDecision,
        deregisterMessage,
        "LightDeregistration"
      );
    }
  }
}
