/**
 * LightingPropertyCalculator Class
 *
 * Provides utility methods to calculate and adjust lighting properties
 * based on index values and apply slight randomized variances. Functions include:
 * - Converting index data into raw preset values.
 * - Converting HSV values to RGB.
 * - Generating phase offsets for cyclic light behavior.
 */
class LightingPropertyCalculator {
  constructor() { }
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
  //<===============================Utility methods for generating auto-magically specific values for specific properties
  /**
   * For index <= 0, returns 5,
   * For index value 1 to 99 light intensity = 5 + (shiftIndex - 1) * 5 for a maximum light of 500
   * if you wish to do more precise lighting outside of the range of 5 to 500, do indxed >= 100, where
   * base light = shiftIndex / 100, such that a base light of 1000 would be shiftIndex 100,000
   * index / 100 = a precise light setting, AKA index 100000 => 100K / 100 -> light of 1000
   */
  getBaseLightIntensityByIndex(shiftIndex) {
    if (shiftIndex >= 0 && shiftIndex < 99) {
      return 5 + shiftIndex * 5;
    } else if (shiftIndex >= 100) {
      return shiftIndex / 100;
    }
    return 5;
  }
  /**
   * 
   //Determines the RANGE of colors - say Blue to Green, note color hue currently only goes in one direction
  //going to add a bi-directional light system, so lights can reverse, but also can go from different lights to other lights.
  //You are most likely to keep this value between 0 and 5 - 0 being a change of 0.05 (small shift in hue) to 5 (shift of 0.25), a dramatic shift

  More precise values can be made by passing in a shift test index >= 100 to get shiftTestIndex / 100 as an absolute value for variation range

    defaults to 0 if not between 0 and 20 or >= 100

   */

  getHueShiftVariation(shiftTestIndex) {
    if (shiftTestIndex <= 0) {
      return 0;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 19) {
      let hueV = shiftTestIndex * 0.05;
      return hueV;
    } else if (shiftTestIndex > 100) {
      return shiftTestIndex / 100;
    }
    return 0;
  }

