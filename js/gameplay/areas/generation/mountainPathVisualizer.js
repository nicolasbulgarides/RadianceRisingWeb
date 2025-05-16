/**
 * MountainPathVisualizer provides visualization tools for mountain paths
 * to help with debugging and testing the path generation algorithms.
 *
 * This class is designed to help visualize:
 * 1. The grid layout with mountains and empty spaces
 * 2. The generated path between start and end positions
 * 3. Fallback 3D mountain representations when standard rendering fails
 */
class MountainPathVisualizer {
  /**
   * Renders a simple grid visualization with path in the scene
   * @param {Array} grid - 2D grid representation
   * @param {Array} path - Array of path positions
   * @param {BABYLON.Scene} scene - Optional scene to use (will get active scene if not provided)
   * @returns {Object} An object containing the created visualization meshes
   */
  static visualizeGridInScene(grid, path, scene = null) {
    if (!grid || !path) {
      console.warn("Cannot visualize: Missing grid or path data");
      return null;
    }

    // Get scene if not provided
    if (!scene) {
      scene =
        FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
      if (!scene) {
        console.warn("Cannot visualize: No active scene available");
        return null;
      }
    }

    const visualizationMeshes = {
      gridMarkers: [],
      pathMarkers: [],
      pathLines: [],
    };

    // Visualize the grid
    for (let z = 0; z < grid.length; z++) {
      for (let x = 0; x < grid[0].length; x++) {
        const cell = grid[z][x];
        let marker;

        if (cell === "M") {
          // Mountain (already visualized in 3D)
          continue;
        } else if (cell === "S") {
          // Start position (green)
          marker = BABYLON.MeshBuilder.CreateBox("start", { size: 0.3 }, scene);
          marker.position = new BABYLON.Vector3(x, 0.15, z);
          marker.material = new BABYLON.StandardMaterial("startMat", scene);
          marker.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
          marker.material.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
          marker.material.alpha = 0.7;
          visualizationMeshes.gridMarkers.push(marker);
        } else if (cell === "E") {
          // End position (red)
          marker = BABYLON.MeshBuilder.CreateBox("end", { size: 0.3 }, scene);
          marker.position = new BABYLON.Vector3(x, 0.15, z);
          marker.material = new BABYLON.StandardMaterial("endMat", scene);
          marker.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
          marker.material.emissiveColor = new BABYLON.Color3(0.5, 0, 0);
          marker.material.alpha = 0.7;
          visualizationMeshes.gridMarkers.push(marker);
        }
      }
    }

    // Create path points array for the line
    const pathPoints = [];

    // Visualize the path
    for (let i = 0; i < path.length; i++) {
      const pathPoint = path[i];

      // Skip start and end points (already visualized)
      if (
        grid[pathPoint.z][pathPoint.x] === "S" ||
        grid[pathPoint.z][pathPoint.x] === "E"
      ) {
        continue;
      }

      // Create path marker (blue sphere)
      const pathMarker = BABYLON.MeshBuilder.CreateSphere(
        `path_${i}`,
        { diameter: 0.3 },
        scene
      );
      pathMarker.position = new BABYLON.Vector3(pathPoint.x, 0.15, pathPoint.z);

      // Apply blue material with glow
      pathMarker.material = new BABYLON.StandardMaterial(`pathMat_${i}`, scene);
      pathMarker.material.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
      pathMarker.material.emissiveColor = new BABYLON.Color3(0, 0.3, 0.6);
      pathMarker.material.alpha = 0.8;

      visualizationMeshes.pathMarkers.push(pathMarker);
      pathPoints.push(new BABYLON.Vector3(pathPoint.x, 0.15, pathPoint.z));
    }

    // Create lines connecting the path points
    if (pathPoints.length > 1) {
      // Create a thicker line for better visibility
      const pathLine = BABYLON.MeshBuilder.CreateLines(
        "pathLine",
        {
          points: pathPoints,
          updatable: false,
          instance: null,
        },
        scene
      );

      // Make the line more visible
      pathLine.color = new BABYLON.Color3(0, 0.7, 1);
      pathLine.width = 0.1; // Thicker line

      // Add a glow effect
      const lineMaterial = new BABYLON.StandardMaterial("pathLineMat", scene);
      lineMaterial.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
      lineMaterial.alpha = 0.8;
      pathLine.material = lineMaterial;

      visualizationMeshes.pathLines.push(pathLine);

      // Add debug logging
      console.log("Created path line with points:", pathPoints.length);
    } else {
      console.warn("Not enough path points to create a line");
    }

    console.log(
      `Visualization created with ${visualizationMeshes.gridMarkers.length} grid markers, ${visualizationMeshes.pathMarkers.length} path markers, and ${visualizationMeshes.pathLines.length} path lines`
    );

    return visualizationMeshes;
  }

