/**
 * ContainerFactory
 *
 * Provides static methods to create standardized GUI containers.
 */
class ContainerFactory {
  /**
   * Creates a UI container with customizable styles, alignment, and optional background image.
   *
   * @param {string} name - Unique control name for the container.
   * @param {number} width - Width of the container.
   * @param {number} height - Height of the container.
   * @param {number} [thickness=0] - Border thickness.
   * @param {string} [backgroundColor="transparent"] - Background color of the container.
   * @param {number} offsetX - Horizontal offset.
   * @param {number} offsetY - Vertical offset.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   * @param {boolean} [clipChildren=true] - Whether to clip overflowing child elements.
   * @param {boolean} [clipContent=true] - Whether to clip overflowing text content.
   * @param {string} [backgroundImageNickname=""] - Nickname to obtain the background image asset (optional).
   * @param {string} [backgroundImageStretchType="fill"] - Stretch type for the background image.
   * @returns {BABYLON.GUI.Rectangle} The constructed container.
   */
  static createContainer(
    containerName,
    containerWidth = 300,
    containerHeight = 300,
    containerThickness = 2,
    containerBackgroundColor = "transparent",
    containerOffsetX = 0,
    containerOffsetY = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    clipChildren = true,
    clipContent = true,
    backgroundImageNickname = "",
    backgroundImageStretchType = BABYLON.GUI.Image.STRETCH_FILL
  ) {
    const container = new BABYLON.GUI.Rectangle(containerName);
    container.width = containerWidth + "px";
    container.height = containerHeight + "px";
    container.left = containerOffsetX + "px";
    container.top = containerOffsetY + "px";
    container.thickness = containerThickness;
    container.color = "white"; // Default border color
    container.background = containerBackgroundColor;
    container.horizontalAlignment = horizontalAlignment;
    container.verticalAlignment = verticalAlignment;
    container.clipChildren = clipChildren;
    container.clipContent = clipContent;
    // Apply background image if provided
    if (backgroundImageNickname !== "") {
      const imageUrl = UIAssetManifest.getAssetUrl(backgroundImageNickname);
      const backgroundImage = new BABYLON.GUI.Image(name + "_bg", imageUrl);
      backgroundImage.stretch = backgroundImageStretchType;
      container.addControl(backgroundImage);
    }

    return container;
  }
}
