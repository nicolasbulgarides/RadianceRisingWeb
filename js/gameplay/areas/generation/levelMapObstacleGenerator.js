class LevelMapObstacleGenerator {
  /**
   * Initializes obstacles on the level.
   * Reads obstacle configurations from the level and creates corresponding obstacle instances.
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level to populate with obstacles.
   * @param {Object} relevantSceneBuilder - The scene builder for loading models.
   */
  renderObstaclesForLevel(activeGameplayLevel, relevantSceneBuilder) {
    // Get obstacles from the level data
    const obstacles = this.getObstaclesFromLevel(activeGameplayLevel);
    if (!obstacles || obstacles.length === 0) return; // Exit if there are no obstacles to initialize.

    // Get the level map for backward compatibility

    for (const obstacleData of obstacles) {
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

      // Load the obstacle's model into the scene regardless of board slot system
      relevantSceneBuilder.loadModel(obstacle.positionedObject); // Load the model for the obstacle.
    }
  }

  /**
   * Gets obstacles from the level data, supporting both LevelDataComposite and legacy formats
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @returns {Array} Array of obstacles
   */
  getObstaclesFromLevel(activeGameplayLevel) {
    // First check if obstacles are directly in the level data composite
    if (
      activeGameplayLevel.levelDataComposite &&
      activeGameplayLevel.levelDataComposite.obstacles
    ) {
      return activeGameplayLevel.levelDataComposite.obstacles;
    }

    // Then check if obstacles are in the featured objects
    if (
      activeGameplayLevel.levelDataComposite &&
      activeGameplayLevel.levelDataComposite.levelGameplayTraitsData &&
      activeGameplayLevel.levelDataComposite.levelGameplayTraitsData
        .allFeaturedObjects
    ) {
      const featuredObjects =
        activeGameplayLevel.levelDataComposite.levelGameplayTraitsData
          .allFeaturedObjects;
      // Filter for objects that are obstacles
      return featuredObjects.filter((obj) => obj.isObstacle);
    }

    // Fallback to level map obstacles for backward compatibility
    if (
      activeGameplayLevel.levelMap &&
      activeGameplayLevel.levelMap.obstacles
    ) {
      return activeGameplayLevel.levelMap.obstacles;
    }

    // Return empty array if no obstacles found
    return [];
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

    // Get dimensions from the level data
    const dimensions = this.getLevelDimensions(activeGameplayLevel);
    const width = dimensions.width;
    const depth = dimensions.depth;

    const mountains = []; // Array to hold generated mountain obstacles.

    // Generate obstacles along the left and right edges.
    for (let z = 0; z < depth; z++) {
      // Left edge obstacle at x = 0.
      const leftMountain = new Obstacle(
        "testMountain",
        `mountain_left_${z}`,
        "none",
        "all",
        new BABYLON.Vector3(0, 0, z)
      );
      leftMountain.obstacleArchetype = "mountain";
      leftMountain.isObstacle = true;
      mountains.push(leftMountain);

      // Right edge obstacle at x = width - 1.
      const rightMountain = new Obstacle(
        "testMountain",
        `mountain_right_${z}`,
        "none",
        "all",
        new BABYLON.Vector3(width - 1, 0, z)
      );
      rightMountain.obstacleArchetype = "mountain";
      rightMountain.isObstacle = true;
      mountains.push(rightMountain);
    }

    // Generate obstacles along the top and bottom edges.
    for (let x = 0; x < width; x++) {
      // Top edge obstacle at z = 0.
      const topMountain = new Obstacle(
        "testMountain",
        `mountain_top_${x}`,
        "none",
        "all",
        new BABYLON.Vector3(x, 0, 0)
      );
      topMountain.obstacleArchetype = "mountain";
      topMountain.isObstacle = true;
      mountains.push(topMountain);

      // Bottom edge obstacle at z = depth - 1.
      const bottomMountain = new Obstacle(
        "testMountain",
        `mountain_bottom_${x}`,
        "none",
        "all",
        new BABYLON.Vector3(x, 0, depth - 1)
      );
      bottomMountain.obstacleArchetype = "mountain";
      bottomMountain.isObstacle = true;
      mountains.push(bottomMountain);
    }

    console.log(`Generated ${mountains.length} edge mountain obstacles`);

    // Store the obstacles in the level data
    this.storeObstaclesInLevel(activeGameplayLevel, mountains);

    return mountains;
  }

  /**
   * Gets the dimensions of the level
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @returns {Object} Object containing width and depth
   */
  getLevelDimensions(activeGameplayLevel) {
    // If the level has a getGridDimensions method, use it
    if (typeof activeGameplayLevel.getGridDimensions === "function") {
      return activeGameplayLevel.getGridDimensions();
    }

    // If the level has a levelDataComposite with customGridSize, use it
    if (
      activeGameplayLevel.levelDataComposite &&
      activeGameplayLevel.levelDataComposite.customGridSize
    ) {
      return {
        width: activeGameplayLevel.levelDataComposite.customGridSize.width,
        depth: activeGameplayLevel.levelDataComposite.customGridSize.depth,
      };
    }

    // Fallback to level map dimensions for backward compatibility
    if (activeGameplayLevel.levelMap) {
      return {
        width: activeGameplayLevel.levelMap.mapWidth,
        depth: activeGameplayLevel.levelMap.mapDepth,
      };
    }

    // Default dimensions if nothing else is available
    return { width: 11, depth: 21 };
  }

  /**
   * Stores obstacles in the level data
   * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
   * @param {Array} obstacles - The obstacles to store
   */
  storeObstaclesInLevel(activeGameplayLevel, obstacles) {
    // Store in level data composite if available
    if (activeGameplayLevel.levelDataComposite) {
      activeGameplayLevel.levelDataComposite.obstacles = obstacles;
    }

    // Also store in level map for backward compatibility
    if (activeGameplayLevel.levelMap) {
      activeGameplayLevel.levelMap.obstacles = obstacles;
    }
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

    // Handle undefined or null obstacleArchetype
    if (!obstacleArchetype) {
      console.warn(
        "Undefined or null obstacleArchetype, using default testMountain"
      );
      return modelId;
    }

    console.log(
      `Resolving model ID for obstacle archetype: ${obstacleArchetype}`
    );

    try {
      switch (obstacleArchetype.toLowerCase()) {
        case "mountain":
          modelId = "testMountain"; // Set model ID for mountain archetype.
          break;

        // Add more archetypes as needed

        default:
          console.log(
            `Unknown obstacle archetype: ${obstacleArchetype}, using default testMountain`
          );
          break;
      }
    } catch (error) {
      console.error(`Error processing obstacle archetype: ${error.message}`);
      console.warn(`Using default model ID: ${modelId} due to error`);
    }

    console.log(
      `Using model ID: ${modelId} for archetype: ${obstacleArchetype}`
    );
    return modelId; // Return the resolved model ID.
  }
}
