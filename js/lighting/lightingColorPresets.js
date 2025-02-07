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
    this.valuablePlayerLightPresets = {};

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
      this.valuablePlayerLightPresets[wordForWhite] = genericValues;
      this.valuableEnvironmentLightDirectionLightPresets[wordForWhite] =
        genericValues;
      this.valuableEnvironmentLightPositionLightPreset[wordForWhite] =
        genericValues;
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
        return new LightingColorShiftProfile(samplePreset);
      } else {
        this.storeGenericWhiteValuesInGenericSlots();
        return new LightingColorShiftProfile(generic);
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
        return new LightingColorShiftProfile(genericValues);
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

  getPlayerLightColorShiftByPreset(lightColorPreset) {
    if (this.valuablePlayerLightPresets[lightColorPreset]) {
      return new LightingColorShiftProfile(
        this.valuablePlayerLightPresets[lightColorPreset]
      );
    } else {
      if (this.valuablePlayerLightPresets["default"]) {
        return new LightingColorShiftProfile(
          this.valuablePlayerLightPresets["default"]
        );
      } else {
        this.storeGenericWhiteValuesInGenericSlots();
        return new LightingColorShiftProfile(
          this.valuablePlayerLightPresets["default"]
        );
      }
    }
  }
}
