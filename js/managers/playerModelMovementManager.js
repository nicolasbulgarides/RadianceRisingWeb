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
  initMovement(durationInSeconds) {
    if (this.currentPlayer == null) {
      console.log("Player is null still!");
    }
    this.startPosition =
      this.currentPlayer.getPlayerPositionAndModelManager().currentPosition;

    console.log(
      "PLayer pos: " + this.startPosition.x + " , " + this,
      this.startPosition.y + " , " + this.startPosition.z
    );
    this.endPosition =
      this.currentPlayer.getPlayerPositionAndModelManager().pathingDestination;
    this.totalDistance = BABYLON.Vector3.Distance(
      this.startPosition,
      this.endPosition
    );

    this.durationInSeconds = this.totalDistance / durationInSeconds; // Total duration in seconds
    this.totalFrames = durationInSeconds * Config.FPS; // Total frames for the movement
    this.currentFrame = 0; // Current frame during the movement

    // Calculate the total distance between start and end positions

    // Calculate the movement per frame (linear movement per frame)
    this.movementPerFrame = this.totalDistance / this.totalFrames;

    // Calculate the direction vector
    this.direction = this.endPosition.subtract(this.startPosition).normalize(); // Unit vector
    this.movementActive = true;
  }

  registerPlayer(player) {
    this.currentPlayer = player;
  }
  /**
   * Calculates the next position based on the total number of frames.
   * If the movement is completed, it resets automatically.
   * @returns {BABYLON.Vector3} - The next position of the object in the movement.
   */
  getNextPosition() {
    // If the movement has finished, automatically reset the movement
    if (this.currentFrame >= this.totalFrames) {
      this.resetMovement(); // Reset to start position
      return this.endPosition;
    }

    // Calculate how much movement to apply this frame (based on linear movement)
    const movementDistance = this.movementPerFrame;

    // Calculate the new position by moving along the direction vector
    const movementVector = this.direction.scale(movementDistance);

    // Increment the current frame count
    this.currentFrame++;

    // Move the object by a fixed amount each frame, without multiplying by currentFrame
    return this.startPosition.add(movementVector.scale(this.currentFrame));
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
      vectorMovement = this.getNextPosition();

      // Validate the vector components
      if (
        isFinite(vectorMovement.x) &&
        isFinite(vectorMovement.y) &&
        isFinite(vectorMovement.z)
      ) {
        // If valid, update the position
        this.currentPlayer.setPosition(
          vectorMovement.x,
          vectorMovement.y,
          vectorMovement.z
        );
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
