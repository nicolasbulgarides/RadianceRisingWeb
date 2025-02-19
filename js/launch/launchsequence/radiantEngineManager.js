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
      this.initializeCoreSystems();
    } catch (err) {
      InitializationDiagnosticsLogger.logPhaseError(
        "RadiantEngineConstructor-Ambiguous or OVERALL: ",
        ", Error Found: " + err
      );
    }
  }
  /**
   * Initializes the core systems of the engine.
   */
  initializeCoreSystems() {
    this.addAudioUnlock();
    this.loadEngineSettings();
    this.sceneRenderProcess();
    this.loadSoundManagers();
    this.loadGameplayManager();
    this.startRenderLoop();
  }

  startRenderLoop() {
    FundamentalSystemBridge.babylonEngine.runRenderLoop(() => {
      this.onFrameRenderUpdates();
    });
  }
  /**
   * Loads the sound managers and registers them with the fundamental system bridge.
   */
  loadSoundManagers() {
    let musicManager = new MusicManager();
    let soundEffectsManager = new SoundEffectsManager();
    FundamentalSystemBridge.registerSoundManagers(
      musicManager,
      soundEffectsManager
    );
  }
  /**
   * Adds support for custom audio unlocking.
   * Sets up an event listener for the first user click to unlock the audio engine.
   */
  addAudioUnlock() {
    try {
      BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;

      window.addEventListener(
        "click",
        () => {
          if (!BABYLON.Engine.audioEngine.unlocked) {
            BABYLON.Engine.audioEngine.unlock();
          }
        },
        { once: true }
      );
    } catch (err) {
      InitializationDiagnosticsLogger.logPhaseError(
        "RadiantEngineConstructor-Failure to unlock audio engine: ",
        ", Error Found: " + err
      );
    }
  }

  /**
   * Configures engine settings including hardware scaling, scene initialization,
   * clear color, and audio unlocking.
   */
  loadEngineSettings() {
    FundamentalSystemBridge.babylonEngine.autoClearDepthAndStencil = false;
    FundamentalSystemBridge.babylonEngine.setHardwareScalingLevel(
      1 / (window.devicePixelRatio || 1)
    );
  }

  /**
   * Processes the initial render setup.
   * Sets up camera and scene management.
   */
  sceneRenderProcess() {
    FundamentalSystemBridge.registerRenderSceneSwapper(
      new RenderSceneSwapper(FundamentalSystemBridge.babylonEngine)
    );
    FundamentalSystemBridge.renderSceneSwapper.loadBasicScenes();
  }

  /**
   * Called on each render loop frame.
   * Updates gameplay and other per-frame processes.
   */
  onFrameRenderUpdates() {
    FundamentalSystemBridge.gameplayManagerComposite.processEndOfFrameEvents();
    FundamentalSystemBridge.renderSceneSwapper.render();
  }

  /**
   * Loads the gameplay systems by creating an instance of GameplayManager.
   * Registers the gameplay manager with the base UI scene.
   */
  loadGameplayManager() {
    FundamentalSystemBridge.registerGameplayManagerComposite(
      new GameplayManagerComposite()
    );
  }

  /**
   * Sets up window resize event handler to adjust engine dimensions.
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      FundamentalSystemBridge.babylonEngine.resize();
      ResponsiveUIManager.handleResizeOfActiveUIScene();
    });
  }
}
