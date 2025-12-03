/**
 * FireballEffect
 * 
 * A self-contained class that creates a fireball effect around a player model
 * using custom shaders in Babylon.js. The fireball appears as an animated
 * sphere of fire that surrounds the player.
 */
class FireballEffect {
  /**
   * Creates a fireball effect around the player.
   * @param {BABYLON.Scene} scene - The Babylon.js scene to add the effect to.
   * @param {Object} player - The player unit instance.
   * @param {Object} options - Configuration options.
   * @param {number} options.radius - Radius of the fireball (default: 1.5)
   * @param {number} options.intensity - Fire intensity (default: 1.0)
   * @param {number} options.duration - Duration in milliseconds (default: 3000)
   */
  constructor(scene, player, options = {}) {
    this.scene = scene;
    this.player = player;
    this.radius = options.radius || 1.5; // Use the provided radius or default
    this.intensity = options.intensity || 1.0;
    this.duration = options.duration || 3000;

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
    console.log("FireballEffect: Initializing fireball effect");

    // Get the player's mesh
    const playerMesh = this.getPlayerMesh();
    if (!playerMesh) {
      console.warn("FireballEffect: Player mesh not found, cannot create fireball");
      console.warn("FireballEffect: Player object:", this.player);
      console.warn("FireballEffect: Player movement manager:", this.player?.playerMovementManager);
      return;
    }

    console.log("FireballEffect: Player mesh found:", playerMesh.name || "unnamed");

    // Create the fireball sphere with more segments for smoother appearance
    this.fireballMesh = BABYLON.MeshBuilder.CreateSphere(
      "fireballEffect",
      {
        segments: 64, // Increased segments for smoother sphere
        diameter: this.radius * 2
      },
      this.scene
    );

    console.log("FireballEffect: Created sphere with radius:", this.radius, "diameter:", this.radius * 2);

    if (!this.fireballMesh) {
      console.error("FireballEffect: Failed to create fireball mesh");
      return;
    }

    console.log("FireballEffect: Fireball mesh created");

    // Position the fireball at the player's position
    this.updatePosition();

    // Create the fire shader material
    this.createFireMaterial();

    // Apply the material to the mesh
    if (this.fireMaterial) {
      this.fireballMesh.material = this.fireMaterial;
      console.log("FireballEffect: Material applied to mesh");
    } else {
      console.error("FireballEffect: No material available!");
    }

    // Make the fireball initially invisible
    this.fireballMesh.setEnabled(false);

    // Ensure the mesh is pickable and visible
    this.fireballMesh.isPickable = false;
    this.fireballMesh.renderingGroupId = 2; // Higher rendering group to ensure visibility
    this.fireballMesh.alwaysSelectAsActiveMesh = true; // Make sure it's not culled
    this.fireballMesh.doNotSyncBoundingInfo = false; // Ensure bounding info is synced

    // Make sure it's in the scene's mesh list
    if (!this.scene.meshes.includes(this.fireballMesh)) {
      this.scene.meshes.push(this.fireballMesh);
    }

    console.log("FireballEffect: Initialization complete");
    console.log("FireballEffect: Mesh in scene:", this.scene.meshes.includes(this.fireballMesh));
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
   * Creates a custom fire shader material.
   */
  createFireMaterial() {
    try {
      // Prepare shader code
      const radiusValue = this.radius.toFixed(2);

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
          // Pass local position for distance calculation from sphere center
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

        void main(void) {
          vec3 pos = vPosition;
          
          // Calculate distance from center (0-1)
          // The sphere has radius, so normalize by radius
          float dist = length(pos) / ${radiusValue};
          dist = clamp(dist, 0.0, 1.0);
          
          // Create noise-like pattern using multiple sine waves
          float noise1 = sin(pos.x * 3.0 + time * 2.0) * 0.5 + 0.5;
          float noise2 = sin(pos.y * 4.0 + time * 1.5) * 0.5 + 0.5;
          float noise3 = sin(pos.z * 3.5 + time * 2.5) * 0.5 + 0.5;
          float noise = (noise1 + noise2 + noise3) / 3.0;
          
          // Create fire gradient (hot center, cooler edges)
          float fireGradient = 1.0 - dist;
          fireGradient = pow(fireGradient, 1.5);
          
          // Combine noise and gradient
          float firePattern = fireGradient * noise;
          
          // Fire color gradient (yellow/orange center to red edges)
          vec3 innerColor = vec3(1.0, 0.9, 0.3); // Bright yellow
          vec3 midColor = vec3(1.0, 0.5, 0.1);   // Orange
          vec3 outerColor = vec3(0.8, 0.1, 0.0); // Dark red
          
          vec3 fireColor;
          if (firePattern > 0.7) {
            fireColor = mix(midColor, innerColor, (firePattern - 0.7) / 0.3);
          } else {
            fireColor = mix(outerColor, midColor, firePattern / 0.7);
          }
          
          // Add intensity variation
          float intensityVariation = 0.8 + 0.2 * sin(time * 3.0);
          fireColor *= intensity * intensityVariation;
          
          // Alpha based on fire pattern and distance - make it more visible
          float alpha = firePattern * (1.0 - dist * 0.3); // Less fade at edges
          alpha = clamp(alpha, 0.3, 1.0); // Minimum alpha of 0.3 for visibility
          
          // Boost the fire color intensity
          fireColor = pow(fireColor, vec3(0.8)); // Slightly brighter
          
          gl_FragColor = vec4(fireColor, alpha);
        }
      `;

      // Register shaders in the shader store with the correct naming convention
      // Babylon.js expects: "shaderName" + "VertexShader" and "shaderName" + "FragmentShader"
      BABYLON.Effect.ShadersStore["fireVertexShader"] = vertexShader;
      BABYLON.Effect.ShadersStore["fireFragmentShader"] = fragmentShader;

      // Create shader material
      this.fireMaterial = new BABYLON.ShaderMaterial(
        "fireMaterial",
        this.scene,
        {
          vertex: "fire",
          fragment: "fire",
        },
        {
          attributes: ["position", "normal", "uv"],
          uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "intensity"],
          needAlphaBlending: true,
        }
      );

      // Check if material was created successfully
      if (!this.fireMaterial) {
        throw new Error("Failed to create shader material");
      }

      // Set up error handlers
      this.fireMaterial.onCompiled = () => {
        console.log("FireballEffect: Shader material compiled successfully");
      };

      this.fireMaterial.onError = (error) => {
        console.error("FireballEffect: Shader material error:", error);
        // Fallback to simple material on error
        this.createFallbackMaterial();
      };

      // Set material properties for maximum visibility
      this.fireMaterial.backFaceCulling = false;
      this.fireMaterial.alpha = 0.95; // Slightly transparent for fire effect
      this.fireMaterial.zOffset = -1; // Render in front
      this.fireMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND; // Enable alpha blending

    } catch (error) {
      console.error("FireballEffect: Error creating fire material:", error);
      this.createFallbackMaterial();
    }
  }

  /**
   * Creates a simple fallback material if shader fails.
   */
  createFallbackMaterial() {
    console.log("FireballEffect: Creating fallback material (BRIGHT ORANGE)");
    const fallbackMaterial = new BABYLON.StandardMaterial("fireballFallback", this.scene);

    // Make it SUPER bright and visible
    fallbackMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0); // Very bright orange/yellow
    fallbackMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
    fallbackMaterial.specularColor = new BABYLON.Color3(1, 1, 1); // White specular for glow
    fallbackMaterial.alpha = 1.0; // Fully opaque
    fallbackMaterial.backFaceCulling = false;
    fallbackMaterial.disableLighting = true; // Make it always bright - no lighting needed
    fallbackMaterial.emissiveIntensity = 5.0; // EXTREMELY bright
    fallbackMaterial.zOffset = -2; // Render way in front
    fallbackMaterial.roughness = 0.0; // Very shiny

    // Make sure it's not affected by fog or other scene effects
    fallbackMaterial.fogEnabled = false;

    // Store reference for animation
    this.fallbackMaterial = fallbackMaterial;
    this.fallbackTime = 0;

    this.fireMaterial = fallbackMaterial;
    console.log("FireballEffect: Fallback material created - BRIGHT ORANGE, should be VERY visible");
    console.log("FireballEffect: Material properties - emissive:", fallbackMaterial.emissiveColor.toString(), "alpha:", fallbackMaterial.alpha);
  }

  /**
   * Updates the fireball position to follow the player.
   */
  updatePosition() {
    const playerMesh = this.getPlayerMesh();
    if (!playerMesh || !this.fireballMesh) {
      return;
    }

    // Get player's world position
    const playerPosition = playerMesh.getAbsolutePosition();

    // Try to get the center of the player's bounding box for better positioning
    let targetPosition = playerPosition;
    try {
      const boundingInfo = playerMesh.getBoundingInfo();
      if (boundingInfo && boundingInfo.boundingBox) {
        // Get the center of the bounding box
        const center = boundingInfo.boundingBox.centerWorld;
        if (center) {
          targetPosition = center;
        }
      }
    } catch (error) {
      // Fall back to absolute position if bounding box fails
      console.warn("FireballEffect: Could not get bounding box center, using absolute position");
    }

    // Position fireball at player's center position
    this.fireballMesh.position.copyFrom(targetPosition);

    // Also update the mesh's world matrix to ensure it's positioned correctly
    this.fireballMesh.computeWorldMatrix(true);

    // Debug log occasionally
    if (Math.random() < 0.01) { // Log 1% of the time to avoid spam
      console.log("FireballEffect: Position updated to:", this.fireballMesh.position.toString());
    }
  }

  /**
   * Activates the fireball effect.
   */
  activate() {
    console.log("FireballEffect: Activating fireball effect");
    console.log("FireballEffect: Mesh exists:", !!this.fireballMesh);
    console.log("FireballEffect: Material exists:", !!this.fireMaterial);
    console.log("FireballEffect: Scene:", this.scene);

    if (!this.fireballMesh || !this.fireMaterial) {
      console.warn("FireballEffect: Cannot activate, effect not initialized");
      return;
    }

    if (this.isActive) {
      console.log("FireballEffect: Already active, skipping");
      return; // Already active
    }

    this.isActive = true;
    this.startTime = Date.now();

    // Update position before showing
    this.updatePosition();

    // Make absolutely sure it's visible - try multiple approaches
    this.fireballMesh.setEnabled(true);
    this.fireballMesh.isVisible = true;
    this.fireballMesh.isPickable = false;
    this.fireballMesh.renderingGroupId = 3; // Even higher rendering group
    this.fireballMesh.alwaysSelectAsActiveMesh = true;
    this.fireballMesh.doNotSyncBoundingInfo = false;

    // Ensure it's not being culled
    this.fireballMesh.infiniteDistance = false;

    // Make sure it's in the scene
    if (!this.scene.meshes.includes(this.fireballMesh)) {
      this.scene.meshes.push(this.fireballMesh);
      console.log("FireballEffect: Added mesh to scene meshes array");
    }

    // Force material to be visible
    if (this.fireMaterial) {
      this.fireMaterial.alpha = 1.0; // Fully opaque for maximum visibility
      this.fireMaterial.zOffset = -1; // Ensure it renders in front
    }

    // Force world matrix update
    this.fireballMesh.computeWorldMatrix(true);

    // Log camera position to check visibility
    const activeCamera = this.scene.activeCamera;
    if (activeCamera) {
      console.log("FireballEffect: Active camera:", activeCamera.name || "unnamed");
      console.log("FireballEffect: Camera position:", activeCamera.position.toString());
      console.log("FireballEffect: Camera target:", activeCamera.getTarget()?.toString() || "no target");

      // Check distance from camera to fireball
      const distance = BABYLON.Vector3.Distance(activeCamera.position, this.fireballMesh.position);
      console.log("FireballEffect: Distance from camera:", distance);
    } else {
      console.warn("FireballEffect: No active camera found!");
    }

    // Log material details
    console.log("FireballEffect: Material type:", this.fireMaterial.constructor.name);
    console.log("FireballEffect: Material alpha:", this.fireMaterial.alpha);
    console.log("FireballEffect: Material name:", this.fireMaterial.name);

    console.log("FireballEffect: Fireball enabled at position:", this.fireballMesh.position.toString());
    console.log("FireballEffect: Fireball radius:", this.radius, "diameter:", this.radius * 2);
    console.log("FireballEffect: Fireball isVisible:", this.fireballMesh.isVisible);
    console.log("FireballEffect: Fireball isEnabled:", this.fireballMesh.isEnabled());
    console.log("FireballEffect: Duration:", this.duration, "ms");

    // Force a render update
    this.scene.render();

    // Set up animation loop
    this.onBeforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
      if (!this.isActive || !this.fireballMesh || !this.fireMaterial) {
        return;
      }

      // Update position to follow player
      this.updatePosition();

      // Update time uniform for animation (if using shader material)
      if (this.fireMaterial instanceof BABYLON.ShaderMaterial) {
        const elapsed = (Date.now() - this.startTime) / 1000.0;
        this.fireMaterial.setFloat("time", elapsed);
        // Also update intensity for pulsing effect
        const intensityVariation = 1.0 + 0.2 * Math.sin(elapsed * 3.0);
        this.fireMaterial.setFloat("intensity", this.intensity * intensityVariation);
      } else if (this.fallbackMaterial) {
        // Animate fallback material
        this.fallbackTime += 0.05;
        const intensity = 0.7 + 0.3 * Math.sin(this.fallbackTime);
        this.fallbackMaterial.emissiveColor = new BABYLON.Color3(1 * intensity, 0.5 * intensity, 0);
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
