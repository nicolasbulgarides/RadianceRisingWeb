/**
 * ArtifactSocketBar
 *
 * A self-contained, modular UI element that displays an artifact socket bar with 3 fixed sockets.
 * Each socket consists of layered images:
 * - crystalSocketBase0 (bottom layer, always visible)
 * - crystalSocketFilledShadow1 (middle layer, only visible when socket is full/unused)
 * - crystalSocketPurple2 (middle layer, always visible)
 * - crystalSocketFrame3 (top layer, always visible)
 *
 * The bar is fixed to 3 sockets and displays artifact usage from left to right.
 *
 * @example
 * // Create an artifact socket bar with 3 max artifacts, positioned above artifact button
 * const artifactBar = new ArtifactSocketBar(
 *   "playerArtifactBar",
 *   3,  // maxArtifacts (fixed)
 *   3,  // currentArtifacts (starts full)
 *   64, // socketWidth
 *   64, // socketHeight
 *   0,  // offsetX
 *   -50, // offsetY (above center)
 *   BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
 *   BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
 * );
 *
 * // Create the UI elements
 * const artifactBarContainer = artifactBar.create();
 *
 * // Add to your UI scene's advanced texture
 * uiScene.advancedTexture.addControl(artifactBarContainer);
 *
 * // Use the artifact bar
 * artifactBar.useArtifact(); // Consumes 1 artifact and updates display
 * artifactBar.setCurrentArtifacts(2); // Set artifacts to 2
 * artifactBar.consumeArtifact(1); // Consume 1 artifact
 * artifactBar.restoreArtifact(1); // Restore 1 artifact
 */
class ArtifactSocketBar {
  /**
   * Creates a new ArtifactSocketBar instance.
   * @param {string} barName - Unique identifier for this artifact bar instance.
   * @param {number} [maxArtifacts=3] - Maximum number of artifacts (fixed to 3).
   * @param {number} [currentArtifacts] - Current number of available artifacts (defaults to maxArtifacts).
   * @param {number} [socketWidth=64] - Width of each socket in pixels.
   * @param {number} [socketHeight=64] - Height of each socket in pixels.
   * @param {number} [offsetX=0] - Horizontal offset from alignment position.
   * @param {number} [offsetY=0] - Vertical offset from alignment position.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   */
  constructor(
    barName,
    maxArtifacts = 3,
    currentArtifacts = null,
    socketWidth = 64,
    socketHeight = 64,
    offsetX = 0,
    offsetY = 0,
    horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
  ) {
    this.barName = barName;
    this.socketWidth = socketWidth;
    this.socketHeight = socketHeight;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.horizontalAlignment = horizontalAlignment;
    this.verticalAlignment = verticalAlignment;

    // Artifact socket bar is fixed to 3 sockets
    this.maxArtifacts = 3;
    this.currentArtifacts = currentArtifacts !== null ? Math.max(0, Math.min(this.maxArtifacts, currentArtifacts)) : this.maxArtifacts;

    // Storage for UI elements - each socket has 4 layers
    this.container = null;
    this.sockets = []; // Array of socket objects, each containing base, shadow, purple, frame layers
    this.socketSpacing = 10; // Spacing between sockets

    // Track if the bar has been initialized
    this.isInitialized = false;
  }

  /**
   * Creates and returns the artifact socket bar container with all sockets and layers.
   * This should be called once and the returned container added to a UI scene.
   * @returns {BABYLON.GUI.Container} The container holding all artifact socket bar elements.
   */
  create() {
    if (this.isInitialized) {
      console.warn(`ArtifactSocketBar ${this.barName} has already been created. Returning existing container.`);
      return this.container;
    }

    // Create the main container for the artifact socket bar
    const totalWidth = (this.socketWidth * this.maxArtifacts) + (this.socketSpacing * (this.maxArtifacts - 1));
    this.container = new BABYLON.GUI.Container(`${this.barName}_Container`);
    this.container.width = totalWidth + "px";
    this.container.height = this.socketHeight + "px";
    this.container.left = this.offsetX + "px";
    this.container.top = this.offsetY + "px";
    this.container.horizontalAlignment = this.horizontalAlignment;
    this.container.verticalAlignment = this.verticalAlignment;
    // Remove all padding to ensure sockets line up perfectly
    this.container.paddingLeft = 0;
    this.container.paddingRight = 0;
    this.container.paddingTop = 0;
    this.container.paddingBottom = 0;

    // Create all 3 sockets
    this.createSockets();

    // Update visibility based on current artifacts
    this.updateArtifactDisplay();

    this.isInitialized = true;
    return this.container;
  }

