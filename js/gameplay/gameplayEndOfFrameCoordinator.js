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
      //console.log("Micro event manager not found");
      return;
    } else {
      microEventManager.onFrameCheckMicroEventsForTriggered();
    }
  }
}
