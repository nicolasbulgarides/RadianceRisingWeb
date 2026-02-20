class GameGridGenerator {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    this.loadedTiles = [];
  }
  /**
   *
   * Returns an array of tile IDs based on the given level archetype.
   *
   * @param {string} archetype - The level preset identifier (e.g., "testLevel0").
   * @returns {Array<string>} - The list of tile IDs relevant to the level.
   * To do - if and when we make other tiles, modify
   */

  static getTileIdsByLevelArchetype(archetype = Config.DEMO_LEVEL) {
    // Default tile set - using just 2 tile types for simplicity and performance
    let tileIds = ["tile1", "tile3"];
    return tileIds;
  }

  async loadTilesModelsDefault() {
    let relevantSceneBuilder =
      FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene(
        "BaseGameScene"
      );
    const tilesLoaded = await this.loadTilesModels(
      relevantSceneBuilder,
      GameGridGenerator.getTileIdsByLevelArchetype(),
      1
    );

    // Set TILES_LOADED to true if tiles were successfully loaded
    if (tilesLoaded) {
      LevelFactoryComposite.TILES_LOADED = true;
    }

    return tilesLoaded; // Return the loading status
  }
  /**
   * Loads all tile models into memory based on provided tile IDs.
   * Generates base tile objects to be instanced for the game grid.
   *
   * @param {Array<string>} tileIds - Array of tile IDs identifying models to load.
   * @param {number} tileSize - Scale/size used for each tile.
   * @returns {Promise<boolean>} - Resolves to true if all tiles were loaded; false otherwise.
   */
  async loadTilesModels(relevantSceneBuilder, tileIds, tileSize) {
    // Use a zero vector position as a temporary placeholder during loading.
    const position = new BABYLON.Vector3(0, 0, 0);

    // Map each tile to a promise that loads its model.
    const tileLoadPromises = tileIds.map(async (tileId) => {
      // Generate the configuration for a positioned tile.
      const positionedObject = PositionedObject.getPositionedObjectQuick(
        tileId,
        position,
        tileSize,
        true, // freeze position during loading
        false, // not interactive
        true // clone the base model for instancing if needed
      );
      // Asynchronously load the tile model using the scene builder.
      const baseTile = await relevantSceneBuilder.loadModel(positionedObject);

      if (baseTile) {
        // Cache the loaded tile.
        this.loadedTiles.push(baseTile);
      } else {
        console.error(`GridGenerator: Failed to load tile '${tileId}'.`);
      }
    });

    // Wait until all tile load operations have completed.
    await Promise.all(tileLoadPromises);

    //to do - why does this load more tiles than expected May 12th 2025
    // Ensure all expected tiles were loaded.
    if (this.loadedTiles.length < tileIds.length) {
      console.error(
        `GridGenerator: Only loaded ${this.loadedTiles.length} out of ${tileIds.length} tiles.`
      );
      return false;
    }

    return true;
  }

  /**
   * Generates the game grid by creating thin instances of the loaded tiles.
   * Each grid cell is assigned a tile model instance with proper transformations.
   *
   * @param {number} width - The width of the grid (number of columns).
   * @param {number} depth - The depth of the grid (number of rows).
   * @param {number} [tileSize=1] - Size of each tile for spacing.
   * @returns {Promise<boolean>} - Resolves to true if the grid was generated successfully.
   */
  async generateGrid(width, depth, tileSize = 1) {
    // Validate input dimensions
    if (!width || !depth || width < 1 || depth < 1) {
      console.error(
        `GridGenerator: Invalid grid dimensions: ${width}x${depth}`
      );
      return false;
    }

    // Ensure tiles are loaded
    if (this.loadedTiles.length === 0) {
      console.error(
        "GridGenerator: No tiles loaded. Call loadTilesModels first."
      );
      return false;
    }

    // Collect all instance matrices per tile type first, then set buffers in one batch.
    // This avoids O(N²) buffer reallocations that thinInstanceAdd causes on each call.
    const tileInstanceMatrices = this.loadedTiles.map(() => []);

    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const rowOffset = x % this.loadedTiles.length;
        const tileIndex = (z + rowOffset) % this.loadedTiles.length;
        const xPos = x * tileSize;
        const zPos = (depth - 1 - z) * tileSize; // flip Z from top-left builder to bottom-left world
        tileInstanceMatrices[tileIndex].push(BABYLON.Matrix.Translation(xPos, 0, zPos));
      }
    }

    // Apply thin instances in a single setBuffer call per mesh — one draw call per tile type
    for (let tileIndex = 0; tileIndex < this.loadedTiles.length; tileIndex++) {
      const baseTile = this.loadedTiles[tileIndex];
      if (!baseTile || !baseTile.meshes || baseTile.meshes.length === 0) {
        console.warn(`GridGenerator: Missing or invalid tile at index ${tileIndex}`);
        continue;
      }

      let targetMeshes = baseTile.meshes[0].getChildren(undefined, false);
      if (!targetMeshes || targetMeshes.length === 0) {
        targetMeshes = baseTile.meshes;
      }

      const matrices = tileInstanceMatrices[tileIndex];
      if (matrices.length === 0) continue;

      const buffer = new Float32Array(matrices.length * 16);
      matrices.forEach((mat, i) => mat.copyToArray(buffer, i * 16));

      for (const mesh of targetMeshes) {
        if (!(mesh instanceof BABYLON.Mesh)) continue;
        if (mesh.isFrozen) mesh.unfreezeWorldMatrix();
        mesh.thinInstanceSetBuffer("matrix", buffer, 16, true);
      }
    }

    // Apply performance optimizations to static meshes after all instances are added
    this.optimizeStaticMeshes();

    return true;
  }

  /**
   * Generates a duplicate grid shifted by an offset using thin instances.
   * Uses the same loaded tiles but places them at offset positions.
   *
   * @param {number} width - The width of the grid (number of columns).
   * @param {number} depth - The depth of the grid (number of rows).
   * @param {BABYLON.Vector3} offset - The offset to apply to all tile positions.
   * @param {number} [tileSize=1] - Size of each tile for spacing.
   * @returns {Promise<boolean>} - Resolves to true if the grid was generated successfully.
   */
  async generateGridWithOffset(width, depth, offset, tileSize = 1) {
    // Validate input dimensions
    if (!width || !depth || width < 1 || depth < 1) {
      console.error(
        `GridGenerator: Invalid grid dimensions: ${width}x${depth}`
      );
      return false;
    }

    // Ensure tiles are loaded
    if (this.loadedTiles.length === 0) {
      console.error(
        "GridGenerator: No tiles loaded. Call loadTilesModels first."
      );
      return false;
    }

    // Iterate over every grid cell position.
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        // Use a pattern to vary the tile selection.
        const rowOffset = x % this.loadedTiles.length;
        const tileIndex = (z + rowOffset) % this.loadedTiles.length;
        const baseTile = this.loadedTiles[tileIndex];

        // Ensure the base tile has meshes
        if (!baseTile || !baseTile.meshes || baseTile.meshes.length === 0) {
          console.warn(
            `GridGenerator: Missing or invalid tile at index ${tileIndex}`
          );
          continue;
        }

        // Prefer child meshes, fall back to all meshes if none
        let targetMeshes = baseTile.meshes[0].getChildren(undefined, false);
        if (!targetMeshes || targetMeshes.length === 0) {
          targetMeshes = baseTile.meshes;
        }

        // Instance each mesh at the correct grid position with offset (invert Z to match builder top-left origin)
        for (const mesh of targetMeshes) {
          if (mesh instanceof BABYLON.Mesh) {
            if (mesh.isFrozen) {
              mesh.unfreezeWorldMatrix();
            }
            if (!mesh.hasThinInstances) {
              mesh.thinInstanceEnablePicking = true;
            }

            const xPos = (x * tileSize) + offset.x;
            const yPos = offset.y;
            const zPos = ((depth - 1 - z) * tileSize) + offset.z; // flip Y for offset grid
            const matrix = BABYLON.Matrix.Translation(xPos, yPos, zPos);
            try {
              mesh.thinInstanceAdd(matrix);
            } catch (error) {
              console.error(`[GRID] Error adding thin instance to mesh ${mesh.name}:`, error);
            }
          }
        }
      }
    }

    // Apply performance optimizations to static meshes after all instances are added
    this.optimizeStaticMeshes();

    return true;
  }

  /**
   * Applies performance optimizations to static meshes after they are fully set up
   */
  optimizeStaticMeshes() {
    // Apply optimizations to all loaded tile meshes
    for (const baseTile of this.loadedTiles) {
      if (baseTile && baseTile.meshes) {
        for (const mesh of baseTile.meshes) {
          if (mesh instanceof BABYLON.Mesh) {
            // Freeze world matrix for static meshes (major performance boost)
            mesh.freezeWorldMatrix();

            // Disable bounding info synchronization for static meshes
            mesh.doNotSyncBoundingInfo = true;

            // Also optimize child meshes if any
            if (mesh.getChildMeshes) {
              mesh.getChildMeshes().forEach((childMesh) => {
                if (childMesh instanceof BABYLON.Mesh) {
                  childMesh.freezeWorldMatrix();
                  childMesh.doNotSyncBoundingInfo = true;
                }
              });
            }
          }
        }
      }
    }
  }
}
