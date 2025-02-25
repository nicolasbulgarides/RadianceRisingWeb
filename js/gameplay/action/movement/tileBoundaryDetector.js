/**
 * TileBoundaryDetector
 *
 * Monitors player movement and detects when they cross tile boundaries.
 * Integrates with the ActiveTriggerManager to handle tile-based triggers.
 */
class TileBoundaryDetector {
  /**
   * Gets the current tile position based on the player's world position.
   *
   * @returns {Object} The current tile coordinates
   */
  static getPlayerCurrentTilePosition(playerToEvaluate) {
    const position = playerToEvaluate.playerMovementManager.getPositionVector();
    return {
      x: Math.floor(position.x),
      z: Math.floor(position.z),
    };
  }

  /**
   * Checks if the player has moved to a new tile.
   *
   * @returns {boolean} True if the player has moved to a new tile
   */
  static hasPlayerHasChangedTiles(playerToEvaluate) {
    let lastKnownTilePosition =
      playerToEvaluate.playerMovementManager.lastCrossedTileBoundary;
    const currentTilePosition =
      TileBoundaryDetector.getPlayerCurrentTilePosition(playerToEvaluate);
    let hasChangedPosition = false;
    if (!lastKnownTilePosition || !currentTilePosition) {
      hasChangedPosition = false;
    }

    return hasChangedPosition;
  }

  /**
   * Gets the board slot at the current player position.
   *
   * @returns {BoardSlot|null} The board slot at the current position or null if invalid
   */
  static getCurrentBoardSlot() {
    const position = this.getCurrentTilePosition();

    // Validate position is within map bounds
    if (
      position.x >= 0 &&
      position.x < this.levelMap.mapWidth &&
      position.z >= 0 &&
      position.z < this.levelMap.mapDepth
    ) {
      return this.levelMap.boardSlots[position.x][position.z];
    }

    return null;
  }

  /**
   * Updates the detector state and processes any triggers.
   * Should be called each frame or movement update.
   */
  static frameByFrameCheck(levelMap, player, triggerManagerToAlert) {
    let hasChangedTiles = TileBoundaryDetector.hasPlayerHasChangedTiles(player);

    if (hasChangedTiles) {
      let currentBoardSlot = TileBoundaryDetector.getCurrentBoardSlot(
        levelMap,
        player
      );

      if (currentBoardSlot) {
        let registeredTrigger = currentBoardSlot.registeredActiveTrigger;
        if (registeredTrigger) {
          triggerManagerToAlert.queueTriggerForPopping(registeredTrigger);
        }
      }
    }

    if (this.hasChangedTiles()) {
      this.checkAndProcessTriggers();
    }
  }

  /**
   * Gets a description of the current state for debugging.
   *
   * @returns {string} A formatted description of the current state
   */
  static describeCurrentState() {
    const currentPosition = this.getCurrentTilePosition();
    const currentSlot = this.getCurrentBoardSlot();

    return `TileBoundaryDetector Status:
        Current Tile: (${currentPosition.x}, ${currentPosition.z})
        Last Known Tile: (${this.lastKnownTilePosition.x}, ${
      this.lastKnownTilePosition.z
    })
        Has Active Trigger: ${
          currentSlot?.registeredActiveTrigger ? "Yes" : "No"
        }`;
  }
}
