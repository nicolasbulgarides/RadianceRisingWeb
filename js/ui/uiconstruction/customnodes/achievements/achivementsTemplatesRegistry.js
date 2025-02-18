class AchievementsTemplatesRegistry extends UICategoryTemplateRegistry {
  constructor() {
    super("achievements");
    this.populateTemplateRegistry();
  }

  populateTemplateRegistry() {
    this.addSingleTemplate(
      "achievementSocketUINodeTemplate",
      new AchievementsSocketUINode()
    );
  }
}
