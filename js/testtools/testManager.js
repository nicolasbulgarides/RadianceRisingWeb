class TestManager {
  /**
   * Processes test orders for the gameplay manager.
   * Loads a basic test level and sets it as the active gameplay level.
   * Also loads a demo player into the level.
   * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance to process orders for.
   */
  async processTestOrders(gameplayManager) {
    // Ensure tiles are loaded before proceeding
    if (!LevelFactoryComposite.checkTilesLoaded()) {
      await FundamentalSystemBridge[
        "levelFactoryComposite"
      ].loadFactorySupportSystems();
    }

    // Use mountain path test instead of standard level loading
    const useMountainPathTest = true; // Set to false to use standard level loading

    // Choose between real model mountains and fallback cylinder mountains
    const useFallbackVisualization = false; // Set to true to use cylinder mountains

    if (useMountainPathTest) {
      // Use mountain path test for level generation
      console.log("Using Mountain Path Test for level generation");
      const gameplayLevel = await this.runMountainPathTest("default", {
        useFallbackVisualization,
      });

      if (!gameplayLevel) {
        GameplayLogger.lazyLog("Failed to load mountain path level");
        return;
      }

      // No need to add additional obstacles since the mountain path generator already creates them
      console.log(
        "Mountain path test completed - no additional obstacles needed"
      );
      return;
    }

    // Standard level loading (only runs if useMountainPathTest is false)
    let gameplayLevel = await this.loadLevelAndPlayer(gameplayManager);

    if (!gameplayLevel) {
      GameplayLogger.lazyLog("Failed to load gameplay level");
      return;
    }

    let finalizedRendering = await this.renderLevel(gameplayLevel);

    if (!finalizedRendering) {
      GameplayLogger.lazyLog("Failed to render level");
      return;
    }

    // Double check that the level is properly set in the gameplay manager
    if (!gameplayManager.primaryActiveGameplayLevel) {
      gameplayManager.setActiveGameplayLevel(gameplayLevel);
    } else if (gameplayManager.primaryActiveGameplayLevel !== gameplayLevel) {
      gameplayManager.setActiveGameplayLevel(gameplayLevel);
    }

    // Only add edge obstacles for standard level loading
    //  await this.levelObstacleTest();
  }

  async loadLevelAndPlayer(gameplayManager) {
    let gameplayLevel = await this.generateGameplayLevelComposite(
      gameplayManager
    );

    if (gameplayLevel == null) {
      GameplayLogger.lazyLog(
        "GameplayLevel is null at load, cannot load player to gameplay level"
      );
      return null;
    }

    // Create a player using the level data
    let demoPlayer = PlayerLoader.getFreshPlayer(gameplayLevel);
    demoPlayer.playerMovementManager.setMaxMovementDistance(5);

    let loadedPlayer = await gameplayManager.loadPlayerToGameplayLevel(
      gameplayLevel,
      demoPlayer
    ); // Load the player into the level.

    demoPlayer.setMockInventory(new PlayerMockInventory());

    return gameplayLevel;
  }

  async generateGameplayLevelComposite(gameplayManager) {
    // Use the new TestLevelDataLoader to create a LevelDataComposite
    let levelDataComposite = TestLevelDataCompositeLoader.createTestLevelData();

    // Create an active gameplay level instance with the loaded configurations.
    let activeDemoGameplayLevel = await this.prepareGameplayLevelObject(
      levelDataComposite
    );

    if (activeDemoGameplayLevel == null) {
      GameplayLogger.lazyLog(
        "ActiveDemoGameplayLevel is null at generate, post setting active gameplay level cannot generate gameplay level"
      );
      return null;
    }

    gameplayManager.setActiveGameplayLevel(activeDemoGameplayLevel); // Set the loaded level as active.

    // Set the active gameplay level in the CollectiblePlacementManager
    await FundamentalSystemBridge[
      "collectiblePlacementManager"
    ].setActiveGameplayLevel(activeDemoGameplayLevel);

    return activeDemoGameplayLevel; // Return the configured gameplay level.
  }

  generateAndRegisterCameraAndLightingManagers() {
    let primaryCameraManager = new CameraManager();
    let primaryLightingManager = new LightingManager();
    FundamentalSystemBridge.registerPrimaryGameplayCameraManager(
      primaryCameraManager
    );
    FundamentalSystemBridge.registerPrimaryGameplayLightingManager(
      primaryLightingManager
    );
    return { primaryCameraManager, primaryLightingManager };
  }

  async prepareGameplayLevelObject(levelDataComposite) {
    let { primaryCameraManager, primaryLightingManager } =
      this.generateAndRegisterCameraAndLightingManagers();
    let gameMode = GamemodeFactory.initializeSpecifiedGamemode("test");

    let activeGameLevelScene =
      FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();

    // Log obstacle count for debugging
    if (levelDataComposite && levelDataComposite.obstacles) {
      console.log(
        `Preparing level with ${levelDataComposite.obstacles.length} obstacles`
      );
    }

    let activeDemoGameplayLevel = new ActiveGameplayLevel(
      activeGameLevelScene,
      gameMode,
      levelDataComposite,
      primaryCameraManager,
      primaryLightingManager
    );

    // Ensure obstacles are properly transferred to the active gameplay level
    if (
      levelDataComposite &&
      levelDataComposite.obstacles &&
      levelDataComposite.obstacles.length > 0
    ) {
      // Ensure the level map exists
      if (!activeDemoGameplayLevel.levelMap) {
        activeDemoGameplayLevel.levelMap = {};
      }

      // Store obstacles in multiple locations to ensure they're found
      activeDemoGameplayLevel.obstacles = levelDataComposite.obstacles;
      activeDemoGameplayLevel.levelMap.obstacles = levelDataComposite.obstacles;

      // Ensure obstacles are in the levelDataComposite
      if (activeDemoGameplayLevel.levelDataComposite) {
        activeDemoGameplayLevel.levelDataComposite.obstacles =
          levelDataComposite.obstacles;

        // Add obstacles to featuredObjects if available
        if (
          activeDemoGameplayLevel.levelDataComposite.levelGameplayTraitsData
        ) {
          if (
            !activeDemoGameplayLevel.levelDataComposite.levelGameplayTraitsData
              .featuredObjects
          ) {
            activeDemoGameplayLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects =
              [];
          }

          // Add each obstacle to featuredObjects if it's not already there
          levelDataComposite.obstacles.forEach((obstacle) => {
            if (
              !activeDemoGameplayLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects.includes(
                obstacle
              )
            ) {
              activeDemoGameplayLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects.push(
                obstacle
              );
            }
          });
        }
      }

      console.log(
        `Successfully transferred ${levelDataComposite.obstacles.length} obstacles to game level`
      );
    }

    return activeDemoGameplayLevel;
  }

  async renderLevel(gameplayLevel) {
    let finalizedRendering =
      FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(
        gameplayLevel
      );

    return finalizedRendering;
  }

  /**
   * A helper function to test obstacle generation within the level map.
   * Utilizes a generator to add edge mountains and initialize obstacles.
   * @param {LevelMapObstacleGenerator} generator - The generator instance for obstacles.
   */
  async levelObstacleTest() {
    let gameplayManagerComposite =
      FundamentalSystemBridge["gameplayManagerComposite"];

    if (gameplayManagerComposite == null) {
      GameplayLogger.lazyLog(
        "GameplayManagerComposite is null, cannot generate obstacles"
      );
      return;
    }

    let gameLevel = gameplayManagerComposite.primaryActiveGameplayLevel;

    if (gameLevel == null) {
      GameplayLogger.lazyLog("GameLevel is null, cannot generate obstacles");
      return;
    }

    if (!(gameLevel instanceof ActiveGameplayLevel)) {
      GameplayLogger.lazyLog(
        "GameLevel is not an instance of ActiveGameplayLevel, cannot generate obstacles"
      );
      return;
    }

    let relevantSceneBuilder =
      FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene(
        "BaseGameScene"
      );

    let obstacleGenerator =
      FundamentalSystemBridge["levelFactoryComposite"]
        .levelMapObstacleGenerator;

    obstacleGenerator.generateEdgeMountainsObstacles(gameLevel);
    obstacleGenerator.renderObstaclesForLevel(gameLevel, relevantSceneBuilder);
  }

  /**
   * Creates a custom test level with specific dimensions and obstacles
   * @param {string} levelId - The level ID
   * @param {string} levelNickname - The level nickname
   * @param {number} width - Grid width
   * @param {number} depth - Grid depth
   * @param {Object} playerStart - Player starting position {x, y, z}
   * @param {Array} obstacles - Array of obstacle definitions (optional)
   * @returns {LevelDataComposite} The configured level data composite
   */
  createCustomTestLevel(
    levelId,
    levelNickname,
    width,
    depth,
    playerStart,
    obstacles = []
  ) {
    let levelDataComposite;

    if (obstacles.length > 0) {
      // Create a level with custom obstacles
      levelDataComposite = TestLevelDataLoader.createLevelWithObstacles(
        levelId,
        levelNickname,
        obstacles
      );
    } else {
      // Create a level with just custom dimensions
      levelDataComposite = TestLevelDataLoader.createCustomTestLevel(
        levelId,
        levelNickname,
        width,
        depth,
        playerStart
      );
    }

    return levelDataComposite;
  }

  checkifGameLevelisValid(gameLevel) {
    if (gameLevel == null) {
      GameplayLogger.lazyLog("GameLevel is null, cannot generate obstacles");
      return false;
    } else if (
      gameLevel != null &&
      !(gameLevel instanceof ActiveGameplayLevel)
    ) {
      GameplayLogger.lazyLog(
        "GameLevel is not an instance of ActiveGameplayLevel, cannot generate obstacles"
      );
      return false;
    } else {
      return true;
    }
  }

  /**
   * Directly runs a mountain path test without going through normal level loading
   * @param {string} testType - Type of test to run ('default', 'custom', 'random')
   * @param {Object} options - Options for custom test
   * @returns {Promise<ActiveGameplayLevel>} The created level
   */
  async runMountainPathTest(testType = "default", options = {}) {
    console.log(`Running mountain path test type: ${testType}`);

    try {
      // Ensure systems are loaded
      if (!LevelFactoryComposite.checkTilesLoaded()) {
        await FundamentalSystemBridge[
          "levelFactoryComposite"
        ].loadFactorySupportSystems();
      }

      // Set default visualization option
      const useFallbackVisualization =
        options.useFallbackVisualization || false;
      console.log(
        `Using ${
          useFallbackVisualization ? "fallback cylinder" : "real model"
        } mountain visualization`
      );

      let gameplayLevel = null;

      switch (testType.toLowerCase()) {
        case "custom":
          const {
            startPosition = { x: 2, y: 0.25, z: 2 },
            endPosition = { x: 8, y: 0.25, z: 8 },
            width = 11,
            depth = 11,
            obstacleRatio = 0.3,
          } = options;

          gameplayLevel = await MountainPathTest.runCustomTest(
            startPosition,
            endPosition,
            width,
            depth,
            obstacleRatio,
            useFallbackVisualization
          );
          break;

        case "random":
          gameplayLevel = await MountainPathTest.generateRandomLevel(
            useFallbackVisualization
          );
          break;

        case "default":
        default:
          gameplayLevel = await MountainPathTest.runCompleteTest(
            useFallbackVisualization
          );
          break;
      }

      if (gameplayLevel) {
        console.log("Mountain Path Test completed successfully");

        // Ensure it's set as the active level
        const gameplayManager =
          FundamentalSystemBridge["gameplayManagerComposite"];
        gameplayManager.setActiveGameplayLevel(gameplayLevel);

        return gameplayLevel;
      } else {
        console.error("Mountain Path Test failed to create level");
        return null;
      }
    } catch (error) {
      console.error("Error in runMountainPathTest:", error);
      return null;
    }
  }
}
