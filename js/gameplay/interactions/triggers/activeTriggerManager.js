/**
 * ActiveTriggerManager handles the lifecycle and processing of game triggers.
 * It manages trigger states, processes level events, and coordinates trigger activations.
 */
class ActiveTriggerManager {
  /**
   * Initializes a new instance of the ActiveTriggerManager.
   */
  constructor() {
    this.allActiveTriggers = []; // Array to store all active triggers
    this.triggerBackupBuffer = []; // Backup buffer for triggers that may need rollback
    this.activeTriggersReadyToPop = []; // List of triggers ready to be processed
  }

  /**
   * Processes a level event signal and identifies any relevant triggers to activate.
   * @param {LevelEventSignal} levelEventSignal - The event signal to process
   */
  processLevelEventSignal(levelEventSignal) {
    const relevantTriggers = this.findRelevantTriggers(levelEventSignal);
    for (const trigger of relevantTriggers) {
      this.queueTriggerForPopping(trigger);
    }
  }

  /**
   * Finds triggers that should respond to a given level event signal.
   * @param {LevelEventSignal} levelEventSignal - The event signal to match against triggers
   * @returns {Array} Array of triggers that match the event criteria
   */
  findRelevantTriggers(levelEventSignal) {
    return this.allActiveTriggers.filter((trigger) => {
      const instructions = trigger.triggerInstructions;
      const behavior = instructions.triggerBehaviorDetails;

      // Check if the trigger's valid targets match the event's primary target
      //to do - modify to allow for secondayr targets
      const targetMatches =
        behavior.triggerValidTargets ===
        levelEventSignal.levelEventPrimaryTarget;

      // Check if the trigger's category matches the event category
      const categoryMatches =
        instructions.triggerHeader.triggerCategory ===
        levelEventSignal.levelEventCategory;

      return targetMatches && categoryMatches && trigger.isCurrentlyActive;
    });
  }

  /**
   * Processes a trigger reset activation request.
   * @param {TriggerEvent} triggerToActivateReset - The trigger to reset and reactivate
   */
  processTriggerResetActivation(triggerToActivateReset) {
    const index = this.findTriggerIndexByReference(triggerToActivateReset);
    if (index !== -1) {
      this.allActiveTriggers[index].resetTriggerState();
    }
  }

  /**
   * Finds a trigger by its unique identifier.
   * @param {string} triggerIdToSearchFor - The unique identifier of the trigger
   * @returns {TriggerEvent|null} The found trigger or null if not found
   */
  findTriggerById(triggerIdToSearchFor) {
    return (
      this.allActiveTriggers.find(
        (trigger) => trigger.triggerUniqueId === triggerIdToSearchFor
      ) || null
    );
  }

  /**
   * Finds the index of a trigger in the active triggers array.
   * @param {TriggerEvent} triggerReferenceToSearchFor - Reference to the trigger to find
   * @returns {number} The index of the trigger or -1 if not found
   */
  findTriggerIndexByReference(triggerReferenceToSearchFor) {
    return this.allActiveTriggers.findIndex(
      (trigger) => trigger === triggerReferenceToSearchFor
    );
  }

  /**
   * Retrieves all triggers of a specified type.
   * @param {string} triggerTypeToSearchFor - The type of triggers to find
   * @returns {Array} Array of triggers matching the specified type
   */
  retrieveAllTriggersOfRequestedType(triggerTypeToSearchFor) {
    return this.allActiveTriggers.filter(
      (trigger) => trigger.triggerType === triggerTypeToSearchFor
    );
  }

  /**
   * Registers a new trigger in the active triggers list.
   * @param {TriggerEvent} trigger - The trigger to register
   */
  registerActiveTrigger(trigger) {
    this.allActiveTriggers.push(trigger);
  }

  /**
   * Removes a trigger from the active triggers list.
   * @param {TriggerEvent} trigger - The trigger to deregister
   */
  deregisterActiveTrigger(trigger) {
    this.allActiveTriggers = this.allActiveTriggers.filter(
      (t) => t !== trigger
    );
  }

  /**
   * Queues a trigger for processing in the next update cycle.
   * @param {TriggerEvent} trigger - The trigger to queue
   */
  queueTriggerForPopping(trigger) {
    if (this.allActiveTriggers.includes(trigger)) {
      this.triggerBackupBuffer.push(trigger);
      this.activeTriggersReadyToPop.push(trigger);
    } else {
      console.warn("Trigger not found in active triggers list.");
    }
  }

  /**
   * Processes all triggers that are ready to be activated.
   * Removes processed triggers from the ready queue and backup buffer.
   */
  popReadyTriggers() {
    for (let i = this.activeTriggersReadyToPop.length - 1; i >= 0; i--) {
      const trigger = this.activeTriggersReadyToPop[i];
      if (trigger.ready) {
        this.activeTriggersReadyToPop.splice(i, 1);
        const backupIndex = this.triggerBackupBuffer.indexOf(trigger);
        if (backupIndex !== -1) {
          this.triggerBackupBuffer.splice(backupIndex, 1);
        }
      }
    }
  }
}
