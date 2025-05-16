/**
 * MountainPathGenerator creates game levels with strategically placed mountain obstacles
 * that create solvable paths between start and end positions.
 *
 * The generator creates obstacles that guide player movement along specific paths,
 * ensuring that levels are always solvable while providing the desired challenge.
 */
class MountainPathGenerator {
  constructor() {
    this.obstacleGenerator =
      FundamentalSystemBridge[
        "levelFactoryComposite"
      ].levelMapObstacleGenerator;
    this.testLevelBuilder = TestLevelJsonBuilder.getInstance();
    this.lastGeneratedData = null;
  }

  /**
   * Generates a complete level with mountains that create a solvable path
   * @param {string} levelId - ID for the level
   * @param {string} levelNickname - User-friendly name for the level
   * @param {Object} startPosition - Starting position {x, y, z}
   * @param {Object} endPosition - Ending position {x, y, z}
   * @param {number} width - Width of the level grid
   * @param {number} depth - Depth of the level grid
   * @param {number} obstacleRatio - Ratio of obstacles to place (0.0 to 0.5)
   * @returns {LevelDataComposite} Complete level data
   */
  generateSolvableLevel(
    levelId,
    levelNickname,
    startPosition,
    endPosition,
    width = 11,
    depth = 21,
    obstacleRatio = 0.3
  ) {
    // Ensure startPosition and endPosition are valid objects with x, y, z properties
    startPosition = this.ensureValidPosition(startPosition);
    endPosition = this.ensureValidPosition(endPosition);

    // Create the grid representation for pathfinding
    const grid = this.initializeGrid(width, depth);

    // Mark start and end positions
    const startX = Math.floor(startPosition.x);
    const startZ = Math.floor(startPosition.z);
    const endX = Math.floor(endPosition.x);
    const endZ = Math.floor(endPosition.z);

    grid[startZ][startX] = "S"; // Mark start
    grid[endZ][endX] = "E"; // Mark end

    // Generate mountain obstacles with guaranteed path
    const obstacles = this.generateMountainObstacles(
      grid,
      startPosition,
      endPosition,
      width,
      depth,
      obstacleRatio
    );

    // Log obstacle details for debugging
    //  console.log(`Generated ${obstacles.length} obstacles`);
    if (obstacles.length > 0) {
      /** 
      console.log(`First obstacle type: ${typeof obstacles[0]}`);
      console.log(
        `First obstacle properties:`,
        JSON.stringify(obstacles[0], null, 2)
      );
      */
    }

    // Create level with obstacles
    const levelData = TestLevelJsonBuilder.buildLevelWithObstacles(
      levelId,
      levelNickname,
      obstacles
    );

    // Set custom properties
    levelData.customGridSize = { width, depth };
    levelData.playerStartPosition = {
      x: startPosition.x,
      y: startPosition.y,
      z: startPosition.z,
    };

    // Store obstacles directly in level data for easier access
    levelData.obstacles = obstacles;

    // Add end position as objective
    this.addEndPositionObjective(levelData, endPosition);

    return levelData;
  }

  /**
   * Ensures a position object has valid x, y, z properties
   * @param {Object} position - Position object to validate
   * @returns {Object} Valid position object with x, y, z properties
   */
  ensureValidPosition(position) {
    if (!position) {
      console.warn("Position is undefined, using default position");
      return new BABYLON.Vector3(1, 0.25, 1);
    }

    // Check if position is already a Vector3
    if (position instanceof BABYLON.Vector3) {
      return position;
    }

    // Ensure each coordinate exists
    const x = position.x !== undefined ? position.x : 1;
    const y = position.y !== undefined ? position.y : 0.25;
    const z = position.z !== undefined ? position.z : 1;

    // Return a new Vector3 to ensure proper format
    return new BABYLON.Vector3(x, y, z);
  }

  /**
   * Initializes a 2D grid for obstacle placement
   * @param {number} width - Grid width
   * @param {number} depth - Grid depth
   * @returns {Array} 2D array representing the grid
   */
  initializeGrid(width, depth) {
    const grid = [];
    for (let z = 0; z < depth; z++) {
      grid[z] = [];
      for (let x = 0; x < width; x++) {
        // Edge positions are always mountains
        if (x === 0 || z === 0 || x === width - 1 || z === depth - 1) {
          grid[z][x] = "M"; // Mountain
        } else {
          grid[z][x] = "."; // Empty space
        }
      }
    }
    return grid;
  }

