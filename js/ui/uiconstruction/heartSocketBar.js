/**
 * HeartSocketBar
 *
 * A self-contained, modular UI element that displays a heart socket bar with 3 fixed hearts.
 * Each heart consists of layered images:
 * - heartBase (bottom layer, always visible)
 * - heartFill (top layer, only visible when heart is full)
 *
 * The bar is fixed to 3 hearts and displays health from left to right.
 *
 * @example
 * // Create a heart socket bar with 3 max hearts, positioned beneath hint text
 * const heartBar = new HeartSocketBar(
 *   "playerHeartBar",
 *   3,  // maxHearts (fixed)
 *   3,  // currentHearts (starts full)
 *   50, // heartWidth
 *   50, // heartHeight
 *   0,  // offsetX
 *   30, // offsetY (below center)
 *   BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
 *   BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
 * );
 *
 * // Create the UI elements
 * const heartBarContainer = heartBar.create();
 *
 * // Add to your UI scene's advanced texture
 * uiScene.advancedTexture.addControl(heartBarContainer);
 *
 * // Use the heart bar
 * heartBar.takeDamage(); // Consumes 1 heart and updates display
 * heartBar.setCurrentHearts(2); // Set hearts to 2
 * heartBar.consumeHeart(1); // Consume 1 heart
 * heartBar.restoreHeart(1); // Restore 1 heart
 */
class HeartSocketBar {
    /**
     * Creates a new HeartSocketBar instance.
     * @param {string} barName - Unique identifier for this heart bar instance.
     * @param {number} [maxHearts=3] - Maximum number of hearts (fixed to 3).
     * @param {number} [currentHearts] - Current number of full hearts (defaults to maxHearts).
     * @param {number} [heartWidth=50] - Width of each heart in pixels.
     * @param {number} [heartHeight=50] - Height of each heart in pixels.
     * @param {number} [offsetX=0] - Horizontal offset from alignment position.
     * @param {number} [offsetY=0] - Vertical offset from alignment position.
     * @param {number} [horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER] - Horizontal alignment.
     * @param {number} [verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER] - Vertical alignment.
     */
    constructor(
        barName,
        maxHearts = 3,
        currentHearts = null,
        heartWidth = 50,
        heartHeight = 50,
        offsetX = 0,
        offsetY = 0,
        horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
        verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    ) {
        this.barName = barName;
        this.heartWidth = heartWidth;
        this.heartHeight = heartHeight;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.horizontalAlignment = horizontalAlignment;
        this.verticalAlignment = verticalAlignment;

        // Heart socket bar is fixed to 3 hearts
        this.maxHearts = 3;
        this.currentHearts = currentHearts !== null ? Math.max(0, Math.min(this.maxHearts, currentHearts)) : this.maxHearts;

        // Storage for UI elements - each heart has 2 layers (base and fill)
        this.container = null;
        this.hearts = []; // Array of heart objects, each containing base and fill layers
        this.heartSpacing = 10; // Spacing between hearts

        // Track if the bar has been initialized
        this.isInitialized = false;
    }

    /**
     * Creates and returns the heart socket bar container with all hearts and layers.
     * This should be called once and the returned container added to a UI scene.
     * @returns {BABYLON.GUI.Container} The container holding all heart socket bar elements.
     */
    create() {
        if (this.isInitialized) {
            console.warn(`HeartSocketBar ${this.barName} has already been created. Returning existing container.`);
            return this.container;
        }

        // Create the main container for the heart socket bar
        const totalWidth = (this.heartWidth * this.maxHearts) + (this.heartSpacing * (this.maxHearts - 1));
        this.container = new BABYLON.GUI.Container(`${this.barName}_Container`);
        this.container.width = totalWidth + "px";
        this.container.height = this.heartHeight + "px";
        this.container.left = this.offsetX + "px";
        this.container.top = this.offsetY + "px";
        this.container.horizontalAlignment = this.horizontalAlignment;
        this.container.verticalAlignment = this.verticalAlignment;
        // Remove all padding to ensure hearts line up perfectly
        this.container.paddingLeft = 0;
        this.container.paddingRight = 0;
        this.container.paddingTop = 0;
        this.container.paddingBottom = 0;

        // Create all hearts
        this.createHearts();

        // Update visibility based on current hearts
        this.updateHeartDisplay();

        this.isInitialized = true;
        return this.container;
    }

    /**
     * Creates all 3 hearts with their layered structure.
     */
    createHearts() {
        for (let i = 0; i < this.maxHearts; i++) {
            // Calculate horizontal offset for this heart
            const heartOffsetX = (this.heartWidth + this.heartSpacing) * i;

            // Create heart object to store all layers
            const heart = {
                base: null,      // heartBase (bottom, always visible)
                fill: null       // heartFill (top, only visible when full)
            };

            // Layer 1: Base (bottom layer, always visible)
            heart.base = new BABYLON.GUI.Image(
                `${this.barName}_Heart${i}_Base`,
                UIAssetManifest.getAssetUrl("heartBase")
            );
            heart.base.width = this.heartWidth + "px";
            heart.base.height = this.heartHeight + "px";
            heart.base.left = heartOffsetX + "px";
            heart.base.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            heart.base.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            heart.base.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            heart.base.paddingLeft = 0;
            heart.base.paddingRight = 0;
            heart.base.paddingTop = 0;
            heart.base.paddingBottom = 0;
            this.container.addControl(heart.base);

            // Layer 2: Fill (top layer, only visible when heart is full)
            heart.fill = new BABYLON.GUI.Image(
                `${this.barName}_Heart${i}_Fill`,
                UIAssetManifest.getAssetUrl("heartFill")
            );
            heart.fill.width = this.heartWidth + "px";
            heart.fill.height = this.heartHeight + "px";
            heart.fill.left = heartOffsetX + "px";
            heart.fill.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            heart.fill.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            heart.fill.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
            heart.fill.paddingLeft = 0;
            heart.fill.paddingRight = 0;
            heart.fill.paddingTop = 0;
            heart.fill.paddingBottom = 0;
            this.container.addControl(heart.fill);

            this.hearts.push(heart);
        }
    }

    /**
     * Updates the visibility of heart fills based on current hearts.
     */
    updateHeartDisplay() {
        this.hearts.forEach((heart, index) => {
            if (heart.fill) {
                heart.fill.isVisible = index < this.currentHearts;
            }
        });
    }

    /**
     * Sets the current number of full hearts.
     * @param {number} hearts - The number of full hearts (0 to maxHearts).
     */
    setCurrentHearts(hearts) {
        this.currentHearts = Math.max(0, Math.min(this.maxHearts, hearts));
        this.updateHeartDisplay();
    }

    /**
     * Consumes one or more hearts.
     * @param {number} [amount=1] - The number of hearts to consume.
     */
    consumeHeart(amount = 1) {
        this.currentHearts = Math.max(0, this.currentHearts - amount);
        this.updateHeartDisplay();
    }

    /**
     * Restores one or more hearts.
     * @param {number} [amount=1] - The number of hearts to restore.
     */
    restoreHeart(amount = 1) {
        this.currentHearts = Math.min(this.maxHearts, this.currentHearts + amount);
        this.updateHeartDisplay();
    }

    /**
     * Takes damage (consumes 1 heart).
     */
    takeDamage() {
        this.consumeHeart(1);
    }

    /**
     * Heals (restores 1 heart).
     */
    heal() {
        this.restoreHeart(1);
    }
}

