/**
 * Represents the header data for a level in the game.
 * This class contains information about the level's ID, nickname, world ID, world nickname,
 * description, unlock requirements, complexity level, and background music.
 *  It is in the asset manifest code caategory because, rather then directly containing the level data,
 *  it is used to retrieve the level data from either the locally hosted json files, or from the remote server.
 *  The basic / tutorial / some or most free level profile headers will be auto-loaded on startup,
 *  and the rest will be loaded as needed as the player progresses through the game.
 * Accordingly, the local level data files will be stored for easy retrieval.
 *
 * Logic chain:
 * 1) LevelRetrievalHeader is either embedded  in or delivered to the client upon unlock event or login post unlock event
 * 2) LevelDataFileLoader uses the LevelRetrievalHeader to load the level data from either the local or remote source
 * 3) LevelDataComposite is then returned to the LevelFactoryComposite  where it is used to initialize the level
 * 4) After / during (the exact loading / asset streaming/ initialization sequence will be tweaked) - the level loads
 * 5) the player will then be transported to the level and begin gameplay
 */
class LevelHeaderData {
  constructor(
    levelId,
    levelNickname,
    worldId,
    worldNickname,
    description,
    unlockRequirements,
    complexityLevel,
    backgroundMusic
  ) {
    this.levelNickname = levelNickname;
    this.worldId = worldId;
    this.worldNickname = worldNickname;
    this.levelId = levelId;
    this.unlockRequirements = unlockRequirements;
    this.description = description;
    this.complexityLevel = complexityLevel;
    this.backgroundMusic = backgroundMusic;
  }
}
