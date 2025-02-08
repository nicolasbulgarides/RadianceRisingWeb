/**
 * GameplayManager
 *
 * This class orchestrates the core gameplay elements:
 * - Loads the game world via GameWorldLoader.
 * - Loads and positions the player using PlayerLoader.
 * - Sets up additional game systems such as sound, music, and movement processing.
 * 
 * It is invoked by the engine initialization sequence to kickstart gameplay initialization.
 */
class GameplayManager {
  /**
   * Creates an instance of GameplayManager.
   *
   * @param {SceneBuilder} sceneBuilder - An instance of the SceneBuilder that handles loading
   *                                      and managing Babylon.js scenes and assets.
   */
  constructor(sceneBuilder) {
    // The SceneBuilder instance provides functionalities for loading assets into the scene.
    this.sceneBuilder = sceneBuilder;

    // Instance that helps in managing player related functionalities.
    this.demoPlayer = null;
    this.playerLoader = new PlayerLoader();
    // Loader to handle game world/map initialization based on SceneBuilder.
    this.gameWorldLoader = new GameWorldLoader(this.sceneBuilder);
    this.currentMap = null;
  }

  /**
   * Initializes gameplay systems.
   * Loads the demo world, sets up obstacles, players, sound, music, and movement management.
   */
  async initializeGameplay() {
    // Load a test demo world asynchronously.
    this.currentMap = await this.gameWorldLoader.loadDemoWorldTest();
    
    // Initialize world obstacle generator for the demo world.
    this.worldMapObstacleGeneator = new WorldMapObstacleGenerator(this.sceneBuilder);
    
    // Load and position player into the current world.
    this.loadPlayer();
    
    // Initialize sound effects and music managers.
    this.soundEffectsManager = new SoundEffectsManager(window.baseGameUI);
    this.musicManager = new MusicManager();
    
    // Setup movement management linked to the player and the current map.
    this.movementPathManager = new MovementPathManager(this.demoPlayer, this.currentMap);

    // Run any test obstacle generation functions on the current map.
    this.currentMap.worldObstacleTest(this.worldMapObstacleGeneator);
  }
  
  /**
   * Loads the demo player into the game.
   * Retrieves the player model and ensures animations are loaded via SceneBuilder.
   */
  async loadPlayer() {
    // Retrieve demo player instance with appropriate positioning.
    this.demoPlayer = this.playerLoader.getDemoPlayer(this.currentMap);

    let positionedObject = this.demoPlayer
      .getPlayerPositionAndModelManager()
      .getPlayerModelPositionedObject();

    // Load the animated player model asynchronously.
    await this.sceneBuilder.loadAnimatedModel(positionedObject);
    
    // Set camera following behavior to this player.
    this.gameWorldLoader.setPlayerCamera(this.demoPlayer);

    // Optionally, placeholder camera can be used for debugging.
    // this.gameWorldLoader.setPlaceholderCamera();
  }

  /**
   * Processes various end-of-frame events.
   * This includes updates for player movement and processing world events.
   */
  processEndOfFrameEvents() {
    if (this.movementPathManager != null) {
      this.movementPathManager.processPossiblePlayerModelMovements();
    }
    if (this.gameWorldLoader != null) {
      this.gameWorldLoader.onFrameEvents();
    }
  }

  /**
   * Processes movement input coming from the UI.
   * Translates UI direction commands to player model movements.
   *
   * @param {string} direction - The direction input from the UI click.
   */
  processAttemptedMovementFromUIClick(direction) {
    this.movementPathManager.processMovementByDirection(
      direction,
      Config.UNBOUNDED_MOVEMENT,
      Config.MAX_MOVEMENT,
      Config.IGNORE_OBSTACLES
    );
  }
}
