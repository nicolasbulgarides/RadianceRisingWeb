class SoundAssetManifest {
  static baseUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/";

  // Sound asset manifest data with all volumes set to 1.0
  static sounds = {
    artifactSelect: { volume: 1.0 },
    artifactUsage: { volume: 1.0 },
    characterFailure: { volume: 1.0 },
    characterLevelUp: { volume: 1.0 },
    checkpointReached: { volume: 1.0 },
    constellationLevelGroupCompleted: { volume: 1.0 },
    constellationLevelGroupCompletedPerfect: { volume: 1.0 },
    darkThreadRevealed: { volume: 1.0 },
    divineLaserAlignment1: { volume: 1.0 },
    endOfLevel: { volume: 1.0 },
    endOfLevelGreat: { volume: 1.0 },
    endOfLevelPerfect: { volume: 1.0 },
    experienceGainNotLoud: { volume: 1.0 },
    fireCast1: { volume: 1.0 },
    gameExitPreLouder: { volume: 1.0 },
    healthRestoration: { volume: 1.0 },
    lanternActivate: { volume: 1.0 },
    levelOpenWater: { volume: 1.0 },
    magicSplashWater: { volume: 1.0 },
    mapWorldSelect: { volume: 1.0 },
    mapWorldZoomEntry: { volume: 1.0 },
    multiplayerJoin: { volume: 1.0 },
    menuMovement: { volume: 1.0 },
    menuValueChange: { volume: 1.0 },
    objectPlacementConfirm: { volume: 1.0 },
    objectPlacementSelect: { volume: 1.0 },
    ominiousPulse1: { volume: 1.0 },
    puzzleCompleted: { volume: 1.0 },
    puzzleBlockPlacementFixed: { volume: 1.0 },
    radianceGameStart: { volume: 1.0 },
    restartOfLevel: { volume: 1.0 },
    rotation: { volume: 1.0 },
    secretReveal: { volume: 1.0 },
    selectBackMenu: { volume: 1.0 },
    selectMenu: { volume: 1.0 },
    startOfLevel: { volume: 1.0 },
    starLevelSelection: { volume: 1.0 },
    streakBonusCombo: { volume: 1.0 },
    streakBonusStart: { volume: 1.0 },
    streakBonusSuperCombo: { volume: 1.0 },
    streakBonusUltimateCombo: { volume: 1.0 },
    tipAttentionGetter: { volume: 1.0 },
    treasureOpenPreRevision: { volume: 1.0 },
    windPush: { volume: 1.0 },
    windSwitchClose: { volume: 1.0 },
    windSwitchOpen: { volume: 1.0 },
  };

  /**
   * Retrieves the URL for a given sound effect name.
   * @param {string} soundName - The name of the sound effect (without .wav).
   * @returns {string} - The full URL of the sound effect.
   */
  static getSoundUrl(soundName) {
    return `${this.baseUrl}${soundName}.wav`;
  }

  /**
   * Retrieves the volume for a given sound effect name.
   * @param {string} soundName - The name of the sound effect.
   * @returns {number} - The volume of the sound effect, or 1.0 if not found.
   */
  static getSoundVolume(soundName) {
    return this.sounds[soundName]?.volume || 1.0;
  }
}
