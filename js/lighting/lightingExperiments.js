class LightingExperiments {
  constructor(lightingManager) {
    this.lightingManager = lightingManager;
    this.experimentProfiles = {};
    this.loadBlankPlaceholderValues(); //ignore me
    this.loadVariousExperimentProfiles();
    this.currentExperimentId = null;
  }

  currentExperimentConfiguration() {
    //0 baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed

    this.currentExperimentId = 42;
    let currentExperimentValueIndexes = [10, 3, 0, 1, 15, 14];
    this.experimentProfiles[this.currentExperimentId] =
      currentExperimentValueIndexes;
  }

  /*
    Add combinations of values to this method below so that you can quickly compare different lighting profiles/

    When you are satisfied with a given experiment, then you can store it in "lightingPresets.js", therefore the process is conduct experiments - > finalize and name choice - > store in preset - > be able to load presets at will
  **/
  loadVariousExperimentProfiles() {
    //Example
    //this.experimentProfiles[69] = [0][1][0][2][4][3];
  }

  getCurrentExperimentProfile() {
    if (
      this.experimentProfiles[this.currentExperimentId] &&
      Array.isArray(experimentProfiles[this.currentExperimentId])
    ) {
      return this.experimentProfiles[this.currentExperimentId];
    } else {
      if (this.experimentProfiles[0] && Array.isArray(experimentProfiles[0])) {
        return this.experimentProfiles[0];
      }
    }

    if (LightingManager.lightingLoggingEnabled) {
      console.log(
        "Lighting experiment profile failed AND blank default failed!"
      );
      return [0, 0, 0, 0, 0, 0];
    }
  }

  getExperimentalLightProfiles(experimentIndex) {
    let lightVectors = {
      lightRightDown: new BABYLON.Vector3(1, -1, 0),
      lightLeftDown: new BABYLON.Vector3(-1, -1, 0),
      lightRightUp: new BABYLON.Vector3(1, 1, 0),
      lightLeftUp: new BABYLON.Vector3(-1, 1, 0),
    };

    switch (experimentIndex) {
      case 42: {
        lightVectors = {
          lightRightDown: new BABYLON.Vector3(1, -1, 0),
          lightLeftDown: new BABYLON.Vector3(-1, -1, 0),
          lightRightUp: new BABYLON.Vector3(1, 1, 0),
          lightLeftUp: new BABYLON.Vector3(-1, 1, 0),
        };
        break;
      }
    }
    return lightVectors;
  }

  loadBlankPlaceholderValues() {
    this.experimentProfiles[0] = [0, 0, 0, 0, 0, 0];
  }
}
