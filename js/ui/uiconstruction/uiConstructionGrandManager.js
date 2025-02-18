// yeah the name is grandiose. If you can do a better UI architecture, please do`

class UIConstructionGrandManager {
  constructor() {
    this.customNodeTemplateRegistryComposite = null;
    this.customNodeSchematicRegistryComposite = null;
    FundamentalSystemBridge.registerUIConstructionGrandManager(this);
    this.populateRegistryForCustomNodes();
  }

  populateRegistryForCustomNodes() {
    this.customNodeTemplateRegistryComposite =
      new CustomUINodeTemplateRegistryComposite();
    this.customNodeSchematicRegistryComposite =
      new CustomUINodeSchematicRegistryComposite();
  }

  formUINodeFromTemplateAndSchematicWithDefaults(templateName) {
    let retrievedTemplate =
      this.customNodeTemplateRegistryComposite.getTemplate(templateName);
    let retrievedSchematic =
      this.customNodeSchematicRegistryComposite.getSchematic(templateName);

    if (retrievedTemplate != null && retrievedSchematic != null) {
      let uiNodeAttempt =
        UIConstructionGrandFactory.formUINodeFromTemplateAndSchematicWithBlankData(
          retrievedTemplate,
          retrievedSchematic
        );

      if (uiNodeAttempt.baseStructureWasCorrectlyFormed == true) {
        return uiNodeAttempt;
      } else {
        UIConstructionLogger.logFailureToFormUINodeFromTemplateWithBlankData(
          templateName
        );
      }
    } else if (
      (retrievedSchematic != null && retrievedTemplate == null) ||
      (retrievedSchematic == null && retrievedTemplate != null)
    ) {
      UIConstructionLogger.logFailureToGetMatchingTemplateAndSchematic(
        templateName
      );
    }

    return null;
  }

  formUINodeFromTemplateAndSchematicWithData(templateName, necessaryData) {
    let retrievedTemplate =
      this.customNodeTemplateRegistryComposite.getTemplate(templateName);
    let retrievedSchematic =
      this.customNodeSchematicRegistryComposite.getSchematic(templateName);

    if (retrievedTemplate != null && retrievedSchematic != null) {
      let uiNodeAttempt =
        UIConstructionGrandFactory.formUINodeFromTemplateAndSchematicWithData(
          retrievedTemplate,
          retrievedSchematic,
          necessaryData
        );

      if (
        uiNodeAttempt.baseStructureWasCorrectlyFormed &&
        uiNodeAttempt.wasSucessfullyPopulatedBasedOnData
      ) {
        return uiNodeAttempt;
      } else {
        UIConstructionLogger.logFailureToFormUINodeFromTemplateWithBlankData(
          templateName
        );
      }
    } else if (
      (retrievedSchematic != null && retrievedTemplate == null) ||
      (retrievedSchematic == null && retrievedTemplate != null)
    ) {
      UIConstructionLogger.logFailureToGetMatchingTemplateAndSchematic(
        templateName
      );
    }

    return null;
  }
}
