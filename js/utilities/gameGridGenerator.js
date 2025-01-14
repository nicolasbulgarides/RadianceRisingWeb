class GameGridGenerator {
  /**
   * Constructor for GridGenerator.
   * @param {SceneBuilder} sceneBuilder - The SceneBuilder instance to load models and manage the scene.
   * @param {Array<string>} tileIds - Array of asset IDs to randomly choose tiles from.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   */
  constructor(sceneBuilder, tileIds, scene) {
    this.sceneBuilder = sceneBuilder;
    this.tileIds = tileIds; // Array of asset IDs, e.g., ["testTile1", "testTile2", ..., "testTile6"]
    this.scene = scene;
    this.loadedTiles = []; // To store loaded tile meshes
  }

  /**
   * Loads all tiles into memory.
   */
  async loadTiles() {
    for (const tileId of this.tileIds) {
      const positionedObject = new PositionedObject(
        tileId,
        0,
        0,
        0,
        0,
        0,
        0,
        "",
        "",
        "",
        1,
        true,
        false,
        true
      );
      const baseTile = await this.sceneBuilder.loadSceneModel(positionedObject);

      if (baseTile) {
        baseTile.isVisible = false; // Make the base tile invisible
        this.loadedTiles.push(baseTile);
      } else {
        console.error(`GridGenerator: Failed to load tile '${tileId}'.`);
      }
    }

    if (this.loadedTiles.length === 0) {
      console.error("GridGenerator: No tiles were successfully loaded.");
      return false;
    }

    console.log("GridGenerator: All tiles loaded successfully.");
    return true;
  }

  async generateGrid(gridSize = 20, tileSize = 1) {
    // Ensure tiles are loaded
    if (this.loadedTiles.length === 0) {
      const success = await this.loadTiles();
      if (!success) return;
    }

    // Generate the grid
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Determine which tile to use based on a pattern
        const tileIndex = (x + y) % this.loadedTiles.length; // Example pattern
        const baseTile = this.loadedTiles[tileIndex];
        const children = baseTile.meshes[0].getChildren(undefined, false);

        // Add a thin instance for each child mesh
        for (const mesh of children) {
          if (mesh instanceof BABYLON.Mesh) {
            const xPos = x * tileSize;
            const yPos = y * tileSize;

            // Create a transformation matrix with y fixed at 0
            const matrix = BABYLON.Matrix.Translation(xPos, yPos, 0);
            mesh.thinInstanceAdd(matrix);
          }
        }
      }
    }

    console.log("GridGenerator: Grid generated successfully.");
  }
}
