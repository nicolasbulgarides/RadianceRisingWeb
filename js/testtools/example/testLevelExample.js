/**
 * This file contains examples of how to use the TestLevelJsonBuilder and TestLevelDataLoader
 * to create and customize test levels for development and testing.
 *
 * These examples demonstrate the modularity and flexibility of the new level data system.
 */

/**
 * Example 1: Creating a basic test level
 * This demonstrates the simplest way to create a test level with default settings.
 */
function createBasicTestLevel() {
  // Build a default test level
  const levelData = TestLevelJsonBuilder.buildDefaultTestLevel();
  console.log(
    "Created basic test level:",
    levelData.levelHeaderData.levelNickname
  );

  // Convert to a LevelMap for use with existing systems
  const levelMap = TestLevelDataLoader.convertLevelDataToMap(levelData);
  console.log(
    "Converted to LevelMap with dimensions:",
    levelMap.mapWidth,
    "x",
    levelMap.mapDepth
  );

  return levelMap;
}

/**
 * Example 2: Creating a custom-sized level with specific player start position
 * This demonstrates how to customize the grid dimensions and player starting position.
 */
function createCustomSizedLevel() {
  // Define custom dimensions and player start position
  const width = 15;
  const depth = 25;
  const playerStart = { x: 7, y: 0.5, z: 12 };

  // Build a custom-sized level
  const levelData = TestLevelJsonBuilder.buildCustomSizeLevel(
    "customLevel",
    "Custom Size Level",
    width,
    depth,
    playerStart
  );

  // Convert to a LevelMap
  const levelMap = TestLevelDataLoader.convertLevelDataToMap(levelData);
  console.log(
    "Created custom level with dimensions:",
    levelMap.mapWidth,
    "x",
    levelMap.mapDepth
  );
  console.log(
    "Player starts at:",
    levelMap.startingPosition.x,
    levelMap.startingPosition.y,
    levelMap.startingPosition.z
  );

  return levelMap;
}

/**
 * Example 3: Creating a level with predefined obstacles
 * This demonstrates how to add obstacles to a level.
 */
function createLevelWithObstacles() {
  // Define some obstacles
  const obstacles = [
    {
      obstacleArchetype: "mountain",
      nickname: "center_mountain",
      interactionId: "none",
      directionsBlocked: "all",
      position: new BABYLON.Vector3(5, 0, 5),
    },
    {
      obstacleArchetype: "mountain",
      nickname: "corner_mountain",
      interactionId: "none",
      directionsBlocked: "all",
      position: new BABYLON.Vector3(9, 0, 9),
    },
  ];

  // Build a level with obstacles
  const levelData = TestLevelJsonBuilder.buildLevelWithObstacles(
    "obstacleLevel",
    "Level With Obstacles",
    obstacles
  );

  // Convert to a LevelMap
  const levelMap = TestLevelDataLoader.convertLevelDataToMap(levelData);
  console.log("Created level with", levelMap.obstacles.length, "obstacles");

  return levelMap;
}

/**
 * Example 4: Creating a complete custom level with all components
 * This demonstrates how to build a fully customized level with all components.
 */
function createCompleteCustomLevel() {
  // Start with a default level
  const levelData = TestLevelJsonBuilder.buildDefaultTestLevel(
    "completeLevel",
    "Complete Custom Level"
  );

  // Customize grid size and player start
  levelData.customGridSize = { width: 20, depth: 30 };
  levelData.playerStartPosition = { x: 10, y: 0.25, z: 15 };

  // Add custom victory conditions
  const collectObjective = new LevelObjective(
    "collect_items",
    "Collect All Items",
    "Find and collect all hidden items",
    "collection",
    "all",
    true,
    ""
  );

  const timeObjective = new LevelObjective(
    "time_limit",
    "Beat the Clock",
    "Complete the level within the time limit",
    "time",
    "60",
    false,
    ""
  );

  const victoryCondition = new LevelVictoryCondition(
    "completeLevel",
    "Complete All Objectives",
    "Collect all items and beat the time limit",
    [collectObjective, timeObjective]
  );

  // Replace the default victory conditions
  levelData.levelGameplayTraitsData.victoryConditions = [victoryCondition];

  // Add custom lighting presets
  levelData.levelGameplayTraitsData.lightingPresets = {
    ambientIntensity: 0.2,
    directionalIntensity: 0.8,
    shadowsEnabled: true,
    fogEnabled: true,
    fogDensity: 0.01,
    fogColor: new BABYLON.Color3(0.8, 0.8, 0.9),
  };

  // Convert to a LevelMap and enhance it with the composite data
  const levelMap = TestLevelDataLoader.convertLevelDataToMap(levelData);
  TestLevelDataLoader.enhanceLevelMapWithCompositeData(levelMap, levelData);

  console.log(
    "Created complete custom level with",
    levelMap.victoryConditions[0].allLevelObjectives.length,
    "objectives"
  );

  return levelMap;
}

/**
 * Example 5: Converting a level to JSON for storage
 * This demonstrates how to serialize a level for storage or transmission.
 */
function saveLevelToJson() {
  // Create a test level
  const levelData = TestLevelJsonBuilder.buildDefaultTestLevel(
    "saveLevel",
    "Level to Save"
  );

  // Convert to JSON
  const jsonString = TestLevelJsonBuilder.convertToJson(levelData);
  console.log("Converted level to JSON:", jsonString.substring(0, 100) + "...");

  // In a real application, you would save this JSON to a file or database
  // For example:
  // localStorage.setItem('saveLevel', jsonString);

  return jsonString;
}

/**
 * Example 6: Loading a level from JSON
 * This demonstrates how to deserialize a level from storage.
 */
function loadLevelFromJson(jsonString) {
  // Parse the JSON into a LevelDataComposite
  const levelData = TestLevelJsonBuilder.createFromJson(jsonString);
  console.log(
    "Loaded level from JSON:",
    levelData.levelHeaderData.levelNickname
  );

  // Convert to a LevelMap
  const levelMap = TestLevelDataLoader.convertLevelDataToMap(levelData);

  return levelMap;
}

// This function would be called to demonstrate all the examples
function runAllExamples() {
  console.log("=== Running Test Level Examples ===");

  const basicLevel = createBasicTestLevel();
  //const customSizedLevel = createCustomSizedLevel();
  // const obstacleLevel = createLevelWithObstacles();
  // const completeLevel = createCompleteCustomLevel();

  const jsonString = saveLevelToJson();
  // const loadedLevel = loadLevelFromJson(jsonString);

  console.log("=== All examples completed successfully ===");
}
