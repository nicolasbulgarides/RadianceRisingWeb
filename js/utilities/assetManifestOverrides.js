class AssetManifestOverrides {
  // Default transformations
  static defaults = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { pitch: 0, roll: 0, yaw: 0 },
    scale: 1,
  };

  // Asset-specific overrides
  static overrides = {
    tileVertical: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { pitch: 90, roll: 0, yaw: 0 },
      scale: 1,
    },
    anotherAsset: {
      position: { x: 1, y: 2, z: 3 },
      rotation: { pitch: 45, roll: 0, yaw: 90 },
      scale: 1.5,
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
}
