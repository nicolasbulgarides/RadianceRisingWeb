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

      this.scene2 = new BaseGameUI(this.engine);
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

      // Set up resize handling
      this.setupResizeHandler();
      // Instrumentation debugging tool
      let sceneInstrumentation = new BABYLON.SceneInstrumentation(this.scene);
      sceneInstrumentation.captureActiveMeshesEvaluationTime = true;
      sceneInstrumentation.captureFrameTime = true;
      sceneInstrumentation.captureParticlesRenderTime = true;
      sceneInstrumentation.captureRenderTime = true;
      sceneInstrumentation.captureCameraRenderTime = true;
      sceneInstrumentation.captureRenderTargetsRenderTime = true;
      sceneInstrumentation.captureInterFrameTime = true;
      let engineInstrumentation = new BABYLON.EngineInstrumentation(
        this.engine
      );
      engineInstrumentation.captureGPUFrameTime = true;
      engineInstrumentation.captureShaderCompilationTime = true;
      // GUI
      const advancedTexture = this.scene2.advancedTexture;

      const panel = addPanel(advancedTexture, 0, 0);
      panel.horizontalAlignment = 0;
      panel.verticalAlignment = 0;

      const meshesLength = addInstrumentationTextBlock(panel, "Meshes: ");
      const activeMeshesLength = addInstrumentationTextBlock(
        panel,
        "Active Meshes: "
      );
      const activeVertices = addInstrumentationTextBlock(
        panel,
        "Active Vertice Count: "
      );
      const activeIndices = addInstrumentationTextBlock(
        panel,
        "Active Indices: "
      );
      const materialsLength = addInstrumentationTextBlock(panel, "Materials: ");
      const texturesLength = addInstrumentationTextBlock(panel, "Textures: ");

      const animationLength = addInstrumentationTextBlock(
        panel,
        "Animations: "
      );
      const drawCalls = addInstrumentationTextBlock(panel, "Draw Calls: ");
      const totalLights = addInstrumentationTextBlock(panel, "Lights: ");
      const frameTimeMax = addInstrumentationTextBlock(
        panel,
        "Scene Frame Time: "
      );
      const evalTimeMax = addInstrumentationTextBlock(
        panel,
        "Active Meshes Eval Time: "
      );
      const particlesFrameTime = addInstrumentationTextBlock(
        panel,
        "Particles Render Time: "
      );
      const interFrameTime = addInstrumentationTextBlock(
        panel,
        "Inter Frame Time: "
      );
      const gpuFrameTime = addInstrumentationTextBlock(
        panel,
        "GPU Frame Time: "
      );
      const shaderCompTime = addInstrumentationTextBlock(
        panel,
        "Shader Comp Time: "
      );
      const shaderTotal = addInstrumentationTextBlock(panel, "Total Shaders: ");
      const sceneRenderTime = addInstrumentationTextBlock(
        panel,
        "Scene Render Time: "
      );
      const cameraRenderTime = addInstrumentationTextBlock(
        panel,
        "Camera Render Time: "
      );
      const targetsRenderTime = addInstrumentationTextBlock(
        panel,
        "Targets Render Time: "
      );
      const fpsValue = addInstrumentationTextBlock(panel, "FPS: ");
      const heapSize = addInstrumentationTextBlock(panel, "Heap Used: ");
      const heapTotal = addInstrumentationTextBlock(panel, "Heap Total: ");
      const heapLimit = addInstrumentationTextBlock(panel, "Heap Limit: ");
      const deltaTimeValue = addInstrumentationTextBlock(panel, "Delta Time: ");

      advancedTexture.addControl(panel);

      // Start the render loop
      this.engine.runRenderLoop(() => {
        if (true) {
          meshesLength.text = "Meshes: " + this.scene.meshes.length;
          activeMeshesLength.text =
            "Active Meshes: " + this.scene.getActiveMeshes().length;
          activeVertices.text = `Total Vertices: ${this.scene.totalVerticesPerfCounter.current.toLocaleString()}`;
          activeIndices.text = `Active Indices: ${this.scene.totalActiveIndicesPerfCounter.current.toLocaleString()}`;
        }
        this.scene.render();
        this.scene2.render();
        //this.baseMenuUI.render();
      });
    });
  }

  /**
 *   particlesFrameTime.text =
    "Particles Render Time: " +
    sceneInstrumentation.particlesRenderTimeCounter.current.toFixed(2);
  interFrameTime.text =
    "Inter Frame Time: " +
    sceneInstrumentation.interFrameTimeCounter.lastSecAverage.toFixed();
  gpuFrameTime.text =
    "GPU Frame Time: " +
    (
      engineInstrumentation.gpuFrameTimeCounter.average * 0.000001
    ).toFixed(2);
  shaderCompTime.text =
    "Shader Comp Time: " +
    engineInstrumentation.shaderCompilationTimeCounter.current.toFixed(
      2
    );
  shaderTotal.text =
    "Total Shaders: " +
    engineInstrumentation.shaderCompilationTimeCounter.count;
  sceneRenderTime.text =
    "Scene Render Time: " +
    sceneInstrumentation.renderTimeCounter.current.toFixed();
  cameraRenderTime.text =
    "Camera Render Time: " +
    sceneInstrumentation.cameraRenderTimeCounter.current.toFixed();
  targetsRenderTime.text =
    "Targets Render Time: " +
    sceneInstrumentation.renderTargetsRenderTimeCounter.current.toFixed();
  fpsValue.text = "FPS: " + this.engine.getFps().toFixed() + " fps";
  heapSize.text =
    "Heap Used: " +
    (!performance.memory
      ? "unavailabe"
      : (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed() +
        " Mb");
  heapTotal.text =
    "Heap Total: " +
    (!performance.memory
      ? "unavailabe"
      : (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed() +
        " Mb");
  heapLimit.text =
    "Heap Limit: " +
    (!performance.memory
      ? "unavailabe"
      : (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed() +
        " Mb");
  if (this.scene.deltaTime) {
    deltaTimeValue.text =
      "Delta Time: " + this.scene.deltaTime.toFixed(2);
  }
  if (this.scene.activeCamera.alpha) {
    copyButton.children[0].text =
      this.scene.activeCamera.alpha.toFixed(2) +
      ", " +
      this.scene.activeCamera.beta.toFixed(2) +
      ", " +
      this.scene.activeCamera.radius.toFixed(2);
    clickToCopy.text =
      "CAMERA POSITION \n Click to copy alpha, beta, radius";
  } else {
    copyButton.children[0].text =
      this.scene.activeCamera.position.x.toFixed(2) +
      ", " +
      this.scene.activeCamera.position.y.toFixed(2) +
      ", " +
      this.scene.activeCamera.position.z.toFixed(2);
    clickToCopy.text = "CAMERA POSITION \n Click to copy x, y, z";
  }


 */

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
    // const animatedModel = await this.sceneBuilder.getAnimatedModel(); //
    // this.addVelocityManagerToModel(animatedModel);
    // Load demo world (awaiting it here ensures models are loaded before proceeding)
    await this.loadDemoWorld();
    this.demoWorldLoaded = true;

    // Add the velocity manager's position update to the render loop if initialized
    if (this.velocityManager) {
      this.scene.onBeforeRenderObservable.add(() => {
        // this.velocityManager.updatePosition();
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
function addPanel(adt, ha, va) {
  const panel = new BABYLON.GUI.StackPanel();
  panel.horizontalAlignment = ha;
  panel.verticalAlignment = va;
  panel.height = "100%";
  panel.width = "300px";
  panel.paddingTop = "10px";
  panel.paddingLeft = "10px";
  panel.paddingBottom = "10px";
  panel.paddingRight = "10px";
  adt.addControl(panel);
  return panel;
}

function addInstrumentationTextBlock(panel, text) {
  const textBlock = new BABYLON.GUI.TextBlock();
  textBlock.text = text;
  textBlock.height = "20px";
  textBlock.width = "200px";
  textBlock.color = "white";
  textBlock.fontSize = 14;
  textBlock.textHorizontalAlignment = 0;
  panel.addControl(textBlock);

  return textBlock;
}
