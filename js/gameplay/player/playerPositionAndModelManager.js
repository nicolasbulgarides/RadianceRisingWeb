/**
 * PlayerPositionAndModelManager
 *
 * This class manages the player's model and position.
 * It handles updates to the player's position and ensures the model is relocated instantly if required.
 */
class PlayerPositionAndModelManager {
  /**
   * Constructs the position and model manager with an initial model object and position.
   *
   * @param {Object} playerModelObject - The object that encapsulates the player's model and positioning methods.
   * @param {BABYLON.Vector3} position - The initial position of the player's model.
   */
  constructor(playerModelObject, position) {
    // Store the provided player model object.
    this.playerModelPositionedObject = playerModelObject;
    // Set the current position with the given initial position.
    this.currentPosition = position;
    // Initialize pathing destination; will be set later as needed.
    this.pathingDestination = null;
  }

  /**
   * Updates the target destination for the player's pathing logic.
   *
   * @param {BABYLON.Vector3} destination - The intended destination vector.
   */
  setCurrentPathingDestination(destination) {
    this.pathingDestination = destination;
  }

  /**
   * Retrieves the current position of the player.
   *
   * @returns {BABYLON.Vector3} - The current position vector.
   */
  getPositionVector() {
    return this.currentPosition;
  }

  /**
   * Updates the player's position without triggering an immediate model update.
   *
   * @param {BABYLON.Vector3} positionVector - The new position to be set.
   */
  setPositionNoMotion(positionVector) {
    // Directly update the internal position without animation.
    this.currentPosition = positionVector;
  }

  /**
   * Adjusts the player's current position by an adjustment vector without triggering model relocation.
   *
   * @param {BABYLON.Vector3} adjustmentVector - The vector used to adjust the current position.
   */
  adjustPositionNoMotion(adjustmentVector) {
    // Compute the new position by adding the adjustment to the current position.
    this.currentPosition = new BABYLON.Vector3(
      adjustmentVector.x + this.currentPosition.x,
      adjustmentVector.y + this.currentPosition.y,
      adjustmentVector.z + this.currentPosition.z
    );
  }

  /**
   * Adjusts the player's position using an adjustment vector and immediately relocates the model to the new position.
   *
   * @param {BABYLON.Vector3} adjustmentVector - The vector adjustment for the current position.
   */
  adjustPositionRelocateModelInstantly(adjustmentVector) {
    // First, update the position without motion.
    this.adjustPositionNoMotion(adjustmentVector);
    // Then, update the model to reflect the new position immediately.
    this.relocateToCurrentPositionInstantly();
  }

  /**
   * Sets a new position and immediately updates the model's location.
   *
   * @param {BABYLON.Vector3} positionVector - The new position vector.
   */
  setPositionRelocateModelInstantly(positionVector) {
    // Update the current position without animation.
    this.setPositionNoMotion(positionVector);
    // Instantly relocate the model to the updated position.
    this.relocateToCurrentPositionInstantly();
  }

  /**
   * Instantly relocates the player's model to the internally stored current position.
   */
  relocateToCurrentPositionInstantly() {
    // Call the model's setPosition method to update its position in the scene.
    this.playerModelPositionedObject.setPosition(this.currentPosition);
  }

  /**
   * Retrieves the actual player model from the positioned object.
   *
   * @returns {Object} - The player's model.
   */
  getPlayerModelDirectly() {
    if (this.playerModelPositionedObject == null) {
      // Log a message if the model object is not available.
      console.log("NULL!");
    }
    return this.playerModelPositionedObject.model;
  }

  /**
   * Returns the positioned object that encapsulates the player's model and associated methods.
   *
   * @returns {Object} - The player model positioned object.
   */
  getPlayerModelPositionedObject() {
    return this.playerModelPositionedObject;
  }
}
