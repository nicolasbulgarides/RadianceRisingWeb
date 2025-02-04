/**
 * LightingManager Class
 * Manages the setup and configuration of Light within a Babylon.js scene.
 * Supports preset Light configurations (e.g., day, night, dusk) as well as custom configurations.
 * Also supports different color shift modes and two Light types (directional vs positional).
 */
class LightingManager {
  /**
   * Creates an instance of LightManager.
   * @param {BABYLON.Scene} sceneInstance - The Babylon.js scene instance where the Light will be applied.
   */
  constructor(sceneInstance) {
    this.scene = sceneInstance;
    this.activeLights = []; // Array to hold lights and their shift parameters
    this.doColorModeOverride = true;
    this.playerModel = null;
    this.lightFrameIndex = 0;
    this.initialLightDirection = null;
    this.currentLightDirection = null;
    this.initialLightPreset = null;
    this.currentLightPreset = null;
    this.valuableLightPresets = {};

    // Store the original config for later reference.

    let experimentIndex = this.manageExperimentConfigurationPanel();
    this.initialize(experimentIndex);
  }
  storeNicksValuableBasicLightPresets() {
    this.valuableLightPresets.mysticbluegradient = {
      presetName: "mysticbluegradient",
      baseLightIntensity: 10,
      baseLightIntensityAmplitude: 3,
      baseHue: 11,
      hueVariation: 1,
      baseLightIntensitySpeed: 15,
      hueShiftSpeed: 14,
    };
  }
  //this little section lets you make tweaks very quickly so as to do various expeirments, this is the config panel
  //There are default values (above), but the override system lets you experiment / change the default values before
  //they are actually used, to then discover valuable Light combinations

  // The code has been cleaned up and adjusted so that almost ALL time will be spent changing the two following specific methods,\
  //manageExperimentConfigurationPanel() and adjustLightExperimentSettings()
  //the former changes what KINDS of light to test, and the second changes specific light properties
  //both are important
  //If you create a preset that you are happy with, you will then "store it" by adding it to the storeFrancescasValuableLightPresets() method
  //Because you put your Light presets in a different method, you wont accidentally delete my presets
  //please remember that 0 is the default / baseline recommended value - and then moving from 0 - > the highest index value of a setting
  //increases a setting in exact proportion to the index value multiplied by a specific amount
  manageExperimentConfigurationPanel() {
    let runningATest = false; //change me between true and false when game is loading the default light vs specific experiments
    let experimentIndex = -1;

    this.currentEnvironmentLightArchetype =
      Config.DEFAULT_ENVIRONMENT_LIGHT_ARCHETYPE;
    this.currentEnvironmentLightContext = Config.DEFAULT_ENVIRONMENT_CONTEXT;

    this.currentEnvironmentLightPreset =
      Config.DEFAULT_ENVIRONMENT_LIGHT_PRESET;

    this.currentEnvironmentLightVectorPreset = null;

    this.storeNicksValuableBasicLightPresets();

    //<============================
    if (runningATest) {
      let currentLightArchetypeOverride = "directional";
      let currentEnvironmentLightContextOverride = "standardlevel0";
      let currentLightPresetOverride = "mysticbluegradient";
      let currentDirectionalLightVectorOverride = "experiment";
      let experimentIndexOverride = experimentIndex;

      this.currentEnvironmentLightArchetype = currentLightArchetypeOverride;
      this.currentEnvironmentLightContext =
        currentEnvironmentLightContextOverride;
      this.currentEnvironmentLightPreset = currentLightPresetOverride;
      this.currentEnvironmentLightVectorPreset =
        currentDirectionalLightVectorOverride;
      this.currentEnvironmentLightTestIndex = experimentIndexOverride;
      experimentIndex = experimentIndexOverride;
    }

    return experimentIndex;
  }

  initialize(experimentIndex) {
    //<============================end of config panel

    //leave this alone - this is the switch system
    //initial lights are stored so that lights can be reset to default conditions on desire
    this.initialEnvironmentLightArchetype =
      this.currentEnvironmentLightArchetype;

    console.log(
      "Initial: X" +
        this.initialEnvironmentLightArchetype +
        ", current Y: " +
        this.currentEnvironmentLightArchetype
    );
    this.initialEnvironmentLightContext = this.currentEnvironmentLightContext;
    this.initialEnvironmentLightPreset = this.currentEnvironmentLightPreset;
    this.initialEnvironmentLightVectorPreset =
      this.currentEnvironmentLightVectorPreset;

    console.log(
      "Presets: initial " +
        this.initialEnvironmentLightPreset +
        ", current " +
        this.currentEnvironmentLightPreset
    );

    if (experimentIndex >= 0) {
      this.setEnvironmentLightExperiment(
        this.initialEnvironmentLightArchetype,
        this.initialEnvironmentLightContext,
        this.initialEnvironmentLightVectorPreset,
        experimentIndex
      );
    } else {
      console.log("Loading environment master!");
      this.setEnvironmentLightMaster(
        this.initialEnvironmentLightArchetype,
        this.initialEnvironmentLightContext,
        this.initialEnvironmentLightPreset,
        this.initialEnvironmentLightVectorPreset
      );
    }
  }
  adjustLightExperimentSettings() {
    let experimentSettings = {
      currentLightIndexId: 42, //you will change this between different indexes to compare lights
      currentLightExperimentPresetName: "mysticbluegradient", // you will decide a experiment name per experiment, e.g sunrise1, sunrise2,
      //and eventually you "settle" on a set of values, and that becomes the finalized name for a preset.
      //Aka if you do sunrise1... up to sunrise 10, and liek sunrise7 , you might call the final variation sunrise or lovelysunrise (get rid of the experiment index)
      baseLightIntensity: 0, //the index valeu of 0 corresponds to a intensity value 5.0. Lower light values are too dark.
      //baseLightIntensity is one of the values for which you might decide to add a drastically different value, because it is very sensitive
      baseLightIntensityAmplitude: 0,
      baseLightIntensitySpeed: 0, //
      //very
      baseHue: 0,
      hueVariation: 0,
      hueShiftSpeed: 0,
    };
    return experimentSettings;
  }

