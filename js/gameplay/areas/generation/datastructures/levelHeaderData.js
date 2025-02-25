class LevelHeaderData {
  constructor(
    worldId,
    worldNickname,
    levelId,
    levelNickname,
    description,
    unlockRequirements,
    complexityLevel,
    backgroundMusic
  ) {
    this.worldId = worldId;
    this.worldNickname = worldNickname;
    this.levelId = levelId;
    this.unlockRequirements = unlockRequirements;
    this.levelNickname = levelNickname;
    this.description = description;
    this.complexityLevel = complexityLevel;
    this.backgroundMusic = backgroundMusic;
  }
}