  /**
   * Creates all 3 sockets with their layered structure.
   */
  createSockets() {
    for (let i = 0; i < this.maxArtifacts; i++) {
      // Calculate horizontal offset for this socket
      const socketOffsetX = (this.socketWidth + this.socketSpacing) * i;

      // Create socket object to store all layers
      const socket = {
        base: null,      // crystalSocketBase0 (bottom)
        shadow: null,    // crystalSocketFilledShadow1 (only if full)
        purple: null,   // crystalSocketPurple2 (always visible)
        frame: null      // crystalSocketFrame3 (top)
      };

      // Layer 1: Base (bottom layer, always visible)
      socket.base = new BABYLON.GUI.Image(
        `${this.barName}_Socket${i}_Base`,
        UIAssetManifest.getAssetUrl("crystalSocketBase0")
      );
      socket.base.width = this.socketWidth + "px";
      socket.base.height = this.socketHeight + "px";
      socket.base.left = socketOffsetX + "px";
      socket.base.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.base.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.base.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.base.paddingLeft = 0;
      socket.base.paddingRight = 0;
      socket.base.paddingTop = 0;
      socket.base.paddingBottom = 0;
      this.container.addControl(socket.base);

      // Layer 2: Filled Shadow (only visible when socket is full/unused)
      socket.shadow = new BABYLON.GUI.Image(
        `${this.barName}_Socket${i}_Shadow`,
        UIAssetManifest.getAssetUrl("crystalSocketFilledShadow1")
      );
      socket.shadow.width = this.socketWidth + "px";
      socket.shadow.height = this.socketHeight + "px";
      socket.shadow.left = socketOffsetX + "px";
      socket.shadow.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.shadow.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.shadow.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.shadow.paddingLeft = 0;
      socket.shadow.paddingRight = 0;
      socket.shadow.paddingTop = 0;
      socket.shadow.paddingBottom = 0;
      this.container.addControl(socket.shadow);

      // Layer 3: Purple (always visible)
      socket.purple = new BABYLON.GUI.Image(
        `${this.barName}_Socket${i}_Purple`,
        UIAssetManifest.getAssetUrl("crystalSocketPurple2")
      );
      socket.purple.width = this.socketWidth + "px";
      socket.purple.height = this.socketHeight + "px";
      socket.purple.left = socketOffsetX + "px";
      socket.purple.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.purple.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.purple.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.purple.paddingLeft = 0;
      socket.purple.paddingRight = 0;
      socket.purple.paddingTop = 0;
      socket.purple.paddingBottom = 0;
      this.container.addControl(socket.purple);

      // Layer 4: Frame (top layer, always visible)
      socket.frame = new BABYLON.GUI.Image(
        `${this.barName}_Socket${i}_Frame`,
        UIAssetManifest.getAssetUrl("crystalSocketFrame3")
      );
      socket.frame.width = this.socketWidth + "px";
      socket.frame.height = this.socketHeight + "px";
      socket.frame.left = socketOffsetX + "px";
      socket.frame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.frame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.frame.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.frame.paddingLeft = 0;
      socket.frame.paddingRight = 0;
      socket.frame.paddingTop = 0;
      socket.frame.paddingBottom = 0;
      this.container.addControl(socket.frame);

      this.sockets.push(socket);
    }
  }

  /**
   * Updates the visual display of artifact sockets based on current artifacts.
   * Sockets are filled from left to right. The shadow and purple crystal layers are only visible when a socket is full/unused.
   */
  updateArtifactDisplay() {
    // Clamp currentArtifacts to valid range
    this.currentArtifacts = Math.max(0, Math.min(this.maxArtifacts, this.currentArtifacts));

    // Update each socket's shadow and purple crystal visibility
    // Both are visible when socket is full (socket index < currentArtifacts)
    for (let i = 0; i < this.sockets.length; i++) {
      if (this.sockets[i]) {
        // Shadow is visible if this socket is full (i < currentArtifacts)
        if (this.sockets[i].shadow) {
          this.sockets[i].shadow.isVisible = i < this.currentArtifacts;
        }
        // Purple crystal is also visible only if this socket is full (i < currentArtifacts)
        if (this.sockets[i].purple) {
          this.sockets[i].purple.isVisible = i < this.currentArtifacts;
        }
      }
    }
  }

  /**
   * Sets the current artifact count and updates the display.
   * @param {number} newArtifacts - The new current artifact count (0 to maxArtifacts).
   */
  setCurrentArtifacts(newArtifacts) {
    this.currentArtifacts = Math.max(0, Math.min(this.maxArtifacts, newArtifacts));
    this.updateArtifactDisplay();
  }

  /**
   * Gets the current artifact count.
   * @returns {number} The current artifact count.
   */
  getCurrentArtifacts() {
    return this.currentArtifacts;
  }

  /**
   * Gets the maximum artifact count.
   * @returns {number} The maximum artifact count (always 3).
   */
  getMaxArtifacts() {
    return this.maxArtifacts;
  }

  /**
   * Consumes a specified amount of artifacts and updates the display.
   * @param {number} amount - The amount of artifacts to consume (default: 1).
   * @returns {boolean} True if artifacts were successfully consumed, false if insufficient artifacts.
   */
  consumeArtifact(amount = 1) {
    if (this.currentArtifacts >= amount) {
      this.currentArtifacts -= amount;
      this.updateArtifactDisplay();
      return true;
    }
    return false;
  }

  /**
   * Restores a specified amount of artifacts and updates the display.
   * @param {number} amount - The amount of artifacts to restore (default: 1).
   */
  restoreArtifact(amount = 1) {
    this.currentArtifacts = Math.min(this.maxArtifacts, this.currentArtifacts + amount);
    this.updateArtifactDisplay();
  }

  /**
   * Placeholder method for using an artifact.
   * This method should be called when an artifact is used.
   * It consumes 1 artifact and returns whether the artifact can be used.
   * @returns {boolean} True if the artifact was used successfully (artifact was available), false otherwise.
   */
  useArtifact() {
    if (this.consumeArtifact(1)) {
      // Placeholder: Add artifact usage logic here
      console.log(`Artifact used! Remaining artifacts: ${this.currentArtifacts}/${this.maxArtifacts}`);
      return true;
    } else {
      console.log(`Cannot use artifact! Insufficient artifacts. Current: ${this.currentArtifacts}/${this.maxArtifacts}`);
      return false;
    }
  }

  /**
   * Resets the artifact socket bar to full artifacts.
   */
  resetArtifacts() {
    this.currentArtifacts = this.maxArtifacts;
    this.updateArtifactDisplay();
  }

  /**
   * Destroys the artifact socket bar and removes all UI elements.
   * Call this when the artifact socket bar is no longer needed.
   */
  destroy() {
    if (this.container && this.container.parent) {
      this.container.parent.removeControl(this.container);
    }
    this.container = null;
    this.sockets = [];
    this.isInitialized = false;
  }
}
