class ExperienceBarUI extends BABYLON.Scene {
  constructor() {
    super();
    this.experienceBarSegments = [];
    this.counter = 0;
  }
  initExperienceBarUI() {
    // Create a full-screen GUI on top of the scene
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "ExperienceBarUI",
        true,
        this
      );

    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;

    // Add the bottom base panel
    const bottomBasePanel = new BABYLON.GUI.Image(
      "uiBasePanel",
      UIAssetManifest.getAssetUrl("uiBasePanel")
    );
    bottomBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    bottomBasePanel.width = "1000px";
    bottomBasePanel.height = "480px";
    bottomBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    bottomBasePanel.isPointerBlocker = true;
    this.advancedTexture.addControl(bottomBasePanel);

    // Container for the experience bar
    const expBarContainer = new BABYLON.GUI.Container("ExpBarContainer");
    expBarContainer.width = "1000px";
    expBarContainer.height = "480px";
    expBarContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(expBarContainer);

    // Add experience bar base

    var urlBase = UIAssetManifest.getAssetUrl("experienceBarBase");

    const expBarBase = new BABYLON.GUI.Image(
      "expBarBase",
      UIAssetManifest.getAssetUrl("experienceBarBase")
    );

    expBarContainer.addControl(expBarBase);

    expBarBase.width = "384px";
    expBarBase.height = "384px";
    expBarBase.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    // Add experience bar segments
    for (let i = 1; i <= 24; i++) {
      const segmentName = `experienceBar${25 - i}`;
      const expBarSegment = new BABYLON.GUI.Image(
        segmentName,
        UIAssetManifest.getAssetUrl(segmentName)
      );
      expBarSegment.width = "384px"; // Vary segment widths for testing
      expBarSegment.height = "384px";
      expBarSegment.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      expBarSegment.isVisible = false;
      expBarSegment.detectPointerOnOpaqueOnly = true;
      expBarContainer.addControl(expBarSegment);
      this.experienceBarSegments.push(expBarSegment);
    }
  }
  /**
   * Sets the visibility of experience bar segments up to the specified number.
   * @param {number} visibleCount - The number of segments to make visible (1-24).
   */
  setVisibleSegments(visibleCount) {
    this.experienceBarSegments.forEach((segment, index) => {
      segment.isVisible = index < visibleCount;
    });
  }

  /**
   * Randomly sets a number of segments to be visible for testing.
   */
  setRandomVisibleSegments() {
    this.counter++;

    if (this.counter > 24) {
      this.counter = 1;
    }
    this.setVisibleSegments(this.counter);
  }
}
