class ScriptManifest {
  constructor() {}
  static getScriptsToLoad() {
    const scriptsToLoad = [];

    this.loadEssentialInitializationUtilityScripts(scriptsToLoad);
    this.loadAssetManifestScripts(scriptsToLoad);
    this.loadAssetLoadersAndManagersScripts(scriptsToLoad);
    this.loadUIScripts(scriptsToLoad);
    this.loadLightingAndCameraScripts(scriptsToLoad);
    this.loadGameInteractions(scriptsToLoad);
    this.loadSoundSystems(scriptsToLoad);
    this.loadMinorUtilityScripts(scriptsToLoad);

    return scriptsToLoad;
  }

  static loadGameplayScripts(scriptArray) {
    scriptArray.push("/gameplay/gameplayManager.js");
    this.loadPlayerScripts(scriptArray);
    this.loadGameInteractions(scriptArray);
  }
  static loadGameInteractions(scriptArray) {
    scriptArray.push("/gameplay/interactions/movementPathManager.js");
  }
  static loadSoundSystems(scriptArray) {
    scriptArray.push(
      "/utilities/sound/soundEffectsManager.js",
      "/utilities/sound/musicManager.js"
    );
  }
  static loadInputScripts(scriptArray) {}
  static loadMinorUtilityScripts(scriptArray) {
    scriptArray.push("/utilities/misc/chadUtilities.js");
  }
  static loadPlayerScripts(scriptArray) {
    scriptArray.push(
      "/gameplay/player/playerStatus.js",
      "/gameplay/player/playerUnit.js",
      "/gameplay/player/playerPositionAndModelManager.js",
      "/gameplay/player/playerModelMovementManager.js",
      "/gameplay/player/playerLoader.js"
    );
  }
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
  static loadEssentialInitializationUtilityScripts(scriptArray) {
    scriptArray.push(
      "/initialization/config.js",
      "/initialization/logger.js",
      "/initialization/benchmarkManager.js"
    );
  }
  static loadAssetManifestScripts(scriptArray) {
    scriptArray.push(
      "/utilities/assetmanifests/assetManifest.js",
      "/utilities/assetmanifests/assetManifestOverrides.js",
      "/utilities/assetmanifests/uiAssetManifest.js",
      "/utilities/assetmanifests/soundAssetManifest.js",
      "/utilities/assetmanifests/songAssetManifest.js"
    );
  }
  static loadAssetLoadersAndManagersScripts(scriptArray) {
    scriptArray.push(
      "/utilities/loaders/positionedObject.js",
      "/utilities/loaders/modelLoader.js",
      "/utilities/loaders/animatedModelLoader.js",
      "/utilities/loaders/sceneBuilder.js"
    );
  }
  static loadUIScripts(scriptArray) {
    scriptArray.push(
      "/ui/renderSceneManager.js",
      "/ui/baseGameUI.js",
      "/ui/mainMenuUI.js",
      "/ui/experienceBarUI.js"
    );
  }
  static loadLightingScripts(scriptArray) {
    scriptArray.push(
      "/lighting/lightingColorShiftProfile.js",
      "/lighting/lightMotionProfile.js",
      "/lighting/lightingMotionPresets.js",
      "/lighting/lightingColorPresets.js",
      "/lighting/lightingPropertyCalculator.js",
      "/lighting/lightingTemplates.js",
      "/lighting/lightingObject.js",
      "/lighting/lightingExperiments.js",
      "/lighting/lightingFactory.js",
      "/lighting/lightingFrameUpdates.js",
      "/lighting/lightingManager.js",
      "/lighting/cameraManager.js"
    );
  }
}
