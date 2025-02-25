/**
 * ActiveGameplayLevel represents the primary gameplay object used by the gameplay manager.
 * It serves as the central hub for managing the active state of a level during gameplay,
 * coordinating between various subsystems like lighting, camera, and player management.
 *
 * Key Components:
 * - LevelMap: Contains the physical grid layout and board slots
 * - Camera Management: Handles player following and scene visualization
 * - Lighting Management: Controls dynamic lighting effects
 * - Player Management: Tracks active players and their states
 *
 * This class bridges the gap between static level data (LevelDataComposite) and
 * the actual running gameplay instance.
 */
class ActiveGameplayLevel {
  /**
   * Constructs an active gameplay level instance.
   * This is the runtime representation of a level, created from LevelDataComposite
   * but enhanced with active gameplay elements and state management.
   *
   * @param {Scene} hostingScene - The scene instance hosting the gameplay level.
   * @param {GamemodeGeneric} gameModeRules - Rules and constraints for the current game mode.
   * @param {LevelMap} levelMap - The level map instance representing grid and obstacles.
   * @param {CameraManager} cameraManager - Manages the camera for the active level.
   * @param {LightingManager} lightingManager - Handles dynamic lighting updates.
   */
  constructor(
    hostingScene,
    gameModeRules,
    levelMap,
    cameraManager,
    lightingManager
  ) {
    this.hostingScene = hostingScene; // The scene where the gameplay occurs.
    this.levelMap = levelMap; // The map representing the level's grid and obstacles.
    this.cameraManager = cameraManager; // The manager responsible for camera behavior.
    this.lightingManager = lightingManager; // The manager responsible for lighting effects.
    this.gameModeRules = gameModeRules; // Rules governing the current game mode.
    this.registeredPlayers = []; // Array to hold registered players in the level.
    this.currentPrimaryPlayer = null; // The player currently active in the level.
  }

  /**
   * Updates the game mode rules for the level.
   * @param {Object} newGameModeRules - The new game mode rules to apply.
   */
  updateLevelMapGameModeRules(newGameModeRules) {
    this.gameModeRules = newGameModeRules; // Update the game mode rules.
  }

  /**
   * Initializes the lighting for the level.
   * This method sets up the lighting systems based on the current scene.
   */
  initializeLevelLighting() {
    this.lightingManager.initializeConstructSystems(false, this.hostingScene); // Initialize lighting systems.
  }

  /**
   * Called on every frame to update dynamic lighting effects.
   * This method ensures that lighting is processed for the current frame.
   */
  onFrameEvents() {
    if (this.lightingManager != null) {
      this.lightingManager.processLightFrameCaller(); // Process lighting updates.
    }
  }

  /**
   * Retrieves the boundaries of the active gameplay level.
   * This method returns the minimum and maximum coordinates of the level.
   * @returns {Object} - An object containing min and max coordinates.
   */
  getActiveGameLevelBoundary() {
    let boundary = {
      minX: 0,
      minY: 0, // Assuming the game level has constant Y-level movement.
      minZ: 0,
      maxX: this.levelMap.mapWidth - 1,
      maxY: 0,
      maxZ: this.levelMap.mapDepth - 1,
    };

    return boundary; // Return the calculated boundaries.
  }

  /**
   * Registers the current primary player in the level.
   * This method updates the list of registered players and sets the current primary player.
   * @param {Object} playerToRegister - The player instance to register.
   */
  registerCurrentPrimaryPlayer(playerToRegister) {
    this.registeredPlayers.push(playerToRegister); // Add the player to the registered list.
    this.currentPrimaryPlayer = playerToRegister; // Set the current primary player.
  }

  /**
   * Updates the current primary player in the level.
   * @param {Object} newPrimaryPlayer - The new player instance to set as primary.
   */
  updateCurrentPrimaryPlayer(newPrimaryPlayer) {
    this.currentPrimaryPlayer = newPrimaryPlayer; // Update the current primary player.
  }

  /**
   * Configures the camera to follow the player and sets lighting for the player model.
   * @param {Player} player - The player instance to follow.
   */
  setPlayerCamera(player) {
    // After the player model is loaded, configure the camera to chase the player.
    let cameraToDispose =
      FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[
        this.hostingScene
      ];

    let model = player.playerMovementManager.getPlayerModelDirectly(); // Get the player's model.
    // Update the camera to chase the player's model.
    this.cameraManager.setCameraToChase(this.hostingScene, model);

    FundamentalSystemBridge["renderSceneSwapper"].disposeAndDeleteCamera(
      cameraToDispose // Dispose of the previous camera.
    );
  }

  /**
   * Loads the registered player model into the scene.
   * This method also optionally switches the camera to follow the player.
   * @param {Player} player - The player instance to load.
   * @param {boolean} switchCameraToFollowPlayer - Whether to switch the camera to follow the player.
   * @returns {Promise<boolean>} - Resolves to true if the model was loaded successfully.
   */
  async loadRegisteredPlayerModel(player, switchCameraToFollowPlayer) {
    if (player != null) {
      let positionedObject =
        player.playerMovementManager.getPlayerModelPositionedObject(); // Get the positioned object for the player.

      let relevantBuilder = FundamentalSystemBridge[
        "renderSceneSwapper"
      ].getSceneBuilderByScene(
        this.hostingScene // Get the scene builder for the current scene.
      );
      // Asynchronously load the animated player model.
      await relevantBuilder.loadAnimatedModel(positionedObject);

      if (switchCameraToFollowPlayer) {
        this.setPlayerCamera(player); // Set the camera to follow the player if required.
      }
      return true; // Return success.
    }
  }

  /**
   * Returns a beautifully formatted string description of the current gameplay level state.
   * @returns {string} A formatted description of the level
   */
  describeMe() {
    const boundary = this.getActiveGameLevelBoundary();
    const playerPos =
      this.currentPrimaryPlayer?.playerMovementManager.getPlayerModelPositionedObject()
        ?.position;

    return `🎮 Level Status Report 🎮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 Dimensions
   Width: ${this.levelMap.mapWidth} units
   Depth: ${this.levelMap.mapDepth} units
   Playable Area: (${boundary.minX},${boundary.minZ}) to (${boundary.maxX},${
      boundary.maxZ
    })

👥 Players
   Total Players: ${this.registeredPlayers.length}
   Primary Player: ${this.currentPrimaryPlayer ? "✓ Active" : "✗ None"}
   ${
     playerPos
       ? `   Location: (${playerPos.x.toFixed(2)}, ${playerPos.y.toFixed(
           2
         )}, ${playerPos.z.toFixed(2)})`
       : ""
   }

🎯 Game Mode
   Lighting: ${this.lightingManager ? "💡 Active" : "🌑 Not Initialized"}
   Rules: ${Object.keys(this.gameModeRules || {})
     .map((rule) => `\n     • ${rule}`)
     .join("")}

🎥 Scene Status
   Camera System: ${
     this.cameraManager?.hasActiveCamera() ? "🎥 Ready" : "❌ Not Set"
   }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }
}
