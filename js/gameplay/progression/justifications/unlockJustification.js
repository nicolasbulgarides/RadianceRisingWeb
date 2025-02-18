class UnlockJustification {
  static justificationPresets =
    UnlockJustificationPresets.UNLOCK_JUSTIFICATION_PRESETS;
  constructor(
    justificationName = "-placeholder-justification-name-",
    justificationCategory = "-placeholder-justification-category",
    premiumRequirementsComposite,
    basicRequirementsComposite,
    specialRequirementsComposite,
    areaRequirementsComposite,
    achievementRequirementsComposite,

    minimumLevel = 0,
    minimumMagic = 0,
    specificLevel = -1,
    specificConstellation = "-placeholder-specific-constellation-",

    specificSpecialArea = "-placeholder-specific-special-area-",
    specificGamemode = "-placeholder-specific-gamemode-",
    specificAchievement = "-placeholder-specific-achievement-",
    specificGroupofAchievements = "-placeholder-specific-group-of-achievements-"
  ) {
    this.justificationName = justificationName;
    this.justificationCategory = justificationCategory;
    this.premiumRequirementsComposite = premiumRequirementsComposite;
    this.basicRequirementsComposite = basicRequirementsComposite;
    this.specialRequirementsComposite = specialRequirementsComposite;
    this.areaRequirementsComposite = areaRequirementsComposite;
    this.achievementRequirementsComposite = achievementRequirementsComposite;

    this.minimumLevel = minimumLevel;
    this.minimumMagic = minimumMagic;
    this.specificLevel = specificLevel;
    this.specificConstellation = specificConstellation;
    this.specificSpecialArea = specificSpecialArea;
    this.specificGamemode = specificGamemode;
    this.specificAchievement = specificAchievement;
    this.specificGroupofAchievements = specificGroupofAchievements;
  }
  static createAndValidateUnlockJustification() {}
}
