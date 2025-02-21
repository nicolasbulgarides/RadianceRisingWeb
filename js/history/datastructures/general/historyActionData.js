// Represents data related to an action performed by the player.
// This includes movement, usage of spells, artifacts, and items.
class HistoryActionData {
  constructor(
    actionCategory, // Category of the action (e.g., "movement", "spell").
    directionMovedIn, // Direction in which the player moved.
    distanceMoved, // Distance moved by the player.
    spellUsed, // Spell used by the player.
    artifactUsed, // Artifact used by the player.
    itemUsed, // Item used by the player.
    interactiveObjectUsedType, // Type of interactive object used.
    interactiveObjectUsedId // ID of the interactive object used.
  ) {
    // Initialize properties with provided values.
    this.actionCategory = actionCategory;
    this.directionMovedIn = directionMovedIn;
    this.distanceMoved = distanceMoved;
    this.spellUsed = spellUsed;
    this.artifactUsed = artifactUsed;
    this.itemUsed = itemUsed;
    this.interactiveObjectUsedType = interactiveObjectUsedType;
    this.interactiveObjectUsedId = interactiveObjectUsedId;
  }

  // Consider adding a method to serialize the action data for storage or transmission.
  // serialize() {
  //   return JSON.stringify(this);
  // }
}
