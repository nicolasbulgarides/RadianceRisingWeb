class LightingObject {
  constructor(lightNickname, light, colorShiftProfile, motionProfile) {
    this.lightNickname = lightNickname;
    this.light = light;
    this.colorShiftProfile = colorShiftProfile;
    this.motionProfile = motionProfile;

    this.colorShiftInReverse = false;
    this.motionInReverse = false;
    this.lightIntensityShiftInReverse = false;

    this.colorShiftPaused = false;
    this.lightIntensityShiftPaused = false;
    this.motionPaused = false;
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

  toggleLightIntensityDirection() {
    this.lightIntensityShiftInReverse = !this.lightIntensityShiftInReverse;
  }
}
