/**
 * Main calculator class that delegates movement destination calculations to appropriate specialized calculators
 * based on the game mode rules and movement type.
 */
class MovementDestinationManager {
  /**
   * Determines the type of movement and delegates to appropriate calculator
   * @param {string} direction - Movement direction
   * @param {GameLevelPlane} activeGameLevelPlane - The active game level
   * @param {Player} relevantPlayer - The player being moved
   * @returns {BABYLON.Vector3} The calculated destination position
   */
  static getDestinationVector(direction, activeGameLevelPlane, relevantPlayer) {
    let currentGamemodeRules = activeGameLevelPlane.gameModeRules;
    let bounded = currentGamemodeRules.MOVEMENT_IS_BOUNDED;
    let maxDistance = currentGamemodeRules.MAX_MOVEMENT_DISTANCE;
    let ignoreObstacles = currentGamemodeRules.OBSTACLES_ARE_IGNORED;

    if (bounded) {
      return BoundedDestinationCalculator.getDestinationVector(
        direction,
        ignoreObstacles,
        maxDistance,
        activeGameLevelPlane,
        relevantPlayer
      );
    } else {
      return UnboundedDestinationCalculator.getDestinationVector(
        direction,
        ignoreObstacles,
        activeGameLevelPlane,
        relevantPlayer
      );
    }
  }
}
