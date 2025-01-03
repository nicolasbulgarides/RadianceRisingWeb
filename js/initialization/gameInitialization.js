class GameInitialization {
  /**
   * Constructor that initializes Babylon.js engine.
   * @param {BABYLON.Engine} engineInstance - The Babylon.js engine instance.
   */
  constructor(engineInstance) {
    this.engine = engineInstance;

    this.animatedModelLoader = null;
    this.demoWorldLoaded = false;
    window.gameInitialization = this;
    window.mainMenuUI = null;
    window.baseMenuUI = null;
    window.Logger.log("Finished constructor of Game Init");

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  }

  /**
   * Initializes the game by loading all necessary scripts and setting up the scene.
   */
  initialize() {
    window.Logger.log("GameInitialization: Starting initialization.");

    const scriptsToLoad = [
      "./js/ui/baseGameUI.js",
      "./js/ui/mainMenuUI.js",
      "./js/enums/cameraEnums.js",
      "./js/enums/lightingEnums.js",
      "./js/utilities/modelLoader.js",
      "./js/managers/cameraManager.js",
      "./js/managers/lightingManager.js",
      "./js/utilities/positionedObject.js",
      "./js/utilities/assetManifest.js",
      "./js/utilities/animatedModelLoader.js",
      "./js/utilities/sceneBuilder.js",
      "./js/utilities/inputManager.js",
      "./js/managers/velocityManager.js",
      "./js/scenes/demoWorld1.js",
    ];

    this.loadScripts(scriptsToLoad, () => {
      // This callback only fires AFTER all the scripts have been loaded

      // Double-check that ModelLoader and AssetManifest exist
      if (
        typeof ModelLoader === "undefined" ||
        typeof AssetManifest === "undefined"
      ) {
        console.error(
          "ModelLoader or AssetManifest is not defined. Check script loading."
        );
        return;
      }
      this.cameraManager = new CameraManager(
        this.scene,
        Config.CAMERA_PRESET,
        null
      );
      window.Logger.log("GameInitialization: All manager scripts loaded.");
      this.buildScene();

      // --> Now it's safe to build the scene (ModelLoader is defined).
      //this.mainMenuUI = new MainMenuUI(this.scene, this.engine);
      //this.baseMenuUI.initUI();

      /** 
       *       this.scene2 = new BaseGameUI(this.engine);
      this.scene2.autoClear = false;
      this.scene2.initUI();
      var camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(0, 0, 0),
        this.scene2
      );
      camera.setTarget(BABYLON.Vector3.Zero());
      const light = new BABYLON.HemisphericLight(
        "dayLight",
        new BABYLON.Vector3(0, 1, 0),
        this.scene2
      );
      light.intensity = 1;


      */

      // Set up resize handling
      this.setupResizeHandler();

      // Start the render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
        // this.scene2.render();
        //this.baseMenuUI.render();
      });
    });
  }

  /**
   * Sets up the SceneBuilder, applies background color, and loads specified assets into the scene.
   */
  async buildScene() {
    window.Logger.log("GameInitialization: Creating game scene.");

    // Initialize ModelLoader and SceneBuilder
    this.modelLoader = new ModelLoader();
    this.animatedModelLoader = new AnimatedModelLoader();
    this.sceneBuilder = new SceneBuilder(
      this.scene,
      this.modelLoader,
      this.animatedModelLoader
    );

    // Set the scene background color
    this.sceneBuilder.setBackgroundColor(new BABYLON.Color4(0, 0, 0, 0));
    this.onMoveObservable = new BABYLON.Observable();

    // Instantiate InputManager
    this.inputManager = new InputManager(this.onMoveObservable);
    this.lightingManager = new LightingManager(
      this.scene,
      Config.LIGHTING_PRESET
    );
    // **Ensure model is fully loaded before passing it to VelocityManager**
    const animatedModel = await this.sceneBuilder.getAnimatedModel(); //
    this.addVelocityManagerToModel(animatedModel);
    // Load demo world (awaiting it here ensures models are loaded before proceeding)
    await this.loadDemoWorld();
    this.demoWorldLoaded = true;

    // Add the velocity manager's position update to the render loop if initialized
    if (this.velocityManager) {
      this.scene.onBeforeRenderObservable.add(() => {
        this.velocityManager.updatePosition();
      });
    }
  }

  addVelocityManagerToModel(animatedModel) {
    this.velocityManager = new VelocityManager(
      this.onMoveObservable,
      animatedModel
    );
  }

  loadScripts(scripts, callback) {
    const loadedScripts = new Set();

    const loadScript = (index) => {
      if (index >= scripts.length) {
        window.Logger.log(
          `GameInitialization: All scripts loaded: ${Array.from(
            loadedScripts
          ).join(", ")}`
        );
        callback(); // All scripts are loaded, execute the callback
        return;
      }

      const src = scripts[index];

      // If script is already loaded, move to the next script
      if (document.querySelector(`script[src="${src}"]`)) {
        window.Logger.log(`GameInitialization: Script already loaded: ${src}`);
        loadedScripts.add(src);
        loadScript(index + 1);
      } else {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
          window.Logger.log(`GameInitialization: Loaded script: ${src}`);
          loadedScripts.add(src); // Add the script to the loaded list
          loadScript(index + 1); // Load the next script
        };

        script.onerror = () => {
          window.Logger.error(`Failed to load script: ${src}`);
          // Continue even if a script fails to load
          loadScript(index + 1);
        };

        document.head.appendChild(script);
      }
    };

    loadScript(0); // Start loading the first script
  }

  loadDemoWorld() {
    const demoWorld = new DemoWorld1(
      this.sceneBuilder,
      this.cameraManager,
      this.lightingManager,
      this.gridManager,
      this.scene
    );

    demoWorld.buildDemoWorld();
  }

  /**
   * Sets up the window resize handler.
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      this.engine.resize();
      window.Logger.log("GameInitialization: Engine resized.");
    });
  }
}
