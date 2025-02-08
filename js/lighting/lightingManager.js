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
    this.lightingLogger = new LightingLogger();
    this.initializeConstructSystems();
    this.lightingConfigurationLoader();
  }

  initializeConstructSystems() {
    this.activeEnvironmentLightObjects = [];
    this.activeEnvironmentPositionLightObjects = [];
    this.activeEnvironmentLightDirectionLightObjects = [];

    this.currentLightingTemplate = null;
    this.lightingTemplates = new LightingTemplates();
    this.lightingFactory = new LightingFactory(this);
    this.lightingExperiments = new LightingExperiments(this);
    this.lightingFrameUpdates = new LightingFrameUpdates(this);
  }

  lightingConfigurationLoader() {
    let configurationTemplate = null;
    let runningAnExperiment = false;
    let runningExperimentFromTemplate = true;
    let experimentIndex = -1;
    // let runningAnExperiment = true;

    if (!runningAnExperiment) {
      configurationTemplate =
        this.lightingTemplates.getPresetConfigurationByTemplate(
          Config.DEFAULT_LIGHTING_TEMPLATE
        );
      this.lightingFactory.processLightingTemplateEnvironment(
        configurationTemplate
      );
    } else if (
      runningAnExperiment &&
      (runningExperimentFromTemplate || experimentIndex >= 0)
    ) {
      if (runningExperimentFromTemplate) {
        this.lightingFactory.processLightingTemplateEnvironment(
          configurationTemplate
        );
      } else if (experimentIndex >= 0) {
        this.lightingFactory.processLightingExperimentFromIndex(
          experimentIndex
        );
      }
    }
  }
  //<============================Under development

  /**
   * Iterate through all active lights and updates hue, intensity and position based off of the elapsed time
   * */
  processLightFrameCaller() {
    this.lightingFrameUpdates.processFrame(this.activeEnvironmentLightObjects);
  }

  registerEnvironmentPositionLight(positionLight) {
    this.activeEnvironmentLightObjects.push(positionLight);
    this.activeEnvironmentLightPositionLightObjects.push(positionLight);
  }
  registerEnvironmentDirectionLight(directionLight) {
    this.activeEnvironmentLightObjects.push(directionLight);
    this.activeEnvironmentLightDirectionLightObjects.push(directionLight);
  }

  /**
    Ensures that the player-chasing light is positioned based off of the pre-determined / configured offset for the chasing light
   */

  clearExistingActiveEnvironmentLights() {}

  //<===================================Code for player specific  light
  // to do
  assignDefaultPlayerModelLight(player, LightPreset) {
    return;
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

  // to fix
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

  // to do
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

  //generic method for initializing various variables and storing the pre-designed presets
  initializeMiscVariables() {
    this.playerModel = null;
    this.activeEnvironmentLightObjects = []; // Array to hold lights and their shift parameters
    this.activePlayerLightObjects = [];

    this.currentLightingTemplate =
      this.lightingTemplates.getPresetConfigurationByTemplate(
        Config.DEFAULT_LIGHTING_TEMPLATE
      );
  }

  registerActiveLight(lightObject) {
    this.activeEnvironmentLightObjects.push(lightObject);
  }

  toggleDisableOfSpecificLight(lightObject) {
    if (lightObject instanceof lightObject) {
      lightObject.toggleLightDisabled();
    }
  }

  disableSpecificLight(lightObject) {
    if (lightObject instanceof lightObject) {
      lightObject.disableLight();
    }
  }
  enableSpecificLight(lightObject) {
    if (lightObject instanceof lightObject) {
      lightObject.enableLight();
    }
  }

  deregisterActiveLight(lightObject) {
    let indexInAllLights = -1;
    let indexInDirectionLights = -1;
    let indexInPositionLights = -1;

    if (lightObject) {
      indexInAllLights =
        this.activeEnvironmentLightObjects.findIndex(lightObject);
      indexInDirectionLights =
        this.activeEnvironmentLightDirectionLightObjects.findIndex(lightObject);
      indexInPositionLights =
        this.activeEnvironmentLightPositionLightObjects.findIndex(lightObject);

      if (lightObject.light && indexInAllLights != -1) {
        lightObject.light.dispose();
        this.activeEnvironmentLightObjects.splice(indexInAllLights, 1);

        if (indexInDirectionLights != -1) {
          this.activeEnvironmentLightDirectionLightObjects.splice(
            indexInDirectionLights,
            1
          );
        } else if (indexInPositionLights != -1) {
          this.activeEnvironmentPositionLightObjects.splice(
            indexInPositionLights
          );
        }
      }
    }
    this.lightingLogger.deregisterLightLogger(index, lightObject);
  }

  onFrameCall() {
    this.lightingFrameUpdates.processFrameOnActiveLightObjects(
      this.activeEnvironmentLightObjects
    );
  }
}
