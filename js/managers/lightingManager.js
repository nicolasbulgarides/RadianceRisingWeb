// File: js/managers/LightingManager.js

/**
 * LightingManager Class
 * Manages the setup and configuration of lighting within a Babylon.js scene. Supports preset lighting
 * configurations (e.g., day, night, dusk) as well as custom configurations.
 */
class LightingManager {
  /**
   * Creates an instance of LightingManager.
   * @param {BABYLON.Scene} sceneInstance - The Babylon.js scene instance where the lighting will be applied.
   * @param {string|object} [config='day'] - The lighting preset or a custom configuration object.
   */
  constructor(sceneInstance, config = "day") {
    this.scene = sceneInstance;
    this.config = config;
    this.initialize();
  }

  /**
   * Initializes the lighting based on the provided configuration.
   * If a string preset is provided, it will apply the corresponding preset lighting;
   * if an object configuration is provided, it will create custom lighting.
   */
  initialize() {
    if (typeof this.config === "string") {
      this.applyPresetLighting(this.config);
    } else if (typeof this.config === "object") {
      this.applyLightingFromConfig(this.config);
    } else {
      window.Logger.warn("LightingManager: Invalid lighting configuration.");
    }
  }

  /**
   * Applies a preset lighting configuration based on the given preset name.
   * @param {string} presetName - The name of the lighting preset ('day', 'night', 'dusk').
   */
  applyPresetLighting(presetName) {
    switch (presetName) {
      case "day":
        this.setupDayLighting();
        break;
      case "night":
        this.setupNightLighting();
        break;
      case "dusk":
        this.setupDuskLighting();
        break;
      default:
        window.Logger.warn(
          "LightingManager: Unknown lighting preset:",
          presetName
        );
        this.setupDefaultLighting();
    }
  }

  /**
   * Sets up day lighting with high intensity for a bright scene.
   */
  setupDayLighting() {
    const light = new BABYLON.DirectionalLight(
      "dayLight",
      new BABYLON.Vector3(0, -1, 0),
      this.scene
    );
    light.intensity = 10.0;
    const lightC = new BABYLON.DirectionalLight(
      "dayLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    lightC.intensity = 10.0;
    const light2 = new BABYLON.DirectionalLight(
      "dayLight",
      new BABYLON.Vector3(1, 0, 0),
      this.scene
    );
    light2.intensity = 10.0;

    const light3 = new BABYLON.DirectionalLight(
      "dayLight",
      new BABYLON.Vector3(-1, 0, 0),
      this.scene
    );
    light3.intensity = 10.0;

    window.Logger.log("LightingManager: Day lighting setup complete.");
  }

  /**
   * Sets up night lighting with low intensity for a darker scene.
   */
  setupNightLighting() {
    const light = new BABYLON.HemisphericLight(
      "nightLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.2;
    window.Logger.log("LightingManager: Night lighting setup complete.");
  }

  /**
   * Sets up dusk lighting with moderate intensity for a dimly lit scene.
   */
  setupDuskLighting() {
    const light = new BABYLON.HemisphericLight(
      "duskLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.5;
    window.Logger.log("LightingManager: Dusk lighting setup complete.");
  }

  /**
   * Sets up default lighting with medium intensity.
   * Used if the specified preset is unknown.
   */
  setupDefaultLighting() {
    const light = new BABYLON.HemisphericLight(
      "defaultLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.8;
    window.Logger.log("LightingManager: Default lighting setup complete.");
  }

  /**
   * Applies custom lighting settings based on the configuration object.
   * Allows specific control over lighting properties such as direction and intensity.
   * @param {object} config - Custom lighting configuration with properties `direction` and `intensity`.
   */
  applyLightingFromConfig(config) {
    const light = new BABYLON.HemisphericLight(
      "customLight",
      new BABYLON.Vector3(
        config.direction.x,
        config.direction.y,
        config.direction.z
      ),
      this.scene
    );
    light.intensity = config.intensity;
    window.Logger.log("LightingManager: Custom lighting setup complete.");
  }
}

// Expose LightingManager globally for usage in other scripts
window.LightingManager = LightingManager;
