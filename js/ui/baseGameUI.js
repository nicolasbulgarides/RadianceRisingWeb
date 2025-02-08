class BaseGameUI extends BABYLON.Scene {
  initUI() {
    this.autoClear = false;
    var cameraBase = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(0, 0, 0),
      this
    );
    cameraBase.setTarget(BABYLON.Vector3.Zero());
    // Create a full-screen GUI on top of the scene
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "BaseGameUI",
        true,
        this
      );

    this.advancedTexture.idealHeight = 2000;
    this.advancedTexture.idealWidth = 1000;
    this.advancedTexture.useSmallestIdeal = true;
    this.advancedTexture.renderScale = 2;

    // Add the bottom base panel
    const bottomBasePanel = new BABYLON.GUI.Image(
      "menuBackground",
      UIAssetManifest.getAssetUrl("uiBasePanel")
    );
    bottomBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    bottomBasePanel.width = "1000px";
    bottomBasePanel.height = "480px";
    bottomBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(bottomBasePanel);

    // Container to center the game base pad and buttons
    const baseContainer = new BABYLON.GUI.Container("BaseContainer");
    baseContainer.width = "1000px";
    baseContainer.height = "480px"; // Matches bottom panel height
    baseContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(baseContainer);

    // Game base pad (centered inside container)
    const gameBasePad = new BABYLON.GUI.Image(
      "gameBasePad",
      UIAssetManifest.getAssetUrl("gamepadBase")
    );
    gameBasePad.width = "360px"; // Scales relative to ideal width (320px at 1000px)
    gameBasePad.height = "360px"; // Maintains aspect ratio (circle)
    gameBasePad.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    gameBasePad.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    baseContainer.addControl(gameBasePad);

    // Add directional buttons
    const createButton = (
      name,
      imageUrl,
      offsetX,
      offsetY,
      buttonFunctionKey
    ) => {
      const button = BABYLON.GUI.Button.CreateImageOnlyButton(name, imageUrl);

      // Explicitly set equal width and height for circular buttons
      button.width = "140px"; // 110px at 1000px width
      button.height = "140px"; // Ensure buttons are square
      button.left = offsetX;
      button.top = offsetY;
      // Ensure buttons are centered relative to the gameBasePad
      button.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      button.thickness = 0;
      baseContainer.addControl(button);

      button.onPointerUpObservable.add(() => {
        this.buttonFunction(buttonFunctionKey);
      });

      return button;
    };

    // Place directional buttons with proper alignment and scaling
    createButton(
      "buttonLeft",
      UIAssetManifest.getAssetUrl("buttonLeft"),
      "-160px", // Left of center
      "0px", // Centered vertically
      "LEFTCLICK"
    );
    createButton(
      "buttonRight",
      UIAssetManifest.getAssetUrl("buttonRight"),
      "160px", // Right of center
      "0px", // Centered vertically
      "RIGHTCLICK"
    );
    createButton(
      "buttonUp",
      UIAssetManifest.getAssetUrl("buttonUp"),
      "0px", // Centered horizontally
      "-160px", // Above center
      "UPCLICK"
    );
    createButton(
      "buttonDown",
      UIAssetManifest.getAssetUrl("buttonDown"),
      "0px", // Centered horizontally
      "160px", // Below center
      "DOWNCLICK"
    );

    createButton(
      "buttonLeft",
      UIAssetManifest.getAssetUrl("buttonMagic1"),
      "-360px", // Left of center
      "0px", // Centered vertically
      "MAGIC"
    );

    createButton(
      "buttonLeft",
      UIAssetManifest.getAssetUrl("buttonArtifact"),
      "360px", // Left of center
      "0px", // Centered vertically
      "ARTIFACT"
    );
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));

    window.BaseGameUI = this;
  }
  buttonFunction(buttonFunctionKey) {
    if (buttonFunctionKey === "RIGHTCLICK") {
      this.processMovementClick(buttonFunctionKey);
    } else if (buttonFunctionKey === "LEFTCLICK") {
      this.processMovementClick(buttonFunctionKey);
    } else if (buttonFunctionKey === "UPCLICK") {
      this.processMovementClick(buttonFunctionKey);
    } else if (buttonFunctionKey === "DOWNCLICK") {
      this.processMovementClick(buttonFunctionKey);
    } else if (buttonFunctionKey === "MAGIC") {
      window.SoundEffectsManager.playSound("radianceGameStart");
    } else if (buttonFunctionKey === "ARTIFACT") {
      window.SoundEffectsManager.playSound("artifactUsage");
      //  window.soundManager.playNextSound();
    }

    //console.log(`Button pressed: ${buttonFunctionKey}`);
  }

  setBackgroundColor(color) {
    this.clearColor = color;
  }

  registerGameplayManager(gameplayManager) {
    this.gameplayManager = gameplayManager;
  }

  processMovementClick(buttonFunction) {
    let buttonFunctionKey = String(buttonFunction);
    if (this.gameplayManager != null) {
      let playerDirection = null;
      window.SoundEffectsManager.playSound("menuMovement");

      if (buttonFunctionKey === "LEFTCLICK") {
        playerDirection = "LEFT";
      } else if (buttonFunctionKey === "RIGHTCLICK") {
        playerDirection = "RIGHT";
      } else if (buttonFunctionKey === "UPCLICK") {
        playerDirection = "UP";
      } else if (buttonFunctionKey === "DOWNCLICK") {
        playerDirection = "DOWN";
      }

      this.gameplayManager.processAttemptedMovementFromUIClick(playerDirection);
    }
  }
}
