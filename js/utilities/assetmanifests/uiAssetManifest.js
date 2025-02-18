/**
 * UIAssetManifest manages UI asset resources and provides URLs for UI element images.
 * It supports loading assets based on local or remote environments.
 */
class UIAssetManifest {
  static githubUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radianceui/main/";

  static workerUrl = "https://radianceloader.nicolasbulgarides.workers.dev/";
  // UI asset manifest data
  static assets = {
    ascensionNebula: "ascensionNebula.png",
    buttonArtifact: "buttonArtifact.png",
    buttonDown: "buttonDown.png",
    buttonDownScaled: "buttonDownScaled.png",
    buttonLeft: "buttonLeft.png",
    buttonLeft144: "buttonLeft144.png",
    buttonLeft256: "buttonLeft256.png",
    buttonMagic: "buttonMagic1.png",
    buttonMagic1: "buttonMagic1.png",
    buttonMagic2: "buttonMagic2.png",
    buttonRight: "buttonRight.png",
    buttonRightScaled: "buttonRightScaled.png",
    buttonUp: "buttonUp.png",
    buttonUpScaled: "buttonUpScaled.png",
    gamepadBase: "gamepadBase.png",
    stainedSunShield: "stainedSunShield.png",
    uiBasePanel: "uiBasePanel.png",
    menuBackground: "ascensionNebula.png",
    mainMenuButton: "stainedSunShield.png",
    experienceBar1: "LevelExperienceBar512_0000_crystal-24.png",
    experienceBar2: "LevelExperienceBar512_0001_crystal-23.png",
    experienceBar3: "LevelExperienceBar512_0002_crystal-22.png",
    experienceBar4: "LevelExperienceBar512_0003_crystal-21.png",
    experienceBar5: "LevelExperienceBar512_0004_crystal-20.png",
    experienceBar6: "LevelExperienceBar512_0005_crystal-19.png",
    experienceBar7: "LevelExperienceBar512_0006_crystal-18.png",
    experienceBar8: "LevelExperienceBar512_0007_crystal-17.png",
    experienceBar9: "LevelExperienceBar512_0008_crystal-16.png",
    experienceBar10: "LevelExperienceBar512_0009_crystal-15.png",
    experienceBar11: "LevelExperienceBar512_0010_crystal-14.png",
    experienceBar12: "LevelExperienceBar512_0011_crystal-13.png",
    experienceBar13: "LevelExperienceBar512_0012_crystal-12.png",
    experienceBar14: "LevelExperienceBar512_0013_crystal-11.png",
    experienceBar15: "LevelExperienceBar512_0014_crystal-10.png",
    experienceBar16: "LevelExperienceBar512_0015_crystal-9.png",
    experienceBar17: "LevelExperienceBar512_0016_crystal-8.png",
    experienceBar18: "LevelExperienceBar512_0017_crystal-7.png",
    experienceBar19: "LevelExperienceBar512_0018_crystal-6.png",
    experienceBar20: "LevelExperienceBar512_0019_crystal-5.png",
    experienceBar21: "LevelExperienceBar512_0020_crystal-4.png",
    experienceBar22: "LevelExperienceBar512_0021_crystal-3.png",
    experienceBar23: "LevelExperienceBar512_0022_crystal-2.png",
    experienceBar24: "LevelExperienceBar512_0023_crystal-1.png",
    experienceBarBase: "LevelExperienceBar512_0024_base.png",
    number1: "1.png",
    number2: "2.png",
    number3: "3.png",
    number4: "4.png",
    number5: "5.png",
    number6: "6.png",
    number7: "7.png",
    number8: "8.png",
    number9: "9.png",
  };

  /**
   * Retrieves the URL for a given UI asset name.
   * Uses different base URLs depending on whether the loader is in local mode.
   * @param {string} assetName - The name of the UI asset.
   * @returns {string} - The full URL of the UI asset.
   */
  static getAssetUrl(assetName) {
    if (Config.RUN_LOCALLY_DETERMINED) {
      return `${this.githubUrl}${this.assets[assetName] || ""}`;
    } else {
      return `${this.workerUrl}${this.assets[assetName] || ""}`;
    }
  }
}
