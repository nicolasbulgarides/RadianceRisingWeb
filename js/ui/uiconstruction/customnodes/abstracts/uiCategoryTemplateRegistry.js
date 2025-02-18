/**
 * Class responsible for managing a registry of custom UI node templates for a given category.
 * Templates handle dynamic data updates for UI nodes, contrasting schematics which build the static layout.
 * Each registry is associated with a single UI category (e.g., achievements) and can be populated
 * with multiple template instances.
 */
class UICategoryTemplateRegistry {
  constructor(uiCategoryName) {
    // Name of the UI category.
    this.uiCategoryName = uiCategoryName;
    // Map to store UI node templates using their unique names as keys.
    this.uiCategoryTemplateRegistry = new Map();
  }

  /**
   * Populates the template registry with UI node templates.
   * Derived classes should override this method to add templates specific to their category.
   */
  populateTemplateRegistry() {}

  /**
   * Retrieves the complete template registry.
   * @returns {Map} A map of UI node templates.
   */
  getTemplateRegistry() {
    return this.uiCategoryTemplateRegistry;
  }

  /**
   * Alias for getTemplateRegistry.
   * @returns {Map} A map of UI node templates.
   */
  getRegistry() {
    return this.uiCategoryTemplateRegistry;
  }

  /**
   * Adds a single UI node template to the registry.
   * @param {string} templateName - Unique name identifier for the template.
   * @param {CustomUINodeTemplate} templateToAdd - The UI node template instance.
   */
  addSingleTemplate(templateName, templateToAdd) {
    this.uiCategoryTemplateRegistry.set(templateName, templateToAdd);
  }

  /**
   * Provides a placeholder UI node template when a specific template is not found.
   * The placeholder uses a generic header to ensure the UI maintains consistency.
   * @returns {CustomUINodeTemplate}
   */
  getPlaceholderTemplate() {
    let genericHeader = new CustomUINodeTemplateHeader();
    return new CustomUINodeTemplate("placeholderTemplate", genericHeader);
  }
}
