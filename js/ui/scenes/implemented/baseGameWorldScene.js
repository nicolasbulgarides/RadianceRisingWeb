class BaseGameWorldScene extends GameWorldSceneGeneralized {
  constructor() {
    super();
    this.setupBackgroundImage();
  }

  // Alternative Native Babylon.js approach:
  setupBackgroundImage() {
    const backgroundImageUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/spaceBackground.jpg";

    // Create a background texture
    const backgroundTexture = new BABYLON.Texture(backgroundImageUrl, this);

    // Create a layer to display the texture
    const backgroundLayer = new BABYLON.Layer("backgroundLayer", backgroundImageUrl, this, true);

    // Optional: Keep the scene clear color opaque if using a background layer
    this.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // console.log("[BaseGameWorldScene] Background Layer created.");
  }
}