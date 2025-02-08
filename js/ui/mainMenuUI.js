/**
 * MainMenuUI
 *
 * This class handles the main menu UI elements including a full-screen background
 * image and a clickable image-only button. The button click triggers a check on
 * game initialization before disposing of the main menu.
 */
class MainMenuUI {
  /**
   * @param {BABYLON.Scene} scene - The Babylon.js scene where the UI will be displayed.
   * @param {BABYLON.Engine} engine - (optional) The Babylon.js engine.
   */
  constructor(scene, engine) {
    this.scene = scene;
    this.engine = engine;
    // External game initialization control or state must be provided.
    this.gameInitialization = window.gameInitialization;
    this.advancedTexture = null;
    this.initUI();
  }

  /**
   * Constructs the main menu UI by creating a full-screen GUI, adding background imagery,
   * and configuring an interactive image button.
   */
  initUI() {
    // Create a fullscreen GUI element.
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "MainMenuUI",
        true,
        this.scene
      );

    // Add a full-screen background image.
    const backgroundImage = new BABYLON.GUI.Image(
      "MainMenuBackground",
      UIAssetManifest.getAssetUrl("menuBackground")
    );
    backgroundImage.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    backgroundImage.width = "100%";
    backgroundImage.height = "100%";
    this.advancedTexture.addControl(backgroundImage);

    // Create an image-only button.
    const imageButton = BABYLON.GUI.Button.CreateImageOnlyButton(
      "StartGameButton",
      UIAssetManifest.getAssetUrl("mainMenuButton"),
    );
    imageButton.width = "200px";
    imageButton.height = "200px";
    imageButton.color = "transparent";
    imageButton.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    imageButton.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    imageButton.top = "66%";

    // Add the button control to the GUI.
    this.advancedTexture.addControl(imageButton);

    // Attach an event handler for pointer-up events.
    imageButton.onPointerUpObservable.add(() => {
      console.log("Image button clicked!");
      this.attemptDisposeUI();
    });
  }

  /**
   * Attempts to dispose of the main menu UI by polling until the game
   * initialization confirms that the game world is loaded.
   */
  attemptDisposeUI() {
    if (this.gameInitialization && this.gameInitialization.demoWorldLoaded) {
      console.log("Game is loaded, disposing UI now.");
      this.disposeUI();
    } else {
      console.log("Game not yet loaded, will retry disposing in 500ms...");
      setTimeout(() => this.attemptDisposeUI(), 500);
    }
  }

  /**
   * Disposes the main menu UI by initiating a fade-out animation.
   */
  disposeUI() {
    if (!this.advancedTexture) {
      console.warn("No advancedTexture to dispose/fade out.");
      return;
    }
    // Instead of an abrupt removal, fade out the UI.
    this.fadeOutMainMenuUI();
  }

  /**
   * Creates and begins a fade-out animation on the main menu UI to gently
   * remove it from view.
   */
  fadeOutMainMenuUI() {
    // Confirm necessary references exist.
    if (!this.scene) {
      console.error("this.scene is undefined! Cannot begin animation.");
      return;
    }
    if (!this.advancedTexture.rootContainer) {
      console.error("this.advancedTexture.rootContainer is undefined!");
      return;
    }

    // Create an animation for fading out the UI (alpha transition)
    const fadeAnimation = new BABYLON.Animation(
      "fadeOutAnimation",
      "alpha", // Target property for alpha transparency.
      30, // Frames per second
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Set keyframes: from fully visible (frame 0, alpha 1) to fully invisible (frame 30, alpha 0).
    fadeAnimation.setKeys([
      { frame: 0, value: 1 },
      { frame: 30, value: 0 },
    ]);

    // Attach the animation to the root container.
    this.advancedTexture.rootContainer.animations = [fadeAnimation];

    // Begin the fade animation on the scene.
    this.scene.beginAnimation(
      this.advancedTexture.rootContainer,
      0,
      30,
      false,
      1.0,
      () => {
        console.log("Fade out complete! The menu is now invisible.");
        // Optionally, dispose of the advancedTexture if it is no longer needed.
        // this.advancedTexture.dispose();
        // this.advancedTexture = null;
      }
    );
  }
}

// Expose the MainMenuUI globally for access from other modules if needed.
window.MainMenuUI = MainMenuUI;
