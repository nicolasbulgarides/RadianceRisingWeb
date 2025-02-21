class SpecialOccurrencesCompetitiveData {
  // Constructor for managing competitive data related to occurrences.
  constructor(
    gameModeId = null, // ID of the game mode associated with the occurrence.
    matchOutcomeData = null, // Data related to the outcome of the match.
    publicProfilesOfVictors = null, // Public profiles of the victors.
    publicProfilesOfDefeated = null, // Public profiles of the defeated.
    publicProfilesOfParticipants = null // Public profiles of all participants.
  ) {
    this.gameModeId = gameModeId;
    this.matchOutcomeData = matchOutcomeData;
    this.publicProfilesOfVictors = publicProfilesOfVictors;
    this.publicProfilesOfDefeated = publicProfilesOfDefeated;
    this.publicProfilesOfParticipants = publicProfilesOfParticipants;
  }
}
