/**
 * LightingFactory Class
 *
 * Responsible for creating and initializing lighting objects within a Babylon.js scene.
 * Uses configuration templates to instantiate lights with specific archetypes, color presets,
 * and motion presets. It delegates the creation of environment and player lights to modular methods.
 */
class LightingFactory {
  constructor(lightingManager) {
    this.lightingManager = lightingManager;
    this.lightingExperiments = null;
    this.lightingFrameUpdates = this.lightingManager.lightingFrameUpdates;
    this.lightingPropertyCalculator = new LightingPropertyCalculator();
    this.lightingColorPresets = new LightingColorPresets(
      this.lightingPropertyCalculator
    );
    this.lightingMotionPresets = new LightingMotionPresets();
    this.lightingTemplateStorage = this.lightingManager.lightingTemplateStorage;
  }

  /**
   * Creates environment lights based on the provided template configuration.
   *
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {Object} configurationTemplate - Lighting configuration data.
   */
  createEnvironmentLightsFromTemplateComposite(scene, configurationTemplate) {
    // Check if configurationTemplate is already a bag object or a template name string
    let environmentLightTemplateBag;
    if (configurationTemplate && typeof configurationTemplate === 'object' && configurationTemplate.environmentLightingCount !== undefined) {
      // It's already a bag object, use it directly
      environmentLightTemplateBag = configurationTemplate;
      //console.log(`[LIGHTING] Using provided template bag with ${environmentLightTemplateBag.environmentLightingCount} lights`);
    } else {
      // It's a template name string, look it up
      environmentLightTemplateBag =
        this.lightingTemplateStorage.getEnvironmentLightingConfigurationBagFromTemplate(
          configurationTemplate
        );
    }

    let bagPropertiesArray =
      environmentLightTemplateBag.encapsulatePresetArrays();

    //ChadUtilities.displayContents(bagPropertiesArray, "Bag Properties Array CHECKED!");
    let validArrays = ChadUtilities.arrayLengthAudit(
      bagPropertiesArray,
      environmentLightTemplateBag.environmentLightingCount,
      "Env-Light-Template: ",
      "Checking the validity of env template array" + configurationTemplate,
      LightingLogger.forcefullyOverrideLoggingConfig,
      LightingLogger.lightingLoggingEnabled,
      "secondary"
    );

    if (validArrays) {
      let factoryCounter = 0;
      let allTemplatesObtained =
        environmentLightTemplateBag.convertLightingTemplateBagToIndividualValidTemplates(
          validArrays
        );

      while (
        factoryCounter < environmentLightTemplateBag.environmentLightingCount
      ) {
        let currentTemplate = allTemplatesObtained[factoryCounter];
        let archetype = currentTemplate.environmentLightingArchetype;
        let colorPreset = currentTemplate.environmentLightingColorPreset;
        let motionPreset = currentTemplate.environmentLightingMotionPreset;

        // console.log(`[LIGHTING] Creating environment light ${factoryCounter} with colorPreset: "${colorPreset}"`);
        this.createEnvironmentLight(
          scene,
          "Env Light: " + factoryCounter,
          archetype,
          colorPreset,
          motionPreset,
          factoryCounter
        );

        factoryCounter++;
      }
    }
  }
  createEnvironmentLightsFromExperimentalValues(
    scene,
    environmentLightExperimentBag
  ) {
    let factoryCounter = 0;

    while (
      factoryCounter < environmentLightExperimentBag.environmentLightingCount
    ) {
      let archetype =
        environmentLightExperimentBag.environmentLightingArchetypes[
        factoryCounter
        ];
      let colorIndexes =
        environmentLightExperimentBag.environmentLightingColorPresets[
        factoryCounter
        ];

      let colorValues =
        this.lightingPropertyCalculator.convertLightIndexesToRawValuesBag(
          colorIndexes,
          1
        );
      ChadUtilities.displayContents(colorValues, "Color Values Pre adjustment");
      let motionPreset =
        environmentLightExperimentBag.environmentLightingMotionPresets[
        factoryCounter
        ];

      this.createEnvironmentLightFromRawValues(
        scene,
        "Env Light: " + factoryCounter,
        archetype,
        colorValues,
        motionPreset,
        factoryCounter
      );

      factoryCounter++;
    }
  }

