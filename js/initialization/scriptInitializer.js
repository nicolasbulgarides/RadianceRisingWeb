class ScriptInitializer {
  static CORE_SCRIPTS = {
    SCRIPT_MANIFEST:
      "https://dd776069.radiancerisingweb.pages.dev/utilities/scriptManifest.js",
    ENGINE_INITIALIZATION:
      "https://dd776069.radiancerisingweb.pages.dev/initialization/engineInitialization.js",
  };
  constructor(canvas) {
    console.log("STARTED INIT");
    this.loadScriptManifest(canvas);
    console.log("Loaded engine, manifest");
    // this.loadEngine(canvas);
  }
  async loadScriptManifest(canvas) {
    console.log("STARTED MANIFEST");
    console.log("URL: " + ScriptInitializer.CORE_SCRIPTS.SCRIPT_MANIFEST);
    let manifest = this.loadScript(
      ScriptInitializer.CORE_SCRIPTS.SCRIPT_MANIFEST
    );

    manifest.onLoad = () => {
      window.scriptManifest = new ScriptManifest();
      this.loadEngine(canvas);
    };
  }

  loadEngine(canvas) {
    let engineInit = this.loadScript(
      ScriptInitializer.CORE_SCRIPTS.ENGINE_INITIALIZATION
    );
    engineInit.onLoad = () => {
      document.head.appendChild(engineInit);

      var engine = new BABYLON.Engine(canvas, true, { stencil: true });

      console.log("Loaded engine");
      // Initialize your game
      var engineInitialization = new EngineInitialization(engine);
      engineInitialization.initializeEngine();
    };
  }

  loadScript(url) {
    const script = document.createElement("script");
    script.src = url;
    return script;
  }
}
