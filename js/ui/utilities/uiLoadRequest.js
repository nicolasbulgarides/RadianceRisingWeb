/**
 * Class representing a single UI load request with extended event handling.
 * Now includes an `activationEvent` property that lets you specify how the
 * assigned function should be triggered (e.g., onMouseOver, onMouseExit, click, etc.).
 */
class UILoadRequest {
  /**
   * Creates a UI load request.
   *
   * @param {string} uiElementNickname - A unique identifier for the UI element.
   * @param {string} uiCategory - Type of UI element ("Image", "ImageButton", "Container", "Special").
   * @param {number} width - Width of the UI element.
   * @param {number} height - Height of the UI element.
   * @param {number} thickness - Border/outline thickness.
   * @param {string} horizontalAlignment - "left", "center", "right".
   * @param {string} verticalAlignment - "top", "middle", "bottom".
   * @param {number} xOffset - X offset relative to the alignment.
   * @param {number} yOffset - Y offset relative to the alignment.
   * @param {BABYLON.Scene} recipientScene - The Babylon.js scene for the UI element.
   * @param {string} activationEvent - The UI event that will trigger the assigned function.
   *                                   For example: "onMouseOver", "onMouseExit", "click", "clickRelease".
   * @param {Function} functionToCall - The function to call when the event occurs.
   * @param {*} functionParameter - Parameter to pass to the function when called.
   * @param {boolean} functionToCallSpecialOverrideEnabled - Whether a special override function should be used.
   * @param {string} functionToCallSpecialOverrideID - Identifier for the special override function.
   * @param {string} soundEffectForActivation - Sound to play when the UI element is activated.
   */
  constructor(
    uiElementNickname,
    uiCategory,
    width,
    height,
    thickness,
    horizontalAlignment,
    verticalAlignment,
    xOffset,
    yOffset,
    recipientScene,
    activationEvent,
    functionToCall,
    functionParameter,
    functionToCallSpecialGroupId,
    functionToCallSpecialOverrideEnabled,
    functionToCallSpecialOverrideID,
    soundEffectForActivation
  ) {
    // Basic properties.
    this.uiElementNickname = uiElementNickname;
    this.uiCategory = uiCategory;
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.horizontalAlignment = horizontalAlignment;
    this.verticalAlignment = verticalAlignment;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.recipientScene = recipientScene;

    // New property: which event should trigger the function.
    this.activationEvent = activationEvent; // e.g., "onMouseOver", "click", etc.

    // Function properties.
    this.functionToCall = functionToCall;
    this.functionParameter = functionParameter;
    this.functionToCallSpecialGroupId = functionToCallSpecialGroupId;
    this.functionToCallSpecialOverrideEnabled =
      functionToCallSpecialOverrideEnabled;
    this.functionToCallSpecialOverrideID = functionToCallSpecialOverrideID;
    this.soundEffectForActivation = soundEffectForActivation;

    // Internal state for error handling.
    this.isLoaded = false;
    this.error = null;
  }

  formUIElementByCategory() {
    switch (this.uiCategory) {
      case "image":
        return formImageUIElement();
      case "imageButton":
        return formImageButtonUIElement();
      case "container":
        return formContainerUIElement();
      case "special":
        return formSpecialUIElement();
      default:
        return formBlankContainerAndReportError();
    }
  }

  formNonInteractiveUIElement() {
    let uiElementFormed = null;
    let uiTypeStandardized = this.uiCategory.toLowerCase();
    switch (uiTypeStandardized) {
      case "image":
        uiElementFormed = this.utilizeImageFactory();
        break;
      case "container":
        uiElementFormed = this.utilizeContainerFactory();
        break;
      default:
        uiElementFormed = this.utilizeBlankContainerAndReportError();
        break;
    }
    return uiElementFormed;
  }

  utilizeContainerFactory() {}

  utilizeInteractiveImageFactory() {}

  utilizeNonInteractiveImageFactory() {}
  utilizeImageButtonFactory(
    finalizedFunctionToRegister,
    finalizedFunctionParameterToPass
  ) {
    let imageButton = ButtonFactory.createImageButton(
      this.uiElementNickname,
      this.width,
      this.height,
      this.thickness,
      this.xOffset,
      this.yOffset,
      this.horizontalAlignment,
      this.verticalAlignment,
      finalizedFunctionToRegister,
      finalizedFunctionParameterToPass
    );
    return imageButton;
  }
  formInteractiveUIElement(
    finalizedFunctionToRegister,
    finalizedFunctionParameterToPass
  ) {
    let uiElementFormed = null;
    let uiTypeStandardized = this.uiCategory.toLowerCase();
    switch (uiTypeStandardized) {
      case "imagebutton":
      case "imgbutton":
        uiElementFormed = this.utilizeImageButtonFactory(
          finalizedFunctionToRegister,
          finalizedFunctionParameterToPass
        );
        break;
    }
    return uiElementFormed;
  }

  /**
   * Executes the load request.
   * Creates the UI element, configures its properties, and attaches the event handler
   * based on the specified activation event.
   *
   * @returns {Promise<Object>} Resolves with the created UI element or rejects with an error.
   */
  execute(uiTextureToAddTo) {
    return new Promise((resolve, reject) => {
      try {
        let uiElement = null;
        let finalizedFunctionToRegister = this.getFinalizedFunctionToRegister();
        let finalizedFunctionParameterToPass =
          this.getFinalizedFunctionParameterToPass();

        if (
          typeof this.functionToCall === "function" ||
          this.functionToCallSpecialOverrideEnabled
        ) {
          uiElement = this.formInteractiveUIElement(
            finalizedFunctionToRegister,
            finalizedFunctionParameterToPass
          );
        } else {
          uiElement = this.formNonInteractiveUIElement();
        }

        // Play the sound effect if one is specified.
        if (this.soundEffectForActivation) {
          // Replace with actual sound playing code (e.g., using Babylon.Sound).
        }

        // Mark the request as loaded successfully.
        this.isLoaded = true;

        // Resolve with the created UI element.
        resolve(uiElement);
      } catch (err) {
        // Store and propagate any error.
        this.error = err;
        reject(err);
      }
    });
  }

  getFinalizedFunctionToRegister() {
    let finalizedFuctionToRegister = null;
    if (
      this.functionToCall != null &&
      typeof this.functionToCall === "function" &&
      this.activationEvent != null &&
      this.activationEvent != ""
    ) {
      finalizedFuctionToRegister = this.functionToCall;
    } else if (
      this.functionToCallSpecialOverrideEnabled &&
      this.functionToCallSpecialOverrideID != null &&
      this.activationEvent != null &&
      this.activationEvent != ""
    ) {
      finalizedFunctionToRegister =
        SpecialUIFunctionAssigner.getSpecialUIFunction(
          this.functionToCallSpecialGroupId,
          this.functionToCallSpecialOverrideID
        );
    }

    return finalizedFuctionToRegister;
  }

  getFinalizedFunctionParameterToPass() {
    let finalizedFunctionParameterToPass = -1;
    if (this.functionParameter != null) {
      finalizedFunctionParameterToPass = this.functionParameter;
    }

    if (this.functionToCallSpecialOverrideEnabled) {
      finalizedFunctionParameterToPass =
        SpecialUIParameterAssigner.assignParameterToGroup(
          this.functionToCallSpecialGroupId,
          this.functionToCallSpecialOverrideID
        );
    }
    return finalizedFunctionParameterToPass;
  }

  assignFunctionObservableComposite(uiElement) {
    if (this.functionToCall != null && this.activationEvent != null) {
    }
  }
}
