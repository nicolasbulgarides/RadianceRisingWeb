/**
 * Class representing PvP-specific item requirements.
 * This class extends the item requirement system to include validations related to Player versus Player (PvP) features.
 * It encompasses conditions such as minimum ratings, kill counts, win counts, ranking thresholds, Elo ratings, and match statistics.
 * The over-engineered design ensures that even edge cases in competitive play scenarios can be accommodated.
 *
 * @class ItemRequirementsCompetitive
 * @extends ItemRequirementCategory
 */
class ItemRequirementsCompetitive extends ItemRequirementCategory {
  /**
   * Constructs competitive requirements for an item.
   * @param {string} categoryName - Unique identifier for the competitive requirements category (default: "-competitive-item-category-placeholder").
   * @param {string} categoryDescription - Description for the competitive requirements (default: "-competitive-item-category-description-placeholder").
   * @param {number} minimumPvPRating - Minimum rating required in PvP mode.
   * @param {number} minimumKillCount - Required minimum number of PvP kills.
   * @param {number} minimumWinCount - Required minimum number of PvP wins.
   * @param {number} requiredCurrentRank - Minimum current rank required in PvP.
   * @param {number} requiredRankAlltimeHigh - Historical high rank required for eligibility.
   * @param {number} minimumCurrentELO - Minimum current Elo rating required.
   * @param {number} minimumMatchesPlayed - Minimum number of matches that must have been played.
   * @param {number} minimumKDRatio - Minimum required kill/death ratio.
   * @param {number} minimumLossCount - Maximum allowable losses before disqualification.
   * @param {number} minimumPVPEventsParticipatedIn - Minimum number of special PvP events participated in.
   * @param {number} minimumPVPEventsWithRecognizedGlory - Minimum number of events where some form of recognition was earned.
   */
  constructor(
    categoryName = "-pvp-item-category-placeholder",
    categoryDescription = "-pvp-item-category-description-placeholder",
    minimumPvPRating = 0,
    minimumKillCount = 0,
    minimumWinCount = 0,
    requiredCurrentRank = 0,
    requiredRankAlltimeHigh = 0,
    minimumCurrentELO = 0,
    minimumMatchesPlayed = 0,
    minimumKDRatio = 0,
    minimumLossCount = 0,
    minimumPVPEventsParticipatedIn = 0,
    minimumPVPEventsWithRecognizedGlory = 0
  ) {
    super(categoryName, categoryDescription);
    this.minimumPvPRating = minimumPvPRating;
    this.minimumKillCount = minimumKillCount;
    this.minimumWinCount = minimumWinCount;
    this.minimumLossCount = minimumLossCount;
    this.minimumMatchesPlayed = minimumMatchesPlayed;
    this.minimumPVPEventsParticipatedIn = minimumPVPEventsParticipatedIn;
    this.minimumPVPEventsWithRecognizedGlory =
      minimumPVPEventsWithRecognizedGlory;
    this.requiredCurrentRank = requiredCurrentRank;
    this.requiredRankAlltimeHigh = requiredRankAlltimeHigh;
    this.minimumCurrentELO = minimumCurrentELO;
    this.minimumMatchesPlayed = minimumMatchesPlayed;
    this.minimumKDRatio = minimumKDRatio;
  }
}
