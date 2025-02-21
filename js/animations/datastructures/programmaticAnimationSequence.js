/**
 * Represents a sequence of programmatic animations that can be played in order.
 * Manages multiple animations as a cohesive unit with shared playback controls
 * and trigger events.
 */
class ProgrammaticAnimationSequence {
  constructor(
    animationSequenceUniqueId,
    animationSequenceName,
    animationSequenceCategory,
    animationSequenceAllProgrammaticAnimations
  ) {
    this.animationSequenceUniqueId = animationSequenceUniqueId;
    this.animationSequenceName = animationSequenceName;
    this.animationSequenceCategory = animationSequenceCategory;
    this.animationSequenceAllProgrammaticAnimations =
      animationSequenceAllProgrammaticAnimations;

    this.sequenceHasFinished = false;
    this.sequenceDurationElapsed = 0;
    this.sequenceIsPlaying = false;
    this.sequenceIsPaused = false;
    this.sequenceIsStopped = true;
    this.sequenceIsReversed = false;
    this.sequenceTriggerEvents = [];
  }

  clearTriggerEvents() {
    this.sequenceTriggerEvents = [];
  }

  registerTriggerEvent(triggerEvent) {
    this.sequenceTriggerEvents.push(triggerEvent);
  }

  togglePause() {
    this.sequenceIsPaused = !this.sequenceIsPaused;
  }

  toggleReverse() {
    this.sequenceIsReversed = !this.sequenceIsReversed;
  }

  stop() {
    this.sequenceIsPlaying = false;
    this.sequenceIsStopped = true;
  }

  /**
   * Resets the entire animation sequence to its initial state instantly.
   */
  resetFullSequenceInstantly() {
    this.sequenceIsPlaying = false;
    this.sequenceIsStopped = true;
    this.sequenceIsReversed = false;
    this.sequenceIsPaused = false;
    this.sequenceDurationElapsed = 0;
    this.sequenceHasFinished = false;

    for (const animation of this.animationSequenceAllProgrammaticAnimations) {
      animation.instantReset();
    }
  }
}
