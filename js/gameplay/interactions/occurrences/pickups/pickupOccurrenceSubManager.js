class PickupOccurrenceSubManager {
  constructor() {
    this.stardustPickupCount = 0;
  }

  processPickupOccurrence(pickupOccurrence) {
    let processedSuccessfully = false;

    let occurrenceHeader = pickupOccurrence.occurrenceHeader;
    let occurrenceId = occurrenceHeader.occurrenceId;

    console.log(`[PICKUP] processPickupOccurrence called with occurrenceId: ${occurrenceId}`);

    if (occurrenceId === "mangoPickupOccurrence") {
      this.processBasicFruitPickup(pickupOccurrence, "mango");
      processedSuccessfully = true;
    } else if (occurrenceId === "stardustPickupOccurrence") {
      // processStardustPickup is async, but we don't need to await it
      this.processStardustPickup(pickupOccurrence).catch(error => {
        console.error(`[PICKUP] Error processing stardust pickup:`, error);
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

  async processStardustPickup(pickupOccurrence) {
    // Increment pickup count
    this.stardustPickupCount++;
    console.log(`[PICKUP] Stardust pickup #${this.stardustPickupCount} processed`);

    // Get the scene for playing sounds - try multiple methods
    let scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();

    // Fallback: try to get scene from active gameplay level
    if (!scene) {
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      if (gameplayManager?.primaryActiveGameplayLevel?.hostingScene) {
        scene = gameplayManager.primaryActiveGameplayLevel.hostingScene;
        console.log(`[PICKUP] Got scene from activeGameplayLevel.hostingScene`);
      }
    }

    if (!scene) {
      console.warn(`[PICKUP] Cannot play pickup sound: scene not found (pickup count: ${this.stardustPickupCount})`);
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
        console.log(`[PICKUP] Playing sound: ${soundName} for pickup #${this.stardustPickupCount}`);
      } catch (error) {
        console.error(`[PICKUP] Error playing sound ${soundName}:`, error);
      }
    }

    // If this is the 4th pickup, play "endOfLevelPerfect" after 1 second delay
    if (this.stardustPickupCount === 4) {
      console.log(`[PICKUP] 4th pickup detected! Scheduling endOfLevelPerfect sound`);
      setTimeout(async () => {
        // Re-fetch scene in case it changed
        let delayedScene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
        if (!delayedScene) {
          const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
          if (gameplayManager?.primaryActiveGameplayLevel?.hostingScene) {
            delayedScene = gameplayManager.primaryActiveGameplayLevel.hostingScene;
          }
        }

        if (delayedScene) {
          try {
            await SoundEffectsManager.playSound("endOfLevelPerfect", delayedScene);
            console.log(`[PICKUP] Playing endOfLevelPerfect sound`);
          } catch (error) {
            console.error(`[PICKUP] Error playing endOfLevelPerfect sound:`, error);
          }
        } else {
          console.warn(`[PICKUP] Cannot play endOfLevelPerfect: scene not found`);
        }
      }, 1000);
    }
  }
}
