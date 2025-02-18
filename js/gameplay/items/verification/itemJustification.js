/**
 * The ItemJustification class encapsulates the criteria used to justify the player's acquisition
 * of an item. It aggregates characteristics from both the current level progress and the player's
 * long-term stored status. This dual perspective enables the game logic to determine an item's
 * appropriateness based on transient progress and enduring achievements.
 *
 * - playerCurrentLevelProgress: Represents the ephemeral metrics and state data specific to the current game level
 *   (e.g., current score, puzzles solved, tokens collected).
 * - playerStatusComposite: Contains long-term or saved attributes of the player such as overall skill levels,
 *   achievements, and persistent upgrades.
 *
 * @class
 */
class ItemJustification {
  /**
   * Constructs a new instance of ItemJustification.
   *
   * @param {string} itemName - The identifier or name of the item being evaluated.
   * @param {Object} playerCurrentLevelProgress - Metrics and state of the player in the current level, used for immediate game logic.
   * @param {Object} playerStatusComposite - Persistent player attributes stored over long-term gameplay.
   */
  constructor(itemName, itemRequirements) {
    this.itemName = itemName;
    this.playerCurrentLevelProgress = playerCurrentLevelProgress;
    this.playerStatusComposite = playerStatusComposite;
  }
}
