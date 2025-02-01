class ScriptManifest {
  constructor() {
    console.log("YES I RAN");
  }
  static getScriptsToLoad() {
    const scriptsToLoad = [
      "/utilities/config.js",
      "/utilities/logger.js",
      "/utilities/sceneBuilder.js",
      "/utilities/soundAssetManifest.js",
      "/managers/benchmarkManager.js",
      "/utilities/uiAssetManifest.js",
      "/utilities/songAssetManifest.js",
      "/utilities/assetManifestOverrides.js",
      "/utilities/assetManifest.js",
      "/utilities/modelLoader.js",
      "/utilities/animatedModelLoader.js",
      "/managers/renderSceneManager.js",
      "/utilities/gameGridGenerator.js",
      "/ui/baseGameUI.js",
      "/ui/mainMenuUI.js",
      "/ui/experienceBarUI.js",
      "/enums/cameraEnums.js",
      "/enums/lightingEnums.js",
      "/managers/cameraManager.js",
      "/managers/lightingManager.js",
      "/utilities/positionedObject.js",
      "/utilities/gameWorldLoader.js",
      "/managers/gameplayManager.js",
      "/utilities/worldData.js",
      "/gameplay/worldMap.js",
      "/gameplay/worldMapObstacleGenerator.js",
      "/gameplay/boardSlot.js",
      "/gameplay/playerStatus.js",
      "/utilities/playerLoader.js",
      "/managers/soundEffectsManager.js",
      "/managers/musicManager.js",
      "/gameplay/obstacle.js",
      "/utilities/obstacleFinder.js",
      "/utilities/mainInputManager.js",
      "/managers/velocityManager.js",
      "/managers/playerPositionAndModelManager.js",
      "/managers/playerModelMovementManager.js",
      "/managers/movementPathManager.js",
      "/gameplay/playerUnit.js",
      "/initialization/chadUtilities.js",
    ];

    return scriptsToLoad;
  }
}
