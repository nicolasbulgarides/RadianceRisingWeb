class PlayerSaveManager {
  constructor() {
    FundamentalSystemBridge.registerPlayerSaveManager(this);
    this.this.playerSaveTempRecordArchive = new PlayerSaveTempRecordArchive();

    this.playerSaveUnconfirmedBatchTracker =
      new PlayerSaveUnconfirmedBatchTracker();
  }

  attemptToRetrievePlayerSaveComposite() {
    let playerSaveComposite =
      FundamentalSystemBridge.networkingManager.retrievePlayerSaveComposite();
    if (playerSaveComposite) {
      return playerSaveComposite;
    }
    return null;
  }
}
