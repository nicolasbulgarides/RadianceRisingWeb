class SpecialOccurrenceManager {
  // Constructor for managing all occurrences in the game.
  constructor() {
    this.pickupOccurrenceSubManager = new PickupOccurrenceSubManager();
  }

  processPickupOccurrence(occurrence) {
    this.pickupOccurrenceSubManager.processPickupOccurrence(occurrence);
  }
}
