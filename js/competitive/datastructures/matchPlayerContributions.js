class MatchPlayerContributions {
  constructor(
    playerPublicId,
    playerNicknameAtTimeOfMatch,
    playerBestScore,
    playerWorstScore,
    playerPointsScored,
    playerAssists,
    playerKills,
    playerDeaths
  ) {
    this.playerPublicId = playerPublicId;
    this.playerNicknameAtTimeOfMatch = playerNicknameAtTimeOfMatch;
    this.playerBestScore = playerBestScore;
    this.playerWorstScore = playerWorstScore;
    this.playerPointsScored = playerPointsScored;
    this.playerAssists = playerAssists;
    this.playerKills = playerKills;
    this.playerDeaths = playerDeaths;
  }
}
