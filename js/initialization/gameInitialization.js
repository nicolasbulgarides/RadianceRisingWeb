class GameInitialization {
  /**
   * Constructor that initializes Babylon.js engine.
   * @param {BABYLON.Engine} engineInstance - The Babylon.js engine instance.
   */
  constructor(engineInstance) {
    this.engine = engineInstance;
    this.engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));

    this.animatedModelLoader = null;
    this.demoWorldLoaded = false;
    window.Logger.log("Finished constructor of Game Init");

    this.scene = new BABYLON.Scene(this.engine);
    // this.scene.showFps();
    this.autoClearDepthAndStencil = false;
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.baseUIScene = null;

    // this.performanceMonitor = new this.performanceMonitor();
    // Unlock audio on first user interaction.
    this.addAudioUnlock();
    this.setupResizeHandler();
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
  getScriptsToLoad() {
    const scriptsToLoad = [
      "./js/managers/benchmarkManager.js",
      "./js/utilities/uiAssetManifest.js",
      "./js/ui/baseGameUI.js",
      "./js/ui/mainMenuUI.js",
      "./js/ui/experienceBarUI.js",
      "./js/enums/cameraEnums.js",
      "./js/enums/lightingEnums.js",
      "./js/utilities/modelLoader.js",
      "./js/managers/cameraManager.js",
      "./js/managers/lightingManager.js",
      "./js/utilities/positionedObject.js",
      "./js/utilities/assetManifestOverrides.js",
      "./js/utilities/assetManifest.js",
      "./js/utilities/gameWorldLoader.js",
      "./js/managers/gameplayManager.js",
      "./js/utilities/worldData.js",
      "./js/gameplay/worldMap.js",
      "./js/gameplay/boardSlot.js",
      "./js/gameplay/obstacles.js",
      "./js/utilities/playerLoader.js",
      "./js/utilities/gameGridGenerator.js",
      "./js/utilities/soundAssetManifest.js",
      "./js/managers/soundEffectsManager.js",
      "./js/managers/songAssetManifest.js",
      "./js/managers/musicLoader.js",
      "./js/utilities/animatedModelLoader.js",
      "./js/managers/renderSceneManager.js",
      "./js/utilities/sceneBuilder.js",
      "./js/utilities/mainInputManager.js",
      "./js/managers/velocityManager.js",
      "./js/managers/movementPathManager.js",
      "./js/managers/modelMovementManager.js",
      "./js/gameplay/playerUnit.js",
      "./js/scenes/demoWorld1.js",
    ];

    return scriptsToLoad;
  }
  /**
   * Initializes the game by loading all necessary scripts and setting up the scene.
   */

  sceneRenderProcess() {
    this.sceneRenderManager = new RenderSceneManager(this.engine);
    window.sceneRenderManager = this.sceneRenderManager;

    this.baseUIScene = new BaseGameUI(this.engine);
    this.baseUIScene.initUI();

    this.expUIScene = new ExperienceBarUI(this.engine);
    this.expUIScene.autoClear = false;
    this.expUIScene.initExperienceBarUI();
    this.buildScene();

    this.sceneRenderManager.registerScene("ExpUI", this.expUIScene);
    this.sceneRenderManager.registerScene("BaseUIScene", this.baseUIScene);
    this.sceneRenderManager.registerScene("GameWorldScene", this.scene);
    this.sceneRenderManager.setActiveGameWorldScene("GameWorldScene");
    this.sceneRenderManager.setActiveUIScene("BaseUIScene");
  }
  initialize() {
    const scriptsToLoad = this.getScriptsToLoad();

    this.loadScripts(scriptsToLoad, () => {
      this.soundEffectsManager = new SoundEffectsManager(this.scene);
      this.sceneRenderProcess();

      var cameraExp = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(0, 0, 0),
        this.expUIScene
      );
      cameraExp.setTarget(BABYLON.Vector3.Zero());

      this.benchmarkTest();
      // Start the render loop
      this.engine.runRenderLoop(() => {
        this.sceneRenderManager.render();
        //this.onFrameRenderUpdates();
      });
    });
  }

  onFrameRenderUpdates() {
    this.gameplayManager.processEndOfFrameEvents();

    if (this.benchmark != null) {
      //this.benchmark.coreBenchmarksUpdate();
      //this.benchmarks.nonCoreBenchmarksUpdate();
    }
  }
  benchmarkTest() {
    this.benchmark = new BenchmarkManager(
      this.engine,
      this.scene,
      this.sceneRenderManager.activeUIScene.advancedTexture
    );
    this.benchmark.loadBenchmarksBasic();
    //this.benchmark.loadBenchmarksFull();
  }
  /**
   * Sets up the SceneBuilder, applies background color, and loads specified assets into the scene.
   */
  async buildScene() {
    // Initialize ModelLoader and SceneBuilder
    this.modelLoader = new ModelLoader();
    this.animatedModelLoader = new AnimatedModelLoader(this.scene);
    this.sceneBuilder = new SceneBuilder(
      this.scene,
      this.modelLoader,
      this.animatedModelLoader
    );

    await this.loadGameplay();

    this.scene.onBeforeRenderObservable.add(() => {});
  }

  loadScripts(scripts, callback) {
    const loadedScripts = new Set();

    const loadScript = (index) => {
      if (index >= scripts.length) {
        callback(); // All scripts are loaded, execute the callback
        return;
      }

      const src = scripts[index];

      // If script is already loaded, move to the next script
      if (document.querySelector(`script[src="${src}"]`)) {
        loadedScripts.add(src);
        loadScript(index + 1);
      } else {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
          // window.Logger.log(`GameInitialization: Loaded script: ${src}`);
          loadedScripts.add(src); // Add the script to the loaded list
          loadScript(index + 1); // Load the next script
        };

        script.onerror = () => {
          // Continue even if a script fails to load
          loadScript(index + 1);
        };

        document.head.appendChild(script);
      }
    };

    loadScript(0); // Start loading the first script
  }

  loadGameplay() {
    this.gameplayManager = new GameplayManager(
      this.sceneBuilder,
      this.cameraManager,
      this.lightingManager
    );
    this.gameplayManager.initializeGameplay();
    this.baseUIScene.registerGameplayManager(this.gameplayManager);
  }

  /**
   * Sets up the window resize handler.
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}
