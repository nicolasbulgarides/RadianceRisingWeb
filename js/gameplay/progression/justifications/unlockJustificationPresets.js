class UnlockJustificationPresets {
  static UNLOCK_JUSTIFICATION_BASELINE_PRESETS = new Set([
    "invalid",
    "ability",
    "artifact",
    "constellation",
    "level",
    "specialArea",
    "gamemode",
  ]);

  static UNLOCK_JUSTIFICATION_STREAMED_PRESETS = new Set();
  static UNLOCK_JUSTIFICATION_PRESET_VALUES_ALL = new Set();

  getUnlockJustificationByPreset(
    unlockCategory,
    unlockJustificationPresetName
  ) {
    switch (unlockCatergory) {
    }
  }

  static addStreamedUnlockJustificationPresets(
    specialStreamedUnlockPresets = []
  ) {
    for (const unlockJustificationPresetName of specialStreamedUnlockPresets) {
      if (unlockJustificationPresetName instanceof UnlockJustificationPreset) {
      }
    }
  }

  addUnlockJustificationPreset(unlockJustificationPresetName) {
    if (
      !this.UNLOCK_JUSTIFICATION_PRESETS.has(unlockJustificationPresetName) &&
      UNLOCK_JUSTIFICATION_STREAMED_PRESETS.has(unlockJustificationPresetName)
    ) {
    }
  }

  static populateUnlockJustificationPresets() {}

  createOriginalUnlockJustification(
    justificationName = "-placeholder-justification-name-",
    justificationCategory = "-placeholder-justification-category",
    premiumStatus = false,
    minimumLevel = 0,
    minimumMagic = 0,
    specificLevel = -1,
    specificConstellation = "-placeholder-specific-constellation-",
    specificSpecialArea = "-placeholder-specific-special-area-",
    specificGamemode = "-placeholder-specific-gamemode-",
    specificAchievement = "-placeholder-specific-achievement-",
    specificGroupofAchievements = "-placeholder-specific-group-of-achievements-"
  ) {
    return new UnlockJustification(
      bypassValidation,
      justificationName,
      justificationCategory,
      premiumStatus,
      minimumLevel,
      minimumMagic,
      specificLevel,
      specificConstellation,
      specificSpecialArea,
      specificGamemode,
      specificAchievement,
      specificGroupofAchievements
    );
  }
}
UnlockJustificationPresets.populateUnlockJustificationPresets();
