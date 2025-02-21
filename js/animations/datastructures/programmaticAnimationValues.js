/**
 * Stores the transformation values for a programmatic animation.
 * Contains start and end vectors for position, rotation, and scale,
 * as well as additional parameters for orbital and initial positioning.
 */
class ProgrammaticAnimationValues {
  /**
   * Represents the transformation values for a programmatic animation.
   * @param {string} animationUniqueId - Unique identifier for the animation.
   * @param {BABYLON.Vector3} startPositionVector - Starting position vector.
   * @param {BABYLON.Vector3} endPositionVector - Target position vector.
   * @param {BABYLON.Vector3} startRotationVector - Starting rotation vector.
   * @param {BABYLON.Vector3} endRotationVector - Target rotation vector.
   * @param {BABYLON.Vector3} startScaleVector - Starting scale vector.
   * @param {BABYLON.Vector3} endScaleVector - Target scale vector.
   * @param {number} radiusOfOrbit - Radius of orbit for the animation.
   * @param {number} momentOfInitialPosition - Initial position moment for the animation.
   */
  constructor(
    animationUniqueId = "-no-programmation-animation-unique-id",
    startPositionVector = BABYLON.Vector3.Zero(),
    endPositionVector = BABYLON.Vector3.Zero(),
    startRotationVector = BABYLON.Vector3.Zero(),
    endRotationVector = BABYLON.Vector3.Zero(),
    startScaleVector = BABYLON.Vector3.One(),
    endScaleVector = BABYLON.Vector3.One(),
    radiusOfOrbit = 0,
    momentOfInitialPosition = 0 //where between 0 and 1 (start to end / loop) does an animation begin upon triggering
  ) {
    this.animationUniqueId = animationUniqueId;
    this.startPositionVector = startPositionVector;
    this.endPositionVector = endPositionVector;
    this.startRotationVector = startRotationVector;
    this.endRotationVector = endRotationVector;
    this.startScaleVector = startScaleVector;
    this.endScaleVector = endScaleVector;
    this.radiusOfOrbit = radiusOfOrbit;
    this.momentOfInitialPosition = momentOfInitialPosition;
  }
}
