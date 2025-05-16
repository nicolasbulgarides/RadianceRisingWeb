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
    this.failedUIElements = [];
    this.maxRetryAttempts = 3;
    this.retryDelay = 2000; // 2 second delay between retries
  }

  assembleUIGeneralized(aspectRatioPreset) {
    this.currentAspectRatioPreset = aspectRatioPreset;
    this.assembleUIBaseGameUI();
  }

  assembleUIBaseGameUI() {
    // 1) Create the bottom panel background
    this.attemptUIElementLoad(
      () => this.assembleBackBasePanel(),
      "bottomBasePanel"
    );

    // 2) Create the container that holds all base UI elements
    this.attemptUIElementLoad(
      () => this.assembleUIControlsComposite(),
      "uiControlsComposite"
    );
    console.log("Failed UI elements:", this.failedUIElements);

    // Retry any failed UI elements
    this.retryFailedUIElements();
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

    // Ensure the panel is visible and properly layered
    bottomBasePanel.zIndex = -3; // Ensure it's behind other controls
    bottomBasePanel.alpha = 1; // Ensure full opacity
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

    const buttons = [
      {
        name: "buttonLeft",
        offsetX: -symmetricalOffset,
        offsetY: 0,
        action: "LEFTCLICK",
      },
      {
        name: "buttonRight",
        offsetX: symmetricalOffset,
        offsetY: 0,
        action: "RIGHTCLICK",
      },
      {
        name: "buttonUp",
        offsetX: 0,
        offsetY: -symmetricalOffset,
        action: "UPCLICK",
      },
      {
        name: "buttonDown",
        offsetX: 0,
        offsetY: symmetricalOffset,
        action: "DOWNCLICK",
      },
    ];

    buttons.forEach((button) => {
      try {
        this.attemptUIElementLoad(() => {
          //  console.log(`Attempting to create button: ${button.name}`);
          const buttonControl = ButtonFactory.createImageButton(
            button.name,
            buttonSize,
            buttonSize,
            thickness,
            button.offsetX,
            button.offsetY,
            horizontalAlignment,
            verticalAlignment,
            this.buttonFunction.bind(this),
            button.action,
            "directionalPadTap"
          );
          if (!buttonControl) {
            throw new Error(
              `Failed to create button control for ${button.name}`
            );
          }
          // console.log(`Successfully created button: ${button.name}`);
          dPadContainer.addControl(buttonControl);
        }, `directionalButton_${button.name}`);
      } catch (error) {
        console.error(
          `Error in button creation process for ${button.name}:`,
          error
        );
        this.failedUIElements.push({
          loadFunction: () =>
            this.attemptUIElementLoad(() => {
              const buttonControl = ButtonFactory.createImageButton(
                button.name,
                buttonSize,
                buttonSize,
                thickness,
                button.offsetX,
                button.offsetY,
                horizontalAlignment,
                verticalAlignment,
                this.buttonFunction.bind(this),
                button.action,
                "directionalPadTap"
              );
              dPadContainer.addControl(buttonControl);
            }, `directionalButton_${button.name}`),
          elementName: `directionalButton_${button.name}`,
          retryCount: 0,
          error: error.message,
          isRateLimitError: error.message && error.message.includes("429"),
        });
      }
    });
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

    const actionButtons = [
      {
        name: "buttonMagic",
        offsetX: -specialButtonXOffset,
        action: "MAGIC",
      },
      {
        name: "buttonArtifact",
        offsetX: specialButtonXOffset,
        action: "ARTIFACT",
      },
    ];

    actionButtons.forEach((button) => {
      this.attemptUIElementLoad(() => {
        const buttonControl = ButtonFactory.createImageButton(
          button.name,
          specialButtonSize,
          specialButtonSize,
          thickness,
          button.offsetX,
          0,
          horizontalAlignment,
          verticalAlignment,
          this.buttonFunction.bind(this),
          button.action
        );
        dPadContainer.addControl(buttonControl);
      }, `actionButton_${button.name}`);
    });
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
    if (FundamentalSystemBridge["gameplayManagerComposite"] != null) {
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

      FundamentalSystemBridge[
        "gameplayManagerComposite"
      ].processAttemptedMovementFromUIClick(playerDirection);
    }
  }

  /**
   * Attempts to load a UI element and tracks failures for retry
   * @param {Function} loadFunction - The function that loads the UI element
   * @param {string} elementName - Name of the UI element for tracking
   * @param {number} retryCount - Current retry attempt number
   */
  attemptUIElementLoad(loadFunction, elementName, retryCount = 0) {
    try {
      // console.log(`Attempting to load UI element: ${elementName}`);
      loadFunction();
      // console.log(`Successfully loaded UI element: ${elementName}`);
    } catch (error) {
      //console.warn(`Failed to load UI element: ${elementName}`, error);

      // Check if it's a rate limit error
      const isRateLimitError =
        error.message &&
        (error.message.includes("429") ||
          error.message.includes("Too Many Requests") ||
          error.message.includes("rate limit"));

      if (retryCount < this.maxRetryAttempts) {
        const failedElement = {
          loadFunction,
          elementName,
          retryCount: retryCount + 1,
          error: error.message,
          isRateLimitError,
          timestamp: new Date().toISOString(),
        };
        this.failedUIElements.push(failedElement);
        console.log(`Added to failed elements: ${elementName}`, failedElement);

        // If it's a rate limit error, add a delay before retry
        if (isRateLimitError) {
          console.log(
            `Rate limit hit for ${elementName}, waiting ${this.retryDelay}ms before retry`
          );
          setTimeout(() => {
            this.retryFailedUIElements();
          }, this.retryDelay);
        }
      } else {
        console.error(
          `Failed to load UI element ${elementName} after ${this.maxRetryAttempts} attempts`
        );
      }
    }
  }

  /**
   * Retries loading failed UI elements
   */
  retryFailedUIElements() {
    if (this.failedUIElements.length === 0) return;

    console.log(`Retrying ${this.failedUIElements.length} failed UI elements`);
    const stillFailed = [];

    this.failedUIElements.forEach((element) => {
      try {
        element.loadFunction();
      } catch (error) {
        console.warn(
          `Retry failed for UI element: ${element.elementName}`,
          error
        );

        // Check if it's still a rate limit error
        const isRateLimitError =
          error.message &&
          (error.message.includes("429") ||
            error.message.includes("Too Many Requests") ||
            error.message.includes("rate limit"));

        if (element.retryCount < this.maxRetryAttempts) {
          stillFailed.push({
            ...element,
            retryCount: element.retryCount + 1,
            isRateLimitError,
          });

          // If it's a rate limit error, increase the delay for next retry
          if (isRateLimitError) {
            this.retryDelay *= 1.5; // Increase delay by 50% each time
            console.log(
              `Rate limit still hit for ${element.elementName}, increasing delay to ${this.retryDelay}ms`
            );
          }
        } else {
          console.error(
            `Failed to load UI element ${element.elementName} after ${this.maxRetryAttempts} attempts`
          );
        }
      }
    });

    this.failedUIElements = stillFailed;
  }
}
