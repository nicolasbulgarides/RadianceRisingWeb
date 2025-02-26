/**
 * Data structure for tracking progression-related accomplishments.
 * Used to record progression activities such as character level-ups, skill advancements,
 * prestige levels, mastery achievements, and attribute increases.
 * Supports tracking of progression types, levels, and unlockable features.
 */
class AccomplishmentProgressionData {
  /**
   * Creates a new progression accomplishment data instance
   * @param {string} progressionType - Type of progression (character, skill, prestige, mastery, attribute)
   * @param {string} skillName - Name of the skill (if applicable)
   * @param {string} skillCategory - Category of the skill (if applicable)
   * @param {string} attributeName - Name of the attribute (if applicable)
   * @param {string} attributeCategory - Category of the attribute (if applicable)
   * @param {number} newLevel - New level achieved
   * @param {number} previousLevel - Previous level
   * @param {boolean} isSignificantMilestone - Whether this is a significant milestone
   * @param {Array} unlockableFeatures - Features unlocked at this level
   * @param {number} skillPointsGained - Skill points gained from this progression
   * @param {number} attributePointsGained - Attribute points gained from this progression
   * @param {number} timeToReachLevel - Time taken to reach this level (in seconds)
   */
  constructor(
    progressionType,
    skillName,
    skillCategory,
    attributeName,
    attributeCategory,
    newLevel,
    previousLevel,
    isSignificantMilestone,
    unlockableFeatures,
    skillPointsGained,
    attributePointsGained,
    timeToReachLevel
  ) {
    this.progressionType = progressionType;
    this.skillName = skillName;
    this.skillCategory = skillCategory;
    this.attributeName = attributeName;
    this.attributeCategory = attributeCategory;
    this.newLevel = newLevel;
    this.previousLevel = previousLevel;
    this.isSignificantMilestone = isSignificantMilestone;
    this.unlockableFeatures = unlockableFeatures;
    this.skillPointsGained = skillPointsGained;
    this.attributePointsGained = attributePointsGained;
    this.timeToReachLevel = timeToReachLevel;
  }
}
