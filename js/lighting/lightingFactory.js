class LightingFactory {
  constructor(lightingManger) {
    this.lightingManager = lightingManger;
    this.scene = this.lightingManager.scene;
    this.lightingPropertyCalculator = new LightingPropertyCalculator();
    this.lightingColorPresets = new LightingColorPresets(
      this.lightingPropertyCalculator
    );
    this.lightingPathPresets = new LightingPathPresets();
  }
  createPositionalLight(shift, positionVector, lightIndex, pathData) {
    let light = new BABYLON.PointLight(
      "P-Light: " + lightIndex,
      positionVector,
      this.scene
    );

    light.intensity = shift.baseLightIntensity;
    light.diffuse = this.lightingPropertyCalculator.hsvToRgb(
      shift.baseHue,
      1,
      1
    );

    this.lightingManager.registerPositionalLight(light, shift, pathData);
  }

  createEnvironmentPositionLightsFromTemplate(configurationTemplate) {
    let lightingPreset =
      this.lightingColorPresets.getEnvironmentLightPositionLightColorProfileByPresetName(
        configurationTemplate.environmentLightingColorPreset
      );

    let colorLightingBag =
      this.lightingPropertyCalculator.getEnvironmentLightDirectionLightBagByPresetComposite(
        lightingPreset
      );
  }

  createEnvironmentLightsFromTemplateComposite(configurationTemplate) {}

  createEnvironmentLightsFromExperimentIndexComposite(experimentIndex) {}

  createEnvironmentDirectionLightsFromTemplate(configurationTemplate) {}

  /**
   * factory method for a directional light that takes in a shift object with various settings
   *
   **/

  createDirectionalLight(shift, directionalLightVector, lightIndex) {
    let light = new BABYLON.DirectionalLight(
      "D-Light: " + lightIndex,
      directionalLightVector,
      this.scene
    );

    light.intensity = shift.baseLightIntensity;
    // console.log("Intensity set: " + light.intensity);

    light.diffuse = this.lightingPropertyCalculator.hsvToRgb(
      shift.baseHue,
      1,
      1
    );
    //light.diffuse = this.hsvToRgb(shift.baseHue, 1, 1);
    // console.log("Diffuse set: " + light.diffuse);

    this.lightingManager.registerActiveLight({ light, shift });
  }

  //genericc method for creating 4 specific lights based off settings anddirectional  vectors
  createFourDirectionalLights(lightSettings, lightVectors) {
    this.createDirectionalLight(
      lightSettings.light1Values,
      lightVectors.lightLeftDown,
      1
    );
    this.createDirectionalLight(
      lightSettings.light2Values,
      lightVectors.lightLeftUp,
      2
    );
    this.createDirectionalLight(
      lightSettings.light3Values,
      lightVectors.lightRightDown,
      3
    );
    this.createDirectionalLight(
      lightSettings.light4Values,
      lightVectors.lightRightUp,
      4
    );
  }
}
