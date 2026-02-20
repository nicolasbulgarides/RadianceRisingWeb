/**
 * LoadingScreen Class
 * 
 * A self-contained loading screen with surreal color effects.
 * Creates an animated full-screen overlay that displays during game loading.
 * Uses canvas-based animations for smooth, surreal color transitions.
 */
class LoadingScreen {
  constructor() {
    this.isActive = false;
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.time = 0;
    this.particles = [];
    this.geometricShapes = [];
    this.container = null;
    this.patternPhase = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this._lastFrameTime = 0;

    // Expanded surreal color palette - vibrant, shifting colors
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
      { r: 255, g: 0, b: 255 },     // Fuchsia
    ];

    this.init();
  }

  /**
   * Initializes the loading screen by creating DOM elements and canvas.
   */
  init() {
    // Create container overlay
    this.container = document.createElement('div');
    this.container.id = 'loadingScreenContainer';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: #000;
      display: none;
      pointer-events: none;
    `;

    // Create canvas for surreal effects
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'loadingScreenCanvas';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
    `;
    this.container.appendChild(this.canvas);

    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.id = 'loadingText';
    loadingText.textContent = 'Loading...';
    loadingText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Arial', sans-serif;
      font-size: 2.5em;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                   0 0 40px rgba(255, 0, 150, 0.6),
                   0 0 60px rgba(0, 255, 255, 0.4);
      z-index: 10000;
      pointer-events: none;
      letter-spacing: 0.1em;
    `;
    this.container.appendChild(loadingText);

    // Append to body
    document.body.appendChild(this.container);

    // Setup canvas context
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());

    // Initialize particles
    this.initParticles();

    // Initialize geometric shapes
    this.initGeometricShapes();
  }

  /**
   * Resizes the canvas to match the window dimensions.
   */
  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      // Cache dimensions to avoid repeated DOM reads in draw calls
      this.canvasWidth = this.canvas.width;
      this.canvasHeight = this.canvas.height;
      // Reinitialize particles and shapes when resizing
      this.initParticles();
      this.initGeometricShapes();
    }
  }

  /**
   * Initializes particle system for surreal effects.
   */
  initParticles() {
    this.particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 1,
        colorIndex: Math.floor(Math.random() * this.colorPalette.length),
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        trailLength: Math.random() * 5 + 3,
      });
    }
  }

  /**
   * Initializes geometric shapes for additional visual variety.
   */
  initGeometricShapes() {
    this.geometricShapes = [];
    const shapeCount = 15;

    for (let i = 0; i < shapeCount; i++) {
      const shapeType = Math.floor(Math.random() * 3); // 0: circle, 1: triangle, 2: square
      this.geometricShapes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 80 + 40,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        colorIndex: Math.floor(Math.random() * this.colorPalette.length),
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.01,
        type: shapeType,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }
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
   * Draws the surreal background gradient.
   */
  drawBackground() {
    const w = this.canvasWidth, h = this.canvasHeight;
    const gradient = this.ctx.createRadialGradient(
      w / 2, h / 2, 0,
      w / 2, h / 2, Math.max(w, h) * 0.8
    );

    // Create multiple color stops for surreal effect - lighter
    for (let i = 0; i <= 10; i++) {
      const t = (this.time * 0.1 + i * 0.1) % 1;
      const color = this.getColor(t);
      const alpha = Math.sin(i * Math.PI / 10) * 0.15 + 0.1;
      gradient.addColorStop(
        i / 10,
        `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
      );
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, w, h);
  }

  /**
   * Draws animated wave patterns with more variety.
   */
  drawWaves() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    const w = this.canvasWidth, h = this.canvasHeight;

    // Multiple wave layers with different properties
    // Step size 4 instead of 2: halves path complexity, imperceptible on a loading screen
    for (let wave = 0; wave < 5; wave++) {
      const waveTime = this.time * (0.3 + wave * 0.2);
      const amplitude = 40 + wave * 25;
      const frequency = 0.008 + wave * 0.004;
      const verticalOffset = (Math.sin(waveTime * 0.3) * 100) + h / 2;

      this.ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const y = verticalOffset +
          Math.sin(x * frequency + waveTime) * amplitude +
          Math.cos(x * frequency * 0.7 + waveTime * 1.3) * amplitude * 0.5 +
          Math.sin(x * frequency * 1.5 + waveTime * 0.8) * amplitude * 0.3;

        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      const color = this.getColor((waveTime * 0.08 + wave * 0.1) % 1);
      this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`;
      this.ctx.lineWidth = 1.5 + wave * 0.5;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Draws geometric shapes for visual variety.
   */
  drawGeometricShapes() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    const w = this.canvasWidth, h = this.canvasHeight;

    this.geometricShapes.forEach(shape => {
      // Update position
      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.rotation += shape.rotationSpeed;
      shape.phase += shape.phaseSpeed;

      // Wrap around screen
      if (shape.x < -shape.size) shape.x = w + shape.size;
      if (shape.x > w + shape.size) shape.x = -shape.size;
      if (shape.y < -shape.size) shape.y = h + shape.size;
      if (shape.y > h + shape.size) shape.y = -shape.size;

      // Pulsing size effect
      const pulseSize = shape.size * (1 + Math.sin(shape.phase) * 0.2);
      const colorT = (Math.sin(shape.phase * 2) + 1) / 2;
      const color = this.getColor(colorT);
      const opacity = shape.opacity * (0.7 + Math.sin(shape.phase * 1.5) * 0.3);

      this.ctx.save();
      this.ctx.translate(shape.x, shape.y);
      this.ctx.rotate(shape.rotation);
      this.ctx.globalAlpha = opacity;

      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
      gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      this.ctx.fillStyle = gradient;

      if (shape.type === 0) {
        // Circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (shape.type === 1) {
        // Triangle
        this.ctx.beginPath();
        this.ctx.moveTo(0, -pulseSize);
        this.ctx.lineTo(pulseSize * 0.866, pulseSize * 0.5);
        this.ctx.lineTo(-pulseSize * 0.866, pulseSize * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
      } else {
        // Square
        this.ctx.fillRect(-pulseSize / 2, -pulseSize / 2, pulseSize, pulseSize);
      }

      this.ctx.restore();
    });

    this.ctx.restore();
  }

  /**
   * Draws a grid pattern that shifts over time.
   */
  drawGridPattern() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'overlay';
    this.ctx.globalAlpha = 0.08;

    const w = this.canvasWidth, h = this.canvasHeight;
    const gridSize = 100;
    const offsetX = (this.time * 20) % gridSize;
    const offsetY = (this.time * 15) % gridSize;

    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;

    // Batch all grid lines into a single path for fewer draw calls
    this.ctx.beginPath();
    for (let x = -gridSize; x < w + gridSize; x += gridSize) {
      this.ctx.moveTo(x + offsetX, 0);
      this.ctx.lineTo(x + offsetX, h);
    }
    for (let y = -gridSize; y < h + gridSize; y += gridSize) {
      this.ctx.moveTo(0, y + offsetY);
      this.ctx.lineTo(w, y + offsetY);
    }
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Draws radial bursts from center.
   */
  drawRadialBursts() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    for (let i = 0; i < 8; i++) {
      const angle = (this.time * 0.3 + i * Math.PI / 4) % (Math.PI * 2);
      const distance = 100 + Math.sin(this.time * 0.5 + i) * 50;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const color = this.getColor((this.time * 0.1 + i * 0.1) % 1);
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 60);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 60, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /**
   * Updates and draws particles with trails.
   */
  drawParticles() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';

    const w = this.canvasWidth, h = this.canvasHeight;

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;

      // Wrap around screen
      if (particle.x < 0) particle.x = w;
      if (particle.x > w) particle.x = 0;
      if (particle.y < 0) particle.y = h;
      if (particle.y > h) particle.y = 0;

      // Update color phase
      particle.phase += particle.speed;

      const colorT = (Math.sin(particle.phase) + 1) / 2;
      const color = this.getColor(colorT);
      const r = color.r, g = color.g, b = color.b;

      // Trail: plain solid-alpha circles — no gradient objects per step.
      // 'lighter' compositing makes overlapping circles bloom naturally.
      for (let i = particle.trailLength - 1; i >= 0; i--) {
        const trailX = particle.x - particle.vx * i * 2;
        const trailY = particle.y - particle.vy * i * 2;
        const trailSize = Math.max(particle.size * (1 - i / particle.trailLength), 0.5);
        const alpha = (0.12 * (1 - i / particle.trailLength)).toFixed(2);
        this.ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Main glow: one radial gradient per particle (kept for visual quality)
      const gs = particle.size * 4;
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, gs
      );
      gradient.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
      gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.3)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, gs, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.restore();
  }

  /**
   * Main animation loop.
   */
  animate() {
    if (!this.isActive || !this.ctx) return;

    // Cap at ~30fps — halves canvas work vs uncapped rAF, frees the main thread
    // for level loading (script injection, asset fetching, Babylon scene setup).
    const now = performance.now();
    const elapsed = now - this._lastFrameTime;
    if (elapsed < 33) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      return;
    }
    // Use real delta so animation speed is constant regardless of actual frame rate
    const dt = Math.min(elapsed / 1000, 0.05); // seconds, capped to avoid jumps
    this._lastFrameTime = now;

    // Clear canvas with slight fade for trailing effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Advance time by actual delta (keeps animation speed frame-rate independent)
    this.time += dt;
    this.patternPhase += dt * 0.625;

    // Draw layers in order (back to front)
    this.drawBackground();
    this.drawGridPattern();
    this.drawRadialBursts();
    this.drawGeometricShapes();
    this.drawWaves();
    this.drawParticles();

    // Continue animation
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Starts the loading screen animation.
   */
  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.time = 0;
    this._lastFrameTime = 0;

    if (this.container) {
      this.container.style.display = 'block';
      // Enable pointer events when active (to block interaction during loading)
      this.container.style.pointerEvents = 'auto';
    }

    // Start animation loop
    this.animate();
  }

  /**
   * Stops the loading screen and fades it out.
   */
  stop() {
    if (!this.isActive) return;

    this.isActive = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Immediately disable pointer events to allow clicks through
    if (this.container) {
      this.container.style.pointerEvents = 'none';

      // Fade out animation - very fast transition
      this.container.style.transition = 'opacity 0.1s ease-out';
      this.container.style.opacity = '0';

      setTimeout(() => {
        if (this.container) {
          this.container.style.display = 'none';
          this.container.style.opacity = '1';
          this.container.style.transition = '';
        }
      }, 100);
    }
  }

  /**
   * Removes the loading screen from the DOM completely.
   */
  destroy() {
    this.stop();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