  /**
   * Creates fallback 3D mountain meshes for debugging when standard obstacles don't render
   * @param {Array} grid - 2D grid representation
   * @param {BABYLON.Scene} scene - Scene to create mountains in
   * @returns {Array} Array of created mountain meshes
   */
  static createFallbackMountains(grid, scene = null) {
    if (!grid) {
      console.warn("Cannot create fallback mountains: Missing grid data");
      return [];
    }

    // Get scene if not provided
    if (!scene) {
      scene =
        FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
      if (!scene) {
        console.warn(
          "Cannot create fallback mountains: No active scene available"
        );
        return [];
      }
    }

    const mountainMeshes = [];

    // Create simplified mountain meshes for each "M" in the grid
    for (let z = 0; z < grid.length; z++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[z][x] === "M") {
          // Create a simple cone for each mountain
          const mountain = BABYLON.MeshBuilder.CreateCylinder(
            `fallbackMountain_${x}_${z}`,
            {
              diameterTop: 0,
              diameterBottom: 0.8,
              height: 1.0,
              tessellation: 4,
            },
            scene
          );

          // Position the mountain
          mountain.position = new BABYLON.Vector3(x, 0.5, z);

          // Apply mountain material
          mountain.material = new BABYLON.StandardMaterial(
            `mountainMat_${x}_${z}`,
            scene
          );
          mountain.material.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.3);

          mountainMeshes.push(mountain);
        }
      }
    }

    console.log(`Created ${mountainMeshes.length} fallback mountain meshes`);
    return mountainMeshes;
  }

  /**
   * Visualizes the complete grid with both path markers and fallback mountains
   * @param {Array} grid - 2D grid representation
   * @param {Array} path - Array of path positions
   * @param {boolean} createMountains - Whether to create fallback mountains
   * @param {BABYLON.Scene} scene - Optional scene to use
   * @returns {Object} Object containing all visualization components
   */
  static visualizeFullGrid(grid, path, createMountains = true, scene = null) {
    if (!grid || !path) {
      console.warn("Cannot visualize: Missing grid or path data");
      return null;
    }

    // Get scene if not provided
    if (!scene) {
      scene =
        FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
      if (!scene) {
        console.warn("Cannot visualize: No active scene available");
        return null;
      }
    }

    // Create visualization components
    const result = {
      pathVisuals: this.visualizeGridInScene(grid, path, scene),
      mountains: createMountains
        ? this.createFallbackMountains(grid, scene)
        : [],
    };

    console.log(
      `Full visualization created with ${result.mountains.length} mountains`
    );
    return result;
  }

  /**
   * Logs the grid and path to console for debugging
   * @param {Array} grid - 2D grid representation
   * @param {Array} path - Array of path positions
   */
  static logGridToConsole(grid, path) {
    if (!grid) {
      console.warn("Cannot log grid: Missing grid data");
      return;
    }

    console.log("Grid visualization:");

    // Create a copy of the grid for visualization
    const visualGrid = JSON.parse(JSON.stringify(grid));

    // Mark path on the grid with '*'
    if (path) {
      for (const point of path) {
        // Skip start and end points
        if (
          visualGrid[point.z][point.x] !== "S" &&
          visualGrid[point.z][point.x] !== "E"
        ) {
          visualGrid[point.z][point.x] = "*";
        }
      }
    }

    // Print the grid
    for (let z = 0; z < visualGrid.length; z++) {
      let row = "";
      for (let x = 0; x < visualGrid[0].length; x++) {
        let cell = visualGrid[z][x];

        // Make it more readable
        if (cell === ".") cell = "·"; // Empty cell
        if (cell === "M") cell = "▲"; // Mountain
        if (cell === "S") cell = "S"; // Start
        if (cell === "E") cell = "E"; // End
        if (cell === "*") cell = "○"; // Path

        row += cell + " ";
      }
      console.log(row);
    }

    // Print legend
    console.log("\nLegend: ▲=Mountain, ·=Empty, S=Start, E=End, ○=Path");

    if (path) {
      console.log(`Path length: ${path.length} steps`);
    }
  }
}
