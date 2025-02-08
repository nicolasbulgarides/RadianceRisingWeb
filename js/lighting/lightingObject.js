class LightingObject {
  constructor(lightNickname, light, colorShiftProfile, motionProfile) {
    this.lightNickname = lightNickname;
    this.light = light;
    this.colorShiftProfile = colorShiftProfile;
    this.motionProfile = motionProfile;
    this.importance = "secondary";
    this.colorShiftInReverse = false;
    this.motionInReverse = false;
    this.lightIntensityShiftInReverse = false;
    this.colorShiftPaused = false;
    this.lightIntensityShiftPaused = false;
    this.motionPaused = false;
    this.lightIsEnabled = true;
  }

  toggleColorShiftDirection() {
    this.colorShiftInReverse = !this.colorShiftInReverse;
  }

  toggleMotionDirection() {
    this.motionInReverse = !this.motionInReverse;
  }

  toggleColorShiftPaused() {
    this.colorShiftPaused = !this.colorShiftPaused;
  }
  toggleMotionPaused() {
    this.motionPaused = !this.motionPaused;
  }
  toggleLightIntensityPaused() {
    this.lightIntensityShiftPaused = !this.lightIntensityShiftPaused;
  }

  pauseLightIntensity() {
    this.lightIntensityShiftPaused = true;
  }

  pauseColorShift() {
    this.colorShiftPaused = true;
  }
  unpauseLightIntensity() {
    this.lightIntensityShiftPaused = false;
  }

  unpauseColorShift() {
    this.colorShiftPaused = false;
  }

  toggleLightIntensityDirection() {
    this.lightIntensityShiftInReverse = !this.lightIntensityShiftInReverse;
  }

  enableLight() {
    this.lightIsEnabled = true;
    this.light.isEnabled = this.lightIsEnabled;
    this.unpauseColorShift();
    this.unpauseLightIntensity();
  }

  disableLight() {
    this.lightIsEnabled = false;
    this.light.isEnabled = this.lightIsEnabled;
    this.pauseColorShift();
    this.pauseLightIntensity();
  }
  toggleLightDisabled() {
    this.lightIsEnabled = !this.lightIsEnabled;

    if (this.lightIsEnabled && this.light) {
      this.light.isEnabled = this.lightIsEnabled;
    }

    if (this.lightIsEnabled == false) {
      this.pauseColorShift();
      this.pauseLightIntensity();
    } else if (this.lightIsEnabled) {
      this.unpauseColorShift();
      this.unpauseLightIntensity();
    }
  }

  forcefullyAdjustLight(intensity, hue) {
    if (this.light) {
      this.light.intensity = intensity;
      if (hue instanceof BABYLON.Color) {
        this.light.hue = hue;
      }
    }
  }

  forcefullyAdjustLightAndPauseShifts(intensity, hue) {
    this.pauseColorShift();
    this.pauseLightIntensity();
    this.forcefullyAdjustLight(intensity, hue);
  }
}
