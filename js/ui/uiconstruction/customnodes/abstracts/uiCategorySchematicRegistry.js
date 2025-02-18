/**
 * Class responsible for managing a registry of UI node schematics for a given category.
 * Each category (such as Achievements or Settings) will have its own schematic registry,
 * which holds blueprints for the initial UI construction of elements in that area.
 */
class UICategorySchematicRegistry {
  constructor(uiCategoryName) {
    // Name of the UI category (e.g., "achievements").
    this.uiCategoryName = uiCategoryName;
    // Map to store schematics using their unique names as keys.
    this.uiCategorySchematicRegistry = new Map();
  }

  /**
   * Populates the schematic registry with schematics relevant to the UI category.
   * Derived classes should implement this to register their specific schematics.
   */
  populateSchematicRegistry() {}

  /**
   * Retrieves the complete schematic registry.
   * @returns {Map} A map of schematic blueprints.
   */
  getSchematicRegistry() {
    return this.uiCategorySchematicRegistry;
  }

  /**
   * Alias for getSchematicRegistry.
   * @returns {Map} A map of schematic blueprints.
   */
  getRegistry() {
    return this.uiCategorySchematicRegistry;
  }

  /**
   * Adds a single schematic blueprint to the registry.
   * @param {string} schematicName - Unique name identifier for the schematic.
   * @param {CustomUINodeAssemblySchematic} schematicToAdd - The schematic blueprint instance.
   */
  addSingleSchematic(schematicName, schematicToAdd) {
    this.uiCategorySchematicRegistry.set(schematicName, schematicToAdd);
  }

  /**
   * Returns a placeholder schematic for times when a requested schematic is not found.
   * This helps prevent UI construction failures by providing a default blueprint.
   * @returns {CustomUINodeAssemblySchematic}
   */
  getPlaceholderSchematic() {
    return new CustomUINodeAssemblySchematic("placeholderSchematic");
  }
}