  /**
   * Generates mountain obstacles while ensuring a valid path exists
   * @param {Array} grid - 2D grid representation
   * @param {Object} startPosition - Starting position {x, y, z}
   * @param {Object} endPosition - Ending position {x, y, z}
   * @param {number} width - Width of the level grid
   * @param {number} depth - Depth of the level grid
   * @param {number} obstacleRatio - Ratio of obstacles to place (0.0 to 0.5)
   * @returns {Array} Array of obstacle definitions
   */
  generateMountainObstacles(
    grid,
    startPosition,
    endPosition,
    width,
    depth,
    obstacleRatio
  ) {
    // Ensure positions are valid
    startPosition = this.ensureValidPosition(startPosition);
    endPosition = this.ensureValidPosition(endPosition);

    const startX = Math.floor(startPosition.x);
    const startZ = Math.floor(startPosition.z);
    const endX = Math.floor(endPosition.x);
    const endZ = Math.floor(endPosition.z);

    // Calculate desired number of mountains based on ratio
    const totalCells = width * depth;
    const edgeCells = 2 * width + 2 * (depth - 2); // Cells around the edge
    const interiorCells = totalCells - edgeCells - 2; // Subtract start and end
    const mountainCount = Math.floor(interiorCells * obstacleRatio);

    // First generate a valid path between start and end
    const path = this.findPath(grid, startX, startZ, endX, endZ);

    if (!path) {
      console.error(
        "Could not find a valid path between start and end positions"
      );
      return [];
    }

    // Create a set of path coordinates for quick lookup
    const pathCoords = new Set();
    path.forEach((point) => pathCoords.add(`${point.x},${point.z}`));

    // Create list of potential mountain positions (excluding path, start, end)
    const potentialPositions = [];
    for (let z = 1; z < depth - 1; z++) {
      for (let x = 1; x < width - 1; x++) {
        const coordKey = `${x},${z}`;
        if (
          !pathCoords.has(coordKey) &&
          !(x === startX && z === startZ) &&
          !(x === endX && z === endZ)
        ) {
          potentialPositions.push({ x, z });
        }
      }
    }

    // Shuffle potential positions
    this.shuffleArray(potentialPositions);

    // Place mountains (limited by obstacle ratio)
    const mountainPositions = potentialPositions.slice(0, mountainCount);

    // Mark mountains in grid
    mountainPositions.forEach((pos) => {
      grid[pos.z][pos.x] = "M";
    });

    // Create final obstacles list including edges and interior mountains
    const obstacles = [];

    // Add mountains - create actual Obstacle instances
    for (let z = 0; z < depth; z++) {
      for (let x = 0; x < width; x++) {
        if (grid[z][x] === "M") {
          // Create a properly initialized position Vector3
          const position = new BABYLON.Vector3(x, 0, z);

          // Define the mountain properties
          const obstacleArchetype = "mountain"; // This is important - must be a lowercase string
          const nickname = `mountain_${x}_${z}`;
          const interactionId = "none";
          const directionsBlocked = "all";

          // Create a properly initialized Obstacle instance
          const obstacleInstance = new Obstacle(
            "testMountain", // modelId
            nickname,
            interactionId,
            directionsBlocked,
            position // position (as BABYLON.Vector3)
          );

          // Explicitly set the obstacleArchetype property
          obstacleInstance.obstacleArchetype = obstacleArchetype;
          obstacleInstance.isObstacle = true;
          obstacleInstance.position = position; // Ensure position is directly accessible

          // For the LevelMapObstacleGenerator class which expects these properties
          obstacleInstance.nickname = nickname;
          obstacleInstance.directionsBlocked = directionsBlocked;
          obstacleInstance.interactionId = interactionId;

          // Add to obstacles list
          obstacles.push(obstacleInstance);
        }
      }
    }

    // console.log(`Created ${obstacles.length} mountain obstacles`);
    /**   
    console.log(
      "First obstacle details:",
      obstacles.length > 0
        ? JSON.stringify(
            {
              obstacleArchetype: obstacles[0].obstacleArchetype,
              nickname: obstacles[0].nickname,
              position: obstacles[0].position,
            },
            null,
            2
          )
        : "No obstacles created"
    );
    */
    // Store the grid and path for visualization
    this.lastGeneratedData = {
      grid: grid,
      path: path,
      startPosition: { x: startX, z: startZ },
      endPosition: { x: endX, z: endZ },
    };

    return obstacles;
  }

