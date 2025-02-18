class AchievementPresets {
  static ACCOUNT_ACHIEVEMENTS = [];
  static ARTIFACT_ACHIEVEMENTS = [];
  static COMPETITIVE_ACHIEVEMENTS = [];
  static CONSTELLATION_ACHIEVEMENTS = [];
  static COMPLETIONIST_ACHIEVEMENTS = [];
  static ITEM_ACHIEVEMENTS = [];
  static LEVEL_ACHIEVEMENTS = [];
  static REGIONAL_ACHIEVEMENTS = [];
  static SOCIAL_ACHIEVEMENTS = [];
  static SPECIAL_ACHIEVEMENTS_OTHERS = [];
  static SPECIAL_AREA_ACHIEVEMENTS = [];
  static SPECIAL_EVENT_ACHIEVEMENTS = [];
  static SPELL_ACHIEVEMENTS = [];
  static STAT_ACHIEVEMENTS = [];

  constructor() {
    this.populateAchievementPresets();
  }

  populateAchievementPresets() {
    this.populateAccountAchievements();
    this.populateArtifactAchievements();
    this.populateCompetitiveAchievements();
    this.populateConstellationAchievements();
    this.populateCompletionistAchievements();
    this.populateItemAchievements();
    this.populateLevelAchievements();
    this.populateRegionalAchievements();
    this.populateSocialAchievements();
    this.populateSpecialAchievementsOthers();
    this.populateSpecialAreaAchievements();
    this.populateSpecialEventAchievements();
    this.populateSpellAchievements();
    this.populateStatAchievements();
  }

  getAchievementsForCategory(categoryName) {
    switch (categoryName) {
      case "AccountAchievements":
        return this.ACCOUNT_ACHIEVEMENTS;
      case "ArtifactAchievements":
        return this.ARTIFACT_ACHIEVEMENTS;
      case "CompetitiveAchievements":
        return this.COMPETITIVE_ACHIEVEMENTS;
      case "ConstellationAchievements":
        return this.CONSTELLATION_ACHIEVEMENTS;
      case "CompletionistAchievements":
        return this.COMPLETIONIST_ACHIEVEMENTS;
      case "ItemAchievements":
        return this.ITEM_ACHIEVEMENTS;
      case "LevelAchievements":
        return this.LEVEL_ACHIEVEMENTS;
      case "RegionalAchievements":
        return this.REGIONAL_ACHIEVEMENTS;
      case "SocialAchievements":
        return this.SOCIAL_ACHIEVEMENTS;
      case "SpecialAchievementsOthers":
        return this.SPECIAL_ACHIEVEMENTS_OTHERS;
      case "SpecialAreaAchievements":
        return this.SPECIAL_AREA_ACHIEVEMENTS;
      case "SpecialEventAchievements":
        return this.SPECIAL_EVENT_ACHIEVEMENTS;
      case "SpellAchievements":
        return this.SPELL_ACHIEVEMENTS;
      case "StatAchievements":
        return this.STAT_ACHIEVEMENTS;
      default:
        let placeholder = this.getSinglePlaceholderAchievement();
        let placeholderArray = [placeholder];
        return placeholderArray;
    }
  }

  getSinglePlaceholderAchievement() {
    let placeholder = new Achievement(
      "Placeholder Achievement",
      -1,
      false,
      "placeholderGraphicNickname",
      "PlaceholderCategory",
      "This is a placeholder achievement",
      [],
      0,
      0
    );
  }

  populateItemAchievements() {
    const itemAchievements = new ItemAchievements("ItemAchievements");
    this.ITEM_ACHIEVEMENTS = itemAchievements.populateAllAchievements();
  }

  populateSpecialAchievementsOthers() {
    const specialAchievementsOthers = new SpecialAchievementsOthers(
      "SpecialAchievementsOthers"
    );
    this.SPECIAL_ACHIEVEMENTS_OTHERS =
      specialAchievementsOthers.populateAllAchievements();
  }

  populateCompetitiveAchievements() {
    const competitiveAchievements = new CompetitiveAchievements(
      "CompetitiveAchievements"
    );
    this.COMPETITIVE_ACHIEVEMENTS =
      competitiveAchievements.populateAllAchievements();
  }

  populateCompletionistAchievements() {
    const completionistAchievements = new CompletionistAchievements(
      "CompletionistAchievements"
    );
    this.COMPLETIONIST_ACHIEVEMENTS =
      completionistAchievements.populateAllAchievements();
  }

  populateSocialAchievements() {
    const socialAchievements = new SocialAchievements("SocialAchievements");
    this.SOCIAL_ACHIEVEMENTS = socialAchievements.populateAllAchievements();
  }

  populateRegionalAchievements() {
    const regionalAchievements = new RegionalAchievements(
      "RegionalAchievements"
    );
    this.REGIONAL_ACHIEVEMENTS = regionalAchievements.populateAllAchievements();
  }

  populateStatAchievements() {
    const statAchievements = new StatAchievements("StatAchievements");
    this.STAT_ACHIEVEMENTS = statAchievements.populateAllAchievements();
  }

  populateAccountAchievements() {
    const accountAchievements = new AccountAchievements("AccountAchievements");
    this.ACCOUNT_ACHIEVEMENTS = accountAchievements.populateAllAchievements();
  }

  populateLevelAchievements() {
    const levelAchievements = new LevelAchievements("LevelAchievements");
    this.LEVEL_ACHIEVEMENTS = levelAchievements.populateAllAchievements();
  }

  populateConstellationAchievements() {
    const constellationAchievements = new ConstellationAchievements(
      "ConstellationAchievements"
    );
    this.CONSTELLATION_ACHIEVEMENTS =
      constellationAchievements.populateAllAchievements();
  }

  populateSpellAchievements() {
    const spellAchievements = new SpellAchievements("SpellAchievements");
    this.SPELL_ACHIEVEMENTS = spellAchievements.populateAllAchievements();
  }

  populateArtifactAchievements() {
    const artifactAchievements = new ArtifactAchievements(
      "ArtifactAchievements"
    );
    this.ARTIFACT_ACHIEVEMENTS = artifactAchievements.populateAllAchievements();
  }

  populateSpecialAreaAchievements() {
    const specialAreaAchievements = new SpecialAreaAchievements(
      "SpecialAreaAchievements"
    );
    this.SPECIAL_AREA_ACHIEVEMENTS =
      specialAreaAchievements.populateAllAchievements();
  }

  populateSpecialEventAchievements() {
    const specialEventAchievements = new SpecialEventAchievements(
      "SpecialEventAchievements"
    );
    this.SPECIAL_EVENT_ACHIEVEMENTS =
      specialEventAchievements.populateAllAchievements();
  }

  populateSpecialAchievementsOther() {
    const specialAchievementsOther = new SpecialAchievementsOther(
      "SpecialAchievementsOther"
    );
    this.SPECIAL_ACHIEVEMENTS_OTHER =
      specialAchievementsOther.populateAllAchievements();
  }
}
