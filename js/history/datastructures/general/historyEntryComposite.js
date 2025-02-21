// Represents a composite entry in the history system.
// This includes various types of history data such as actions, acquisitions, and progress.
class HistoryEntryComposite {
  constructor(
    historyCategory = "-blank-history-category-", // Category of the history entry.
    moveIndex = -1, // Index of the move in the game.
    levelId, // ID of the level in which the event occurred.
    worldId, // ID of the world in which the event occurred.
    gameMode, // Game mode of the event.
    participantPlayerProfiles, // Profiles of players participating in the event.
    historyActionData = null, // Data related to actions in the event.
    historyAcquisitionData = null, // Data related to acquisitions in the event.
    historyProgressData = null, // Data related to progress in the event.
    historyCompetitiveData = null // Data related to competitive events.
  ) {
    // Initialize properties with provided values.
    this.timestamp = Date.now();
    this.historyCategory = historyCategory;
    this.moveIndex = moveIndex;
    this.levelId = levelId;
    this.worldId = worldId;
    this.gameMode = gameMode;
    this.participantPlayerProfiles = participantPlayerProfiles;
    this.historyActionData = historyActionData;
    this.historyAcquisitionData = historyAcquisitionData;
    this.historyProgressData = historyProgressData;
    this.historyCompetitiveData = historyCompetitiveData;
  }

  // Consider adding a method to serialize the entry for storage or transmission.
  // serialize() {
  //   return JSON.stringify(this);
  // }
}
