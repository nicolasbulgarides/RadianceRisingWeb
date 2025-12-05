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
        //  this._lastNoManagerLog = Date.now();
      }
      return;
    }

    if (!gameplayManager.primaryActiveGameplayLevel) {
      if (!this._lastNoActiveLevelLog || Date.now() - this._lastNoActiveLevelLog > 5000) {
        //console.warn(`[PICKUP SYSTEM] No primaryActiveGameplayLevel in gameplayManager!`);
        //this._lastNoActiveLevelLog = Date.now();
      }
      return;
    }

    const activeLevel = gameplayManager.primaryActiveGameplayLevel;
    const levelId = activeLevel?.levelDataComposite?.levelHeaderData?.levelId || "testLevel0";

    let allMicroEvents = this.gameplayLevelToMicroEventsMap[levelId];


    // Filter to only incomplete pickup events for logging efficiency
    const incompletePickupEvents = allMicroEvents.filter(
      event => event.microEventCategory === "pickup" && !event.microEventCompletionStatus
    );


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




    for (let microEvent of incompletePickupEvents) {
      // Log each event being checked (throttled)

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



      SoundEffectsManager.playSound("stardustAbsorptionSizzle");

      //console.log(`[PICKUP] Calling disposeModel()...`);
      microEvent.microEventPositionedObject.disposeModel();
      //console.log(`[PICKUP] disposeModel() completed. Model is now:`, microEvent.microEventPositionedObject.model);

      let pickupOccurrence =
        CollectibleOccurrenceFactory.convertMicroEventToOccurrence(microEvent);

      FundamentalSystemBridge[
        "specialOccurrenceManager"
      ].processPickupOccurrence(pickupOccurrence);
      microEvent.markAsCompleted();
      //console.log(`[PICKUP] Pickup processing complete. Event marked as completed.`);
    } else {
      //console.log(`[PICKUP] Skipping - event already completed: ${microEvent.microEventNickname}`);
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

    //console.log(`[MICROEVENT REGISTRATION] Adding microevent to levelId: ${idToAddTo}`);
    //console.log(`[MICROEVENT REGISTRATION] Event: ${microEventToAdd.microEventNickname}, Category: ${microEventToAdd.microEventCategory}`);

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


}
