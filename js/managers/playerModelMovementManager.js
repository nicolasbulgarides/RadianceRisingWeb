class PlayerModelMovementManager {
  constructor(player) {
    this.currentPlayer = player;
    this.movementActive = false;
  }
  /**
   * Initializes the movement from a start position to an end position over a set number of frames.
   * @param {BABYLON.Vector3} startPosition - The starting position (X, Y, Z).
   * @param {BABYLON.Vector3} endPosition - The target position (X, Y, Z).
   * @param {number} durationInSeconds - Total duration in seconds for the movement.
   * @param {number} framesPerSecond - Number of frames per second (FPS), default is 60.
   */
  /**
   * Initializes the movement from a start position to an end position based on speed.
   * @param {number} speed - Speed in units per second.
   */
  initMovement(speed) {
    if (!this.currentPlayer) {
      console.error("No player to move!");
      return;
    }

    this.startPosition =
      this.currentPlayer.getPlayerPositionAndModelManager().currentPosition;
    this.endPosition =
      this.currentPlayer.getPlayerPositionAndModelManager().pathingDestination;
    this.totalDistance = BABYLON.Vector3.Distance(
      this.startPosition,
      this.endPosition
    );
    if (this.totalDistance > 0) {
      this.direction = this.endPosition
        .subtract(this.startPosition)
        .normalize();
    } else {
      console.warn(
        "Warning: No movement required, start and end positions are the same."
      );
      this.direction = BABYLON.Vector3.Zero(); // Prevent NaN values
    }
    // Calculate duration dynamically based on speed
    this.durationInSeconds = this.totalDistance / speed;
    this.totalFrames = Math.ceil(this.durationInSeconds * Config.FPS);
    this.currentFrame = 0;

    // Calculate movement direction (unit vector)
    this.direction = this.endPosition.subtract(this.startPosition).normalize();

    this.movementPerFrame = this.direction.scale(
      this.totalDistance / this.totalFrames
    );

    this.movementActive = true;
  }

  describeMovement() {
    console.log(
      `Movement initialized: Speed = ${speed}, Duration = ${this.durationInSeconds.toFixed(
        2
      )}s, Frames = ${this.totalFrames}`
    );
  }

  registerPlayer(player) {
    this.currentPlayer = player;
  }
  getNextPosition() {
    if (!this.movementActive) {
      return this.startPosition;
    }

    // If the movement has finished, reset and return final position
    if (this.currentFrame >= this.totalFrames) {
      this.resetMovement();
      return this.endPosition;
    }

    // Ensure movementPerFrame is valid
    if (
      !isFinite(this.movementPerFrame.x) ||
      !isFinite(this.movementPerFrame.y) ||
      !isFinite(this.movementPerFrame.z)
    ) {
      console.error("Invalid movement vector detected!", this.movementPerFrame);
      this.resetMovement();
      return this.startPosition;
    }

    // Calculate movement vector per frame
    const movementVector = this.movementPerFrame.scale(this.currentFrame + 1);

    this.currentFrame++;

    // Compute new position safely
    let updatedPosition = this.startPosition.add(movementVector);

    /** 
    // Log for debugging
    console.log(
      `Updated pos: x${updatedPosition.x}, y ${updatedPosition.y}, z${updatedPosition.z}`
    );
*/
    return updatedPosition;
  }

  /**
   * Resets the movement to start from the initial position and resets the frame counter.
   */
  resetMovement() {
    this.movementActive = false;
    this.currentFrame = 0; // Reset the frame count
  }

  /**
   * Get the movement shifts per frame for a fixed number of frames.
   * @returns {BABYLON.Vector3} - The movement shift per frame.
   */
  getMovementPerFrame() {
    return this.direction.scale(this.movementPerFrame);
  }

  /**
   * Checks if the movement is complete (if current frame exceeds total frames).
   * @returns {boolean} - Returns true if movement is complete, otherwise false.
   */
  isMovementComplete() {
    return this.currentFrame >= this.totalFrames;
  }

  processPossibleModelMovements() {
    if (this.movementActive) {
      let vectorMovement = this.getNextPosition();

      // Validate the vector components
      if (
        isFinite(vectorMovement.x) &&
        isFinite(vectorMovement.y) &&
        isFinite(vectorMovement.z)
      ) {
        // If valid, update the position
        this.currentPlayer
          .getPlayerPositionAndModelManager()
          .setPositionRelocateModelInstantly(vectorMovement);
      } else {
        // Log an error if any component of the vector is invalid
        console.error(
          "Invalid position detected in vector movement:",
          vectorMovement
        );
      }
    }
  }
}
