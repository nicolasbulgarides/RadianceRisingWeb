class WorldMapObstacleGenerator {
  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;
  }
  initializeObstacles(world) {
    if (!world.obstacles) return;

    for (const obstacleData of world.obstacles) {
      const {
        obstacleArchetype,
        nickname,
        interactionId,
        directionsBlocked,
        position,
      } = obstacleData;

      const obstacle = WorldMapObstacleGenerator.getObstacleByPreset(
        obstacleArchetype,
        nickname,
        interactionId,
        directionsBlocked,
        position
      );

      if (!obstacle) {
        console.error(`WorldMap: Failed to create obstacle ${nickname}`);
        continue;
      }

      const boardSlot = world.boardSlots[position.x][position.z];
      if (boardSlot) {
        boardSlot.hostObstacle(obstacle);
        this.sceneBuilder.loadModel(obstacle.positionedObject);
      } else {
        console.warn(`WorldMap: No BoardSlot at ${position.x}, ${position.z}`);
      }
    }
  }
  generateEdgeMountains(world) {
    const mountains = [];

    // Left and Right edges
    for (let z = 0; z < world.mapDepth; z++) {
      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_left_${z}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(0, 0, z),
      });

      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_right_${z}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(world.mapWidth - 1, 0, z),
      });
    }

    // Top and Bottom edges
    for (let x = 0; x < world.mapWidth; x++) {
      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_top_${x}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(x, 0, 0),
      });

      mountains.push({
        obstacleArchetype: "mountain",
        nickname: `mountain_bottom_${x}`,
        interactionId: "none",
        directionsBlocked: "all",
        position: new BABYLON.Vector3(x, 0, world.mapDepth - 1),
      });
    }

    // Add to world's obstacles list
    world.obstacles = mountains;
  }
  /**
   * Static factory method for preset obstacles
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

  static getModelIdByNickname(obstacleArchetype) {
    let modelId = "testMountain";
    switch (obstacleArchetype.toLowerCase()) {
      case "mountain":
        modelId = "testMountain";
        break;
    }
    return modelId;
  }
}
