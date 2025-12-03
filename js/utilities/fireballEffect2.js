/**
 * FireballEffect2
 * 
 * A self-contained class that creates a fireball effect with flickering flames
 * using custom shaders in Babylon.js. This version uses more advanced flame
 * shader techniques for realistic flickering fire effects.
 */
class FireballEffect2 {
  /**
   * Creates a fireball effect with flickering flames around the player.
   * @param {BABYLON.Scene} scene - The Babylon.js scene to add the effect to.
   * @param {Object} player - The player unit instance.
   * @param {Object} options - Configuration options.
   * @param {number} options.radius - Radius of the fireball (default: 1.5)
   * @param {number} options.intensity - Fire intensity (default: 1.0)
   * @param {number} options.duration - Duration in milliseconds (default: 3000)
   * @param {number} options.flickerSpeed - Speed of flame flickering (default: 2.0)
   */
  constructor(scene, player, options = {}) {
    this.scene = scene;
    this.player = player;
    this.radius = options.radius || 1.5;
    this.intensity = options.intensity || 1.0;
    this.duration = options.duration || 3000;
    this.flickerSpeed = options.flickerSpeed || 2.0;

    this.fireballMesh = null;
    this.fireMaterial = null;
    this.isActive = false;
    this.startTime = null;
    this.onBeforeRenderObserver = null;

    this.init();
  }

  /**
   * Initializes the fireball effect.
   */
  init() {
    // Get the player's mesh
    const playerMesh = this.getPlayerMesh();
    if (!playerMesh) {
      console.warn("FireballEffect2: Player mesh not found, cannot create fireball");
      return;
    }

    // Create the fireball sphere
    this.fireballMesh = BABYLON.MeshBuilder.CreateSphere(
      "fireballEffect2",
      {
        segments: 64,
        diameter: this.radius * 2
      },
      this.scene
    );

    if (!this.fireballMesh) {
      console.error("FireballEffect2: Failed to create fireball mesh");
      return;
    }

    // Position the fireball at the player's position
    this.updatePosition();

    // Create the flickering flame shader material
    this.createFlickeringFlameMaterial();

    // Apply the material to the mesh
    if (this.fireMaterial) {
      this.fireballMesh.material = this.fireMaterial;
    }

    // Make the fireball initially invisible
    this.fireballMesh.setEnabled(false);

    // Ensure the mesh is visible
    this.fireballMesh.isPickable = false;
    this.fireballMesh.renderingGroupId = 2;
    this.fireballMesh.alwaysSelectAsActiveMesh = true;
    this.fireballMesh.doNotSyncBoundingInfo = false;

    // Make sure it's in the scene's mesh list
    if (!this.scene.meshes.includes(this.fireballMesh)) {
      this.scene.meshes.push(this.fireballMesh);
    }
  }

  /**
   * Gets the player's mesh from the player unit.
   * @returns {BABYLON.Mesh|null} The player's mesh or null if not found.
   */
  getPlayerMesh() {
    if (!this.player || !this.player.playerMovementManager) {
      return null;
    }

    const playerModel = this.player.playerMovementManager.getPlayerModelDirectly();
    if (!playerModel) {
      return null;
    }

    // If it's a mesh, return it directly
    if (playerModel instanceof BABYLON.Mesh) {
      return playerModel;
    }

    // If it's a model with meshes, get the root mesh
    if (playerModel.meshes && playerModel.meshes.length > 0) {
      return playerModel.meshes[0];
    }

    return null;
  }

