class PickupOccurrenceSubManager {
  constructor() {
    this.stardustPickupCount = 0;
    this.currentExperience = 0; // Fallback experience tracker if the global tracker is unavailable
  }

  /**
   * Resets pickup streak/experience for a new world/level load.
   * Also updates the UI bar so the player sees a clean state.
   */
  resetPickupProgress() {
    this.stardustPickupCount = 0;
    // Only reset the local counter if no global tracker is available.
    if (!this.getPlayerStatusTracker()) {
      this.currentExperience = 0;
    }
    this.updateExperienceBar();
    //console.log("[PICKUP] Reset pickup progress for new world/level");
  }

  processPickupOccurrence(pickupOccurrence) {
    let processedSuccessfully = false;

    let occurrenceHeader = pickupOccurrence.occurrenceHeader;
    let occurrenceId = occurrenceHeader.occurrenceId;

    //console.log(`[PICKUP] processPickupOccurrence called with occurrenceId: ${occurrenceId}`);

    if (occurrenceId === "mangoPickupOccurrence") {
      this.processBasicFruitPickup(pickupOccurrence, "mango");
      processedSuccessfully = true;
    } else if (occurrenceId === "stardustPickupOccurrence") {
      // processStardustPickup is async, but we don't need to await it
      this.processStardustPickup(pickupOccurrence).catch(error => {
        //console.error(`[PICKUP] Error processing stardust pickup:`, error);
      });
      processedSuccessfully = true;
    } else if (occurrenceId === "heartPickupOccurrence") {
      // processHeartPickup is async, but we don't need to await it
      this.processHeartPickup(pickupOccurrence).catch(error => {
        //console.error(`[PICKUP] Error processing heart pickup:`, error);
      });
      processedSuccessfully = true;
    } else {
      console.warn(`[PICKUP] Unknown occurrenceId: ${occurrenceId}`);
    }

    return processedSuccessfully;
  }

  processBasicFruitPickup(pickupOccurrence, fruitType) {
    if (fruitType === "mango") {
      let itemData = this.getMangoItemData();
      let activePlayer =
        FundamentalSystemBridge["gameplayManagerComposite"].primaryActivePlayer;

      let activeInventory = activePlayer.mockInventory;

      activeInventory.addItem(itemData);
    }
  }

  getMangoItemData() {
    let itemData = new Item(
      "mango",
      "A tasty mango fruit.",
      "common",
      1,
      1,
      0,
      0,
      null,
      false,
      false,
      false,
      true,
      true
    );

    return itemData;
  }

  /**
   * Updates the experience bar UI with the current experience count.
   * Caps experience at 24 (the maximum number of segments).
   */
  updateExperienceBar(experienceOverride = null) {
    // Prefer the centralized tracker so the UI reflects persistent player state.
    const tracker = this.getPlayerStatusTracker();
    if (tracker) {
      tracker.updateExperienceUI(experienceOverride);
      return;
    }
  }

  addExperienceToPlayer(amount) {
    const tracker = this.getPlayerStatusTracker();
    if (tracker) {
      return tracker.addExperience(amount);
    }
  }

  getPlayerStatusTracker() {
    const tracker = FundamentalSystemBridge["playerStatusTracker"];
    return tracker instanceof PlayerStatusTracker ? tracker : null;
  }

  async processStardustPickup(pickupOccurrence) {
    // Increment pickup count
    this.stardustPickupCount++;
    //  console.log(`[PICKUP] Stardust pickup #${this.stardustPickupCount} processed`);

    // Add 1 experience for each stardust pickup
    this.addExperienceToPlayer(1);

    // Get the scene for playing sounds - try multiple methods
    let scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();

    // Fallback: try to get scene from active gameplay level
    if (!scene) {
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      if (gameplayManager?.primaryActiveGameplayLevel?.hostingScene) {
        scene = gameplayManager.primaryActiveGameplayLevel.hostingScene;
        // console.log(`[PICKUP] Got scene from activeGameplayLevel.hostingScene`);
      }
    }

    if (!scene) {
      //console.warn(`[PICKUP] Cannot play pickup sound: scene not found (pickup count: ${this.stardustPickupCount})`);
      // Don't return early - we still want to track the pickup count
    }

    // Play sound based on pickup count
    let soundName;
    if (this.stardustPickupCount === 1) {
      soundName = "streakBonusStart";
    } else if (this.stardustPickupCount === 2) {
      soundName = "streakBonusCombo";
    } else if (this.stardustPickupCount === 3) {
      soundName = "streakBonusSuperCombo";
    } else if (this.stardustPickupCount === 4) {
      soundName = "streakBonusUltimateCombo";
    } else {
      // For pickups beyond 4, continue with ultimate combo
      soundName = "streakBonusUltimateCombo";
    }

    // Play the sound (with error handling)
    if (scene) {
      try {
        await SoundEffectsManager.playSound(soundName, scene);
        ////console.log(`[PICKUP] Playing sound: ${soundName} for pickup #${this.stardustPickupCount}`);
      } catch (error) {
        // console.error(`[PICKUP] Error playing sound ${soundName}:`, error);
      }
    }

    // If this is the 4th pickup, trigger explosion effect, add 4 more experience, and play "endOfLevelPerfect" immediately
    if (this.stardustPickupCount === 4) {
      // Check if player died - if so, don't trigger replay
      const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
      if (levelResetHandler && levelResetHandler.hasPlayerDied()) {
        //console.log(`[PICKUP] 4th pickup detected but player died - skipping replay`);
        return; // Don't trigger completion sequence if player died
      }

      // console.log(`[PICKUP] 4th pickup detected! Triggering explosion effect and playing endOfLevelPerfect sound`);

      // Add 4 more experience for level completion
      this.addExperienceToPlayer(4);

      // Trigger explosion effect immediately (don't await, let it run in background)
      const effectGenerator = new EffectGenerator();
      effectGenerator.explosionEffect({
        type: 'magic', // Use magic type for a celebratory effect
        intensity: 1.5,
        duration: 5.0 // 5 second duration
      }).catch(error => {
        console.error(`[PICKUP] Error triggering explosion effect:`, error);
      });

      // Play "endOfLevelPerfect" sound immediately (no delay)
      try {
        await SoundEffectsManager.playSound("endOfLevelPerfect", scene);
        //console.log(`[PICKUP] Playing endOfLevelPerfect sound`);
      } catch (error) {
        //console.error(`[PICKUP] Error playing endOfLevelPerfect sound:`, error);
      }

      // Start replay sequence after a short delay
      setTimeout(async () => {
        // Double-check player didn't die during the delay
        if (levelResetHandler && levelResetHandler.hasPlayerDied()) {
          //console.log(`[PICKUP] Player died before replay could start - aborting replay`);
          return;
        }

        const replayManager = FundamentalSystemBridge["levelReplayManager"];
        const movementTracker = FundamentalSystemBridge["movementTracker"];
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

        if (replayManager && movementTracker && gameplayManager) {
          const activeLevel = gameplayManager.primaryActiveGameplayLevel;
          const activePlayer = gameplayManager.primaryActivePlayer;

          if (activeLevel && activePlayer) {
            // Stop tracking
            movementTracker.stopTracking();

            // Start replay
            await replayManager.startReplay(activeLevel, activePlayer, movementTracker);
          }
        }
      }, 1000); // Wait 1 second before starting replay
    }

  }

