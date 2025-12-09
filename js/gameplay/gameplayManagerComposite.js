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
    this.loadGameplayManagementSystems();
  }

  loadGameplayManagementSystems() {
    FundamentalSystemBridge.registerSpecialOccurrenceManager(
      new SpecialOccurrenceManager()
    );
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
    this.mainPlayerLoadedForCurrentLevel = false; // CRITICAL: Ensures main player only loads once per level
  }

  /**
   * Resets the mainPlayerLoadedForCurrentLevel flag when loading a new level.
   * Call this at the start of level loading to allow the main player to be loaded.
   */
  resetForNewLevel() {
    this.mainPlayerLoadedForCurrentLevel = false;
    console.log("[GAMEPLAY MANAGER] Reset for new level - main player can be loaded");
  }

  /**
   * Processes orders received from the TestManager.
   * This method ensures that test orders are processed if a TestManager instance is available.
   */
  async processOrdersFromTestManager() {
    if (FundamentalSystemBridge["testManager"] instanceof TestManager) {
      await FundamentalSystemBridge["testManager"].processTestOrders(this);
    }
  }

  /**
   * Loads the MAIN player into the game. This should only be called ONCE per level.
   * CRITICAL: This is for the MAIN gameboard player ONLY. 
   * For replay duplicate players, use loadReplayDuplicatePlayer() instead.
   * @param {Object} activeGameplayLevel - The current gameplay level where the player will be loaded.
   * @param {Object} playerToLoad - The player instance to be loaded into the level.
   */
  async loadPlayerToGameplayLevel(activeGameplayLevel, playerToLoad) {
    // CRITICAL: Check if main player has already been loaded to prevent ghost models
    if (this.mainPlayerLoadedForCurrentLevel) {
      console.error("[PLAYER LOAD] ⛔ BLOCKED - Main player already loaded for this level!");
      console.trace("[PLAYER LOAD] Blocked stack trace:");
      return false;
    }

    // Check if we're in a death/reset sequence - if so, block player loading
    const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
    if (levelResetHandler && levelResetHandler.isResetting) {
      console.error("[PLAYER LOAD] ⛔ BLOCKED - Cannot load player during reset sequence!");
      return false;
    }

    // Check if player has ever died - if so, block new player creation (prevents async ghost models)
    if (levelResetHandler && levelResetHandler.hasEverDied) {
      console.error("[PLAYER LOAD] ⛔ BLOCKED - Player has died, cannot create new player!");
      return false;
    }

    let proceed = LevelFactoryComposite.checkTilesLoaded(); // Check if tiles are loaded.

    if (proceed) {
      // Ensure player is a valid PlayerUnit instance
      if (!(playerToLoad instanceof PlayerUnit)) {
        GameplayLogger.lazyLog(
          "Invalid player instance provided to loadPlayerToGameplayLevel",
          "GameplayManagerComposite"
        );
        return false;
      }

      // Mark that main player has been loaded for this level
      this.mainPlayerLoadedForCurrentLevel = true;
      console.log("[PLAYER LOAD] ✓ Loading MAIN player (first and only time for this level)");

      // Retrieve demo player instance with appropriate positioning.
      this.allActivePlayers.push(playerToLoad); // Add the player to the active players list.
      this.primaryActivePlayer = playerToLoad;
      activeGameplayLevel.registerCurrentPrimaryPlayer(playerToLoad); // Register the player in the active level.
      activeGameplayLevel.loadRegisteredPlayerModel(playerToLoad, true); // Load the player's model.
      console.log("[PLAYER LOAD] ✓ Main player model loaded, allActivePlayers count:", this.allActivePlayers.length);
      return proceed;
    }
    return false;
  }

  /**
   * Loads a REPLAY DUPLICATE player. This is separate from the main player and doesn't affect game state.
   * CRITICAL: This should ONLY be used by the LevelReplayManager for visual replay purposes.
   * @param {Object} duplicateLevel - The duplicate level for replays.
   * @param {Object} duplicatePlayer - The duplicate player instance for replays.
   */
  async loadReplayDuplicatePlayer(duplicateLevel, duplicatePlayer) {
    // Check if we're in a death/reset sequence - if so, block
    const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
    if (levelResetHandler && (levelResetHandler.isResetting || levelResetHandler.hasEverDied)) {
      console.error("[REPLAY PLAYER] ⛔ BLOCKED - Cannot load replay player during/after death!");
      return false;
    }

    let proceed = LevelFactoryComposite.checkTilesLoaded();

    if (proceed) {
      if (!(duplicatePlayer instanceof PlayerUnit)) {
        console.error("[REPLAY PLAYER] Invalid player instance");
        return false;
      }

      console.log("[REPLAY PLAYER] Loading replay duplicate player (visual only, not main game)");

      // DO NOT add to allActivePlayers - this is only for visual replay
      // DO NOT set as primaryActivePlayer - this would break game controls
      // Register with the DUPLICATE level only
      duplicateLevel.registerCurrentPrimaryPlayer(duplicatePlayer);

      // Load the model (visual only)
      await duplicateLevel.loadRegisteredPlayerModel(duplicatePlayer, false); // false = don't switch camera

      console.log("[REPLAY PLAYER] ✓ Replay duplicate player loaded (visual only)");
      return true;
    }
    return false;
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
    console.log(`[MOVEMENT INPUT] ▶ Received direction: ${clickedDirection}`);

    // Verify we have a valid level
    if (!this.primaryActiveGameplayLevel) {
      console.error("[MOVEMENT INPUT] ✗ No primaryActiveGameplayLevel!");
      return;
    }

    let currentPlayer = this.primaryActiveGameplayLevel.currentPrimaryPlayer; // Get the current player.

    // Verify we have a valid player
    if (!currentPlayer) {
      console.error("[MOVEMENT INPUT] ✗ No currentPrimaryPlayer in level!");
      return;
    }

    console.log(`[MOVEMENT INPUT] Player found:`, currentPlayer);

    // Check if the player can move.
    if (ValidActionChecker.canMove(currentPlayer, clickedDirection)) {
      console.log(`[MOVEMENT INPUT] ✓ Player can move ${clickedDirection}`);

      // Calculate the proposed destination based on the clicked direction.
      let destinationVector = MovementDestinationManager.getDestinationVector(
        clickedDirection,
        this.primaryActiveGameplayLevel,
        currentPlayer
      );

      if (destinationVector instanceof BABYLON.Vector3) {
        console.log(`[MOVEMENT INPUT] Destination: (${destinationVector.x}, ${destinationVector.y}, ${destinationVector.z})`);

        // IMPORTANT: Reset all spike trap flags at the START of each movement
        // This allows each spike to hit once per movement
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (microEventManager) {
          microEventManager.resetDamageEventFlagsForLevel();
        }

        // Record movement for replay
        const movementTracker = FundamentalSystemBridge["movementTracker"];
        if (movementTracker && movementTracker.isTracking) {
          const startPosition = currentPlayer.playerMovementManager.getPositionVector();
          movementTracker.recordMovement(clickedDirection, startPosition, destinationVector);
        }

        currentPlayer.playerMovementManager.setDestinationAndBeginMovement(
          destinationVector,
          currentPlayer // Set the destination and start movement for the player.
        );

        console.log(`[MOVEMENT INPUT] ✓ Movement started`);
      } else {
        console.warn(`[MOVEMENT INPUT] ✗ Invalid destination vector`);
      }
    } else {
      console.warn(`[MOVEMENT INPUT] ✗ Player cannot move ${clickedDirection}`);
    }
  }

  /**
   * Sets the active gameplay level.
   * This method can be extended to handle transitions between levels as needed.
   * @param {Object} activeGameplayLevel - The new active gameplay level to set.
   */
  setActiveGameplayLevel(activeGameplayLevel) {
    if (activeGameplayLevel == null) {
      GameplayLogger.lazyLog(
        "Active gameplay level in setter is null, cannot set active gameplay level"
      );
      return;
    }

    if (!(activeGameplayLevel instanceof ActiveGameplayLevel)) {
      GameplayLogger.lazyLog(
        "Active gameplay level is not an instance of ActiveGameplayLevel"
      );
      return;
    }

    // Set the primary active gameplay level.
    this.primaryActiveGameplayLevel = activeGameplayLevel;

    // Also track in allActiveGameplayLevels if not already there
    if (!this.allActiveGameplayLevels.includes(activeGameplayLevel)) {
      this.allActiveGameplayLevels.push(activeGameplayLevel);
    }
  }
}
