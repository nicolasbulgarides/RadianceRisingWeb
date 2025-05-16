/**
 * Test script demonstrating how to use the MountainPathGenerator
 * to create and load levels with mountain obstacles that create solvable paths.
 *
 * This script sets up a complete test example showing how to:
 * 1. Create a level with mountain obstacles
 * 2. Define start and end positions
 * 3. Generate a solvable path
 * 4. Load and render the level
 */
class MountainPathTest {
  /**
   * Runs the complete mountain path generator test
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   */
  static async runCompleteTest(useFallbackVisualization = false) {
    try {
      console.log("Starting Mountain Path Generator Test");

      // Create a new mountain path generator
      const generator = new MountainPathGenerator();

      // Define test parameters
      const levelId = "testlevel0";
      const startPosition = { x: 1, y: 0.25, z: 1 };
      const endPosition = { x: 9, y: 0.25, z: 9 };
      const gridWidth = 11;
      const gridDepth = 21;
      const obstacleRatio = 0.3; // 30% of interior cells will be mountains

      // Load the generated level
      console.log(
        `Generating mountain path level with ${
          useFallbackVisualization ? "fallback" : "real"
        } visualization...`
      );
      const gameplayLevel = await generator.loadGeneratedLevel(
        levelId,
        startPosition,
        endPosition,
        gridWidth,
        gridDepth,
        obstacleRatio,
        useFallbackVisualization
      );

      if (gameplayLevel) {
        console.log("Successfully loaded mountain path test level");

        // Visualize the path if needed
        this.visualizePath(gameplayLevel, startPosition, endPosition);

        // Set up camera to view the level properly - only uncomment if needed
        // this.setupCamera(gameplayLevel);

        return gameplayLevel;
      } else {
        console.error("Failed to load mountain path test level");
        return null;
      }
    } catch (error) {
      console.error("Error in runCompleteTest:", error);
      return null;
    }
  }

  /**
   * Creates and runs a specific test configuration
   * @param {Object} startPosition - Starting position {x, y, z}
   * @param {Object} endPosition - End position {x, y, z}
   * @param {number} width - Width of the level grid
   * @param {number} depth - Depth of the level grid
   * @param {number} obstacleRatio - Ratio of obstacles to place (0.0 to 0.5)
   * @param {boolean} useFallbackVisualization - Whether to use fallback cylinder mountains
   * @returns {Promise<ActiveGameplayLevel>} The loaded gameplay level
   */
  static async runCustomTest(
    startPosition = { x: 2, y: 0.25, z: 2 },
    endPosition = { x: 8, y: 0.25, z: 8 },
    width = 11,
    depth = 11,
    obstacleRatio = 0.3,
    useFallbackVisualization = false
  ) {
    try {
      console.log("Starting Custom Mountain Path Test");
      console.log(
        `Start: (${startPosition.x}, ${startPosition.z}), End: (${endPosition.x}, ${endPosition.z})`
      );

      const generator = new MountainPathGenerator();

      // Generate a unique ID for this test
      const levelId = `mountainTest_${Date.now()}`;

      // Load the generated level
      const gameplayLevel = await generator.loadGeneratedLevel(
        levelId,
        startPosition,
        endPosition,
        width,
        depth,
        obstacleRatio,
        useFallbackVisualization
      );

      if (gameplayLevel) {
        console.log("Successfully loaded custom mountain path test level");
        return gameplayLevel;
      } else {
        console.error("Failed to load custom mountain path test level");
        return null;
      }
    } catch (error) {
      console.error("Error in runCustomTest:", error);
      return null;
    }
  }

  /**
   * Visualizes the path between start and end positions using visual markers
   * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level
   * @param {Object} startPosition - Starting position {x, y, z}
   * @param {Object} endPosition - End position {x, y, z}
   */
  static visualizePath(gameplayLevel, startPosition, endPosition) {
    try {
      // Get the current scene
      const scene =
        FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
      if (!scene) {
        console.warn("No active scene found for path visualization");
        return;
      }

      // Create a visible marker for start position (green sphere)
      const startMarker = BABYLON.MeshBuilder.CreateSphere(
        "startMarker",
        { diameter: 0.5 },
        scene
      );
      startMarker.position = new BABYLON.Vector3(
        startPosition.x,
        startPosition.y + 0.5,
        startPosition.z
      );
      startMarker.material = new BABYLON.StandardMaterial(
        "startMaterial",
        scene
      );
      startMarker.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      startMarker.material.alpha = 0.7;

      // Create a visible marker for end position (red sphere)
      const endMarker = BABYLON.MeshBuilder.CreateSphere(
        "endMarker",
        { diameter: 0.5 },
        scene
      );
      endMarker.position = new BABYLON.Vector3(
        endPosition.x,
        endPosition.y + 0.5,
        endPosition.z
      );
      endMarker.material = new BABYLON.StandardMaterial("endMaterial", scene);
      endMarker.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      endMarker.material.alpha = 0.7;

      console.log("Path visualization complete");
    } catch (error) {
      console.error("Error visualizing path:", error);
    }
  }
}
