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
 *  4. Initialize gameplay via GameplayManager.
 *  5. Start the render loop to process frame updates.
 *
 * This class is instantiated by ScriptInitializer after necessary scripts are loaded.
 */
class RadiantEngineManager {
  /**
   * Constructor that initializes Babylon.js engine.
   * @param {BABYLON.Engine} engineInstance - The Babylon.js engine instance.
   */
  constructor(engineInstance) {
    this.babylonEngine = engineInstance;
    try {
      this.initializeCoreSystems();
    } catch (err) {
      InitializationDiagnosticsLogger.logPhaseError(
        "RadiantEngineConstructor-Ambiguous or OVERALL: ",
        ", Error Found: " + err
      );
    }
  }

  initializeCriticalGraphicsSettings() {
    this.babylonEngine.setHardwareScalingLevel(
      1 / (window.devicePixelRatio || 1)
    );
  }
  async initializeCoreSystems() {
    this.addAudioUnlock();
    this.loadEngineSettings();

    // Wait for the scripts to load before proceeding

    // Now that the scripts are loaded, continue with initialization
    this.sceneRenderProcess();
    this.loadGameplay();

    // Start the render loop.
    this.babylonEngine.runRenderLoop(() => {
      this.onFrameRenderUpdates();
      this.renderSceneSwapper.render();
    });
  }

  loadGameplayInitializationManager() {
    this.gameplayInitializationManager = new GameplayInitializationManager();
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
    this.autoClearDepthAndStencil = false;
  }

  /**
   * Processes the initial render setup.
   * Builds the scene, creates and registers UI scenes and the game level scene.
   * Sets up camera and scene management.
   */
  sceneRenderProcess() {
    this.renderSceneSwapper = new RenderSceneSwapper(this.babylonEngine);
    // Initialize SceneBuilder for asset handling and scene construction.

    this.baseGameScene = new BABYLON.Scene(this.babylonEngine);
    this.baseGameScene.clearColor = new BABYLON.Color3(255, 0, 0);
    this.baseUIScene = new BaseGameUI(this.babylonEngine);

    this.sceneBuilder = new SceneBuilder(this.baseGameScene);
    this.sceneBuilder = new SceneBuilder(this.baseUIScene);

    // Initialize base UI for the game.
    // Setup and configure RenderSceneManager to manage various scene overlays.
    this.renderSceneSwapper.registerScene("BaseUIScene", this.baseUIScene);
    this.renderSceneSwapper.registerScene("BaseGameScene", this.baseGameScene);
    this.renderSceneSwapper.setActiveGameLevelScene("BaseGameScene");
    this.renderSceneSwapper.setActiveUIScene("BaseUIScene");

    // Set the placeholder camera, potentially for debugging or initial view.
    CameraManager.setPlaceholderCamera(this.baseGameScene);
  }

  /**
   * Called on each render loop frame.
   * Updates gameplay and other per-frame processes.
   */
  onFrameRenderUpdates() {
    this.gameplayManager.processEndOfFrameEvents();
    // Potentially include benchmark frame updates here.
  }

  /**
   * Loads the gameplay systems by creating an instance of GameplayManager.
   * Registers the gameplay manager with the base UI scene.
   */
  loadGameplay() {
    this.gameplayManager = new GameplayManagerComposite(this.sceneBuilder);
    this.baseUIScene.registerGameplayManager(this.gameplayManager);
    this.gameplayManager.initializeGameplay();
  }

  /**
   * Sets up window resize event handler to adjust engine dimensions.
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      this.babylonEngine.resize();
    });
  }
}
