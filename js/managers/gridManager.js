// File: js/managers/GridManager.js

/**
 * GridManager Class
 * Manages the creation and configuration of a grid within a Babylon.js scene.
 * Supports both default and custom grid configurations based on `Config.GRID_CONFIG`.
 */
class GridManager {
  /**
   * Creates an instance of GridManager.
   * @param {BABYLON.Scene} sceneInstance - The Babylon.js scene instance where the grid will be created.
   */
  constructor(sceneInstance) {
    this.scene = sceneInstance;
    this.config = Config.GRID_CONFIG || null; // Access Config directly
    this.initialize();
  }

  /**
   * Initializes the grid based on the provided configuration.
   * If a configuration object is available in `Config.GRID_CONFIG`, it creates a custom grid;
   * otherwise, it defaults to a standard grid.
   */
  initialize() {
    if (this.config && typeof this.config === 'object') {
      this.createGridFromConfig(this.config);
    } else {
      this.createDefaultGrid();
    }
  }

  /**
   * Creates a default grid with a standard size of 10x10 blocks.
   * Each block is a 1x1 unit, placed at the ground level (y=0).
   */
  createDefaultGrid() {
    const gridSize = 10; // 10x10 grid
    const blockSize = 1; // Each block is 1x1

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const block = BABYLON.MeshBuilder.CreateBox('block', { size: blockSize }, this.scene);
        block.position.x = x * blockSize;
        block.position.y = 0;
        block.position.z = z * blockSize;
      }
    }
    window.Logger.log('GridManager: Default grid setup complete.');
  }

  /**
   * Creates a custom grid based on the provided configuration object in `Config.GRID_CONFIG`.
   * @param {object} config - Configuration object defining custom grid properties (e.g., grid size, block size).
   */
  createGridFromConfig(config) {
    const gridSize = config.gridSize || 10; // Default to 10x10 grid if not specified
    const blockSize = config.blockSize || 1; // Default block size of 1 if not specified

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const block = BABYLON.MeshBuilder.CreateBox('block', { size: blockSize }, this.scene);
        block.position.x = x * blockSize;
        block.position.y = 0;
        block.position.z = z * blockSize;
      }
    }
    window.Logger.log('GridManager: Custom grid setup complete.');
  }
}

// Expose GridManager globally for usage in other scripts
window.GridManager = GridManager;
