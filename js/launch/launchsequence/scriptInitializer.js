/**
 * ScriptInitializer Class
 *
 * This class is the entry point for script loading and engine initialization.
 * It loads critical diagnostic scripts and the ScriptManifest and then proceeds
 * with the Babylon.js engine and Radiant Engine Manager initialization.
 * If any critical failure occurs during initialization, the system is directed
 * to a catastrophe reporting page.
 */
class ScriptInitializer {
  /**
   * Constructor for ScriptInitializer.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {boolean} runLocally - Flag to determine whether to load scripts from a local source.
   */
  constructor(canvas, runLocally = true) {
    this.canvas = canvas;
    this.runLocally = runLocally;
    // Retrieve core script URLs based on environment
    this.CORE_SCRIPTS = this.getCoreScripts();
    // Begin the core initialization sequence
    this.coreInitializeSequence();
  }

  /**
   * Determines and returns the URLs for core scripts based on the environment.
   * @returns {object} An object mapping script keys to their respective URLs.
   */
  getCoreScripts() {
    if (this.runLocally) {
      return {
        SCRIPT_MANIFEST: "./utilities/assetmanifests/scriptManifest.js",
      };
    } else {
      return {
        SCRIPT_MANIFEST:
          "https://radiant-rays.com/utilities/assetmanifests/scriptManifest.js",
      };
    }
  }

  /**
   * Loads a script dynamically by creating a script element.
   * The script is appended to the document head. Returns a Promise that resolves when the script loads.
   *
   * @param {string} url - The URL of the script to load.
   * @param {boolean} isCritical - Flag indicating if the script is critical for initialization.
   * @param {string} sender - A label identifying the caller, used in error logging.
   * @returns {Promise<HTMLScriptElement>} Resolves with the script element when successfully loaded.
   */
  loadScriptPromise(url, isCritical = false, sender) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      // On successful load, resolve the promise with the script element
      script.onload = () => resolve(script);

      // On error, log based on script criticality and either reject or resolve
      script.onerror = () => {
        const errorMsg = `Sender: ${sender} - Failed to load script: ${url}`;
        if (isCritical) {
          console.error(errorMsg);
          reject(new Error(errorMsg));
        } else {
          console.warn(errorMsg);
          resolve(script);
        }
      };

