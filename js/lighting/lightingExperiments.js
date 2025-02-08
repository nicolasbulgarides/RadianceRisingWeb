/**
 * LightingExperiments Class
 *
 * Facilitates experimental configurations in the lighting system.
 * Allows developers to quickly compare different lighting parameter combinations
 * before finalizing them into templates or presets.
 *
 * The class manages temporary experiment profiles and provides fallback values.
 */
class LightingExperiments {
  constructor(lightingManager) {
    this.lightingManager = lightingManager;
    this.experimentProfiles = {};
    this.loadBlankPlaceholderValues(); //ignore me
    this.loadVariousExperimentProfiles();
    this.currentExperimentId = null;
  }

  /**
   * Configures the current experimental lighting profile.
   * Sets a unique experiment identifier and assigns preset indexes.
   */
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

  /**
   * Loads various experimental lighting configurations.
   * Developers can extend this method with additional experiment profiles.
   */
  loadVariousExperimentProfiles() {
    //Example
    //this.experimentProfiles[69] = [0][1][0][2][4][3];
  }

  /**
   * Retrieves the current experiment profile. Falls back to a blank profile if none found.
   *
   * @returns {Array<number>} Array of preset indexes.
   */
  getCurrentExperimentProfile() {
    if (
      this.experimentProfiles[this.currentExperimentId] &&
      Array.isArray(this.experimentProfiles[this.currentExperimentId])
    ) {
      return this.experimentProfiles[this.currentExperimentId];
    } else {
      if (this.experimentProfiles[0] && Array.isArray(this.experimentProfiles[0])) {
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

  /**
   * Returns preset directional vectors for lights for a given experiment.
   *
   * @param {number} experimentIndex - The experiment identifier.
   * @returns {Object} Dictionary containing direction vectors.
   */
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

  /**
   * Loads a blank placeholder experiment profile.
   */
  loadBlankPlaceholderValues() {
    this.experimentProfiles[0] = [0, 0, 0, 0, 0, 0];
  }
}
