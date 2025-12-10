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
    
    // Process replay events if replay is active
    this.checkReplayEvents();
  }

  //to do, paramaterize the test level
  static checkMicroEventsForTriggered() {
    let microEventManager = FundamentalSystemBridge["microEventManager"];
    if (!microEventManager) {
      // Log occasionally to avoid spam

      return;
    } else {
      microEventManager.onFrameCheckMicroEventsForTriggered();
    }
  }

  /**
   * Check and process replay events if a replay is active
   * This allows replay to use the same frame tick as normal gameplay,
   * preventing desync on devices with varying frame rates
   */
  static checkReplayEvents() {
    let replayManager = FundamentalSystemBridge["levelReplayManager"];
    if (!replayManager) {
      return;
    }
    
    // Call the replay manager's end-of-frame tick if replay is active
    if (replayManager.isReplaying) {
      replayManager.onReplayEndOfFrameTick();
    }
  }
}
