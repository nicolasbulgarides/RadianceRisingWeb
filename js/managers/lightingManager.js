// File: js/managers/LightingManager.js

/**
 * LightingManager Class
 * Manages the setup and configuration of lighting within a Babylon.js scene.
 * Supports preset lighting configurations (e.g., day, night, dusk) as well as custom configurations.
 * Also supports different color shift modes and two lighting types (directional vs positional).
 */
class LightingManager {
  /**
   * Creates an instance of LightingManager.
   * @param {BABYLON.Scene} sceneInstance - The Babylon.js scene instance where the lighting will be applied.
   * @param {string|object} [config='day'] - The lighting preset or a custom configuration object.
   */
  constructor(sceneInstance, config = "day") {
    this.scene = sceneInstance;
    this.activeLights = []; // Array to hold lights and their shift parameters
    // Default modes – these can be overridden by a config object.
    this.colorShiftMode = LightingManager.ColorShiftMode.BLUE;
    this.lightingMode = LightingManager.LightingType.DIRECTIONAL;

    // If a custom config object is provided, look for overrides.
    if (typeof config === "object") {
      if (
        config.colorShiftMode &&
        LightingManager.ColorShiftMode[config.colorShiftMode.toUpperCase()]
      ) {
        this.colorShiftMode = config.colorShiftMode;
      }
      if (
        config.lightingMode &&
        LightingManager.LightingType[config.lightingMode.toUpperCase()]
      ) {
        this.lightingMode = config.lightingMode;
      }
    }

    // Store the original config for later reference.
    this.config = config;
    this.initialize();
  }

  /**
   * Initializes the lighting based on the provided configuration.
   * If a string preset is provided, it will apply the corresponding preset lighting;
   * if an object configuration is provided, it will create custom lighting.
   */
  initialize() {
    if (typeof this.config === "string") {
      this.applyPresetLighting(this.config);
    } else if (typeof this.config === "object") {
      this.applyLightingFromConfig(this.config);
    } else {
      window.Logger.warn("LightingManager: Invalid lighting configuration.");
    }
  }

  /**
   * Applies a preset lighting configuration based on the given preset name.
   * @param {string} presetName - The name of the lighting preset ('day', 'night', 'dusk').
   */
  applyPresetLighting(presetName) {
    switch (presetName) {
      case "day":
        this.setupDayLighting();
        break;
      case "night":
        this.setupNightLighting();
        break;
      case "dusk":
        this.setupDuskLighting();
        break;
      default:
        window.Logger.warn(
          "LightingManager: Unknown lighting preset:",
          presetName
        );
        this.setupDefaultLighting();
    }
  }

  /**
   * Sets up day lighting with high intensity for a bright scene.
   * Creates four lights (either directional or positional based on this.lightingMode),
   * each with its own randomized shift parameters, and adds them to the activeLights array.
   */
  setupDayLighting() {
    // Helper to create a light with its unique shift parameters.
    const createShiftedLight = (name, vector) => {
      let light;
      // For directional mode, create a DirectionalLight; for positional, create a PointLight.
      if (this.lightingMode === LightingManager.LightingType.DIRECTIONAL) {
        light = new BABYLON.DirectionalLight(name, vector, this.scene);
      } else if (
        this.lightingMode === LightingManager.LightingType.POSITIONAL
      ) {
        // Use the provided vector to set an initial orbit position.
        const radius = 10;
        const position = new BABYLON.Vector3(
          vector.x * radius,
          vector.y * radius,
          vector.z * radius
        );
        light = new BABYLON.PointLight(name, position, this.scene);
      }

      let presetIndex = 0;
      let modularValues = this.getColorShiftPresetValuesModular(presetIndex);
      let shift = this.getColorShiftComposite(modularValues);
      // Initialize the light's diffuse color with an HSV-to-RGB conversion.
      light.diffuse = LightingManager.hsvToRgb(shift.baseHue, 1, 1);
      light.intensity = shift.diffuse;
      // Store both light and its shift parameters.
      this.activeLights.push({ light, shift });
    };

    // Create four lights with different base vectors.
    createShiftedLight("dayLight1", new BABYLON.Vector3(1, -1, 0));
    createShiftedLight("dayLight2", new BABYLON.Vector3(-1, -1, 0));
    createShiftedLight("dayLight3", new BABYLON.Vector3(1, 1, 0));
    createShiftedLight("dayLight4", new BABYLON.Vector3(-1, 1, 0));

    window.Logger.log(
      "LightingManager: Day lighting setup complete with activeLights."
    );
  }

