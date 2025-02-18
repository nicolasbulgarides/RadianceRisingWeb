/**
 * AchievementRequirementsComposite
 * Composite class for achievement-based unlock requirements.
 * This composite aggregates requirements based on individual achievements and grouped achievement conditions.
 * Extends RequirementsGeneral.
 */
class AchievementRequirementsComposite extends RequirementsGeneral {
  /**
   * @param {Array} individuallyRequiredAchievements - List of individual achievements required for unlocking.
   * @param {boolean} requireAchievementGroup - Indicates if a group of achievements must collectively satisfy the unlock criteria.
   */
  constructor(individuallyRequiredAchievements, requireAchievementGroup) {
    this.individuallyRequiredAchievements = individuallyRequiredAchievements;
    this.requireAchievementGroup = requireAchievementGroup;
  }
}
