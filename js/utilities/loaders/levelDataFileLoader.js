/**
 * LevelDataFileLoader handles loading level data from either local or remote sources.
 * It works in conjunction with LevelManifest and follows similar patterns to AssetManifest.
 */
class LevelDataFileLoader {
  // Base URLs for level data
  static baseWorkerUrl =
    "https://radianceloader.nicolasbulgarides.workers.dev/levels/";
  static baseLocalUrl = "./locallevels/";

  /**
   * Retrieves level data based on levelId and environment configuration.
   * @param {string} levelId - The unique identifier for the level
   * @returns {Promise<Object>} The level data object
   */
  static async retrieveLevelDataByLevelId(levelId) {
    const levelHeader = LevelManifest.getLevelHeaderByLevelId(levelId);

    if (!levelHeader) {
      console.error(`Level header not found for levelId: ${levelId}`);
      throw new Error(`Level header not found for levelId: ${levelId}`);
    }

    // Determine if we should load locally based on config or level type
    const shouldLoadLocally = this.shouldLoadFromLocalSource(levelHeader);

    try {
      const levelData = await this.fetchLevelData(levelId, shouldLoadLocally);
      return this.processLevelData(levelData, levelHeader);
    } catch (error) {
      console.error(`Failed to load level data for levelId: ${levelId}`, error);
      throw error;
    }
  }

  /**
   * Determines if level should be loaded from local source.
   * @param {LevelProfileHeader} levelHeader - The level header object
   * @returns {boolean} True if should load locally
   */
  static shouldLoadFromLocalSource(levelHeader) {
    return Config.RUN_LOCALLY_DETERMINED || levelHeader.isLocalLevel;
  }

  /**
   * Fetches level data from appropriate source.
   * @param {string} levelId - The level identifier
   * @param {boolean} loadLocally - Whether to load from local source
   * @returns {Promise<Object>} The raw level data
   */
  static async fetchLevelData(levelId, loadLocally) {
    const baseUrl = loadLocally ? this.baseLocalUrl : this.baseWorkerUrl;
    const url = `${baseUrl}${levelId}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch level data from ${url}`, error);
      throw error;
    }
  }

  /**
   * Processes and validates the loaded level data.
   * @param {Object} levelData - The raw level data
   * @param {LevelProfileHeader} levelHeader - The level header
   * @returns {LevelDataComposite} The processed level data as a composite object
   */
  static processLevelData(levelData, levelHeader) {
    // Validate level data matches header
    //to do - swap out what level logger this uses
    if (levelData.header?.levelId !== levelHeader.levelId) {
      console.log(
        `Level data mismatch: expected ${levelHeader.levelId}, got ${levelData.header?.levelId}`
      );
    }
    //to do - swap out what level logger this uses

    // Validate required sections exist
    if (!levelData.header || !levelData.gameplayTraits || !levelData.rewards) {
      console.log(
        "Level data is missing required sections: header, gameplayTraits, or rewards"
      );
    }

    const headerData = this.wrapJsonIntoLevelHeaderData(levelData);
    const gameplayTraits = this.wrapJsonIntoGameplayTraits(levelData);
    const rewardBundle = this.wrapJsonIntoLevelCompletionRewards(levelData);

    // Create and return the LevelDataComposite
    return new LevelDataComposite(headerData, gameplayTraits, rewardBundle);
  }

  static wrapJsonIntoLevelCompletionRewards(levelDataJson) {
    const rewardBundle = new RewardBundleComposite(
      levelDataJson.levelCompletionRewardBundle.rewardBundleHeader,
      levelDataJson.levelCompletionRewardBundle.rewardBasic,
      levelDataJson.levelCompletionRewardBundle.rewardUnlocks,
      levelDataJson.levelCompletionRewardBundle.rewardSpecial
    );

    return rewardBundle;
  }
  static wrapJsonIntoLevelHeaderData(levelDataJson) {
    // Create LevelHeaderData instance
    const headerData = new LevelHeaderData(
      levelDataJson.levelHeaderData.worldId,
      levelDataJson.levelHeaderData.worldNickname,
      levelDataJson.levelHeaderData.levelId,
      levelDataJson.levelHeaderData.levelNickname,
      levelDataJson.levelHeaderData.description,
      levelDataJson.levelHeaderData.unlockRequirements,
      levelDataJson.levelHeaderData.complexityLevel,
      levelDataJson.levelHeaderData.backgroundMusic
    );
    return headerData;
  }
  static wrapJsonIntoGameplayTraits(levelDataJson) {
    // Create LevelGameplayTraitsData instance
    const gameplayTraits = new LevelGameplayTraitsData(
      levelDataJson.levelGameplayTraitsData.victoryConditions,
      levelDataJson.levelGameplayTraitsData.allFeaturedObjects,
      levelDataJson.levelGameplayTraitsData.allLevelTriggers,
      levelDataJson.levelGameplayTraitsData.allLevelOccurrences,
      levelDataJson.levelGameplayTraitsData.lightingPresets,
      levelDataJson.levelGameplayTraitsData.specialUIElements,
      levelDataJson.levelGameplayTraitsData.specialCameraEffects
    );
    return gameplayTraits;
  }
}
