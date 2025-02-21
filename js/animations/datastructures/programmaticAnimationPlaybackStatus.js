/**
 * Manages the playback state and timing of a programmatic animation.
 * Handles duration, speed multipliers, looping, reversing, and other playback controls.
 * Provides methods for manipulating animation playback and checking completion status.
 */
class ProgrammaticAnimationPlaybackStatus {
  constructor(
    animationUniqueId = "-no-programmatic-animation-unique-id-playback-status-",
    defaultDurationInMilliseconds = 0,
    doesUseSpeedMultiplierOverride = false,
    playbackSpeedMultiplier = 0,
    autoLoops = false,
    autoReverses = false,
    teleportsToBeginning = false,
    defaultResetDurationInMilliseconds = 0,
    doesUseResetSpeedMultiplier = false,
    resetSpeedMultiplier = 0
  ) {
    this.animationUniqueId = animationUniqueId;
    this.defaultDurationInMilliseconds = defaultDurationInMilliseconds;
    this.doesUseSpeedMultiplierOverride = doesUseSpeedMultiplierOverride;
    this.playbackSpeedMultiplier = playbackSpeedMultiplier;
    this.autoLoops = autoLoops;
    this.autoReverses = autoReverses;
    this.teleportsToBeginning = teleportsToBeginning;
    this.doesUseResetSpeedMultiplier = doesUseResetSpeedMultiplier;
    this.defaultResetDurationInMilliseconds =
      defaultResetDurationInMilliseconds;
    this.resetDurationInMillisecondsPostOverride = 0;
    this.resetSpeedMultiplier = resetSpeedMultiplier;

    this.setResetDurationInMillisecondsPostOverride();
    this.initializePlaybackStatusValues();
  }

  setResetDurationInMillisecondsPostOverride() {
    if (this.doesUseResetSpeedMultiplier) {
      this.resetDurationInMillisecondsPostOverride =
        this.defaultDurationInMilliseconds / this.resetSpeedMultiplier;
    }
  }

  /**
   * Adds elapsed time to the playback duration.
   * @param {number} deltaDurationInMilliseconds - Time to add to the elapsed duration.
   */
  addDeltaDurationInMilliseconds(deltaDurationInMilliseconds) {
    this.playbackDurationInMillisecondsElapsed += deltaDurationInMilliseconds;
  }

  /**
   * Checks if it's time to perform playback end shifts based on the current state.
   */
  checkIfTimeToDoPlaybackEndShifts() {
    if (this.doesUseResetSpeedMultiplier) {
      this.useResetSpeedMultiplierForPossiblePlaybackEndShifts();
    } else if (!this.doesUseResetSpeedMultiplier) {
      this.useDefaultDurationForPossiblePlaybackEndShifts();
    }
  }

  conditionalPlaybackEndShifts() {
    if (this.autoLoops) {
      this.initializePlaybackStatusValues();
      this.forceStartPlayback();
    }
    if (this.autoReverses) {
      this.togglePlaybackIsReversed();
    }

    if (this.teleportsToBeginning) {
      this.primedForTeleportToBeginning = true;
    }
  }

  /**
   * Restarts the playback of the animation.
   */
  restartPlayback() {
    this.initializePlaybackStatusValues();
    this.forceStartPlayback();
  }

  resetPlaybackDontRestart() {
    this.initializePlaybackStatusValues();
  }

  /**
   * Initializes the playback status values for the animation.
   */
  initializePlaybackStatusValues() {
    this.playbackIsPlaying = false;
    this.playbackIsStopped = true;
    this.playbackHasStarted = false;
    this.playbackIsPaused = false;
    this.playbackIsInReverse = false;
    this.playbackDurationInMillisecondsElapsed = 0;
    this.primedForTeleportToBeginning = false;
  }

  useDefaultDurationForPossiblePlaybackEndShifts() {
    if (
      this.playbackDurationInMillisecondsElapsed >
      this.defaultDurationInMilliseconds
    ) {
      this.conditionalPlaybackEndShifts();
      return true;
    }
    return false;
  }

  getIfTimeToTriggerEvent() {
    if (this.doesUseResetSpeedMultiplier) {
      if (
        this.playbackDurationInMillisecondsElapsed >
        this.resetDurationInMillisecondsPostOverride
      ) {
        return true;
      }
    } else if (!this.doesUseResetSpeedMultiplier) {
      if (
        this.playbackDurationInMillisecondsElapsed >
        this.defaultDurationInMilliseconds
      ) {
        return true;
      }
    }
    return false;
  }

  useResetSpeedMultiplierForPossiblePlaybackEndShifts() {
    if (
      this.playbackDurationInMillisecondsElapsed >
      this.resetDurationInMillisecondsPostOverride
    ) {
      this.conditionalPlaybackEndShifts();
      return true;
    }
    return false;
  }

  togglePlaybackIsPaused() {
    this.playbackIsPaused = !this.playbackIsPaused;
  }

  togglePlaybackIsReversed() {
    this.playbackIsInReverse = !this.playbackIsInReverse;
  }

  togglePrimedForTeleportToBeginning() {
    this.primedForTeleportToBeginning = !this.primedForTeleportToBeginning;
  }

  /**
   * Forces the playback to start.
   */
  forceStartPlayback() {
    this.playbackIsPlaying = true;
    this.playbackIsStopped = false;
  }

  /**
   * Forces the playback to stop.
   */
  forceStopPlayback() {
    this.playbackIsPlaying = false;
    this.playbackIsStopped = true;
  }
}