  /**
   * Processes a heart pickup occurrence
   * @param {Occurrence} pickupOccurrence - The heart pickup occurrence
   */
  async processHeartPickup(pickupOccurrence) {
    //console.log(`[HEART] Processing heart pickup`);

    // Get the scene for playing sounds
    let scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();

    // Fallback: try to get scene from active gameplay level
    if (!scene) {
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      if (gameplayManager?.primaryActiveGameplayLevel?.hostingScene) {
        scene = gameplayManager.primaryActiveGameplayLevel.hostingScene;
      }
    }

    // Play healing sound effect
    if (scene) {
      try {
        await SoundEffectsManager.playSound("healthRestoration", scene);
        //console.log(`[HEART] Playing health restoration sound`);
      } catch (error) {
        //console.error(`[HEART] Error playing health restoration sound:`, error);
      }
    }

    // Heal the player by 1 heart
    const tracker = this.getPlayerStatusTracker();
    if (tracker && tracker.healPlayer) {
      tracker.healPlayer(1);
      //console.log(`[HEART] Player healed by 1 heart`);
    } else {
      //console.warn(`[HEART] PlayerStatusTracker not available or doesn't have healPlayer method`);
    }

    // Update UI to reflect the healing
    this.updateHeartUI();
  }

  /**
   * Processes a damage occurrence
   * @param {Occurrence} damageOccurrence - The damage occurrence
   */
  processDamageOccurrence(damageOccurrence) {
    let occurrenceHeader = damageOccurrence.occurrenceHeader;
    let occurrenceId = occurrenceHeader.occurrenceId;

    //console.log(`[DAMAGE] processDamageOccurrence called with occurrenceId: ${occurrenceId}`);

    if (occurrenceId === "spikePickupOccurrence" || occurrenceId === "damagePickupOccurrence") {
      this.processSpiketrapDamage(damageOccurrence);
      return true;
    } else {
      console.warn(`[DAMAGE] Unknown damage occurrenceId: ${occurrenceId}`);
      return false;
    }
  }

  /**
   * Processes spike trap damage
   * @param {Occurrence} damageOccurrence - The damage occurrence
   */
  processSpiketrapDamage(damageOccurrence) {
    console.log(`[DAMAGE OCCURRENCE] ⚔ Processing spike trap damage occurrence`);

    // Get the scene for playing sounds
    let scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();

    // Fallback: try to get scene from active gameplay level
    if (!scene) {
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      if (gameplayManager?.primaryActiveGameplayLevel?.hostingScene) {
        scene = gameplayManager.primaryActiveGameplayLevel.hostingScene;
      }
    }

    // Play damage sound effect
    if (scene) {
      try {
        SoundEffectsManager.playSound("magicWallBreak", scene);
        console.log(`[DAMAGE OCCURRENCE] Playing magic wall break sound`);
      } catch (error) {
        console.error(`[DAMAGE OCCURRENCE] Error playing magic wall break sound:`, error);
      }
    }

    // Deal 1 damage to the player
    const tracker = this.getPlayerStatusTracker();
    if (tracker && tracker.damagePlayer) {
      console.log(`[DAMAGE OCCURRENCE] Calling tracker.damagePlayer(1)...`);
      const resultingHealth = tracker.damagePlayer(1);
      console.log(`[DAMAGE OCCURRENCE] ✓ Player damaged. Resulting health: ${resultingHealth}`);
    } else {
      console.error(`[DAMAGE OCCURRENCE] ✗ PlayerStatusTracker not available or doesn't have damagePlayer method`);
    }

    // Update UI to reflect the damage
    this.updateHeartUI();
  }

  /**
   * Updates the heart UI to reflect current health
   */
  updateHeartUI() {
    const tracker = this.getPlayerStatusTracker();
    if (tracker && tracker.updateHealthUI) {
      tracker.updateHealthUI();
    }
  }
}
