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
    // Log that we're being called (throttled to avoid spam)
    if (!this._frameCheckCallCount) this._frameCheckCallCount = 0;
    this._frameCheckCallCount++;
    if (this._frameCheckCallCount === 1 || this._frameCheckCallCount % 60 === 0) {
      //console.log(`[PICKUP SYSTEM] ✓ onFrameCheckMicroEventsForTriggered() called (frame ${this._frameCheckCallCount})`);
    }

    // Get the active gameplay level to determine which level's microevents to check
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
    if (!gameplayManager) {
      if (!this._lastNoManagerLog || Date.now() - this._lastNoManagerLog > 5000) {
        //  console.warn(`[PICKUP SYSTEM] gameplayManagerComposite not found!`);
        this._lastNoManagerLog = Date.now();
      }
      return;
    }

    if (!gameplayManager.primaryActiveGameplayLevel) {
      if (!this._lastNoActiveLevelLog || Date.now() - this._lastNoActiveLevelLog > 5000) {
        console.warn(`[PICKUP SYSTEM] No primaryActiveGameplayLevel in gameplayManager!`);
        this._lastNoActiveLevelLog = Date.now();
      }
      return;
    }

    const activeLevel = gameplayManager.primaryActiveGameplayLevel;
    const levelId = activeLevel?.levelDataComposite?.levelHeaderData?.levelId || "testLevel0";

    // Debug logging
    if (!this._lastLoggedLevelId || this._lastLoggedLevelId !== levelId) {
      //console.log(`[PICKUP SYSTEM] Checking microevents for levelId: ${levelId}`);
      //console.log(`[PICKUP SYSTEM] Available levelIds in map:`, Object.keys(this.gameplayLevelToMicroEventsMap));
      this._lastLoggedLevelId = levelId;
    }

    let allMicroEvents = this.gameplayLevelToMicroEventsMap[levelId];

    if (!allMicroEvents) {
      // Only log once per level to avoid spam
      if (!this._warnedMissingEvents || this._warnedMissingEvents !== levelId) {
        //console.warn(`[PICKUP SYSTEM] No microevents found for levelId: ${levelId}`);
        //console.log(`[PICKUP SYSTEM] Map contents:`, this.gameplayLevelToMicroEventsMap);
        this._warnedMissingEvents = levelId;
      }
      return;
    }

    // Filter to only incomplete pickup events for logging efficiency
    const incompletePickupEvents = allMicroEvents.filter(
      event => event.microEventCategory === "pickup" && !event.microEventCompletionStatus
    );

    if (incompletePickupEvents.length === 0) {
      // Log occasionally to confirm the check is running
      if (!this._lastNoIncompleteLog || Date.now() - this._lastNoIncompleteLog > 10000) {
        // console.log(`[PICKUP SYSTEM] Found ${allMicroEvents.length} total events, ${incompletePickupEvents.length} incomplete pickup events`);
        this._lastNoIncompleteLog = Date.now();
      }
      return;
    }

    // Log periodically that we're checking
    if (!this._lastCheckLog || Date.now() - this._lastCheckLog > 5000) {
      //console.log(`[PICKUP SYSTEM] Checking ${incompletePickupEvents.length} incomplete pickup events`);
      this._lastCheckLog = Date.now();
    }

    let collectiblePlacementManager =
      FundamentalSystemBridge["collectiblePlacementManager"];

    if (!collectiblePlacementManager) {
      // console.warn(`[PICKUP SYSTEM] CollectiblePlacementManager not found!`);
      return;
    }

    // Use the primaryActiveGameplayLevel from the gameplayManager instead of CollectiblePlacementManager
    // to ensure we're using the same instance that has the player registered
    const activeGameplayLevel = gameplayManager.primaryActiveGameplayLevel;

    if (!activeGameplayLevel) {
      //console.warn(`[PICKUP SYSTEM] No primaryActiveGameplayLevel in gameplayManager!`);
      return;
    }

    // Update CollectiblePlacementManager's reference to match
    if (collectiblePlacementManager.activeGameplayLevel !== activeGameplayLevel) {
      //console.log(`[PICKUP SYSTEM] Updating CollectiblePlacementManager activeGameplayLevel reference`);
      collectiblePlacementManager.activeGameplayLevel = activeGameplayLevel;
    }

    if (!activeGameplayLevel.currentPrimaryPlayer) {
      // Only log occasionally to avoid spam
      if (!this._lastNoPlayerWarning || Date.now() - this._lastNoPlayerWarning > 5000) {
        console.warn(`[PICKUP SYSTEM] activeGameplayLevel has no currentPrimaryPlayer!`);
        this._lastNoPlayerWarning = Date.now();
      }
      return;
    }

    // Log that we're about to check events
    if (!this._lastEventCheckLog || Date.now() - this._lastEventCheckLog > 5000) {
      //console.log(`[PICKUP SYSTEM] About to check ${incompletePickupEvents.length} pickup events against player position`);
      this._lastEventCheckLog = Date.now();
    }

    for (let microEvent of incompletePickupEvents) {
      // Log each event being checked (throttled)
      if (!this._eventCheckCounter) this._eventCheckCounter = 0;
      this._eventCheckCounter++;
      if (this._eventCheckCounter % 120 === 0) {
        //console.log(`[PICKUP SYSTEM] Checking event: ${microEvent.microEventNickname} at location:`, microEvent.microEventLocation);
      }

      let nearACollectible =
        collectiblePlacementManager.checkCollectibleForPickupEventTrigger(
          microEvent
        );

      if (nearACollectible) {
        //console.log(`[PICKUP] Pickup detected! Event: ${microEvent.microEventNickname}, Value: ${microEvent.microEventValue}`);
        this.processSuccessfulPickup(microEvent);
      }
    }
  }

  processSuccessfulPickup(microEvent) {
    if (microEvent.microEventCompletionStatus === false) {
      //console.log(`[PICKUP] Processing pickup for: ${microEvent.microEventNickname}`);
      //console.log(`[PICKUP] PositionedObject exists:`, !!microEvent.microEventPositionedObject);
      //console.log(`[PICKUP] Model exists:`, !!microEvent.microEventPositionedObject?.model);

      if (microEvent.microEventPositionedObject?.model) {
        console.log(`[PICKUP] Model structure:`, {
          hasMeshes: !!microEvent.microEventPositionedObject.model.meshes,
          meshCount: microEvent.microEventPositionedObject.model.meshes?.length || 0,
          firstMesh: microEvent.microEventPositionedObject.model.meshes?.[0] ? 'exists' : 'missing'
        });
      }

      SoundEffectsManager.playSound("stardustAbsorptionSizzle");

      console.log(`[PICKUP] Calling disposeModel()...`);
      microEvent.microEventPositionedObject.disposeModel();
      console.log(`[PICKUP] disposeModel() completed. Model is now:`, microEvent.microEventPositionedObject.model);

      let pickupOccurrence =
        CollectibleOccurrenceFactory.convertMicroEventToOccurrence(microEvent);

      FundamentalSystemBridge[
        "specialOccurrenceManager"
      ].processPickupOccurrence(pickupOccurrence);
      microEvent.markAsCompleted();
      console.log(`[PICKUP] Pickup processing complete. Event marked as completed.`);
    } else {
      console.log(`[PICKUP] Skipping - event already completed: ${microEvent.microEventNickname}`);
    }
  }

  prepareAndRegisterMicroEventsForLevel(levelDataComposite) {
    let allLevelMicroEvents =
      MicroEventManager.convertLevelDataCompositeToMicroEvents(
        levelDataComposite
      );

    const levelId = levelDataComposite.levelHeaderData.levelId;

    if (this.gameplayLevelToMicroEventsMap[levelId]) {
      // Level already has microevents registered (e.g., from manual registration)
      // Merge the new microevents with existing ones instead of overwriting
      const existingMicroEvents = this.gameplayLevelToMicroEventsMap[levelId];
      this.gameplayLevelToMicroEventsMap[levelId] = [
        ...existingMicroEvents,
        ...allLevelMicroEvents
      ];
      ;
    } else {
      this.gameplayLevelToMicroEventsMap[levelId] = allLevelMicroEvents;
    }
  }

  /**
   * Retrieves all micro events for a given level data object.
   * @param {string} levelIdToSeek - The level id to seek.
   * @returns {Array} - Array of micro event objects.
   */
  getMicroEventsByLevelId(levelIdToSeek) {
    return this.gameplayLevelToMicroEventsMap[levelIdToSeek] || [];
  }

  addNewMicroEventToLevel(levelDataComposite, microEventToAdd) {
    const idToAddTo = levelDataComposite.levelHeaderData.levelId;

    console.log(`[MICROEVENT REGISTRATION] Adding microevent to levelId: ${idToAddTo}`);
    console.log(`[MICROEVENT REGISTRATION] Event: ${microEventToAdd.microEventNickname}, Category: ${microEventToAdd.microEventCategory}`);

    if (this.gameplayLevelToMicroEventsMap[idToAddTo]) {
      this.gameplayLevelToMicroEventsMap[idToAddTo].push(microEventToAdd);
      // console.log(`[MICROEVENT REGISTRATION] Added to existing array. Total events for ${idToAddTo}: ${this.gameplayLevelToMicroEventsMap[idToAddTo].length}`);
    } else {
      this.gameplayLevelToMicroEventsMap[idToAddTo] = [];
      this.gameplayLevelToMicroEventsMap[idToAddTo].push(microEventToAdd);
      //  console.log(`[MICROEVENT REGISTRATION] Created new array for levelId: ${idToAddTo}`);
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

  static logFilteringResults(events, categorySeeked, completionStatusToSeek) {
    if (events.length === 0) {
      console.log(
        "MicroEventManager - logMicroEventFilteringResults: " +
        "no events found to survive filter: " +
        categorySeeked
      );
    }

    if (events.length > 0) {
      console.log(
        "MicroEventManager - logMicroEventFilteringResults: " +
        "events found to  have completion status: " +
        completionStatusToSeek
      );
    }
  }
}
