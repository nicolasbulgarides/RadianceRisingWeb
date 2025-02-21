class ActiveTriggerManager {
  // Constructor for managing active triggers in the game.
  constructor() {
    this.allActiveTriggers = []; // Array to store all active triggers.
    this.triggerBackupBuffer = []; // Backup buffer for triggers.
    this.activeTriggersReadyToPop = []; // List of triggers ready to be processed.
  }

  // Find a trigger by its unique ID.
  findTriggerById(triggerIdToSearchFor) {
    for (const trigger of this.allActiveTriggers) {
      if (trigger.triggerUniqueId === triggerIdToSearchFor) {
        return trigger; // Return the found trigger.
      }
    }
    return null; // Return null if not found.
  }

  // Find the index of a trigger by its reference.
  findTriggerIndexByReference(triggerReferenceToSearchFor) {
    for (let i = 0; i < this.allActiveTriggers.length; i++) {
      if (this.allActiveTriggers[i] === triggerReferenceToSearchFor) {
        return i; // Return the index of the found trigger.
      }
    }
  }

  // Retrieve all triggers of a specific type.
  retrieveAllTriggersOfRequestedType(triggerTypeToSearchFor) {
    const triggersOfRequestedType = [];
    for (const trigger of this.allActiveTriggers) {
      if (trigger.triggerType === triggerTypeToSearchFor) {
        triggersOfRequestedType.push(trigger); // Add matching triggers to the list.
      }
    }
    return triggersOfRequestedType; // Return the list of matching triggers.
  }

  // Register a new active trigger.
  registerActiveTrigger(trigger) {
    this.allActiveTriggers.push(trigger); // Add the trigger to the active list.
  }

  // Deregister an active trigger.
  deregisterActiveTrigger(trigger) {
    this.allActiveTriggers = this.allActiveTriggers.filter(
      (t) => t !== trigger // Remove the trigger from the active list.
    );
  }

  // Queue a trigger for processing.
  queueTriggerForPopping(trigger) {
    if (this.allActiveTriggers.includes(trigger)) {
      this.triggerBackupBuffer.push(trigger); // Add to backup buffer.
      this.activeTriggersReadyToPop.push(trigger); // Mark as ready to pop.
    } else {
      console.warn("Trigger not found in active triggers list."); // Log warning if not found.
    }
  }

  // Process triggers that are ready to pop.
  popReadyTriggers() {
    for (let i = this.activeTriggersReadyToPop.length - 1; i >= 0; i--) {
      const trigger = this.activeTriggersReadyToPop[i];
      if (trigger.ready) {
        console.log("Popping trigger:", trigger.triggerUniqueId); // Log the popped trigger.
        this.activeTriggersReadyToPop.splice(i, 1); // Remove from ready-to-pop list.

        // Optionally, remove it from the backup buffer as well.
        const backupIndex = this.triggerBackupBuffer.indexOf(trigger);
        if (backupIndex !== -1) {
          this.triggerBackupBuffer.splice(backupIndex, 1); // Remove from backup buffer.
        }
      }
    }
  }
}
