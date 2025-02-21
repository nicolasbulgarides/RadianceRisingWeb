/**
 * ResponsiveUIManager manages the UI scaling and layout based on the device's viewport.
 */
class ResponsiveUIManager {
  static assembleUIScreenAsInstructed(uiSceneType) {
    let uiScene = ResponsiveUIManager.generateUISceneByType(uiSceneType);
    let preset = ResponsiveUIManager.detectPreset();

    uiScene.assembleUIGeneralized(preset);

    return uiScene;
  }

  static generateUISceneByType(uiSceneType) {
    let uiScene = null;
    if (uiSceneType === "BaseGameUI") {
      uiScene = new BaseGameUIScene("BaseGameUI");
    }

    return uiScene;
  }
  /**
   * Detects the device preset based on the viewport dimensions.
   * @returns {string} The preset name: "vertical", "chubby", "square", "wide", or "ultrawide".
   */
  static detectPreset() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let preset = "default";

    if (height > width) {
      // Portrait mode: differentiate phone vs. tablet.
      preset = width < 600 ? "vertical" : "chubby";
    } else {
      // Landscape mode: use aspect ratio to differentiate.
      const ar = width / height;
      if (ar < 1.2) {
        preset = "square";
      } else if (ar < 1.8) {
        preset = "wide";
      } else {
        preset = "ultrawide";
      }
    }
    return preset;
  }

  /**
   * Handles window resize events to update the UI scaling and preset if needed.
   */
  static handleResizeOfActiveUIScene() {
    let activeScene =
      FundamentalSystemBridge.renderSceneSwapper.getActiveUIScene();

    // activeScene.rebuildUICompletely();

    return;
    const newAspectRatioPreset = ResponsiveUIManager.detectPreset();

    if (newAspectRatioPreset !== activeScene.currentAspectRatioPreset) {
      activeScene.rebuildUIDueToResize(newAspectRatioPreset);
    }

    const idealWidth = Config.IDEAL_UI_WIDTH;
    const idealHeight = Config.IDEAL_UI_HEIGHT;
    const scaleFactor = Math.min(
      window.innerWidth / idealWidth,
      window.innerHeight / idealHeight
    );

    //sactiveScene.updateScaleFactorForFixedContainers(scaleFactor);
  }
}
