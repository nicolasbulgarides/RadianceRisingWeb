class CheatPresets {
  static CHEAT_PRESET_VALUES_ALL = new Set([
    "nocheatdetected",
    "multiplecheats",
    "premiumbypass",
    "accountagebypass",
    "minlevelbypass",
    "minmagiclevelbypass",
    "minimumhealthpointsbypass",
    "minimummagicpointsbypass",
    "artifactposessionbypass",
    "constellationunlockbypass",
    "levelunlockbypass",
    "specialareabypass",
    "gamemodebypass",
    "achievementbypass",
    "groupofachievementbypass",
  ]);

  static analyzeForSpecificCheat(
    playerCompositeStatus,
    unlockJustificationToAudit,
    cheatCategory
  ) {
    let detectedCheats = [];
    this.cheatAuditRouterAndResultReporter(
      playerCompositeStatus,
      unlockJustificationToAudit,
      cheatCategory,
      this.getCheatFunctionByCategoryId(cheatCategory),
      detectedCheats
    );

    this.convertDetectedCheatsToCheatStatus(detectedCheats);
    return detectedCheats;
  }
  static analyzeForAnyDetectedCheat(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    let detectedCheats = [];

    for (let cheatCategory of this.CHEAT_PRESET_VALUES_ALL) {
      if (this.CHEAT_PRESET_VALUES_ALL.has(cheatCategory)) {
        this.cheatAuditRouterAndResultReporter(
          playerCompositeStatus,
          unlockJustificationToAudit,
          cheatCategory,
          detectedCheats
        );
      }
    }

    return detectedCheats;
  }

  static convertDetectedCheatsToCheatStatus(detectedCheats) {
    if (detectedCheats.length == 1) {
      return "cheatdetected";
    }
    if (detectedCheats.length > 1) {
      return "multiplecheatsdetected";
    }
    return "nocheatdetected";
  }

  static getCheatFunctionByCategoryId(cheatCategoryId) {
    switch (cheatCategoryId) {
      case "premiumbypass":
        return this.auditPremiumBypass;
      case "accountagebypass":
        return this.auditAccountAgeBypass;
      case "minlevelbypass":
        return this.auditMinLevelBypass;
      case "minmagicbypass":
        return this.auditMinMagicBypass;
      case "minimumhealthpointsbypass":
        return this.auditMinimumHealthPointsBypass;
      case "minimummagicpointsbypass":
        return this.auditMinimumMagicPointsBypass;
      case "artifactposessionbypass":
        return this.auditArtifactPosessionBypass;
      case "constellationunlockbypass":
        return this.auditConstellationUnlockBypass;
      case "levelunlockbypass":
        return this.auditLevelUnlockBypass;
      case "specialareabypass":
        return this.auditSpecialAreaBypass;
      case "gamemodebypass":
        return this.auditGameModeBypass;
      case "achievementbypass":
        return this.auditAchievementBypass;
      case "groupofachievementbypass":
        return this.auditGroupOfAchievementBypass;
      default:
        return "nocheatdetected";
    }
  }

  static blankAuditFunction(playerCompositeStatus, unlockJustificationToAudit) {
    return false;
  }

  static auditMinimumHealthPointsBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    if (
      playerCompositeStatus.baseHealthPoints <
      unlockJustificationToAudit.minimumHealthPoints
    ) {
      return true;
    }

    return false;
  }

  static auditMinimumMagicPointsBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    if (
      playerCompositeStatus.baseMagicPoints <
      unlockJustificationToAudit.minimumMagicPoints
    ) {
      return true;
    }
    return false;
  }

  static auditPremiumBypass(playerCompositeStatus, unlockJustificationToAudit) {
    if (
      !playerCompositeStatus.isPremium &&
      unlockJustificationToAudit.premiumStatus
    ) {
      return true;
    }
    return false;
  }

  static auditAccountAgeBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditMinLevelBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditMinMagicBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditArtifactPosessionBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditConstellationUnlockBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditLevelUnlockBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditSpecialAreaBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditGameModeBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditAchievementBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static auditGroupOfAchievementBypass(
    playerCompositeStatus,
    unlockJustificationToAudit
  ) {
    return false;
  }

  static cheatAuditRouterAndResultReporter(
    playerCompositeStatus,
    unlockJustificationToAudit,
    cheatCategory,
    relevantAuditFunction,
    detectionResultsStorage
  ) {
    let specificAuditResult = relevantAuditFunction(
      playerCompositeStatus,
      unlockJustificationToAudit
    );

    if (specificAuditResult) {
      detectionResultsStorage.push(cheatCategory);
    }
  }
}
