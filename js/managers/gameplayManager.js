class GameplayManager {
  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;

    this.demoPlayer = null;
    this.playerLoader = new PlayerLoader();
    this.gameWorldLoader = new GameWorldLoader(this.sceneBuilder);
    this.currentMap = null;
  }

  async initializeGameplay() {
    this.currentMap = await this.gameWorldLoader.loadDemoWorldTest();
    this.loadPlayer();
    this.soundEffectsManager = new SoundEffectsManager(window.baseGameUI);
    this.musicManager = new MusicManager();
    this.movementPathManager = new MovementPathManager(this.demoPlayer);
  }
  async loadPlayer() {
    this.demoPlayer = this.playerLoader.getDemoPlayer(this.currentMap);

    let positionedObject = this.demoPlayer
      .getPlayerPositionAndModelManager()
      .getPlayerModelPositionedObject();

    this.sceneBuilder.registerGameWorldLoader(
      this.gameWorldLoader,
      this.demoPlayer
    );
    await this.sceneBuilder.loadAnimatedModel(positionedObject);

    //this.gameWorldLoader.setPlaceholderCamera();
    console.log("CAMERA FINALIZED!");
  }

  processEndOfFrameEvents() {
    // this.movementPathManager.processPossiblePlayerModelMovements();
  }

  processAttemptedMovementFromUIClick(direction) {
    this.movementPathManager.processMovementByDirection(
      this.demoPlayer,
      direction
    );
  }
}
