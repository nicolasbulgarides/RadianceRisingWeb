/**
 * Contains metadata for identifying and categorizing programmatic animations.
 * Acts as a lightweight header structure for animation organization and lookup.
 */
class ProgrammaticAnimationHeader {
  /**
   * Represents the header for a programmatic animation.
   * @param {string} animationUniqueId - Unique identifier for the animation.
   * @param {string} animationName - Name of the animation.
   * @param {string} animationCategory - Category of the animation.
   */
  constructor(animationUniqueId, animationName, animationCategory) {
    this.animationUniqueId = animationUniqueId;
    this.animationName = animationName;
    this.animationCategory = animationCategory;
  }
}
