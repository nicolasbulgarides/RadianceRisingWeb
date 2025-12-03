/**
 * ManaBar
 *
 * A self-contained, modular UI element that displays a mana bar with variable size.
 * The bar consists of:
 * - Left socket (always present, scaled 5% larger) with layered crystal structure
 * - N middle sockets (0-6) with layered crystal structure
 * - Right socket (always present, scaled 5% larger) with layered crystal structure
 *
 * Each socket consists of layered images:
 * - crystalSocketBase0 (bottom layer, always visible)
 * - crystalSocketFilledShadow1 (middle layer, only visible when socket is full/unused)
 * - crystalSocketBlue2 (middle layer, only visible when socket is full/unused)
 * - crystalSocketFrame3 (top layer, always visible)
 *
 * The bar can dynamically resize from 3 to 8 total sockets (minimum: left + 1 middle + right, maximum: left + 6 middle + right).
 * Sockets are filled from left to right, with shadow and blue crystal disappearing when mana is consumed.
 *
 * @example
 * // Create a mana bar with 5 max mana, positioned at top center
 * const manaBar = new ManaBar(
 *   "playerManaBar",
 *   5,  // maxMana
 *   5,  // currentMana (starts full)
 *   64, // socketWidth
 *   64, // socketHeight
 *   0,  // offsetX
 *   -50, // offsetY (above center)
 *   BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
 *   BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
 * );
 *
 * // Create the UI elements
 * const manaBarContainer = manaBar.create();
 *
 * // Add to your UI scene's advanced texture
 * uiScene.advancedTexture.addControl(manaBarContainer);
 *
 * // Use the mana bar
 * manaBar.castSpell(); // Consumes 1 mana and updates display
 * manaBar.setCurrentMana(3); // Set mana to 3
 * manaBar.consumeMana(2); // Consume 2 mana
 * manaBar.restoreMana(1); // Restore 1 mana
 */
class ManaBar {
  /**
   * Creates a new ManaBar instance.
   * @param {string} barName - Unique identifier for this mana bar instance.
   * @param {number} maxMana - Maximum number of mana gems (3-8).
   * @param {number} [currentMana] - Current number of filled mana gems (defaults to maxMana).
   * @param {number} [socketWidth=64] - Width of each socket in pixels.
   * @param {number} [socketHeight=64] - Height of each socket in pixels.
   * @param {number} [offsetX=0] - Horizontal offset from alignment position.
   * @param {number} [offsetY=0] - Vertical offset from alignment position.
   * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
   * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
   */
  constructor(
    barName,
    maxMana = 5,
    currentMana = null,
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

    // Clamp maxMana between 3 and 8
    this.maxMana = Math.max(3, Math.min(8, maxMana));
    this.currentMana = currentMana !== null ? Math.max(0, Math.min(this.maxMana, currentMana)) : this.maxMana;

    // Calculate number of middle sockets (maxMana - 2, since left and right are always present)
    this.middleSocketCount = this.maxMana - 2;

    // Storage for UI elements - each socket has 4 layers (like artifact bar)
    this.container = null;
    this.leftSocket = null; // Object with base, shadow, blue, frame layers
    this.middleSockets = []; // Array of socket objects, each containing base, shadow, blue, frame layers
    this.rightSocket = null; // Object with base, shadow, blue, frame layers

    // Track if the bar has been initialized
    this.isInitialized = false;
  }

  /**
   * Creates and returns the mana bar container with all sockets and gems.
   * This should be called once and the returned container added to a UI scene.
   * @returns {BABYLON.GUI.Container} The container holding all mana bar elements.
   */
  create() {
    if (this.isInitialized) {
      console.warn(`ManaBar ${this.barName} has already been created. Returning existing container.`);
      return this.container;
    }

    // Create the main container for the mana bar
    this.container = new BABYLON.GUI.Container(`${this.barName}_Container`);
    this.container.width = (this.socketWidth * this.maxMana) + "px";
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

    // Create left socket and gem
    this.createLeftSocket();

    // Create middle sockets and gems
    this.createMiddleSockets();

    // Create right socket and gem
    this.createRightSocket();

    // Update visibility based on current mana
    this.updateManaDisplay();

    this.isInitialized = true;
    return this.container;
  }

