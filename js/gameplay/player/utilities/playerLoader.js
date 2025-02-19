/**
 * PlayerLoader
 *
 * This class is responsible for loading a player's model and initializing its position.
 * It creates a positioned object from the default configuration and assigns it to the player.
 */
class PlayerLoader {
  /**
   * Loads the player's model and assigns its starting position.
   *
   * @param {PlayerUnit} player - The player unit instance.
   * @param {BABYLON.Vector3} position - The position to place the player's model.
   */
  loadModelAndPosition(player, position) {
    // Create a positioned object using the default model configuration and assign it to the specified position.
    const playerModelObject = PositionedObject.getPositionedObjectQuick(
      Config.DEFAULT_MODEL, // Default model from configuration.
      position, // Set the initial position.
      1.0, // Scale factor (uniform scale).
      false, // No rotation.
      false, // No physics simulation.
      false // No additional flags.
    );

    // Load the player's position manager with the created model object and the provided position.
    player.loadPositionManager(playerModelObject, position);
    // Inline debug option: Uncomment the next line for logging the default model.
    // console.log("Default model: " + Config.DEFAULT_MODEL);
  }

  /**
   * Generates a demo player instance with default settings.
   * The player is loaded with fresh status parameters and positioned using the default map.
   *
   * @param {Object} defaultMap - The map object that provides the player's starting position.
   * @returns {PlayerUnit} - A newly created and initialized player unit.
   */
  getDemoPlayer(defaultMap) {
    // Instantiate a new PlayerUnit object.
    let gamePlayer = new PlayerUnit();

    // Load the player's status with default values (full health and magic).
    gamePlayer.loadStatusFresh(
      Config.DEFAULT_NAME, // Player name.
      Config.STARTING_LEVEL, // Starting level.
      Config.STARTING_EXP, // Starting experience.
      Config.STARTING_HEALTH, // Base magic points (using starting health as placeholder).
      Config.STARTING_HEALTH // Base health points.
    );

    // Retrieve the player's starting position from the map.
    let position = defaultMap.getPlayerStartingPosition();
    /** 
    // Debug: Uncomment for logging the player's starting position.
    console.log(
      "Position: " + position.x + " , " + position.y + " , " + position.z
    );
    */
    // Load the player's model and set its position.
    this.loadModelAndPosition(gamePlayer, position);

    // Return the fully initialized player unit.
    return gamePlayer;
  }
}
