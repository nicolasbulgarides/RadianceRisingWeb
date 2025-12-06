class PlayerStatusTracker {
  constructor() {
    this.playerStatus = null;
  }

  /**
   * Ensure we have a tracked PlayerStatusComposite. If one already exists,
   * it is reused so experience persists across levels.
   */
  primeWithDefaultsIfMissing(defaults = {}) {
    if (this.playerStatus instanceof PlayerStatusComposite) {
      return this.playerStatus;
    }

    const {
      name = Config.DEFAULT_NAME,
      currentLevel = Config.STARTING_LEVEL,
      currentExperience = Config.STARTING_EXP,
      currentMagicLevel = Config.STARTING_MAGICPOINTS,
      maximumMagicPoints = Config.STARTING_MAGICPOINTS,
      maximumHealthPoints = Config.STARTING_HEALTH,
      baseMaxSpeed = Config.DEFAULT_MAX_SPEED,
    } = defaults;

    this.playerStatus = PlayerStatusComposite.getPlayerStatusFresh(
      name,
      currentLevel,
      currentExperience,      // correct ordering: exp first
      currentMagicLevel,
      maximumMagicPoints,
      maximumHealthPoints,
      baseMaxSpeed
    );

    return this.playerStatus;
  }

  /**
   * Attach the tracked status to a newly created player model so that
   * stats persist even when the model is recreated.
   */
  attachStatusToPlayer(playerUnit) {
    if (!playerUnit) {
      return null;
    }

    // If the tracker has no status yet, try to adopt from the player first.
    if (!(this.playerStatus instanceof PlayerStatusComposite)) {
      if (playerUnit.playerStatus instanceof PlayerStatusComposite) {
        this.playerStatus = playerUnit.playerStatus;
      } else {
        this.primeWithDefaultsIfMissing();
      }
    }

    playerUnit.playerStatus = this.playerStatus;
    return this.playerStatus;
  }

  /**
   * Add experience to the tracked status and update the UI bar.
   */
  addExperience(amount) {
    this.primeWithDefaultsIfMissing();

    const delta = Number(amount) || 0;
    if (delta === 0) {
      return this.getCurrentExperience();
    }

    const newExperienceTotal = this.playerStatus.addExperience(delta);
    this.updateExperienceUI(newExperienceTotal);
    return newExperienceTotal;
  }

  /**
   * Refresh the UI with the current tracked experience value.
   * Accepts an override when the caller already has the computed total.
   */
  updateExperienceUI(experienceOverride = null) {
    const experienceValue =
      experienceOverride != null ? experienceOverride : this.getCurrentExperience();
    const visibleSegments = Math.min(Math.max(experienceValue, 0), 24);

    const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
    const uiScene = renderSceneSwapper?.getActiveUIScene
      ? renderSceneSwapper.getActiveUIScene()
      : null;

    if (uiScene && uiScene.setExperienceBarSegments) {
      uiScene.setExperienceBarSegments(visibleSegments);
    }
  }

  getCurrentExperience() {
    if (this.playerStatus instanceof PlayerStatusComposite) {
      return this.playerStatus.currentExperience || 0;
    }
    return 0;
  }
}


