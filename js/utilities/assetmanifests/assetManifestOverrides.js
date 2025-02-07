class AssetConfig {
  constructor(overrides = {}) {
    this.position = {
      ...AssetManifestOverrides.defaults.position,
      ...overrides.position,
    };
    this.offset = {
      ...AssetManifestOverrides.defaults.offset,
      ...overrides.offset,
    };
    this.rotation = {
      ...AssetManifestOverrides.defaults.rotation,
      ...overrides.rotation,
    };
    this.scale = {
      ...AssetManifestOverrides.defaults.scale,
      ...overrides.scale,
    };
  }
}

class AssetManifestOverrides {
  static defaults = {
    position: { x: 0, y: 0, z: 0 },
    offset: { x: 0, y: 0, z: 0 },
    rotation: { pitch: 0, roll: 0, yaw: 0 },
    scale: { x: 1, y: 1, z: 1 },
  };

  static overrides = {
    mechaSphereBronzeLowRes: {
      offset: { x: 0, y: 0.33, z: 0 },
    },
  };

  /**
   * Retrieves the configuration for a given asset name.
   * @param {string} assetName - The name of the asset.
   * @returns {AssetConfig} - An instance of AssetConfig with merged defaults and overrides.
   */
  static getConfig(assetName) {
    const override = this.overrides[assetName] || {};
    return new AssetConfig(override);
  }

  /**
   * Initializes models with unique configurations.
   * @param {Object} models - An object where each key is a model name and the value is the model's configuration.
   */
  static initializeModels(models) {
    for (const key in models) {
      if (models.hasOwnProperty(key)) {
        models[key] = this.getConfig(key);
      }
    }
  }
}

// Example usage:
const models = {
  mechaSphereBronzeLowRes: {},
};

AssetManifestOverrides.initializeModels(models);
