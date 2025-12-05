class GameplayEndOfFrameCoordinator {
  static processEndOfFrameEvents(gameplayManager) {
    if (!(gameplayManager instanceof GameplayManagerComposite)) return;

    // Process player movements
    gameplayManager.allActivePlayers
      .filter((player) => player instanceof PlayerUnit)
      .forEach((player) =>
        player.playerMovementManager.updatePositionBasedOffVelocity()
      );

    // Process gameplay level events
    gameplayManager.allActiveGameplayLevels
      .filter((level) => level instanceof ActiveGameplayLevel)
      .forEach((level) => {
        level.onFrameEvents();
      });

    this.checkMicroEventsForTriggered();
  }

  //to do, paramaterize the test level
  static checkMicroEventsForTriggered() {
    let microEventManager = FundamentalSystemBridge["microEventManager"];
    if (!microEventManager) {
      // Log occasionally to avoid spam
      if (!this._lastNoManagerLog || Date.now() - this._lastNoManagerLog > 10000) {
        console.warn(`[FRAME COORDINATOR] MicroEventManager not found in FundamentalSystemBridge!`);
        this._lastNoManagerLog = Date.now();
      }
      return;
    } else {
      microEventManager.onFrameCheckMicroEventsForTriggered();
    }
  }
}
