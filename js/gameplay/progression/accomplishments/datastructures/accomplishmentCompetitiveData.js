/**
 * Data structure for tracking competitive player-versus-player accomplishments.
 * Tracks various forms of competition against other players including duels,
 * skirmishes, races, tournaments, and other competitive activities.
 */
class AccomplishmentCompetitiveData {
  /**
   * Creates a new competitive accomplishment data instance
   * @param {string} competitionCategory - Primary classification of the competition
   * @param {string} competitionSubCategory - Secondary classification of the competition
   * @param {string} competitionNickName - User-friendly name for the competition
   * @param {Array<string>} publicProfileIdOfAllies - IDs of allied players
   * @param {Array<string>} publicProfileIdOfCompetitors - IDs of competing players
   * @param {string} competitionOutcome - Result of the competition
   * @param {number} competitionOutcomeMagnitude - Numeric measure of the outcome's significance
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    competitionCategory,
    competitionSubCategory,
    competitionNickName,
    publicProfileIdOfAllies,
    publicProfileIdOfCompetitors,
    competitionOutcome,
    competitionOutcomeMagnitude,
    otherRelevantData
  ) {
    this.competitionCategory = competitionCategory;
    this.competitionSubCategory = competitionSubCategory;
    this.competitionNickName = competitionNickName;
    this.publicProfileIdOfAllies = publicProfileIdOfAllies;
    this.publicProfileIdOfCompetitors = publicProfileIdOfCompetitors;
    this.competitionOutcome = competitionOutcome;
    this.competitionOutcomeMagnitude = competitionOutcomeMagnitude;
    this.otherRelevantData = otherRelevantData;
  }
}