  /**
  
    Returns shiftTestIndex * 5 for intensity, or >= 100 shiftTestIndex for shiftTestIndex / 100 for a precise value
    defaults to five if not between 0 and 20 or >= 100
     */
  getBaseLightIntensity(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 20) {
      return 5 + shiftTestIndex * 5;
    }
    if (shiftTestIndex > 100) {
      return shiftTestIndex / 100;
    }
    return 5;
  }

  //<===================Under devleopment

  /**
   *
   * Returns 0 (index = 0 ) or 0.5 * shiftTestIndex for speed multiplier of a lights variation in intensity
   * So from 1 to 20 = 0.5 to 10
   * @returns {number} The intensity speed multiplier.
   */
  getBaseLightIntensitySpeedByIndex(shiftTestIndex) {
    if (shiftTestIndex == 0) {
      return 0;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 20) {
      return shiftTestIndex * 0.5;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 0;
  }

  /**
   *  * @param {number} shiftTestIndex - An index representing the desired hue shift intensity
   *   @returns {number} The hue variation range.  Note you will very often want index 1 (0.05 or 5% gradient)
   * If 0, 0, if > 0 && <= 20, shiftTestIndex * 0.05, if >= 100, shiftTestIndex / 100 for precise values
   */

  getHueShiftVariationByIndex(shiftTestIndex) {
    if (shiftTestIndex <= 0) {
      return 0;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 20) {
      return shiftTestIndex * 0.05;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 0;
  }

  /**
   * 
   //Determines the base change to a color - say Blue to Green, note color hue currently only goes in one direction
  //going to add a bi-directional light system, so lights can reverse, but also can go from different lights to other lights.
  //You are most likely to keep this value between 0 and 5 - 0 being a change of 0.05 (small shift in hue) to 5 (shift of 0.25), a dramatic shift

  More precise values can be made by passing in a shift test index >= 100 to get shiftTestIndex / 100 as an absolute value for the base shift in hue

    defaults to 0 if not between 0 and 20 or >= 100

   */

  getBaseHue(shiftTestIndex) {
    if (shiftTestIndex >= 0 && shiftTestIndex <= 20) {
      return shiftTestIndex * 0.05;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 0;
  }

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
    if (shiftTestIndex == 0) {
      return 0;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 19) {
      return shiftTestIndex * 0.05;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 0;
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
  getLightShiftValuesAdjusted(modularValues) {
    // Define variance boundaries for subtle random adjustments.
    // Adjust these values to make the resulting offsets more or less pronounced.
    const lowerVariance = -0.1; // Lower bound for random offset (negative variation)
    const upperVariance = 0.1; // Upper bound for random offset (positive variation)

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
      colorShiftPhaseRatio:
        modularValues.colorShiftPhaseRatio *
        this.getMicroVariance(lowerVariance, upperVariance), // phase offset for the sine wave
      lightIntensityPhaseRatio:
        modularValues.lightIntensityPhaseRatio *
        this.getMicroVariance(lowerVariance, upperVariance),
    };
    return shift;
  }
  /**
   * Returns a random multiplier for intensity speed.
   * The multiplier will be between the provided minimum (plug-in value) and 1.0.
   *
   * For example, if you pass in 0.7, this function will return a value between 0.7 (70% of base speed)
   * and 1.0 (100% of base speed), ensuring that the intensity speed is never faster than the base speed,
   * but can be up to 30% slower. If you want to allow speeds that are 50% of base, you'd call this function
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
   * Returns a light intensity shift amplitude based on a given index.
   *
    Ranges from 0 at 0 or 0.05 * shiftTestIndex for 1 to 20.
   *
   * @param {number} shiftTestIndex - An index representing the desired light intensity shift.
   * @returns {number} The light intensity shift amplitude.
   */
  getBaseLightIntensityAmplitudeByIndex(shiftTestIndex) {
    if (shiftTestIndex <= 0) {
      return 0;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 20) {
      return 0.05 + (shiftTestIndex - 1) * 0.05;
    }
    // For indices 100 and above, the shift amplitude is defined as index/100.
    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }
    // Optionally, you can add a default return value here for unhandled cases.
    return 0;
  }

  /**
   * Returns 0 at 0 or shiftTextIndex * 4 at 20, so 4 seconds to 80 seconds,
   * or shiftTestIndex / 100 for precise values
   * 0
   */
  getIntervalMinByIndex(shiftTestIndex) {
    if (shiftTestIndex <= 0) {
      return 0;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 19) {
      return 4 + (shiftTestIndex - 1) * 4;
    }

    if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 4;
  }
  /**
   * Gets the minimum duration for a shift interval For index 0 to 20,  (4 + (shiftIndex - 1) * 4)
   * So by default, 4 to 80, but can get a more precise value by doing shiftTestIndex / 100
   *
   * */
  getIntervalMaxByIndex(shiftTestIndex) {
    if (shiftTestIndex <= 0) {
      return 4;
    } else if (shiftTestIndex > 0 && shiftTestIndex <= 20) {
      return shiftTestIndex * 4;
    } else if (shiftTestIndex >= 100) {
      return shiftTestIndex / 100;
    }

    return 4;
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

  getTimingOffset(minFraction, maxFraction) {
    const randomFraction =
      Math.random() * (maxFraction - minFraction) + minFraction;
    // Multiply by 2π to convert the fraction to a radian offset.
    return randomFraction * (2 * Math.PI);
  }

  /**
   * Converts an array of index values into an array of raw light configuration objects.
   *
   * @param {Array<number>} valueIndexes - Array of preset index values.
   * @param {number} bagSize - Number of configuration objects to generate.
   * @returns {Array<Object>} Array of light configuration objects.
   */
  convertLightIndexesToRawValuesBag(valueIndexes, bagSize) {
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

    let bagOfAdjustedValues = [];
    let i = 0;
    while (i < bagSize) {
      let adjustedValues = this.getLightShiftValuesAdjusted(values);
      bagOfAdjustedValues.push(adjustedValues);
      i++;
    }

    return bagOfAdjustedValues;
  }

  getEnvironmentLightDirectionLightBagByPresetComposite(colorPreset) {
    let colorIndexes =
      this.getEnvironmentLightDirectionLightPresetSettings(colorPreset);
    let colorValuesBag = this.convertLightIndexesToRawValuesBag(colorIndexes);

    return colorValuesBag;
  }
  /**
   * Registers a preset storage so that preset retrieval methods can function.
   *
   * @param {Object} presetStorage - An instance providing preset data.
   */
  registerLightingPresetStorage(presetStorage) {
    this.lightingPresetStorage = presetStorage;
  }
  //Factory method for getting the base values for a given lighting preset for a directional light, note this is pre adjustment for variance
  getEnvironmentLightDirectionLightPresetSettings(colorPreset) {
    //0 baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed

    let presetIndexes =
      this.lightingPresetStorage.getEnvironmentLightDirectionLightColorProfileByPresetName(
        colorPreset
      );

    let lightPresetValues = this.wrapPresetValuesIntoObject(presetIndexes);

    return lightPresetValues;
  }

  getPlayerLightDirectionLightPresetSettings(colorPreset) {
    let presetIndexes =
      this.lightingPresetStorage.getPlayerLightDirectionLightColorShiftByPreset(
        colorPreset
      );

    let lightPresetValues = this.wrapPresetValuesIntoObject(presetIndexes);

    return lightPresetValues;
  }
  getPlayerLightPositionLightPresetSettings(colorPreset) {
    let presetIndexes =
      this.lightingPresetStorage.getPlayerLightColorShiftByPreset(colorPreset);

    let lightPresetValues = this.wrapPresetValuesIntoObject(presetIndexes);

    return lightPresetValues;
  }
  getEnvironmentLightPositionLightPresetSettings(colorPreset) {
    //0 baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed

    let presetIndexes =
      this.lightingPresetStorage.getEnvironmentLightPositionLightColorProfileByPresetName(
        colorPreset
      );

    let lightPresetValues = this.wrapPresetValuesIntoObject(presetIndexes);

    return lightPresetValues;
  }

  wrapPresetValuesIntoObject(presetIndexes) {
    // Handle both array format (legacy) and LightingColorShiftProfile object format
    let lightPresetValues;

    if (Array.isArray(presetIndexes)) {
      // Legacy array format: [baseLightIntensity, amplitude, hue, variation, speed, hueSpeed]
      lightPresetValues = {
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
    } else if (presetIndexes && typeof presetIndexes === 'object') {
      // LightingColorShiftProfile object format - extract and convert index values
      lightPresetValues = {
        baseLightIntensity: this.getBaseLightIntensityByIndex(presetIndexes.baseLightIntensity || 0),
        baseLightIntensityAmplitude: this.getBaseLightIntensityAmplitudeByIndex(
          presetIndexes.baseLightIntensityAmplitude || 0
        ),
        baseHue: this.getBaseHue(presetIndexes.baseHue || 0),
        hueVariation: this.getHueShiftVariationByIndex(presetIndexes.hueVariation || 0),
        baseLightIntensitySpeed: this.getBaseLightIntensitySpeedByIndex(
          presetIndexes.baseLightIntensitySpeed || 0
        ),
        hueShiftSpeed: this.getHueShiftSpeedByIndex(presetIndexes.hueShiftSpeed || 0),
      };
    } else {
      // Fallback to defaults
      lightPresetValues = {
        baseLightIntensity: 5,
        baseLightIntensityAmplitude: 0,
        baseHue: 0,
        hueVariation: 0,
        baseLightIntensitySpeed: 0,
        hueShiftSpeed: 0,
      };
    }

    return lightPresetValues;
  }
}