  /**
   * Finds a path between start and end positions
   * @param {Array} grid - 2D grid representation
   * @param {number} startX - Starting X position
   * @param {number} startZ - Starting Z position
   * @param {number} endX - Ending X position
   * @param {number} endZ - Ending Z position
   * @returns {Array|null} Array of positions or null if no path found
   */
  findPath(grid, startX, startZ, endX, endZ) {
    // A* pathfinding algorithm to find a path
    const openSet = [];
    const closedSet = new Set();
    const cameFrom = new Map();

    // Tracking scores
    const gScore = new Map(); // Cost from start to current
    const fScore = new Map(); // Estimated total cost (g + heuristic)

    // Initialize start node
    const startNode = { x: startX, z: startZ };
    openSet.push(startNode);
    gScore.set(`${startX},${startZ}`, 0);
    fScore.set(
      `${startX},${startZ}`,
      this.heuristic(startX, startZ, endX, endZ)
    );

    while (openSet.length > 0) {
      // Sort open set by fScore to get the node with lowest cost
      openSet.sort((a, b) => {
        return fScore.get(`${a.x},${a.z}`) - fScore.get(`${b.x},${b.z}`);
      });

      const current = openSet.shift();
      const currentKey = `${current.x},${current.z}`;

      // If we've reached the end, reconstruct path
      if (current.x === endX && current.z === endZ) {
        return this.reconstructPath(cameFrom, current);
      }

      closedSet.add(currentKey);

      // Check all four directions
      const directions = [
        { x: 0, z: 1 }, // North
        { x: 1, z: 0 }, // East
        { x: 0, z: -1 }, // South
        { x: -1, z: 0 }, // West
      ];

      for (const dir of directions) {
        const neighbor = {
          x: current.x + dir.x,
          z: current.z + dir.z,
        };

        // Skip if out of bounds
        if (
          neighbor.x < 0 ||
          neighbor.z < 0 ||
          neighbor.x >= grid[0].length ||
          neighbor.z >= grid.length
        ) {
          continue;
        }

        const neighborKey = `${neighbor.x},${neighbor.z}`;

        // Skip if in closed set or is a mountain
        if (
          closedSet.has(neighborKey) ||
          grid[neighbor.z][neighbor.x] === "M"
        ) {
          continue;
        }

        // Calculate tentative gScore
        const tentativeGScore = gScore.get(currentKey) + 1;

        // Add to open set if not there
        if (
          !openSet.some(
            (node) => node.x === neighbor.x && node.z === neighbor.z
          )
        ) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
          // Not a better path
          continue;
        }

        // This is the best path until now, record it
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(
          neighborKey,
          tentativeGScore + this.heuristic(neighbor.x, neighbor.z, endX, endZ)
        );
      }
    }

