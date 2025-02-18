/**
 * ImageFactory
 *
 * Provides methods to create standardized Babylon.GUI.Image elements
 * with configurable styles and interactive behavior.
 */
class ImageFactory {
  /**
   * Creates a clickable Babylon.GUI.Image with optional sound effect.
   *
   * @param {string} imageName - Unique name identifier for the image.
   * @param {string} imageNickname - Asset nickname to retrieve the image URL from the manifest.
   * @param {number} [imageWidth=150] - The width of the image in pixels.
   * @param {number} [imageHeight=150] - The height of the image in pixels.
   * @param {number} [offsetX=0] - Horizontal offset (in pixels) from the alignment position.
   * @param {number} [offsetY=0] - Vertical offset (in pixels) from the alignment position.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {string} [stretchType=BABYLON.GUI.Image.STRETCH_UNIFORM] - Defines how the image is stretched.
   * @param {boolean} [isClickable=false] - If true, the image will respond to pointer click events.
   * @param {function} [onClickCallback=null] - Callback function executed upon click.
   * @param {*} [clickParameter=null] - Parameter passed to the click callback.
   * @param {string} [soundEffectNickname=""] - Asset nickname for the sound effect to play on click.
   * @returns {BABYLON.GUI.Image} The interactive image control.
   */
  static createClickableImage(
    imageName,
    imageNickname,
    imageWidth = 150,
    imageHeight = 150,
    offsetX = 0,
    offsetY = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    stretchType = BABYLON.GUI.Image.STRETCH_UNIFORM,
    isClickable = false,
    onClickCallback = null,
    clickParameter = null,
    soundEffectNickname = ""
  ) {
    // Retrieve the image URL using the asset manifest
    const imageUrl = UIAssetManifest.getAssetUrl(imageNickname);

    // Create the Babylon GUI Image control
    const image = new BABYLON.GUI.Image(imageName, imageUrl);
    image.width = imageWidth + "px";
    image.height = imageHeight + "px";
    image.left = offsetX + "px";
    image.top = offsetY + "px";
    image.stretch = stretchType;
    image.horizontalAlignment = horizontalAlignment;
    image.verticalAlignment = verticalAlignment;

    // Attach click event if required and valid callback provided
    if (isClickable && typeof onClickCallback === "function") {
      image.onPointerUpObservable.add(() => {
        // Play sound effect if a nickname is provided
        if (soundEffectNickname !== "") {
          SoundEffectsManager.playSound(soundEffectNickname);
        }
        // Execute the provided callback with the designated parameter
        onClickCallback(clickParameter);
      });
    }

    return image;
  }

  /**
   * Creates a non-clickable Babylon.GUI.Image.
   *
   * @param {string} imageName - Unique name identifier for the image.
   * @param {string} imageNickname - Asset nickname to retrieve the image URL from the manifest.
   * @param {number} [imageWidth=150] - The width of the image in pixels.
   * @param {number} [imageHeight=150] - The height of the image in pixels.
   * @param {number} [offsetX=0] - Horizontal offset (in pixels) from the alignment position.
   * @param {number} [offsetY=0] - Vertical offset (in pixels) from the alignment position.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {string} [stretchType=BABYLON.GUI.Image.STRETCH_UNIFORM] - Defines how the image is stretched.
   * @returns {BABYLON.GUI.Image} The non-interactive image control.
   */
  createNonClickableImage(
    imageName,
    imageNickname,
    imageWidth = 150,
    imageHeight = 150,
    offsetX = 0,
    offsetY = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    stretchType = BABYLON.GUI.Image.STRETCH_UNIFORM
  ) {
    // Retrieve the image URL using the asset manifest
    const imageUrl = UIAssetManifest.getAssetUrl(imageNickname);

    // Create the Babylon GUI Image control
    const image = new BABYLON.GUI.Image(imageName, imageUrl);
    image.width = imageWidth + "px";
    image.height = imageHeight + "px";
    image.left = offsetX + "px";
    image.top = offsetY + "px";
    image.stretch = stretchType;
    image.horizontalAlignment = horizontalAlignment;
    image.verticalAlignment = verticalAlignment;

    return image;
  }

  /**
   * Creates a special interactive Babylon.GUI.Image with advanced trigger assignment.
   *
   * @param {string} imageName - Unique name identifier for the image.
   * @param {string} imageNickname - Asset nickname to retrieve the image URL from the manifest.
   * @param {number} [imageWidth=150] - The width of the image in pixels.
   * @param {number} [imageHeight=150] - The height of the image in pixels.
   * @param {number} [offsetX=0] - Horizontal offset (in pixels) from the alignment position.
   * @param {number} [offsetY=0] - Vertical offset (in pixels) from the alignment position.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {string} [stretchType=BABYLON.GUI.Image.STRETCH_UNIFORM] - Defines how the image is stretched.
   * @param {function} functionToPassIn - Function to execute when the special trigger activates.
   * @param {*} parameterToPassIn - Parameter to pass to the function.
   * @param {boolean} usesDefaultParameter - Flag indicating whether to use a default parameter.
   * @param {boolean} hasSpecialFunction - Flag determining if an additional special function is available.
   * @param {string} specialFunctionOrganizationGroup - Identifier for grouping special functions.
   * @param {string|number} specialFunctionValueID - Unique identifier for the special function's value.
   * @param {string} [specialTrigger=""] - Optional trigger identifier for the image.
   * @param {string} [soundEffectNickname=""] - Asset nickname for the sound effect to play when triggered.
   * @returns {BABYLON.GUI.Image} The advanced interactive image control.
   */
  static createSpecialInteractiveImage(
    imageName,
    imageNickname,
    imageWidth = 150,
    imageHeight = 150,
    offsetX = 0,
    offsetY = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    stretchType = BABYLON.GUI.Image.STRETCH_UNIFORM,
    functionToPassIn,
    parameterToPassIn,
    usesDefaultParameter,
    hasSpecialFunction,
    specialFunctionOrganizationGroup,
    specialFunctionValueID,
    specialTrigger = "",
    soundEffectNickname = ""
  ) {
    // Retrieve the image URL using the asset manifest
    const imageUrl = UIAssetManifest.getAssetUrl(imageNickname);

    // Create the Babylon GUI Image control
    const image = new BABYLON.GUI.Image(imageName, imageUrl);
    image.width = imageWidth + "px";
    image.height = imageHeight + "px";
    image.left = offsetX + "px";
    image.top = offsetY + "px";
    image.stretch = stretchType;
    image.horizontalAlignment = horizontalAlignment;
    image.verticalAlignment = verticalAlignment;

    // Assign special interactive triggers using the SpecialTriggerAssigner
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

    return image;
  }
}
