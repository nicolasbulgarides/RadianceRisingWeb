/**
 * AssetConfig class holds configuration for asset transformation overrides.
 * It merges default settings with any provided override values.
 */
class AssetConfig {
  constructor(overrides = {}) {
    // Merge default position settings with provided overrides
    this.position = {
      ...AssetManifestOverrides.defaults.position,
      ...overrides.position,
    };
    // Merge default offset settings with provided overrides
    this.offset = {
      ...AssetManifestOverrides.defaults.offset,
      ...overrides.offset,
    };
    // Merge default rotation settings with provided overrides
    this.rotation = {
      ...AssetManifestOverrides.defaults.rotation,
      ...overrides.rotation,
    };
    // Merge default scale settings with provided overrides
    this.scale = {
      ...AssetManifestOverrides.defaults.scale,
      ...overrides.scale,
    };
  }
}

/**
 * AssetManifestOverrides provides default configuration values and asset-specific overrides.
 * It offers methods to retrieve merged configurations for assets and to initialize models with these settings.
 */
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
    testMountain: {
      scale: { x: 0.8, y: 0.8, z: 0.8 },
      offset: { x: 0.1, y: 0, z: -0.2 },
      rotation: { pitch: 20, roll: 0, yaw: 0 },
    },
    lotus: {
      scale: { x: 0.7, y: 0.7, z: 0.7 },
    },
  };

  /**
   * Retrieves the merged configuration for a given asset based on defaults and specific overrides.
   * @param {string} assetName - The name of the asset.
   * @returns {AssetConfig} - An instance of AssetConfig with merged defaults and overrides.
   */
  static getConfig(assetName) {
    const override = this.overrides[assetName] || {};
    return new AssetConfig(override);
  }

  /**
   * Initializes models with unique configurations based on asset overrides.
   * Iterates over the provided models object and replaces each entry with its corresponding AssetConfig.
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
