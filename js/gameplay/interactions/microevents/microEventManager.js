class MicroEventManager {
  constructor() {
    this.gameplayLevelToMicroEventsMap = {};
  }

  static convertLevelDataCompositeToMicroEvents(levelDataComposite) {
    let allLevelMicroEvents =
      MicroEventFactory.generateAllMicroEventsForLevel(levelDataComposite);

    return allLevelMicroEvents;
  }

  prepareAndRegisterMicroEventsForLevel(levelDataComposite) {
    let allLevelMicroEvents =
      MicroEventManager.convertLevelDataCompositeToMicroEvents(
        levelDataComposite
      );

    if (
      this.gameplayLevelToMicroEventsMap[
        levelDataComposite.levelHeaderData.levelId
      ]
    ) {
      //to do update logging
      console.error(
        "MicroEventManager - prepareAndRegisterMicroEventsForLevel: levelId already exists"
      );
    } else {
      this.gameplayLevelToMicroEventsMap[
        levelDataComposite.levelHeaderData.levelId
      ] = allLevelMicroEvents;
    }
  }

  /**
   * Retrieves all micro events for a given level data object.
   * @param {string} levelIdToSeek - The level id to seek.
   * @returns {Array} - Array of micro event objects.
   */
  getMicroEventsByLevelId(levelIdToSeek) {
    return this.gameplayLevelToMicroEventsMap.get(levelIdToSeek) || [];
  }

  addNewMicroEventToLevel(levelDataComposite, microEventToAdd) {
    const idToAddTo = levelDataComposite.levelHeaderData.levelId;

    if (this.gameplayLevelToMicroEventsMap[idToAddTo]) {
      this.gameplayLevelToMicroEventsMap[idToAddTo].push(microEventToAdd);
    } else {
      //to do update logging
      console.error(
        "MicroEventManager - addNewMicroEventToLevel: levelId not found"
      );
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
   * @param {Object} levelDataComposite - The level data object.
   * @param {string} [categorySeeked] - The micro event category to filter by.
   * @param {boolean} [completionStatusToSeek] - The desired completion status:
   *                                             true for completed, false for incomplete.
   * @returns {Array} - The filtered array of micro event objects.
   */
  static getMicroEventsByCategoryAndStatus(
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
