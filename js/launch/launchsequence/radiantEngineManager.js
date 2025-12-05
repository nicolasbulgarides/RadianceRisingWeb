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
    // Set hardware scaling to 50% for better performance (0.5 = 50% of actual pixels)
    FundamentalSystemBridge["babylonEngine"].setHardwareScalingLevel(0.5);
    window.addEventListener("resize", () => {
      FundamentalSystemBridge["babylonEngine"].resize();
    });

    Config.addAudioUnlock();
  }

  loadSystems() {
    this.loadRenderingAndStartupExperienceSystems();
    this.loadGameplayEssentialSystems();
    this.loadTestLevel();
  }

  loadTestLevel() {
    FundamentalSystemBridge.loadAndActivateLevelLoaderManager();
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

    // Start crystal voyage music on loop as soon as scenes and sound managers are ready
    this.startBackgroundMusic();
  }

  startBackgroundMusic() {
    // Try to start music immediately, but retry if scenes aren't ready yet
    const tryStartMusic = () => {
      const musicManager = FundamentalSystemBridge["musicManager"];
      const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];

      if (musicManager && renderSceneSwapper) {
        // Try to get the active game level scene first
        let scene = renderSceneSwapper.getActiveGameLevelScene();

        // If no game scene yet, try to get the UI scene as fallback
        if (!scene) {
          scene = renderSceneSwapper.getActiveUIScene();
        }

        // If we have a scene, start the music
        if (scene) {
          try {
            musicManager.playSong(scene, "crystalVoyage", true, true);
            console.log("[RADIANT ENGINE] Started crystalVoyage music on loop");
          } catch (error) {
            console.warn("[RADIANT ENGINE] Failed to start music:", error);
            // Retry after a short delay if it fails
            setTimeout(tryStartMusic, 500);
          }
        } else {
          // Scenes not ready yet, retry after a short delay
          setTimeout(tryStartMusic, 100);
        }
      } else {
        // Systems not ready yet, retry after a short delay
        setTimeout(tryStartMusic, 100);
      }
    };

    // Start trying immediately
    tryStartMusic();
  }

  loadGameplayEssentialSystems() {
    FundamentalSystemBridge.loadGameplayManagerComposite();
    FundamentalSystemBridge.loadActiveTriggerManager();
  }

  //rewards, mojo, items, achievements, competitive
  loadGameplayNonEssentialSystems() { }
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
