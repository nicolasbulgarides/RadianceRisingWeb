class ScriptInitializer {
  constructor(canvas) {
    console.log("STARTED INIT");
    this.loadScriptManifest(canvas);
  }

  async loadScriptManifest(canvas) {
    this.CORE_SCRIPTS = {
      SCRIPT_MANIFEST:
        "radiancerisingweb.pages.dev/utilities/scriptManifest.js",
      ENGINE_INITIALIZATION:
        "radiancerisingweb.pages.dev/initialization/engineInitialization.js",
    };

    console.log("STARTED MANIFEST");
    console.log("URL: " + this.CORE_SCRIPTS.SCRIPT_MANIFEST);

    let manifest = await this.loadScript(this.CORE_SCRIPTS.SCRIPT_MANIFEST);
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
      console.log("Babylon Engine loaded successfully");

      // Initialize engine
      const engineInitialization = new EngineInitialization(engine);
      engineInitialization.initializeEngine();
    };

    // Append the script only after onload is set
    document.head.appendChild(engineInit);
  }

  loadScript(url) {
    console.log("Url to load: " + url);
    const script = document.createElement("script");
    script.src = url;
    script.async = true; // Ensures it loads asynchronously
    return script;
  }
}
