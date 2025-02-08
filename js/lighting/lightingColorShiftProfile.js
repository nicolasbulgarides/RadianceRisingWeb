class LightingColorShiftProfile {
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
