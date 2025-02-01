class ScriptInitializer {
  static runLocally = true;
  constructor(canvas, runLocally) {
    this.runLocally = runLocally;
    console.log("STARTED INIT: Running locally: " + runLocally);
    this.loadScriptManifest(canvas);
  }

  static getIfLocal(msg) {
    //console.log("Retrieving if local: " + msg + " . " + this.runLocally);
    return this.runLocally;
  }
  async loadScriptManifest(canvas) {
    if (this.runLocally) {
      this.CORE_SCRIPTS = {
        SCRIPT_MANIFEST: "./utilities/scriptManifest.js",
        ENGINE_INITIALIZATION: "./initialization/engineInitialization.js",
      };
    } else {
      this.CORE_SCRIPTS = {
        SCRIPT_MANIFEST: "https://radiant-rays.com/utilities/scriptManifest.js",
        ENGINE_INITIALIZATION:
          "https://radiant-rays.com/initialization/engineInitialization.js",
      };
    }

    let manifest = await this.loadScript(this.CORE_SCRIPTS.SCRIPT_MANIFEST);
    document.head.appendChild(manifest);

    manifest.onload = () => {
      if (typeof ScriptManifest === "undefined") {
        console.error("ScriptManifest class not found. Check script import.");
        return;
      }
      let scriptManifest = new ScriptManifest();
      this.loadEngine(canvas);
    };

    manifest.onerror = () => {
      console.error("Failed to load ScriptManifest.");
    };
  }

  async loadEngine(canvas) {
    let engineInit = await this.loadScript(
      this.CORE_SCRIPTS.ENGINE_INITIALIZATION
    );

    // Define onload before appending
    engineInit.onload = () => {
      console.log("Engine initialization script loaded");

      if (typeof BABYLON === "undefined") {
        console.error("BABYLON engine not loaded. Check script import.");
        return;
      }

      // Create Babylon engine
      const engine = new BABYLON.Engine(canvas, true, { stencil: true });
      console.log("Loaded Babylon engine");

      if (typeof EngineInitialization === "undefined") {
        console.error(
          "EngineInitialization class not found. Check script import."
        );
        return;
      }

      // Initialize engine
      const engineInitialization = new EngineInitialization(engine);
      engineInitialization.initializeEngine(this.runLocally);
    };

    // Append the script only after onload is set
    document.head.appendChild(engineInit);
  }

  loadScript(url) {
    const script = document.createElement("script");
    script.src = url;
    script.async = true; // Ensures it loads asynchronously
    return script;
  }
}
