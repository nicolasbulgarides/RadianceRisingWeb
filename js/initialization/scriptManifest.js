/**
 * ScriptManifest Class
 *
 * Defines a manifest of scripts required for the application.
 * Organizes script paths by functional components including:
 * - Initialization utilities.
 * - Asset management.
 * - Gameplay systems.
 * - UI overlays.
 * - Lighting and camera configuration.
 *
 * This manifest is loaded by ScriptInitializer to dynamically load the necessary scripts.
 */
class ScriptManifest {
  
  /**
   * Returns an array of script URLs to load for full application initialization.
   * @returns {Array<string>} Array of script URLs.
   */
  static getScriptsToLoad() {
    const scriptsToLoad = [];

    this.loadEssentialInitializationUtilityScripts(scriptsToLoad);
    this.loadAssetManifestScripts(scriptsToLoad);
    this.loadAssetLoadersAndManagersScripts(scriptsToLoad);
    this.loadUIScripts(scriptsToLoad);
    this.loadLightingScripts(scriptsToLoad);
    this.loadCameraScripts(scriptsToLoad);
    this.loadInputScripts(scriptsToLoad);
    this.loadGameplayScripts(scriptsToLoad);
    this.loadSoundSystems(scriptsToLoad);
    this.loadMinorUtilityScripts(scriptsToLoad);

    return scriptsToLoad;
  }

  /**
   * Loads gameplay related scripts into the manifest array.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadGameplayScripts(scriptArray) {
    scriptArray.push("/gameplay/gameplayManager.js");
    scriptArray.push("/gameplay/gameplayLogger.js");
    this.loadPlayerScripts(scriptArray);
    this.loadGameInteractions(scriptArray);
    this.loadGameWorldScripts(scriptArray);
  }
  
  /**
   * Loads game interactions script paths.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadGameInteractions(scriptArray) {
    scriptArray.push("/gameplay/interactions/movementPathManager.js");
  }
  
  /**
   * Loads sound system scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadSoundSystems(scriptArray) {
    scriptArray.push(
      "/utilities/sound/soundEffectsManager.js",
      "/utilities/sound/musicManager.js"
    );
  }
  
  static loadInputScripts(scriptArray) {
    // Input handling scripts can be added here.
  }
  
  /**
   * Loads additional utility scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadMinorUtilityScripts(scriptArray) {
    scriptArray.push("/utilities/misc/chadUtilities.js");
  }
  
  /**
   * Loads player-related scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadPlayerScripts(scriptArray) {
    scriptArray.push(
      "/gameplay/player/playerStatus.js",
      "/gameplay/player/playerUnit.js",
      "/gameplay/player/playerPositionAndModelManager.js",
      "/gameplay/player/playerModelMovementManager.js",
      "/gameplay/player/playerLoader.js"
    );
  }
  
  /**
   * Loads game world related scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadGameWorldScripts(scriptArray) {
    scriptArray.push(
      "/gameplay/worlds/worldData.js",
      "/gameplay/worlds/obstacle.js",
      "/gameplay/worlds/boardSlot.js",
      "/gameplay/worlds/worldMap.js",
      "/gameplay/worlds//gameGridGenerator.js",
      "/gameplay/worlds/worldMapObstacleGenerator.js",
      "/gameplay/worlds/gameWorldLoader.js",
      "/gameplay/worlds/obstacleFinder.js"
    );
  }
  
  /**
   * Loads essential initialization utility scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadEssentialInitializationUtilityScripts(scriptArray) {
    scriptArray.push(
      "/utilities/diagnostics/loggerCooldownRegistry.js",
      "/utilities/diagnostics/loggerOmega.js",
      "/initialization/initializationDiagnosticsLogger.js",
      "/initialization/config.js",
      "/utilities/diagnostics/benchmarkManager.js"
    );
    
  }
  
  /**
   * Loads asset manifest related scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadAssetManifestScripts(scriptArray) {
    scriptArray.push(
      "/utilities/assetmanifests/assetManifest.js",
      "/utilities/assetmanifests/assetManifestOverrides.js",
      "/utilities/assetmanifests/uiAssetManifest.js",
      "/utilities/assetmanifests/soundAssetManifest.js",
      "/utilities/assetmanifests/songAssetManifest.js"
    );
  }
  
  /**
   * Loads asset loaders and managers.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadAssetLoadersAndManagersScripts(scriptArray) {
    scriptArray.push(
      "/utilities/loaders/positionedObject.js",
      "/utilities/loaders/modelLoader.js",
      "/utilities/loaders/modelLoadingLogger.js",
      "/utilities/loaders/animatedModelLoader.js",
      "/utilities/loaders/sceneBuilder.js"
    );
  }
  
  /**
   * Loads UI related scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadUIScripts(scriptArray) {
    scriptArray.push(
      "/ui/buttonFactory.js",
      "/ui/renderSceneManager.js",
      "/ui/baseGameUI.js",
      "/ui/mainMenuUI.js",
      "/ui/experienceBarUI.js",
    );
  }
  
  /**
   * Loads camera related scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadCameraScripts(scriptArray) {
    scriptArray.push("/camera/cameraManager.js");
  }
  
  /**
   * Loads lighting related scripts.
   * @param {Array<string>} scriptArray - The array to load script paths into.
   */
  static loadLightingScripts(scriptArray) {
    scriptArray.push(
      "/lighting/lightingLogger.js",
      "/lighting/lightingColorShiftProfile.js",
      "/lighting/lightingMotionProfile.js",
      "/lighting/lightingMotionPresets.js",
      "/lighting/lightingColorPresets.js",
      "/lighting/lightingPropertyCalculator.js",
      "/lighting/lightingTemplates.js",
      "/lighting/lightingObject.js",
      "/lighting/lightingExperiments.js",
      "/lighting/lightingFactory.js",
      "/lighting/lightingFrameUpdates.js",
      "/lighting/lightingManager.js"
    );
  }
}
