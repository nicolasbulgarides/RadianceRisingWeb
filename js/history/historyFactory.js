// Factory class for creating various history data objects.
// Provides static methods to create instances of different history data classes.
class HistoryFactory {
  // Creates a new HistoryGroup instance.
  static createHistoryGroup(
    groupKey, // Unique key identifying the group.
    groupCategory, // Category of the group.
    groupSubCategory, // Sub-category of the group.
    groupHandyDescription, // Handy description of the group.
    timestampOfGroupParticipants, // Timestamp of the group's participants.
    assumedHistoryImportance // Assumed importance level of the group's history.
  ) {
    const historyGroup = new HistoryGroup(
      groupKey,
      groupCategory,
      groupSubCategory,
      groupHandyDescription,
      timestampOfGroupParticipants,
      assumedHistoryImportance
    );

    return historyGroup;
  }

  // Creates a new HistoryEntryComposite instance.
  static createHistoryEntryComposite(
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
    const historyEntryComposite = new HistoryEntryComposite(
      historyCategory,
      moveIndex,
      levelId,
      worldId,
      gameMode,
      participantPlayerProfiles,
      historyActionData,
      historyAcquisitionData,
      historyProgressData,
      historyCompetitiveData
    );

    return historyEntryComposite;
  }

  // Creates a new HistoryOtherSpecialData instance.
  static createHistoryOtherSpecialData(historySpecialDataMap) {
    const historyOtherSpecialData = new HistoryOtherSpecialData(
      historySpecialDataMap
    );

    return historyOtherSpecialData;
  }

  // Creates a new HistoryCompetitiveData instance.
  static createHistoryCompetitiveData(
    actingPlayerPublicPlayerId, // Public ID of the acting player.
    competitiveGameMode, // Game mode of the competitive event.
    competitiveMoveDescription, // Description of the competitive move.
    competitiveAffectData // Data on the effects of the competitive move.
  ) {
    const historyCompetitiveData = new HistoryCompetitiveData(
      actingPlayerPublicPlayerId,
      competitiveGameMode,
      competitiveMoveDescription,
      competitiveAffectData
    );

    return historyCompetitiveData;
  }

  // Creates a new HistoryCompetitiveAffectData instance.
  static createHistoryCompetitiveAffectData(
    victimsPlayerPublicId, // Public ID of the victim player.
    actionCategory, // Category of the action affecting the victim.
    actionMagnitudeByVictimPublicId, // Magnitude of the action by victim's public ID.
    resultedInAWin, // Whether the action resulted in a win.
    victoryNumericBoostDelta, // Numeric boost in victory points.
    resultedInRankAdvancement, // Whether the action resulted in rank advancement.
    formerRank, // Former rank of the player.
    newRank // New rank of the player.
  ) {
    const historyCompetitiveAffectData = new HistoryCompetitiveAffectData(
      victimsPlayerPublicId,
      actionCategory,
      actionMagnitudeByVictimPublicId,
      resultedInAWin,
      victoryNumericBoostDelta,
      resultedInRankAdvancement,
      formerRank,
      newRank
    );

    return historyCompetitiveAffectData;
  }

  // Creates a new HistoryActionData instance.
  static createHistoryActionData(
    actionCategory, // Category of the action (e.g., "movement", "spell").
    actionName, // Name of the action.
    actionDescription, // Description of the action.
    actionInitialValue, // Initial value of the action.
    actionEndingValue // Ending value of the action.
  ) {
    const historyActionData = new HistoryActionData(
      actionCategory,
      actionName,
      actionDescription,
      actionInitialValue,
      actionEndingValue
    );

    return historyActionData;
  }

  // Creates a new HistoryAcquisitionData instance.
  static createHistoryAcquisitionData(
    acquisitionCategory, // Category of the acquisition (e.g., "item", "currency").
    acquisitionName, // Name of the acquisition.
    acquisitionDescription, // Description of the acquisition.
    currencyNameAcquired, // Name of the currency acquired.
    currencyQuantityAcquired // Quantity of the currency acquired.
  ) {
    const historyAcquisitionData = new HistoryAcquisitionData(
      acquisitionCategory,
      acquisitionName,
      acquisitionDescription,
      currencyNameAcquired,
      currencyQuantityAcquired
    );

    return historyAcquisitionData;
  }

  // Creates a new HistoryProgressData instance.
  static createHistoryProgressData(
    progressCategory, // Category of the progress (e.g., "level", "achievement").
    progressName, // Name of the progress.
    progressDescription, // Description of the progress.
    progressInitialValue, // Initial value of the progress.
    progressEndingValue // Ending value of the progress.
  ) {
    const historyProgressData = new HistoryProgressData(
      progressCategory,
      progressName,
      progressDescription,
      progressInitialValue,
      progressEndingValue
    );

    return historyProgressData;
  }
}