  /**
   * Creates the left socket with layered crystal structure (scaled 5% larger).
   */
  createLeftSocket() {
    // Left socket is scaled 5% larger
    const leftSocketWidth = this.socketWidth * 1.05;
    const leftSocketHeight = this.socketHeight * 1.05;
    const socketOffsetX = 0;

    // Create socket object to store all layers
    this.leftSocket = {
      base: null,      // crystalSocketBase0 (bottom)
      shadow: null,    // crystalSocketFilledShadow1 (only if full)
      blue: null,      // crystalSocketBlue2 (only if full)
      frame: null      // crystalSocketFrame3 (top)
    };

    // Layer 1: Base (bottom layer, always visible)
    this.leftSocket.base = new BABYLON.GUI.Image(
      `${this.barName}_LeftSocket_Base`,
      UIAssetManifest.getAssetUrl("crystalSocketBase0")
    );
    this.leftSocket.base.width = leftSocketWidth + "px";
    this.leftSocket.base.height = leftSocketHeight + "px";
    this.leftSocket.base.left = socketOffsetX + "px";
    this.leftSocket.base.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.leftSocket.base.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.leftSocket.base.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.leftSocket.base.paddingLeft = 0;
    this.leftSocket.base.paddingRight = 0;
    this.leftSocket.base.paddingTop = 0;
    this.leftSocket.base.paddingBottom = 0;
    this.container.addControl(this.leftSocket.base);

    // Layer 2: Filled Shadow (only visible when socket is full/unused)
    this.leftSocket.shadow = new BABYLON.GUI.Image(
      `${this.barName}_LeftSocket_Shadow`,
      UIAssetManifest.getAssetUrl("crystalSocketFilledShadow1")
    );
    this.leftSocket.shadow.width = leftSocketWidth + "px";
    this.leftSocket.shadow.height = leftSocketHeight + "px";
    this.leftSocket.shadow.left = socketOffsetX + "px";
    this.leftSocket.shadow.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.leftSocket.shadow.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.leftSocket.shadow.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.leftSocket.shadow.paddingLeft = 0;
    this.leftSocket.shadow.paddingRight = 0;
    this.leftSocket.shadow.paddingTop = 0;
    this.leftSocket.shadow.paddingBottom = 0;
    this.container.addControl(this.leftSocket.shadow);

    // Layer 3: Blue Crystal (only visible when socket is full/unused)
    this.leftSocket.blue = new BABYLON.GUI.Image(
      `${this.barName}_LeftSocket_Blue`,
      UIAssetManifest.getAssetUrl("crystalSocketBlue2")
    );
    this.leftSocket.blue.width = leftSocketWidth + "px";
    this.leftSocket.blue.height = leftSocketHeight + "px";
    this.leftSocket.blue.left = socketOffsetX + "px";
    this.leftSocket.blue.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.leftSocket.blue.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.leftSocket.blue.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.leftSocket.blue.paddingLeft = 0;
    this.leftSocket.blue.paddingRight = 0;
    this.leftSocket.blue.paddingTop = 0;
    this.leftSocket.blue.paddingBottom = 0;
    this.container.addControl(this.leftSocket.blue);

    // Layer 4: Frame (top layer, always visible)
    this.leftSocket.frame = new BABYLON.GUI.Image(
      `${this.barName}_LeftSocket_Frame`,
      UIAssetManifest.getAssetUrl("crystalSocketFrame3")
    );
    this.leftSocket.frame.width = leftSocketWidth + "px";
    this.leftSocket.frame.height = leftSocketHeight + "px";
    this.leftSocket.frame.left = socketOffsetX + "px";
    this.leftSocket.frame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.leftSocket.frame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.leftSocket.frame.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.leftSocket.frame.paddingLeft = 0;
    this.leftSocket.frame.paddingRight = 0;
    this.leftSocket.frame.paddingTop = 0;
    this.leftSocket.frame.paddingBottom = 0;
    this.container.addControl(this.leftSocket.frame);
  }