  /**
   * Creates an environment light (directional or positional) using directly provided experimental raw values,
   * bypassing the preset system.
   *
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {string} nickname - Unique identifier for the light.
   * @param {string} archetype - The light archetype ("direction" or "position").
   * @param {Object} colorValues - Pre-stored experimental color values (e.g., baseLightIntensity).
   * @param {Object} motionValues - Pre-stored experimental motion values (e.g., basePosition).
   * @param {number} factoryCounter - Index counter for registration or logging purposes.
   */
  createEnvironmentLightFromRawValues(
    scene,
    nickname,
    archetype,
    colorValues,
    motionValues,
    factoryCounter
  ) {
    let createdLight;
    let lightObject;
    let finalizedPosition = null;

    let zero = new BABYLON.Vector3(0, 1, 20);
    let one = new BABYLON.Vector3(0, 1, 0);
    let two = new BABYLON.Vector3(10, 1, 20);
    let three = new BABYLON.Vector3(0, 1, 20);

    if (factoryCounter == 0) {
      finalizedPosition = zero;
    } else if (factoryCounter == 1) {
      finalizedPosition = one;
    } else if (factoryCounter == 2) {
      finalizedPosition = two;
    } else if (factoryCounter == 3) {
      finalizedPosition = three;
    }

    if (archetype === "direction") {
      // Create a directional light using the experimental motion and color values.

      ChadUtilities.displayContents(
        finalizedPosition,
        "FINALIZED POSITION: " + factoryCounter
      );

      createdLight = new BABYLON.DirectionalLight(
        nickname,
        finalizedPosition,
        scene
      );

      //createdLight = new BABYLON.DirectionalLight(nickname, motionValues.basePosition, scene);
      createdLight.intensity = 3;

      //createdLight.intensity = colorValues.baseLightIntensity;
      // createdLight.diffuse = new BABYLON.Color3(1,1,1);
      lightObject = new LightingObject(
        nickname,
        createdLight,
        colorValues,
        motionValues
      );
      // Register as an environment directional light.
      this.lightingManager.registerEnvironmentDirectionLight(lightObject);

      // ChadUtilities.displayContents(colorValues,"COLOR VALUES");
      //ChadUtilities.displayContents(motionValues,"MOTION VALUES");
    } else if (archetype === "position") {
      // Create a positional light using the experimental raw values.
      createdLight = new BABYLON.PointLight(
        nickname,
        motionValues.basePosition,
        scene
      );
      createdLight.intensity = colorValues.baseLightIntensity;
      lightObject = new LightingObject(
        nickname,
        createdLight,
        colorValues,
        motionValues
      );
      createdLight.diffuse = new BABYLON.Color3(1, 1, 1);

      // Register as an environment positional light.
      this.lightingManager.registerEnvironmentPositionLight(lightObject);
    } else {
      // Log an error if the archetype is unknown.
      LoggerOmega.SmartLogger(
        true,
        "Unknown archetype in createEnvironmentLightFromRawValues: " +
        archetype,
        "LightingFactory"
      );
      return;
    }

    // Apply initial adjustments to set up intensity, hue, etc.
    // this.adjustLightInitialValues(lightObject);
  }

  /**
   * Creates player lights based on a configuration template.
   *
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {Player} player - The player instance.
   * @param {Object} configurationTemplate - Lighting configuration data for player lights.
   */
  createPlayerLightsFromTemplateComposite(
    scene,
    player,
    configurationTemplate
  ) {
    let playerLightTemplateBag =
      this.lightingTemplateStorage.getPlayerLightingConfigurationFromTemplate(
        configurationTemplate
      );

    let bagPropertiesArray = playerLightTemplateBag.encapsulatePresetArrays();

    let validArrays = ChadUtilities.arrayLengthAudit(
      bagPropertiesArray,
      playerLightTemplateBag.playerLightingCount,
      "Player-Light-Template: ",
      "Checking the validity of  player template array" + configurationTemplate,
      LightingLogger.forcefullyOverrideLoggingConfig,
      LightingLogger.lightingLoggingEnabled,
      "secondary"
    );

    if (validArrays) {
      let factoryCounter = 0;
      let allTemplatesObtained =
        playerLightTemplateBag.convertLightingTemplateBagToIndividualValidTemplates(
          validArrays
        );

      while (factoryCounter < playerLightTemplateBag.playerLightingCount) {
        let currentTemplate = allTemplatesObtained[factoryCounter];

        let archetype = currentTemplate.playerLightingArchetype;
        let colorPreset = currentTemplate.playerLightingColorPreset;
        let motionPreset = currentTemplate.playerLightingMotionPreset;

        this.createPlayerLight(
          scene,
          "PlayerLight: " + factoryCounter,
          archetype,
          colorPreset,
          motionPreset,
          player
        );
        factoryCounter++;
      }
    }
  }

