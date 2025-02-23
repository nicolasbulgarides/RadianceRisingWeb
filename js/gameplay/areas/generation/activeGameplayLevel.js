class ActiveGameplayLevel {
  /**
   * Constructs an active gameplay level instance.
   *
   * @param {Scene} hostingScene - The scene instance hosting the gameplay level.
   * @param {LevelMap} levelMap - The level map instance representing grid and obstacles.
   * @param {CameraManager} cameraManager - Manages the camera for the active level.
   * @param {LightingManager} lightingManager - Handles dynamic lighting updates.
   */
  constructor(
    hostingScene,
    gameModeRules,
    levelMap,
    cameraManager,
    lightingManager
  ) {
    this.hostingScene = hostingScene;
    this.levelMap = levelMap;
    this.cameraManager = cameraManager;
    this.lightingManager = lightingManager;
    this.gameModeRules = gameModeRules;
    this.registeredPlayers = [];
    this.currentPrimaryPlayer = null;
  }

  updateLevelMapGameModeRules(newGameModeRules) {
    this.gameModeRules = newGameModeRules;
  }
  initializeLevelLighting() {
    this.lightingManager.initializeConstructSystems(false, this.hostingScene);
  }
  /**
   * Called on every frame to update dynamic lighting effects.
   */
  onFrameEvents() {
    if (this.lightingManager != null) {
      this.lightingManager.processLightFrameCaller();
    }
  }

  getActiveGameLevelBoundary() {
    let boundary = {
      minX: 0,
      minY: 0, // Assuming the game level has constant Y-level movement.
      minZ: 0,
      maxX: this.levelMap.mapWidth - 1,
      maxY: 0,
      maxZ: this.levelMap.mapDepth - 1,
    };

    return boundary;
  }
  registerCurrentPrimaryPlayer(playerToRegister) {
    this.registeredPlayers.push(playerToRegister);
    this.currentPrimaryPlayer = playerToRegister;
  }

  updateCurrentPrimaryPlayer(newPrimaryPlayer) {
    this.currentPrimaryPlayer = newPrimaryPlayer;
  }
  /**
   * Configures the camera to follow the player and sets lighting for the player model.
   *
   * @param {Player} player - The player instance to follow.
   */
  setPlayerCamera(player) {
    // After the player model is loaded, configure the camera to chase the player.

    let cameraToDispose =
      FundamentalSystemBridge.renderSceneSwapper.allStoredCameras[
        this.hostingScene
      ];

    let model = player.playerMovementManager.getPlayerModelDirectly();
    // Update the camera to chase the player's model.
    this.cameraManager.setCameraToChase(this.hostingScene, model);

    FundamentalSystemBridge.renderSceneSwapper.disposeAndDeleteCamera(
      cameraToDispose
    );
  }

  async loadRegisteredPlayerModel(player, switchCameraToFollowPlayer) {
    if (player != null) {
      let positionedObject =
        player.playerMovementManager.getPlayerModelPositionedObject();

      let relevantBuilder =
        FundamentalSystemBridge.renderSceneSwapper.getSceneBuilderByScene(
          this.hostingScene
        );
      // Asynchronously load the animated player model.
      await relevantBuilder.loadAnimatedModel(positionedObject);

      if (switchCameraToFollowPlayer) {
        this.setPlayerCamera(player);
      }
      return true;
    }
  }
}
