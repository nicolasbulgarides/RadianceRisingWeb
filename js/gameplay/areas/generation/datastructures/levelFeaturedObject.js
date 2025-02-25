/**
 * Represents a featured object within a game level, which can be decorative, interactive, or an obstacle.
 * This class manages the properties and behavior of special objects that can be placed in game levels.
 */
class LevelFeaturedObject {
  /**
   * Creates a new LevelFeaturedObject instance.
   * @param {string} objectId - Unique identifier for the featured object
   * @param {string} objectNickname - Human-readable name for the object
   * @param {Object} positionedObject - Reference to the positioned object in the game world
   * @param {string} specialGraphic - Path or reference to any special graphics for this object
   * @param {boolean} isDecoration - Indicates if the object is purely decorative
   * @param {boolean} isObstacle - Indicates if the object acts as an obstacle in the game
   * @param {boolean} isInteractiveObject - Indicates if players can interact with this object
   * @param {boolean} doesAppearOnLevelLoad - Determines if object appears immediately when level loads
   * @param {string} specialAppearanceTriggerId - ID of trigger that controls object's appearance
   */
  constructor(
    objectId = "-no-level-featured-object-id-",
    objectNickname = "-no-level-featured-object-nickname-",
    positionedObject = "-no-level-featured-object-positioned-object-",
    specialGraphic = "-no-level-featured-object-special-graphic-",
    isDecoration = false,
    isObstacle = false,
    isInteractiveObject = false,
    doesAppearOnLevelLoad = true,
    specialAppearanceTriggerId = "-no-level-featured-object-special-appearance-trigger-id-"
  ) {
    this.objectId = objectId;
    this.objectNickname = objectNickname;
    this.positionedObject = positionedObject;
    this.specialGraphic = specialGraphic;
    this.isDecoration = isDecoration;
    this.isObstacle = isObstacle;
    this.isInteractiveObject = isInteractiveObject;
    this.doesAppearOnLevelLoad = doesAppearOnLevelLoad;
    this.specialAppearanceTriggerId = specialAppearanceTriggerId;
  }
}
