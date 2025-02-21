/**
 * PlayerModelMovementManager
 *
 * This class manages smooth movement for the player's model.
 * It calculates movement vectors, divides the movement over frames using BabylonJS's Vector3 operations,
 * and updates the player's position accordingly.
 */
class PlayerModelMovementManager {
  /**
   * Initializes the movement manager with a given player's unit.
   *
   * @param {PlayerUnit} player - The player unit instance for movement management.
   */
  constructor(player) {
    // The player unit that will be moved.
    this.currentPlayer = player;
    // Flag to indicate if a movement process is currently active.
    this.movementActive = false;
  }

  /**
   * Initializes movement parameters based on speed.
   * Retrieves start and target positions, computes the movement direction, total distance,
   * and determines the number of frames needed.
   *
   * @param {number} speed - Movement speed in units per second.
   */
  initMovement(speed) {
    if (!this.currentPlayer) {
      // Ensure a valid player exists.
      console.error("No player to move!");
      return;
    }

    // Retrieve the starting position from the player's position manager.
    this.startPosition =
      this.currentPlayer.getPlayerPositionAndModelManager().currentPosition;
    ChadUtilities.describeVector("Start: ", this.startPosition, "Movement");
    // Retrieve the destination position defined for the player's pathing.
    this.endPosition =
      this.currentPlayer.getPlayerPositionAndModelManager().pathingDestination;
    // Compute the total distance to travel.
    this.totalDistance = BABYLON.Vector3.Distance(
      this.startPosition,
      this.endPosition
    );
    ChadUtilities.describeVector("End: ", this.endPosition, "Movement");
    ChadUtilities.describeVector("Path: ", this.startPosition, "Movement");

    if (this.totalDistance > 0) {
      // Calculate a normalized vector representing the direction of movement.
      this.direction = this.endPosition
        .subtract(this.startPosition)
        .normalize();
    } else {
      // If no movement is required, warn and assign a zero vector to prevent errors.
      console.warn(
        "Warning: No movement required, start and end positions are the same."
      );
      this.direction = BABYLON.Vector3.Zero(); // Prevent potential NaN values.
    }
    // Determine the duration of the movement based on the provided speed.
    this.durationInSeconds = this.totalDistance / speed;
    // Calculate the total number of frames using the game's FPS configuration.
    this.totalFrames = Math.ceil(this.durationInSeconds * Config.FPS);
    // Reset the current frame counter.
    this.currentFrame = 0;

    // Recompute the movement direction for consistency.
    this.direction = this.endPosition.subtract(this.startPosition).normalize();

    // Calculate the movement vector that should be applied on each frame.
    this.movementPerFrame = this.direction.scale(
      this.totalDistance / this.totalFrames
    );

    // Mark the movement as active.
    this.movementActive = true;
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

  /**
   * Resets the movement process, deactivating movement and resetting frame counter.
   */
  resetMovement() {
    // Turn off the movement active flag.
    this.movementActive = false;
    // Reset the frame counter to restart any future movement.
    this.currentFrame = 0;
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
   * Processes model movement on the player's unit if movement is active.
   * Validates the computed vector and updates the player's model position instantly.
   */
  processPossibleModelMovements() {
    if (this.movementActive) {
      // Calculate the next position based on movement progression.
      let vectorMovement = this.getNextPosition();

      // Validate that all components in the movement vector are finite numbers.
      if (
        isFinite(vectorMovement.x) &&
        isFinite(vectorMovement.y) &&
        isFinite(vectorMovement.z)
      ) {
        // Update the player's position immediately via the position manager.
        this.currentPlayer
          .getPlayerPositionAndModelManager()
          .setPositionRelocateModelInstantly(vectorMovement);
      } else {
        // Log an error if invalid movement data is detected.
        console.error(
          "Invalid position detected in vector movement:",
          vectorMovement
        );
      }
    }
  }
}
