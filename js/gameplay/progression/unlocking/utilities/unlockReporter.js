class UnlockReporter {
  static reportUnlockToServer(unlockEventToReport) {
    let reportInstruction =
      unlockEventToReport.assembleUnlockReportInstruction(unlockEventToReport);

    // Generate a unique identifier for this report
    unlockEventToReport.generateAndStoreServerInformerId();

    // Get the unlock manager from the FundamentalSystemBridge
    const unlockManager = FundamentalSystemBridge.unlockManager;

    // Register the unlock event with the manager
    unlockManager.registerUnlockEvent(unlockEventToReport);

    return reportInstruction;
  }
}
