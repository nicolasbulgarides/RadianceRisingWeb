/**
 * BenchmarkManager collects and displays performance benchmarks (e.g., FPS, draw calls, GPU timings).
 * It updates both core and non-core diagnostics and integrates with a GUI overlay.
 */
class BenchmarkManager {
  constructor(engine, scene, adt) {
    this.engine = engine;
    this.scene = scene;
    this.adt = adt;
    this.frameAverage = 0;
    this.framesCounter = 0;
  }

  /**
   * Updates core benchmarks such as average FPS.
   * Accumulates FPS over 240 frames and then displays the average value.
   */
  coreBenchmarksUpdate() {
    // Accumulate FPS value
    this.frameAverage += this.engine.getFps();
    this.framesCounter += 1;

    // After 240 frames, calculate and display the average FPS
    if (this.framesCounter % 240 === 0) {
      const averageFps = this.frameAverage / this.framesCounter;
      // Update the CPU frame time text block
      this.cpuFrameTime.text = "FPS: " + averageFps.toFixed(2);

      // Reset counters after calculation
      this.frameAverage = 0;
      this.framesCounter = 0;
    }
  }

  /**
   * Updates non-core benchmarks such as inter-frame time, GPU frame time, and scene statistics.
   */
  nonCoreBenchmarksUpdate() {
    // Display inter frame time average
    this.interFrameTime.text =
      "Inter Frame Time: " +
      this.sceneInstrumentation.interFrameTimeCounter.lastSecAverage.toFixed();
    // Display GPU frame time (converted to milliseconds)
    this.gpuFrameTime.text =
      "GPU Frame Time: " +
      (this.engineInstrumentation.gpuFrameTimeCounter.average * 0.000001).toFixed(2);
    // Display active meshes count
    this.activeMeshesLength.text =
      "Active Meshes: " + this.scene.getActiveMeshes().length;
    // Display vertices and indices count
    this.activeVertices.text = `Total Vertices: ${this.scene.totalVerticesPerfCounter.current.toLocaleString()}`;
    this.activeIndices.text = `Active Indices: ${this.scene.totalActiveIndicesPerfCounter.current.toLocaleString()}`;
    // Display draw calls
    this.drawCalls.text = "Draw Calls: " + this.sceneInstrumentation.drawCallsCounter.current;
    // Display materials and textures count
    this.materialsLength.text = "Materials: " + this.scene.materials.length;
    this.texturesLength.text = "Textures: " + this.scene.textures.length;
    // Display current FPS
    this.fpsValue.text = "FPS: " + this.engine.getFps().toFixed() + " fps";
  }

  /**
   * Loads basic benchmark metrics and initializes the instrumentation GUI panel.
   */
  loadBenchmarksBasic() {
    this.sceneInstrumentation = new BABYLON.SceneInstrumentation(this.scene);
    this.sceneInstrumentation.captureFrameTime = true;

    const panel = addPanel(this.adt);

    // Create a text block for displaying FPS
    this.cpuFrameTime = addInstrumentationTextBlock(panel, "FPS: ");
  }

  /**
   * Loads full benchmark metrics including GPU timings and scene statistics.
   */
  loadBenchmarksFull() {
    this.sceneInstrumentation = new BABYLON.SceneInstrumentation(this.scene);
    this.sceneInstrumentation.captureActiveMeshesEvaluationTime = true;
    this.sceneInstrumentation.captureInterFrameTime = true;
    this.engineInstrumentation = new BABYLON.EngineInstrumentation(this.engine);
    this.engineInstrumentation.captureGPUFrameTime = true;
    this.engineInstrumentation.captureShaderCompilationTime = true;

    // Create and configure the instrumentation GUI panel
    const panel = addPanel(this.adt);

    this.activeMeshesLength = addInstrumentationTextBlock(panel, "Active Meshes: ");
    this.activeVertices = addInstrumentationTextBlock(panel, "Active Vertice Count: ");
    this.activeIndices = addInstrumentationTextBlock(panel, "Active Indices: ");
    this.materialsLength = addInstrumentationTextBlock(panel, "Materials: ");
    this.texturesLength = addInstrumentationTextBlock(panel, "Textures: ");

    this.animationLength = addInstrumentationTextBlock(panel, "Animations: ");
    this.drawCalls = addInstrumentationTextBlock(panel, "Draw Calls: ");
    this.interFrameTime = addInstrumentationTextBlock(panel, "Inter Frame Time: ");
    this.gpuFrameTime = addInstrumentationTextBlock(panel, "GPU Frame Time: ");
    this.fpsValue = addInstrumentationTextBlock(panel, "FPS: ");

    this.adt.addControl(panel);
  }
}

/**
 * Helper function to create a GUI panel for diagnostics overlay.
 * @param {BABYLON.GUI.AdvancedDynamicTexture} adt - The dynamic texture for the overlay.
 * @returns {BABYLON.GUI.StackPanel} - A configured stack panel.
 */
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

/**
 * Helper function to create a text block for displaying benchmark information.
 * @param {BABYLON.GUI.StackPanel} panel - The panel to add the text block to.
 * @param {string} text - The initial text content.
 * @returns {BABYLON.GUI.TextBlock} - A configured text block.
 */
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
