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
   * Creates an instance of GameplayManagerComposite.
   * Initializes gameplay variables and starts the composite initialization process.
   */
  constructor() {
    // Initialize gameplay variables and start the composite initialization.
    this.initializeVariables();
  }

  /**
   * Initializes variables to track active players, gameplay levels, and game modes.
   */
  initializeVariables() {
    this.primaryActivePlayer = null; // The main player currently active in the game.
    this.allActivePlayers = []; // Array to hold all players currently in the game.
    this.primaryActiveGameplayLevel = null; // The main gameplay level currently active.
    this.allActiveGameplayLevels = []; // Array to hold all gameplay levels.
    this.primaryActiveGameMode = null; // The main game mode currently active.
    this.allActiveGameModes = []; // Array to hold all game modes.
  }

  /**
   * Processes orders received from the TestManager.
   * This method ensures that test orders are processed if a TestManager instance is available.
   */
  async processOrdersFromTestManager() {
    if (FundamentalSystemBridge.testManager instanceof TestManager) {
      FundamentalSystemBridge.testManager.processTestOrders(this);
    }
  }

  /**
   * Loads the demo player into the game.
   * Retrieves the player model and ensures animations are loaded via SceneBuilder.
   * @param {Object} activeGameplayLevel - The current gameplay level where the player will be loaded.
   * @param {Object} playerToLoad - The player instance to be loaded into the level.
   */
  async loadPlayerToGameplayLevel(activeGameplayLevel, playerToLoad) {
    let proceed = LevelFactoryComposite.checkTilesLoaded(); // Check if tiles are loaded.

    if (proceed) {
      // Retrieve demo player instance with appropriate positioning.
      this.allActivePlayers.push(playerToLoad); // Add the player to the active players list.
      activeGameplayLevel.registerCurrentPrimaryPlayer(playerToLoad); // Register the player in the active level.
      activeGameplayLevel.loadRegisteredPlayerModel(playerToLoad, true); // Load the player's model.
    }
  }

  /**
   * Processes various end-of-frame events.
   * This includes updates for player movement and processing level events.
   */
  processEndOfFrameEvents() {
    // Delegate end-of-frame processing to the coordinator.
    GameplayEndOfFrameCoordinator.processEndOfFrameEvents(this);
  }

  /**
   * Processes movement input coming from the UI.
   * Translates UI direction commands to player model movements.
   *
   * Note the method intelligently determines various factors, such as the primary game level's game mode
   * rules including if movement is bounded or not, what max distance, and if obstacles are bypassed.
   * @param {string} clickedDirection - The direction input from the UI click.
   */
  processAttemptedMovementFromUIClick(clickedDirection) {
    let currentPlayer = this.primaryActiveGameplayLevel.currentPrimaryPlayer; // Get the current player.
    if (ValidActionChecker.canMove(currentPlayer, clickedDirection)) {
      // Check if the player can move.
      let destinationVector =
        MovementDestinationCalculator.getProposedDestination(
          clickedDirection,
          currentPlayer,
          this.primaryActiveGameplayLevel
        ); // Calculate the proposed destination based on the clicked direction.

      if (destinationVector instanceof BABYLON.Vector3) {
        currentPlayer.playerMovementManager.setDestinationAndBeginMovement(
          destinationVector,
          currentPlayer // Set the destination and start movement for the player.
        );
      }
    }
  }

  /**
   * Sets the active gameplay level.
   * This method can be extended to handle transitions between levels as needed.
   * @param {Object} activeGameplayLevel - The new active gameplay level to set.
   */
  setActiveGameplayLevel(activeGameplayLevel) {
    // Set the primary active gameplay level.
    this.primaryActiveGameplayLevel = activeGameplayLevel;
  }
}
