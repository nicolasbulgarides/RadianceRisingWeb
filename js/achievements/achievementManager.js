class AchievementManager {
  constructor() {
    this.achievementPresets = new AchievementPresets();
    this.achievementUIManager = new AchievementUIManager();
    FundamentalSystemBridge.registerAchievementManager(this);
  }

  assembleAchievementUIFromPresets() {
    this.achievementUIManager.assembleAchievementUIFromPresets(
      this.achievementPresets
    );
  }

  displayRemarkableAchievementUI(remarkableAchievement) {
    if (remarkableAchievement instanceof Achievement) {
      if (remarkableAchievement.isRemarkable) {
        this.achievementUIManager.displayRemarkableAchievementUI(
          remarkableAchievement
        );
      }
    }
  }

  populateAccomplishedAcheivementsFromSave(playerSaveAchievements) {
    this.acheivementUIManager.populateAccomplishedAcheivementsFromSave(
      playerSaveAchievements
    );
  }

  updateIndividualAchievement(achievementToProcess) {}
  updateAccomplishedAcheivements(playerSaveAchievementsToUpdate) {
    if (
      playerSaveAchievements.accomplishedAchievements.includes(
        achievementToProcess.achievementName
      )
    ) {
    }
  }
}
