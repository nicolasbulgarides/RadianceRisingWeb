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

  createPlayerLightsFromTemplateComposite(scene, configurationTemplate) {
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
          motionPreset
        );
        factoryCounter++;
      }
    }
  }

  createPlayerLight(scene, nickname, archetype, colorPreset, motionPreset) {
    return;
    if (archetype === "direction") {
      this.createDirectionLight(
        nickname,
        archetype,
        scene,
        colorPreset,
        motionPreset,
        true
      );
    } else if (archetype === "position") {
      this.createPositionLight(
        nickname,
        archetype,
        scene,
        colorPreset,
        motionPreset,
        true
      );
    }
  }
  createDirectionLight(
    scene,
    nickname,
    archetype,
    colorPreset,
    motionPreset,
    doesChasePlayer,
    index
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

        ChadUtilities.displayContents(
          motionProfile,
          "Sub child Motion prof sender"
        );
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

      createdLight.intensity = colorPresetProfile.baseLightIntensity * 100;
      LoggerOmega.SmartLogger(
        true,
        "INTENSITY!: " + createdLight.intensity,
        "LIGHT BBY"
      );

      createdLight.diffuse = new BABYLON.Color3(1, 1, 1);

      lightObject = new LightingObject(
        nickname,
        createdLight,
        colorPresetProfile,
        motionProfile
      );

      if (!doesChasePlayer) {
        this.lightingManager.registerEnvironmentDirectionLight(lightObject);
      } else if (doesChasePlayer) {
        this.lightingManager.registerPlayerChasingLight(lightObject);
      }
    }
    // this.adjustLightInitialValues(lightObject);
  }

  createPositionLight(
    scene,
    nickname,
    archetype,
    colorPreset,
    motionPreset,
    doesChasePlayer,
    index
  ) {
    let colorPresetProfile = null;
    let motionProfile = null;
    let lightObject = null;
    let createdLight = null;

    if (archetype === "position") {
      if (!doesChasePlayer) {
        colorPresetProfile =
          this.lightingPropertyCalculator.getEnvironmentLightPositionLightPresetSettings(
            colorPreset
          );
        motionProfile =
          this.lightingMotionPresets.getPositionLightMotionPresetByName(
            motionPreset
          );
      } else if (doesChasePlayer) {
        colorPresetProfile =
          this.lightingPropertyCalculator.getPlayerLightPositionLightPresetSettings(
            colorPreset
          );
        motionProfile =
          this.lightingMotionPresets.getPlayerPositionLightMotionByPreset(
            motionPreset
          );
      }

      createdLight = new BABYLON.PointLight(
        nickname,
        motionProfile.basePosition,
        scene
      );

      lightObject = new LightingObject(
        nickname,
        createdLight,
        colorPresetProfile,
        motionProfile
      );

      if (!doesChasePlayer) {
        this.lightingManager.registerEnvironmentPositionLight(lightObject);
      } else if (doesChasePlayer) {
        this.lightingManager.registerPlayerChasingLight(lightObject);
      }

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
    index
  ) {
    if (archetype === "direction") {
      this.createDirectionLight(
        scene,
        nickname,
        archetype,
        colorPreset,
        motionPreset,
        false,
        index
      );
    } else if (archetype === "position") {
      this.createPositionLight(
        scene,
        nickname,
        archetype,
        colorPreset,
        motionPreset,
        false,
        index
      );
    }
  }
}
