// Global flag to disable micro event manager logging (set to false to enable logging)
const MICRO_EVENT_MANAGER_LOGGING_ENABLED = false;


// Helper function for conditional micro event manager logging
function microEventManagerLog(...args) {
  if (MICRO_EVENT_MANAGER_LOGGING_ENABLED) {
    console.log(...args);
  }
}

class MicroEventManager {
  constructor() {
    this.gameplayLevelToMicroEventsMap = {};
  }

  static convertLevelDataCompositeToMicroEvents(levelDataComposite) {
    let allLevelMicroEvents =
      MicroEventFactory.generateAllMicroEventsForLevel(levelDataComposite);

    return allLevelMicroEvents;
  }

  onFrameCheckMicroEventsForTriggered() {
    // Check if player is dead/resetting - if so, don't process microevents
    const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
    if (levelResetHandler && (levelResetHandler.isResetting || levelResetHandler.hasPlayerDied())) {
      return; // Don't process microevents during death/reset
    }

    // Log that we're being called (throttled to avoid spam)
    if (!this._frameCheckCallCount) this._frameCheckCallCount = 0;
    this._frameCheckCallCount++;
    if (this._frameCheckCallCount === 1 || this._frameCheckCallCount % 60 === 0) {
      //microEventManagerLog(`[PICKUP SYSTEM] ✓ onFrameCheckMicroEventsForTriggered() called (frame ${this._frameCheckCallCount})`);
    }

    // Get the active gameplay level to determine which level's microevents to check
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
    if (!gameplayManager) {
      if (!this._lastNoManagerLog || Date.now() - this._lastNoManagerLog > 5000) {
        //  microEventManagerLog(`[PICKUP SYSTEM] gameplayManagerComposite not found!`);
        //  this._lastNoManagerLog = Date.now();
      }
      return;
    }

    if (!gameplayManager.primaryActiveGameplayLevel) {
      if (!this._lastNoActiveLevelLog || Date.now() - this._lastNoActiveLevelLog > 5000) {
        //microEventManagerLog(`[PICKUP SYSTEM] No primaryActiveGameplayLevel in gameplayManager!`);
        //this._lastNoActiveLevelLog = Date.now();
      }
      return;
    }

    const activeLevel = gameplayManager.primaryActiveGameplayLevel;
    const levelId = activeLevel?.levelDataComposite?.levelHeaderData?.levelId || "testLevel0";

    let allMicroEvents = this.gameplayLevelToMicroEventsMap[levelId];

    // If no microevents are registered for this level, return early
    if (!allMicroEvents || !Array.isArray(allMicroEvents)) {
      return;
    }

    // Filter to only incomplete pickup events for logging efficiency
    const incompletePickupEvents = allMicroEvents.filter(
      event => event.microEventCategory === "pickup" && !event.microEventCompletionStatus
    );

    // Filter to only incomplete damage events
    const incompleteDamageEvents = allMicroEvents.filter(
      event => event.microEventCategory === "damage" && !event.microEventCompletionStatus
    );

    let collectiblePlacementManager =
      FundamentalSystemBridge["collectiblePlacementManager"];

    if (!collectiblePlacementManager) {
      // microEventManagerLog(`[PICKUP SYSTEM] CollectiblePlacementManager not found!`);
      return;
    }

    // Use the primaryActiveGameplayLevel from the gameplayManager instead of CollectiblePlacementManager
    // to ensure we're using the same instance that has the player registered
    const activeGameplayLevel = gameplayManager.primaryActiveGameplayLevel;

    if (!activeGameplayLevel) {
      //microEventManagerLog(`[PICKUP SYSTEM] No primaryActiveGameplayLevel in gameplayManager!`);
      return;
    }

    // Update CollectiblePlacementManager's reference to match
    if (collectiblePlacementManager.activeGameplayLevel !== activeGameplayLevel) {
      //microEventManagerLog(`[PICKUP SYSTEM] Updating CollectiblePlacementManager activeGameplayLevel reference`);
      collectiblePlacementManager.activeGameplayLevel = activeGameplayLevel;
    }




    for (let microEvent of incompletePickupEvents) {
      // Log each event being checked (throttled)

      let nearACollectible =
        collectiblePlacementManager.checkCollectibleForPickupEventTrigger(
          microEvent
        );

      if (nearACollectible) {
        // Immediately mark as completed to prevent multiple processing
        // This must happen BEFORE any processing to prevent race conditions
        if (microEvent.microEventCompletionStatus === false) {
          microEvent.markAsCompleted();
          //microEventManagerLog(`[PICKUP] Pickup detected! Event: ${microEvent.microEventNickname}, Value: ${microEvent.microEventValue}`);
          this.processSuccessfulPickup(microEvent);
        }
      }
    }

    // Check for damage events
    for (let microEvent of incompleteDamageEvents) {
      // Check if this spike has already triggered during the current movement
      if (microEvent.hasTriggeredThisMovement) {
        continue; // Skip this spike - it already hit during this movement
      }

      let nearADamageTrigger =
        collectiblePlacementManager.checkCollectibleForPickupEventTrigger(
          microEvent
        );

      if (nearADamageTrigger) {
        // Mark as completed and flag as triggered during this movement
        if (microEvent.microEventCompletionStatus === false) {
          microEvent.markAsCompleted();
          microEvent.hasTriggeredThisMovement = true; // Flag: hit during this movement
          microEventManagerLog(`[DAMAGE] ⚠ Spike hit! ${microEvent.microEventNickname} - flagged for this movement`);
          this.processSuccessfulDamage(microEvent);
        }
      }
    }
  }

