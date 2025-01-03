class BaseGameUI extends BABYLON.Scene {
  initUI() {
    // 1. Create a full-screen GUI on top of the scene
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "BaseGameUI",
        true,
        this
      );

    // 2. Add a background image
    const backgroundImage = new BABYLON.GUI.Image(
      "menuBackground",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/ascensionNebula.png"
    );
    backgroundImage.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    backgroundImage.width = "100%";
    backgroundImage.height = "25%";
    this.advancedTexture.addControl(backgroundImage);
  }
}
