class ActiveGameplayLevel {
  /**
   * Constructs an active gameplay level instance.
   *
   * @param {Scene} hostingScene - The scene instance hosting the gameplay level.
   * @param {LevelMap} levelMap - The level map instance representing grid and obstacles.
   * @param {CameraManager} cameraManager - Manages the camera for the active level.
   * @param {LightingManager} lightingManager - Handles dynamic lighting updates.
   */
  constructor(hostingScene, levelMap, cameraManager, lightingManager) {
    this.hostingScene = hostingScene;
    this.levelMap = levelMap;
    this.cameraManager = cameraManager;
    this.lightingManager = lightingManager;
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

  registerPlayer(playerToRegister) {
    this.player = playerToRegister;
  }
  /**
   * Configures the camera to follow the player and sets lighting for the player model.
   *
   * @param {Player} player - The player instance to follow.
   */
  setPlayerCamera() {
    let model = this.player
      .getPlayerPositionAndModelManager()
      .getPlayerModelDirectly();
    // Update the camera to chase the player's model.
    this.cameraManager.setCameraToChase(this.hostingScene, model);

    console.log("Camera set to chase player.");
  }

  async loadRegisteredPlayerModel() {
    if (this.player != null) {
      let positionedObject = this.player
        .getPlayerPositionAndModelManager()
        .getPlayerModelPositionedObject();

      let relevantBuilder =
        FundamentalSystemBridge.renderSceneSwapper.getSceneBuilderByScene(
          this.hostingScene
        );
      // Asynchronously load the animated player model.
      await relevantBuilder.loadAnimatedModel(positionedObject);
      // After the player model is loaded, configure the camera to chase the player.
      let cameraToDispose =
        FundamentalSystemBridge.renderSceneSwapper.allStoredCameras[
          this.hostingScene
        ];
      if (cameraToDispose != null) {
        cameraToDispose.dispose();
      }
      this.setPlayerCamera();
    }
  }
}
