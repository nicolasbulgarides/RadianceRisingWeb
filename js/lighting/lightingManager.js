/**
 * LightingManager Class
 *
 * Manages lighting for the Babylon.js scene.
 * Creates a single directional light (sun) shining from above.
 */
class LightingManager {
  /**
   * Creates a new LightingManager instance.
   */
  constructor() {
    this.directionalLight = null;
    this.sceneToAddLightsTo = null;
  }

  /**
   * Initializes the lighting system with a single directional light from above.
   * 
   * @param {boolean} conductLightingExperiments - Unused parameter (kept for compatibility).
   * @param {BABYLON.Scene} sceneToAddLightsTo - The Babylon.js scene to add lights to.
   */
  initializeConstructSystems(conductLightingExperiments, sceneToAddLightsTo) {
    this.sceneToAddLightsTo = sceneToAddLightsTo;

    // Dispose existing light if any
    if (this.directionalLight) {
      console.log("[LIGHTING] Disposing existing directional light before creating new one");
      this.directionalLight.dispose();
    }

    // Create a directional light (sun) shining from above
    this.directionalLight = new BABYLON.DirectionalLight(
      "SunLight",
      new BABYLON.Vector3(1, -1, 0), // Direction pointing down (from above)
      sceneToAddLightsTo
    );

    // Set intensity to 15
    this.directionalLight.intensity = 15;

    // Set light color to white (default)
    this.directionalLight.diffuse = new BABYLON.Color3(1, 1, 1);
    this.directionalLight.specular = new BABYLON.Color3(1, 1, 1);

    console.log(`[LIGHTING] Created SunLight with intensity ${this.directionalLight.intensity}`);
    console.log(`[LIGHTING] Scene now has ${sceneToAddLightsTo.lights.length} total light(s)`);
  }

  dispose() {
    if (this.directionalLight) {
      this.directionalLight.dispose();
      this.directionalLight = null;
    }
  }
}
