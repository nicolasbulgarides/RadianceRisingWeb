class GameplayEndOfFrameCoordinator {
  static frameCounter = 0;

  static processEndOfFrameEvents(gameplayManager) {
    if (!(gameplayManager instanceof GameplayManagerComposite)) return;

    // Increment frame counter for frame skipping optimizations
    this.frameCounter++;

    // Process player movements - optimized with for loop instead of filter + forEach
    const players = gameplayManager.allActivePlayers;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player instanceof PlayerUnit) {
        player.playerMovementManager.updatePositionBasedOffVelocity();
      }
    }

    // Removed empty onFrameEvents() calls - they do nothing

    this.checkMicroEventsForTriggered();

    // Process replay events if replay is active (check every 2 frames for optimization)
    if (this.frameCounter % 2 === 0) {
      this.checkReplayEvents();
    }

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
