/**
 * Registry for all accomplishment emitters.
 *
 * This class manages the registration and retrieval of accomplishment emitters
 * for different categories of accomplishments.
 */
class AccomplishmentEmitterRegistry {
  /**
   * Creates a new instance of the AccomplishmentEmitterRegistry.
   */
  constructor() {
    this.emitters = {};
    this.registerDefaultEmitters();
  }

  /**
   * Registers an emitter for a specific category.
   *
   * @param {string} category - The category to register the emitter for
   * @param {AccomplishmentEmitterBase} emitter - The emitter instance
   * @returns {boolean} - True if registration was successful, false otherwise
   */
  registerEmitter(category, emitter) {
    if (!category || typeof category !== "string") {
      console.error("Invalid category provided to registerEmitter");
      return false;
    }

    if (!emitter || typeof emitter.getPreset !== "function") {
      console.error("Invalid emitter provided to registerEmitter");
      return false;
    }

    this.emitters[category] = emitter;
    return true;
  }

  /**
   * Gets an emitter for a specific category.
   *
   * @param {string} category - The category to get the emitter for
   * @returns {AccomplishmentEmitterBase|null} - The emitter instance or null if not found
   */
  getEmitter(category) {
    if (!category || typeof category !== "string") {
      console.error("Invalid category provided to getEmitter");
      return null;
    }

    return this.emitters[category] || null;
  }

  /**
   * Registers all default emitters.
   * This method loads and registers all the standard emitters provided by the system.
   */
  registerDefaultEmitters() {
    try {
      // Register all emitters
      this.registerEmitter("combat", new CombatEmitter());
      this.registerEmitter("achievement", new AchievementEmitter());
      this.registerEmitter("basicMilestone", new BasicMilestoneEmitter());
      this.registerEmitter("area", new AreaEmitter());
      this.registerEmitter("learned", new LearnedEmitter());
      this.registerEmitter("event", new EventEmitter());
      this.registerEmitter("acquiredObject", new AcquiredObjectEmitter());
      this.registerEmitter("competitive", new CompetitiveEmitter());
      this.registerEmitter("status", new StatusEmitter());
      this.registerEmitter("social", new SocialEmitter());
      this.registerEmitter("pet", new PetEmitter());
      this.registerEmitter("account", new AccountEmitter());
      this.registerEmitter("quest", new QuestEmitter());
      this.registerEmitter("progression", new ProgressionEmitter());
      this.registerEmitter("exploration", new ExplorationEmitter());
      this.registerEmitter("crafting", new CraftingEmitter());
      this.registerEmitter("economy", new EconomyEmitter());
      this.registerEmitter("minigame", new MinigameEmitter());
      this.registerEmitter("technical", new TechnicalEmitter());
      this.registerEmitter("usage", new UsageEmitter());
    } catch (error) {
      console.error("Error registering default emitters:", error);
    }
  }

  /**
   * Gets a preset configuration from the appropriate emitter.
   *
   * @param {string} category - The category of the preset
   * @param {string} presetName - The name of the preset
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(category, presetName) {
    if (!category || !presetName) {
      console.error("Invalid parameters provided to getPreset");
      return null;
    }

    const emitter = this.getEmitter(category);
    if (!emitter) {
      console.warn(`No emitter found for category: ${category}`);
      return null;
    }

    const preset = emitter.getPreset(presetName);
    if (!preset) {
      console.warn(`Preset not found: ${category}.${presetName}`);
      return null;
    }

    // Validate the preset
    if (
      emitter.validatePreset &&
      typeof emitter.validatePreset === "function"
    ) {
      if (!emitter.validatePreset(preset)) {
        console.error(`Invalid preset: ${category}.${presetName}`);
        return null;
      }
    }

    return preset;
  }

  /**
   * Creates an accomplishment data object using a preset.
   *
   * @param {string} category - The category of the preset
   * @param {string} presetName - The name of the preset
   * @param {Object} customData - Custom data to override default values
   * @returns {Object|null} - The accomplishment data object or null if preset not found
   */
  createFromPreset(category, presetName, customData = {}) {
    if (!category || !presetName) {
      console.error("Invalid parameters provided to createFromPreset");
      return null;
    }

    const preset = this.getPreset(category, presetName);
    if (!preset) {
      return null; // Error already logged in getPreset
    }

    try {
      // Create a deep copy to prevent unintended modifications
      const metaDataCopy = JSON.parse(JSON.stringify(preset.metaData));
      const defaultDataCopy = JSON.parse(JSON.stringify(preset.defaultData));

      // Merge the preset data with custom data
      const result = {
        category: preset.category,
        subCategory: preset.subCategory,
        metaData: metaDataCopy,
        data: { ...defaultDataCopy, ...customData },
      };

      return result;
    } catch (error) {
      console.error("Error creating accomplishment from preset:", error);
      return null;
    }
  }

  /**
   * Checks if a category exists in the registry.
   *
   * @param {string} category - The category to check
   * @returns {boolean} - True if the category exists, false otherwise
   */
  hasCategory(category) {
    return !!this.emitters[category];
  }

  /**
   * Gets all registered categories.
   *
   * @returns {Array<string>} - Array of registered category names
   */
  getCategories() {
    return Object.keys(this.emitters);
  }
}
