/**
 * Composite registry that consolidates all category-specific UI node schematic registries
 * into a single central repository. This centralization helps in organizing and retrieving
 * UI schematics across different areas (e.g., Achievements, Settings).
 *
 * During UI construction, this composite is queried to obtain the schematic blueprint that
 * corresponds to a particular UI element setup.
 */
class CustomUINodeSchematicRegistryComposite {
  constructor() {
    // Array holding individual category-specific schematic registries.
    this.allRegisteredSchematicCategoryRegistries = [];
    // Map serving as a central repository for schematics, keyed by schematic name.
    this.allRegisteredSchematicsCentrallyStoredAndObtainable = new Map();
    // Load and initialize all implemented schematic registries.
    this.loadImplementedSchematicCategoryRegistries();
    // Ingest schematics from each category registry into the central repository.
    this.ingestSchematicsFromAllRegisteredCategoryRegistries();
  }

  /**
   * Loads all implemented schematic registries.
   * As new UI categories are introduced, their loaders should be included here.
   */
  loadImplementedSchematicCategoryRegistries() {
    this.loadAchievementsSchematicCategoryRegistry();
  }

  /**
   * Loads and registers the Achievements schematic registry.
   */
  loadAchievementsSchematicCategoryRegistry() {
    let achievementsSchematicsRegistry = new AchievementsSchematicRegistry();
    achievementsSchematicsRegistry.populateSchematicRegistry();
    this.allRegisteredSchematicCategoryRegistries.push(
      achievementsSchematicsRegistry
    );
  }

  /**
   * Ingests schematics from all category-specific registries into a single central map.
   * This allows quick lookup of any schematic by its unique name.
   */
  ingestSchematicsFromAllRegisteredCategoryRegistries() {
    this.allRegisteredSchematicCategoryRegistries.forEach(
      (categoryRegistry) => {
        categoryRegistry.getSchematicRegistry().forEach((schematic) => {
          this.allRegisteredSchematicsCentrallyStoredAndObtainable.set(
            schematic.schematicName,
            schematic
          );
        });
      }
    );
  }

  /**
   * Retrieves a schematic by its unique name.
   * If the schematic is not found, a failure is logged.
   *
   * @param {string} schematicName - The unique name of the schematic.
   * @returns {CustomUINodeAssemblySchematic|null} The requested schematic or null if not found.
   */
  getSchematic(schematicName) {
    if (
      this.allRegisteredSchematicsCentrallyStoredAndObtainable.has(
        schematicName
      )
    ) {
      return this.allRegisteredSchematicsCentrallyStoredAndObtainable.get(
        schematicName
      );
    } else {
      UIConstructionLogger.logFailureToGetSchematic(schematicName);
      return null;
    }
  }
}
