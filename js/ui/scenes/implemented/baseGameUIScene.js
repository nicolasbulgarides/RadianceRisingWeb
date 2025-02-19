/**
 * BaseGameUI
 *
 * This class represents the base UI for the game. It creates interactive GUI components
 * such as the full-screen GUI overlay, game pad, and directional/magic buttons.
 */

class BaseGameUIScene extends UISceneGeneralized {
  /**
   * Constructs the BaseGameUI scene and initializes its UI.
   * @param {BABYLON.Engine} engine - The BabylonJS engine instance.
   */
  constructor(engine) {
    super(engine);
  }

  /**
   * Initializes the UI by delegating tasks to helper methods.
   */
  assembleUI() {
    this.createUIControls();
  }

  /**
   * Creates and arranges all UI controls including panels, game pad, and buttons.
   */
  createUIControls() {
    // Create the bottom base panel (background image for the menu)
    // This image stretches to fill 100% of width and 24% of height
    const bottomBasePanel = new BABYLON.GUI.Image(
      "menuBackground",
      UIAssetManifest.getAssetUrl("uiBasePanel")
    );
    bottomBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    bottomBasePanel.width = "100%";
    bottomBasePanel.height = "24%";
    bottomBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(bottomBasePanel);

    // Container for centering the game base pad and directional buttons
    // This container uses fixed dimensions so that its contents scale uniformly
    const baseContainer = new BABYLON.GUI.Container("BaseContainer");
    // Fixed ideal dimensions
    baseContainer.width = "1000px";
    baseContainer.height = "480px";
    baseContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    baseContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(baseContainer);

    // Add the central game pad
    this.createGamePad(baseContainer);

    this.addDirectionalButtons(baseContainer);

    // Create additional action buttons.
    this.addActionButtons(baseContainer);
  }

  /**
   * Creates and adds the central game pad to the provided container.
   * @param {BABYLON.GUI.Container} container - The container to which the game pad is added.
   */
  createGamePad(container) {
    const gameBasePad = new BABYLON.GUI.Image(
      "gameBasePad",
      UIAssetManifest.getAssetUrl("gamepadBase")
    );
    gameBasePad.width = "360px"; // Relative scale (e.g., 320px at 1000px ideal width)
    gameBasePad.height = "360px"; // Maintains aspect ratio (circle)
    gameBasePad.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    gameBasePad.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    container.addControl(gameBasePad);
  }

  /**
   * Adds directional buttons to the provided container.
   * @param {BABYLON.GUI.Container} container - The container to which the buttons are added.
   */
  addDirectionalButtons(container) {
    const buttonSize = 140;
    const symmetricalOffset = 160;
    const thickness = 0;
    const horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    const verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    container.addControl(
      ButtonFactory.createImageButton(
        "buttonLeft",
        buttonSize,
        buttonSize,
        thickness,
        -symmetricalOffset, // Left of center
        0, // Vertically centered
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "LEFTCLICK"
      )
    );

    container.addControl(
      ButtonFactory.createImageButton(
        "buttonRight",
        buttonSize,
        buttonSize,
        thickness,
        symmetricalOffset,
        0, // Vertically centered
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "RIGHTCLICK"
      )
    );

    container.addControl(
      ButtonFactory.createImageButton(
        "buttonUp",
        buttonSize,
        buttonSize,
        thickness,
        0,
        -symmetricalOffset, // Above center
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "UPCLICK"
      )
    );

    container.addControl(
      ButtonFactory.createImageButton(
        "buttonDown",
        buttonSize,
        buttonSize,
        thickness,
        0,
        symmetricalOffset, // Below center
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "DOWNCLICK"
      )
    );
  }

  /**
   * Adds special action buttons (e.g., magic and artifact) to the provided container.
   * @param {BABYLON.GUI.Container} container - The container to which the buttons are added.
   */
  addActionButtons(container) {
    const specialButtonSize = 180;
    const specialButtonXOffset = 360;
    const thickness = 0;
    const horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    const verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    container.addControl(
      ButtonFactory.createImageButton(
        "buttonMagic",
        specialButtonSize,
        specialButtonSize,
        thickness,
        -specialButtonXOffset, // Additional offset for magic button
        0,
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "MAGIC"
      )
    );

    container.addControl(
      ButtonFactory.createImageButton(
        "buttonArtifact",
        specialButtonSize,
        specialButtonSize,
        thickness,
        specialButtonXOffset,
        0,
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "ARTIFACT"
      )
    );
  }

  /**
   * Handles a button click by routing to the appropriate functionality.
   * @param {string} buttonFunctionKey - The key representing the function of the button.
   */
  buttonFunction(buttonFunctionKey) {
    // Routing movement click to a shared function.
    if (
      buttonFunctionKey === "RIGHTCLICK" ||
      buttonFunctionKey === "LEFTCLICK" ||
      buttonFunctionKey === "UPCLICK" ||
      buttonFunctionKey === "DOWNCLICK"
    ) {
      this.processMovementClick(buttonFunctionKey);
    } else if (buttonFunctionKey === "MAGIC") {
      // Example: play a sound effect for magic action.
      SoundEffectsManager.playSound("magicalSpellCastNeutral");
    } else if (buttonFunctionKey === "ARTIFACT") {
      // Example: play sound effect for artifact usage.
      SoundEffectsManager.playSound("artifactUsage");
    }
  }

  /**
   * Processes movement button events and forwards the movement direction to the gameplay manager.
   * @param {string} buttonFunction - The function key representing the movement.
   */
  processMovementClick(buttonFunction) {
    const buttonFunctionKey = String(buttonFunction);
    if (this.gameplayManager != null) {
      let playerDirection = null;
      // Play a sound for UI movement feedback.
      SoundEffectsManager.playSound("menuMovement");

      if (buttonFunctionKey === "LEFTCLICK") {
        playerDirection = "LEFT";
      } else if (buttonFunctionKey === "RIGHTCLICK") {
        playerDirection = "RIGHT";
      } else if (buttonFunctionKey === "UPCLICK") {
        playerDirection = "UP";
      } else if (buttonFunctionKey === "DOWNCLICK") {
        playerDirection = "DOWN";
      }
      // Send the movement direction to the game's logic manager.

      FundamentalSystemBridge.gameplayManagerComposite.processAttemptedMovementFromUIClick(
        playerDirection
      );
    }
  }
}
