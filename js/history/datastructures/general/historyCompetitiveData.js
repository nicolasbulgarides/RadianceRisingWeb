// Represents data related to a competitive event involving players.
// This includes the acting player, game mode, and move description.
class HistoryCompetitiveData {
  constructor(
    actingPlayerPublicPlayerId, // Public ID of the acting player.
    competitiveGameMode, // Game mode of the competitive event.
    competitiveMoveDescription, // Description of the competitive move.
    competitiveAffectData // Data on the effects of the competitive move.
  ) {
    // Initialize properties with provided values.
    this.actingPlayerPublicPlayerId = actingPlayerPublicPlayerId;
    this.competitiveGameMode = competitiveGameMode;
    this.competitiveMoveDescription = competitiveMoveDescription;
    this.competitiveAffectData = competitiveAffectData;
  }

  // Consider adding a method to validate the competitive data.
  // validateData() {
  //   // Implement validation logic here.
  // }
}
