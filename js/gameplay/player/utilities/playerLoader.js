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
  static loadModelAndPosition(player, position) {
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
    player.loadMovementManager(playerModelObject, position);
  }

  /**
   * Generates a demo player instance with default settings.
   * The player is loaded with fresh status parameters and positioned using the level data.
   *
   * @param {ActiveGameplayLevel|LevelDataComposite} levelData - The level data that provides the player's starting position.
   * @returns {PlayerUnit} - A newly created and initialized player unit.
   */
  static getFreshPlayer(levelData) {
    // Instantiate a new PlayerUnit object.
    let gamePlayer = new PlayerUnit();

    // Validate the player instance
    if (!(gamePlayer instanceof PlayerUnit)) {
      console.error("Failed to create valid PlayerUnit instance");
      return null;
    }

    // Load the player's status with default values (full health and magic).
    gamePlayer.loadStatusFresh(
      Config.DEFAULT_NAME, // Player name.
      Config.STARTING_LEVEL, // Starting level.
      Config.STARTING_MAGICPOINTS, // Starting magic points.
      Config.STARTING_EXP, // Starting experience.
      Config.STARTING_HEALTH, // Base magic points (using starting health as placeholder).
      Config.STARTING_HEALTH, // Base health points.
      Config.DEFAULT_MAX_SPEED // Base max speed.
    );

    // Retrieve the player's starting position from the level data
    let position = this.getPlayerStartingPosition(levelData);

    // Load the player's model and set its position.
    PlayerLoader.loadModelAndPosition(gamePlayer, position);

    // Validate the player has all required components
    if (!gamePlayer.playerStatus || !gamePlayer.playerMovementManager) {
      console.error(
        "Player initialization incomplete - missing required components"
      );
      return null;
    }

    // Return the fully initialized player unit.
    return gamePlayer;
  }

  /**
   * Extracts the player starting position from various level data formats
   * @param {ActiveGameplayLevel|LevelDataComposite|Object} levelData - The level data
   * @returns {BABYLON.Vector3} The player starting position
   */
  static getPlayerStartingPosition(levelData) {
    // If it's an ActiveGameplayLevel, use its method
    if (levelData instanceof ActiveGameplayLevel) {
      return levelData.getPlayerStartPosition();
    }

    // If it's a LevelDataComposite, extract from its properties
    if (levelData.levelHeaderData && levelData.levelGameplayTraitsData) {
      const dimensions = {
        width: levelData.customGridSize?.width || 11,
        depth: levelData.customGridSize?.depth || 21,
      };

      const startX =
        levelData.playerStartPosition?.x || Math.floor(dimensions.width / 2);
      const startY = levelData.playerStartPosition?.y || 0.25;
      const startZ =
        levelData.playerStartPosition?.z || Math.floor(dimensions.depth / 2);

      return new BABYLON.Vector3(startX, startY, startZ);
    }

    // to do update logging
    // Default fallback position
    console.warn(
      "PlayerLoader: Could not determine player starting position, using default"
    );
    return new BABYLON.Vector3(5, 0.25, 10);
  }
}
