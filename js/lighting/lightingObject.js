/**
 * LightingObject Class
 *
 * Represents an individual light in the Babylon.js scene and encapsulates
 * dynamic control over properties like intensity, hue, and motion. It also
 * manages the animation state (paused/resumed) for color shifts, motion movements,
 * and intensity changes.
 *
 * @class LightingObject
 */
class LightingObject {
  /**
   * Constructs a new LightingObject instance.
   *
   * @param {string} lightNickname - A unique identifier for the light.
   * @param {BABYLON.Light} light - The Babylon.js light instance.
   * @param {LightingColorShiftProfile} colorShiftProfile - Profile defining color shift parameters.
   * @param {Object} motionProfile - Profile defining motion parameters.
   */
  constructor(lightNickname, light, colorShiftProfile, motionProfile) {
    // Unique identifier for the light.
    this.lightNickname = lightNickname;
    // Babylon.js light instance that will be manipulated.
    this.light = light;
    // Defines how the light's color will shift over time.
    this.colorShiftProfile = colorShiftProfile;
    // Defines how the light moves or changes position.
    this.motionProfile = motionProfile;

    // Light's importance level; possible values include "primary" and "secondary".
    this.importance = "secondary";
    // Flags to control the direction of color shift, motion, and intensity animations.
    this.colorShiftInReverse = false;
    this.motionInReverse = false;
    this.lightIntensityShiftInReverse = false;

    // Flags to determine whether animations are paused.
    this.colorShiftPaused = false;
    this.lightIntensityShiftPaused = false;
    this.motionPaused = false;

    // Tracks if the light is enabled in the scene.
    this.lightIsEnabled = true;
  }

  /**
   * Toggles the direction of the color shift animation.
   */
  toggleColorShiftDirection() {
    this.colorShiftInReverse = !this.colorShiftInReverse;
  }

  /**
   * Toggles the direction of the light's motion animation.
   */
  toggleMotionDirection() {
    this.motionInReverse = !this.motionInReverse;
  }

  /**
   * Toggles pausing and resuming of the color shift animation.
   */
  toggleColorShiftPaused() {
    this.colorShiftPaused = !this.colorShiftPaused;
  }

  /**
   * Toggles pausing and resuming of the motion animation.
   */
  toggleMotionPaused() {
    this.motionPaused = !this.motionPaused;
  }

  /**
   * Toggles pausing and resuming of the light intensity adjustment.
   */
  toggleLightIntensityPaused() {
    this.lightIntensityShiftPaused = !this.lightIntensityShiftPaused;
  }

  /**
   * Pauses the light intensity shift animation.
   */
  pauseLightIntensity() {
    this.lightIntensityShiftPaused = true;
  }

  /**
   * Pauses the color shift animation.
   */
  pauseColorShift() {
    this.colorShiftPaused = true;
  }

  /**
   * Resumes the light intensity shift animation.
   */
  unpauseLightIntensity() {
    this.lightIntensityShiftPaused = false;
  }

  /**
   * Resumes the color shift animation.
   */
  unpauseColorShift() {
    this.colorShiftPaused = false;
  }

  /**
   * Toggles the direction for adjusting light intensity.
   */
  toggleLightIntensityDirection() {
    this.lightIntensityShiftInReverse = !this.lightIntensityShiftInReverse;
  }

  /**
   * Enables the light, resumes color and intensity animations, and updates the Babylon.js instance.
   */
  enableLight() {
    this.lightIsEnabled = true;
    this.light.isEnabled = this.lightIsEnabled;
    this.unpauseColorShift();
    this.unpauseLightIntensity();
  }

  /**
   * Disables the light, pauses color and intensity animations, and updates the Babylon.js instance.
   */
  disableLight() {
    this.lightIsEnabled = false;
    this.light.isEnabled = this.lightIsEnabled;
    this.pauseColorShift();
    this.pauseLightIntensity();
  }

  /**
   * Toggles the enabled state of the light. When disabled, it pauses animations; 
   * when enabled, it resumes animations.
   */
  toggleLightDisabled() {
    this.lightIsEnabled = !this.lightIsEnabled;

    if (this.light) {
      this.light.isEnabled = this.lightIsEnabled;
    }

    if (this.lightIsEnabled === false) {
      this.pauseColorShift();
      this.pauseLightIntensity();
    } else if (this.lightIsEnabled) {
      this.unpauseColorShift();
      this.unpauseLightIntensity();
    }
  }

  /**
   * Immediately sets the light's intensity and, if provided, its hue.
   *
   * @param {number} intensity - New intensity value for the light.
   * @param {BABYLON.Color3} hue - New hue value (if valid) for the light.
   */
  forcefullyAdjustLight(intensity, hue) {
    if (this.light) {
      this.light.intensity = intensity;
      if (hue instanceof BABYLON.Color3) {
        this.light.hue = hue;
      }
    }
  }

  /**
   * Adjusts the light's properties while pausing ongoing color and intensity animations.
   *
   * @param {number} intensity - The new intensity value.
   * @param {BABYLON.Color3} hue - The new hue value.
   */
  forcefullyAdjustLightAndPauseShifts(intensity, hue) {
    this.pauseColorShift();
    this.pauseLightIntensity();
    this.forcefullyAdjustLight(intensity, hue);
  }

  /**
   * Assigns a player object to the light for chasing or interaction purposes.
   *
   * @param {*} player - The player object that the light will target.
   */
  assignPlayerToChase(player) {
    this.playerToChase = player;
  }
} 