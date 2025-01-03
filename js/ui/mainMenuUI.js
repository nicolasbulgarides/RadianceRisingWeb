class MainMenuUI {
  /**
   * @param {BABYLON.Scene} scene - The Babylon.js scene where the UI will be displayed
   * @param {BABYLON.Engine} engine - (optional) The Babylon.js engine
   */
  constructor(scene, engine) {
    this.scene = scene;
    this.engine = engine;
    this.gameInitialization = window.gameInitialization; // Make sure this is set externally
    this.advancedTexture = null;
    this.initUI();
  }

  initUI() {
    // 1. Create a full-screen GUI on top of the scene
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "MainMenuUI",
        true,
        this.scene
      );

    // 2. Add a background image
    const backgroundImage = new BABYLON.GUI.Image(
      "menuBackground",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/ascensionNebula.png"
    );
    backgroundImage.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    backgroundImage.width = "100%";
    backgroundImage.height = "100%";
    this.advancedTexture.addControl(backgroundImage);

    // 3. Create an image-only button
    const imageButton = BABYLON.GUI.Button.CreateImageOnlyButton(
      "myImageButton",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/stainedSunShield.png"
    );
    imageButton.width = "200px";
    imageButton.height = "200px";
    imageButton.color = "transparent";
    imageButton.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    imageButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    imageButton.top = "66%";

    // 4. Add the button
    this.advancedTexture.addControl(imageButton);

    // 5. Handle clicks
    imageButton.onPointerUpObservable.add(() => {
      console.log("Image button clicked!");
      this.attemptDisposeUI();
    });
  }

  // Poll until the game is loaded
  attemptDisposeUI() {
    if (this.gameInitialization && this.gameInitialization.demoWorldLoaded) {
      console.log("Game is loaded, disposing UI now.");
      this.disposeUI();
    } else {
      console.log("Game not yet loaded, will retry disposing in 500ms...");
      setTimeout(() => this.attemptDisposeUI(), 500);
    }
  }

  disposeUI() {
    if (!this.advancedTexture) {
      console.warn("No advancedTexture to dispose/fade out.");
      return;
    }
    // Fade out the UI instead of immediate dispose
    this.fadeOutMainMenuUI();
  }

  fadeOutMainMenuUI() {
    // Double-check references
    if (!this.scene) {
      console.error("this.scene is undefined! Cannot begin animation.");
      return;
    }
    if (!this.advancedTexture.rootContainer) {
      console.error("this.advancedTexture.rootContainer is undefined!");
      return;
    }

    // 1. Create the fade-out animation
    const fadeAnimation = new BABYLON.Animation(
      "fadeOutAnimation",
      "alpha", // property name
      30, // fps
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // 2. Define keyframes
    fadeAnimation.setKeys([
      { frame: 0, value: 1 }, // fully visible
      { frame: 30, value: 0 }, // fully invisible over 1 second
    ]);

    // 3. Attach the animation to the root container
    this.advancedTexture.rootContainer.animations = [fadeAnimation];

    // 4. Begin animation on the same scene that created the GUI
    this.scene.beginAnimation(
      this.advancedTexture.rootContainer,
      0,
      30,
      false,
      1.0,
      () => {
        console.log("Fade out complete! The menu is invisible now.");
        // Optional: fully dispose after fade
        // this.advancedTexture.dispose();
        // this.advancedTexture = null;
      }
    );
  }
}

// Expose globally if you rely on a global reference
window.MainMenuUI = MainMenuUI;
