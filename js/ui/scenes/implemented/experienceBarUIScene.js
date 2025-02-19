/**
 * ExperienceBarUI
 *
 * This class creates and manages the experience bar UI elements.
 * It represents the player's progress as a segmented bar.
 *
 * The experience bar is initialized as a full-screen overlay with a base image
 * and a series of segments that can be toggled visible to indicate experience.
 */
class ExperienceBarUIScene extends UISceneGeneralized {
  constructor() {
    super();
    // Array to hold GUI controls for each experience segment.
    this.experienceBarSegments = [];
    // Counter for demo/testing of visible segments.
    this.counter = 0;

    // Setup a basic camera for the experience bar UI.
    const cameraExp = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 0, 0),
      this
    );
    cameraExp.setTarget(BABYLON.Vector3.Zero());
  }

  /**
   * Initializes the experience bar UI by creating the full-screen GUI overlay,
   * the base panel, and the individual experience segments.
   */
  initExperienceBarUI() {
    // Create a full-screen GUI for the experience bar.
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "ExperienceBarUI",
        true,
        this
      );

    // Configure ideal dimensions and render scaling for responsiveness.
    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;

    // Create a bottom panel as the base background.
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

    // Create a container for the experience bar elements.
    const expBarContainer = new BABYLON.GUI.Container("ExpBarContainer");
    expBarContainer.width = "1000px";
    expBarContainer.height = "480px";
    expBarContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(expBarContainer);

    // Add the experience bar base image.
    const expBarBase = new BABYLON.GUI.Image(
      "expBarBase",
      UIAssetManifest.getAssetUrl("experienceBarBase")
    );
    expBarBase.width = "384px";
    expBarBase.height = "384px";
    expBarBase.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    expBarContainer.addControl(expBarBase);

    // Create multiple segments for the experience bar (24 segments).
    // The segments are named in reverse order.
    for (let i = 1; i <= 24; i++) {
      const segmentName = `experienceBar${25 - i}`;
      const expBarSegment = new BABYLON.GUI.Image(
        segmentName,
        UIAssetManifest.getAssetUrl(segmentName)
      );
      expBarSegment.width = "384px";
      expBarSegment.height = "384px";
      expBarSegment.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      // Hide segments by default
      expBarSegment.isVisible = false;
      expBarSegment.detectPointerOnOpaqueOnly = true;
      expBarContainer.addControl(expBarSegment);
      this.experienceBarSegments.push(expBarSegment);
    }
  }

  /**
   * Sets the number of visible segments in the experience bar.
   * @param {number} visibleCount - The count of visible segments (from 1 to 24).
   */
  setVisibleSegments(visibleCount) {
    this.experienceBarSegments.forEach((segment, index) => {
      segment.isVisible = index < visibleCount;
    });
  }

  /**
   * For demonstration purposes, this updates the bar to show an increasing number
   * of segments. The display resets after exceeding the maximum segments.
   */
  setRandomVisibleSegments() {
    this.counter++;

    if (this.counter > 24) {
      this.counter = 1;
    }
    this.setVisibleSegments(this.counter);
  }
}
