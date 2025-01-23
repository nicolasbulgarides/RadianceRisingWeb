class AssetManifestOverrides {
  // Default transformations
  static defaults = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { pitch: 0, roll: 0, yaw: 0 },
    scale: 1,
  };

  // Asset-specific overrides
  static overrides = {
    testTileZ: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { pitch: 0, roll: 0, yaw: 0 },
      scale: 1.063,
    },
  };

  /**
   * Retrieves the configuration for a given asset name.
   * @param {string} assetName - The name of the asset.
   * @returns {Object} - Configuration object with position, rotation, and scale.
   */
  static getConfig(assetName) {
    return this.overrides[assetName] || this.defaults;
  }

  /**
   * Sets or updates the configuration for a single asset.
   * @param {string} assetName - The name of the asset.
   * @param {Object} config - Configuration object with position, rotation, and scale.
   */
  static setConfig(assetName, config) {
    this.overrides[assetName] = { ...this.defaults, ...config };
  }

  /**
   * Sets the same configuration for multiple assets.
   * @param {Array<string>} assetNames - Array of asset names to apply the configuration to.
   * @param {Object} config - Configuration object with position, rotation, and scale.
   */
  static setConfigForMultiple(assetNames, config) {
    for (const assetName of assetNames) {
      this.setConfig(assetName, config);
    }
  }

  // Static initialization block to set initial values for testTile2 - testTile7
  static {
    //  const baseConfigTiles = this.getConfig("testTile1");
    /** 
    const tileNames = [
      "testTilePure",
      "testTile2",
      "testTile3",
      "testTile4",
      "testTile5",
      "testTile6",
      "testTile7",
    ];
    this.setConfigForMultiple(tileNames, baseConfigTiles);
    */
  }
}
