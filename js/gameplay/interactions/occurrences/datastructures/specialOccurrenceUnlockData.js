class SpecialOccurrenceUnlockData {
  // Constructor for managing unlock data related to occurrences.
  constructor(
    itemsUnlocked = null, // Items that have been unlocked.
    spellsUnlocked = null, // Spells that have been unlocked.
    artifactsUnlocked = null, // Artifacts that have been unlocked.
    levelsUnlocked = null, // Levels that have been unlocked.
    worldsUnlocked = null, // Worlds that have been unlocked.
    specialAreasUnlocked = null, // Special areas that have been unlocked.
    specialEventsUnlocked = null, // Special events that have been unlocked.
    petsUnlocked, // Pets that have been unlocked.
    gameModesUnlocked = null, // Game modes that have been unlocked.
    otherPlaceholderUnlockData = null // Placeholder for any other unlock data.
  ) {
    this.itemsUnlocked = itemsUnlocked;
    this.spellsUnlocked = spellsUnlocked;
    this.artifactsUnlocked = artifactsUnlocked;
    this.levelsUnlocked = levelsUnlocked;
    this.worldsUnlocked = worldsUnlocked;
    this.specialAreasUnlocked = specialAreasUnlocked;
    this.specialEventsUnlocked = specialEventsUnlocked;
    this.petsUnlocked = petsUnlocked;
    this.gameModesUnlocked = gameModesUnlocked;
    this.otherPlaceholderUnlockData = otherPlaceholderUnlockData;
  }
}
