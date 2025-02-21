class MatchOutcomeData {
  constructor(
    matchUniqueForeverId = null,
    matchModeId = null,
    matchPlayerContributions = null,
    matchClosenessAssessment = "close",
    finalScoreOfVictors = null,
    finalScoreOfDefeated = null,
    matchMemorableMoments = null
  ) {
    this.matchUniqueForeverId = matchUniqueForeverId;
    this.matchModeId = matchModeId;
    this.matchPlayerContributions = matchPlayerContributions;
    this.matchClosenessAssessment = matchClosenessAssessment;
    this.finalScoreOfVictors = finalScoreOfVictors;
    this.finalScoreOfDefeated = finalScoreOfDefeated;
    this.matchMemorableMoments = matchMemorableMoments;
  }
}
