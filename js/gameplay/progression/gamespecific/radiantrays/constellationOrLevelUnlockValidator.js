class ConstellationOrLevelUnlockValidator extends AreaUnlockValidator {
  static validateConstellationOrLevelUnlock(
    constellationOrLevel,
    constellationOrLevelName,
    playerStatusComposite,
    playerCurrentLevelProgress
  ) {
    let unlockValidation = false;
    if (constellationOrLevel === "constellation") {
      unlockValidation = this.validateExistingConstellationUnlock(
        constellationOrLevelName,
        playerStatusComposite,
        playerCurrentLevelProgress
      );
    } else if (constellationOrLevel === "level") {
      unlockValidation = this.validateExistingLevelUnlock(
        constellationOrLevelName,
        playerStatusComposite,
        playerCurrentLevelProgress
      );
    }

    return unlockValidation;
  }

  possiblyAddNewConstellationOrLevelUnlock(
    constellationOrLevel,
    constellationOrLevelName,
    constellationOrLevelUnlockJustification
  ) {
    if (constellationOrLevel === "constellation") {
      this.possiblyAddNewConstellationUnlock(
        constellationOrLevelName,
        constellationOrLevelUnlockJustification
      );
    } else if (constellationOrLevel === "level") {
      this.possiblyAddNewLevelUnlock(
        constellationOrLevelName,
        constellationOrLevelUnlockJustification
      );
    }
  }

  processSucessfulConstellationOrLevelUnlock(
    constellationOrLevel,
    constellationOrLevelName
  ) {
    let gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

    if (constellationOrLevel === "constellation") {
      gameplayManager.processUnlockedConstellation(constellationOrLevelName);
    } else if (constellationOrLevel === "level") {
      gameplayManager.processUnlockedLevel(constellationOrLevelName);
    }
  }

  possiblyAddNewConstellationUnlock(
    constellationName,
    constellationOrLevelUnlockJustification
  ) {
    let validConstellationUnlock = null;

    validConstellationUnlock = this.validateNewConstellationUnlock(
      constellationName,
      constellationOrLevelUnlockJustification
    );

    if (Config.UNLOCK_AREA_VALIDATION_OVERRIDE) {
      validConstellationUnlock = true;
    }
    if (validConstellationUnlock) {
      this.processSucessfulConstellationOrLevelUnlock(
        "constellation",
        constellationName
      );
    }
  }

  possiblyAddNewLevelUnlock(
    levelName,
    constellationOrLevelUnlockJustification
  ) {
    let validLevelUnlock = null;

    validLevelUnlock = this.validateNewLevelUnlock(
      levelName,
      constellationOrLevelUnlockJustification
    );

    if (Config.UNLOCK_AREA_VALIDATION_OVERRIDE) {
      validLevelUnlock = true;
    }

    if (validLevelUnlock) {
      this.processSucessfulConstellationOrLevelUnlock("level", levelName);
    }
  }

  validateNewConstellationUnlock(
    constellationName,
    constellationOrLevelUnlockJustification
  ) {
    return false;
  }
  validateNewLevelUnlock(levelName, constellationOrLevelUnlockJustification) {
    return false;
  }

  static validateExistingConstellationUnlock(
    constellationName,

    playerStatusComposite,
    playerCurrentLevelProgress
  ) {}

  static validateExistingLevelUnlock(
    levelName,
    playerStatusComposite,
    playerCurrentLevelProgress
  ) {}
}
