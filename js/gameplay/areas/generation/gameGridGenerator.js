class GameGridGenerator {
  /**
   * Manages grid generation by loading and instancing tile models.
   * @param {SceneBuilder} sceneBuilder - SceneBuilder instance responsible for asset loading and scene management.
   */
  constructor(sceneBuilder) {
    // Save reference to scene builder to use its loading functions.
    this.sceneBuilder = sceneBuilder;
    // Cache for loaded tile meshes to reuse in grid instancing.
    this.loadedTiles = [];
  }

  /**
   * Loads all tile models into memory based on provided tile IDs.
   * Generates base tile objects to be instanced for the game grid.
   *
   * @param {Array<string>} tileIds - Array of tile IDs identifying models to load.
   * @param {number} tileSize - Scale/size used for each tile.
   * @returns {Promise<boolean>} - Resolves to true if at least one tile was loaded; false otherwise.
   */
  async loadTilesThenGenerateGrid(tileIds, tileSize) {
    // Use a zero vector position as a temporary placeholder during loading.
    let position = new BABYLON.Vector3(0, 0, 0);

    // Loop through each tile ID and attempt to load the corresponding model.
    for (const tileId of tileIds) {
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
      const baseTile = await this.sceneBuilder.loadModel(positionedObject);

      if (baseTile) {
        // Cache the loaded tile.
        this.loadedTiles.push(baseTile);
      } else {
        console.error(`GridGenerator: Failed to load tile '${tileId}'.`);
      }
    }

    if (this.loadedTiles.length === 0) {
      console.error("GridGenerator: No tiles were successfully loaded.");
      return false;
    }

    return true;
  }

  /**
   * Validates that tiles are loaded.
   * @returns {boolean} - True if tiles exist; false otherwise.
   */
  cancelIfNoTilesToDisplay() {
    if (this.loadedTiles.length === 0) {
      window.Logger.log("NO tiles loaded! Cannot generate grid!");
      return false;
    }
    return true;
  }

  /**
   * Generates the game grid by creating thin instances of the loaded tiles.
   * Each grid cell is assigned a tile model instance with proper transformations.
   *
   * @param {LevelMap} mapToLoad - The level map instance containing grid dimensions.
   * @param {number} [tileSize=1] - Size of each tile for spacing.
   */
  async generateGrid(mapToLoad, tileSize = 1) {
    // Abort if no tile assets have been loaded.
    if (!this.cancelIfNoTilesToDisplay()) return;

    // Extract grid dimensions from the level map.
    let width = mapToLoad.mapWidth;
    let depth = mapToLoad.mapDepth;

    // Iterate over every grid cell position.
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        // Use a pattern to vary the tile selection.
        const rowOffset = x % this.loadedTiles.length;
        const tileIndex = (z + rowOffset) % this.loadedTiles.length;
        const baseTile = this.loadedTiles[tileIndex];
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
  }
}
