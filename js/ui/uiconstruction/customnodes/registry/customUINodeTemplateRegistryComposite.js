/**
 * Composite registry that consolidates all category-specific UI node template registries
 * into a single accessible central repository. This organization simplifies the lookup
 * and management of dynamic UI templates used across various parts of the game (e.g., Achievements, Settings).
 *
 * Each category registry contributes its templates, which are then stored in a central map keyed by template name.
 */
class CustomUINodeTemplateRegistryComposite {
  constructor() {
    // Array holding individual category-specific template registries.
    this.allRegisteredTemplateCategoryRegistries = [];
    // Central repository for UI node templates, keyed by unique template name.
    this.allRegisteredTemplatesCentrallyStoredAndObtainable = new Map();
    // Load and initialize all implemented template registries.
    this.loadImplementedTemplateCategoryRegistries();
    // Ingest templates from each category registry into the central repository.
    this.ingestTemplatesFromAllRegisteredCategoryRegistries();
  }

  /**
   * Loads all implemented UI template registries.
   * As more UI categories are developed, their corresponding registry loaders must be added here.
   */
  loadImplementedTemplateCategoryRegistries() {
    this.loadAchievementsTemplateCategoryRegistry();
  }

  /**
   * Loads and registers the Achievements template registry.
   */
  loadAchievementsTemplateCategoryRegistry() {
    let achievementsTemplatesRegistry = new AchievementsTemplatesRegistry();
    achievementsTemplatesRegistry.populateTemplateRegistry();
    this.allRegisteredTemplateCategoryRegistries.push(
      achievementsTemplatesRegistry
    );
  }

  /**
   * Ingests templates from all category-specific registries into a central map.
 
   * Here, we assume each template instance has a unique "templateName" property to use as its key.
   */
  ingestTemplatesFromAllRegisteredCategoryRegistries() {
    this.allRegisteredTemplateCategoryRegistries.forEach((categoryRegistry) => {
      categoryRegistry.getTemplateRegistry().forEach((template) => {
        this.allRegisteredTemplatesCentrallyStoredAndObtainable.set(
          template.templateName, // Assumes each template instance has a "templateName" property.
          template
        );
      });
    });
  }

  /**
   * Retrieves a UI node template by its unique name.
   *
   * @param {string} templateName - The name identifier for the UI template.
   * @returns {CustomUINodeTemplate} The corresponding UI node template instance.
   */
  getTemplate(templateName) {
    return this.allRegisteredTemplatesCentrallyStoredAndObtainable.get(
      templateName
    );
  }
}
