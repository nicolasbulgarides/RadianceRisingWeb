/**
 * PlayerUnit
 *
 * Represents the player entity. This class ties together positional management and status.
 * It provides methods to load fresh or partially depleted statuses and to access the player's model.
 */
class PlayerUnit {
  /**
   * Initializes the player's position manager using the provided model object and initial position.
   *
   * @param {Object} playerModelPositionedObject - The object containing the player's model and position methods.
   * @param {BABYLON.Vector3} position - The starting position of the player.
   */
  loadPositionManager(playerModelPositionedObject, position) {
    this.playerPositionAndModelManager = new PlayerPositionAndModelManager(
      playerModelPositionedObject,
      position
    );
  }

  /**
   * Loads a fresh player status with full magic and health.
   *
   * @param {string} name - The player's name.
   * @param {number} currentLevel - The starting level.
   * @param {number} currentExperience - The initial experience points.
   * @param {number} baseMagicPoints - The base magic points (full value).
   * @param {number} baseHealthPoints - The base health points (full value).
   */
  loadStatusFresh(
    name,
    currentLevel,
    currentExperience,
    baseMagicPoints,
    baseHealthPoints
  ) {
    // Initialize a fresh status using the factory method.
    this.playerStatus = PlayerStatusComposite.getPlayerStatusFresh(
      name,
      currentLevel,
      currentExperience,
      baseMagicPoints,
      baseHealthPoints
    );
  }

  /**
   * Loads a player status with partially depleted magic and health points.
   * Useful in cases such as saved games or mid-game updates.
   *
   * @param {string} name - The player's name.
   * @param {number} currentLevel - The player's current level.
   * @param {number} currentExperience - The player's current experience points.
   * @param {number} baseMagicPoints - The player's maximum magic points.
   * @param {number} currentMagicPoints - The player's current magic points.
   * @param {number} baseHealthPoints - The player's maximum health points.
   * @param {number} currentHealthPoints - The player's current health points.
   */
  loadStatusPartiallyDepleted(
    name,
    currentLevel,
    currentExperience,
    baseMagicPoints,
    currentMagicPoints,
    baseHealthPoints,
    currentHealthPoints
  ) {
    // Directly create a new PlayerStatus with the provided partial values.
    this.playerStatus = new PlayerStatus(
      name,
      currentLevel,
      currentExperience,
      currentMagicPoints, // Current magic points.
      baseMagicPoints, // Maximum magic points.
      currentHealthPoints, // Current health points.
      baseHealthPoints // Maximum health points.
    );
  }

  /**
   * Retrieves the player's position and model manager.
   *
   * @returns {PlayerPositionAndModelManager} - The manager handling the player's positional data.
   */
  getPlayerPositionAndModelManager() {
    return this.playerPositionAndModelManager;
  }

  /**
   * Directly retrieves the player's model from the position manager.
   *
   * @returns {Object} - The player's model object.
   */
  getPlayerModelDirectly() {
    return this.getPlayerPositionAndModelManager().getPlayerModelDirectly();
  }

  /**
   * Returns the player's status information.
   *
   * @returns {PlayerStatus} - The current status of the player.
   */
  getPlayerStatus() {
    return this.playerStatus;
  }
}
