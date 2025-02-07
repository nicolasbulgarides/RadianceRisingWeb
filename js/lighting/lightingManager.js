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

  static lightingLoggingEnabled = true;

  constructor(sceneInstance) {
    this.scene = sceneInstance;
    this.conductLoggingOverrideCheck();
    this.initializeConstructSystems();
    this.lightingConfigurationLoader();
  }

  initializeConstructSystems() {
    this.activeLightObjects = [];
    this.currentLightingTemplate = null;
    this.lightingTemplates = new LightingTemplates();
    this.lightingFactory = new LightingFactory(this);
    this.lightingExperiments = new LightingExperiments(this);
    this.lightingFrameUpdates = new LightingFrameUpdates(this);
  }
  conductLoggingOverrideCheck() {
    if (Config.LOGGING_FORCEFULLY_ENABLED) {
      this.lightingLoggingEnabled = true;
    }
  }

  lightingConfigurationLoader() {
    let configurationTemplate = null;

    let runningAnExperiment = false;
    // let runningAnExperiment = true;

    if (!runningAnExperiment) {
      configurationTemplate =
        this.lightingTemplates.getPresetConfigurationByTemplate(
          Config.DEFAULT_LIGHTING_TEMPLATE
        );
    } else {
      configurationTemplate = "CURRENT_EXPERIMENT";
    }

    this.currentLightingTemplate = configurationTemplate;
    this.processLightingTemplateCommposite(configurationTemplate);
  }

  processLightingTemplateCommposite(configurationTemplate) {}

  //<============================Under development

  /**
   * Iterate through all active lights and updates hue, intensity and position based off of the elapsed time
   * */
  processLightFrameCaller() {
    this.lightingFrameUpdates.processFrame(this.activeLights);
  }

  /**
   * Updates the orbital motion for a given light.
   *
   * @param {number} currentTime - The current time in seconds.
   * @param {object} light - The light object to update. Should include properties lightType and lightPath:
   * if lightType = "positional" and lightPath = orbital, then and only then will this method process
   *   orbitSpeed, orbitPhase, orbitCenter, and orbitRadius.
   */

  registerPositionalLight(light, shift, pathData) {
    this.activeLights.push({ light, shift });
    this.lightPathData.push({ light, pathData });
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
  clearExistingActiveEnvironmentLights() {}

  /**
   * Still needs code for positional light system
   */
  initializeLightingComposite() {
    let experimentIndex = this.manageExperimentOrPresetConfigurationPanel();

    if (experimentIndex >= 0) {
      if (this.currentEnvironmentLightArchetype === "directional") {
        this.setEnvironmentLightDirectionLightByExperiment(experimentIndex);
      } else if (this.currentEnvironmentLightArchetype === "position") {
      }
    } else {
      if (this.currentEnvironmentLightArchetype === "directional") {
        this.setEnvironmentLightDirectionLightByPreset(
          this.currentEnvironmentLightPreset,
          this.currentEnvironmentLightDirectionLightAngleVectors
        );
      } else if (this.currentEnvironmentLightArchetype === "position") {
      }
    }
  }

  //<===================================Code for player specific  light
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
  deleteOldPlayerChasingLight() {
    if (this.chasingLight != null && this.scene != null) {
      this.chasingLight.dispose();
      const index = this.scene.lights.indexOf(this.chasingLight);
      if (index > -1) {
        this.scene.lights.splice(index, 1);
      }
    }
  }

  setPlayerChasingLight(lightPreset) {
    let playerLightPresetValues = this.getPlayerLightPresetValues(lightPreset);
    this.playerLightBasePosition =
      this.positionedObjectForPlayer.getCompositePositionBaseline();

    this.playerLightBaseOffset = this.getPlayerLightOffsetByPreset(lightPreset);

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
  //<===================================Code for player light

  getPlayerLightPresetValues(lightPreset, lightOffsetPreset) {
    let lightColorDefault = this.getPlayerLightColorByPreset(lightPreset);
    let lightIntensityDefault =
      this.getPlayerLightIntensityByPreset(lightPreset);
    let lightOffsetDefault =
      this.getPlayerLightOffsetByPreset(lightOffsetPreset);
    let playerLightPreset = {
      lightOffset: lightOffsetDefault,
      lightIntensity: lightIntensityDefault,
      lightColor: lightColorDefault,
    };

    return playerLightPreset;
  }

  //<==================End of under development

  //<=-------------------------------Experiment index values for directional lights

  //generic method for initializing various variables and storing the pre-designed presets
  initializeMiscVariables() {
    this.playerModel = null;
    this.activeLightObjects = []; // Array to hold lights and their shift parameters
    this.currentLightingTemplate =
      this.lightingTemplates.getPresetConfigurationByTemplate(
        Config.DEFAULT_LIGHTING_TEMPLATE
      );
  }

  //<========================Factory methods

  //generic factory method for retrieving experimental values for a specific experiment index for directional lights
  getEnvironmentLightDirectionLightExperimentSettings(experimentIndex) {
    let experimentValueIndexes = [0, 0, 0, 0, 0, 0];

    if (this.lightingLoggingEnabled) {
      console.log(
        "Checking environment light direction light experiment index: " +
          experimentIndex
      );
    }
    if (
      this.environmentLightDirectionLightExperimentIndexHolder[
        experimentIndex
      ] != null
    ) {
      experimentValueIndexes =
        this.environmentLightDirectionLightExperimentIndexHolder[
          experimentIndex
        ];

      if (this.lightingLoggingEnabled) {
        console.log(
          "Sucessfully Pulled out environment light direction light experiment values for experiment index: " +
            experimentIndex
        );
      }
    } else {
      console.log(
        "UnSucessfully Pulled out environment light direction light experiment values for experiment index: " +
          experimentIndex
      );
    }

    let lightExperimentValueBag = this.convertLightIndexesToRawValues(
      experimentValueIndexes
    );

    return lightExperimentValueBag;
  }

  //factory method for setting an environmental direction light based off of a preset
  setEnvironmentLightDirectionLightByPreset(
    environmentLightPreset,
    environmentLightVectorPreset
  ) {
    let lightSettings = null;
    let lightVectors = null;

    lightSettings = this.getEnvironmentLightDirectionLightPresetSettings(
      environmentLightPreset
    );

    lightVectors = this.getEnvironmentLightDirectionLightPresetVectors(
      environmentLightVectorPreset
    );

    this.clearExistingActiveEnvironmentLights();
    this.createFourDirectionalLights(lightSettings, lightVectors);
  }

  registerActiveLight(lightObject) {
    this.activeLightObjects.push(lightObject);
  }

  deregisterActiveLight(lightObject) {
    if (lightObject) {
      let index = this.activeLightObjects.findIndex(lightObject);

      if (lightObject.light && index != -1) {
        lightObject.light.dispose();
        ChadUtilities.classContainedSmartLogger(
          this.lightingLoggingEnabled,
          "Sucessfully disposed of light: " + lightObject.lightNickname
        );
      } else {
        if (this.lightingLoggingEnabled) {
          if (index == -1 && lightObject.light) {
            ChadUtilities.classContainedSmartLogger(
              this.lightingLoggingEnabled,
              "Light object not in arrayt of light objects, but light object contains a light " +
                lightObject.lightNickname
            );
          } else if (index == -1 && !lightObject.light) {
            ChadUtilities.classContainedSmartLogger(
              this.lightingLoggingEnabled,
              "Light object not in array of light objects AND light object does not contain a light " +
                lightObject.lightNickname
            );
          }
        }
      }
      this.activeLightObjects.splice(index, 1);
    } else {
      ChadUtilities.classContainedSmartLogger(
        this.lightingLoggingEnabled,
        "No light object to deregister, the pass in to deregister was null!"
      );
    }
  }

  onFrameCall() {
    this.lightingFrameUpdates.processFrame(this.activeLightObjects);
  }
}
