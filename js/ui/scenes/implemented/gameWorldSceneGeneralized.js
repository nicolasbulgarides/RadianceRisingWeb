class GameWorldSceneGeneralized extends BABYLON.Scene {
  constructor() {
    super(FundamentalSystemBridge["babylonEngine"]);

    // Apply mobile-specific performance optimizations
    this.applyMobileOptimizations();

    // Ensure AudioEngine is ready (uses centralized initialization from Config)
    this.initializeAudioEngine();

    // console.log("[SCENE] Game world scene initialized");
  }

  applyMobileOptimizations() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isMobile = isIOS || /Android/i.test(userAgent);

    if (isMobile) {
      // Performance optimizations that don't significantly impact visual quality

      // Disable expensive features that may not be used
      this.fogEnabled = false; // Disable fog (re-enable if you use it)
      this.lensFlaresEnabled = false; // Disable lens flares
      this.postProcessesEnabled = false; // Disable post-processing effects
      this.probesEnabled = false; // Disable reflection probes
      this.spritesEnabled = true; // Keep sprites if used
      this.particlesEnabled = true; // Keep particles if used

      // DISABLE SHADOWS - Major performance impact on iOS
      this.shadowsEnabled = false;

      // Material optimizations
      this.blockMaterialDirtyMechanism = true; // Reduce material update checks

      // Additional iOS-specific optimizations
      if (isIOS) {
        // iPhones benefit from these additional settings
        this.audioEnabled = true; // Keep audio
        this.skeletonsEnabled = true; // Keep skeleton animations if used

        console.log('[SCENE] iOS performance optimizations applied (shadows disabled)');
      } else {
        console.log('[SCENE] Android performance optimizations applied (shadows disabled)');
      }
    }
  }

  async initializeAudioEngine() {
    try {
      // console.log("[SCENE] Ensuring AudioEngine is ready...");
      await Config.ensureAudioEngineReady();
      // console.log("[SCENE] AudioEngine ready for scene");
    } catch (error) {
      console.warn("[SCENE] Failed to ensure AudioEngine ready:", error);
    }
  }
}
