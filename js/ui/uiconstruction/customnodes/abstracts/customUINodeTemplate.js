/**
 * Class representing a custom UI node template.
 * Extends Babylon.JS's Container to incorporate UI elements that can be updated with dynamic game data.
 * Each UI node template is associated with a header (CustomUINodeTemplateHeader) that holds
 * essential metadata (like nicknames, version, and display strategy) for the UI element.
 * The corresponding schematic (handled by a child schematic class) is responsible for
 * the initial construction of the UI node's layout.
 */
class CustomUINodeTemplate extends BABYLON.Container {
  constructor(templateName, templateHeader = null) {
    super(templateName);
    // If no header is provided, log an error to help identify missing metadata.
    if (templateHeader == null) {
      UIConstructionLogger.logFailureToGetTemplateHeader(templateName);
    } else {
      // Store the header and set initial flags for construction and data population.
      this.templateHeader = templateHeader;
      this.baseStructureWasCorrectlyFormed = false;
      this.wasSuccessfullyPopulatedBasedOnData = false;
    }
  }
}
