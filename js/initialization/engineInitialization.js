/**
 * EngineInitialization Class
 *
 * Responsible for initializing the Babylon.js engine, configuring engine settings,
 * constructing scenes, setting up the UI overlays, and beginning the render loop.
 *
 * The initialization sequence follows these steps:
 *  1. Load engine settings (hardware scaling, scene setup, audio unlock).
 *  2. Construct main scenes (Game World, Base UI, Experience Bar UI).
 *  3. Register scenes with RenderSceneManager and setup active scenes.
 *  4. Initialize gameplay via GameplayManager.
 *  5. Start the render loop to process frame updates.
 *
 * This class is instantiated by ScriptInitializer after necessary scripts are loaded.
 */
class EngineInitialization {
  /**
   * Constructor that initializes Babylon.js engine.
   * @param {BABYLON.Engine} engineInstance - The Babylon.js engine instance.
   */
  constructor(engineInstance) {
    this.engine = engineInstance;
    this.baseUIScene = null;
    try {
      this.loadEngineSettings();
    } catch (err) {
      LoggerOmega.SmartLogger(true,"Failed engine initialization!","EngineInitializationErrorHandler");
    }
  }

  /**
   * Adds support for custom audio unlocking.
   * Sets up an event listener for the first user click to unlock the audio engine.
   */
  addAudioUnlock() {
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
  }

  /**
   * Configures engine settings including hardware scaling, scene initialization,
   * clear color, and audio unlocking.
   */
  loadEngineSettings() {
    this.engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));

    // Create main scene for the game world.
    this.scene = new BABYLON.Scene(this.engine);
    this.autoClearDepthAndStencil = false;
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // Setup audio unlock on first interaction.
    this.addAudioUnlock();
  }

  /**
   * Processes the initial render setup.
   * Builds the scene, creates and registers UI scenes and the game world scene.
   * Sets up camera and scene management.
   */
  sceneRenderProcess() {
    // Initialize SceneBuilder for asset handling and scene construction.
    this.sceneBuilder = new SceneBuilder(this.scene);

    // Initialize base UI for the game.
    this.baseUIScene = new BaseGameUI(this.engine);
    this.baseUIScene.initUI();
    
    // Initialize experience bar UI.
    this.expUIScene = new ExperienceBarUI(this.engine);
    this.expUIScene.autoClear = false;
    this.expUIScene.initExperienceBarUI();

    // Setup and configure RenderSceneManager to manage various scene overlays.
    this.renderSceneManager = new RenderSceneManager(this.engine);
    this.renderSceneManager.registerScene("ExpUI", this.expUIScene);
    this.renderSceneManager.registerScene("BaseUIScene", this.baseUIScene);
    this.renderSceneManager.registerScene("GameWorldScene", this.scene);
    this.renderSceneManager.setActiveGameWorldScene("GameWorldScene");
    this.renderSceneManager.setActiveUIScene("BaseUIScene");
    window.RenderSceneManager = this.renderSceneManager;

    // Set the placeholder camera, potentially for debugging or initial view.
    CameraManager.setPlaceholderCamera(this.scene);
  }

  /**
   * Initializes the engine and subsequently the gameplay elements.
   * Loads necessary scripts, sets up the resize handler, initiates rendering and gameplay.
   * @param {boolean} runLocally - Indicates if the scripts are served locally.
   */
  initializeEngine(runLocally) {
    // Retrieve manifest of scripts needed for full game functionality.
    const scriptsToLoad = ScriptManifest.getScriptsToLoad();

    this.loadScripts(runLocally, scriptsToLoad, () => {
      // Setup on window resize event.
      this.setupResizeHandler();

      // Setup scenes and register them with a scene manager.
      this.sceneRenderProcess();
      
      // Initialize gameplay which handles player and map initialization.
      this.loadGameplay();

      // Start the render loop.
      this.engine.runRenderLoop(() => {
        this.onFrameRenderUpdates();
        this.renderSceneManager.render();
      });
    });
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
   * Loads a series of external scripts sequentially.
   * Ensures scripts are loaded before executing the provided callback.
   *
   * @param {boolean} runLocally - Determines the URL prefix for scripts.
   * @param {Array<string>} scripts - List of script URLs to load.
   * @param {Function} callback - Function to execute after all scripts are loaded.
   */
  loadScripts(runLocally, scripts, callback) {
    const loadedScripts = new Set();

    const loadScript = (index) => {
      let src = "https://radiant-rays.com" + scripts[index];

      if (runLocally) {
        src = "." + scripts[index];
      }
      // If script is already loaded, move to the next script.
      if (document.querySelector(`script[src="${src}"]`)) {
        loadedScripts.add(src);
        loadScript(index + 1);
      } else {
        const script = document.createElement("script");
        script.src = src;
        document.head.appendChild(script);

        script.onload = () => {
          loadedScripts.add(src); // Add the script to the loaded list

          if (index < scripts.length - 1) {
            loadScript(index + 1); // Load the next script
          } else {
            callback();
          }
        };
      }
    };

    loadScript(0); // Start loading the first script.
  }

  /**
   * Loads the gameplay systems by creating an instance of GameplayManager.
   * Registers the gameplay manager with the base UI scene.
   */
  loadGameplay() {
    this.gameplayManager = new GameplayManager(this.sceneBuilder);
    this.baseUIScene.registerGameplayManager(this.gameplayManager);
    this.gameplayManager.initializeGameplay();
  }

  /**
   * Sets up window resize event handler to adjust engine dimensions.
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  /**
   * Optional benchmark frame update logic.
   * TODO: Implement detailed benchmark frame update.
   */
  benchmarkFrameUpdate() {
    if (this.benchmark) this.benchmark;
  }

  /**
   * Initializes benchmark tests based on configuration presets.
   * Useful for performance testing during development.
   */
  benchmarkTest() {
    if (Config.BENCHMARK_PRESET != -1) {
      this.benchmark = new BenchmarkManager(
        this.engine,
        this.scene,
        this.renderSceneManager.activeUIScene.advancedTexture
      );

      if (Config.BENCHMARK_PRESET == 1) {
        this.benchmark.loadBenchmarksBasic();
      } else if (Config.BENCHMARK_PRESET == 2) {
        this.benchmark.loadBenchmarksFull();
      }
    }
  }
}
