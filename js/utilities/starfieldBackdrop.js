/**
 * StarfieldBackdrop Class
 * 
 * A self-contained class that creates a black backdrop with rainbow-colored shimmering stars
 * for Babylon.js game worlds. Uses a dynamic skybox texture that animates star twinkling
 * with surreal color effects. Some stars shift colors over time for an extra surreal vibe.
 */
class StarfieldBackdrop {
  /**
   * Creates a starfield backdrop for a Babylon.js scene.
   * @param {BABYLON.Scene} scene - The Babylon.js scene to apply the backdrop to.
   * @param {Object} options - Configuration options.
   * @param {number} options.starCount - Number of stars (default: 2000)
   * @param {number} options.shimmerSpeed - Speed of star shimmering (default: 0.5)
   * @param {number} options.starSize - Base size of stars (default: 1.0)
   * @param {number} options.brightnessRange - Range of brightness variation (default: 0.3)
   */
  constructor(scene, options = {}) {
    this.scene = scene;
    this.starCount = options.starCount || 2000;
    this.shimmerSpeed = options.shimmerSpeed || 1.5; // Increased default speed for more visible shimmer
    this.starSize = options.starSize || 1.0;
    this.brightnessRange = options.brightnessRange || 0.5; // Increased range for more visible variation

    this.skybox = null;
    this.dynamicTexture = null;
    this.animationFrameId = null;
    this.time = 0;
    this.stars = [];
    this.onBeforeRenderObserver = null;

    // Surreal rainbow color palette
    this.colorPalette = [
      { r: 255, g: 0, b: 150 },    // Hot pink
      { r: 0, g: 255, b: 255 },    // Cyan
      { r: 150, g: 0, b: 255 },    // Purple
      { r: 255, g: 200, b: 0 },    // Gold
      { r: 0, g: 255, b: 150 },    // Emerald
      { r: 255, g: 100, b: 200 },  // Rose
      { r: 255, g: 50, b: 100 },   // Coral
      { r: 100, g: 200, b: 255 },  // Sky blue
      { r: 255, g: 150, b: 0 },    // Orange
      { r: 200, g: 0, b: 255 },    // Magenta
      { r: 0, g: 200, b: 255 },    // Azure
      { r: 255, g: 0, b: 255 },    // Fuchsia
      { r: 255, g: 255, b: 255 },  // White (for some stars)
      { r: 200, g: 150, b: 255 },  // Lavender
      { r: 255, g: 100, b: 0 },    // Deep orange
    ];

    this.init();
  }

  /**
   * Initializes the starfield backdrop.
   */
  init() {
    // Set scene background to black
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Generate star positions
    this.generateStars();

    // Create dynamic texture for skybox
    this.createDynamicTexture();

    // Create skybox mesh
    this.createSkybox();

    // Start animation loop using Babylon's render loop
    this.startAnimation();
  }