  // if you make a successful preset, store it in the switch statement by adding a complete case
  //    case "greendream": {
  // presetPulled = this.valuableLightPresets.greendream
  //  break;
  // }

  getLightPresetIndexesVerifiedByName(presetName) {
    let lightPresetIndexArray = [0, 0, 0, 0, 0, 0];

    let baseLightIntensity = 0;
    let baseLightIntensityAmplitude = 0;
    let baseHue = 0;
    let hueVariation = 0;
    let baseLightIntensitySpeed = 0;
    let hueShiftSpeed = 0;

    let presetPulled = null;

    switch (presetName) {
      case "mysticbluegradient": {
        presetPulled = this.valuableLightPresets.mysticbluegradient;
        console.log("Pulling mystic");
        break;
      }
    }

    if (presetPulled == null) {
      lightPresetIndexArray = [
        baseLightIntensity,
        baseLightIntensityAmplitude,
        baseHue,
        hueVariation,
        baseLightIntensitySpeed,
        hueShiftSpeed,
      ];
    } else if (presetPulled != null) {
      lightPresetIndexArray = [
        presetPulled.baseLightIntensity,
        presetPulled.baseLightIntensityAmplitude,
        presetPulled.baseHue,
        presetPulled.hueVariation,
        presetPulled.baseLightIntensitySpeed,
        presetPulled.hueShiftSpeed,
      ];
    }

    return lightPresetIndexArray;
  }

  //this is the master method that can be called with any of a complex set of distinct categories of multiple values which
  //can, due to their hyper modularity, create a HUGE variety of Light effects
  //EnvironmentArchetype is directional vs positional
  //EnvironmentContext is the KIND of game level that environmental lights are being tested / used with (currently just standardlevel0)
  //EnvironmentLight preset is specific combinations of light traits to load (currently mysticbluegradient)
  //Environment Light vector is the specific direction / positioning of the lights, which is distinct but related to the preset itself
  //currently pure directionals

  setEnvironmentLightMaster(
    environmentLightArchetype,
    environmentLightContext,
    environmentLightPreset,
    environmentLightVectorPreset
  ) {
    let lightSettings = null;
    console.log("Running settings here: " + environmentLightArchetype);

    let lightVectors = null;
    if (environmentLightArchetype === "directional") {
      lightSettings = this.getDirectionalEnvironmentLightPresetSettings(
        environmentLightPreset,
        environmentLightContext
      );
      lightVectors = this.getEnvironmentDirectionalLightPresetVectors(
        environmentLightVectorPreset
      );

      console.log(
        "Pretty-printed object: 44",
        JSON.stringify(lightSettings, null, 2)
      );

      this.createFourDirectionalLights(lightSettings, lightVectors);
    }
  }

  setEnvironmentLightExperiment(
    environmentLightArchetype,
    environmentLightContext,
    environmentLightVectorPreset,
    experimentIndex
  ) {
    let lightSettings = null;
    let lightVectors = null;
    if (environmentLightArchetype === "directional") {
      lightSettings = this.getDirectionalEnvironmentLightExperimentSettings(
        experimentIndex,
        environmentLightContext
      );
      lightVectors = this.getEnvironmentDirectionalLightPresetVectors(
        environmentLightVectorPreset
      );
      console.log(
        "Pretty-printed object: 45",
        JSON.stringify(lightSettings, null, 2)
      );

      this.createFourDirectionalLights(lightSettings, lightVectors);
    }
  }

  //EnvironmentArchetype is directional vs positional
  //EnvironmentContext is the KIND of game level that environmental lights are being tested / used with (currently just standardlevel0)
  //EnvironmentLight preset is specific combinations of light traits to load (currently mysticbluegradient)
  //Environment Light vector is the specific direction / positioning of the lights, which is distinct but related to the preset itself
  //currently pure directionals

  /**
   * Switches the Light mode for active lights.
   * This method can be used to dynamically toggle between "directional" and "positional" modes.
   * @param {string} newMode - The new Light mode ('directional' or 'positional').
   */
  switchLightModeAndPreset(changeMode, newMode, changePreset, newPreset) {}

  getDirectionalEnvironmentLightExperimentSettings(
    experimentIndex,
    environmentLightContext
  ) {
    //0 baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed

    let experimentValueIndexes = [0, 0, 0, 0, 0, 0];
    console.log(
      "Experiment Index " +
        experimentIndex +
        " , Light context: " +
        environmentLightContext
    );

    switch (experimentIndex) {
      case 0:
        experimentValueIndexes = [0, 3, 0, 0, 0, 0];
        break;
    }

    let experimentValueBag = this.getValuesBag(
      experimentValueIndexes,
      environmentLightContext
    );

    return experimentValueBag;
  }