  processSuccessfulPickup(microEvent) {
    // Event should already be marked as completed before this is called
    // But add a safety check just in case
    if (microEvent.microEventCompletionStatus === false) {
      microEvent.markAsCompleted();
    }

    //microEventManagerLog(`[PICKUP] Processing pickup for: ${microEvent.microEventNickname}`);
    //microEventManagerLog(`[PICKUP] PositionedObject exists:`, !!microEvent.microEventPositionedObject);
    //microEventManagerLog(`[PICKUP] Model exists:`, !!microEvent.microEventPositionedObject?.model);

    GameEventBus.emit("gameInteraction", { type: "pickup", position: microEvent.microEventLocation });

    SoundEffectsManager.playSound("stardustAbsorptionSizzle");

    // Hide the model (disposeModel doesn't actually dispose - just sets invisible)
    // This allows the replay manager to restore visibility later
    //microEventManagerLog(`[PICKUP] Hiding model (setting invisible)...`);
    microEvent.microEventPositionedObject.disposeModel();
    //microEventManagerLog(`[PICKUP] Model hidden. Can be restored for replay.`);

    let pickupOccurrence =
      CollectibleOccurrenceFactory.convertMicroEventToOccurrence(microEvent);

    FundamentalSystemBridge[
      "specialOccurrenceManager"
    ].processPickupOccurrence(pickupOccurrence);
    //microEventManagerLog(`[PICKUP] Pickup processing complete. Event marked as completed.`);
  }

  processSuccessfulDamage(microEvent) {
    // Event should already be marked as completed before this is called
    if (microEvent.microEventCompletionStatus === false) {
      microEvent.markAsCompleted();
    }

    microEventManagerLog(`[DAMAGE] ⚔ Processing damage for: ${microEvent.microEventNickname}`);

    GameEventBus.emit("gameInteraction", { type: "damage", position: microEvent.microEventLocation });

    // Play damage sound effect
    SoundEffectsManager.playSound("magicWallBreak");

    // Create damage occurrence and process it
    let damageOccurrence =
      CollectibleOccurrenceFactory.convertMicroEventToOccurrence(microEvent);

    FundamentalSystemBridge[
      "specialOccurrenceManager"
    ].processDamageOccurrence(damageOccurrence);
    microEventManagerLog(`[DAMAGE] ✓ Damage processing complete. Event marked as completed.`);
  }

  /**
   * Resets all damage event flags for the current level
   * Call this at the START of each player movement
   * This allows spike traps to hit again on a new movement
   */
  resetDamageEventFlagsForLevel() {
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
    if (!gameplayManager || !gameplayManager.primaryActiveGameplayLevel) {
      return;
    }

    const activeLevel = gameplayManager.primaryActiveGameplayLevel;
    const levelId = activeLevel?.levelDataComposite?.levelHeaderData?.levelId;

    if (!levelId) {
      return;
    }

    // Get all microevents for this level
    const allMicroEvents = this.gameplayLevelToMicroEventsMap[levelId];
    if (!allMicroEvents || allMicroEvents.length === 0) {
      return;
    }

    // Reset flags and completion status for all damage events
    const damageEvents = allMicroEvents.filter(event => event.microEventCategory === "damage");
    damageEvents.forEach(microEvent => {
      microEvent.hasTriggeredThisMovement = false; // Reset flag for new movement
      microEvent.markAsIncomplete(); // Allow it to be triggered again
    });

    microEventManagerLog(`[DAMAGE] ♻ Reset ${damageEvents.length} spike trap flags for new movement`);
  }

  prepareAndRegisterMicroEventsForLevel(levelDataComposite) {
    let allLevelMicroEvents =
      MicroEventManager.convertLevelDataCompositeToMicroEvents(
        levelDataComposite
      );

    // Microevents are now tracked by PredictiveExplosionManager per movement

    const levelId = levelDataComposite.levelHeaderData.levelId;

    // ALWAYS replace microevents for this level to ensure clean state
    // Never merge - this prevents duplicates and stale state
    this.gameplayLevelToMicroEventsMap[levelId] = allLevelMicroEvents;
    microEventManagerLog(`[MICROEVENT REGISTRATION] Registered ${allLevelMicroEvents.length} microevents for level: ${levelId}`);
  }

