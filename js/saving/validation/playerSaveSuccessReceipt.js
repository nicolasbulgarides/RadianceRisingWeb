class PlayerSaveSuccessReceipt {
  constructor(
    playerId,
    outboundToServerTimestamp,
    inboundFromServerTimestamp,
    expectedSaveHash,
    receivedSaveHash
  ) {
    this.playerId = playerId;
    this.outboundToServerTimestamp = outboundToServerTimestamp;
    this.inboundFromServerTimestamp = inboundFromServerTimestamp;
    this.expectedSaveHash = expectedSaveHash;
    this.receivedSaveHash = receivedSaveHash;
  }
}
