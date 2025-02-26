/**
 * Data structure for tracking minigame-related accomplishments.
 *
 * This flexible structure can track accomplishments in various minigames
 * that might be integrated into the main game (fishing, farming, crafting, etc.).
 * It captures what minigame was played, what was accomplished, and to what degree.
 *
 * A philosopher may ponder what is the difference between a minigame and a game...
 */
class AccomplishmentMinigameData {
  /**
   * Creates a new minigame accomplishment data instance
   * @param {string} idOfMinigame - Unique identifier for the minigame
   * @param {string} minigameName - Display name of the minigame
   * @param {string} minigameCategory - Category of the minigame
   * @param {string} minigameAccompishmentType - Type of accomplishment within the minigame
   * @param {number} accomplishmentMagnitude - Numeric measure of the accomplishment's significance
   * @param {string} minigameLocation - Where the minigame accomplishment occurred
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    idOfMinigame,
    minigameName,
    minigameCategory,
    minigameAccompishmentType,
    accomplishmentMagnitude,
    minigameLocation,
    otherRelevantData
  ) {
    this.idOfMinigame = idOfMinigame;
    this.minigameName = minigameName;
    this.minigameCategory = minigameCategory;
    this.minigameAccompishmentType = minigameAccompishmentType;
    this.accomplishmentMagnitude = accomplishmentMagnitude;
    this.minigameLocation = minigameLocation;
    this.otherRelevantData = otherRelevantData;
  }
}
