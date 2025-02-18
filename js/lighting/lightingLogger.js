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
   * Logs details of a failed lighting template
   *
   * @param {string} nickname - The preset identifier.
   */
  static informOfFailedLightingTemplateBag(nickname) {
    let loggingAbsoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.forcefullyOverrideLoggingConfig,
      this.lightingLoggingEnabled,
      "secondary"
    );

    if (loggingAbsoluteDecision) {
      let msg = "Failed template bag:" + nickname + " null!";

      LoggerOmega.SmartLogger(
        true,
        msg,
        " Description of template bag failure"
      );
    }
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
      LoggerOmega.SmartLogger(
        true,
        "I was called: ",
        " Description of Lighting Preset Values"
      );
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
        deregisterMessage = "Light object found and is a valid LightingObject.";
      } else if (index == -1) {
        deregisterMessage =
          "Light object not found in the array to remove from.";
      } else if (lightObject == null) {
        deregisterMessage = "Light object is null.";
      } else if (
        lightObject != null &&
        !(lightObject instanceof LightingObject)
      ) {
        deregisterMessage = "Light object is not a LightingObject.";
      }

      LoggerOmega.SmartLoggerWithCooldown(
        loggingAbsoluteDecision,
        deregisterMessage,
        "LightDeregistration"
      );
    }
  }

  /**
   * Assess and logs all original preset values from a light object's color shift profile.
   *
   * @param {LightingObject} lightObject - The light object containing color shift profile data.
   */
  static assessOriginalLightValues(lightObject) {
    if (!lightObject || !lightObject.colorShiftProfile) {
      LoggerOmega.SmartLogger(
        true,
        "Invalid light object or missing color shift profile",
        "LightingLogger"
      );
      return;
    }

    const profile = lightObject.colorShiftProfile;

    // Extract and safely parse numerical configuration values.
    const baseIntensity = Number(profile.baseLightIntensity) || 0;
    const amplitude = Number(profile.baseLightIntensityAmplitude) || 0;
    const intensitySpeed = Number(profile.baseLightIntensitySpeed) || 0;
    const intensityPhase = Number(profile.lightIntensityPhaseRatio) || 0;

    const baseHue = Number(profile.baseHue) || 0;
    const hueVariation = Number(profile.hueVariation) || 0;
    const hueSpeed = Number(profile.hueShiftSpeed) || 0;
    const huePhase = Number(profile.colorShiftPhaseRatio) || 0;

    // Compose a detailed log message encompassing all original preset values.
    const logMessage =
      `Original preset values for ${lightObject.lightNickname}: ` +
      `baseIntensity=${baseIntensity}, amplitude=${amplitude}, ` +
      `intensitySpeed=${intensitySpeed}, intensityPhase=${intensityPhase}, ` +
      `baseHue=${baseHue}, hueVariation=${hueVariation}, ` +
      `hueSpeed=${hueSpeed}, huePhase=${huePhase}`;
  }
}