  /**
   * Creates all middle sockets with layered crystal structure.
   */
  createMiddleSockets() {
    for (let i = 0; i < this.middleSocketCount; i++) {
      // Calculate horizontal offset for this middle socket
      // Each socket is positioned exactly edge-to-edge with no padding
      const socketOffsetX = this.socketWidth * (i + 1); // +1 because left socket is at 0

      // Create socket object to store all layers
      const socket = {
        base: null,      // crystalSocketBase0 (bottom)
        shadow: null,    // crystalSocketFilledShadow1 (only if full)
        blue: null,      // crystalSocketBlue2 (only if full)
        frame: null      // crystalSocketFrame3 (top)
      };

      // Layer 1: Base (bottom layer, always visible)
      socket.base = new BABYLON.GUI.Image(
        `${this.barName}_MiddleSocket_${i}_Base`,
        UIAssetManifest.getAssetUrl("crystalSocketBase0")
      );
      socket.base.width = this.socketWidth + "px";
      socket.base.height = this.socketHeight + "px";
      socket.base.left = socketOffsetX + "px";
      socket.base.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.base.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.base.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.base.paddingLeft = -7.5;
      socket.base.paddingRight = 0;
      socket.base.paddingTop = 0;
      socket.base.paddingBottom = 0;
      this.container.addControl(socket.base);

      // Layer 2: Filled Shadow (only visible when socket is full/unused)
      socket.shadow = new BABYLON.GUI.Image(
        `${this.barName}_MiddleSocket_${i}_Shadow`,
        UIAssetManifest.getAssetUrl("crystalSocketFilledShadow1")
      );
      socket.shadow.width = this.socketWidth + "px";
      socket.shadow.height = this.socketHeight + "px";
      socket.shadow.left = socketOffsetX + "px";
      socket.shadow.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.shadow.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.shadow.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.shadow.paddingLeft = -7.5;
      socket.shadow.paddingRight = 0;
      socket.shadow.paddingTop = 0;
      socket.shadow.paddingBottom = 0;
      this.container.addControl(socket.shadow);

      // Layer 3: Blue Crystal (only visible when socket is full/unused)
      socket.blue = new BABYLON.GUI.Image(
        `${this.barName}_MiddleSocket_${i}_Blue`,
        UIAssetManifest.getAssetUrl("crystalSocketBlue2")
      );
      socket.blue.width = this.socketWidth + "px";
      socket.blue.height = this.socketHeight + "px";
      socket.blue.left = socketOffsetX + "px";
      socket.blue.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.blue.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.blue.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.blue.paddingLeft = -7.5;
      socket.blue.paddingRight = 0;
      socket.blue.paddingTop = 0;
      socket.blue.paddingBottom = 0;
      this.container.addControl(socket.blue);

      // Layer 4: Frame (top layer, always visible)
      socket.frame = new BABYLON.GUI.Image(
        `${this.barName}_MiddleSocket_${i}_Frame`,
        UIAssetManifest.getAssetUrl("crystalSocketFrame3")
      );
      socket.frame.width = this.socketWidth + "px";
      socket.frame.height = this.socketHeight + "px";
      socket.frame.left = socketOffsetX + "px";
      socket.frame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      socket.frame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      socket.frame.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
      socket.frame.paddingLeft = -7.5;
      socket.frame.paddingRight = 0;
      socket.frame.paddingTop = 0;
      socket.frame.paddingBottom = 0;
      this.container.addControl(socket.frame);

      this.middleSockets.push(socket);
    }
  }

