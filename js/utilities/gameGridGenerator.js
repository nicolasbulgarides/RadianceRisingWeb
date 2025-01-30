class GameGridGenerator {
  /**
   * Constructor for GridGenerator.
   * @param {SceneBuilder} sceneBuilder - The SceneBuilder instance to load models and manage the scene.
   */
  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;
    this.loadedTiles = []; // To store loaded tile meshes
  }

  /**
   * Loads all tiles into memory.
   * @param {Array<string>} tileIds - Array of tile IDs to load.
   * @param {WorldMap} mapToLoad - The map to generate the grid for.
   * @param {number} tileSize - The size of each tile.
   * @returns {Promise<boolean>} - Resolves to true if tiles are loaded successfully, otherwise false.
   */
  async loadTilesThenGenerateGrid(tileIds, tileSize) {
    let position = {
      x: 0,
      y: 0,
      z: 0,
    };
    for (const tileId of tileIds) {
      const positionedObject = PositionedObject.getPositionedObjectQuick(
        tileId,
        position,
        tileSize,
        true,
        false,
        true
      );
      const baseTile = await this.sceneBuilder.loadModel(positionedObject);

      if (baseTile) {
        this.loadedTiles.push(baseTile);
      } else {
        console.error(`GridGenerator: Failed to load tile '${tileId}'.`);
      }
    }

    if (this.loadedTiles.length === 0) {
      console.error("GridGenerator: No tiles were successfully loaded.");
      return false;
    }

    console.log(
      "GridGenerator: All tiles loaded successfully. Num of tiles: " +
        this.loadedTiles.length
    );

    return true;
  }

  /**
   * Checks if tiles are loaded and cancels grid generation if not.
   * @returns {boolean} - Returns true if tiles are loaded, otherwise false.
   */
  cancelIfNoTilesToDisplay() {
    if (this.loadedTiles.length === 0) {
      window.Logger.log("NO tiles loaded! Cannot generate grid!");
      return false;
    } else {
      return true;
    }
  }

  async generateGrid(mapToLoad, tileSize = 1) {
    if (!this.cancelIfNoTilesToDisplay()) {
      return;
    }
    let width = mapToLoad.mapWidth;
    let depth = mapToLoad.mapDepth;
    // Ensure tiles are loaded

    console.log("Width, depth: ", width + ", ", depth);

    // Generate the grid
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        // Determine which tile to use based on a pattern
        const rowOffset = x % this.loadedTiles.length; // Offset every row
        const tileIndex = (z + rowOffset) % this.loadedTiles.length; // Alternate tile selection
        const baseTile = this.loadedTiles[tileIndex];
        const children = baseTile.meshes[0].getChildren(undefined, false);

        // Add a thin instance for each child mesh
        for (const mesh of children) {
          if (mesh instanceof BABYLON.Mesh) {
            const xPos = x * tileSize;
            const zPos = z * tileSize;

            // Create a transformation matrix with y fixed at 0
            const matrix = BABYLON.Matrix.Translation(xPos, 0, zPos);
            mesh.thinInstanceAdd(matrix);
            console.log("WOW!");
          }
        }
      }
    }
  }
}
