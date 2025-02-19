/**
 * ButtonFactory
 *
 * Provides static methods to create standardized GUI buttons.
 */
class ButtonFactory {
  /**
   * Creates an image-only button with preset styles, alignment, and event handling.
   *
   * @param {string} name - Unique control name for the button and asset nickname.
   * @param {number} [width=140] - Width of the button in pixels.
   * @param {number} [height=140] - Height of the button in pixels.
   * @param {number} [thickness=0] - Border thickness.
   * @param {number} offsetX - Horizontal offset in pixels.
   * @param {number} offsetY - Vertical offset in pixels.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {function} onClick - Callback function to invoke on pointer-up.
   * @param {any} clickParameter - Parameter to pass to the onClick callback.
   * @param {string} [soundEffectNickname=""] - Nickname for a sound effect to play on click.
   * @returns {BABYLON.GUI.Button} The constructed GUI button.
   */
  static createImageButton(
    name,
    width = 140,
    height = 140,
    thickness = 0,
    offsetX = 0,
    offsetY = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    onClick,
    clickParameter,
    soundEffectNickname = ""
  ) {
    // Retrieve the image URL using the 'name' as the asset nickname.
    const imageUrl = UIAssetManifest.getAssetUrl(name);
    const button = BABYLON.GUI.Button.CreateImageOnlyButton(name, imageUrl);
    button.width = width + "px";
    button.height = height + "px";
    button.left = offsetX + "px";
    button.top = offsetY + "px";
    button.horizontalAlignment = horizontalAlignment;
    button.verticalAlignment = verticalAlignment;
    button.thickness = thickness;
    button.stretch = BABYLON.GUI.Image.STRETCH_NONE;
    button.onPointerUpObservable.add(() => {
      onClick(clickParameter);
    });
    return button;
  }

  /**
   * Creates a specialized interactive image button with customizable styles, alignment, and event handling.
   *
   * @param {string} imageName - Unique control name for the image button.
   * @param {string} imageNickname - Nickname used to obtain the image asset URL.
   * @param {number} [imageWidth=150] - Width of the image button in pixels.
   * @param {number} [imageHeight=150] - Height of the image button in pixels.
   * @param {number} offsetX - Horizontal offset in pixels from its alignment position.
   * @param {number} offsetY - Vertical offset in pixels from its alignment position.
   * @param {number} [thickness=0] - Border thickness.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {function} functionToPassIn - Callback function for special trigger functionality.
   * @param {any} parameterToPassIn - Parameter to pass to the special trigger callback.
   * @param {boolean} usesDefaultParameter - Indicates whether to use the default parameter.
   * @param {boolean} hasSpecialFunction - Flag to determine if a special function is assigned.
   * @param {string} specialFunctionOrganizationGroup - Group identifier for organizing special functions.
   * @param {number} specialFunctionValueID - Unique identifier for the special function value.
   * @param {string} [specialTrigger=""] - Determines if the button has a special trigger.
   * @param {string} [soundEffectNickname=""] - Nickname for a sound effect to play on click.
   * @returns {BABYLON.GUI.Button} The constructed interactive image button.
   */
  static createSpecialInteractiveButton(
    imageName,
    imageNickname,
    imageWidth = 150,
    imageHeight = 150,
    offsetX = 0,
    offsetY = 0,
    thickness = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    functionToPassIn,
    parameterToPassIn,
    usesDefaultParameter,
    hasSpecialFunction,
    specialFunctionOrganizationGroup,
    specialFunctionValueID,
    specialTrigger = "",
    soundEffectNickname = ""
  ) {
    // Retrieve the image URL using the provided imageNickname.
    const imageUrl = UIAssetManifest.getAssetUrl(imageNickname);

    // Create the Babylon.js GUI Image button.
    const imageButton = BABYLON.GUI.Button.CreateImageOnlyButton(
      imageName,
      imageUrl
    );
    imageButton.width = imageWidth + "px";
    imageButton.height = imageHeight + "px";
    imageButton.left = offsetX + "px";
    imageButton.top = offsetY + "px";
    imageButton.thickness = thickness;
    imageButton.horizontalAlignment = horizontalAlignment;
    imageButton.verticalAlignment = verticalAlignment;

    // Assign special trigger functionality with the provided parameters.
    SpecialTriggerAssigner.assignTrigger(
      specialTrigger,
      functionToPassIn,
      parameterToPassIn,
      hasSpecialFunction,
      specialFunctionOrganizationGroup,
      specialFunctionValueID,
      usesDefaultParameter,
      soundEffectNickname,
      this
    );

    return imageButton;
  }
}
