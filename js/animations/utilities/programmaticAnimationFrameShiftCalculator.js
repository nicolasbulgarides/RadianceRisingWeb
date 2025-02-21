class ProgrammaticAnimationFrameShiftCalculator {
  /**
   * Calculates the frame shift for the animation based on delta time and current playback status.
   * @param {number} deltaTime - Time elapsed since last frame.
   * @param {ProgrammaticAnimationValues} programmaticAnimation - The animation values.
   * @param {ProgrammaticAnimationPlaybackStatus} programmaticAnimationPlaybackStatus - Current playback status.
   * @returns {ProgrammaticFrameShift} The calculated frame shift.
   */
  static calculateFrameShift(
    deltaTime,
    programmaticAnimation,
    programmaticAnimationPlaybackStatus
  ) {
    let positionShiftVector = this.calculatePositionShiftVector(
      deltaTime,
      programmaticAnimation.startPositionVector,
      programmaticAnimation.endPositionVector,
      programmaticAnimationPlaybackStatus
    );

    let rotationShiftVector = this.calculateRotationShiftVector(
      deltaTime,
      programmaticAnimation.startRotationVector,
      programmaticAnimation.endRotationVector,
      programmaticAnimationPlaybackStatus
    );

    let scaleShiftVector = this.calculateScaleShiftVector(
      deltaTime,
      programmaticAnimation.startScaleVector,
      programmaticAnimation.endScaleVector,
      programmaticAnimationPlaybackStatus
    );

    let programmaticFrameShift = new ProgrammaticFrameShift(
      positionShiftVector,
      rotationShiftVector,
      scaleShiftVector
    );

    return programmaticFrameShift;
  }

  /**
   * Calculates position shift based on start/end positions and animation status
   * @param {number} deltaTime - Time elapsed since last frame in milliseconds
   * @param {BABYLON.Vector3} startPosition - Starting position vector
   * @param {BABYLON.Vector3} endPosition - Target position vector
   * @param {ProgrammaticAnimationPlaybackStatus} programmaticAnimationPlaybackStatus - Current animation state
   * @returns {BABYLON.Vector3} Position shift to apply this frame
   */
  static calculatePositionShiftVector(
    deltaTime,
    startPosition,
    endPosition,
    programmaticAnimationPlaybackStatus
  ) {
    // Calculate total distance vector
    const totalDistance = endPosition.subtract(startPosition);

    // Calculate progress ratio based on elapsed time and duration
    const progressRatio = this.calculateProgressRatio(
      deltaTime,
      programmaticAnimationPlaybackStatus
    );

    // Apply easing if specified
    const easedProgress = this.applyEasing(
      progressRatio,
      programmaticAnimationPlaybackStatus.easingFunction
    );

    // Calculate frame shift based on direction
    const frameShift = programmaticAnimationPlaybackStatus.playbackIsInReverse
      ? totalDistance.scale(-easedProgress)
      : totalDistance.scale(easedProgress);

    return frameShift;
  }

  /**
   * Calculates rotation shift based on start/end rotations and animation status
   * @param {number} deltaTime - Time elapsed since last frame in milliseconds
   * @param {BABYLON.Vector3} startRotation - Starting rotation vector (in radians)
   * @param {BABYLON.Vector3} endRotation - Target rotation vector (in radians)
   * @param {ProgrammaticAnimationPlaybackStatus} programmaticAnimationPlaybackStatus - Current animation state
   * @returns {BABYLON.Vector3} Rotation shift to apply this frame
   */
  static calculateRotationShiftVector(
    deltaTime,
    startRotation,
    endRotation,
    programmaticAnimationPlaybackStatus
  ) {
    // Calculate total rotation difference
    const totalRotation = endRotation.subtract(startRotation);

    // Calculate progress ratio
    const progressRatio = this.calculateProgressRatio(
      deltaTime,
      programmaticAnimationPlaybackStatus
    );

    // Apply easing
    const easedProgress = this.applyEasing(
      progressRatio,
      programmaticAnimationPlaybackStatus.easingFunction
    );

    // Calculate frame rotation
    const frameRotation =
      programmaticAnimationPlaybackStatus.playbackIsInReverse
        ? totalRotation.scale(-easedProgress)
        : totalRotation.scale(easedProgress);

    return frameRotation;
  }

  /**
   * Calculates scale shift based on start/end scales and animation status
   * @param {number} deltaTime - Time elapsed since last frame in milliseconds
   * @param {BABYLON.Vector3} startScale - Starting scale vector
   * @param {BABYLON.Vector3} endScale - Target scale vector
   * @param {ProgrammaticAnimationPlaybackStatus} programmaticAnimationPlaybackStatus - Current animation state
   * @returns {BABYLON.Vector3} Scale shift to apply this frame
   */
  static calculateScaleShiftVector(
    deltaTime,
    startScale,
    endScale,
    programmaticAnimationPlaybackStatus
  ) {
    // Calculate total scale change
    const totalScaleChange = endScale.subtract(startScale);

    // Calculate progress ratio
    const progressRatio = this.calculateProgressRatio(
      deltaTime,
      programmaticAnimationPlaybackStatus
    );

    // Apply easing
    const easedProgress = this.applyEasing(
      progressRatio,
      programmaticAnimationPlaybackStatus.easingFunction
    );

    // Calculate frame scale change
    const frameScale = programmaticAnimationPlaybackStatus.playbackIsInReverse
      ? totalScaleChange.scale(-easedProgress)
      : totalScaleChange.scale(easedProgress);

    return frameScale;
  }

  /**
   * Calculates animation progress ratio based on elapsed time and duration
   * @private
   */
  static calculateProgressRatio(deltaTime, playbackStatus) {
    const duration = playbackStatus.doesUseSpeedMultiplierOverride
      ? playbackStatus.defaultDurationInMilliseconds /
        playbackStatus.playbackSpeedMultiplier
      : playbackStatus.defaultDurationInMilliseconds;

    return deltaTime / duration;
  }

  /**
   * Applies easing function to progress ratio
   * @private
   */
  static applyEasing(progress, easingFunction = "linear") {
    // Default linear interpolation
    if (!easingFunction || easingFunction === "linear") return progress;

    // Add additional easing functions as needed
    const easingFunctions = {
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    };

    return easingFunctions[easingFunction]?.(progress) ?? progress;
  }
}
