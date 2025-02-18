/**
 * Class managing the registry of UI node templates for the Achievements category.
 * Templates in this registry are responsible for updating the UI dynamically after construction.
 * This class extends UICategoryTemplateRegistry to group and organize achievement-related templates.
 */
class AchievementsTemplatesRegistry extends UICategoryTemplateRegistry {
  constructor() {
    // Pass the UI category name to the parent registry.
    super("achievements");
    // Populate the registry with achievement-specific UI node templates.
    this.populateTemplateRegistry();
  }

  /**
   * Populates the registry with the achievement socket UI node template.
   * This template is responsible for updating UI visuals in response to data changes (such as completing an achievement)
   *
   */
  populateTemplateRegistry() {
    this.addSingleTemplate(
      "achievementSocketUINodeTemplate",
      new AchievementSocketUINode() // Ensure that this matches the defined AchievementSocketUINode class.
    );
  }
}
