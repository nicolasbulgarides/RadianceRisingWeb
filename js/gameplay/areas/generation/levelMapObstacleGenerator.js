class LevelMapObstacleGenerator {
  /**
   * Initializes obstacles on the level map.
   * Reads obstacle configurations from the level and creates corresponding obstacle instances.
   *
   * @param {LevelMap} level - The level map to populate with obstacles.
   */

  initializeObstacles(level, relevantSceneBuilder) {
    if (!level.obstacles) return;

    for (const obstacleData of level.obstacles) {
      const {
        obstacleArchetype,
        nickname,
        interactionId,
        directionsBlocked,
        position,
      } = obstacleData;

      // Create an Obstacle instance using preset values.
      const obstacle = LevelMapObstacleGenerator.getObstacleByPreset(
        obstacleArchetype,
        nickname,
        interactionId,
        directionsBlocked,
        position
      );

      if (!obstacle) {
        console.error(`LevelMap: Failed to create obstacle ${nickname}`);
        continue;
      }

      // Retrieve the board slot located at the obstacle's intended position.
      const boardSlot = level.boardSlots[position.x][position.z];
      if (boardSlot) {
        // Host the obstacle in the board slot.
        boardSlot.hostObstacle(obstacle);

        // Load the obstacle's model into the scene.
        relevantSceneBuilder.loadModel(obstacle.positionedObject);
      } else {
        console.warn(`LevelMap: No BoardSlot at ${position.x}, ${position.z}`);
      }
    }
  }

  /**
   * Dynamically generates edge obstacles (mountains) along the borders of the game level.
   * This helps to simulate natural boundaries and define the playable area.
   *
   * @param {LevelMap} level - The level map to which edge obstacles are added.
   */

  generateEdgeMountains(level) {
    const mountains = [];

    // Generate obstacles along the left and right edges.
    for (let z = 0; z < level.mapDepth; z++) {
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
        position: new BABYLON.Vector3(level.mapWidth - 1, 0, z),
      });
    }

    // Generate obstacles along the top and bottom edges.
    for (let x = 0; x < level.mapWidth; x++) {
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
        position: new BABYLON.Vector3(x, 0, level.mapDepth - 1),
      });
    }

    // Overwrite the level's obstacles with the generated edge obstacles.
    level.obstacles = mountains;
  }

  /**
   * Factory method to create an Obstacle instance based on preset configurations.
   *
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
    );
  }

  /**
   * Resolves and returns the model ID corresponding to an obstacle archetype.
   *
   * @param {string} obstacleArchetype - The archetype name to resolve.
   * @returns {string} - The model ID associated with the given archetype.
   */
  static getModelIdByNickname(obstacleArchetype) {
    let modelId = "testMountain"; // Default model ID.
    switch (obstacleArchetype.toLowerCase()) {
      case "mountain":
        modelId = "testMountain";
        break;
    }
    return modelId;
  }
}