    // No path found
    return null;
  }

  /**
   * Calculates Manhattan distance heuristic
   * @param {number} x1 - Current X position
   * @param {number} z1 - Current Z position
   * @param {number} x2 - Target X position
   * @param {number} z2 - Target Z position
   * @returns {number} Estimated distance
   */
  heuristic(x1, z1, x2, z2) {
    return Math.abs(x1 - x2) + Math.abs(z1 - z2);
  }

  /**
   * Reconstructs path from A* algorithm result
   * @param {Map} cameFrom - Map of previous positions
   * @param {Object} current - Current position
   * @returns {Array} Array of positions forming the path
   */
  reconstructPath(cameFrom, current) {
    const path = [current];
    let key = `${current.x},${current.z}`;

    while (cameFrom.has(key)) {
      current = cameFrom.get(key);
      path.unshift(current);
      key = `${current.x},${current.z}`;
    }

    return path;
  }

  /**
   * Adds the end position objective to the level data
   * @param {LevelDataComposite} levelData - The level data to modify
   * @param {Object} endPosition - The end position {x, y, z}
   */
  addEndPositionObjective(levelData, endPosition) {
    // Create a special featured object for the end position
    const endObject = {
      objectType: "endPosition",
      nickname: "level_end_position",
      position: new BABYLON.Vector3(
        endPosition.x,
        endPosition.y || 0,
        endPosition.z
      ),
      isObstacle: false,
      isInteractive: true,
    };

    // Initialize levelGameplayTraitsData if needed
    if (!levelData.levelGameplayTraitsData) {
      levelData.levelGameplayTraitsData = {};
    }

    // Initialize featuredObjects if needed
    if (!levelData.levelGameplayTraitsData.featuredObjects) {
      levelData.levelGameplayTraitsData.featuredObjects = [];
    }

    // Add to featured objects
    levelData.levelGameplayTraitsData.featuredObjects.push(endObject);

    // Ensure victory conditions are set up
    this.ensureVictoryConditions(levelData, endPosition);
  }

  /**
   * Ensures victory conditions are properly set for the end position
   * @param {LevelDataComposite} levelData - The level data
   * @param {Object} endPosition - The end position coordinates
   */
  ensureVictoryConditions(levelData, endPosition) {
    // Initialize levelGameplayTraitsData if it doesn't exist
    if (!levelData.levelGameplayTraitsData) {
      levelData.levelGameplayTraitsData = {};
    }

    // Initialize victoryConditions if it doesn't exist
    if (!levelData.levelGameplayTraitsData.victoryConditions) {
      levelData.levelGameplayTraitsData.victoryConditions = [];
    }

    // Create a new victory condition if none exists
    if (levelData.levelGameplayTraitsData.victoryConditions.length === 0) {
      const newVictoryCondition = new LevelVictoryCondition(
        levelData.levelHeaderData?.levelId || "generated_level",
        "Complete the Level",
        "Reach the end of the level to complete it",
        [] // Empty objectives array to start
      );

      levelData.levelGameplayTraitsData.victoryConditions.push(
        newVictoryCondition
      );
    }

    // Update or create reach end objective
    const reachEndObjective = new LevelObjective(
      "reach_end",
      "Reach the End",
      "Reach the end of the level",
      "position",
      { x: endPosition.x, y: endPosition.y || 0, z: endPosition.z },
      true, // earns full victory
      "" // no special trigger
    );

    // Set this objective in the first victory condition
    const victoryCondition =
      levelData.levelGameplayTraitsData.victoryConditions[0];

    // Initialize objectives array if it doesn't exist
    if (!victoryCondition.objectives) {
      victoryCondition.objectives = [];
    }

    // Replace or add the objective
    let foundExisting = false;
    for (let i = 0; i < victoryCondition.objectives.length; i++) {
      if (victoryCondition.objectives[i].objectiveId === "reach_end") {
        victoryCondition.objectives[i] = reachEndObjective;
        foundExisting = true;
        break;
      }
    }

    if (!foundExisting) {
      victoryCondition.objectives.push(reachEndObjective);
    }
  }

  /**
   * Loads the generated level into the gameplay manager
   * @param {string} levelId - The level ID
   * @param {Object} startPosition - Starting position {x, y, z}
   * @param {Object} endPosition - End position {x, y, z}
   * @param {number} width - Width of the level grid
   * @param {number} depth - Depth of the level grid
   * @param {number} obstacleRatio - Ratio of obstacles to place (0.0 to 0.5)
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains instead of regular models
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  async loadGeneratedLevel(
    levelId = "testlevel0",
    startPosition = { x: 1, y: 0.25, z: 1 },
    endPosition = { x: 9, y: 0.25, z: 9 },
    width = 11,
    depth = 21,
    obstacleRatio = 0.3,
    useFallbackVisualization = false
  ) {
    // Generate the level data
    const levelData = this.generateSolvableLevel(
      levelId,
      "Generated Puzzle Level",
      startPosition,
      endPosition,
      width,
      depth,
      obstacleRatio
    );

    // Log the entire levelData to check if obstacles are present
    /** 
    console.log(
      "Level data generated with obstacles:",
      levelData.obstacles?.length || 0
    );
    */

    // Use TestManager to load the level
    const testManager = new TestManager();
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

    // Create an active gameplay level instance
    let activeGameplayLevel = await testManager.prepareGameplayLevelObject(
      levelData
    );

    if (!activeGameplayLevel) {
      //console.error("Failed to create gameplay level");
      return null;
    }

    // Ensure the level map and level data composite are initialized
    if (!activeGameplayLevel.levelMap) {
      activeGameplayLevel.levelMap = {};
    }

    // Directly set obstacles on the activeGameplayLevel
    if (levelData.obstacles && levelData.obstacles.length > 0) {
      // Store obstacles in a single location
      activeGameplayLevel.obstacles = levelData.obstacles;

      // Reference the same obstacles array in other locations instead of copying
      if (activeGameplayLevel.levelDataComposite) {
        activeGameplayLevel.levelDataComposite.obstacles =
          activeGameplayLevel.obstacles;
      }

      if (activeGameplayLevel.levelMap) {
        activeGameplayLevel.levelMap.obstacles = activeGameplayLevel.obstacles;
      }

      // Only add obstacles to featuredObjects if they're not already there
      if (activeGameplayLevel.levelDataComposite?.levelGameplayTraitsData) {
        const featuredObjects =
          activeGameplayLevel.levelDataComposite.levelGameplayTraitsData
            .featuredObjects || [];

        // Filter out any existing obstacles to prevent duplicates
        const nonObstacleObjects = featuredObjects.filter(
          (obj) => !obj.isObstacle
        );

        // Add obstacles only if they're not already in featuredObjects
        const existingObstacleIds = new Set(
          featuredObjects.map((obj) => obj.nickname)
        );
        const newObstacles = levelData.obstacles.filter(
          (obstacle) => !existingObstacleIds.has(obstacle.nickname)
        );

        // Combine non-obstacle objects with new obstacles
        activeGameplayLevel.levelDataComposite.levelGameplayTraitsData.featuredObjects =
          [...nonObstacleObjects, ...newObstacles];
      }

      //console.log("Successfully stored obstacles in activeGameplayLevel");
    } else if (!levelData.obstacles) {
      // console.log("No obstacles found in level data");
    }

    // Set it as the active level
    gameplayManager.setActiveGameplayLevel(activeGameplayLevel);

    // Get the scene for rendering
    const scene =
      FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
    const sceneBuilder =
      FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene(
        "BaseGameScene"
      );

    // Render the level with real models or fallback visualization
    if (!useFallbackVisualization && sceneBuilder) {
      // Render the level with real models
      await testManager.renderLevel(activeGameplayLevel);

      //  console.log("Attempting to render mountain obstacles as real models...");

      // Use the LevelMapObstacleGenerator to render obstacles
      const obstacleGenerator =
        FundamentalSystemBridge["levelFactoryComposite"]
          .levelMapObstacleGenerator;

      // Log what obstacles the generator is seeing
      const foundObstacles =
        obstacleGenerator.getObstaclesFromLevel(activeGameplayLevel);
      //  console.log("Obstacles found by generator:", foundObstacles?.length || 0);

      /**
      if (foundObstacles && foundObstacles.length > 0) {
        console.log("First found obstacle details:", {
          obstacleArchetype: foundObstacles[0].obstacleArchetype,
          nickname: foundObstacles[0].nickname,
        });
      }
    */
      // Render obstacles using the generator
      obstacleGenerator.renderObstaclesForLevel(
        activeGameplayLevel,
        sceneBuilder
      );
    } else {
      // Only render basic level components, not obstacles
      await testManager.renderLevel(activeGameplayLevel);

      // Create fallback cylinder mountains for visualization
      if (
        this.lastGeneratedData &&
        typeof MountainPathVisualizer !== "undefined"
      ) {
        console.log("Creating visualization with path and mountains...");

        // Create fallback mountains
        MountainPathVisualizer.createFallbackMountains(
          this.lastGeneratedData.grid,
          scene
        );

        // Visualize the path
        const visualization = MountainPathVisualizer.visualizeGridInScene(
          this.lastGeneratedData.grid,
          this.lastGeneratedData.path,
          scene
        );

        console.log("Visualization created:", visualization);
      } else {
        console.warn(
          "Cannot create fallback visualization - missing data or visualizer"
        );
      }
    }

    // Make sure the start position doesn't collide with obstacles
    const startVector = new BABYLON.Vector3(
      startPosition.x,
      startPosition.y,
      startPosition.z
    );

    // Verify the start position doesn't overlap with an obstacle
    let validStartPosition = startVector;

    // Get all obstacles
    const allObstacles = [
      ...(activeGameplayLevel.levelDataComposite?.obstacles || []),
      ...(activeGameplayLevel.levelMap?.obstacles || []),
    ];

    // Check if there's an obstacle at the start position
    const hasObstacleAtStart = allObstacles.some((obstacle) => {
      if (!obstacle || !obstacle.position) return false;
      return (
        Math.floor(obstacle.position.x) === Math.floor(startVector.x) &&
        Math.floor(obstacle.position.z) === Math.floor(startVector.z)
      );
    });

    // If there's an obstacle at the start position, find a nearby empty space
    if (hasObstacleAtStart) {
      /** 
      console.warn(
        "Start position overlaps with an obstacle, finding a nearby valid position"
      );
    */
      // Check nearby positions (increasing Manhattan distance)
      for (let distance = 1; distance <= 5; distance++) {
        // Try in each cardinal direction
        const directions = [
          { x: 1, z: 0 }, // Right
          { x: -1, z: 0 }, // Left
          { x: 0, z: 1 }, // Up
          { x: 0, z: -1 }, // Down
          { x: 1, z: 1 }, // Diagonal up-right
          { x: 1, z: -1 }, // Diagonal down-right
          { x: -1, z: 1 }, // Diagonal up-left
          { x: -1, z: -1 }, // Diagonal down-left
        ];

        // Try each direction at current distance
        for (const dir of directions) {
          const tryX = Math.floor(startVector.x) + dir.x * distance;
          const tryZ = Math.floor(startVector.z) + dir.z * distance;

          // Skip if out of bounds
          if (tryX < 0 || tryZ < 0 || tryX >= width || tryZ >= depth) continue;

          // Check if position is obstacle-free
          const hasObstacle = allObstacles.some((obstacle) => {
            if (!obstacle || !obstacle.position) return false;
            return (
              Math.floor(obstacle.position.x) === tryX &&
              Math.floor(obstacle.position.z) === tryZ
            );
          });

          if (!hasObstacle) {
            // Found a valid position
            validStartPosition = new BABYLON.Vector3(tryX, startVector.y, tryZ);
            // console.log(`Adjusted start position to (${tryX}, ${tryZ})`);
            distance = 6; // Exit the outer loop
            break;
          }
        }
      }
    }

    // Load a player
    let demoPlayer = PlayerLoader.getFreshPlayer(activeGameplayLevel);
    demoPlayer.playerMovementManager.setMaxMovementDistance(5);

    // Position the player at the valid start position
    demoPlayer.playerMovementManager.setPositionRelocateModelInstantly(
      validStartPosition
    );

    // Load the player into the level
    await gameplayManager.loadPlayerToGameplayLevel(
      activeGameplayLevel,
      demoPlayer
    );

    /** 

    console.log(
      `Mountain path level successfully loaded with ${
        useFallbackVisualization ? "fallback" : "real"
      } mountain visualization`
    );
  */
    return activeGameplayLevel;
  }

  /**
   * Randomly shuffles array elements in-place
   * @param {Array} array - The array to shuffle
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Visualizes the current generated path and grid
   * @param {BABYLON.Scene} scene - The scene to visualize in
   * @param {boolean} createFallbackMountains - Whether to create fallback 3D mountains
   */
  visualizeCurrentGeneration(scene, createFallbackMountains = true) {
    if (!this.lastGeneratedData) {
      console.warn("No generation data available to visualize");
      return null;
    }

    if (!scene) {
      scene =
        FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
      if (!scene) {
        console.warn("No scene available for visualization");
        return null;
      }
    }

    // Use the enhanced visualization with fallback mountains
    if (createFallbackMountains) {
      console.log("Creating visualization with fallback mountains");
      return MountainPathVisualizer.visualizeFullGrid(
        this.lastGeneratedData.grid,
        this.lastGeneratedData.path,
        true // Create mountains
      );
    } else {
      // Standard visualization without mountains
      return MountainPathVisualizer.visualizeGridInScene(
        this.lastGeneratedData.grid,
        this.lastGeneratedData.path
      );
    }
  }

  /**
   * Logs the current generated path and grid to console
   */
  logCurrentGeneration() {
    if (!this.lastGeneratedData) {
      console.warn("No generation data available to log");
      return;
    }

    MountainPathVisualizer.logGridToConsole(
      this.lastGeneratedData.grid,
      this.lastGeneratedData.path
    );
  }
}
