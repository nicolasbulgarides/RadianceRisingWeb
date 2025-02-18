class PlayerSaveLogger {
  static playerSaveLoggingEnabled = true;
  static forcefullyOverrideLoggingConfig = false;

  static informOfIncompletePlayerSave(
    msg,
    playerSaveComposite,
    sender,
    importance
  ) {
    let loggingAbsoluteDecision =
      this.getLocalFinalizedLoggingDecision(importance);

    if (loggingAbsoluteDecision) {
      //to do
      let formattedMissingSaveData =
        this.formatMissingSaveDataForLog(playerSaveComposite);
    }
  }
  static informOfAttemptToOverridePlayerSaveRecordBatch(
    msg,
    sender,
    importance
  ) {
    let loggingAbsoluteDecision =
      this.getLocalFinalizedLoggingDecision(importance);

    if (loggingAbsoluteDecision) {
      let formattedMsg =
        "Suspicious attempt to override player save record batch: " + msg;
      LoggerOmega.SmartLogger(formattedMsg, sender, importance);
    }
  }
  static informOfCriticalBatchConflict(batchConflictMsg, sender, importance) {
    let loggingAbsoluteDecision =
      this.getLocalFinalizedLoggingDecision(importance);

    if (loggingAbsoluteDecision) {
      //to do
    }
  }

  static formatMissingSaveDataForLog(playerSaveComposite) {}

  static getLocalFinalizedLoggingDecision(importancePassedIn) {
    return LoggerOmega.GetFinalizedLoggingDecision(
      this.forcefullyOverrideLoggingConfig,
      this.playerSaveLoggingEnabled,
      importancePassedIn
    );
  }
}
