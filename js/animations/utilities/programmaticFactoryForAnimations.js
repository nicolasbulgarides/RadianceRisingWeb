/**
 * Factory class for creating fully formed programmatic animations and their components.
 * Provides static methods to construct animation objects with proper initialization
 * and configuration of all required properties.
 *
 * This class has an irregular name because Cursor IDE on 2-20-2025 would not let me accept changes until I remade the file and I have other things to do
 */

class ProgrammaticFactoryForAnimations {
  /**
   * Creates a fully formed programmatic animation with all required properties.
   * @param {ProgrammaticAnimationHeader} programmaticAnimationHeader - Header for the animation.
   * @param {Array} programmaticAnimationAffectedModels - Models affected by the animation.
   * @param {ProgrammaticAnimationValues} programmaticAnimationValues - Values for the animation.
   * @param {Array} programmaticAnimationTriggerEvents - Trigger events for the animation.
   * @param {ProgrammaticAnimationPlaybackStatus} programmaticAnimationPlaybackStatus - Playback status for the animation.
   * @returns {ProgrammaticAnimation} The created animation.
   */
  static createFullyFormedProgrammaticAnimation(
    programmaticAnimationHeader,
    programmaticAnimationAffectedModels,
    programmaticAnimationValues,
    programmaticAnimationTriggerEvents,
    programmaticAnimationPlaybackStatus
  ) {
    const animation = new ProgrammaticAnimation(
      programmaticAnimationHeader,
      programmaticAnimationAffectedModels,
      programmaticAnimationValues,
      programmaticAnimationTriggerEvents,
      programmaticAnimationPlaybackStatus
    );
    return animation;
  }

  static formProgrammaticAnimationHeader(
    animationUniqueId,
    animationName,
    animationCategory
  ) {
    const programmaticAnimationHeader = new ProgrammaticAnimationHeader(
      animationUniqueId,
      animationName,
      animationCategory
    );
    return programmaticAnimationHeader;
  }

  static formProgrammaticAnimationValues(
    animationUniqueId = "-no-programmation-animation-unique-id",
    startPositionVector = BABYLON.Vector3.Zero(),
    endPositionVector = BABYLON.Vector3.Zero(),
    startRotationVector = BABYLON.Vector3.Zero(),
    endRotationVector = BABYLON.Vector3.Zero(),
    startScaleVector = BABYLON.Vector3.One(),
    endScaleVector = BABYLON.Vector3.One(),
    radiusOfOrbit = 0,
    momentOfInitialPosition = 0 //where between 0 and 1 (start to end / loop) does an animation begin upon triggering)
  ) {
    const programmaticAnimationValues = new ProgrammaticAnimationValues(
      animationUniqueId,
      startPositionVector,
      endPositionVector,
      startRotationVector,
      endRotationVector,
      startScaleVector,
      endScaleVector,
      radiusOfOrbit,
      momentOfInitialPosition
    );
    return programmaticAnimationValues;
  }

  static formProgrammaticAnimationTriggerEvents(
    animationUniqueId = "-no-programmation-animation-unique-id",
    triggerEventName = "-no-programmation-animation-trigger-event-name",
    triggerEventCategory = "-no-programmation-animation-trigger-event-category"
  ) {
    const programmaticAnimationTriggerEvents =
      new ProgrammaticAnimationTriggerEvents(
        animationUniqueId,
        triggerEventName,
        triggerEventCategory
      );
    return programmaticAnimationTriggerEvents;
  }
}