  getValuesBag(indexes, environmentLightContext) {
    let experimentValueBag = {
      light1: this.convertLightIndexesToRawValues(
        indexes,
        environmentLightContext
      ),
      light2: this.convertLightIndexesToRawValues(
        indexes,
        environmentLightContext
      ),
      light3: this.convertLightIndexesToRawValues(
        indexes,
        environmentLightContext
      ),
      light4: this.convertLightIndexesToRawValues(
        indexes,
        environmentLightContext
      ),
    };
  }

  getBaseLightIntensityByIndex(shiftIndex) {
    if (shiftIndex >= 0 && shiftIndex <= 19) {
      return shiftIndex * 5;
    }

    if (shiftIndex >= 100) {
      return shiftIndex / 100;
    }

    return 5;
  }
  getDirectionalEnvironmentLightPresetSettings(
    directionalEnvironmentPreset,
    environmentLightContext
  ) {
    //0 baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed

    let presetIndexes = this.getLightPresetIndexesVerifiedByName(
      directionalEnvironmentPreset
    );

    let lightPresetValues = {
      baseLightIntensity: this.getBaseLightIntensityByIndex(presetIndexes[0]),
      baseLightIntensityAmplitude: this.getBaseLightIntensityAmplitudeByIndex(
        presetIndexes[1]
      ),
      baseHue: this.getBaseHue(presetIndexes[2]),
      hueVariation: this.getHueShiftVariationByIndex(presetIndexes[3]),
      baseLightIntensitySpeed: this.getBaseLightIntensitySpeedByIndex(
        presetIndexes[4]
      ),
      hueShiftSpeed: this.getHueShiftSpeedByIndex(presetIndexes[5]),
    };

    if (environmentLightContext != "") {
      lightPresetValues.baseLightIntensity =
        this.getBaseLightIntensityByContext(environmentLightContext);
    }
    // Option 2: Print a pretty-printed JSON string
    console.log(
      "Light preset values directional environment, pre adjustment for variance:",
      JSON.stringify(lightPresetValues, null, 2)
    );

    return lightPresetValues;
  }

  storeFrancescasValuableBasicLightPresets() {
    this.valuableLightPresets.example = {
      example: "blank",
    };
  }

  createDirectionalLight(shift, directionalLightVector, lightIndex) {
    console.log("Pretty-printed object: BB", JSON.stringify(shift, null, 2));

    let light = new BABYLON.DirectionalLight(
      "D-Light: " + lightIndex,
      directionalLightVector,
      this.scene
    );

    light.intensity = shift.baseLightIntensity;
    // console.log("Intensity set: " + light.intensity);

    light.diffuse = this.hsvToRgb(shift.baseHue, 1, 1);
    // console.log("Diffuse set: " + light.diffuse);

    this.activeLights.push({ light, shift });
  }

  createPositionalLight(shift, positionVector, orbitalShiftVector, lightIndex) {
    let light = new BABYLON.PointLight(
      "P-Light: " + lightIndex,
      positionVector,
      this.scene
    );

    light.intensity = shift.baseLightIntensity;
    light.diffuse = this.hsvToRgb(shift.baseHue, 1, 1);

    this.activeLights.push({ light, shift });
  }