  getColorShiftPresetValuesModular(presetIndex) {
    // baseLightIntensity
    //colorShiftIntensity
    //diffuseIntensity,
    //intensitySpeed,
    //hueSpeedBase,
    //amplitude,
    //intervalMin,
    //intervalMax

    let testValues = [];

    //if presetIndex not in the list below, it will return defaultBaseValues

    switch (presetIndex) {
      case 0:
        testValues = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        break;
      case 1:
        testValues = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        break;
      case 2:
        testValues = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        break;
      case 3:
        testValues = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        break;
    }

    let valuesPulledModular = {
      baseLightIntensity: this.getBaseLightIntensityByIndex(testValues[0]),
      baseHue: this.getBaseHue(testValues[1]),
      colorShiftIntensity: this.getColorShiftIntensityByIndex(testValues[2]),
      diffuseIntensity: this.getDiffuseIntensityByIndex(testValues[3]),
      intensitySpeed: this.getIntensitySpeedByIndex(testValues[4]),
      hueSpeed: this.getHueSpeedByIndex(testValues[5]),
      amplitude: this.getAmplitudeByIndex(testValues[6]),
      shiftInterval:
        this.getIntervalMinByIndex(testValues[7]) +
        this.getIntervalMaxByIndex(testValues[8]),
    };

    testValues = valuesPulledModular;

    const intervalMin = this.getIntervalMinByIndex(testValues[7]);
    const intervalMax = this.getIntervalMaxByIndex(testValues[8]);
    console.log("intervalMin:", intervalMin, "intervalMax:", intervalMax);
    const shiftInterval = intervalMin + Math.random() * intervalMax;
    console.log("Calculated shiftInterval:", shiftInterval);
    return this.getColorShiftComposite(valuesPulledModular);
  }
  // 1.0 to 5
  getBaseHue(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 1;
      case 1:
        return 0.75;
      case 2:
        return 0.5;
      case 3:
        return 0.25;
    }
    return 1;
  }
  // 1.0 to 5
  getBaseLightIntensityByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 5;
      case 1:
        return 3.75;
      case 2:
        return 2.0;
      case 3:
        return 1.0;
    }
    return 5;
  }
  // 1.25 to 5
  getColorShiftIntensityByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 1.25;
      case 1:
        return 2.5;
      case 2:
        return 3.75;
      case 3:
        return 5.0;
    }
  }

  // 1.25 to 5
  getDiffuseIntensityByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 1.0;
      case 1:
        return 0.75;
      case 2:
        return 0.5;
      case 3:
        return 0.25;
      case 4:
        return 0.15;
    }
    return 1;
  }

  //suggestion of 0.3 to 0.7
  getIntensitySpeedByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 0.3;
      case 1:
        return 0.45;
      case 2:
        return 0.6;
      case 3:
        return 0.7;
    }
    return 0.45;
  }

  //suggestion of 0.05 to 0.15
  getHueSpeedByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 0.05;
      case 1:
        return 0.1;
      case 2:
        return 0.15;
    }
    return 0.1;
  }

  //suggestion of 0.25 to 1
  getAmplitudeByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 0.25;
      case 1:
        return 0.5;
      case 2:
        return 0.75;
      case 3:
        return 1.0;
    }
    return 0.5;
  }
  //suggestion of
  getIntervalMinByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 4;
      case 1:
        return 6;
      case 2:
        return 8;
    }
    return 6;
  }
  //suggestion of 4  to 8
  getIntervalMaxByIndex(shiftTestIndex) {
    switch (shiftTestIndex) {
      case 0:
        return 4;
      case 1:
        return 6;
      case 2:
        return 8;
    }
    return 6;
  }

  getColorShiftComposite(modularValues) {
    // Base intensity (the average level around which we vary)
    // Randomized parameters for evolving light shifts.
    const shift = {
      baseLightIntensity: modularValues.baseLightIntensity,
      colorShiftIntensity: modularValues.colorShiftIntensity,

      diffuseIntensity: modularValues.diffuseIntensity,
      baseHue: modularValues.baseHue,
      hueSpeed: modularValues.hueSpeed + Math.random() * 0.1, // 0.05 - 0.15: hue progression speed
      amplitude: modularValues.amplitude + Math.random() * 0.5, // 0.5 - 1.0: intensity variation amplitude
      intensitySpeed: modularValues.intensitySpeed + Math.random() * 0.4, // 0.3 - 0.7: intensity oscillation speed
      phaseOffset: Math.random() * 2 * Math.PI, // phase offset for the sine wave
      lastShiftUpdate: performance.now() * 0.001, // record the current time (seconds)
      shiftInterval: modularValues.shiftInterval * Math.random(), // re-randomize every  8  - 16 seconds
      // Store the type (for use in update loop)
      lightType: this.lightingMode,
    };
    console.log(JSON.stringify(shift, null, 2)); // pretty-print with indentation

    return shift;
  }

  /**
   * Sets up night lighting with low intensity for a darker scene.
   */
  setupNightLighting() {
    const light = new BABYLON.HemisphericLight(
      "nightLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.2;
    window.Logger.log("LightingManager: Night lighting setup complete.");
  }

  /**
   * Sets up dusk lighting with moderate intensity for a dimly lit scene.
   */
  setupDuskLighting() {
    const light = new BABYLON.HemisphericLight(
      "duskLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.5;
    window.Logger.log("LightingManager: Dusk lighting setup complete.");
  }

  /**
   * Sets up default lighting with medium intensity.
   * Used if the specified preset is unknown.
   */
  setupDefaultLighting() {
    const light = new BABYLON.HemisphericLight(
      "defaultLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.8;
    window.Logger.log("LightingManager: Default lighting setup complete.");
  }

  /**
   * Applies custom lighting settings based on the configuration object.
   * Allows specific control over lighting properties such as direction and intensity.
   * @param {object} config - Custom lighting configuration with properties like `direction` and `intensity`.
   */
  applyLightingFromConfig(config) {
    const light = new BABYLON.HemisphericLight(
      "customLight",
      new BABYLON.Vector3(
        config.direction.x,
        config.direction.y,
        config.direction.z
      ),
      this.scene
    );
    light.intensity = config.intensity;
    window.Logger.log("LightingManager: Custom lighting setup complete.");
  }

  /**
   * Called on every frame to update lighting properties.
   * This method updates each active light’s hue, intensity, and (depending on its type) either its direction vector
   * or its 3D position over time for dazzling, psychedelic effects.
   */
  onFrameCall() {
    this.updateActiveLights();
  }

  /**
   * Updates active lights: adjusts color (with support for a blue preset), intensity, and light transformation
   * (directional vs. positional) over time.
   */
  updateActiveLights() {
    const currentTime = performance.now() * 0.001;
    this.activeLights.forEach(({ light, shift }, i) => {
      // --- Color shift update ---
      let newHue;
      if (this.colorShiftMode === LightingManager.ColorShiftMode.BLUE) {
        // Lock hue near blue (around 0.66) with slight variation.
        const baseBlueHue = 0.66;
        const variation = 0.05;
        newHue =
          baseBlueHue + variation * Math.sin(currentTime * shift.hueSpeed);
      } else {
        newHue = (shift.baseHue + shift.hueSpeed * currentTime) % 1;
      }
      if (light.diffuse) {
        light.diffuse = LightingManager.hsvToRgb(newHue, 1, 1);
      }

      // --- Intensity update ---
      // Use the pre-pulled modular value "baseLightIntensity" (not "intensityBase")
      // and include the phaseOffset in the sine function.
      light.intensity =
        shift.baseLightIntensity +
        shift.amplitude *
          Math.sin(currentTime * shift.intensitySpeed + shift.phaseOffset);

      // --- Lighting type update ---
      if (shift.lightType === LightingManager.LightingType.DIRECTIONAL) {
        // Update the directional light's direction vector over time.
        const angle = currentTime + i;
        light.direction = new BABYLON.Vector3(
          Math.sin(angle),
          -1,
          Math.cos(angle)
        ).normalize();
      } else if (shift.lightType === LightingManager.LightingType.POSITIONAL) {
        // Update the point light's position to orbit around a point.
        const radius = 10;
        const angle = currentTime + i;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = 5 + 2 * Math.sin(angle * 0.5);
        light.position = new BABYLON.Vector3(x, y, z);
      }
    });
  }

  /**
   * Switches the lighting mode for active lights.
   * This method can be used to dynamically toggle between "directional" and "positional" modes.
   * @param {string} newMode - The new lighting mode ('directional' or 'positional').
   */
  switchLightingMode(newMode) {
    if (
      newMode === LightingManager.LightingType.DIRECTIONAL ||
      newMode === LightingManager.LightingType.POSITIONAL
    ) {
      this.lightingMode = newMode;
      // Update each active light’s type.
      this.activeLights.forEach((item) => {
        item.shift.lightType = newMode;
      });
      window.Logger.log("LightingManager: Switched lighting mode to", newMode);
    } else {
      window.Logger.warn("LightingManager: Unknown lighting mode:", newMode);
    }
  }

  /**
   * Converts HSV color values to a BABYLON.Color3 RGB object.
   * @param {number} h - Hue value between 0 and 1.
   * @param {number} s - Saturation value between 0 and 1.
   * @param {number} v - Value (brightness) between 0 and 1.
   * @returns {BABYLON.Color3} The corresponding RGB color.
   */
  static hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return new BABYLON.Color3(r, g, b);
  }
}

/**
 * Enum for color shift modes.
 * NORMAL: full hue cycling.
 * BLUE: hue is locked near blue with subtle variation.
 */
LightingManager.ColorShiftMode = {
  NORMAL: "normal",
  BLUE: "blue",
};

/**
 * Enum for lighting types.
 * DIRECTIONAL: lights update their direction vector over time.
 * POSITIONAL: lights update their 3D position over time.
 */
LightingManager.LightingType = {
  DIRECTIONAL: "directional",
  POSITIONAL: "positional",
};
