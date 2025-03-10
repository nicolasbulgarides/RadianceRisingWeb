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
    FundamentalSystemBridge["babylonEngine"].autoClearDepthAndStencil = false;
    FundamentalSystemBridge["babylonEngine"].setHardwareScalingLevel(
      1 / (window.devicePixelRatio || 1)
    );
    window.addEventListener("resize", () => {
      FundamentalSystemBridge["babylonEngine"].resize();
    });

    Config.addAudioUnlock();
  }

  loadSystems() {
    this.loadRenderingAndStartupExperienceSystems();
    this.loadGameplayEssentialSystems();
    FundamentalSystemBridge.possiblyLoadAndActivateTestManager();
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
    FundamentalSystemBridge.loadRenderSceneSwapper();
    FundamentalSystemBridge.loadSoundManagers();
    FundamentalSystemBridge.loadLevelFactoryComposite();
  }

  loadGameplayEssentialSystems() {
    FundamentalSystemBridge.loadGameplayManagerComposite();
    FundamentalSystemBridge.loadActiveTriggerManager();
  }

  //rewards, mojo, items, achievements, competitive
  loadGameplayNonEssentialSystems() {}
  /**
   * Called on each render loop frame.
   * Updates gameplay and other per-frame processes.
   */
  onFrameRenderUpdates() {
    FundamentalSystemBridge[
      "gameplayManagerComposite"
    ].processEndOfFrameEvents();
    FundamentalSystemBridge["renderSceneSwapper"].render();
  }
}
