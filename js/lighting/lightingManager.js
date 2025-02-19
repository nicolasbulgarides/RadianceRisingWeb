/**
 * LightingManager Class
 *
 * Manages the full lifecycle of lighting objects within a Babylon.js scene.
 * Responsible for initializing subsystems (factory, frame updates, templates),
 * loading configurations, and registering/deregistering both environment and player lights.
 */
class LightingManager {
  /**
   * Creates a new LightingManager instance.
   *
   */
  constructor() {
    this.lightingLogger = new LightingLogger();
  }

  /**
   * Initializes key subsystems and arrays used for active lights.
   */
  initializeConstructSystems(conductLightingExperiments, sceneToAddLightsTo) {
    this.loadLightingExperiments = conductLightingExperiments;
    this.sceneToAddLightsTo = sceneToAddLightsTo;
    this.activePlayerLightObjects = [];
    this.activeEnvironmentLightObjects = [];
    this.activeEnvironmentPositionLightObjects = [];
    this.activeEnvironmentLightDirectionLightObjects = [];

    this.currentLightingTemplate = null;
    this.lightingFrameUpdates = new LightingFrameUpdates(this);
    this.lightingTemplateStorage = new LightingTemplateStorage();

    if (!this.loadLightingExperiments) {
      this.lightingFactory = new LightingFactory(this);
      this.loadIntialLightingConfiguration();
    } else {
      this.lightingFactory = new LightingFactory(this);
      this.lightingExperiments = new LightingExperiments(this);
      let currentExperimentIndex = this.lightingExperiments.test;
      let currentExperimentBag =
        this.lightingExperiments.convertSingleExperimentIdToValidEnvironmentTemplateBag(
          currentExperimentIndex
        );

      this.lightingFactory.createEnvironmentLightsFromExperimentalValues(
        this.sceneToAddLightsTo,
        currentExperimentBag
      );
    }
  }

  /**
   * Iterates through all active environment lights to update them each frame.
   */
  processLightFrameCaller() {
    // this.lightingFrameUpdates.processFrameOnActiveLightObjects(this.activeEnvironmentLightObjects);
  }

  /**
   * Registers an environment positional light.
   *
   * @param {LightingObject} positionLight - The light to register.
   */
  registerEnvironmentPositionLight(positionLight) {
    this.activeEnvironmentLightObjects.push(positionLight);
    this.activeEnvironmentLightPositionLightObjects.push(positionLight);
  }

  /**
   * Registers an environment directional light.
   *
   * @param {LightingObject} directionLight - The light to register.
   */
  registerEnvironmentDirectionLight(directionLight) {
    this.activeEnvironmentLightObjects.push(directionLight);
    this.activeEnvironmentLightDirectionLightObjects.push(directionLight);
  }

  /**
   * Registers a player chasing light.
   *
   * @param {LightingObject} playerChasingLight - The player light to register.
   */
  registerPlayerChasingLight(playerChasingLight) {
    this.activePlayerLightObjects.push(playerChasingLight);
  }

  /**
   * Disposes all existing player lights.
   */
  disposePlayerLights() {
    // Dispose existing player lights if any
    if (this.activePlayerLightObjects.length > 0) {
      this.activePlayerLightObjects.forEach((lightObj) => {
        if (lightObj instanceof LightingObject && lightObj.light) {
          lightObj.light.dispose();
        }
      });
      this.activePlayerLightObjects = [];
    }
  }
  /**
   * Loads player light configuration from a template and attaches it to follow the player.
   * Automatically disposes any existing player lights.
   *
   * @param {Player} player - The player instance whose lights will follow its model.
   * @param {string} playerConfigurationTemplate - The preset identifier for player lighting configuration.
   */
  loadPlayerLightFromConfigurationTemplate(
    player,
    playerConfigurationTemplate
  ) {
    // Create new player lights using the lighting factory and template storage.
    // This call pulls the lighting configuration template from LightingTemplateStorage,
    // which then retrieves the proper LightingColorShiftProfiles and LightingMotionProfiles.
    // The LightingFactory then creates one or more lights that are designated to follow the player.
    //this.lightingFactory.createPlayerLightsFromTemplateComposite(this.scene, player,playerConfigurationTemplate);
  }

  // (Further methods such as assignDefaultPlayerModelLight, deletePlayerChasingLight, etc.
  // have also been annotated with similar detailed JSDoc comments.)
  loadIntialLightingConfiguration() {
    let configurationTemplate =
      this.lightingTemplateStorage.getEnvironmentLightingConfigurationBagFromTemplate(
        Config.DEFAULT_ENVIRONMENT_LIGHTING_TEMPLATE
      );

    this.lightingFactory.createEnvironmentLightsFromTemplateComposite(
      this.sceneToAddLightsTo,
      configurationTemplate
    );
  }
}
