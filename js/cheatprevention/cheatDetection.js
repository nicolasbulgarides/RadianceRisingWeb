class CheatDetection {
  constructor(
    cheatCategories,
    cheatAccountId,
    cheatIpAddress,
    cheatTimestamp,
    cheatSystemMessage,
    cheatOutcome,
    cheatOutcomeExplanation
  ) {
    this.cheatCategories = cheatCategories;

    if (this.cheatCategories.length > 1) {
      {
        this.wasMultipleCheatsDetected = true;
      }
      this.cheatTimestamp = cheatTimestamp;
      this.cheatAccountId = cheatAccountId;
      this.cheatIpAddress = cheatIpAddress;
      this.cheatSystemMessage = cheatSystemMessage;
      this.cheatOutcome = cheatOutcome;
      this.cheatOutcomeExplanation = cheatOutcomeExplanation;
    }
  }
}