      // Append the script element to the document head to start loading
      document.head.appendChild(script);
    });
  }

  /**
   * Executes the critical logging sequence by loading all critical diagnostic scripts concurrently.
   * If any of these fail, the application is redirected to a catastrophe report page.
   *
   * @returns {Promise<boolean>} Resolves to true if the critical logging scripts load successfully;
   * otherwise, returns false.
   */
  async loadCriticalLoggingSequenceScripts() {
    let criticalLoggingSequenceSuccess = false;
    try {
      // Load critical diagnostic scripts concurrently
      await Promise.all([
        this.loadScriptPromise(
          this.CORE_SCRIPTS.SCRIPT_MANIFEST,
          true,
          "ScriptManifest"
        ),
      ]);
      criticalLoggingSequenceSuccess = true;
    } catch (error) {
      console.log(
        "Absolute failure to load initial critical sequence scripts (catastrophe manager, diagnostics logger or script manifest)"
      );
      // Redirect to the catastrophe report page
      //window.location.href = "catastropheReport.html";
      return criticalLoggingSequenceSuccess;
    }
    return criticalLoggingSequenceSuccess;
  }

  /**
   * Begins the core initialization sequence which:
   * 1. Loads critical logging scripts.
   * 2. Loads and initializes the Babylon.js engine.
   * 3. Loads and initializes the Radiant Engine Manager.
   * 4. Registers the engines with the Fun  damentalSystemBridge.
   *
   * Any errors in the chain will result in redirecting to the catastrophe report page.
   */
  async coreInitializeSequence() {
    try {
      this.fundamentalSystemBridge = new FundamentalSystemBridge();

      let criticalLoggingSequenceSuccess =
        await this.loadCriticalLoggingSequenceScripts();

      let babylonEngineSuccess = false;
      let radiantEngineSuccess = false;

      // If critical diagnostic scripts loaded successfully, try to load the Babylon engine
      if (criticalLoggingSequenceSuccess) {
        babylonEngineSuccess = this.loadBabylonEngine();
      }

      await ScriptManifest.loadAllScriptsPromise();

      // If Babylon engine loaded successfully, try to load the Radiant engine manager
      if (babylonEngineSuccess) {
        FundamentalSystemBridge.registerBabylonEngine(this.babylonEngineLoaded);
        radiantEngineSuccess = await this.loadRadiantEngine();
      }

      // If both engines are successfully loaded, register them with the fundamental system bridge
      if (babylonEngineSuccess && radiantEngineSuccess) {
        FundamentalSystemBridge.registerRadiantEngineManager(
          this.radiantEngineManager
        );
      }
    } catch (error) {
      console.log("Error in core initialize sequence: " + error.message);
      // Redirect to the catastrophe report page upon error
      // window.location.href = "catastropheReport.html";
    }
  }

  /**
   * Attempts to instantiate the Radiant Engine Manager.
   * First, it validates that the Babylon engine has been successfully loaded and that a valid canvas is provided.
   * If so, it creates an instance of RadiantEngineManager.
   *
   * @returns {boolean} Returns true if instantiation is successful; otherwise, logs errors and returns false.
   */
  attemptInstantiationOfRadiantEngine() {
    let successfulInstantiation = false;
    try {
      // Check if a valid Babylon engine instance and canvas element exist before instantiation
      if (
        this.babylonEngineLoaded instanceof BABYLON.Engine &&
        this.canvas != null
      ) {
        this.radiantEngineManager = new RadiantEngineManager();
        successfulInstantiation = true;
        return successfulInstantiation;
      } else {
        let catastrophe = "Failure in attemptInstantiationOfRadiantEngine";
        if (this.canvas == null) {
          catastrophe += " - Canvas Not Found";
        }
        if (this.babylonEngineLoaded == null) {
          catastrophe += " - Babylon Engine Not Found";
        }
        // Log and display catastrophe using diagnostic and management tools
        CatastropheManager.logCatastrophe(catastrophe);
        InitializationDiagnosticsLogger.logPhaseError(
          "EngineManagerLoad-Script Loading",
          catastrophe
        );
        CatastropheManager.displayCatastrophePage();
      }
    } catch (error) {
      let catastrophe =
        "Error caught in attemptInstantiationOfRadiantEngine: " + error.message;
      console.log(catastrophe);
      CatastropheManager.logCatastrophe(catastrophe);
      InitializationDiagnosticsLogger.logPhaseError(
        "InstantiationOfRadiantEngine-Script Loading" + error.message,
        catastrophe
      );
      // CatastropheManager.displayCatastrophePage();
    }
    return successfulInstantiation;
  }

  /**
   * Checks if the Babylon.js engine is available in the global scope.
   * If not found, logs the error and displays the catastrophe page.
   *
   * @returns {boolean} Returns true if BABYLON is defined, otherwise false.
   */
  verifyBabylonEngineFound() {
    let babylonEngineFound = false;
    if (typeof BABYLON === "undefined") {
      const catastrophe =
        "Failure in loadEngine of ScriptInitializer - BABYLON Undefined!";
      CatastropheManager.logCatastrophe(catastrophe);
      InitializationDiagnosticsLogger.logPhaseError(
        "EngineManagerInitialization-A",
        "BABYLON engine not loaded / found. Check script import."
      );
      // Corrected call to display the catastrophe page
      // CatastropheManager.displayCatastrophePage();
      babylonEngineFound = false;
    } else {
      babylonEngineFound = true;
    }
    return babylonEngineFound;
  }

  /**
   * Initializes the Babylon.js engine instance.
   * Creates the engine using the provided canvas and options.
   *
   * @returns {boolean} Returns true if engine is successfully initialized; false otherwise.
   */
  initializeBabylonEngine() {
    try {
      // Create a new Babylon engine instance with stencil enabled
      const babylonEngine = new BABYLON.Engine(this.canvas, true, {
        stencil: true,
      });
      this.babylonEngineLoaded = babylonEngine;
      return this.babylonEngineLoaded;
    } catch (error) {
      const catastrophe =
        "Failure in loadEngine of ScriptInitializer - BABYLON Engine Basic Initialization FAILURE!";
      CatastropheManager.logCatastrophe(catastrophe);
      InitializationDiagnosticsLogger.logPhaseError(
        "EngineManagerInitialization-B",
        "BABYLON engine initialization failed."
      );
      //  CatastropheManager.displayCatastrophePage();
    }
    return null;
  }

  /**
   * Loads the Babylon engine by:
   * 1. Verifying that the BABYLON global is available.
   * 2. Initializing the Babylon engine.
   *
   * @returns {Promise<boolean>} Returns a promise that resolves to true if the engine is loaded successfully.
   */
  async loadBabylonEngine() {
    let babylonEngineSuccess = false;
    // Verify that the Babylon engine is available before attempting initialization
    let babylonEngineFound = this.verifyBabylonEngineFound();
    if (babylonEngineFound) {
      // Attempt to initialize the Babylon engine
      this.babylonEngineLoaded = this.initializeBabylonEngine();
      // Verify that the loaded engine is an instance of BABYLON.Engine
      if (this.babylonEngineLoaded instanceof BABYLON.Engine) {
        babylonEngineSuccess = true;
      } else {
        // Log a catastrophe if the engine is not a valid Babylon engine
        CatastropheManager.logCatastrophe(
          "Babylon Engine isn't a BABYLON.Engine instance."
        );
      }
    }
    return babylonEngineSuccess;
  }

  /**
   * Loads the Radiant Engine Manager by:
   * 1. Dynamically loading its script.
   * 2. Attempting instantiation.
   *
   * @returns {Promise<boolean>} Returns a promise that resolves to true if the Radiant engine manager is instantiated successfully.
   */
  async loadRadiantEngine() {
    let radiantEngineInstantiationSuccess = false;

    radiantEngineInstantiationSuccess =
      this.attemptInstantiationOfRadiantEngine();

    return radiantEngineInstantiationSuccess;
  }
}
