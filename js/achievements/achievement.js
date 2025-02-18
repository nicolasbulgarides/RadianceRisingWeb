/**
 * Achievement represents a single achievement with various properties.
 * It is a storage object for predefined achievement. A player's actual achievement is shaped as
 * "AchievementRecord
 */
class Achievement {
  constructor(
    achievementName,
    achievementValue,
    isRemarkable,
    achievementGraphic,
    acheivementCategory,
    acheivementDescription,
    acheivementChain,
    achievementRowIndex,
    achievementColumnIndex
  ) {
    this.achievementName = achievementName;
    this.achievementValue = achievementValue;
    this.isRemarkable = isRemarkable;
    this.achievementGraphic = achievementGraphic;
    this.acheivementCategory = acheivementCategory;
    this.acheivementDescription = acheivementDescription;
    this.acheivementChain = acheivementChain;
    this.achievementRowIndex = achievementRowIndex;
    this.achievementColumnIndex = achievementColumnIndex;
  }
}
