class PlayerSaveRecord {
  constructor(
    playerId = "-blank-player-save-player-id",
    saveRecordId = "-blank-player-save-record-id",
  ) {
    this.playerId = playerId;
    this.saveRecordId = saveRecordId;
    this.wasSavedLocallySucessfully = false;
    this.wasSavedToServerSucessfully = false;
    this.timetampOfLastLocalSave = null;
    this.timetampOfLastAttemptedServerSave = null;
    this.timestampOfServerSaveConfirmation = null;
    this.timestampOfBatchPopulation = null;
    this.playerSaveUpdateBatch = null;
    this.playerSaveBatchWeightArchetype = null;
  }

  createSlimPlayerSaveRecordWithBatch(
    playerId,
    saveRecordId,
    playerSaveUpdateBatch
  ) {
    let playerRecord = new PlayerSaveRecord(
      playerId,
      saveRecordId,
    );
    //Note that while this is clunky / repetitive, its consistency enforces a stanrd process for populating a save batch, as opposed to a single 
    // constructor that is always used with a different set of complete and null poarameters
    playerRecord.populatePlayerSaveBatch(playerSaveUpdateBatch );
    return playerRecord;
  }

  populatePlayerSaveBatch(playerSaveUpdateBatch) {

    if (this.playerSaveUpdateBatch == null) {

      this.playerSaveUpdateBatch = playerSaveUpdateBatch;
      this.playerSaveBatchWeightArchetype = playerSaveUpdateBatch.constructor.name;
      this.timestampOfBatchPopulation = TimestampGenie.getTimestamp();
    } else {
      P
    }
  }

  createMediumPlayerSaveRecordWithBatch(
    playerId,
    saveRecordId,
    playerSaveUpdateBatch
  ) {
    let timestamp = TimestampGenie.getTimestamp();
    let playerRecord = new PlayerSaveRecord(
      playerId,
      saveRecordId,
      timestamp,
      "medium"
    );
    playerRecord.populatePlayerSaveBatch(playerSaveUpdateBatch, timestamp, "medium");
    return playerRecord;
  }

  createHeavyPlayer
    playerId,
    saveRecordId,
    timestamp,
    playerSaveAbsoluteComposite
  ) {}
}
