/**
 * ScriptInitializer Class
 *
 * Entry point for script loading and engine initialization.
 * It loads the ScriptManifest and EngineInitialization scripts based on the environment (local vs remote).
 * Upon successful loading, it creates a Babylon.js Engine and triggers full engine initialization.
 */
class ScriptInitializer {
  static runLocally = true;
  
  /**
   * Constructor for ScriptInitializer.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {boolean} runLocally - Flag to determine if scripts should be loaded locally.
   */
  constructor(canvas, runLocally) {
    this.runLocally = runLocally;
    console.log("STARTED INIT: Running locally: " + runLocally);
    this.loadScriptManifest(canvas);
  }

  /**
   * Static method to retrieve the runLocally flag.
   * @param {string} msg - Optional message for debugging.
   * @returns {boolean} The runLocally flag.
   */
  static getIfLocal(msg) {
    //console.log("Retrieving if local: " + msg + " . " + this.runLocally);
    return this.runLocally;
  }

  /**
   * Loads the ScriptManifest which defines the necessary scripts for initialization.
   * @param {HTMLCanvasElement} canvas - The canvas element to pass along for engine initialization.
   */
  async loadScriptManifest(canvas) {
    if (this.runLocally) {
      this.CORE_SCRIPTS = {
        SCRIPT_MANIFEST: "./initialization/scriptManifest.js",
        ENGINE_INITIALIZATION: "./initialization/engineInitialization.js",
      };
    } else {
      this.CORE_SCRIPTS = {
        SCRIPT_MANIFEST:
          "https://radiant-rays.com/initialization/scriptManifest.js",
        ENGINE_INITIALIZATION:
          "https://radiant-rays.com/initialization/engineInitialization.js",
      };
    }

    let manifest = await this.loadScript(this.CORE_SCRIPTS.SCRIPT_MANIFEST);
    document.head.appendChild(manifest);

    manifest.onload = () => {
      if (typeof ScriptManifest === "undefined") {
         //to do - add a redirect to an error page with log submission
        console.error("ScriptManifest class not found. Check script import.");
        return;
      }
      this.loadEngine(canvas);
    };

    manifest.onerror = () => {
      //to do - add a redirect to an error page with log submission
      console.error("ScriptManifest class failed to load. Check script import.");
    };
  }

  /**
   * Loads the engine initialization script and starts the engine.
   * @param {HTMLCanvasElement} canvas - The canvas element used for creating the Babylon.js engine.
   */
  async loadEngine(canvas) {
    try {
      let engineInit = await this.loadScript(
        this.CORE_SCRIPTS.ENGINE_INITIALIZATION
      );

      // Define onload before appending.
      engineInit.onload = () => {
        try {

          if (typeof BABYLON === "undefined") {
            InitializationDiagnosticsLogger.logPhaseError("EngineInitialization-A", "BABYLON engine not loaded. Check script import.");
            return;
          }

          // Create Babylon engine with stencil buffer enabled.
          const engine = new BABYLON.Engine(canvas, true, { stencil: true });

          if (typeof EngineInitialization === "undefined") {
            InitializationDiagnosticsLogger.logPhaseError("EngineInitialization-B", "EngineInitialization class not found. Check script import.");
            return;
          }

          // Instantiate EngineInitialization and start the engine sequence.
          const engineInitialization = new EngineInitialization(engine);
          engineInitialization.initializeEngine(this.runLocally);
        } catch (error) {
          InitializationDiagnosticsLogger.logPhaseError("EngineInitialization-C", error.message);
        }
      };

      // Append the script only after onload is set.
      document.head.appendChild(engineInit);
    } catch (error) {
      InitializationDiagnosticsLogger.logPhaseError("EngineInitializationLoad-CatchAll", error.message);
    }
  }

  /**
   * Utility method to create a script element for a given URL.
   * @param {string} url - The URL of the script to load.
   * @returns {HTMLScriptElement} The script element.
   */
  loadScript(url) {
    const script = document.createElement("script");
    script.src = url;
    script.async = true; // Ensures it loads asynchronously.
    return script;
  }
}
