/**
 * Represents a programmatic animation that can be applied to one or more 3D models.
 * Handles position, rotation, and scale animations with support for playback control
 * including pause, reverse, and restart functionality.
 */
class ProgrammaticAnimation {
  constructor(
    programmaticAnimationHeader,
    programmaticAnimationAffectedModels,
    programmaticAnimationValues,
    programmaticAnimationTriggerEvents,
    programmaticAnimationPlaybackStatus
  ) {
    this.programmaticAnimationHeader = programmaticAnimationHeader;
    this.programmaticAnimationAffectedModels =
      programmaticAnimationAffectedModels;
    this.programmaticAnimationValues = programmaticAnimationValues;
    this.programmaticAnimationTriggerEvents =
      programmaticAnimationTriggerEvents;
    this.programmaticAnimationPlaybackStatus =
      programmaticAnimationPlaybackStatus;
  }

  /**
   * Clears all registered trigger events for the animation.
   */
  clearTriggerEvents() {
    this.programmaticAnimationTriggerEvents = [];
  }

  /**
   * Registers a new trigger event for the animation.
   * @param {ProgrammaticAnimationTriggerEvent} triggerEventToRegister - The event to register.
   */
  registerTriggerEvent(triggerEventToRegister) {
    this.programmaticAnimationTriggerEvents.push(triggerEventToRegister);
  }

  /**
   * Applies animation frame shifts based on delta time
   * @param {number} delta - Time elapsed since last frame
   */
  applyAnimationFrameShiftsByDelta(delta) {
    if (
      !this.programmaticAnimationPlaybackStatus.playbackIsPlaying ||
      this.programmaticAnimationPlaybackStatus.playbackIsPaused
    ) {
      return;
    }

    // Calculate frame shifts
    const frameShift =
      ProgrammaticAnimationFrameShiftCalculator.calculateFrameShift(
        delta,
        this.programmaticAnimationValues,
        this.programmaticAnimationPlaybackStatus
      );

    // Apply shifts to all affected models
    for (const model of this.programmaticAnimationAffectedModels) {
      model.position.addInPlace(frameShift.positionShiftVector);
      model.rotation.addInPlace(frameShift.rotationShiftVector);
      model.scaling.addInPlace(frameShift.scaleShiftVector);
    }

    // Update playback status
    this.programmaticAnimationPlaybackStatus.addDeltaDurationInMilliseconds(
      delta
    );

    let timeToTriggerEvent =
      this.programmaticAnimationPlaybackStatus.getIfTimeToTriggerEvent();

    if (timeToTriggerEvent) {
      for (const triggerEvent of this.programmaticAnimationTriggerEvents) {
        FundamentalSystemBridge[activeTriggerManager].addTriggerEventToPop(
          triggerEvent
        );
      }
    }

    this.programmaticAnimationPlaybackStatus.checkIfTimeToDoPlaybackEndShifts();
  }

  /**
   * Toggles the pause state of the animation.
   */
  togglePause() {
    this.programmaticAnimationPlaybackStatus.togglePlaybackIsPaused();
  }

  /**
   * Toggles the reverse state of the animation playback.
   */
  toggleReverse() {
    this.programmaticAnimationPlaybackStatus.togglePlaybackIsReversed();
  }

  /**
   * Stops the animation playback immediately.
   */
  stop() {
    this.programmaticAnimationPlaybackStatus.forceStopPlayback();
  }

  /**
   * Starts the animation playback.
   */
  start() {
    this.programmaticAnimationPlaybackStatus.forceStartPlayback();
  }

  /**
   * Restarts the animation playback from the beginning.
   */
  restart() {
    this.programmaticAnimationPlaybackStatus.restartPlayback();
  }

  /**
   * Toggles the state for teleporting to the beginning of the animation.
   */
  toggleReadyToTeleportToBeginning() {
    this.programmaticAnimationPlaybackStatus.togglePrimedForTeleportToBeginning();
  }
}
