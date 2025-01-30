class GameplayManager {
  constructor(sceneBuilder, cameraManager) {
    this.sceneBuilder = sceneBuilder;
    loadLighting();

    this.cameraManager = cameraManager;
    this.demoPlayer = null;
    this.movementPathManager = new MovementPathManager();
    this.playerLoader = new PlayerLoader();
    this.gameWorldLoader = new GameWorldLoader(this.sceneBuilder);
  }

  loadLighting() {
    this.lightingManager = new LightingManager(
      this.sceneBuilder.getGameWorldScene(),
      Config.LIGHTING_PRESET
    );
  }
  async initializeGameplay() {
    this.loadPlayer();
  }
  async loadPlayer() {
    this.demoPlayer = this.playerLoader.getDemoPlayer("Nicolas");
    await this.sceneBuilder.loadAnimatedModel(this.demoPlayer.getPlayerModel());
    this.cameraManager.setCameraToChase(playerModelObject.model);
    this.movementPathManager.registerPlayer(this.demoPlayer);
  }

  processEndOfFrameEvents() {
    this.movementManager.processPossibleModelMovements();
  }

  processAttemptedMovementFromUIClick(direction) {
    this.movementPathManager.processMovementByDirection(
      this.demoPlayer,
      direction
    );
  }
}
