/**
 * ButtonFactory
 *
 * Provides static methods to create standardized GUI buttons.
 */
class ButtonFactory {
  /**
   * Creates an image-only button with preset styles, alignment, and event handling.
   *
   * @param {string} name - Unique control name for the button.
   * @param {string} imageUrl - URL of the image asset.
   * @param {number} width - Width of the button.
   * @param {number} height - Height of the button.
   * @param {number} [thickness=0] - Border thickness.
   * @param {number} offsetX - Horizontal offset.
   * @param {number} offsetY - Vertical offset
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {function} onClick - Callback function to call on pointer-up.
   * @param {any} clickParameter - A value to be passed to the onClick callback.
   * @returns {BABYLON.GUI.Button} The constructed button.
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
  ) {
    const imageUrl = UIAssetManifest.getAssetUrl(name);
    const button = BABYLON.GUI.Button.CreateImageOnlyButton(name, imageUrl);
    button.width = width + "px";
    button.height = height + "px";
    button.left = offsetX + "px";
    button.top = offsetY + "px";
    button.horizontalAlignment = horizontalAlignment;
    button.verticalAlignment = verticalAlignment;
    button.thickness = thickness;
    button.onPointerUpObservable.add(() => onClick(clickParameter));
    return button;
  }
} 