  //Determines the RANGE of colors - say Blue to Green, note color hue currently only goes in one direction
  //going to add a bi-directional light system, so lights can reverse, but also can go from different lights to other lights.
  //You are most likely to keep this value between 0 and 5 - 0 being a change of 0.05 (small shift in hue) to 5 (shift of 0.3) - a highly
  //dramatic shift in hue
  // 0 and default value are 0.05 meaning SUBTLE shifts within the target color
  getHueShiftVariation(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      let hueV = 0.05 + shiftTestIndex * 0.05;
      console.log(hueV + " hue v");
      return hueV;
    }
  }

  getEnvironmentDirectionalLightPresetVectors(directionalPreset) {
    let lightVectors = {
      lightRightDown: new BABYLON.Vector3(1, -1, 0),
      lightLeftDown: new BABYLON.Vector3(-1, -1, 0),
      lightRightUp: new BABYLON.Vector3(1, 1, 0),
      lightLeftUp: new BABYLON.Vector3(-1, 1, 0),
    };

    switch (directionalPreset) {
      case "experiment": {
        lightVectors = {
          lightRightDown: new BABYLON.Vector3(1, -1, 0),
          lightLeftDown: new BABYLON.Vector3(-1, -1, 0),
          lightRightUp: new BABYLON.Vector3(1, 1, 0),
          lightLeftUp: new BABYLON.Vector3(-1, 1, 0),
        };
      }
    }
    return lightVectors;
  }

  assignDefaultPlayerModelLight(player, LightPreset) {
    this.positionedObjectForPlayer = player
      .getPlayerPositionAndModelManager()
      .getPlayerModelPositionedObject();

    let playerModel = player
      .getPlayerPositionAndModelManager()
      .getPlayerModelDirectly();

    this.excludePlayerModelFromLight(playerModel);
    this.setPlayerChasingLight(LightPreset);
  }

  getPlayerLightPresetValues(LightPreset) {
    let lightOffsetDefault = new BABYLON.Vector3(0, 0, 0);
    let lightIntensityDefault = 1;
    let lightColorDefault = new BABYLON.Color3(1, 1, 1);

    if (LightPreset != "") {
      switch (LightPreset) {
        case "playerpreset0":
          lightOffsetDefault = new BABYLON.Vector3(0, 5, 0);
      }
    }

    let playerLightPreset = {
      lightOffset: lightOffsetDefault,
      lightIntensity: lightIntensityDefault,
      lightColor: lightColorDefault,
    };

    return playerLightPreset;
  }

  setPlayerChasingLight(LightPreset) {
    let playerLightPresetValues = this.getPlayerLightPresetValues(LightPreset);
    this.playerLightBasePosition =
      this.positionedObjectForPlayer.getCompositePositionBaseline();
    this.playerLightBaseOffset = playerLightPresetValues.lightOffset;

    let x = this.playerLightBasePosition.x + this.playerLightBaseOffset.x;
    let y = this.playerLightBasePosition.y + this.playerLightBaseOffset.y;
    let z = this.playerLightBasePosition.z + this.playerLightBaseOffset.z;

    let lightStartPosition = new BABYLON.Vector3(x, y, z);

    let newLight = new BABYLON.PointLight(
      "chasingLight",
      lightStartPosition,
      this.scene
    );

    this.deleteOldPlayerChasingLight();

    this.chasingLight = newLight;
    this.chasingLight.diffuse = playerLightPresetValues.lightColor;
    this.chasingLight.intensity = playerLightPresetValues.lightIntensity;
  }
  excludePlayerModelFromLight(playerModel) {
    this.activeLights.forEach((light) => {
      // If the light already has an excludedMeshes array, add the player if it's not already added.
      // Otherwise, initialize the array.
      if (!light.excludedMeshes) {
        light.excludedMeshes = [];
      }
      if (light.excludedMeshes.indexOf(playerModel) === -1) {
        light.excludedMeshes.push(playerModel);
      }
    });
  }

  // 1.0 to 5
  getBaseHue(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return 0.05 + shiftTestIndex * 0.05;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 0;
  }

  /**
   * Warning - light intensity is extremely sensitive in every way to distance from light to model, light category, light angle
   * and hue shifts. Different types of lights can be pitch black at a perfect light for other light types.
   * Default value (index 0) is 5 which was the best value in our 4 directional light setup. 
   * Index 1 = 3.75, index 2 = 2.0, index 3 = 1.0, 
  /**
   *  * @param {number} shiftTestIndex - An index representing the desired light intensity
 *   @returns {number} The light intensity itself
 *  *   @returns {string} A named light intensity preset for convenience. Considering that different scene structures / distances
 * from lights to a model could TOTALLY change light needs, having named presets is a useful shorthand instead of having to pass in calculations
 * For the basic puzzle layout / structure during initial testing, with directional lights, 5 was useful, so I called that
 * "standardlevel-directional" with a return value of 5.
 * thus forming a sort of central location to put specifically tested / useful light intensities

 *  * Suggested range: Extremely sensitive / use case specific. 
  Also, if you want a highly custom value, you can pass in a value >= 100 to get value / 100 seconds without adjusting the switch
  Aka 10,000 / 100 becomes 100. 
 *
   */
  getBaseLightIntensity(shiftTestIndex, namedContextOverride) {
    if (namedContextOverride != "") {
      return this.getBaseLightIntensityByContext(namedContextOverride);
    }
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

    if (shiftTestIndex > 100) {
      return shiftTestIndex / 100;
    }
    return 5;
  }

  /**
   *
   *  * @param {string} namedPreset - A string name of a specific Light context that was useful enough to save for easy access
   *   @returns {number} The light intensity itself} namedPreset
   */
  getBaseLightIntensityByContext(namedContext) {
    switch (namedContext) {
      case "standardlevel0":
        return 5;
    }
    return 5;
  }

  /**
   *  * @param {number} shiftTestIndex - An index representing the desired hue shift intensity
 *   @returns {number} The hue variation range.  Note you will very often want index 0 (0.05 or 5% gradient) or index 1 (0.10 or 10% gradient)
 * Indexes 0 to 3 are index * 0.05, index 4 is actually an ultra-small gradient (0.025%), index 5 even smaller, 0.01%, and 6 - 0.0025%
 * 
 * Suggested range: indexes of  0 to 3 for most cases, but higher values exist for extreme shifts
  Also, if you want a highly custom value, you can pass in a value >= 100 to get value / 100 seconds without adjusting the switch
  Aka 10,000 / 100 becomes 100. 
 *
   */

  getHueShiftVariationByIndex(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return 0.05 + 0.05 * shiftTestIndex;
    } else {
      return 0;
    }
  }

  /**
 * Returns the intensity speed multiplier based on a given index.
  0.2 + Index * 0.2 so from value of 0.2 at index 0 to to value of 5 at index 19 (so up to * 5 speed, 
  or if >= 100, you can do hyper-precise by doing desired value as index which will automatically be divided by 100 
  AKA if you wish to make the light fluctuation 100x as fast, you could put in 10,000
   Most of time I imagine you would give the value between 0 and 19, however
  *
  * @param {number} shiftTestIndex - An index representing the desired intensity speed.
  * @returns {number} The intensity speed multiplier.
  */
  getBaseLightIntensitySpeedByIndex(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return 0.2 + shiftTestIndex * 0.2;
    }

    if (shiftTestIndex > 100) {
      return shiftTestIndex / 100;
    }
  }
  // Default return value for undefined indices

  /**
 * Returns the   hue shift  speed multiplier based on a given index.
  0.2 + Index * 0.2 so from value of 0.2 at index 0 to to value of 5 at index 19 (so up to * 5 speed, 
  or if >= 100, you can do hyper-precise by doing desired value as index which will automatically be divided by 100 
  AKA if you wish to make the light fluctuation 100x as fast, you could put in 10,000
   Most of time I imagine you would give the value between 0 and 19, however
  *
  * @param {number} shiftTestIndex - An index representing the desired intensity speed.
  * @returns {number} The intensity speed multiplier.
  */
  getHueShiftSpeedByIndex(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return 0.004 + shiftTestIndex * 0.005;
    } else {
      return 0.005;
    }
  }

  /**
   * Returns a light intensity shift amplitude based on a given index.
   *
    Ranges from 0 to 19 for 0.05 to 1.0 amplitude in intensity, higher values can be desiredRatio / 100
   *
   * Note: All light values have a built-in "intelligent" random variation applied to them,
   * which creates a smooth gradient of light. For example, a base light of 0.65 might
   * naturally vary between approximately 0.60 and 0.70, producing a beautiful gradient effect.
   *
   * @param {number} shiftTestIndex - An index representing the desired light intensity shift.
   * @returns {number} The light intensity shift amplitude.
   */
  getBaseLightIntensityAmplitudeByIndex(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return 0.05 + shiftTestIndex * 0.05;
    }
    // For indices 100 and above, the shift amplitude is defined as index/100.
    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }
    // Optionally, you can add a default return value here for unhandled cases.
    return 0.05;
  }

  /**
   * Gets the minimum duration for a shift interval as used to allow for lights to re-calculate / regenerate over time
   * Note that the value is +4 per index increment, until 20 at which point its Index / 100 as seconds.
   *
   * 0 to 19 (4 to 84 range of seconds of variation is almost certainly broad enough for all purposes)
   *
   * If you wish for a hyper-precise number of seconds of max interval, you can use >= 100 for a formulaic determination that
   * ranges from 1 second to several billion / integer overflow limit. For this case, by dividing by 100, you turn the
   * absolute shiftTestIndex into a decimal / ratio >= 1.0 without having to add cases.
   *
   * So index values of 0 to 6 are the "typical" values(1 second at 0, 2 to 12 seconds at index 1 to 6)
   *  but if you wished to do lets say 100 seconds, you could pass in 10,000
   * as 10,000 / 100 = 100.
   */
  getIntervalMinByIndex(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return shiftTestIndex * 4;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 4;
  }

  /**
   * @param {number} shiftTestIndex - The base intensity for Light.

  /**
   * Gets the minimum duration for a shift interval as used to allow for lights to re-calculate / regenerate over time
   * Note that the value is +4 per index increment, until 20 at which point its Index / 100 as seconds.
   *
   * 0 to 19 (4 to 84 range of seconds of variation is almost certainly broad enough for all purposes)
   *
   * If you wish for a hyper-precise number of seconds of max interval, you can use >= 100 for a formulaic determination that
   * ranges from 1 second to several billion / integer overflow limit. For this case, by dividing by 100, you turn the
   * absolute shiftTestIndex into a decimal / ratio >= 1.0 without having to add cases.
   *
   * So index values of 0 to 6 are the "typical" values(1 second at 0, 2 to 12 seconds at index 1 to 6)
   *  but if you wished to do lets say 100 seconds, you could pass in 10,000
   * as 10,000 / 100 = 100. */
  getIntervalMaxByIndex(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 19) {
      return shiftTestIndex * 4;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 4;
  }

  /**
   * Generates a composite object of randomized color shift parameters.
   *
   * This function takes in a set of base values (`modularValues`) and applies
   * subtle random variations to them. These variations simulate natural shifts in
   * light intensity and hue over time. The variations are controlled by defining
   * lower and upper bounds (variance) that determine how much the base values can deviate.
   *
   * @param {Object} modularValues - An object containing base values for color properties.
   * @param {number} modularValues.baseLightIntensity - The base intensity for Light.
   * @param {number} modularValues.baseLightIntensityAmplitude - The amplitude of intensity variation.
   * @param {number} modularValues.baseHue - The base hue value.
   * @param {number} modularValues.hueVariation - The base amount of hue variation.
   *  @param {number} modularValues.baseLightIntensitySpeed - The speed at which light intensity changes.

   * @param {number} modularValues.hueShiftSpeed - The base speed at which the hue shifts.
   * @returns {Object} An object containing the computed color shift parameters.
   */
  getDirectionalEnvironmentValuesAdjusted(modularValues) {
    // Define variance boundaries for subtle random adjustments.
    // Adjust these values to make the resulting offsets more or less pronounced.
    const lowerVariance = -0.2; // Lower bound for random offset (negative variation)
    const upperVariance = 0.2; // Upper bound for random offset (positive variation)

    // Compute the composite shift object with various randomized color parameters.
    const shift = {
      // Adjust the base light intensity by applying a random multiplier.
      // This introduces a natural variation around the base intensity.
      baseLightIntensity:
        modularValues.baseLightIntensity *
        this.getMicroVariance(lowerVariance, upperVariance),
      // Adjust the amplitude of the intensity variation with a random multiplier.
      baseLightIntensityAmplitude:
        modularValues.baseLightIntensityAmplitude *
        this.getMicroVariance(lowerVariance, upperVariance), // 0.5 - 1.0: intensity variation amplitude

      // Adjust the base hue with an even smaller variance.
      // This significantly reduces the randomness to keep the hue within a desired range,
      // ensuring that the colors remain cohesive while still having a natural diffusion.
      baseHue:
        modularValues.baseHue *
        this.getMicroVariance(lowerVariance * 0.01, upperVariance * 0.01), // the base hue variance is significantly reduced even further
      // so that the colors stay within a specified range but still flow naturally / diffuse

      // Adjust the hue variation.
      // The variance is further reduced (multiplied by 0.02) to ensure changes are subtle,
      // maintaining a natural flow of color without abrupt shifts.
      hueVariation:
        modularValues.hueVariation *
        this.getMicroVariance(lowerVariance * 0.02, upperVariance * 0.02), // further reduces the variance to add hue variation but still natural flow
      // Adjust the light intensity speed by applying a random multiplier.
      baseLightIntensitySpeed:
        modularValues.baseLightIntensitySpeed *
        this.getIntensitySpeedMultiplier(0.5),
      // Modify the hue shift speed using a random multiplier.
      // The getIntensitySpeedMultiplier(0.5) ensures the result is within a controlled range.
      hueShiftSpeed:
        modularValues.hueShiftSpeed * this.getIntensitySpeedMultiplier(0.5), // 0.05 - 0.15: hue progression speed

      //<================================= AUTO MAGIC VARIANCE FOR CYLICAL TIMING, NO NEED TO TOUCH IN MOST CASES, NOT WORTH PARAMATERIZING =====>
      // Compute a phase offset for the sine wave that drives cyclic variations.
      // This random value (scaled by 2π) ensures the starting point of the sine wave varies,
      // with additional variance applied to further randomize the phase.
      phaseOffset: Math.random() * 2 * Math.PI * this.getMicroVariance(0.33, 1), // phase offset for the sine wave

      // Generate timing offsets to desynchronize hue and intensity variations.
      // This can create a more dynamic and natural animation effect.
      timingOffsetHue: this.getTimingOffset(0.25, 0.9),
      timingOffsetIntensity: this.getTimingOffset(0.35, 0.84),
      //<================================= AUTO MAGIC VARIANCE FOR CYLICAL TIMING, NO NEED TO TOUCH IN MOST CASES, NOT WORTH PARAMATERIZING =====>
    };

    // Log the resulting shift object in a readable, indented JSON format for debugging purposes.
    console.log(JSON.stringify(shift, null, 2));

    // Return the composite object containing all computed randomized parameters.
    return shift;
  }

  /**
   * Returns a random multiplier for intensity speed.
   * The multiplier will be between the provided minimum (plug-in value) and 1.0.
   *
   * For example, if you pass in 0.7, this function will return a value between 0.7 (70% of base speed)
   * and 1.0 (100% of base speed), ensuring that the intensity speed is never faster than the base speed,
   * but can be up to 30% slower. If you want to allow speeds that are 50% of base, you’d call this function
   * with a value of 0.5.
   *
   * @param {number} minMultiplier - The lower bound multiplier (should be between 0.5 and 1.0).
   * @returns {number} A random multiplier between minMultiplier and 1.0.
   */
  getIntensitySpeedMultiplier(minMultiplier) {
    // Generate a random value between minMultiplier and 1.0.
    return Math.random() * (1.0 - minMultiplier) + minMultiplier;
  }
  /**
   * Returns a multiplier that randomly varies within the given percentage bounds.
   *
   * For example, if you want a variation of ±10%,
   * call getMicroVariance(-0.1, 0.1). A base value multiplied by this multiplier
   * will then vary between 90% and 110% of its original value.
   *
   * @param {number} lowerPercentBound - The lower bound as a decimal (e.g., -0.1 for -10%).
   * @param {number} upperPercentBound - The upper bound as a decimal (e.g., 0.1 for +10%).
   * @returns {number} A multiplier between (1 + lowerPercentBound) and (1 + upperPercentBound).
   */
  getMicroVariance(lowerPercentBound, upperPercentBound) {
    // Step 1: Calculate the range of possible variations.
    // For example, if lowerPercentBound = -0.1 and upperPercentBound = 0.1, then:
    // range = 0.1 - (-0.1) = 0.2
    const range = upperPercentBound - lowerPercentBound;

    // Step 2: Generate a random value between 0 and the range.
    // Math.random() returns a value between 0 (inclusive) and 1 (exclusive),
    // so multiplying it by the range gives a number between 0 and the range.
    const randomInRange = Math.random() * range;

    // Step 3: Offset the random value by the lower bound to shift the range.
    // This gives a value between lowerPercentBound and upperPercentBound.
    const randomVariation = randomInRange + lowerPercentBound;

    // Step 4: Add 1 to the random variation so that the multiplier is centered around 1.
    // For example, with a variation of -0.1 to 0.1, the multiplier becomes:
    // 1 - 0.1 = 0.9 (minimum) and 1 + 0.1 = 1.1 (maximum).
    const multiplier = 1 + randomVariation;

    // Return the calculated multiplier.
    return multiplier;
  }

  /**
   * Updates the intensity of a light based on a sinusoidal function, using time and phase-based variations.
   * The intensity oscillates over time, with adjustments for amplitude, speed, and phase offset.
   *
   * @param {number} currentTime - The current time in seconds, used to drive the intensity change over time.
   * @param {object} light - The light object to update. Its `intensity` property will be modified.
   * @param {object} shift - An object containing the parameters used to calculate the light intensity:
   *   @property {number} baseLightIntensity - The base intensity of the light before any variation is applied.
   *   @property {number} baseLightIntensityAmplitude - The amount by which the intensity varies (the peak deviation from the base intensity).
   *   @property {number} baseLightIntensitySpeed - The speed at which the intensity oscillates over time.
   *   @property {number} phaseOffset - An offset added to the angle of the sine function, which controls the starting point of the oscillation.
   *   @property {number} timingOffsetIntensity - A timing adjustment applied to shift the intensity update over time.
   */
  updateLightIntensity(currentTime, light, shift) {
    // --- Intensity update ---
    // Use the pre-pulled modular value "baseLightIntensity" (not "intensityBase")
    // and include the phaseOffset in the sine function.
    light.intensity =
      shift.baseLightIntensity +
      shift.baseLightIntensityAmplitude *
        Math.sin(
          currentTime * shift.baseLightIntensitySpeed +
            shift.phaseOffset +
            shift.timingOffsetIntensity
        );
  }

  /**
   * Updates the hue of a light based on the current time, its base hue, and variations.
   * This method applies a sinusoidal variation to the hue, allowing for dynamic color changes over time.
   *
   * @param {number} currentTime - The current time in seconds used for calculating the hue variation.
   * @param {object} light - The light object to update. This should have a `diffuse` property that will be modified.
   * @param {object} shift - An object containing properties for the light's hue:
   *   @property {number} baseHue - The base hue to start from.
   *   @property {number} hueVariation - The amount of variation to apply to the hue.
   *   @property {number} hueShiftSpeed - The speed at which the hue changes over time.
   *   @property {number} timingOffsetHue - An offset value used to adjust the timing of the hue change.
   */
  updateLightHue(currentTime, light, shift) {
    if (shift.baseHue >= 0) {
      // console.log("sin of hue: " + Math.sin(currentTime * shift.hueShiftSpeed));
      let newHue =
        shift.baseHue +
        shift.hueVariation * Math.sin(currentTime * shift.hueShiftSpeed);

      light.diffuse = this.hsvToRgb(newHue, 1, 1);
    } else {
      console.log(shift.baseHue + " base hue less than 0");
    }
  }

  /**
   * Iterate through all active lights and updates hue, intensity and position based off of the elapsed time
   * */
  updateActiveLights(currentTime) {
    this.activeLights.forEach(({ light, shift }, i) => {
      this.updateLightHue(currentTime, light, shift);
      //this.updateLightIntensity(currentTime, light, shift);
      //this.updateLightPositionByPath(light, shift);
    });
  }

  /**
   * Updates the orbital motion for a given light.
   *
   * @param {number} currentTime - The current time in seconds.
   * @param {object} light - The light object to update. Should include properties lightType and lightPath:
   * if lightType = "positional" and lightPath = orbital, then and only then will this method process
   *   orbitSpeed, orbitPhase, orbitCenter, and orbitRadius.
   */

  updateOrbitalMotion(currentTime, light) {
    // For each light, update its position using an independent orbit.
    if (light.lightType === "positional") {
      if (light.lightPath == "orbital") {
        // Calculate new positions along each axis independently.
        // For example, you can use sine and cosine on different axes to get a non-circular, 3D orbit.

        let possibleReversal = this.getLightReversal(light);

        let adjustedTime = currentTime * possibleReversal;
        let orbitSpeed = orbitSpeed;

        const angleX = adjustedTime * light.orbitSpeed.x + light.orbitPhase.x;
        const x = light.orbitCenter.x + light.orbitRadius.x * Math.cos(angleX);

        const angleY = adjustedTime * light.orbitSpeed.y + light.orbitPhase.y;
        const y = light.orbitCenter.y + light.orbitRadius.y * Math.sin(angleY);

        const angleZ = adjustedTime * light.orbitSpeed.z + light.orbitPhase.z;
        const z = light.orbitCenter.z + light.orbitRadius.z * Math.cos(angleZ);
        light.position = new BABYLON.Vector3(x, y, z);
      }
    }
  }

  /**
   *  returns 1.0 or -1 to correspond to forwards or backwards in time
   * @param {object} light - The light object to update. Should include properties:
   *
   */

  getLightReversal(light) {
    if (light.reversing) {
      return -1.0;
    } else {
      return 1.0;
    }
  }

  /**
   * Called on every frame to update Light properties intensity, hue, position)
   * Elapsed time changes Light precisely based off clock, but a frame index is also kept to decide changes in Light
   * at specific index frames, as opposed to at specific points in elapsed chronological time
   * Frame index is incremented once per frame so that lights in multi-light systems can be regenerated at specific intervals
   * Although these intervals for regeneration can also have variance. This is all part of the intended effect of hyper-gradient Light
   * that adds a pleasing, surreal range in Light suitable for magical environments.
   * A fixed Light, such as a lightbulb, or a torch, may simply have a smaller range (or values of 0) in variation of intensity, hue and position
   * This method updates each active light’s hue, intensity, and (depending on its type) either its direction vector
   * or its 3D position over time for dazzling, psychedelic effects.
   */
  onFrameCall() {
    let elapsedTime = this.updateLightTimeAndFrame();

    this.updateActiveLights(elapsedTime);
    this.updatePlayerLight(elapsedTime);
  }

  /**
   *used to adjust light values over time by small increments to create complex Light aesthetics
   *through the strategic application of multiple different overlapping lights which blend together dynamically
   *capped at 155.52 million so that the lightFrameIndex never exceeds integer maximum values.
   *At 155.52 million, it resets to 0. At 60 frames per second this corresponds to 27,777 minutes of continuous gameplay
   *aka 30.0 non-stop days of gameplay. This will PROBABLY never occur, unless someone changes the code for incrementing light index,
   *and thus this is just ultra-cautious future proofed Light management.
   *Why bother with this? If there is a persistent game world, such as a virtual reality game server featuring a game that takes place
   *on an alien planet, its not inconveivable that there is a day / night cycle.
   *By default we are set to 60 minute hours and 24 hours per day with 30 day monthly cycles. On a complex planet
   *where day / nights have different values, then perhaps a server would have to track a value and force periodic resets with
   *special code to prevent integer overflow
   *Theoretically, this could also be relevant in the context of a live display of a game world / 3d environment in a museum or exhibit!
   */
  updateLightTimeAndFrame() {
    this.lightFrameIndex++;
    if (this.lightFrameIndex >= 155520000) {
      this.lightFrameIndex = 0;
    }
    const elapsedTime = performance.now() * 0.001;
    return elapsedTime;
  }

  /**
    Ensures that the player-chasing light is positioned based off of the pre-determined / configured offset for the chasing light
   */

  updatePlayerLight() {
    if (
      this.playerModel != null &&
      this.chasingLight != null &&
      this.positionedObjectForPlayer != null
    ) {
      let copyMe =
        this.positionedObjectForPlayer.getCompositePositionBaseline();

      let positionVector = new BABYLON.Vector3(copyMe.x, copyMe.y, copyMe.z);
      this.chasingLight.position = positionVector;
    }
  }
  /**
   * Returns a random timing offset that is between minfraction and maxFraction of a full cycle (2π radians).
   *
   * @returns {number} A random offset in radians.
   *    Used to create an offset between 0 and 360 so that Light that naturally
   *  varies between a specific range in a cycle (although those cycles can be made to refresh / change / dynamically regenerate)
   * have a variance between each individual light for a preset, thus allowing for much smoother Light mixing in multiple Light setups!
   * Suggested value for min of 0.2 and max of 0.5 to 0.7 for surreal Light gradients
   */

  getTimingOffset(minFraction, maxFraction) {
    const randomFraction =
      Math.random() * (maxFraction - minFraction) + minFraction;
    // Multiply by 2π to convert the fraction to a radian offset.
    return randomFraction * (2 * Math.PI);
  }
  /**
   * Leave me the fuck alone. This is a foundational algorithim for mathematically describing Light.
   * Converts HSV color values to a BABYLON.Color3 RGB object.
   * @param {number} h - Hue value between 0 and 1.
   * @param {number} s - Saturation value between 0 and 1.
   * @param {number} v - Value (brightness) between 0 and 1.
   * @returns {BABYLON.Color3} The corresponding RGB color.
   */
  hsvToRgb(h, s, v) {
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

  deleteOldPlayerChasingLight() {
    if (this.chasingLight != null && this.scene != null) {
      console.log("Lights deleted!");
      this.chasingLight.dispose();
      const index = this.scene.lights.indexOf(this.chasingLight);
      if (index > -1) {
        this.scene.lights.splice(index, 1);
      }
    }
  }

  convertLightIndexesToRawValues(valueIndexes, environmentLightContext) {
    let values = {
      baseLightIntensity: this.getBaseLightIntensityByIndex(valueIndexes[0]),
      baseLightIntensityAmplitude: this.getBaseLightIntensityAmplitudeByIndex(
        valueIndexes[1]
      ),
      baseHue: this.getBaseHue(valueIndexes[2]),
      hueVariation: this.getHueShiftVariationByIndex(valueIndexes[3]),
      baseLightIntensitySpeed: this.getBaseLightIntensitySpeedByIndex(
        valueIndexes[4]
      ),
      hueShiftSpeed: this.getHueShiftSpeedByIndex(valueIndexes[5]),
    };

    console.log(hueVariation + " hue v here");
    let adjustedValues = this.getDirectionalEnvironmentValuesAdjusted(values);

    // Option 2: Print a pretty-printed JSON string
    console.log(
      "Adjusted values light index converted to raw",
      JSON.stringify(adjustedValues, null, 2)
    );

    if (environmentLightContext != "") {
      adjustedValues.baseLightIntensity = this.getBaseLightIntensityByContext(
        environmentLightContext
      );
    }

    return adjustedValues;
  }
  createFourDirectionalLights(lightSettings, lightVectors) {
    console.log("Light settings ZZ:", JSON.stringify(lightSettings, null, 2));

    this.createDirectionalLight(lightSettings, lightVectors.lightLeftDown, 1);
    this.createDirectionalLight(lightSettings, lightVectors.lightLeftUp, 2);
    this.createDirectionalLight(lightSettings, lightVectors.lightRightDown, 3);
    this.createDirectionalLight(lightSettings, lightVectors.lightRightUp, 4);
  }
}
