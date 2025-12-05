/**
 * LightingColorPresets Class
 *
 * Manages a collection of preset lighting color profiles for both environment
 * and player lights within the Babylon.js scene. Integrates with a
 * LightingPropertyCalculator to dynamically retrieve and store the lighting
 * preset values. Presets include properties for:
 *   - light intensity and amplitude
 *   - hue and hue variation
 *   - speed of light intensity change and hue shift
 *   - looping and auto-reverse behaviors
 *
 * Supports auto-fallback to default generic (white) presets when a specific
 * preset cannot be found.
 */
class LightingColorPresets {
  constructor(lightingPropertyCalculator) {
    this.lightingPropertyCalculator = lightingPropertyCalculator;
    // Register this preset storage with the property calculator for retrieval.
    this.lightingPropertyCalculator.registerLightingPresetStorage(this);
    this.storePresetsComposite();
  }

  /**
   * Initializes preset storage objects and populates them with preset configurations.
   * Sets up containers for the following:
   *  - Environment directional light presets
   *  - Environment positional light presets
   *  - Player directional light presets
   *  - Player positional light presets
   */
  storePresetsComposite() {
    this.valuableEnvironmentLightDirectionLightPresets = {};
    this.valuableEnvironmentLightPositionLightPresets = {};
    this.valuableEnvironmentLightDirectionMotionProfilePresets = {};
    this.valuableEnvironmentLightPositionMotionProfilePresets = {};
    this.valuablePlayerLightDirectionLightPresets = {};
    this.valuablePlayerLightPositionLightPresets = {};

    this.storeGenericWhiteValuesInGenericSlots();
    this.storeNicksValuableEnvironmentLightDirectionLightPresets();
  }

  /**
   * Returns a list of generic keywords representing "white" or placeholder presets.
   * @returns {Array<string>} List of generic preset keywords.
   */
  getGenericWhiteAndPlaceholders() {
    let whiteTitles = [
      "null",
      "blank",
      "empty",
      "placeholder",
      "default",
      "defaultwhite",
      "basic",
      "basicwhite",
      "white",
      "standardwhite",
      "generic",
      "genericwhite",
    ];
    return whiteTitles;
  }

  /**
   * Fills generic (white) preset slots with baseline preset values.
   * These generic values are used as a fallback.
   */
  storeGenericWhiteValuesInGenericSlots() {
    let genericValues = this.getGenericLightColorProfilePreset();
    let whiteTitles = this.getGenericWhiteAndPlaceholders();

    whiteTitles.forEach((wordForWhite) => {
      if (!this.valuablePlayerLightPositionLightPresets[wordForWhite]) {
        this.valuablePlayerLightPositionLightPresets[wordForWhite] =
          genericValues;
      }
      if (!this.valuablePlayerLightDirectionLightPresets[wordForWhite]) {
        this.valuablePlayerLightDirectionLightPresets[wordForWhite] =
          genericValues;
      }
      // (NOTE: There is a duplicate check here for player light position; verify as needed.)
      if (!this.valuablePlayerLightPositionLightPresets[wordForWhite]) {
        this.valuablePlayerLightPositionLightPresets[wordForWhite] =
          genericValues;
      }
      if (!this.valuableEnvironmentLightDirectionLightPresets[wordForWhite]) {
        this.valuableEnvironmentLightDirectionLightPresets[wordForWhite] =
          genericValues;
      }
      if (!this.valuableEnvironmentLightPositionLightPresets[wordForWhite]) {
        this.valuableEnvironmentLightPositionLightPresets[wordForWhite] =
          genericValues;
      }
    });
  }

  /**
   * Retrieves the lighting color shift profile for an environment directional light,
   * looking up the preset by name and falling back to the "default" if needed.
   *
   * @param {string} presetName - The requested preset identifier.
   * @returns {LightingColorShiftProfile} Color shift profile instance.
   */
  getEnvironmentLightDirectionLightColorProfileByPresetName(presetName) {
    if (this.valuableEnvironmentLightDirectionLightPresets[presetName]) {
      let obtainedValues =
        this.valuableEnvironmentLightDirectionLightPresets[presetName];
      let colorShiftProfile = new LightingColorShiftProfile(obtainedValues);
      //console.log(`[LIGHTING] Found preset "${presetName}" with baseHue: ${obtainedValues.baseHue}, hueVariation: ${obtainedValues.hueVariation}`);
      return colorShiftProfile;
    } else {
      //console.warn(`[LIGHTING] Preset "${presetName}" not found, falling back to default`);
      if (this.valuableEnvironmentLightDirectionLightPresets["default"]) {
        return new LightingColorShiftProfile(
          this.valuableEnvironmentLightDirectionLightPresets["default"]
        );
      } else {
        this.storeGenericWhiteValuesInGenericSlots();
        return new LightingColorShiftProfile(
          this.valuableEnvironmentLightDirectionLightPresets["default"]
        );
      }
    }
  }

  /**
   * Retrieves the lighting color shift profile for an environment positional light,
   * looking up the preset by name and falling back to "default" if necessary.
   *
   * @param {string} presetName - The requested preset identifier.
   * @returns {LightingColorShiftProfile} Color shift profile instance.
   */
  getEnvironmentLightPositionLightColorProfileByPresetName(presetName) {
    if (this.valuableEnvironmentLightPositionLightPresets[presetName]) {
      let obtainedValues =
        this.valuableEnvironmentLightPositionLightPresets[presetName];
      let colorShiftProfile = new LightingColorShiftProfile(obtainedValues);
      return colorShiftProfile;
    } else {
      if (this.valuableEnvironmentLightPositionLightPresets["default"]) {
        let genericValues =
          this.valuableEnvironmentLightPositionLightPresets["default"];
        return new LightingColorShiftProfile(genericValues);
      } else {
        this.storeGenericWhiteValuesInGenericSlots();
        return new LightingColorShiftProfile(
          this.valuableEnvironmentLightPositionLightPresets["default"]
        );
      }
    }
  }


