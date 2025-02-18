/**
 * AchievementCategory is the base class for all achievement categories.
 * All child classes of AchievementCategory call the "populateAllAchievements" method, which is the central method
 * for organizing the storage of specific achievements via the use of specific constructors
 */

class AchievementCategory {
  /**
   * @param {string} categoryName - The name of the achievement category.
   */
  constructor(categoryName) {
    this.categoryName = categoryName;
  }
}
