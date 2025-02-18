/**
 * Class representing completion-based item requirements.
 * This highly detailed class is designed to validate an extensive array of player progress metrics,
 * including artifacts, spells usage, level completions, constellations, achievements, and specialized area completions.
 * It supports both aggregated counts and specific lists of completed challenges. Although over-engineered for current use cases,
 * it aims to provide a future-proof interface for detailed game progression analysis.
 *
 * @class ItemRequirementsCompletion
 * @extends ItemRequirementCategory
 */
class ItemRequirementsCompletion extends ItemRequirementCategory {
  /**
   * Constructs completion requirements with a broad set of progress metrics.
   * @param {string} categoryName - Identifier for the completion requirements category.
   * @param {string} categoryDescription - Description of the completion requirements.
   * @param {number} minimumArtifactsEverAcquired - Total artifacts ever acquired required.
   * @param {number} minimumArtifactsCurrentlyOwned - Current artifacts that must be owned.
   * @param {number} minimumDistinctSpellsEverUsed - Minimum number of distinct spells that must have been used.
   * @param {number} minimumLifetimeTotalSpellCasts - Total spell casts required over the player's lifetime.
   * @param {number} minimumLifetimeTotalArtifactUses - Total artifact uses required during the lifetime.
   * @param {number} minimumPercentCompletion - Overall percentage of game content that must be completed.
   * @param {number} minimumLevelsUnlocked - Minimum number of game levels that must be unlocked.
   * @param {number} minimumLevelsCompleted - Minimum number of levels that must be completed.
   * @param {number} minimumLevelsSolvedPerfectly - Count of levels that must be solved with perfect performance.
   * @param {number} minimumConstellationsUnlocked - Required count of unlocked constellations.
   * @param {number} minimumConstellationsCompleted - Required count of completed constellations.
   * @param {number} minimumConstellationsSolvedPerfectly - Required count of constellations solved perfectly.
   * @param {Array} specificLevelsSolved - Specific level identifiers that must be solved.
   * @param {Array} specificConstellationsSolved - Specific constellation identifiers that must be solved.
   * @param {Array} specialAreasUnlocked - List of special in-game areas that must be unlocked.
   * @param {Array} specialAreasCompleted - List of in-game areas that must be completed.
   * @param {Array} specialAreasSolvedPerfectly - Areas that require perfect completion.
   * @param {number} minimumAchievementPoints - Minimum number of achievement points required.
   * @param {Array} specificAchievementsAttained - List of specific achievements the player must attain.
   * @param {Array} specificAcheivementGroupsFinished - Groups of achievements that must be fully completed.
   * @param {Array} specialUnusualCompletionRequirements - Additional unique conditions for completion.
   */
  constructor(
    categoryName = "-item-category-placeholder",
    categoryDescription = "-item-category-description-placeholder",
    minimumArtifactsEverAcquired = 0,
    minimumArtifactsCurrentlyOwned = 0,
    minimumDistinctSpellsEverUsed = 0,
    minimumLifetimeTotalSpellCasts = 0,
    minimumLifetimeTotalArtifactUses = 0,
    minimumPercentCompletion = 0,
    minimumLevelsUnlocked = 0,
    minimumLevelsCompleted = 0,
    minimumLevelsSolvedPerfectly = 0,
    minimumConstellationsUnlocked = 0,
    minimumConstellationsCompleted = 0,
    minimumConstellationsSolvedPerfectly = 0,
    specificLevelsSolved = [],
    specificConstellationsSolved = [],
    specialAreasUnlocked = [],
    specialAreasCompleted = [],
    specialAreasSolvedPerfectly = [],
    minimumAchievementPoints = 0,
    specificAchievementsAttained = [],
    specificAcheivementGroupsFinished = [],
    specialUnusualCompletionRequirements = []
  ) {
    super(categoryName, categoryDescription);

    this.minimumArtifactsEverAcquired = minimumArtifactsEverAcquired;
    this.minimumArtifactsCurrentlyOwned = minimumArtifactsCurrentlyOwned;
    this.minimumDistinctSpellsEverUsed = minimumDistinctSpellsEverUsed;
    this.minimumTotalSpellCasts = minimumLifetimeTotalSpellCasts;
    this.minimumTotalArtifactUses = minimumLifetimeTotalArtifactUses;
    this.minimumPercentCompletion = minimumPercentCompletion;
    this.minimumLevelsUnlocked = minimumLevelsUnlocked;
    this.minimumLevelsCompleted = minimumLevelsCompleted;
    this.minimumLevelsSolvedPerfectly = minimumLevelsSolvedPerfectly;
    this.minimumConstellationsUnlocked = minimumConstellationsUnlocked;
    this.minimumConstellationsCompleted = minimumConstellationsCompleted;
    this.minimumConstellationsSolvedPerfectly =
      minimumConstellationsSolvedPerfectly;
    this.minimumAchievementPoints = minimumAchievementPoints;
    this.specificAchievementsAttained = specificAchievementsAttained;
    this.specificAcheivementGroupsFinished = specificAcheivementGroupsFinished;
    this.specificLevelsSolved = specificLevelsSolved;
    this.specificConstellationsSolved = specificConstellationsSolved;
    this.specialAreasUnlocked = specialAreasUnlocked;
    this.specialAreasCompleted = specialAreasCompleted;
    this.specialAreasSolvedPerfectly = specialAreasSolvedPerfectly;
    this.specialUnusualCompletionRequirements =
      specialUnusualCompletionRequirements;
  }
}
