/**
 * PlayerModelMovementManager
 *
 * This class manages smooth movement for the player's model.
 * It calculates movement vectors, divides the movement over frames using BabylonJS's Vector3 operations,
 * and updates the player's position accordingly.
 */
class PlayerMovementManager {
  /**
   * Initializes the movement manager with a given player's unit.
   *
   * @param {PlayerUnit} player - The player unit instance for movement management.
   */
  constructor(player, playerModelObject, position) {
    // The player unit that will be moved.
    this.currentPlayer = player;
    this.playerModelPositionedObject = playerModelObject;

    // Flag to indicate if a movement process is currently active.
    this.movementActive = false;
    this.pathingDestination = null;
    this.currentPosition = position;
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

  // Call this method once to start the movement.
  startMovement(speed) {
    if (!this.currentPlayer) {
      console.error("No player to move!");
      return;
    }

    // Check that the destination exists and is a valid BABYLON.Vector3.
    if (
      !this.pathingDestination ||
      !(this.pathingDestination instanceof BABYLON.Vector3)
    ) {
      console.error("Invalid or missing pathing destination!");
      return;
    }

    // Validate speed.
    if (speed <= 0) {
      console.error("Invalid speed provided. Speed must be greater than zero.");
      return;
    }

    // Validate FPS configuration.
    if (!Config.FPS || Config.FPS <= 0) {
      console.error("Invalid FPS configuration!");
      return;
    }

    // Retrieve starting and destination positions.
    this.startPosition = this.currentPosition;
    this.endPosition = this.pathingDestination;

    // Compute the total distance to travel.
    this.totalDistance = BABYLON.Vector3.Distance(
      this.startPosition,
      this.endPosition
    );

    if (this.totalDistance > 0) {
      // Compute the movement direction.
      this.currentPlayer.playerStatus.playerCurrentActionStatus.setInDirectionalMotion(
        true
      );
      this.direction = this.endPosition
        .subtract(this.startPosition)
        .normalize();

      // Calculate the duration of the movement.
      this.durationInSeconds = this.totalDistance / speed;

      // Calculate total frames.
      this.totalFrames = Math.max(
        1,
        Math.ceil(this.durationInSeconds * Config.FPS)
      );
      this.currentFrame = 0;
      // Calculate the movement vector to be applied each frame.
      this.movementPerFrame = this.direction.scale(
        this.totalDistance / this.totalFrames
      );
      console.log("Movement per frame:", this.movementPerFrame);

      // Mark the movement as active.
      this.movementActive = true;
    } else {
      this.direction = BABYLON.Vector3.Zero(); // Prevent potential NaN values.
      this.movementActive = false;
      return;
    }
  }

  // Call this method every frame (e.g., in your game loop) to update the movement.
  updatePositionBasedOffVelocity() {
    if (!this.movementActive) {
      return;
    }
    // If all frames have been processed, ensure the player is exactly at the end position and stop moving.
    if (this.currentFrame > this.totalFrames) {
      this.currentPosition = this.pathingDestination.clone();
      this.relocateToCurrentPositionInstantly();
      this.resetMovement();
      return;
    }

    // Update the player's position.
    this.currentPosition.addInPlace(this.movementPerFrame);
    this.currentFrame++;
    this.relocateToCurrentPositionInstantly();
  }

  /**
   * Logs details about the initialized movement parameters.
   * Note: The variable "speed" is not defined in this scope; adjust if necessary.
   */
  describeMovement() {
    // Log movement parameters including duration and frame count.
    console.log(
      `Movement initialized: Speed = ${
        /* speed variable missing here */ "N/A"
      }, Duration = ${this.durationInSeconds.toFixed(2)}s, Frames = ${
        this.totalFrames
      }`
    );
  }

  /**
   * Registers a new player unit with the manager.
   *
   * @param {PlayerUnit} player - The player unit that should be managed.
   */
  registerPlayer(player) {
    // Update the current player unit.
    this.currentPlayer = player;
  }

  /**
   * Computes and returns the next target position for the moving player based on the frame count.
   * Increments the movement frame and calculates a scaled movement vector.
   *
   * @returns {BABYLON.Vector3} - The updated position vector.
   */
  getNextPosition() {
    if (!this.movementActive) {
      // If movement is not active, return the starting position.
      return this.startPosition;
    }

    // Check if the movement has reached or exceeded the total frames.
    if (this.currentFrame >= this.totalFrames) {
      // If complete, reset movement state and return the final destination.
      this.resetMovement();
      return this.endPosition;
    }

    // Validate that the movement vector components are finite.
    if (
      !isFinite(this.movementPerFrame.x) ||
      !isFinite(this.movementPerFrame.y) ||
      !isFinite(this.movementPerFrame.z)
    ) {
      // Log an error and reset if invalid data is encountered.
      console.error("Invalid movement vector detected!", this.movementPerFrame);
      this.resetMovement();
      return this.startPosition;
    }

    // Calculate the cumulative movement vector based on the current frame.
    const movementVector = this.movementPerFrame.scale(this.currentFrame + 1);

    // Increment the frame counter for the next calculation.
    this.currentFrame++;

    // Compute the new position by adding the movement vector to the start position.
    let updatedPosition = this.startPosition.add(movementVector);

    /** 
    // For frame-by-frame debugging, uncomment the following:
    console.log(
      `Updated pos: x${updatedPosition.x}, y ${updatedPosition.y}, z${updatedPosition.z}`
    );
    */
    return updatedPosition;
  }

  setDestinationAndBeginMovement(destinationVector, relevantPlayer) {
    let currentSpeed = relevantPlayer.playerStatus.currentMaxSpeed;

    console.log(
      "Setting destination and beginning movement...current speed" +
        currentSpeed
    );

    // Set the player's destination in the position/model manager.
    this.setDestination(destinationVector);
    this.startMovement(currentSpeed);
  }

  /**
   * Resets the movement process, deactivating movement and resetting frame counter.
   */
  resetMovement() {
    // Turn off the movement active flag.
    this.movementActive = false;
    // Reset the frame counter to restart any future movement.
    this.currentFrame = 0;
    let status = this.currentPlayer.playerStatus.playerCurrentActionStatus;
    status.setInDirectionalMotion(false);
  }

  /**
   * Calculates the per-frame shift vector based on the normalized movement direction.
   *
   * @returns {BABYLON.Vector3} - The movement vector for one frame.
   */
  getMovementPerFrame() {
    // Returns the frame shift vector by scaling the normalized direction.
    return this.direction.scale(this.movementPerFrame);
  }

  /**
   * Checks whether the movement process has been completed.
   *
   * @returns {boolean} - True if the current frame exceeds or equals total frames, else false.
   */
  isMovementComplete() {
    return this.currentFrame >= this.totalFrames;
  }

  /**
   * Updates the target destination for the player's pathing logic.
   *
   * @param {BABYLON.Vector3} destination - The intended destination vector.
   */
  setDestination(destination) {
    this.pathingDestination = destination;
  }
}
