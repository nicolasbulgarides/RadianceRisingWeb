// Global flag to disable player status tracker logging (set to false to enable logging)
const PLAYER_STATUS_TRACKER_LOGGING_ENABLED = false;

// Helper function for conditional player status tracker logging
function playerStatusTrackerLog(...args) {
  if (PLAYER_STATUS_TRACKER_LOGGING_ENABLED) {
    console.log(...args);
  }
}

class PlayerStatusTracker {
  constructor() {
    this.playerStatus = null;
    this.isDamageProcessing = false; // Prevent race conditions in damage
    this.loadExperienceFromStorage();
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
      currentLevel = this.loadLevelFromStorage(),
      currentExperience = this.savedExperience,
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
    this.saveExperienceToStorage(); // Save to localStorage
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

  /**
   * Damage the player by reducing health points
   * CRITICAL: Uses synchronous locking to prevent race conditions when multiple damage sources hit in same frame
   * @param {number} amount - Amount of damage to deal
   * @returns {number} Current health after damage
   */
  damagePlayer(amount) {
    this.primeWithDefaultsIfMissing();

    // Check if already resetting to prevent duplicate death calls
    const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
    if (levelResetHandler && levelResetHandler.isResetting) {
      console.log("[DAMAGE] Ignoring damage - already resetting");
      return this.getCurrentHealth();
    }

    // CRITICAL: Wait if damage is already being processed (prevents race conditions)
    if (this.isDamageProcessing) {
      console.log("[DAMAGE] Damage already processing, queueing this damage");
      // Queue this damage to process after current damage completes
      setTimeout(() => this.damagePlayer(amount), 10);
      return this.getCurrentHealth();
    }

    // Lock damage processing
    this.isDamageProcessing = true;

    try {
      const delta = Number(amount) || 0;
      if (delta === 0) {
        return this.getCurrentHealth();
      }

      // Read current health
      const currentHealth = this.getCurrentHealth();

      // Calculate new health
      const newHealth = Math.max(0, currentHealth - delta);

      // Write new health
      this.setCurrentHealth(newHealth);

      playerStatusTrackerLog(`[DAMAGE] Health: ${currentHealth} → ${newHealth} (delta: -${delta})`);

      // Update UI
      this.updateHealthUI();

      // Check if player has died (and not already resetting)
      if (newHealth === 0 && (!levelResetHandler || !levelResetHandler.isResetting)) {
        this.handlePlayerDeath();
      }

      return newHealth;
    } finally {
      // Unlock damage processing (unless we're resetting - keep locked during reset)
      if (!levelResetHandler || !levelResetHandler.isResetting) {
        this.isDamageProcessing = false;
      }
    }
  }

  /**
   * Handles player death sequence
   */
  handlePlayerDeath() {
    // Trigger the death handler
    const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
    if (levelResetHandler && levelResetHandler.handlePlayerDeath) {
      levelResetHandler.handlePlayerDeath();
    } else {
      console.error("[DEATH] LevelResetHandler not found!");
    }
  }

  /**
   * Heal the player by restoring health points
   * @param {number} amount - Amount of health to restore
   * @returns {number} Current health after healing
   */
  healPlayer(amount) {
    this.primeWithDefaultsIfMissing();

    const delta = Number(amount) || 0;
    if (delta === 0) {
      return this.getCurrentHealth();
    }

    // Increase health (ensure it doesn't exceed maximum)
    const currentHealth = this.getCurrentHealth();
    const maxHealth = this.getMaxHealth();
    const newHealth = Math.min(maxHealth, currentHealth + delta);
    this.setCurrentHealth(newHealth);

    // Update UI
    this.updateHealthUI();

    return newHealth;
  }

  /**
   * Update the health UI (HeartSocketBar)
   */
  updateHealthUI() {
    const currentHealth = this.getCurrentHealth();

    const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
    const uiScene = renderSceneSwapper?.getActiveUIScene
      ? renderSceneSwapper.getActiveUIScene()
      : null;

    if (uiScene && uiScene.setHeartBarHearts) {
      uiScene.setHeartBarHearts(currentHealth);
    }
  }

  /**
   * Get current health points
   * @returns {number} Current health
   */
  getCurrentHealth() {
    if (this.playerStatus instanceof PlayerStatusComposite) {
      return this.playerStatus.currentHealthPoints || 0;
    }
    return 0;
  }

  /**
   * Get maximum health points
   * @returns {number} Maximum health
   */
  getMaxHealth() {
    if (this.playerStatus instanceof PlayerStatusComposite) {
      return this.playerStatus.maximumHealthPoints || 3;
    }
    return 3;
  }

  /**
   * Set current health points
   * @param {number} health - New health value
   */
  setCurrentHealth(health) {
    this.primeWithDefaultsIfMissing();
    if (this.playerStatus instanceof PlayerStatusComposite) {
      this.playerStatus.currentHealthPoints = Math.max(0, Math.min(this.getMaxHealth(), health));
    }
  }

  /**
   * Load experience from localStorage
   */
  loadExperienceFromStorage() {
    try {
      const stored = localStorage.getItem('radianceRising_playerExperience');
      this.savedExperience = stored ? parseInt(stored, 10) : Config.STARTING_EXP;
    } catch (error) {
      console.warn("[PlayerStatusTracker] Failed to load experience from storage:", error);
      this.savedExperience = Config.STARTING_EXP;
    }
  }

  /**
   * Save current experience to localStorage.
   * Debounced via microtask: rapid consecutive calls coalesce into one write.
   */
  saveExperienceToStorage() {
    if (this._savePending) return;
    this._savePending = true;
    Promise.resolve().then(() => {
      this._savePending = false;
      try {
        if (this.playerStatus) {
          localStorage.setItem('radianceRising_playerExperience', this.playerStatus.currentExperience.toString());
        }
      } catch (error) {
        console.error("[PlayerStatusTracker] Failed to save experience to storage:", error);
      }
    });
  }

  /**
   * Load level from localStorage
   */
  loadLevelFromStorage() {
    try {
      const stored = localStorage.getItem('radianceRising_playerLevel');
      return stored ? parseInt(stored, 10) : Config.STARTING_LEVEL;
    } catch (error) {
      console.warn("[PlayerStatusTracker] Failed to load level from storage:", error);
      return Config.STARTING_LEVEL;
    }
  }

  /**
   * Save current level to localStorage
   */
  saveLevelToStorage() {
    try {
      if (this.playerStatus) {
        localStorage.setItem('radianceRising_playerLevel', this.playerStatus.currentLevel.toString());
      }
    } catch (error) {
      console.error("[PlayerStatusTracker] Failed to save level to storage:", error);
    }
  }
}