  /**
   * Generates random star positions in 3D space.
   */
  generateStars() {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      // Generate random position on a sphere (for skybox)
      const theta = Math.random() * Math.PI * 2; // Azimuth
      const phi = Math.acos(2 * Math.random() - 1); // Elevation

      // Convert to Cartesian coordinates
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      // Random brightness phase for shimmering
      const phase = Math.random() * Math.PI * 2;

      // Random size variation
      const size = this.starSize * (0.5 + Math.random() * 0.5);

      // Assign a color from the palette
      const colorIndex = Math.floor(Math.random() * this.colorPalette.length);
      const baseColor = this.colorPalette[colorIndex];

      // Some stars can shift colors over time for extra surreal effect
      const colorShiftSpeed = Math.random() < 0.3 ? (0.1 + Math.random() * 0.2) : 0; // 30% of stars shift colors

      this.stars.push({
        x, y, z,
        phase,
        size,
        baseBrightness: 0.5 + Math.random() * 0.5, // Base brightness between 0.5 and 1.0 for more variation
        shimmerRate: 0.3 + Math.random() * 0.7, // Varying shimmer rates (0.3 to 1.0)
        colorIndex,
        baseColor,
        colorShiftSpeed,
        colorPhase: Math.random() * Math.PI * 2, // Phase for color shifting
      });
    }
  }

  /**
   * Creates a dynamic texture for the skybox that will be updated each frame.
   */
  createDynamicTexture() {
    const textureSize = 2048; // High resolution for crisp stars
    this.dynamicTexture = new BABYLON.DynamicTexture(
      "starfieldTexture",
      { width: textureSize, height: textureSize },
      this.scene,
      false
    );

    this.dynamicTexture.hasAlpha = true;
    this.ctx = this.dynamicTexture.getContext();

    // Initial render
    this.renderStars();
  }

  /**
   * Gets an interpolated color from the palette based on time.
   * @param {number} t - Time value (0-1)
   * @returns {Object} RGB color object
   */
  getColor(t) {
    const index = (t * (this.colorPalette.length - 1)) % this.colorPalette.length;
    const nextIndex = (index + 1) % this.colorPalette.length;
    const localT = (t * (this.colorPalette.length - 1)) % 1;

    const color1 = this.colorPalette[Math.floor(index)];
    const color2 = this.colorPalette[Math.floor(nextIndex)];

    return {
      r: Math.floor(color1.r + (color2.r - color1.r) * localT),
      g: Math.floor(color1.g + (color2.g - color1.g) * localT),
      b: Math.floor(color1.b + (color2.b - color1.b) * localT),
    };
  }

  /**
   * Gets the current color for a star, with optional color shifting.
   * @param {Object} star - Star object with color properties
   * @returns {Object} RGB color object
   */
  getStarColor(star) {
    if (star.colorShiftSpeed > 0) {
      // Color shifting stars - interpolate through palette over time
      const colorT = ((this.time * star.colorShiftSpeed + star.colorPhase) / (Math.PI * 2)) % 1;
      return this.getColor(colorT);
    } else {
      // Static color stars
      return star.baseColor;
    }
  }

  /**
   * Renders the stars onto the dynamic texture.
   */
  renderStars() {
    const width = this.dynamicTexture.getSize().width;
    const height = this.dynamicTexture.getSize().height;

    // Clear with black background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, width, height);

    // Draw stars
    this.stars.forEach(star => {
      // Calculate shimmering brightness - more pronounced shimmer
      const shimmer = Math.sin(this.time * this.shimmerSpeed * star.shimmerRate + star.phase);
      // Use a smoother curve for more natural twinkling
      const shimmerSmooth = (shimmer + 1) / 2; // Normalize to 0-1
      const brightness = star.baseBrightness + (shimmerSmooth - 0.5) * this.brightnessRange * 2;
      const alpha = Math.max(0.3, Math.min(1, brightness)); // Ensure minimum visibility

      // Get star color (with color shifting for some stars)
      const starColor = this.getStarColor(star);

      // Convert 3D position to 2D texture coordinates (equirectangular/spherical projection)
      // This maps a sphere to a rectangle for skybox texture
      const u = (Math.atan2(star.x, star.z) / (2 * Math.PI) + 0.5) * width;
      const v = (Math.acos(star.y) / Math.PI) * height;

      // Wrap around edges
      const uWrapped = ((u % width) + width) % width;
      const vWrapped = Math.max(0, Math.min(height - 1, v));

      // Draw star as a small circle with glow
      const starRadius = star.size * (0.5 + brightness * 0.5);

      // Outer glow with star color
      const gradient = this.ctx.createRadialGradient(uWrapped, vWrapped, 0, uWrapped, vWrapped, starRadius * 3);
      gradient.addColorStop(0, `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, ${alpha})`);
      gradient.addColorStop(0.3, `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(uWrapped, vWrapped, starRadius * 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Bright center with star color
      this.ctx.fillStyle = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(uWrapped, vWrapped, starRadius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Update the texture
    this.dynamicTexture.update();
  }

  /**
   * Creates a skybox mesh using the dynamic texture.
   */
  createSkybox() {
    // Create skybox material
    const skyboxMaterial = new BABYLON.StandardMaterial("starfieldMaterial", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.emissiveTexture = this.dynamicTexture;
    skyboxMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    // Create skybox mesh (large sphere)
    this.skybox = BABYLON.MeshBuilder.CreateSphere(
      "starfieldSkybox",
      { diameter: 1000, segments: 64 },
      this.scene
    );

    // Flip normals so texture is visible from inside
    this.skybox.material = skyboxMaterial;
    this.skybox.infiniteDistance = true;
    this.skybox.renderingGroupId = 0; // Render before other objects
  }

  /**
   * Animation loop for updating star shimmering.
   * Uses Babylon's render loop for better integration.
   */
  updateStars() {
    if (this.scene && !this.scene.isDisposed && this.dynamicTexture) {
      // Update time based on scene delta time if available, otherwise use fixed timestep
      const deltaTime = this.scene.getEngine().getDeltaTime() / 1000; // Convert to seconds
      this.time += deltaTime || 0.016; // Fallback to ~60fps if deltaTime not available

      // Re-render every 3 frames — GPU texture upload is expensive and the starfield
      // shimmers slowly enough that 20fps visual update is imperceptible.
      this._starFrameCounter = (this._starFrameCounter || 0) + 1;
      if (this._starFrameCounter % 3 === 0) {
        this.renderStars();
      }
    }
  }

  /**
   * Starts the animation loop using Babylon's render loop.
   */
  startAnimation() {
    if (!this.onBeforeRenderObserver && this.scene) {
      // Register to update before each render frame
      this.onBeforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
        this.updateStars();
      });
    }
  }

  /**
   * Stops the animation loop.
   */
  stopAnimation() {
    if (this.onBeforeRenderObserver && this.scene) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver);
      this.onBeforeRenderObserver = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Updates the shimmer speed.
   * @param {number} speed - New shimmer speed.
   */
  setShimmerSpeed(speed) {
    this.shimmerSpeed = speed;
  }

  /**
   * Updates the number of stars (requires regeneration).
   * @param {number} count - New star count.
   */
  setStarCount(count) {
    this.starCount = count;
    this.generateStars();
  }

  /**
   * Disposes of the starfield backdrop and cleans up resources.
   */
  dispose() {
    this.stopAnimation();

    if (this.skybox) {
      this.skybox.dispose();
      this.skybox = null;
    }

    if (this.dynamicTexture) {
      this.dynamicTexture.dispose();
      this.dynamicTexture = null;
    }

    this.stars = [];
  }
}
