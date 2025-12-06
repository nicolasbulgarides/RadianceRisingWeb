class GameWorldSceneGeneralized extends BABYLON.Scene {
  constructor() {
    super(FundamentalSystemBridge["babylonEngine"]);

    // Ensure AudioEngine is ready (uses centralized initialization from Config)
    this.initializeAudioEngine();

    console.log("[SCENE] Game world scene initialized");
  }

  async initializeAudioEngine() {
    try {
      console.log("[SCENE] Ensuring AudioEngine is ready...");
      await Config.ensureAudioEngineReady();
      console.log("[SCENE] AudioEngine ready for scene");
    } catch (error) {
      console.warn("[SCENE] Failed to ensure AudioEngine ready:", error);
    }
  }
}
