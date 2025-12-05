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
    // Default tile set.
    let tileIds = ["tile1", "tile3", "tile4", "tile6"];
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

        // Assume each base tile has a primary mesh with child meshes.
        const children = baseTile.meshes[0].getChildren(undefined, false);

        // Instance each child mesh at the correct grid position.
        for (const mesh of children) {
          if (mesh instanceof BABYLON.Mesh) {
            // Calculate the space position based on grid coordinates.
            const xPos = x * tileSize;
            const zPos = z * tileSize;
            // Create a transformation matrix for placement.
            const matrix = BABYLON.Matrix.Translation(xPos, 0, zPos);
            // Add the transformation as a thin instance for optimal performance.
            mesh.thinInstanceAdd(matrix);
          }
        }
      }
    }

    return true;
  }
}
