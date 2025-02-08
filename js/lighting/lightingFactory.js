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
    let environmentLightTemplateBag =
      this.lightingTemplateStorage.getEnvironmentLightingConfigurationBagFromTemplate(
        configurationTemplate
      );
    let bagPropertiesArray =
      environmentLightTemplateBag.encapsulatePresetArrays();

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

  /**
   * Creates player lights based on a configuration template.
   *
   * @param {BABYLON.Scene} scene - The Babylon.js scene. 
   * @param {Player} player - The player instance.
   * @param {Object} configurationTemplate - Lighting configuration data for player lights.
   */
  createPlayerLightsFromTemplateComposite(scene, player, configurationTemplate) {
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
  createPlayerLight(scene, nickname, archetype, colorPreset, motionPreset, player) {
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
        true, player
      );
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
    var createdLight;

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
        motionBag = allMotionProfiles[index];

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

      createdLight.intensity = colorPresetProfile.baseLightIntensity;
      LoggerOmega.SmartLogger(true, "Intensity: " + createdLight.intensity);

      createdLight.diffuse = this.lighti

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
    }
   // this.adjustLightInitialValues(lightObject);
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
          this.lightingMotionPresets.getPositionLightMotionPresetByName(motionPreset);
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
          this.lightingMotionPresets.getPlayerPositionLightMotionByPreset(motionPreset);
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

  adjustLightInitialValues(lightObject) {
    if (lightObject != null && this.lightingFrameUpdates != null) {
      let currentTime = performance.now();
      this.lightingFrameUpdates.initializeValuesByPhase(
        currentTime,
        lightObject
      );
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