  /**
   * Returns a generic preset object representing the "default" light color profile.
   * @returns {Object} Generic preset values.
   */
  getGenericLightColorProfilePreset() {
    let generic = {
      presetName: "default",
      baseLightIntensity: 0,
      baseLightIntensityAmplitude: 0,
      baseHue: 0,
      hueVariation: 0,
      baseLightIntensitySpeed: 0,
      hueShiftSpeed: 0,
      loops: false,
      autoReverse: false,
      lightIntensityPhaseRatio: 0,
      colorShiftPhaseRatio: 0,
    };
    return generic;
  }



  storeNicksValuableEnvironmentLightDirectionLightPresets() {
    this.valuableEnvironmentLightDirectionLightPresets.mysticbluegradient = {
      presetName: "mysticbluegradient",
      baseLightIntensity: 10,
      baseLightIntensityAmplitude: 3,
      baseHue: 11,
      hueVariation: 1,
      baseLightIntensitySpeed: 30,
      hueShiftSpeed: 14,
      loops: true,
      autoReverse: true,
      lightIntensityPhaseRatio: 0,
      colorShiftPhaseRatio: 0,
    };

    // Blue to green gradient animation preset
    // baseHue index 10 = 0.5 (cyan midpoint between blue 0.67 and green 0.33)
    // hueVariation index 4 = 0.20 (covers blue to green range)
    // hueShiftSpeed index 18 = 0.90 (fast animation speed for visible gradient)
    this.valuableEnvironmentLightDirectionLightPresets.blueToGreenGradient = {
      presetName: "blueToGreenGradient",
      baseLightIntensity: 3,
      baseLightIntensityAmplitude: 2,
      baseHue: 11,
      hueVariation: 0.5,
      baseLightIntensitySpeed: 15,
      hueShiftSpeed: 30,
      loops: true,
      autoReverse: true,
      lightIntensityPhaseRatio: 0,
      colorShiftPhaseRatio: 0,
    };
  }



  /**
   * Returns the base intensity for an environment positional light given a preset.
   *
   * @param {string} preset - Preset identifier.
   * @returns {number} Base intensity.
   */
  getEnvironmentLightPositionLightBaseIntensityByPreset(preset) {
    let intensity = 100;
    switch (preset) {
      case "example":
        intensity = 100;
    }
    return intensity;
  }

  /**
   * Retrieves the player light intensity by its preset key.
   *
   * @param {string} lightIntensityPreset - Preset identifier.
   * @returns {number} Light intensity value.
   */
  getPlayerLightIntensityByPreset(lightIntensityPreset) {
    let intensity = 5;
    switch (lightIntensityPreset) {
      case "example": {
        intensity = 5;
        break;
      }
    }
    return intensity;
  }

  /**
   * Retrieves the base color for a player's light based on a preset.
   *
   * @param {string} lightColorPreset - Preset key.
   * @returns {BABYLON.Color3} Base color.
   */
  getPlayerLightBaseColorByPreset(lightColorPreset) {
    let defaultColor = BABYLON.Color3(1, 1, 1);
    switch (lightColorPreset) {
      case "default":
        defaultColor = BABYLON.Color3(1, 1, 1);
        break;
    }
    return defaultColor;
  }

  /**
   * Returns the directional light color shift profile for a player's light.
   *
   * @param {string} lightColorPreset - Preset key.
   * @returns {LightingColorShiftProfile} Player light color shift profile.
   */
  getPlayerLightDirectionLightColorShiftByPreset(lightColorPreset) {
    if (this.valuablePlayerLightDirectionLightPresets[lightColorPreset]) {
      return new LightingColorShiftProfile(
        this.valuablePlayerLightDirectionLightPresets[lightColorPreset]
      );
    } else {
      if (this.valuablePlayerLightDirectionLightPresets["default"]) {
        return new LightingColorShiftProfile(
          this.valuablePlayerLightDirectionLightPresets["default"]
        );
      } else {
        this.storeGenericWhiteValuesInGenericSlots();
        return new LightingColorShiftProfile(
          this.valuablePlayerLightDirectionLightPresets["default"]
        );
      }
    }
  }

  /**
   * Returns the positional light color shift profile for a player's light.
   *
   * @param {string} lightColorPreset - Preset key.
   * @returns {LightingColorShiftProfile} Player light color shift profile.
   */
  getPlayerLightPositionLightColorShiftByPreset(lightColorPreset) {
    if (this.valuablePlayerLightPositionLightPresets[lightColorPreset]) {
      return new LightingColorShiftProfile(
        this.valuablePlayerLightPositionLightPresets[lightColorPreset]
      );
    } else {
      if (this.valuablePlayerLightPositionLightPresets["default"]) {
        return new LightingColorShiftProfile(
          this.valuablePlayerLightPositionLightPresets["default"]
        );
      } else {
        this.storeGenericWhiteValuesInGenericSlots();
        return new LightingColorShiftProfile(
          this.valuablePlayerLightPositionLightPresets["default"]
        );
      }
    }
  }
}
