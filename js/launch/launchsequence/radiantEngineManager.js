/**
 * RadiantEngineManager Class
 *
 * Responsible for initializing the Babylon.js engine, configuring engine settings,
 * constructing scenes, setting up the UI overlays, and beginning the render loop.
 *
 * The initialization sequence follows these steps:
 *  1. Load engine settings (hardware scaling, scene setup, audio unlock).
 *  2. Construct main scenes (Game Level, Base UI, Experience Bar UI).
 *  3. Register scenes with RenderSceneManager and setup active scenes.
 *  4. Initialize gameplay via GameplayManagerComposite.
 *  5. Start the render loop to process frame updates.
 *
 * This class is instantiated by ScriptInitializer after necessary scripts are loaded.
 */
class RadiantEngineManager {
  constructor() {
    try {
      this.loadEngineSettings();
      this.loadSystems();
      this.startRenderLoop();
    } catch (err) {
      InitializationDiagnosticsLogger.logPhaseError(
        "RadiantEngineConstructor-Ambiguous or OVERALL: ",
        ", Error Found: " + err
      );
    }
  }

  startRenderLoop() {
    FundamentalSystemBridge["babylonEngine"].runRenderLoop(() => {
      this.onFrameRenderUpdates();
    });
  }

  /**
   * Configures engine settings including hardware scaling, scene initialization,
   * clear color, and audio unlocking.
   * Sets up window resize event handler to adjust engine dimensions.
   */

  loadEngineSettings() {
    const engine = FundamentalSystemBridge["babylonEngine"];

    // Performance optimizations
    engine.autoClearDepthAndStencil = false;

    // Cap DPR: iOS renders at 1x (1/9th native pixel count), Android at 1.5x
    const dpr = window.devicePixelRatio || 1;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const maxDPR = isIOS ? 1.0 : 1.5;
    engine.setHardwareScalingLevel(1 / Math.min(dpr, maxDPR));

    window.addEventListener("resize", () => {
      FundamentalSystemBridge["babylonEngine"].resize();
    });

    // Audio unlock
    Config.addAudioUnlock();
  }

  loadSystems() {
    this.loadRenderingAndStartupExperienceSystems();
    this.loadGameplayEssentialSystems();
    this.loadTestLevel();
  }

  loadTestLevel() {
    FundamentalSystemBridge.loadLevelLoaderManagerOnly();

    // If developer override is enabled, automatically load a test level
    if (Config.LOAD_LEVEL_FROM_DEVELOPER_OVERRIDE) {
      this.loadDeveloperTestLevel();
    }
  }

  async loadDeveloperTestLevel() {
    console.log("[DEVELOPER OVERRIDE] Loading test level automatically...");

    const levelLoaderManager = FundamentalSystemBridge["levelLoaderManager"];
    const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

    if (!levelLoaderManager || !gameplayManager) {
      console.error("[DEVELOPER OVERRIDE] Level loader or gameplay manager not available");
      return;
    }

    try {
      // Load a test level using the existing test level method
      await levelLoaderManager.loadLevelTest1(gameplayManager);
      console.log("[DEVELOPER OVERRIDE] ✓ Test level loaded successfully");
    } catch (error) {
      console.error("[DEVELOPER OVERRIDE] ✗ Failed to load test level:", error);
    }
  }
  //statistics and analytics, platform detection, regional adapation systems, partnership systems, data security / law / requirements
  loadPartnershipAndPlatformAndLegalSystems() {
    //to do
  }
  // to do - networking manager, transaction manager, save manager / save batching, login, cheat detection, special logging, statistics
  loadNetworkingSystems() {
    //to do
  }
  loadRenderingAndStartupExperienceSystems() {
    FundamentalSystemBridge.loadProgrammaticAnimationManager();
    FundamentalSystemBridge.registerLevelsSolvedStatusTracker(levelsSolvedStatusTracker);
    FundamentalSystemBridge.loadRenderSceneSwapper();
    FundamentalSystemBridge.loadSoundManagers();
    FundamentalSystemBridge.loadLevelFactoryComposite();
  }

  loadGameplayEssentialSystems() {
    FundamentalSystemBridge.loadGameplayManagerComposite();
    FundamentalSystemBridge.loadPlayerStatusTracker();
    FundamentalSystemBridge.loadActiveTriggerManager();
  }

  //rewards, mojo, items, achievements, competitive
  loadGameplayNonEssentialSystems() { }
  /**
   * Called on each render loop frame.
   * Updates gameplay and other per-frame proce
   * sses.
   */
  onFrameRenderUpdates() {
    FundamentalSystemBridge[
      "gameplayManagerComposite"
    ].processEndOfFrameEvents();
    FundamentalSystemBridge["renderSceneSwapper"].render();
  }
}
