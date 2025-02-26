/**
 * Data structure for tracking achievement-related accomplishments.
 * Achievements represent specific milestones or challenges that players can complete
 * to earn recognition and achievement points.
 */
class AccomplishmentAchievementData {
  /**
   * Creates a new achievement accomplishment data instance
   * @param {string} achievementId - Unique identifier for the achievement
   * @param {string} nameOfAcheivement - Display name of the achievement
   * @param {number} achivementPointsValue - Point value awarded for completing the achievement
   * @param {string} achievementGroup - Category or group the achievement belongs to
   */
  constructor(
    achievementId,
    nameOfAcheivement,
    achivementPointsValue,
    achievementGroup
  ) {
    this.achievementId = achievementId;
    this.nameOfAcheivement = nameOfAcheivement;
    this.achivementPointsValue = achivementPointsValue;
    this.achievementGroup = achievementGroup;
  }
}
