/**
 * PlayerStatusComposite
 *
 * This class encapsulates the status of a player, including level, experience,
 * magic points, and health points. It provides methods for updating these properties over time.
 */
class PlayerStatusComposite {
  /**
   * Constructs a new PlayerStatus instance.
   *
   * @param {string} name - The player's name.
   * @param {number} currentLevel - The player's current level.
   * @param {number} currentExp - The player's current experience points.
   * @param {number} currentMagicPoints - The player's current magic points.
   * @param {number} maximumMagicPoints - The player's maximum magic points.
   * @param {number} currentHealthPoints - The player's current health points.
   * @param {number} maximumHealthPoints - The player's maximum health points.
   * @param {number} baseMaxSpeed - The player's base max speed.
   */

  constructor(
    name,
    currentLevel,
    currentExp,
    currentMagicLevel,
    currentMagicPoints,
    maximumMagicPoints,
    currentHealthPoints,
    maximumHealthPoints,
    baseMaxSpeed
  ) {
    this.name = name;
    // Set the player's current level.
    this.currentLevel = currentLevel;
    this.currentMagicLevel = currentMagicLevel;
    // Set the current experience points.
    this.currentExperience = currentExp;
    // Initialize current and maximum magic points.
    this.currentMagicPoints = currentMagicPoints;
    this.maximumMagicPoints = maximumMagicPoints;
    // Initialize current and maximum health points.

    this.currentHealthPoints = currentHealthPoints;
    this.maximumHealthPoints = maximumHealthPoints;
    this.playerCurrentActionStatus = new PlayerCurrentActionStatus(this);
    this.playerInventoryMain = new PlayerInventory();
    this.playerInventoryBackup = null;
    this.playerUnlocksComposite = new PlayerUnlocksComposite();
    this.baseMaxSpeed = baseMaxSpeed;
    this.currentMaxSpeed = baseMaxSpeed;
  }

  replacePlayerMainInventory(newPlayerInventory) {
    this.playerInventoryBackup = this.playerInventoryMain;
    this.playerInventoryMain = newPlayerInventory;
  }

  restorePlayerMainInventory() {
    this.playerInventoryMain = this.playerInventoryBackup;
    this.playerInventoryBackup = null;
  }

  addOrSubtractMultipleItemsFromInventory(allItemsToAddOrSubtract) {}

  addOrSubtractItemFromInventory(itemName, quantity) {}

  /**
   * Factory method to return a new PlayerStatus instance with full magic and health.
   *
   * @param {string} name - The player's name.
   * @param {number} currentLevel - The starting level.
   * @param {number} currentExp - The starting experience points.
   * @param {number} maximumMagic - The maximum magic points.
   * @param {number} maximumHealth - The maximum health points.
   * @returns {PlayerStatus} - A new PlayerStatus instance with current values equal to maximum.
   */
  static getPlayerStatusFresh(
    name = "-default-fresh-player-name-",
    currentLevel = 1,
    currentExp = 0,
    currentMagicLevel = 1,
    maximumMagicPoints = 2,
    maximumHealthPoints = 3,
    baseMaxSpeed = 1
  ) {
    // Create a new instance with current magic and health reflecting the maximum values.
    let status = new PlayerStatusComposite(
      name,
      currentLevel,
      currentExp,
      currentMagicLevel,
      maximumMagicPoints,
      maximumMagicPoints,
      maximumHealthPoints,
      maximumHealthPoints,
      baseMaxSpeed
    );

    return status;
  }

  setPlayerCurrentMaxSpeed(newMaxSpeed) {
    this.currentMaxSpeed = newMaxSpeed;
  }

  resetPlayerCurrentMaxSpeed() {
    this.currentMaxSpeed = this.baseMaxSpeed;
  }

  /**
   *
   * @param {PlayerInventory} playerInventory - The player's inventory - storing this is called from the networking class PlayerSaveRetrieval, which retrieves the player save and sequentially
   * stores the specific values such as inventory
   */

  registerPlayerInventory(playerInventory) {
    this.playerInventory = playerInventory;
  }

  /**
   * Adds experience to the player and triggers a level up if thresholds are met.
   *
   * @param {number} amount - The amount of experience points to add.
   */

  addExperience(amount) {
    // TODO: Implement the logic to add experience and check for level up conditions.
  }

  /**
   * Increases the player's level and optionally boosts attributes.
   */
  levelUp() {
    // TODO: Implement level-up logic including attribute increases.
  }

  /**
   * Reduces the player's health by a specified damage amount.
   *
   * @param {number} amount - The damage amount.
   */
  takeDamage(amount) {
    // TODO: Implement damage logic for reducing health.
  }

  /**
   * Restores a portion of the player's health.
   *
   * @param {number} amount - The amount of health to restore.
   */
  heal(amount) {
    // TODO: Implement healing logic.
  }

  /**
   * Deducts magic points as the player uses magic.
   *
   * @param {number} amount - The amount of magic points to consume.
   */
  useMagic(amount) {
    // TODO: Implement logic to reduce magic points.
  }

  /**
   * Restores the player's magic points.
   *
   * @param {number} amount - The amount of magic points to restore.
   */
  restoreMagic(amount) {
    // TODO: Implement magic restoration logic.
  }

  /**
   * Handles the logic required when the player dies.
   */
  die() {
    // TODO: Implement player death logic (e.g., resetting state, triggering animations).
  }
}
