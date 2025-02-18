/**
 * Class representing the schematic (blueprint) used to initially construct a UI node.
 * The schematic defines the static layout and structure.
 * In the overall UI construction process, the schematic is paired with a dynamic template
 * that later updates the UI based on provided data.
 */
class CustomUINodeAssemblySchematic {
  constructor(schematicName) {
    // Unique identifier for this schematic blueprint.
    this.schematicName = schematicName;
  }
}
