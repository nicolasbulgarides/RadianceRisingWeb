class PlayerSaveAllAchievements {
  constructor() {
    this.playerSaveAllAchievements = null;
  }

  populatePlayerSaveAllAchievements(playerSaveComposite) {
    if (playerSaveComposite.playerSaveAllAchievements != null) {
      this.playerSaveAllAchievements =
        playerSaveComposite.playerSaveAllAchievements;
      return;
    }

    playerSaveComposite.playerSaveAllAchievements =
      new PlayerSaveAllAchievements();
  }
}
