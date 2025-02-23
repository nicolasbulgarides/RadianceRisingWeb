class LevelMapObstacleGenerator {
  /**
   * Initializes obstacles on the level map.
   * Reads obstacle configurations from the level and creates corresponding obstacle instances.
   * @param {LevelMap} level - The level map to populate with obstacles.
   * @param {Object} relevantSceneBuilder - The scene builder for loading models.
   */
  renderObstaclesForLevel(activeGameplayLevel, relevantSceneBuilder) {
    let levelMap = activeGameplayLevel.levelMap;
    if (!levelMap.obstacles) return; // Exit if there are no obstacles to initialize.

    for (const obstacleData of levelMap.obstacles) {
      const {
        obstacleArchetype,
        nickname,
        interactionId,
        directionsBlocked,
        position,
      } = obstacleData; // Destructure obstacle data.

      // Create an Obstacle instance using preset values.
      const obstacle = LevelMapObstacleGenerator.getObstacleByPreset(
        obstacleArchetype,
        nickname,
        interactionId,
        directionsBlocked,
        position
      );

      if (!obstacle) {
        console.error(`LevelMap: Failed to create obstacle ${nickname}`); // Log error if obstacle creation fails.
        continue; // Skip to the next obstacle.
      }

      // Retrieve the board slot located at the obstacle's intended position.
      const boardSlot = levelMap.boardSlots[position.x][position.z];
      if (boardSlot) {
        // Host the obstacle in the board slot.
        boardSlot.hostObstacle(obstacle); // Add the obstacle to the board slot.

        // Load the obstacle's model into the scene.
        relevantSceneBuilder.loadModel(obstacle.positionedObject); // Load the model for the obstacle.
      } else {
        GameplayLogger.lazyLog(
          `LevelMap loading obstacle issue: No BoardSlot at ${position.x}, ${position.z}`
        ); // Log warning if no board slot is found.
      }
    }
  }

  /**
   * Dynamically generates edge obstacles (mountains) along the borders of the game level.
   * This helps to simulate natural boundaries and define the playable area.
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level to which edge obstacles are added.
   */
  generateEdgeMountainsObstacles(activeGameplayLevel) {
    if (!(activeGameplayLevel instanceof ActiveGameplayLevel)) {
      GameplayLogger.lazyLog(
        "LevelMapObstacleGenerator: Invalid active gameplay level provided to obstacle generator for edge mountains"
      );
      return;
    }

    let levelMap = activeGameplayLevel.levelMap;

    const mountains = []; // Array to hold generated mountain obstacles.

    // Generate obstacles along the left and right edges.
    for (let z = 0; z < levelMap.mapDepth; z++) {
      // Left edge obstacle at x = 0.
      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_left_${z}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(0, 0, z),
      });

      // Right edge obstacle at x = mapWidth - 1.
      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_right_${z}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(levelMap.mapWidth - 1, 0, z),
      });
    }

    // Generate obstacles along the top and bottom edges.
    for (let x = 0; x < levelMap.mapWidth; x++) {
      // Top edge obstacle at z = 0.
      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_top_${x}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(x, 0, 0),
      });

      // Bottom edge obstacle at z = mapDepth - 1.
      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_bottom_${x}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(x, 0, levelMap.mapDepth - 1),
      });
    }

    // Overwrite the level's obstacles with the generated edge obstacles.
    levelMap.obstacles = mountains; // Set the level's obstacles to the generated mountains.
  }

  /**
   * Factory method to create an Obstacle instance based on preset configurations.
   * @param {string} obstacleArchetype - Type of obstacle, used to resolve the model.
   * @param {string} nickname - Friendly name for the new obstacle.
   * @param {number} interactionId - Numeric identifier describing interaction behavior.
   * @param {string} directionsBlocked - Specifies which directions are blocked.
   * @param {BABYLON.Vector3} position - Position where the obstacle should be placed.
   * @returns {Obstacle} - A new Obstacle instance configured from the preset.
   */
  static getObstacleByPreset(
    obstacleArchetype,
    nickname,
    interactionId,
    directionsBlocked,
    position
  ) {
    return new Obstacle(
      this.getModelIdByNickname(obstacleArchetype),
      nickname,
      interactionId,
      directionsBlocked,
      position
    ); // Create and return a new Obstacle instance.
  }

  /**
   * Resolves and returns the model ID corresponding to an obstacle archetype.
   * @param {string} obstacleArchetype - The archetype name to resolve.
   * @returns {string} - The model ID associated with the given archetype.
   */
  static getModelIdByNickname(obstacleArchetype) {
    let modelId = "testMountain"; // Default model ID.
    switch (obstacleArchetype.toLowerCase()) {
      case "mountain":
        modelId = "testMountain"; // Set model ID for mountain archetype.
        break;
    }
    return modelId; // Return the resolved model ID.
  }
}
