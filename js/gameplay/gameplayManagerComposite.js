/**
 * GameplayManagerComposite
 *
 * This class orchestrates the core gameplay elements:
 * - Loads the game level via GameLevelLoader.
 * - Loads and positions the player using PlayerLoader.
 * - Sets up additional game systems such as sound, music, and movement processing.
 *
 * It is invoked by the engine initialization sequence to kickstart gameplay initialization.
 */
class GameplayManagerComposite {
  /**
   * Creates an instance of GameplayManagerComposite
   */
  constructor() {
    // Instead of calling systems initialization consecutively,
    // call a composite async initializer that handles waiting.
    this.initializeComposite();
  }

  // NEW: Composite initializer method.
  async initializeComposite() {
    FundamentalSystemBridge.registerGamemodeManager(
      new GamemodeManager(Config.DEFAULT_GAME_MODE)
    );
    // Wait for support systems (including grid tile loading) to finish.
    await this.initializeGameplaySupportSystems();
    // Now that all support systems including tile loading are ready, initialize gameplay.
    await this.initializeGameplayTestA();
  }

  // Modified to be asynchronous to await grid tile loading.
  async initializeGameplaySupportSystems() {
    this.playerLoader = new PlayerLoader();
    // Loader to handle game level initialization based on SceneBuilder.
    this.levelFactoryComposite = new LevelFactoryComposite();
    // Await support system loading if the method returns a promise.
    let finishedLoading =
      await this.levelFactoryComposite.loadFactorySupportSystems();

    // Instantiate game grid generator and wait for all 6 tile models to load.

    this.gameGridGenerator = new GameGridGenerator();
    const areTilesLoaded =
      await this.gameGridGenerator.loadTilesModelsDefault();
    if (!areTilesLoaded) {
      GameplayLogger.lazyLog(
        "GameplaySupportSystems: Failed to load all grid tile models.",
        "GameplayManagerComposite"
      );
      // Optionally, handle errors (e.g. retry or prevent further initialization).
    }
  }

  /**
   * Initializes gameplay systems.
   * Loads the demo level, sets up obstacles, players, sound, music, and movement management.
   */
  async initializeGameplayTestA() {
    this.validActionChecker = new ValidActionChecker();
    this.activeGameplayLevel =
      await this.levelFactoryComposite.loadDemoLevelTest();
    this.levelFactoryComposite.renderActiveDemoGameplayLevel(
      this.activeGameplayLevel
    );
    // Load and position player into the current level.
    this.loadPlayerToSpecifiedGameplayLevel(this.activeGameplayLevel);
  }

  /**
   * Loads the demo player into the game.
   * Retrieves the player model and ensures animations are loaded via SceneBuilder.
   */
  async loadPlayerToSpecifiedGameplayLevel(activeGameplayLevel) {
    // Retrieve demo player instance with appropriate positioning.
    let demoPlayer = this.playerLoader.getDemoPlayer(
      activeGameplayLevel.levelMap
    );
    activeGameplayLevel.registerPlayer(demoPlayer);

    // Setup movement management linked to the player and the current map.
    this.movementPathManager = new MovementPathManager(
      demoPlayer,
      activeGameplayLevel
    );

    // Await the asynchronous player model load.
    await activeGameplayLevel.loadRegisteredPlayerModel();
    // Removed redundant explicit camera chase call.
    // The camera is now set to chase the player within loadRegisteredPlayerModel
  }

  /**
   * Processes various end-of-frame events.
   * This includes updates for player movement and processing level events.
   */
  processEndOfFrameEvents() {
    if (this.movementPathManager != null) {
      this.movementPathManager.processPossiblePlayerModelMovements();
    }
    if (this.activeGameplayLevel != null) {
      this.activeGameplayLevel.onFrameEvents();
    }
  }

  /**
   * Processes movement input coming from the UI.
   * Translates UI direction commands to player model movements.
   *
   * @param {string} direction - The direction input from the UI click.
   */
  processAttemptedMovementFromUIClick(direction) {
    if (!this.checkIfPlayerCanMove(this.activeGameplayLevel.player)) return;

    let gamemodeRules =
      FundamentalSystemBridge.gamemodeManager.CURRENT_GAMEMODE;

    let destinationVector = this.movementPathManager.processMovementByDirection(
      direction,
      gamemodeRules.MOVEMENT_IS_BOUNDED,
      gamemodeRules.MAX_MOVEMENT_DISTANCE,
      gamemodeRules.OBSTACLES_ARE_IGNORED,
      this.activeGameplayLevel
    );

    if (
      destinationVector != null &&
      destinationVector !=
        this.activeGameplayLevel.player.getPlayerPositionAndModelManager()
          .currentPosition
    ) {
    } else {
      GameplayLogger.lazyLog(
        "Destination vector is the same as the current position vector or is null",
        "GameplayManagerComposite",
        0
      );
    }
  }

  registerActiveGameplayLevel(activeGameplayLevel) {
    this.activeGameplayLevel = activeGameplayLevel;
  }

  processFrameEvents() {
    if (this.activeGameplayLevel != null) {
      this.activeGameplayLevel.processFrameEvents();
    }
  }

  checkIfPlayerCanMove(player) {
    let canMove = this.validActionChecker.checkIfAllowedToMove(player);

    if (!canMove) {
      this.validActionChecker.logInvalidMovementAttempt(
        direction,
        this.activeGameplayLevel.player
      );
    }
    return canMove;
  }
}
