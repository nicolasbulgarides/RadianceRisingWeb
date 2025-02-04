class EngineInitialization {
  /**
   * Constructor that initializes Babylon.js engine.
   * @param {BABYLON.Engine} engineInstance - The Babylon.js engine instance.
   */
  constructor(engineInstance) {
    console.log("Started custom engine init");
    this.engine = engineInstance;
    this.baseUIScene = null;
    try {
      this.loadEngineSettings();
    } catch (err) {
      console.log("Error here: " + err);
    }
  }

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

  loadEngineSettings() {
    this.engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));

    this.scene = new BABYLON.Scene(this.engine);
    this.autoClearDepthAndStencil = false;
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.addAudioUnlock();
  }
  /**
   * Initializes the game by loading all necessary scripts and setting up the scene.
   */

  sceneRenderProcess() {
    this.sceneBuilder = new SceneBuilder(this.scene);

    this.baseUIScene = new BaseGameUI(this.engine);
    this.baseUIScene.initUI();
    this.expUIScene = new ExperienceBarUI(this.engine);
    this.expUIScene.autoClear = false;
    this.expUIScene.initExperienceBarUI();

    this.renderSceneManager = new RenderSceneManager(this.engine);
    this.renderSceneManager.registerScene("ExpUI", this.expUIScene);
    this.renderSceneManager.registerScene("BaseUIScene", this.baseUIScene);
    this.renderSceneManager.registerScene("GameWorldScene", this.scene);
    this.renderSceneManager.setActiveGameWorldScene("GameWorldScene");
    this.renderSceneManager.setActiveUIScene("BaseUIScene");
    window.RenderSceneManager = this.renderSceneManager;
    CameraManager.setPlaceholderCamera(this.scene);
  }

  initializeEngine(runLocally) {
    const scriptsToLoad = ScriptManifest.getScriptsToLoad();

    this.loadScripts(runLocally, scriptsToLoad, () => {
      this.setupResizeHandler();

      this.sceneRenderProcess();
      // this.benchmarkTest();
      this.loadGameplay();

      // Start the render loop
      this.engine.runRenderLoop(() => {
        this.onFrameRenderUpdates();
        this.renderSceneManager.render();
      });
    });
  }

  onFrameRenderUpdates() {
    this.gameplayManager.processEndOfFrameEvents();
    //this.benchmarkFrameUpdate();
  }

  loadScripts(runLocally, scripts, callback) {
    const loadedScripts = new Set();

    const loadScript = (index) => {
      let src = "https://radiant-rays.com" + scripts[index];

      if (runLocally) {
        src = "." + scripts[index];
      }
      // If script is already loaded, move to the next script
      if (document.querySelector(`script[src="${src}"]`)) {
        loadedScripts.add(src);
        loadScript(index + 1);
      } else {
        const script = document.createElement("script");
        script.src = src;
        document.head.appendChild(script);

        script.onload = () => {
          // window.Logger.log(`GameInitialization: Loaded script: ${src}`);
          loadedScripts.add(src); // Add the script to the loaded list

          if (index < scripts.length - 1) {
            loadScript(index + 1); // Load the next script
          } else {
            callback();
          }
        };
      }
    };

    loadScript(0); // Start loading the first script
  }

  loadGameplay() {
    this.gameplayManager = new GameplayManager(this.sceneBuilder);
    this.baseUIScene.registerGameplayManager(this.gameplayManager);
    this.gameplayManager.initializeGameplay();
  }

  /**
   * Sets up the window resize handler.
   */
  setupResizeHandler() {
    let logger = new Logger();
    window.Logger = logger;
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  benchmarkFrameUpdate() {
    if (this.benchmark) this.benchmark;
  }

  benchmarkTest() {
    if (Config.BENCHMARK_PRESET != -1) {
      this.benchmark = new BenchmarkManager(
        this.engine,
        this.scene,
        this.sceneRenderManager.activeUIScene.advancedTexture
      );

      if (Config.BENCHMARK_PRESET == 1) {
        this.benchmark.loadBenchmarksBasic();
      } else if (Config.BENCHMARK_PRESET == 2) {
        this.benchmark.loadBenchmarksFull();
      }
    }
  }
}
