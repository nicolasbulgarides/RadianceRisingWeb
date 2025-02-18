/**
 * GameInitialization Class
 *
 * This class is responsible for setting up the initial game environment.
 * It loads all necessary scripts, constructs scenes (game level, base UI, experience bar UI),
 * sets up the render loop, and delegates gameplay initialization to GameplayManager.
 *
 * The initialization sequence includes:
 *  1. Loading external dependencies/scripts.
 *  2. Creating and configuring the main scenes.
 *  3. Registering scenes with RenderSceneManager.
 *  4. Initiating gameplay and benchmark testing (if configured).
 *  5. Starting the render loop.
 */
class GameInitialization {
  /**
   * Constructor that initializes game settings for Babylon.js.
   * @param {BABYLON.Engine} engineInstance - The Babylon.js engine instance.
   */
  constructor(engineInstance) {
    this.engine = engineInstance;
    this.engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));

    this.animatedModelLoader = null;
    this.demoLevelLoaded = false;

    this.scene = new BABYLON.Scene(this.engine);
    // this.scene.showFps();
    this.autoClearDepthAndStencil = false;
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.baseUIScene = null;

    // Unlock audio on first user interaction.
    this.addAudioUnlock();
    this.setupResizeHandler();
  }

  /**
   * Sets up audio unlocking on first user click.
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
   * Retrieves an array of external scripts to load.
   * @returns {Array<string>} List of script URLs.
   */
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
      "./js/utilities/gameLevelLoader.js",
      "./js/managers/gameplayManager.js",
      "./js/utilities/levelData.js",
      "./js/gameplay/levelMap.js",
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
      "./js/scenes/demoLevel1.js",
    ];

    return scriptsToLoad;
  }

  /**
   * Sets up the render process for the game.
   * Initializes RenderSceneManager, BaseGameUI, ExperienceBarUI, and registers the scenes.
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
    this.sceneRenderManager.registerScene("GameLevelScene", this.scene);
    this.sceneRenderManager.setActiveGameLevelScene("GameLevelScene");
    this.sceneRenderManager.setActiveUIScene("BaseUIScene");
  }

  /**
   * Starts the game initialization sequence.
   * Loads external scripts, constructs the scene, and begins the render loop.
   */
  initialize() {
    const scriptsToLoad = ScriptManifest.getScriptsToLoad();

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
      // Start the render loop.
      this.engine.runRenderLoop(() => {
        this.sceneRenderManager.render();
        // this.onFrameRenderUpdates();
      });
    });
  }

  /**
   * Handles per-frame updates.
   * This method should process gameplay events and benchmark updates.
   */
  onFrameRenderUpdates() {
    this.gameplayManager.processEndOfFrameEvents();

    if (this.benchmark != null) {
      // Process core and non-core benchmark updates if implemented.
      // this.benchmark.coreBenchmarksUpdate();
      // this.benchmarks.nonCoreBenchmarksUpdate();
    }
  }

  /**
   * Performs basic benchmark tests if enabled.
   */
  benchmarkTest() {
    this.benchmark = new BenchmarkManager(
      this.engine,
      this.scene,
      this.sceneRenderManager.activeUIScene.advancedTexture
    );
    this.benchmark.loadBenchmarksBasic();
    // this.benchmark.loadBenchmarksFull();
  }

  /**
   * Builds the game scene by initializing model loaders and SceneBuilder.
   * Also initiates gameplay loading.
   */
  async buildScene() {
    // Initialize ModelLoader and SceneBuilder for asset management.
    this.modelLoader = new ModelLoader();
    this.animatedModelLoader = new AnimatedModelLoader(this.scene);
    this.sceneBuilder = new SceneBuilder(
      this.scene,
      this.modelLoader,
      this.animatedModelLoader
    );

    // Load gameplay elements (player, level, etc.) asynchronously.
    await this.loadGameplay();

    // Optional: Add any pre-render logic here.
    this.scene.onBeforeRenderObservable.add(() => {});
  }

  /**
   * Loads external scripts sequentially and invokes a callback upon completion.
   * @param {Array<string>} scripts - List of script URLs.
   * @param {Function} callback - Callback to execute when all scripts are loaded.
   */
  loadScripts(scripts, callback) {
    const loadedScripts = new Set();

    const loadScript = (index) => {
      if (index >= scripts.length) {
        callback(); // All scripts are loaded, execute the callback.
        return;
      }

      const src = scripts[index];

      // If script is already loaded, move to the next script.
      if (document.querySelector(`script[src="${src}"]`)) {
        loadedScripts.add(src);
        loadScript(index + 1);
      } else {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
          // window.Logger.log(`GameInitialization: Loaded script: ${src}`);
          loadedScripts.add(src);
          loadScript(index + 1);
        };

        script.onerror = () => {
          // Continue loading even if a script fails.
          loadScript(index + 1);
        };

        document.head.appendChild(script);
      }
    };

    loadScript(0); // Start loading the first script.
  }

  /**
   * Initializes gameplay systems by instantiating GameplayManager.
   * Registers the gameplay manager with the base UI scene.
   */
  loadGameplay() {
    this.gameplayManager = new GameplayManagerComposite(
      this.sceneBuilder,
      this.cameraManager,
      this.lightingManager
    );
    this.gameplayManager.initializeGameplay();
    this.baseUIScene.registerGameplayManager(this.gameplayManager);
  }

  /**
   * Sets up the window resize handler to accommodate engine resizing.
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}
