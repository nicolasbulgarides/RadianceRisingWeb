class LightingColorPresets {
  constructor(lightingPropertyCalculator) {
    this.lightingPropertyCalculator = lightingPropertyCalculator;
    this.lightingPropertyCalculator.registerLightingPresetStorage(this);
    this.storePresetsComposite();
  }
  //generic method that automagically stores specific named presets
  storePresetsComposite() {
    this.valuableEnvironmentLightDirectionLightPresets = {};
    this.valuableEnvironmentLightPositionLightPresets = {};
    this.valuableEnvironmentLightDirectionMotionProfilePresets = {};
    this.valuableEnvironmentLightPositionMotionProfilePresets = {};
    this.valuablePlayerLightDirectionLightPresets = {};
    this.valuablePlayerLightPositionLightPresets = {};

    this.storeGenericWhiteValuesInGenericSlots();
    this.storeNicksValuableEnvironmentLightDirectionLightPresets();
    this.storeNicksValuableEnvironmentLightPositionLightPresets();

    this.storeFrancescasValuableEnvironmentLightDirectionLightPresets();
    this.storeFrancescasValuableEnvironmentLightPositionLightPresets();

    this.storeNicksValuablePlayerLightPresets();
    this.storeFrancescasValuablePlayerLightPresets();
  }

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
  getEnvironmentLightDirectionLightColorProfileByPresetName(presetName) {
    if (this.valuableEnvironmentLightDirectionLightPresets[presetName]) {
      let obtainedValues =
        this.valuableEnvironmentLightDirectionLightPresets[presetName];
      let colorShiftProfile = new LightingColorShiftProfile(obtainedValues);
      return colorShiftProfile;
    } else {
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

  //<================================================================Player light presets / storage of values
  storeNicksValuablePlayerLightPresets() {}

  storeFrancescasValuablePlayerLightPresets() {}

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
  //<================================================================End of Player light presets / storage of values

  storeFrancescasValuableEnvironmentLightDirectionLightPresets() {
    this.valuableEnvironmentLightDirectionLightPresets.example = {
      presetName: "example",
      baseLightIntensity: 0,
      baseLightIntensityAmplitude: 0,
      baseHue: 0,
      hueVariation: 0,
      baseLightIntensitySpeed: 0,
      hueShiftSpeed: 0,
      loops: true,
      autoReverse: true,
      lightIntensityPhaseRatio: 0,
      colorShiftPhaseRatio: 0,
    };
  }

  storeNicksValuableEnvironmentLightDirectionLightPresets() {
    this.valuableEnvironmentLightDirectionLightPresets.mysticbluegradient = {
      presetName: "mysticbluegradient",
      baseLightIntensity: 10,
      baseLightIntensityAmplitude: 3,
      baseHue: 11,
      hueVariation: 1,
      baseLightIntensitySpeed: 15,
      hueShiftSpeed: 14,
      loops: true,
      autoReverse: true,
      lightIntensityPhaseRatio: 0,
      colorShiftPhaseRatio: 0,
    };
  }

  //<================================================================Environment position ight presets / storage of values

  storeNicksValuableEnvironmentLightPositionLightPresets() {}
  storeFrancescasValuableEnvironmentLightPositionLightPresets() {}

  getEnvironmentLightPositionLightBaseIntensityByPreset(preset) {
    let intensity = 100;
    switch (preset) {
      case "example":
        intensity = 100;
    }

    return intensity;
  }

  //<======================================End of presets for positional lights

  //<========================Presets for player lighting (offset, color, intensity)

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
  getPlayerLightBaseColorByPreset(lightColorPreset) {
    let defaultColor = BABYLON.Color3(1, 1, 1);
    switch (lightColorPreset) {
      case "default":
        defaultColor = BABYLON.Color3(1, 1, 1);
        break;
    }
    return defaultColor;
  }

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
