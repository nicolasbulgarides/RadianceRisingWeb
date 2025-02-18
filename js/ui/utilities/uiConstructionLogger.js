class UIConstructionLogger {
  static logFailureToGetSchematic(schematicName) {}
  static logFailureToGetTemplate(templateName) {}

  static logFailureToGetMatchingTemplateAndSchematic(
    templateAndSchematicSharedName
  ) {
    this.logFailureToGetPair(templateAndSchematicSharedName);
  }

  static logFailureToGetTemplateAndSchematicPair(
    templateAndSchematicSharedName
  ) {
    this.logFailureToGetPair(templateAndSchematicSharedName);
  }

  static logFailureToFormUINodeFromTemplateWithBlankData(templateName) {}

  static logFailureToFormUINodeFromTemplateWithData(schematicName) {}

  static logFailureToPopulateUINodeWithData(templateName) {}

  static logFailureToPassInTemplateHeader(templateName) {}
  static logFailureToGetTemplateHeader(templateName) {}
  //Note the general pattern of using a few aliases for the same method, for convenience because sometimes VS code doesnt retrieve method names correctly
  static logFailureToGetPair(templateAndSchematicSharedName) {}
}