  /**
   * (Placeholder) Creates a player light. Actual implementation may differ.
   *
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {string} nickname - Light identifier.
   * @param {string} archetype - The light archetype.
   * @param {string} colorPreset - Color preset identifier.
   * @param {string} motionPreset - Motion preset identifier.
   */
  createPlayerLight(
    scene,
    nickname,
    archetype,
    colorPreset,
    motionPreset,
    player
  ) {
    if (archetype === "direction") {
      this.createDirectionLight(
        nickname,
        archetype,
        scene,
        colorPreset,
        motionPreset,
        true,
        player
      );
    } else if (archetype === "position") {
      this.createPositionLight(
        nickname,
        archetype,
        scene,
        colorPreset,
        motionPreset,
        true,
        player
      );
    }
  }

  /**
   * Immediately initializes the light's intensity and hue based on its color shift profile.
   *
   * This replaces the placeholder call to initialize values and directly computes the initial
   * intensity (using a sine function, phase, and speed) and hue (converted into a BABYLON.Color3 via hsvToRgb).
   *
   * @param {LightingObject} lightObject - The light to initialize.
   */
  adjustLightInitialValues(lightObject) {
    const currentTime = performance.now() * 0.001; // Convert to seconds for better animation speed
    const profile = lightObject.colorShiftProfile;

    // Safely parse numeric values with defaults to 0 to prevent NaN calculations.
    const baseIntensity = Number(profile.baseLightIntensity) || 1.0;
    const amplitude = Number(profile.baseLightIntensityAmplitude) || 0;
    const speed = Number(profile.baseLightIntensitySpeed) || 0;
    const phaseIntensity = Number(profile.lightIntensityPhaseRatio) || 0;

    const baseHue = Number(profile.baseHue) || 0;
    const hueVariation = Number(profile.hueVariation) || 0;
    const hueSpeed = Number(profile.hueShiftSpeed) || 0;
    const phaseHue = Number(profile.colorShiftPhaseRatio) || 0;

    // Compute new intensity: baseIntensity + amplitude * sin( time * speed + phaseIntensity )
    // Ensure intensity is always positive
    const newIntensity = Math.max(0.1,
      baseIntensity +
      amplitude * Math.sin(currentTime * speed + phaseIntensity)
    );
    lightObject.light.intensity = newIntensity;

    // Always set diffuse color - use baseHue if available, otherwise use white
    if (baseHue > 0 || hueVariation > 0) {
      let newHue =
        baseHue + hueVariation * Math.sin(currentTime * hueSpeed + phaseHue);
      // Wrap hue to 0-1 range
      newHue = newHue % 1.0;
      if (newHue < 0) newHue += 1.0;
      lightObject.light.diffuse = this.lightingPropertyCalculator.hsvToRgb(
        newHue,
        1,
        1
      );
    } else {
      // Fallback to white if no hue is specified
      lightObject.light.diffuse = new BABYLON.Color3(1, 1, 1);
    }
  }

  createDirectionLight(
    scene,
    nickname,
    archetype,
    colorPreset,
    motionPreset,
    doesChasePlayer = false,
    index,
    playerToChase = null
  ) {
    let colorPresetProfile = null;
    let allMotionProfiles = null;
    let motionBag = null;
    let motionProfile = null;
    let lightObject = null;
    let createdLight;

    if (archetype === "direction") {
      if (!doesChasePlayer) {
        colorPresetProfile =
          this.lightingPropertyCalculator.getEnvironmentLightDirectionLightPresetSettings(
            colorPreset
          );
        motionBag =
          this.lightingMotionPresets.getDirectionLightMotionPresetByName(
            motionPreset
          );
        allMotionProfiles = motionBag.allMotionProfiles;
        motionProfile = allMotionProfiles[index];
      } else if (doesChasePlayer) {
        colorPresetProfile =
          this.lightingPropertyCalculator.getPlayerLightDirectionLightPresetSettings(
            colorPreset
          );
        allMotionProfiles =
          this.lightingMotionPresets.getPlayerDirectionLightMotionByPreset(
            motionPreset
          );
        motionProfile = allMotionProfiles[index];
      }

      createdLight = new BABYLON.DirectionalLight(
        nickname,
        motionProfile["basePosition"],
        scene
      );

      // Set initial intensity
      createdLight.intensity = colorPresetProfile.baseLightIntensity || 1.0;

      // Ensure light is enabled
      createdLight.setEnabled(true);

      // Disable shadows to prevent checkerboard patterns
      if (createdLight.getShadowGenerator) {
        createdLight.shadowEnabled = false;
      }

      // Set light to not cast shadows
      createdLight.shadowEnabled = false;

      lightObject = new LightingObject(
        nickname,
        createdLight,
        colorPresetProfile,
        motionProfile
      );

      if (!doesChasePlayer) {
        this.lightingManager.registerEnvironmentDirectionLight(lightObject);
      } else if (doesChasePlayer && playerToChase != null) {
        lightObject.assignPlayerToChase(playerToChase);
        this.lightingManager.registerPlayerChasingLight(lightObject);
      }

      // Set initial diffuse color and adjust values
      this.adjustLightInitialValues(lightObject);

      // Ensure diffuse color is set even if baseHue is 0 (fallback to white)
      if (!createdLight.diffuse || createdLight.diffuse.r === 0 && createdLight.diffuse.g === 0 && createdLight.diffuse.b === 0) {
        createdLight.diffuse = new BABYLON.Color3(1, 1, 1);
      }
    }
  }

