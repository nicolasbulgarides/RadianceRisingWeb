/**
 * @class LevelManifest
 * @description Manages the registry of all available game levels and their metadata.
 * Acts as a central repository for level headers and handles level access logic including
 * developer overrides and level availability checks. Works in conjunction with LevelDataFileLoader
 * to facilitate the full level loading pipeline used by GameplayManagerComposite.
 */
class LevelManifest {
  /** @type {Object.<string, LevelProfileHeader>} Storage for all local level headers */
  static LOCAL_LEVEL_HEADERS = {};

  // Level Header Variables -
  // Slot 0) Slot 1)levelId, Slot 2) levelNickname, Slot 3) levelCategory,
  // Slot 4) isDeveloperLevel, Slot 5) isTutoriallevel,
  // Slot 6) isLocalLevel, Slot 7) isFreeLevel, Slot 8) isPremiumLevel

  /**
   * Retrieves a level header based on the provided level ID, with optional developer override support
   * @param {string} levelId - The unique identifier for the desired level
   * @param {boolean} [testOverride=false] - Whether to override with test/demo level
   * @returns {LevelProfileHeader} The header for the requested level
   */
  static getLevelHeaderByLevelId(levelId, testOverride = false) {
    let finalOverride =
      LevelManifest.getDeveloperOverrideDecision(testOverride);

    if (finalOverride) {
      return LevelManifest.retrieveLevelDataByLevelId(Config.DEMO_LEVEL);
    } else {
      return LevelManifest.retrieveLevelDataByLevelId(levelId);
    }
  }

  /**
   * Retrieves level data from the local headers registry
   * @param {string} levelId - The unique identifier for the desired level
   * @returns {LevelProfileHeader} The header for the requested level or default test level if not found
   */
  static retrieveLevelDataByLevelId(levelId) {
    if (LevelManifest.LOCAL_LEVEL_HEADERS[levelId]) {
      return LevelManifest.LOCAL_LEVEL_HEADERS[levelId];
    } else {
      return LevelManifest.LOCAL_LEVEL_HEADERS["test0"];
    }
  }

  /**
   * Determines if developer override should be applied based on configuration and override parameter
   * @param {boolean} convenientLevelOverride - Override flag passed from calling context
   * @returns {boolean} Whether developer override should be applied
   */
  static getDeveloperOverrideDecision(convenientLevelOverride) {
    if (Config.RUN_LOCALLY_DETERMINED == false && convenientLevelOverride) {
      return false;
    } else if (Config.LOAD_LEVEL_FROM_DEVELOPER_OVERRIDE) {
      console.log(
        "Developer local override from config file: " +
          ", Config: " +
          Config.LOAD_LEVEL_FROM_DEVELOPER_OVERRIDE +
          ", Proposed Override Pass In: " +
          convenientLevelOverride
      );

      return true;
    } else if (convenientLevelOverride) {
      console.log(
        "Developer local override convenience override: " +
          convenientLevelOverride
      );
      return true;
    } else {
      return false;
    }
  }

  /**
   * Static initialization block that loads all level categories on class initialization
   */
  static {
    LevelManifest.loadDeveloperLevels();
    LevelManifest.loadFreeLocalLevels();
    LevelManifest.loadTutorialLevels();
    LevelManifest.loadPremiumLocalLevels();
  }

  /**
   * Initializes developer/testing levels in the manifest
   * These levels are typically used for development and testing purposes
   */
  static loadDeveloperLevels() {
    LevelManifest.loadHeader(
      "testLevel0",
      "Test Level 0",
      "developer",
      true,
      false,
      true,
      false,
      false
    );
  }

  /**
   * Initializes free levels that are stored locally
   * These levels are available to all users without premium access
   */
  static loadFreeLocalLevels() {}

  /**
   * Initializes tutorial levels in the manifest
   * These levels are designed to teach game mechanics to new players
   */
  static loadTutorialLevels() {}

  /**
   * Initializes premium levels that are stored locally
   * These levels require premium access to play
   */
  static loadPremiumLocalLevels() {}

  /**
   * Loads a new level header into the manifest
   * @param {string} levelId - Unique identifier for the level
   * @param {string} levelNickname - Display name for the level
   * @param {string} levelCategory - Category classification
   * @param {boolean} isDeveloperLevel - Whether this is a development level
   * @param {boolean} isTutoriallevel - Whether this is a tutorial level
   * @param {boolean} isLocalLevel - Whether level data is stored locally
   * @param {boolean} isFreeLevel - Whether level is available in free version
   * @param {boolean} isPremiumLevel - Whether level requires premium access
   */
  static loadHeader(
    levelId,
    levelNickname,
    levelCategory,
    isDeveloperLevel,
    isTutoriallevel,
    isLocalLevel,
    isFreeLevel,
    isPremiumLevel
  ) {
    if (isFreeLevel && isPremiumLevel) {
      console.log("Warning - level is both free and premium: " + levelId);
    }

    let newLevelHeader = new LevelProfileHeader(
      levelId,
      levelNickname,
      levelCategory,
      isDeveloperLevel,
      isTutoriallevel,
      isLocalLevel,
      isFreeLevel,
      isPremiumLevel
    );

    if (this.LOCAL_LEVEL_HEADERS[levelId]) {
      //to do - update what logger this uses
      console.log(
        "Level ID already exists - population overwrrite for this level failed: " +
          levelId
      );
    } else {
      this.LOCAL_LEVEL_HEADERS[levelId] = newLevelHeader;
    }
  }
}
