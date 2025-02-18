class ItemUsageFailure {
  constructor(failureReason, itemId) {
    this.failureReason = failureReason;
    this.itemId = itemId;
    this.timestamp = TimestampGenie.getStandardTimeStampISO8601();
  }
}
