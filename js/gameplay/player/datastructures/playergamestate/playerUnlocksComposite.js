class PlayerUnlocksComposite {
  constructor() {
    this.unlockedItems = [];
    this.unlockedArtifacts = [];
    this.unlockedLevels = [];
    this.unlockedConstellations = [];
    this.unlockedSpecialAreas = [];
    this.unlockedGamemodes = [];
  }

  addUnlockedLevel(levelName) {
    this.unlockedLevels.push(levelName);
  }

  addUnlockedConstellation(constellationName) {
    this.unlockedConstellations.push(constellationName);
  }

  addUnlockedSpecialArea(specialAreaName) {
    this.unlockedSpecialAreas.push(specialAreaName);
  }

  addUnlockedGamemode(gamemodeName) {
    this.unlockedGamemodes.push(gamemodeName);
  }

  addUnlockedLevel(levelName) {
    this.unlockedLevels.push(levelName);
  }

  addUnlockedAchievement(achievementName) {
    this.unlockedAchievements.push(achievementName);
  }

  addUnlockedAndReportSingleUnlock(unlockName) {
    if (this.unlockedItems.includes(unlockName)) {
    } else {
      this.unlockedItems.push(unlockName);
    }
  }

  addUnlockedAndReportMultipleUnlocks(unlockNames) {
    for (const unlockName of unlockNames) {
      this.addUnlockedAndReportSingleUnlock(unlockName);
    }
  }
}
