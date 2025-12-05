/**
 * TestLevelDataCompositeLoader
 *
 * This class provides a simple way to test the new LevelDataComposite-based level loading system.
 * It demonstrates how to create, load, and render a level using the new approach without
 * relying on the LevelMap system.
 */
class TestLevelDataCompositeLoader {
  /**
   * Runs a complete test of the LevelDataComposite system
   * @returns {Promise<boolean>} True if the test was successful
   */
  static async runFullTest() {
    console.log("=== Starting LevelDataComposite Test ===");

    try {
      // Step 1: Create a test level data composite
      console.log("Step 1: Creating test level data...");
      const levelData = this.createTestLevelData();
      console.log("✓ Level data created successfully");

      // Step 2: Create an ActiveGameplayLevel from the level data
      console.log("Step 2: Creating ActiveGameplayLevel...");
      const gameplayLevel = await this.createGameplayLevel(levelData);
      console.log("✓ ActiveGameplayLevel created successfully");

      // Step 3: Load a player into the level
      console.log("Step 3: Loading player...");
      const player = this.loadPlayerToLevel(gameplayLevel);
      console.log("✓ Player loaded successfully");

      // Step 4: Render the level
      console.log("Step 4: Rendering level...");
      const renderResult = await this.renderLevel(gameplayLevel);
      console.log("✓ Level rendered successfully");

      // Step 5: Add obstacles to the level
      console.log("Step 5: Adding obstacles...");
      const obstaclesResult = await this.addObstaclesToLevel(gameplayLevel);
      console.log("✓ Obstacles added successfully");

      console.log("=== LevelDataComposite Test Completed Successfully ===");
      return true;
    } catch (error) {
      console.error("Test failed with error:", error);
      return false;
    }
  }

  /**
   * Creates a test level data composite with custom settings
   * @returns {LevelDataComposite} The created level data
   */
  static createTestLevelData() {
    // Create a custom level with specific dimensions
    const levelData = TestLevelJsonBuilder.buildCustomSizeLevel(
      "testLevel0",
      "Test Composite Level",
      11, // width
      21, // depth
      { x: 7, y: 0.5, z: 12 } // player start
    );

    // Add custom lighting presets
    if (levelData.levelGameplayTraitsData) {
      levelData.levelGameplayTraitsData.lightingPresets = {
        ambientIntensity: 0.4,
        directionalIntensity: 0.6,
        shadowsEnabled: true,
      };
    }

    return levelData;
  }

  /**
   * Creates an ActiveGameplayLevel from level data
   * @param {LevelDataComposite} levelData - The level data
   * @returns {Promise<ActiveGameplayLevel>} The created gameplay level
   */
  static async createGameplayLevel(levelData) {
    // Create camera and lighting managers
    const cameraManager = new CameraManager();
    const lightingManager = new LightingManager();

    // Register them with the system
    FundamentalSystemBridge.registerPrimaryGameplayCameraManager(cameraManager);
    FundamentalSystemBridge.registerPrimaryGameplayLightingManager(
      lightingManager
    );

    // Create game mode
    const gameMode = GamemodeFactory.initializeSpecifiedGamemode("test");

    // Get the active scene
    const activeScene =
      FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();

    // Register the scene with the camera manager and set up the camera
    cameraManager.registerPrimaryGameScene(activeScene);
    const camera = cameraManager.setupGameLevelTestCamera();
    if (camera) {
      // Set the camera as the active camera for the scene
      activeScene.activeCamera = camera;
      // Also register it with the render scene swapper
      FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[activeScene] = camera;
    }

    // Create the gameplay level
    const gameplayLevel = new ActiveGameplayLevel(
      activeScene,
      gameMode,
      levelData,
      cameraManager,
      lightingManager
    );

    return gameplayLevel;
  }

  /**
   * Loads a player into the level
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level
   * @returns {PlayerUnit} The created player
   */
  static loadPlayerToLevel(gameplayLevel) {
    // Create a player
    const player = PlayerLoader.getFreshPlayer(gameplayLevel);
    player.playerMovementManager.setMaxMovementDistance(5);

    // Register the player with the level
    gameplayLevel.registerCurrentPrimaryPlayer(player);

    return player;
  }

  /**
   * Renders the level
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level to render
   * @returns {Promise<boolean>} True if rendering was successful
   */
  static async renderLevel(gameplayLevel) {
    // Initialize level factory if needed
    if (!LevelFactoryComposite.checkTilesLoaded()) {
      await FundamentalSystemBridge[
        "levelFactoryComposite"
      ].loadFactorySupportSystems();
    }

    // Render the level
    return await FundamentalSystemBridge[
      "levelFactoryComposite"
    ].renderGameplayLevel(gameplayLevel);
  }

  /**
   * Adds obstacles to the level
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level
   * @returns {Promise<boolean>} True if obstacles were added successfully
   */
  static async addObstaclesToLevel(gameplayLevel) {
    // Get the obstacle generator
    const obstacleGenerator =
      FundamentalSystemBridge["levelFactoryComposite"]
        .levelMapObstacleGenerator;

    // Generate edge mountains
    obstacleGenerator.generateEdgeMountainsObstacles(gameplayLevel);

    // Get the scene builder
    const sceneBuilder =
      FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene(
        "BaseGameScene"
      );

    // Render the obstacles
    obstacleGenerator.renderObstaclesForLevel(gameplayLevel, sceneBuilder);

    return true;
  }

  /**
   * Runs the test and logs the result
   */
  static async runAndLogTest() {
    const result = await this.runFullTest();

    if (result) {
      console.log(
        "%c LevelDataComposite Test PASSED! ",
        "background: green; color: white; font-weight: bold;"
      );
    } else {
      console.log(
        "%c LevelDataComposite Test FAILED! ",
        "background: red; color: white; font-weight: bold;"
      );
    }

    return result;
  }
}
