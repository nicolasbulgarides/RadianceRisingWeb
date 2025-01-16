class BenchmarkManager {
  constructor(engine, scene, adt) {
    this.engine = engine;
    this.scene = scene;
    this.adt = adt;
  }

  coreBenchmarksUpdate() {
    this.interFrameTime.text =
      "Inter Frame Time: " +
      this.sceneInstrumentation.interFrameTimeCounter.lastSecAverage.toFixed();
    this.gpuFrameTime.text =
      "GPU Frame Time: " +
      (
        this.engineInstrumentation.gpuFrameTimeCounter.average * 0.000001
      ).toFixed(2);
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

    this.sceneInstrumentation.captureInterFrameTime = true;
    this.engineInstrumentation = new BABYLON.EngineInstrumentation(this.engine);
    this.engineInstrumentation.captureGPUFrameTime = true;

    const panel = addPanel(this.adt, 0, 0);
    panel.horizontalAlignment = 0;
    panel.verticalAlignment = 0;

    this.interFrameTime = addInstrumentationTextBlock(
      panel,
      "Inter Frame Time: "
    );
    this.gpuFrameTime = addInstrumentationTextBlock(panel, "GPU Frame Time: ");

    this.adt.addControl(panel);
  }

  loadBenchmarksFull() {
    this.sceneInstrumentation = new BABYLON.SceneInstrumentation(this.scene);
    this.sceneInstrumentation.captureActiveMeshesEvaluationTime = true;
    this.sceneInstrumentation.captureInterFrameTime = true;
    this.engineInstrumentation = new BABYLON.EngineInstrumentation(this.engine);
    this.engineInstrumentation.captureGPUFrameTime = true;
    this.engineInstrumentation.captureShaderCompilationTime = true;
    // GUI

    const panel = addPanel(this.adt, 0, 0);
    panel.horizontalAlignment = 0;
    panel.verticalAlignment = 0;

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
function addPanel(adt, ha, va) {
  const panel = new BABYLON.GUI.StackPanel();
  panel.horizontalAlignment = ha;
  panel.verticalAlignment = va;
  panel.height = "100%";
  panel.width = "400px";
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
  textBlock.width = "300px";
  textBlock.color = "white";
  textBlock.fontSize = 18;
  textBlock.textHorizontalAlignment = 0;
  panel.addControl(textBlock);

  return textBlock;
}
