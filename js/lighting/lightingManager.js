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
    this.lightingFrameUpdates.processFrameOnActiveLightObjects(this.activeEnvironmentLightObjects);
    // Player now uses the same environment lighting - no separate player lights needed
  }

  /**
   * Updates the positions of all player lights to follow their assigned players.
   */
  updatePlayerLightPositions() {
    this.activePlayerLightObjects.forEach((lightObj) => {
      if (lightObj && lightObj.light && lightObj.playerToChase) {
        const player = lightObj.playerToChase;
        if (player && player.playerMovementManager) {
          const playerPosition = player.playerMovementManager.getPlayerModelPositionedObject().getCompositePositionBaseline();
          if (playerPosition) {
            // Position light slightly above the player
            lightObj.light.position = new BABYLON.Vector3(
              playerPosition.x,
              playerPosition.y + 2,
              playerPosition.z
            );
          }
        }
      }
    });
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
   * Creates player-specific lights that only illuminate the player model.
   * These lights will follow the player and only affect the player meshes.
   * 
   * @param {PlayerUnit} player - The player unit instance.
   * @param {string} colorPreset - Color preset for player lights (default: "default").
   * @param {number} intensity - Light intensity (default: 1.0).
   */
  createPlayerLights(player, colorPreset = "default", intensity = 5.0) {
    if (!player || !player.playerMovementManager) {
      console.warn("[LIGHTING] Cannot create player lights: player or movement manager is null");
      return;
    }

    const playerModel = player.playerMovementManager.getPlayerModelDirectly();
    if (!playerModel) {
      console.warn("[LIGHTING] Cannot create player lights: player model not found");
      return;
    }

    // Collect all player meshes
    const playerMeshes = this.collectAllPlayerMeshes(playerModel);
    if (playerMeshes.length === 0) {
      console.warn("[LIGHTING] No meshes found in player model for player lights");
      return;
    }

    // Dispose any existing player lights
    this.disposePlayerLights();

    // Get player position
    const playerPosition = player.playerMovementManager.getPlayerModelPositionedObject().getCompositePositionBaseline();
    const lightPosition = new BABYLON.Vector3(
      playerPosition.x,
      playerPosition.y + 2, // Slightly above player
      playerPosition.z
    );

    // Create a point light that follows the player
    const playerLight = new BABYLON.PointLight(
      "PlayerLight",
      lightPosition,
      this.sceneToAddLightsTo
    );

    playerLight.intensity = intensity;
    playerLight.diffuse = new BABYLON.Color3(1, 1, 1); // White light for player
    playerLight.range = 10; // Light range

    // Set includedOnlyMeshes so this light ONLY affects the player
    playerLight.includedOnlyMeshes = playerMeshes;

    // Get color preset profile
    let colorPresetProfile;
    if (this.lightingFactory && this.lightingFactory.lightingColorPresets) {
      colorPresetProfile = this.lightingFactory.lightingColorPresets.getEnvironmentLightPositionLightColorProfileByPresetName(colorPreset);
    } else {
      // Fallback to default if factory not initialized
      const defaultPresets = new LightingColorPresets(new LightingPropertyCalculator());
      colorPresetProfile = defaultPresets.getEnvironmentLightPositionLightColorProfileByPresetName(colorPreset);
    }

    // Create a lighting object wrapper
    const lightObject = new LightingObject(
      "PlayerLight",
      playerLight,
      colorPresetProfile,
      { basePosition: lightPosition }
    );

    // Assign player to chase
    lightObject.assignPlayerToChase(player);

    // Register as player light
    this.registerPlayerChasingLight(lightObject);

    console.log(`[LIGHTING] Created player light affecting ${playerMeshes.length} mesh(es)`);

    return lightObject;
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
