/**
 * Base class for all accomplishment emitters.
 *
 * This class provides the foundation for emitting accomplishments to the progression manager.
 * Each specific emitter will extend this class and provide its own presets.
 */
class AccomplishmentEmitterBase {
  /**
   * Creates a new accomplishment emitter.
   */
  constructor() {
    // No initialization needed for base class
  }

  /**
   * Emits an accomplishment using a preset configuration with optional custom data.
   *
   * @param {string} presetName - The name of the preset to use
   * @param {Object} customData - Optional custom data to override preset defaults
   * @returns {boolean} - True if the emission was successful, false otherwise
   */
  emit(presetName, customData = {}) {
    // Get the preset configuration
    const preset = this.getPreset(presetName);
    if (!preset) {
      console.error(
        `Unknown preset: ${presetName} for ${this.constructor.name}`
      );
      return false;
    }

    // Merge custom data with preset defaults
    const mergedData = { ...preset.defaultData, ...customData };

    // Create header and carrier
    const header = new AccomplishmentProfileHeader(
      preset.category,
      preset.subCategory,
      preset.metaData
    );

    const carrier = new AccomplishmentGameStateCarrier();
    Object.entries(mergedData).forEach(([key, value]) => {
      carrier.setValue(key, value);
    });

    // Send to progression manager
    this.progressionManager.recognizeAccomplishment(header, carrier);
    return true;
  }

  /**
   * Gets a preset configuration by name.
   * This method should be overridden by subclasses to provide specific presets.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    // Override in subclasses to provide presets
    console.warn(`getPreset not implemented in ${this.constructor.name}`);
    return null;
  }

  /**
   * Validates a preset configuration.
   * Ensures that the preset has all required fields.
   *
   * @param {Object} preset - The preset configuration to validate
   * @returns {boolean} - True if the preset is valid, false otherwise
   */
  validatePreset(preset) {
    if (!preset) return false;

    // Check for required fields
    const requiredFields = [
      "category",
      "subCategory",
      "metaData",
      "defaultData",
    ];
    for (const field of requiredFields) {
      if (!preset[field]) {
        console.error(`Missing required field in preset: ${field}`);
        return false;
      }
    }

    // Check metadata
    if (!preset.metaData.nickName || !preset.metaData.description) {
      console.error(
        "Missing required metadata in preset: nickName or description"
      );
      return false;
    }

    return true;
  }

  /**
   * Creates a deep copy of an object to prevent unintended modifications.
   *
   * @param {Object} obj - The object to clone
   * @returns {Object} - A deep copy of the object
   */
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}
