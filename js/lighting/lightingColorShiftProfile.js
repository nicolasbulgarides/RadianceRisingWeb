/**
 * LightingColorShiftProfile Class
 *
 * Encapsulates the properties used for dynamically shifting a light's color and intensity.
 * These properties include base values and variation parameters (e.g. hue, intensity amplitude)
 * that drive smooth transitions and cyclic effects in the scene.
 */
class LightingColorShiftProfile {
  /**
   * Constructs a new LightingColorShiftProfile instance.
   *
   * @param {string} colorProfileData.presetName - Unique preset identifier.
   * @param {number} colorProfileData.baseLightIntensity - Base intensity value.
   * @param {number} colorProfileData.baseLightIntensityAmplitude - Amplitude for intensity variations.
   * @param {number} colorProfileData.baseHue - Base hue value.
   * @param {number} colorProfileData.hueVariation - Amount by which the hue can vary.
   * @param {number} colorProfileData.baseLightIntensitySpeed - Speed of intensity change.
   * @param {number} colorProfileData.hueShiftSpeed - Speed of hue shift.
   * @param {boolean} colorProfileData.loops - Whether the effect continuously loops.
   * @param {boolean} colorProfileData.autoReverse - Whether the effect automatically reverses direction.
   * @param {number} colorProfileData.lightIntensityPhaseRatio - Phase used for intensity modulation.
   * @param {number} colorProfileData.colorShiftPhaseRatio - Phase used for hue modulation.
   */
  constructor(colorProfileData) {
    this.colorProfileNickname = colorProfileData.presetName;
    this.baseLightIntensity = colorProfileData.baseLightIntensity;
    this.baseLightIntensityAmplitude =
      colorProfileData.baseLightIntensityAmplitude;
    this.baseHue = colorProfileData.baseHue;
    this.hueVariation = colorProfileData.hueVariation;
    this.baseLightIntensitySpeed = colorProfileData.baseLightIntensitySpeed;
    this.hueShiftSpeed = colorProfileData.hueShiftSpeed;
    this.loops = colorProfileData.loops;
    this.autoReverse = colorProfileData.autoReverse;
    this.lightIntensityPhaseRatio = colorProfileData.lightIntensityPhaseRatio;
    this.colorShiftPhaseRatio = colorProfileData.colorShiftPhaseRatio;
  }
}