  /**
   * Creates the right socket with layered crystal structure (scaled 5% larger).
   */
  createRightSocket() {
    // Calculate horizontal offset for right socket (after all middle sockets)
    const rightSocketOffsetX = this.socketWidth * (1 + this.middleSocketCount);

    // Right socket is scaled 5% larger
    const rightSocketWidth = this.socketWidth * 1.05;
    const rightSocketHeight = this.socketHeight * 1.05;

    // Create socket object to store all layers
    this.rightSocket = {
      base: null,      // crystalSocketBase0 (bottom)
      shadow: null,    // crystalSocketFilledShadow1 (only if full)
      blue: null,      // crystalSocketBlue2 (only if full)
      frame: null      // crystalSocketFrame3 (top)
    };

    // Layer 1: Base (bottom layer, always visible)
    this.rightSocket.base = new BABYLON.GUI.Image(
      `${this.barName}_RightSocket_Base`,
      UIAssetManifest.getAssetUrl("crystalSocketBase0")
    );
    this.rightSocket.base.width = rightSocketWidth + "px";
    this.rightSocket.base.height = rightSocketHeight + "px";
    this.rightSocket.base.left = rightSocketOffsetX + "px";
    this.rightSocket.base.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.rightSocket.base.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.rightSocket.base.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.rightSocket.base.paddingLeft = 0;
    this.rightSocket.base.paddingRight = 0;
    this.rightSocket.base.paddingTop = 0;
    this.rightSocket.base.paddingBottom = 0;
    this.container.addControl(this.rightSocket.base);

    // Layer 2: Filled Shadow (only visible when socket is full/unused)
    this.rightSocket.shadow = new BABYLON.GUI.Image(
      `${this.barName}_RightSocket_Shadow`,
      UIAssetManifest.getAssetUrl("crystalSocketFilledShadow1")
    );
    this.rightSocket.shadow.width = rightSocketWidth + "px";
    this.rightSocket.shadow.height = rightSocketHeight + "px";
    this.rightSocket.shadow.left = rightSocketOffsetX + "px";
    this.rightSocket.shadow.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.rightSocket.shadow.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.rightSocket.shadow.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.rightSocket.shadow.paddingLeft = 0;
    this.rightSocket.shadow.paddingRight = 0;
    this.rightSocket.shadow.paddingTop = 0;
    this.rightSocket.shadow.paddingBottom = 0;
    this.container.addControl(this.rightSocket.shadow);

    // Layer 3: Blue Crystal (only visible when socket is full/unused)
    this.rightSocket.blue = new BABYLON.GUI.Image(
      `${this.barName}_RightSocket_Blue`,
      UIAssetManifest.getAssetUrl("crystalSocketBlue2")
    );
    this.rightSocket.blue.width = rightSocketWidth + "px";
    this.rightSocket.blue.height = rightSocketHeight + "px";
    this.rightSocket.blue.left = rightSocketOffsetX + "px";
    this.rightSocket.blue.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.rightSocket.blue.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.rightSocket.blue.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.rightSocket.blue.paddingLeft = 0;
    this.rightSocket.blue.paddingRight = 0;
    this.rightSocket.blue.paddingTop = 0;
    this.rightSocket.blue.paddingBottom = 0;
    this.container.addControl(this.rightSocket.blue);

    // Layer 4: Frame (top layer, always visible)
    this.rightSocket.frame = new BABYLON.GUI.Image(
      `${this.barName}_RightSocket_Frame`,
      UIAssetManifest.getAssetUrl("crystalSocketFrame3")
    );
    this.rightSocket.frame.width = rightSocketWidth + "px";
    this.rightSocket.frame.height = rightSocketHeight + "px";
    this.rightSocket.frame.left = rightSocketOffsetX + "px";
    this.rightSocket.frame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.rightSocket.frame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.rightSocket.frame.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.rightSocket.frame.paddingLeft = 0;
    this.rightSocket.frame.paddingRight = 0;
    this.rightSocket.frame.paddingTop = 0;
    this.rightSocket.frame.paddingBottom = 0;
    this.container.addControl(this.rightSocket.frame);
  }

