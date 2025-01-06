class BaseGameUI extends BABYLON.Scene {
  initUI() {
    // Create a full-screen GUI on top of the scene
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "BaseGameUI",
        true,
        this
      );

    this.advancedTexture.idealHeight = 2500;
    this.advancedTexture.idealWidth = 1250;

    // Add the bottom base panel
    const bottomBasePanel = new BABYLON.GUI.Image(
      "menuBackground",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/uiBasePanel.png"
    );
    bottomBasePanel.stretch = BABYLON.GUI.Image.STRETCH_FILL;
    bottomBasePanel.width = "1250px";
    bottomBasePanel.height = "550px";
    bottomBasePanel.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(bottomBasePanel);

    // Container to center the game base pad and buttons
    const baseContainer = new BABYLON.GUI.Container("BaseContainer");
    baseContainer.width = "1250px";
    baseContainer.height = "550px"; // Matches bottom panel height
    baseContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.advancedTexture.addControl(baseContainer);

    // Game base pad (centered inside container)
    const gameBasePad = new BABYLON.GUI.Image(
      "gameBasePad",
      "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/gamepadBase.png"
    );
    gameBasePad.width = "400px"; // Scales relative to ideal width (320px at 1000px)
    gameBasePad.height = "400px"; // Maintains aspect ratio (circle)
    gameBasePad.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    gameBasePad.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    baseContainer.addControl(gameBasePad);

    // Add directional buttons
    const createButton = (name, imageUrl, offsetX, offsetY, direction) => {
      const button = BABYLON.GUI.Button.CreateImageOnlyButton(name, imageUrl);

      // Explicitly set equal width and height for circular buttons
      button.width = "160px"; // 110px at 1000px width
      button.height = "160px"; // Ensure buttons are square
      button.left = offsetX;
      button.top = offsetY;
      // Ensure buttons are centered relative to the gameBasePad
      button.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      button.thickness = 0;
      baseContainer.addControl(button);

      button.onPointerUpObservable.add(() => {
        this.printDirection(direction);
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
  printDirection(direction) {
    console.log(`Button pressed: ${direction}`);
  }
}
