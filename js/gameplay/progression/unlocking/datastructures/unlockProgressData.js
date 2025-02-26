/**
 * Class representing the progress-based data for unlock requirements.
 *
 * This class encapsulates requirements related to player progression through the game,
 * including achievements, points, prerequisite content, and special requirements.
 *
 * @class UnlockProgressData
 */
class UnlockProgressData {
  /**
   * Constructs a new set of unlock progress data.
   *
   * @param {Array} specificAchievementRequirement - Array of achievement identifiers required
   * @param {number} totalAchievementPointsRequirement - Total achievement points required
   * @param {Array} specificContentRequirement - Array of prerequisite content identifiers required
   * @param {Array} otherSpecialRequirements - Array of any additional special requirements
   */
  constructor(
    specificAchievementRequirement = [],
    totalAchievementPointsRequirement = 0,
    specificContentRequirement = [],
    otherSpecialRequirements = []
  ) {
    // Achievement identifiers that may be required as part of unlock conditions
    this.specificAchievementRequirement = specificAchievementRequirement;

    // The total achievement points a player must accumulate
    this.totalAchievementPointsRequirement = totalAchievementPointsRequirement;

    // Specific content that must be completed before unlocking
    this.specificContentRequirement = specificContentRequirement;

    // Additional special requirements that don't fall into other categories
    this.otherSpecialRequirements = otherSpecialRequirements;
  }

  /**
   * Creates progress data with no special requirements.
   *
   * @returns {UnlockProgressData} Basic progress data with no requirements
   */
  static createNoProgressRequirement() {
    return new UnlockProgressData();
  }

  /**
   * Creates progress data based on achievement completion.
   *
   * @param {Array} requiredAchievements - Array of required achievement identifiers
   * @returns {UnlockProgressData} Achievement-based progress data
   */
  static createAchievementBasedRequirement(requiredAchievements = []) {
    return new UnlockProgressData(requiredAchievements, 0, [], []);
  }

  /**
   * Creates progress data based on achievement points.
   *
   * @param {number} requiredPoints - The total achievement points required
   * @returns {UnlockProgressData} Achievement points-based progress data
   */
  static createAchievementPointsRequirement(requiredPoints = 100) {
    return new UnlockProgressData([], requiredPoints, [], []);
  }

  /**
   * Creates progress data based on prerequisite content.
   *
   * @param {Array} prerequisites - Array of prerequisite content identifiers
   * @returns {UnlockProgressData} Prerequisite-based progress data
   */
  static createPrerequisiteRequirement(prerequisites = []) {
    return new UnlockProgressData([], 0, prerequisites, []);
  }

  /**
   * Creates progress data for sequential content unlocking.
   *
   * @param {string} previousContent - The identifier of the immediately preceding content
   * @returns {UnlockProgressData} Sequential progress data
   */
  static createSequentialUnlockRequirement(previousContent) {
    return new UnlockProgressData([], 0, [previousContent], []);
  }

  /**
   * Creates progress data with special requirements.
   *
   * @param {Array} specialRequirements - Array of special requirement identifiers
   * @returns {UnlockProgressData} Special requirement-based progress data
   */
  static createSpecialRequirement(specialRequirements = []) {
    return new UnlockProgressData([], 0, [], specialRequirements);
  }

  /**
   * Creates progress data for time-limited events.
   *
   * @param {string} eventName - The name of the event
   * @param {Date} startDate - The start date of the event
   * @param {Date} endDate - The end date of the event
   * @returns {UnlockProgressData} Time-limited event progress data
   */
  static createTimeLimitedEventRequirement(eventName, startDate, endDate) {
    return new UnlockProgressData(
      [],
      0,
      [],
      [
        {
          type: "time-limited-event",
          eventName: eventName,
          startDate: startDate,
          endDate: endDate,
        },
      ]
    );
  }

  /**
   * Creates comprehensive progress data with multiple requirement types.
   *
   * @param {Array} achievements - Array of required achievement identifiers
   * @param {number} points - The total achievement points required
   * @param {Array} prerequisites - Array of prerequisite content identifiers
   * @param {Array} specialRequirements - Array of special requirement identifiers
   * @returns {UnlockProgressData} Comprehensive progress data
   */
  static createComprehensiveRequirement(
    achievements = [],
    points = 0,
    prerequisites = [],
    specialRequirements = []
  ) {
    return new UnlockProgressData(
      achievements,
      points,
      prerequisites,
      specialRequirements
    );
  }

  /**
   * Checks if this progress data is valid.
   *
   * @returns {boolean} True if the progress data is valid
   */
  isValid() {
    return this.totalAchievementPointsRequirement >= 0;
  }

  /**
   * Converts the progress data to a plain object for serialization.
   *
   * @returns {Object} A plain object representation of the progress data
   */
  toJSON() {
    return {
      specificAchievementRequirement: this.specificAchievementRequirement,
      totalAchievementPointsRequirement: this.totalAchievementPointsRequirement,
      specificContentRequirement: this.specificContentRequirement,
      otherSpecialRequirements: this.otherSpecialRequirements,
    };
  }

  /**
   * Creates an instance from a plain object (deserialization).
   *
   * @param {Object} data - The plain object to create an instance from
   * @returns {UnlockProgressData} A new instance with the provided data
   */
  static fromJSON(data) {
    return new UnlockProgressData(
      data.specificAchievementRequirement,
      data.totalAchievementPointsRequirement,
      data.specificContentRequirement,
      data.otherSpecialRequirements
    );
  }

  /**
   * Creates a copy of this progress data.
   *
   * @returns {UnlockProgressData} A new instance with the same properties
   */
  clone() {
    return new UnlockProgressData(
      [...this.specificAchievementRequirement],
      this.totalAchievementPointsRequirement,
      [...this.specificContentRequirement],
      [...this.otherSpecialRequirements]
    );
  }
}
