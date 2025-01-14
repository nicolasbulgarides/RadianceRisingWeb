class BaseGameUI extends BABYLON.Scene {
  initUI() {
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
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/uiBasePanel.png"
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
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/gamepadBase.png"
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
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/buttonLeft.png",
      "-160px", // Left of center
      "0px", // Centered vertically
      "LEFTCLICK"
    );
    createButton(
      "buttonRight",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/buttonRight.png",
      "160px", // Right of center
      "0px", // Centered vertically
      "RIGHTCLICK"
    );
    createButton(
      "buttonUp",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/buttonUp.png",
      "0px", // Centered horizontally
      "-160px", // Above center
      "UPCLICK"
    );
    createButton(
      "buttonDown",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/buttonDown.png",
      "0px", // Centered horizontally
      "160px", // Below center
      "DOWNCLICK"
    );

    createButton(
      "buttonLeft",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/buttonMagic1.png",
      "-360px", // Left of center
      "0px", // Centered vertically
      "MAGIC"
    );

    createButton(
      "buttonLeft",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/buttonArtifact.png",
      "360px", // Left of center
      "0px", // Centered vertically
      "ARTIFACT"
    );
  }
  buttonFunction(buttonFunctionKey) {
    if (buttonFunctionKey === "RIGHTCLICK") {
      window.soundManager.playSound("menuMovement");
    } else if (buttonFunctionKey === "LEFTCLICK") {
      window.soundManager.playSound("menuMovement");
    } else if (buttonFunctionKey === "UPCLICK") {
      window.soundManager.playSound("menuMovement");
    } else if (buttonFunctionKey === "DOWNCLICK") {
      window.soundManager.playSound("menuMovement");
    } else if (buttonFunctionKey === "MAGIC") {
      window.soundManager.playSound("radianceGameStart");
    } else if (buttonFunctionKey === "ARTIFACT") {
      window.soundManager.playSound("artifactUsage");
    }

    console.log(`Button pressed: ${buttonFunctionKey}`);
  }
}
