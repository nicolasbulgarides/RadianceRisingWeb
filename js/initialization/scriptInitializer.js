class ScriptInitializer {
  constructor(canvas) {
    console.log("STARTED INIT");
    this.loadScriptManifest(canvas);
  }

  async loadScriptManifest(canvas) {
    this.CORE_SCRIPTS = {
      SCRIPT_MANIFEST:
        "https://dd776069.radiancerisingweb.pages.dev/utilities/scriptManifest.js",
      ENGINE_INITIALIZATION:
        "https://dd776069.radiancerisingweb.pages.dev/initialization/engineInitialization.js",
    };

    console.log("STARTED MANIFEST");
    console.log("URL: " + this.CORE_SCRIPTS.SCRIPT_MANIFEST);

    let manifest = this.loadScript(this.CORE_SCRIPTS.SCRIPT_MANIFEST);
    document.head.appendChild(manifest);

    manifest.onload = () => {
      console.log("ScriptManifest loaded");
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
    console.log("Loading engine...");

    // Load Babylon.js first
    let babylonScript = await this.loadScript(this.CORE_SCRIPTS.BABYLON);
    document.head.appendChild(babylonScript);

    babylonScript.onload = async () => {
      console.log("Babylon.js loaded");

      // Now load Engine Initialization script
      let engineInit = await this.loadScript(
        this.CORE_SCRIPTS.ENGINE_INITIALIZATION
      );
      document.head.appendChild(engineInit);

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
        engineInitialization.initializeEngine();
      };
    };
  }

  loadScript(url) {
    console.log("Url to load: " + url);
    const script = document.createElement("script");
    script.src = url;
    script.async = true; // Ensures it loads asynchronously
    return script;
  }
}
