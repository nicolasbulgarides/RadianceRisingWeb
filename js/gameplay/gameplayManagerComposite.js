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
    this.initializeVariables();
    this.initializeComposite();
  }

  initializeVariables() {
    this.primaryActivePlayer = null;
    this.allActivePlayers = [];
    this.primaryActiveGameplayLevel = null;
    this.allActiveGameplayLevels = [];
    this.primaryActiveGameMode = null;
    this.allActiveGameModes = [];
  }
  // NEW: Composite initializer method.
  async initializeComposite() {
    // Wait for support systems (including grid tile loading) to finish.
    await this.initializeGameplaySupportSystems();
    // Now that all support systems including tile loading are ready, initialize gameplay.
    await this.initializeGameplayTestA();
  }

  // Modified to be asynchronous to await grid tile loading.
  async initializeGameplaySupportSystems() {
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
    this.primaryActiveGameplayLevel =
      await this.levelFactoryComposite.loadDemoLevelTest();
    this.levelFactoryComposite.renderActiveDemoGameplayLevel(
      this.primaryActiveGameplayLevel
    );
    // Load and position player into the current level.
    this.loadPlayerToSpecifiedGameplayLevel(this.primaryActiveGameplayLevel);
  }

  /**
   * Loads the demo player into the game.
   * Retrieves the player model and ensures animations are loaded via SceneBuilder.
   */
  async loadPlayerToSpecifiedGameplayLevel(activeGameplayLevel) {
    // Retrieve demo player instance with appropriate positioning.
    let demoPlayer = PlayerLoader.getDemoPlayer(activeGameplayLevel.levelMap);
    this.allActivePlayers.push(demoPlayer);
    activeGameplayLevel.registerCurrentPrimaryPlayer(demoPlayer);
    activeGameplayLevel.loadRegisteredPlayerModel(demoPlayer, true);

    // Removed redundant explicit camera chase call.
    // The camera is now set to chase the player within loadRegisteredPlayerModel
  }

  /**
   * Processes various end-of-frame events.
   * This includes updates for player movement and processing level events.
   */
  processEndOfFrameEvents() {
    GameplayEndOfFrameCoordinator.processEndOfFrameEvents(this);
  }

  /**
   * Processes movement input coming from the UI.
   * Translates UI direction commands to player model movements.
   *
   * @param {string} direction - The direction input from the UI click.
   */
  processAttemptedMovementFromUIClick(clickedDirection) {
    if (
      !ValidActionChecker.canMove(
        this.primaryActiveGameplayLevel.currentPrimaryPlayer
      )
    ) {
      return;
    } else {
      let currentPlayer = this.primaryActiveGameplayLevel.currentPrimaryPlayer;
      let destinationVector =
        MovementDestinationCalculator.getProposedDestination(
          clickedDirection,
          currentPlayer,
          this.primaryActiveGameplayLevel
        );
      if (destinationVector instanceof BABYLON.Vector3) {
        currentPlayer.playerMovementManager.setDestination(destinationVector);
        currentPlayer.playerMovementManager.startMovement(Config.DEFAULT_SPEED);
      }
    }
  }

  setActiveGameplayLevel(activeGameplayLevel) {
    //to do -  behavior as needed for transition between current levels
    this.primaryActiveGameplayLevel = activeGameplayLevel;
  }
}