  /**
   * Retrieves all micro events for a given level data object.
   * @param {string} levelIdToSeek - The level id to seek.
   * @returns {Array} - Array of micro event objects.
   */
  getMicroEventsByLevelId(levelIdToSeek) {
    const events = this.gameplayLevelToMicroEventsMap[levelIdToSeek] || [];
    microEventManagerLog(`[MICROEVENT LOOKUP] Looking up events for level: ${levelIdToSeek}, found: ${events.length}`);
    if (events.length === 0) {
      microEventManagerLog(`[MICROEVENT LOOKUP] Available level IDs: ${Object.keys(this.gameplayLevelToMicroEventsMap).join(', ')}`);
    }
    return events;
  }

  /**
   * Clears all microevents for a specific level ID
   * Call this when transitioning away from a level to prevent accumulation
   * @param {string} levelId - The level ID to clear
   */
  clearMicroEventsForLevel(levelId) {
    if (this.gameplayLevelToMicroEventsMap[levelId]) {
      const count = this.gameplayLevelToMicroEventsMap[levelId].length;
      delete this.gameplayLevelToMicroEventsMap[levelId];
      microEventManagerLog(`[MICROEVENT CLEANUP] Cleared ${count} microevents for level: ${levelId}`);
    }
  }

  /**
   * Clears microevents for all levels except the specified one
   * Useful when transitioning to a new level to prevent old level hazards from persisting
   * @param {string} keepLevelId - The level ID to keep (optional)
   */
  clearMicroEventsExceptForLevel(keepLevelId = null) {
    const levelIds = Object.keys(this.gameplayLevelToMicroEventsMap);
    let totalCleared = 0;

    for (const levelId of levelIds) {
      if (levelId !== keepLevelId) {
        const count = this.gameplayLevelToMicroEventsMap[levelId].length;
        delete this.gameplayLevelToMicroEventsMap[levelId];
        totalCleared += count;
        microEventManagerLog(`[MICROEVENT CLEANUP] Cleared ${count} microevents for old level: ${levelId}`);
      }
    }

    if (totalCleared > 0) {
      microEventManagerLog(`[MICROEVENT CLEANUP] Total cleared: ${totalCleared} microevents from ${levelIds.length - (keepLevelId ? 1 : 0)} old levels`);
    }
  }

  addNewMicroEventToLevel(levelDataComposite, microEventToAdd) {
    const idToAddTo = levelDataComposite.levelHeaderData.levelId;

    microEventManagerLog(`[MICROEVENT REGISTRATION] Adding microevent to levelId: ${idToAddTo}`);
    microEventManagerLog(`[MICROEVENT REGISTRATION] Event: ${microEventToAdd.microEventNickname}, Category: ${microEventToAdd.microEventCategory}`);

    if (this.gameplayLevelToMicroEventsMap[idToAddTo]) {
      this.gameplayLevelToMicroEventsMap[idToAddTo].push(microEventToAdd);
      microEventManagerLog(`[MICROEVENT REGISTRATION] Added to existing array. Total events for ${idToAddTo}: ${this.gameplayLevelToMicroEventsMap[idToAddTo].length}`);
    } else {
      this.gameplayLevelToMicroEventsMap[idToAddTo] = [];
      this.gameplayLevelToMicroEventsMap[idToAddTo].push(microEventToAdd);
      microEventManagerLog(`[MICROEVENT REGISTRATION] Created new array for levelId: ${idToAddTo}`);
    }
  }
  // Filter events by category.
  static filterByCategory(events, category) {
    return events.filter((event) => event.microEventCategory === category);
  }

  // Filter events by completion status.
  static filterByCompletionStatus(events, isCompleted) {
    return events.filter(
      (event) => event.microEventCompletionStatus === isCompleted
    );
  }

  resetAllMicroEventsForLevel(levelIdToReset) {
    let microEventsToReset = this.getMicroEventsByLevelId(levelIdToReset);

    for (let i = 0; i < microEventsToReset.length; i++) {
      microEventsToReset[i].markAsIncomplete();
    }
  }
  /**
   * Filters micro events for a given level by category and/or completion status.
   *
   * @param {string} levelIdToSeek - The level id to seek.
   * @param {string} [categorySeeked] - The micro event category to filter by.
   * @param {boolean} [completionStatusToSeek] - The desired completion status:
   *                                             true for completed, false for incomplete.
   * @returns {Array} - The filtered array of micro event objects.
   */
  getMicroEventsByCategoryAndStatus(
    levelIdToSeek,
    categorySeeked,
    completionStatusToSeek
  ) {
    // 1. Retrieve all events for the given level.
    let events = this.getMicroEventsByLevelId(levelIdToSeek);
    // 2. If a category is provided, filter by that category.
    if (events.length > 0 && categorySeeked) {
      events = MicroEventManager.filterByCategory(events, categorySeeked);
    }

    // 3. If a completion status is provided (either true or false),
    // filter the events by their completion status.
    if (
      events.length > 0 &&
      (completionStatusToSeek === true || completionStatusToSeek === false)
    ) {
      events = MicroEventManager.filterByCompletionStatus(
        events,
        completionStatusToSeek
      );
    } else {
      MicroEventManager.logFilteringResults(
        events,
        categorySeeked,
        completionStatusToSeek
      );
      return [];
    }

    // 4. Return the filtered array.
    return events;
  }


}
