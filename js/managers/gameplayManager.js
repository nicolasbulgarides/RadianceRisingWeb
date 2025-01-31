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
    this.worldMapObstacleGeneator = new WorldMapObstacleGenerator(
      this.sceneBuilder
    );
    this.loadPlayer();
    this.soundEffectsManager = new SoundEffectsManager(window.baseGameUI);
    this.musicManager = new MusicManager();
    this.movementPathManager = new MovementPathManager(
      this.demoPlayer,
      this.currentMap
    );

    this.currentMap.worldObstacleTest(this.worldMapObstacleGeneator);
  }
  async loadPlayer() {
    this.demoPlayer = this.playerLoader.getDemoPlayer(this.currentMap);

    let positionedObject = this.demoPlayer
      .getPlayerPositionAndModelManager()
      .getPlayerModelPositionedObject();

    await this.sceneBuilder.loadAnimatedModel(positionedObject);
    this.gameWorldLoader.setPlayerCamera(
      this.demoPlayer.getPlayerModelDirectly()
    );

    //this.gameWorldLoader.setPlaceholderCamera();
  }

  processEndOfFrameEvents() {
    if (this.movementPathManager != null) {
      this.movementPathManager.processPossiblePlayerModelMovements();
    }
  }

  processAttemptedMovementFromUIClick(direction) {
    this.movementPathManager.processMovementByDirection(
      direction,
      Config.UNBOUNDED_MOVEMENT,
      Config.MAX_MOVEMENT,
      Config.IGNORE_OBSTACLES
    );
  }
}
