/**
 * Class representing the header for a custom UI node template.
 * This header contains essential metadata used during the UI construction process,
 * such as a nickname, version, UI category flags, semantic purpose, visibility, and placement strategy.
 * This information guides both the initial construction (via schematics) and dynamic updates.
 */
class CustomUINodeTemplateHeader {
  constructor(
    // Human-readable nickname for the template.
    templateNickName = "-placeholder-custom-ui-node-abstract-nickname-",
    // Version string for the template.
    templateVersion = "1.0A-Dev",
    // Boolean flag indicating if this node is unique/singular.
    isSingular = false,
    // Indicates whether the node belongs to a broad UI category.
    uiBroadCategory = false,
    // Semantic category describing the purpose of the UI element (e.g., information, action).
    semanticPurposeCategory = "information",
    // Determines if the element starts as visible in the UI.
    startsInVisibleState = false,
    // Strategy for placing the UI node intelligently within the overlay.
    placementStrategy = "intelligent"
  ) {
    this.templateNickName = templateNickName;
    this.templateVersion = templateVersion;
    this.isSingular = isSingular;
    this.uiBroadCategory = uiBroadCategory;
    this.semanticPurposeCategory = semanticPurposeCategory;
    this.startsInVisibleState = startsInVisibleState;
    this.placementStrategy = placementStrategy;
  }
}
