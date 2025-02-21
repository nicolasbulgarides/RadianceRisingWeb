/**
 * Central manager for handling all programmatic animations in the application.
 * Maintains registries of animations and sequences, handles their lifecycle,
 * and provides methods for animation lookup and management.
 */
class ProgrammaticAnimationManager {
  constructor() {
    this.allRegisteredAnimations = [];
    this.allCurrentlyPlayingAnimations = [];
    this.allRegisteredAnimationSequences = [];
    this.allCurrentlyPlayingAnimationSequences = [];
  }

  registerAnimation(animation) {
    this.allRegisteredAnimations.push(animation);
  }

  deregisterAnimation(animation) {
    this.allRegisteredAnimations = this.allRegisteredAnimations.filter(
      (a) => a !== animation
    );
  }

  retrieveAllAnimationsOfRequestedType(animationType) {
    const animationsOfRequestedType = [];
    for (const animation of this.allRegisteredAnimations) {
      if (animation.animationType === animationType) {
        animationsOfRequestedType.push(animation);
      }
    }
    return animationsOfRequestedType;
  }

  registerAnimationSequence(animationSequence) {
    this.allRegisteredAnimationSequences.push(animationSequence);
  }

  deregisterAnimationSequence(animationSequence) {
    this.allRegisteredAnimationSequences =
      this.allRegisteredAnimationSequences.filter(
        (a) => a !== animationSequence
      );
  }
}
