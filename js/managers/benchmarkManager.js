class BenchmarkManager {
  constructor(engine, scene, adt) {
    this.engine = engine;
    this.scene = scene;
    this.adt = adt;
    this.frameAverage = 0;
    this.framesCounter = 0;
  }

  coreBenchmarksUpdate() {
    this.frameAverage += this.engine.getFps().toFixed();
    this.framesCounter += 1;

    if (this.framesCounter % 240 == 0) {
      this.cpuFrameTime.text = this.frameAverage / 60;
      this.frameAverage = 0;
      this.framesCounter = 0;
    }
    /** this.gpuFrameTime.text =
      "GPU Frame Time: " +
      (
        this.engineInstrumentation.gpuFrameTimeCounter.average * 0.000001
      ).toFixed(2);
      */
  }

  nonCoreBenchmarksUpdate() {
    this.interFrameTime.text =
      "Inter Frame Time: " +
      this.sceneInstrumentation.interFrameTimeCounter.lastSecAverage.toFixed();
    this.gpuFrameTime.text =
      "GPU Frame Time: " +
      (
        this.engineInstrumentation.gpuFrameTimeCounter.average * 0.000001
      ).toFixed(2);
    this.activeMeshesLength.text =
      "Active Meshes: " + this.scene.getActiveMeshes().length;
    this.activeVertices.text = `Total Vertices: ${this.scene.totalVerticesPerfCounter.current.toLocaleString()}`;
    this.activeIndices.text = `Active Indices: ${this.scene.totalActiveIndicesPerfCounter.current.toLocaleString()}`;

    this.drawCalls.text =
      "Draw Calls: " + this.sceneInstrumentation.drawCallsCounter.current;

    this.materialsLength.text = "Materials: " + this.scene.materials.length;
    this.texturesLength.text = "Textures: " + this.scene.textures.length;

    this.fpsValue.text = "FPS: " + this.engine.getFps().toFixed() + " fps";
  }

  loadBenchmarksBasic() {
    this.sceneInstrumentation = new BABYLON.SceneInstrumentation(this.scene);
    this.sceneInstrumentation.captureFrameTime = true;

    // this.engineInstrumentation = new BABYLON.EngineInstrumentation(this.engine);
    // this.engineInstrumentation.captureGPUFrameTime = true;

    const panel = addPanel(this.adt);

    this.cpuFrameTime = addInstrumentationTextBlock(panel, "CPU Frame Time: ");

    // this.gpuFrameTime = addInstrumentationTextBlock(panel, "GPU Frame Time: ");
  }

  loadBenchmarksFull() {
    this.sceneInstrumentation = new BABYLON.SceneInstrumentation(this.scene);
    this.sceneInstrumentation.captureActiveMeshesEvaluationTime = true;
    this.sceneInstrumentation.captureInterFrameTime = true;
    this.engineInstrumentation = new BABYLON.EngineInstrumentation(this.engine);
    this.engineInstrumentation.captureGPUFrameTime = true;
    this.engineInstrumentation.captureShaderCompilationTime = true;
    // GUI

    const panel = addPanel(this.adt);

    //  const meshesLength = addInstrumentationTextBlock(panel, "Meshes: ");
    this.activeMeshesLength = addInstrumentationTextBlock(
      panel,
      "Active Meshes: "
    );
    this.activeVertices = addInstrumentationTextBlock(
      panel,
      "Active Vertice Count: "
    );
    this.activeIndices = addInstrumentationTextBlock(panel, "Active Indices: ");
    this.materialsLength = addInstrumentationTextBlock(panel, "Materials: ");
    this.texturesLength = addInstrumentationTextBlock(panel, "Textures: ");

    this.animationLength = addInstrumentationTextBlock(panel, "Animations: ");
    this.drawCalls = addInstrumentationTextBlock(panel, "Draw Calls: ");

    this.interFrameTime = addInstrumentationTextBlock(
      panel,
      "Inter Frame Time: "
    );
    this.gpuFrameTime = addInstrumentationTextBlock(panel, "GPU Frame Time: ");

    this.fpsValue = addInstrumentationTextBlock(panel, "FPS: ");

    this.adt.addControl(panel);
  }
}
function addPanel(adt) {
  const panel = new BABYLON.GUI.StackPanel();

  panel.paddingTop = "10px";
  panel.paddingLeft = "10px";
  panel.paddingBottom = "10px";
  panel.paddingRight = "10px";
  panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  adt.addControl(panel);
  return panel;
}

function addInstrumentationTextBlock(panel, text) {
  const textBlock = new BABYLON.GUI.TextBlock();
  textBlock.text = text;
  textBlock.height = "100px";
  textBlock.width = "600px";
  textBlock.color = "red";
  textBlock.fontSize = 50;
  textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  panel.addControl(textBlock);

  return textBlock;
}
