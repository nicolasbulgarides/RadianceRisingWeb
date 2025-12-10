/**
 * SoundAssetManifest manages sound effect assets, including their URLs and volume settings.
 * It supports loading sounds from a local base URL or a remote worker URL.
 */
class SoundAssetManifest {
  static baseUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/";

  static workerUrl = "https://radianceloader.nicolasbulgarides.workers.dev/";

  // Sound asset manifest data with all volumes set to 1.0
  static allSounds = {
    achivementUnlocked: { volume: 1.0 },
    artifactFullyRechargedDing: { volume: 1.0 },
    artifactSelect: { volume: 1.0 },
    artifactUsage: { volume: 1.0 },
    characterFailure: { volume: 1.0 },
    characterLevelUp: { volume: 1.0 },
    checkpointReached: { volume: 1.0 },
    constellationLevelGroupCompleted: { volume: 1.0 },
    constellationLevelGroupCompletedPerfect: { volume: 1.0 },
    darkSphereItemDestruction: { volume: 1.0 },
    darkSphereScaryFloorDestructions: { volume: 1.0 },
    darkThreadRevealed: { volume: 1.0 },
    directionalPadTap: { volume: 1.0 },
    divineLaserAlignment1: { volume: 1.0 },
    endOfLevel: { volume: 1.0 },
    endOfLevelGreat: { volume: 1.0 },
    endOfLevelPerfect: { volume: 1.0 },
    experienceGain: { volume: 1.0 },
    experienceGainNotLoud: { volume: 1.0 },
    fireCast1: { volume: 1.0 },
    gameExitLouder: { volume: 1.0 },
    gameExitPreLouder: { volume: 1.0 },
    healthLowCriticalDireLoop: { volume: 1.0 },
    healthLowMediumLoop: { volume: 1.0 },
    healthRestoration: { volume: 1.0 },
    invalidUserActionError: { volume: 1.0 },
    lanternActivate: { volume: 1.0 },
    levelOpenWater: { volume: 1.0 },
    leverCrankMagicActivate: { volume: 1.0 },
    leverCrankMagicDeactivate: { volume: 1.0 },
    magicAbilityCycleScroll: { volume: 1.0 },
    magicKeyDiscovered: { volume: 1.0 },
    magicKeyUsed: { volume: 1.0 },
    magicPartiallyRefilledBeep: { volume: 1.0 },
    magicalLoreInformationObtained: { volume: 1.0 },
    magicalSpellCastEarthCrunch: { volume: 1.0 },
    magicalSpellCastNeutral: { volume: 1.0 },
    magicalSpellCastWaterSplash: { volume: 1.0 },
    magicSplashWater: { volume: 1.0 },
    mapWorldSelect: { volume: 1.0 },
    mapWorldZoomEntry: { volume: 1.0 },
    menuMovement: { volume: 1.0 },
    menuValueChange: { volume: 1.0 },
    multiplayerJoin: { volume: 1.0 },
    mysticalEventCompletedCelebration: { volume: 1.0 },
    mysticBarrierAccessDenied: { volume: 1.0 },
    objectPlacementConfirm: { volume: 1.0 },
    objectPlacementSelect: { volume: 1.0 },
    ominiousPulse1: { volume: 1.0 },
    puzzleBlockPlacementFixed: { volume: 1.0 },
    puzzleCompleted: { volume: 1.0 },
    questAssigned: { volume: 1.0 },
    questCompletedBonus: { volume: 1.0 },
    questLogJournalClosed: { volume: 1.0 },
    radianceGameStart: { volume: 1.0 },
    restartOfLevel: { volume: 1.0 },
    returnToHomeDazzleFade: { volume: 1.0 },
    rotation: { volume: 1.0 },
    secretReveal: { volume: 1.0 },
    selectBackMenu: { volume: 1.0 },
    selectMenu: { volume: 1.0 },
    startOfLevel: { volume: 1.0 },
    starLevelSelection: { volume: 1.0 },
    statueArisen: { volume: 1.0 },
    streakBonusCombo: { volume: 1.0 },
    streakBonusStart: { volume: 1.0 },
    streakBonusSuperCombo: { volume: 1.0 },
    streakBonusUltimateCombo: { volume: 1.0 },
    timeChallengeFailure: { volume: 1.0 },
    timeChallengeStart: { volume: 1.0 },
    tipAttentionGetter: { volume: 1.0 },
    tipAttentionGetterHint: { volume: 1.0 },
    tipAttentionGetterMysticalNewEvent: { volume: 1.0 },
    treasureOpen: { volume: 1.0 },
    treasureOpenPreRevision: { volume: 1.0 },
    windPush: { volume: 1.0 },
    windSwitchClose: { volume: 1.0 },
    windSwitchOpen: { volume: 1.0 },
    achievementStreakCompleted: { volume: 1.0 },
    artifactMustRechargeBleep: { volume: 1.0 },
    heavyStomp: { volume: 1.0 },
    magicalSpellCastWaterSplash: { volume: 1.0 },
    magicalSpellCastWindWhoosh: { volume: 1.0 },
    magicalSpellNewSpellUnlocked: { volume: 1.0 },
    magicBridgeRepaired: { volume: 1.0 },
    magicCameraShutter: { volume: 1.0 },
    magicEnergyShieldActivate: { volume: 1.0 },
    magicEnergyShieldBurst: { volume: 1.0 },
    magicFullyRestoredFillFlutter: { volume: 1.0 },
    magicLaunchChargeUp: { volume: 1.0 },
    magicLaunchFullChargeOscillation: { volume: 1.0 },
    magicLaunchNormalSpeed: { volume: 1.0 },
    magicLaunchNormalSpeed_0: { volume: 1.0 },
    magicLaunchNormalSpeed_1: { volume: 1.0 },
    magicLaunchTravelLoop: { volume: 1.0 },
    magicLaunchTravelLoop_0: { volume: 1.0 },
    magicLaunchTravelLoop_1: { volume: 1.0 },
    magicWallBreak: { volume: 1.0 },
    mysticBarrierDissipateDissolve: { volume: 1.0 },
    outOfMagicEnergyBleep: { volume: 1.0 },
    questCompleted: { volume: 1.0 },
    questLogJournalOpened: { volume: 1.0 },
    returnToHomeDazzleEntry: { volume: 1.0 },
    stardustAbsorptionSizzle: { volume: 1.0 },
    teleportFizzleEnergizeDissolve: { volume: 1.0 },
    timeChallengeSuccess: { volume: 1.0 },
    tipAttentionGetterArtifact: { volume: 1.0 },
    tipAttentionGetterMagic: { volume: 1.0 },
  };

  /**
   * Retrieves the URL for a given sound effect name.
   * Depending on the environment, it loads the sound from either the base URL or the worker URL.
   * @param {string} soundName - The name of the sound effect (without .wav).
   * @returns {string} - The full URL of the sound effect.
   */
  static getSoundUrl(soundName) {
    if (Config.RUN_LOCALLY_DETERMINED) {
      return `${this.baseUrl}${soundName}.wav`;
    } else {
      return `${this.workerUrl}${soundName}.wav`;
    }
  }

  /**
   * Retrieves the volume for a given sound effect.
   * @param {string} soundName - The name of the sound effect.
   * @returns {number} - The volume of the sound effect, or 1.0 if not found.
   */
  static getSoundVolume(soundName) {
    return this.allSounds[soundName]?.volume || 1.0;
  }
}
