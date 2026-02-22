/**
 * UndoManager
 *
 * Manages an unlimited undo stack for player moves.
 * Snapshots are pushed by GameplayManagerComposite immediately before each valid move.
 *
 * Snapshot structure:
 *   {
 *     position:       BABYLON.Vector3  — player position before the move
 *     realMoveCount:  number           — movementTracker.realMoveCount before the move
 *     eventLogLength: number           — movementTracker.eventLog.length before the move
 *     health:         number           — player health before the move
 *   }
 *
 * Fires "radianceUndoStackChanged" with { canUndo: bool, stackSize: number }
 * on every push, pop, and clear so the undo button can update its appearance.
 */
class UndoManager {
  static _stack = [];

  /**
   * Push a state snapshot onto the stack.
   * @param {{ position: BABYLON.Vector3, realMoveCount: number, eventLogLength: number, health: number }} snapshot
   */
  static pushSnapshot(snapshot) {
    UndoManager._stack.push(snapshot);
    UndoManager._notifyChange();
  }

  /** Returns true if there is at least one move to undo. */
  static canUndo() {
    return UndoManager._stack.length > 0;
  }

  /**
   * Undoes the last move by restoring position, health, and move counter.
   * @returns {boolean} True if undo was performed, false if stack was empty.
   */
  static undo() {
    if (!UndoManager.canUndo()) return false;
    const snapshot = UndoManager._stack.pop();

    try {
      // Restore player position
      const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
      const player = gameplayManager?.primaryActiveGameplayLevel?.currentPrimaryPlayer;
      if (player && player.playerMovementManager) {
        player.playerMovementManager.setPositionRelocateModelInstantly(snapshot.position.clone());
      }

      // Restore health via PlayerStatusTracker
      const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
      if (playerStatusTracker && snapshot.health !== undefined) {
        playerStatusTracker.setCurrentHealth(snapshot.health);
        playerStatusTracker.updateHealthUI();
      }

      // Restore movement tracker state (move count + event log)
      const movementTracker = FundamentalSystemBridge["movementTracker"];
      if (movementTracker) {
        if (snapshot.realMoveCount !== undefined) {
          movementTracker.realMoveCount = snapshot.realMoveCount;
        }
        if (movementTracker.eventLog && snapshot.eventLogLength !== undefined) {
          movementTracker.eventLog.splice(snapshot.eventLogLength);
        }
      }

      // Bust the perfection tracker cache so it re-renders immediately
      const uiInstance = window.gameUIInstance;
      if (uiInstance) {
        uiInstance._lastMoveCount = -1;
        if (typeof uiInstance.updatePerfectionTracker === "function") {
          uiInstance.updatePerfectionTracker();
        }
      }

      if (window.RenderController) window.RenderController.markDirty(30);
    } catch (e) {
      console.warn("[UndoManager] Undo failed:", e);
    }

    UndoManager._notifyChange();
    return true;
  }

  /**
   * Clears the undo stack.
   * Call this when a new level starts or the current level is reset.
   */
  static clear() {
    UndoManager._stack = [];
    UndoManager._notifyChange();
  }

  static _notifyChange() {
    try {
      window.dispatchEvent(new CustomEvent("radianceUndoStackChanged", {
        detail: { canUndo: UndoManager.canUndo(), stackSize: UndoManager._stack.length }
      }));
    } catch (e) {}
  }
}

window.UndoManager = UndoManager;