  processCurrentLightingExperiment(scene, experimentIndex) {
    this.processEnvironmentLightingFromExperimentIndex(scene, experimentIndex);
  }

  processEnvironmentLightingFromExperimentIndex(scene, experimentIndex) {
    let experimentValueBag =
      this.lightingExperiments.convertSingleExperimentIdToValidEnvironmentTemplateBag(
        experimentIndex
      );
    this.createEnvironmentLightsFromExperimentalValues(
      scene,
      experimentValueBag
    );
  }

  /**
   * Creates a positional light following the configuration template.
   * Uses index to retrieve the corresponding motion profile.
   *
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {string} nickname - Unique identifier for the light.
   * @param {string} archetype - The light archetype (expected "position").
   * @param {string} colorPreset - Color preset identifier.
   * @param {string} motionPreset - Motion preset identifier.
   * @param {boolean} doesChasePlayer - Differentiates player chasing lights from environment lights.
   * @param {number} index - Index for selecting the correct motion profile.
   * @param {Player|null} playerToChase - Optional player reference if chasing.
   */
  createPositionLight(
    scene,
    nickname,
    archetype,
    colorPreset,
    motionPreset,
    doesChasePlayer = false,
    index,
    playerToChase = null
  ) {
    let colorPresetProfile = null;
    let motionProfile = null;
    let lightObject = null;
    let createdLight = null;

    if (archetype === "position") {
      if (!doesChasePlayer) {
        // Retrieve environmental lighting settings and motion profiles.
        colorPresetProfile =
          this.lightingPropertyCalculator.getEnvironmentLightPositionLightPresetSettings(
            colorPreset
          );
        // Get motion preset bag and extract all motion profiles.
        const motionBag =
          this.lightingMotionPresets.getPositionLightMotionPresetByName(
            motionPreset
          );
        const allMotionProfiles = motionBag.allMotionProfiles;
        // Pick the correct motion profile using index.
        motionProfile = allMotionProfiles[index];
      } else if (doesChasePlayer) {
        // Retrieve player lighting settings and motion profiles.
        colorPresetProfile =
          this.lightingPropertyCalculator.getPlayerLightPositionLightPresetSettings(
            colorPreset
          );
        // Get all motion profiles for player position lights.
        const allMotionProfiles =
          this.lightingMotionPresets.getPlayerPositionLightMotionByPreset(
            motionPreset
          );
        // Pick the correct motion profile using index.
        motionProfile = allMotionProfiles[index];
      }

      // Create a Babylon.js PointLight using the computed base position from motion profile.
      createdLight = new BABYLON.PointLight(
        nickname,
        motionProfile.basePosition,
        scene
      );

      // Wrap the created light in a LightingObject for additional properties and update tracking.
      lightObject = new LightingObject(
        nickname,
        createdLight,
        colorPresetProfile,
        motionProfile
      );

      // Register the light with the lighting manager based on its type.
      if (!doesChasePlayer) {
        this.lightingManager.registerEnvironmentPositionLight(lightObject);
      } else if (doesChasePlayer && playerToChase != null) {
        lightObject.assignPlayerToChase(playerToChase);
        this.lightingManager.registerPlayerChasingLight(lightObject);
      }

      // Initialize runtime light properties.
      this.adjustLightInitialValues(lightObject);
    }
  }

  createEnvironmentLight(
    scene,
    nickname,
    archetype,
    colorPreset,
    motionPreset,
    index,
    playerToChase = null
  ) {
    if (archetype === "direction") {
      this.createDirectionLight(
        scene,
        nickname,
        archetype,
        colorPreset,
        motionPreset,
        false,
        index,
        playerToChase
      );
    } else if (archetype === "position") {
      this.createPositionLight(
        scene,
        nickname,
        archetype,
        colorPreset,
        motionPreset,
        false,
        index,
        playerToChase
      );
    }
  }
}
