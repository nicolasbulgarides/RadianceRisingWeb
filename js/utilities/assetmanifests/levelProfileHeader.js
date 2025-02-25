/**
 * @class LevelProfileHeader
 * @description Represents the metadata and classification information for a game level.
 * This header is used by the LevelDataFileLoader to determine how to load and process the level data,
 * and provides categorization information for the level selection UI.
 */
class LevelProfileHeader {
  /**
   * Creates a new LevelProfileHeader instance
   * @param {string} levelId - Unique identifier for the level
   * @param {string} levelNickname - Display name for the level
   * @param {string} levelCategory - Category classification (e.g., 'developer', 'tutorial')
   * @param {boolean} isDeveloperLevel - Indicates if this is a development/testing level
   * @param {boolean} isTutoriallevel - Indicates if this is a tutorial level
   * @param {boolean} isLocalLevel - Indicates if level data should be loaded from local storage
   * @param {boolean} isFreeLevel - Indicates if this level is available in the free version
   * @param {boolean} isPremiumLevel - Indicates if this level requires premium access
   */
  constructor(
    levelId,
    levelNickname,
    levelCategory,
    isDeveloperLevel,
    isTutoriallevel,
    isLocalLevel,
    isFreeLevel,
    isPremiumLevel
  ) {
    this.levelId = levelId;
    this.levelNickname = levelNickname;
    this.levelCategory = levelCategory;
    this.isDeveloperLevel = isDeveloperLevel;
    this.isTutoriallevel = isTutoriallevel;
    this.isLocalLevel = isLocalLevel;
    this.isFreeLevel = isFreeLevel;
    this.isPremiumLevel = isPremiumLevel;
  }
}
