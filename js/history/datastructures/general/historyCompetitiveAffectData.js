// Represents the effects of a competitive action on other players.
// This class captures the impact of a player's action on their competitors,
// including changes in rank, victory status, and the magnitude of the action.

class HistoryCompetitiveAffectData {
  constructor(
    victimsPlayerPublicId, // Public ID of the victim player affected by the action.
    actionCategory, // Category of the action affecting the victim (e.g., "attack", "defense").
    actionMagnitudeByVictimPublicId, // Magnitude of the action, indexed by the victim's public ID.
    resultedInAWin, // Boolean indicating if the action resulted in a win for the acting player.
    victoryNumericBoostDelta, // Numeric value representing the boost in victory points due to the action.
    resultedInRankAdvancement, // Boolean indicating if the action led to a rank advancement.
    formerRank, // The player's rank before the action.
    newRank // The player's rank after the action.
  ) {
    // Initialize properties with provided values.
    this.victimsPlayerPublicId = victimsPlayerPublicId;
    this.actionCategory = actionCategory;
    this.actionMagnitudeByVictimPublicId = actionMagnitudeByVictimPublicId;
    this.resultedInAWin = resultedInAWin;
    this.victoryNumericBoostDelta = victoryNumericBoostDelta;
    this.resultedInRankAdvancement = resultedInRankAdvancement;
    this.formerRank = formerRank;
    this.newRank = newRank;
  }

  // Consider adding a method to update the rank based on new data.
  // This method would allow for dynamic updates to the player's rank
  // as new competitive actions are recorded.
  // updateRank(newRank) {
  //   this.newRank = newRank;
  // }
}
