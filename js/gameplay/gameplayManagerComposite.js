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
// Global flag to disable gameplay manager logging (set to false to enable logging)
const GAMEPLAY_MANAGER_LOGGING_ENABLED = false;

// Helper function for conditional gameplay manager logging
function gameplayManagerLog(...args) {
  if (GAMEPLAY_MANAGER_LOGGING_ENABLED) {
    console.log(...args);
  }
}

class GameplayManagerComposite {
  /**
   * Creates an instance of GameplayManagerComposite.
   * Initializes gameplay variables and starts the composite initialization process.
   */
  constructor() {
    // Debug mode - set to true for detailed logging
    this.DEBUG_MODE = false;

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
    if (this.DEBUG_MODE) console.log("[GAMEPLAY MANAGER] Reset for new level - main player can be loaded");
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
   * @param {ActiveGameplayLevel} activeGameplayLevel - The current gameplay level where the player will be loaded.
   * @param {PlayerUnit} playerToLoad - The player instance to be loaded into the level.
   */
  async loadPlayerToGameplayLevel(activeGameplayLevel, playerToLoad) {    // CRITICAL: Check if main player has already been loaded to prevent ghost models
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

      // Retrieve demo player instance with appropriate positioning.
      this.allActivePlayers.push(playerToLoad); // Add the player to the active players list.
      this.primaryActivePlayer = playerToLoad;
      activeGameplayLevel.registerCurrentPrimaryPlayer(playerToLoad); // Register the player in the active level.
      await activeGameplayLevel.loadRegisteredPlayerModel(playerToLoad, true); // Load the player's model.
      return proceed;
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
    if (window.RenderController) window.RenderController.markDirty();
    gameplayManagerLog(`[MOVEMENT INPUT] ▶ Received direction: ${clickedDirection}`);

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

    gameplayManagerLog(`[MOVEMENT INPUT] Player found:`, currentPlayer);

    // Check if the player can move.
    if (ValidActionChecker.canMove(currentPlayer, clickedDirection)) {
      gameplayManagerLog(`[MOVEMENT INPUT] ✓ Player can move ${clickedDirection}`);

      // Calculate the proposed destination based on the clicked direction.
      let destinationVector = MovementDestinationManager.getDestinationVector(
        clickedDirection,
        this.primaryActiveGameplayLevel,
        currentPlayer
      );

      if (destinationVector instanceof BABYLON.Vector3) {
        gameplayManagerLog(`[MOVEMENT INPUT] Destination: (${destinationVector.x}, ${destinationVector.y}, ${destinationVector.z})`);

        // IMPORTANT: Reset all spike trap flags at the START of each movement
        // This allows each spike to hit once per movement
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (microEventManager) {
          microEventManager.resetDamageEventFlagsForLevel();
        }

        // Record movement for replay
        const moveStartPosition = currentPlayer.playerMovementManager.getPositionVector();
        GameEventBus.emit("gameInteraction", {
          type: "move",
          direction: clickedDirection,
          startPosition: moveStartPosition,
          destinationPosition: destinationVector
        });

        // Schedule explosions for this movement based on predicted collisions
        const startPosition = currentPlayer.playerMovementManager.getPositionVector();
        const speed = currentPlayer.playerStatus.currentMaxSpeed;
        if (window.ExplosionScheduler) {
          window.ExplosionScheduler.scheduleExplosionsForMovement(
            currentPlayer,
            startPosition,
            destinationVector,
            speed,
            GameplayEndOfFrameCoordinator.frameCounter
          );
        }

        currentPlayer.playerMovementManager.setDestinationAndBeginMovement(
          destinationVector,
          currentPlayer // Set the destination and start movement for the player.
        );

        gameplayManagerLog(`[MOVEMENT INPUT] ✓ Movement started`);
      } else {
        gameplayManagerLog(`[MOVEMENT INPUT] ✗ Invalid destination vector`);
      }
    } else {
      gameplayManagerLog(`[MOVEMENT INPUT] ✗ Player cannot move ${clickedDirection}`);
    }
  }

  /**
   * Sets the active gameplay level.
   * This method can be extended to handle transitions between levels as needed.
   * @param {ActiveGameplayLevel} activeGameplayLevel - The new active gameplay level to set.
   */
  setActiveGameplayLevel(activeGameplayLevel) {
    if (activeGameplayLevel == null) {
      console.error("[GAMEPLAY MANAGER] Active gameplay level in setter is null, cannot set active gameplay level");
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
    console.log("[GAMEPLAY MANAGER] ✓ primaryActiveGameplayLevel set successfully");

    // Replace entire array — only track current level to prevent memory growth
    this.allActiveGameplayLevels = [activeGameplayLevel];
  }
}
