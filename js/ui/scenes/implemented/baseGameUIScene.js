/**
 * BaseGameUI
 *
 * This class represents the base UI for the game. It creates interactive GUI components
 * such as the full-screen GUI overlay, game pad, and directional/magic buttons.
 */

/**
 * BaseGameUI
 *
 * This class represents the base UI for the game. It creates interactive GUI components
 * such as the full-screen GUI overlay, game pad, and directional/magic buttons.
 */

class BaseGameUIScene extends UISceneGeneralized {
  constructor() {
    super();
  }

  assembleUIGeneralized(aspectRatioPreset) {
    this.currentAspectRatioPreset = aspectRatioPreset;
    this.assembleUIBaseGameUI();
  }

  assembleUIBaseGameUI() {
    // 1) Create the bottom panel background
    this.assembleBackBasePanel();

    // 2) Create the container that holds all base UI elements
    this.assembleUIControlsComposite();
  }

  rebuildUICompletely() {
    this.advancedTexture.clear();
    // this.assembleUIBaseGameUI();
  }
  /**
   * Creates the bottom panel image that spans 100% width and 24% height.
   */
  assembleBackBasePanel() {
    const bottomBasePanel = new BABYLON.GUI.Image(
      "menuBackground",
      UIAssetManifest.getAssetUrl("uiBasePanel")
    );
    bottomBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    bottomBasePanel.width = "100%";
    bottomBasePanel.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";
    bottomBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    // Add the panel to the advancedTexture so it appears behind everything else.
    this.advancedTexture.addControl(bottomBasePanel);
  }

  /**
   * Assembles the container for the UI controls and adds the D-Pad and other buttons.
   */
  assembleUIControlsComposite() {
    this.createUIControlsContainer();

    // Add the central game pad
    const dPadContainer = this.createDirectionalGamePadContainer();
    this.addDirectionalButtons(dPadContainer);
    this.addActionButtons(dPadContainer);

    // Optionally handle extra UI per aspect ratio
    this.augmentUIDueToAspectRatioPreset();
  }

  /**
   * Creates a container at the bottom 24% of the screen, over the bottom panel.
   */
  createUIControlsContainer() {
    // This container overlays exactly the bottom 24% of the screen
    this.baseUIControlsContainer = new BABYLON.GUI.Container(
      "BaseUIControlsContainer"
    );
    this.baseUIControlsContainer.width = Config.IDEAL_UI_WIDTH + "px";
    this.baseUIControlsContainer.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";

    // Place this container at the bottom (matching the bottom panel)
    this.baseUIControlsContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.baseUIControlsContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    this.advancedTexture.addControl(this.baseUIControlsContainer);
  }

  /**
   * Creates the D-Pad container, centers it within the bottom container, and adds the pad image.
   */
  createDirectionalGamePadContainer() {
    const dPadContainer = new BABYLON.GUI.Container("dPadContainer");

    // Give the D-Pad container a fixed "ideal" size and center it.
    dPadContainer.width = Config.IDEAL_UI_WIDTH + "px";
    dPadContainer.height = Config.IDEAL_UI_HEIGHT * 0.2 + "px";
    dPadContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    dPadContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    // Add it to the bottom container
    this.baseUIControlsContainer.addControl(dPadContainer);

    // Add the D-Pad base image
    const gameBasePad = new BABYLON.GUI.Image(
      "gameBasePad",
      UIAssetManifest.getAssetUrl("gamepadBase")
    );
    gameBasePad.width = Config.IDEAL_UI_WIDTH * 0.15 + "px";
    gameBasePad.height = Config.IDEAL_UI_WIDTH * 0.15 + "px";
    gameBasePad.stretch = BABYLON.GUI.Image.STRETCH_NONE;
    dPadContainer.addControl(gameBasePad);

    return dPadContainer;
  }

  /**
   * Adds directional buttons to the provided container with center alignment + manual offset.
   */
  addDirectionalButtons(dPadContainer) {
    const buttonSize = Config.IDEAL_UI_WIDTH * 0.125;
    const symmetricalOffset = Config.IDEAL_UI_WIDTH * 0.1;
    const thickness = 0;

    // We want these to be centered in the container, then offset manually.
    const horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    const verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    dPadContainer.addControl(
      ButtonFactory.createImageButton(
        "buttonLeft",
        buttonSize,
        buttonSize,
        thickness,
        -symmetricalOffset, // Shift left of center
        0, // No vertical shift
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "LEFTCLICK",
        "directionalPadTap"
      )
    );

    dPadContainer.addControl(
      ButtonFactory.createImageButton(
        "buttonRight",
        buttonSize,
        buttonSize,
        thickness,
        symmetricalOffset, // Shift right of center
        0,
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "RIGHTCLICK",
        "directionalPadTap"
      )
    );

    dPadContainer.addControl(
      ButtonFactory.createImageButton(
        "buttonUp",
        buttonSize,
        buttonSize,
        thickness,
        0,
        -symmetricalOffset, // Shift above center
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "UPCLICK",
        "directionalPadTap"
      )
    );

    dPadContainer.addControl(
      ButtonFactory.createImageButton(
        "buttonDown",
        buttonSize,
        buttonSize,
        thickness,
        0,
        symmetricalOffset, // Shift below center
        horizontalAlignment,
        verticalAlignment,
        this.buttonFunction.bind(this),
        "DOWNCLICK",
        "directionalPadTap"
      )
    );
  }

  /**
   * Adds special action buttons (e.g., magic and artifact) to the provided container.
   */
  addActionButtons(dPadContainer) {
    const specialButtonSize = Config.IDEAL_UI_WIDTH * 0.15;
    const specialButtonXOffset = Config.IDEAL_UI_WIDTH * 0.3;
    const thickness = 0;
    const horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    const verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    dPadContainer.addControl(
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

    dPadContainer.addControl(
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
      SoundEffectsManager.playSound("directionalPadTap");
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
    if (FundamentalSystemBridge.gameplayManagerComposite != null) {
      let playerDirection = null;

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
