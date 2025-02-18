class UnlockFactory {
  constructor(playerCompositeData, gameplayManager) {
    this.playerCompositeData = playerCompositeData;
    this.gameplayManager = gameplayManager;
    this.unlockPresets = new unlockJustificationPresets();
  }

  attemptToCreateUnlock(
    unlockName,
    unlockTimestamp,
    unlockCategory,
    unlockJustification
  ) {

    let 



    return new PlayerUnlock(
      unlockName,
      unlockTimestamp,
      unlockCategory,
      unlockJustification
    );
  }
}