  /**
   * Creates a custom flickering flame shader material with advanced flame effects.
   */
  createFlickeringFlameMaterial() {
    try {
      const radiusValue = this.radius.toFixed(2);
      const flickerSpeedValue = this.flickerSpeed.toFixed(2);

      const vertexShader = `
        precision highp float;

        attribute vec3 position;
        attribute vec3 normal;
        attribute vec2 uv;

        uniform mat4 world;
        uniform mat4 worldViewProjection;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUV;

        void main(void) {
          vPosition = position;
          vNormal = normalize(normal);
          vUV = uv;
          gl_Position = worldViewProjection * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        precision highp float;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUV;

        uniform float time;
        uniform float intensity;

        // Noise function for flame turbulence
        float noise(vec3 p) {
          return sin(p.x * 10.0 + time * ${flickerSpeedValue}) * 
                 sin(p.y * 12.0 + time * ${flickerSpeedValue} * 1.3) * 
                 sin(p.z * 8.0 + time * ${flickerSpeedValue} * 0.7) * 0.5 + 0.5;
        }

        // Fractal noise for more complex flame patterns
        float fractalNoise(vec3 p) {
          float n = 0.0;
          n += noise(p) * 0.5;
          n += noise(p * 2.0) * 0.25;
          n += noise(p * 4.0) * 0.125;
          n += noise(p * 8.0) * 0.0625;
          return n;
        }

        void main(void) {
          vec3 pos = vPosition;
          
          // Calculate distance from center (0-1)
          float dist = length(pos) / ${radiusValue};
          dist = clamp(dist, 0.0, 1.0);
          
          // Create upward-flowing flame effect
          float verticalFlow = pos.y / ${radiusValue} + time * ${flickerSpeedValue} * 0.5;
          
          // Combine position with time for flickering
          vec3 flamePos = pos * 2.0 + vec3(0.0, verticalFlow, 0.0);
          
          // Create turbulent flame pattern using fractal noise
          float turbulence = fractalNoise(flamePos);
          
          // Create flame flicker with multiple frequencies
          float flicker1 = sin(time * ${flickerSpeedValue} * 3.0 + pos.x * 5.0) * 0.5 + 0.5;
          float flicker2 = sin(time * ${flickerSpeedValue} * 5.0 + pos.z * 4.0) * 0.5 + 0.5;
          float flicker3 = sin(time * ${flickerSpeedValue} * 7.0 + pos.y * 6.0) * 0.5 + 0.5;
          float combinedFlicker = (flicker1 + flicker2 + flicker3) / 3.0;
          
          // Flame shape - wider at bottom, narrower at top
          float flameShape = 1.0 - abs(pos.y) / ${radiusValue};
          flameShape = pow(flameShape, 0.8);
          
          // Combine turbulence, flicker, and shape
          float flamePattern = turbulence * combinedFlicker * flameShape;
          
          // Fire gradient (hot center, cooler edges)
          float fireGradient = 1.0 - dist;
          fireGradient = pow(fireGradient, 1.2);
          
          // Final flame intensity
          float flameIntensity = flamePattern * fireGradient;
          
          // Fire color gradient with more variation
          vec3 coreColor = vec3(1.0, 1.0, 0.6);      // Bright white-yellow core
          vec3 innerColor = vec3(1.0, 0.8, 0.2);     // Bright yellow
          vec3 midColor = vec3(1.0, 0.4, 0.1);        // Orange
          vec3 outerColor = vec3(0.9, 0.1, 0.0);     // Dark red
          vec3 edgeColor = vec3(0.3, 0.0, 0.0);      // Very dark red at edges
          
          vec3 fireColor;
          if (flameIntensity > 0.85) {
            fireColor = mix(innerColor, coreColor, (flameIntensity - 0.85) / 0.15);
          } else if (flameIntensity > 0.6) {
            fireColor = mix(midColor, innerColor, (flameIntensity - 0.6) / 0.25);
          } else if (flameIntensity > 0.3) {
            fireColor = mix(outerColor, midColor, (flameIntensity - 0.3) / 0.3);
          } else {
            fireColor = mix(edgeColor, outerColor, flameIntensity / 0.3);
          }
          
          // Add pulsing intensity variation
          float intensityPulse = 0.9 + 0.1 * sin(time * ${flickerSpeedValue} * 4.0);
          fireColor *= intensity * intensityPulse;
          
          // Alpha with flickering variation
          float baseAlpha = flameIntensity * (1.0 - dist * 0.4);
          float alphaFlicker = 0.8 + 0.2 * sin(time * ${flickerSpeedValue} * 6.0 + pos.x * 3.0);
          float alpha = baseAlpha * alphaFlicker;
          alpha = clamp(alpha, 0.2, 1.0);
          
          // Add some brightness variation for flicker
          fireColor = pow(fireColor, vec3(0.85)); // Slightly brighter
          
          gl_FragColor = vec4(fireColor, alpha);
        }
      `;

      // Register shaders
      BABYLON.Effect.ShadersStore["flameVertexShader"] = vertexShader;
      BABYLON.Effect.ShadersStore["flameFragmentShader"] = fragmentShader;

      // Create shader material
      this.fireMaterial = new BABYLON.ShaderMaterial(
        "flameMaterial",
        this.scene,
        {
          vertex: "flame",
          fragment: "flame",
        },
        {
          attributes: ["position", "normal", "uv"],
          uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "intensity"],
          needAlphaBlending: true,
        }
      );

      if (!this.fireMaterial) {
        throw new Error("Failed to create shader material");
      }

      // Set up error handlers
      this.fireMaterial.onCompiled = () => {
        console.log("FireballEffect2: Flickering flame shader compiled successfully");
      };

      this.fireMaterial.onError = (error) => {
        console.error("FireballEffect2: Shader material error:", error);
        this.createFallbackMaterial();
      };

      // Set material properties
      this.fireMaterial.backFaceCulling = false;
      this.fireMaterial.alpha = 0.9;
      this.fireMaterial.zOffset = -1;
      this.fireMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

    } catch (error) {
      console.error("FireballEffect2: Error creating flame material:", error);
      this.createFallbackMaterial();
    }
  }

  /**
   * Creates a simple fallback material if shader fails.
   */
  createFallbackMaterial() {
    const fallbackMaterial = new BABYLON.StandardMaterial("flameFallback", this.scene);
    fallbackMaterial.emissiveColor = new BABYLON.Color3(1, 0.6, 0);
    fallbackMaterial.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
    fallbackMaterial.alpha = 0.9;
    fallbackMaterial.backFaceCulling = false;
    fallbackMaterial.disableLighting = true;
    fallbackMaterial.emissiveIntensity = 3.0;
    fallbackMaterial.zOffset = -1;
    fallbackMaterial.fogEnabled = false;

    this.fallbackMaterial = fallbackMaterial;
    this.fallbackTime = 0;
    this.fireMaterial = fallbackMaterial;
  }

  /**
   * Updates the fireball position to follow the player.
   */
  updatePosition() {
    const playerMesh = this.getPlayerMesh();
    if (!playerMesh || !this.fireballMesh) {
      return;
    }

    const playerPosition = playerMesh.getAbsolutePosition();
    let targetPosition = playerPosition;

    try {
      const boundingInfo = playerMesh.getBoundingInfo();
      if (boundingInfo && boundingInfo.boundingBox) {
        const center = boundingInfo.boundingBox.centerWorld;
        if (center) {
          targetPosition = center;
        }
      }
    } catch (error) {
      // Fall back to absolute position
    }

    this.fireballMesh.position.copyFrom(targetPosition);
    this.fireballMesh.computeWorldMatrix(true);
  }

  /**
   * Activates the fireball effect.
   */
  activate() {
    if (!this.fireballMesh || !this.fireMaterial) {
      console.warn("FireballEffect2: Cannot activate, effect not initialized");
      return;
    }

    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.startTime = Date.now();

    // Update position before showing
    this.updatePosition();

    // Make it visible
    this.fireballMesh.setEnabled(true);
    this.fireballMesh.isVisible = true;
    this.fireballMesh.isPickable = false;
    this.fireballMesh.renderingGroupId = 3;
    this.fireballMesh.alwaysSelectAsActiveMesh = true;

    // Ensure it's in the scene
    if (!this.scene.meshes.includes(this.fireballMesh)) {
      this.scene.meshes.push(this.fireballMesh);
    }

    // Force material visibility
    if (this.fireMaterial) {
      this.fireMaterial.alpha = 0.9;
      this.fireMaterial.zOffset = -1;
    }

    // Force world matrix update
    this.fireballMesh.computeWorldMatrix(true);

    // Set up animation loop
    this.onBeforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
      if (!this.isActive || !this.fireballMesh || !this.fireMaterial) {
        return;
      }

      // Update position to follow player
      this.updatePosition();

      // Update time uniform for animation
      if (this.fireMaterial instanceof BABYLON.ShaderMaterial) {
        const elapsed = (Date.now() - this.startTime) / 1000.0;
        this.fireMaterial.setFloat("time", elapsed);

        // Pulsing intensity
        const intensityVariation = 1.0 + 0.15 * Math.sin(elapsed * this.flickerSpeed * 2.0);
        this.fireMaterial.setFloat("intensity", this.intensity * intensityVariation);
      } else if (this.fallbackMaterial) {
        // Animate fallback material
        this.fallbackTime += 0.08;
        const intensity = 0.7 + 0.3 * Math.sin(this.fallbackTime);
        this.fallbackMaterial.emissiveColor = new BABYLON.Color3(1 * intensity, 0.6 * intensity, 0);
      }

      // Check if duration has elapsed
      if (Date.now() - this.startTime >= this.duration) {
        this.deactivate();
      }
    });
  }

  /**
   * Deactivates the fireball effect.
   */
  deactivate() {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;

    if (this.fireballMesh) {
      this.fireballMesh.setEnabled(false);
    }

    // Remove animation observer
    if (this.onBeforeRenderObserver) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver);
      this.onBeforeRenderObserver = null;
    }
  }

  /**
   * Disposes of the fireball effect and cleans up resources.
   */
  dispose() {
    this.deactivate();

    if (this.fireMaterial) {
      this.fireMaterial.dispose();
      this.fireMaterial = null;
    }

    if (this.fireballMesh) {
      this.fireballMesh.dispose();
      this.fireballMesh = null;
    }
  }
}
