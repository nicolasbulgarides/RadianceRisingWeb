/**
 * Utility class providing interpolation functions for smooth animations.
 * Supports various easing curves and interpolation types for both scalar
 * and vector values. Used by the animation system to calculate intermediate
 * states during animation playback.
 */
class ProgrammaticAnimationInterpolator {
  /**
   * Interpolates between two values using specified curve type
   * @param {number} startValue - Starting value
   * @param {number} endValue - Target value
   * @param {number} progress - Current progress (0-1)
   * @param {string} curveType - Type of interpolation curve
   * @returns {number} Interpolated value
   */
  static interpolate(startValue, endValue, progress, curveType = "linear") {
    const easedProgress = this.getEasedProgress(progress, curveType);
    return startValue + (endValue - startValue) * easedProgress;
  }

  /**
   * Interpolates between two vectors using specified curve type
   * @param {BABYLON.Vector3} startVector - Starting vector
   * @param {BABYLON.Vector3} endVector - Target vector
   * @param {number} progress - Current progress (0-1)
   * @param {string} curveType - Type of interpolation curve
   * @returns {BABYLON.Vector3} Interpolated vector
   */
  static interpolateVector3(
    startVector,
    endVector,
    progress,
    curveType = "linear"
  ) {
    const easedProgress = this.getEasedProgress(progress, curveType);
    return BABYLON.Vector3.Lerp(startVector, endVector, easedProgress);
  }

  /**
   * Gets eased progress based on curve type
   * @private
   */
  static getEasedProgress(progress, curveType) {
    const curves = {
      linear: (t) => t,
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      easeInCubic: (t) => t * t * t,
      easeOutCubic: (t) => --t * t * t + 1,
      bounce: (t) => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      },
    };

    return curves[curveType]?.(progress) ?? progress;
  }
}