  /**
   * Updates the visual display of mana sockets based on current mana.
   * Sockets are filled from left to right. The shadow and blue crystal layers are only visible when a socket is full/unused.
   */
  updateManaDisplay() {
    // Clamp currentMana to valid range
    this.currentMana = Math.max(0, Math.min(this.maxMana, this.currentMana));

    // Left socket: shadow and blue visible if mana >= 1
    if (this.leftSocket) {
      const isFull = this.currentMana >= 1;
      if (this.leftSocket.shadow) {
        this.leftSocket.shadow.isVisible = isFull;
      }
      if (this.leftSocket.blue) {
        this.leftSocket.blue.isVisible = isFull;
      }
    }

    // Middle sockets: shadow and blue visible based on how many mana points we have beyond the first
    for (let i = 0; i < this.middleSockets.length; i++) {
      // Middle socket i is full if currentMana >= (i + 2)
      // (i+2 because left socket is 1, first middle is 2, etc.)
      if (this.middleSockets[i]) {
        const isFull = this.currentMana >= (i + 2);
        if (this.middleSockets[i].shadow) {
          this.middleSockets[i].shadow.isVisible = isFull;
        }
        if (this.middleSockets[i].blue) {
          this.middleSockets[i].blue.isVisible = isFull;
        }
      }
    }

    // Right socket: shadow and blue visible if mana is at maximum
    if (this.rightSocket) {
      const isFull = this.currentMana >= this.maxMana;
      if (this.rightSocket.shadow) {
        this.rightSocket.shadow.isVisible = isFull;
      }
      if (this.rightSocket.blue) {
        this.rightSocket.blue.isVisible = isFull;
      }
    }
  }

  /**
   * Sets the current mana value and updates the display.
   * @param {number} newMana - The new current mana value (0 to maxMana).
   */
  setCurrentMana(newMana) {
    this.currentMana = Math.max(0, Math.min(this.maxMana, newMana));
    this.updateManaDisplay();
  }

  /**
   * Gets the current mana value.
   * @returns {number} The current mana value.
   */
  getCurrentMana() {
    return this.currentMana;
  }

  /**
   * Gets the maximum mana value.
   * @returns {number} The maximum mana value.
   */
  getMaxMana() {
    return this.maxMana;
  }

  /**
   * Consumes a specified amount of mana and updates the display.
   * @param {number} amount - The amount of mana to consume (default: 1).
   * @returns {boolean} True if mana was successfully consumed, false if insufficient mana.
   */
  consumeMana(amount = 1) {
    if (this.currentMana >= amount) {
      this.currentMana -= amount;
      this.updateManaDisplay();
      return true;
    }
    return false;
  }

  /**
   * Restores a specified amount of mana and updates the display.
   * @param {number} amount - The amount of mana to restore (default: 1).
   */
  restoreMana(amount = 1) {
    this.currentMana = Math.min(this.maxMana, this.currentMana + amount);
    this.updateManaDisplay();
  }

  /**
   * Placeholder method for casting a spell.
   * This method should be called when a spell is cast.
   * It consumes 1 mana and returns whether the spell can be cast.
   * @returns {boolean} True if the spell was cast successfully (mana was available), false otherwise.
   */
  castSpell() {
    if (this.consumeMana(1)) {
      // Placeholder: Add spell casting logic here
      console.log(`Spell cast! Remaining mana: ${this.currentMana}/${this.maxMana}`);
      return true;
    } else {
      console.log(`Cannot cast spell! Insufficient mana. Current: ${this.currentMana}/${this.maxMana}`);
      return false;
    }
  }

  /**
   * Resets the mana bar to full mana.
   */
  resetMana() {
    this.currentMana = this.maxMana;
    this.updateManaDisplay();
  }

  /**
   * Destroys the mana bar and removes all UI elements.
   * Call this when the mana bar is no longer needed.
   */
  destroy() {
    if (this.container && this.container.parent) {
      this.container.parent.removeControl(this.container);
    }
    this.container = null;
    this.leftSocket = null;
    this.middleSockets = [];
    this.rightSocket = null;
    this.isInitialized = false;
  }
}
