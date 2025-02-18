/**
 * UIAssetManifest manages Item Icon asset resources and provides URLs for UI element images.
 * It supports loading assets based on local or remote environments.
 */
class ItemIconAssetManifest {
  static githubUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radianceui/main/";

  static workerUrl = "https://radianceloader.nicolasbulgarides.workers.dev/";
  // UI asset manifest data
  static assets = {
    itemIconBase: "itemIconBase.png",
  };

  /**
   * Retrieves the URL for a given Item Icon asset name.
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
