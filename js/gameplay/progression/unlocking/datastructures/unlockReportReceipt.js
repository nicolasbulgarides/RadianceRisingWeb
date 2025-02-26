//Class for confirming that an unlock report was received by the server to then inform the client
//note that this is essential for the saving system to ensure that save data is not lost
//it is also especially important for players to receive any rewards that they are owed due to financial transactions and special accomplishments

//note that the unlock event for offline storage is there just in case a player loses connection so we minimize chance that they lose access to their rewards / purchases
class UnlockReportReceipt {
  constructor(
    unlockReportReceiptId,
    unrelockReportIdForServer,
    unlockEventForOfflineStorage
  ) {
    this.unlockReportReceiptId = unlockReportReceiptId;
    this.unrelockReportIdForServer = unrelockReportIdForServer;
    this.unlockEventForOfflineStorage = unlockEventForOfflineStorage;
  }
}
