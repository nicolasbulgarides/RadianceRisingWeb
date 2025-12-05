class EffectGenerator {

    async fireTest() {
        let scene = FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();

        let playerMesh = FundamentalSystemBridge["gameplayManagerComposite"].primaryActivePlayer.getPlayerModelDirectly();
        BABYLON.ParticleHelper.CreateAsync("fire", scene).then((set) => {

            // 1. **Set the Emitter Node:** This is the crucial step. 
            // The particle system will now emit particles from the center/origin of the playerMesh.
            set.emitterNode = playerMesh;

            // 2. Optional: Adjust the particle system's position relative to the mesh.
            // If you want the fire to look like it's coming out of the player's head, 
            // you might offset the emitter position slightly upward.
            // set.particleSystem.emitter = new BABYLON.Vector3(0, 1.5, 0); 

            // 3. Start the effect.
            set.start();

            // Optional: Keep a reference if you need to stop/reset it later
            // this.fireParticleSet = set;
        });
    }

    async waterBeamTest() {
        let scene = FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();
        let playerMesh = FundamentalSystemBridge["gameplayManagerComposite"].primaryActivePlayer.getPlayerModelDirectly();

        // Try the built-in "rain" effect first, then customize it
        BABYLON.ParticleHelper.CreateAsync("rain", scene).then((set) => {
            // Set the emitter to the player
            set.emitterNode = playerMesh;

            // Access the particle system to customize it for a water pillar effect
            let particleSystem = set.systems[0]; // Get the first particle system from the set

            // Reverse gravity to make water shoot upward
            particleSystem.gravity = new BABYLON.Vector3(0, 15, 0); // Positive Y = upward

            // Adjust emission rate for a denser pillar
            particleSystem.emitRate = 500;

            // Make particles emit upward in a narrow cone
            particleSystem.direction1 = new BABYLON.Vector3(-0.3, 1, -0.3);
            particleSystem.direction2 = new BABYLON.Vector3(0.3, 1.5, 0.3);

            // Reduce spread for a more pillar-like effect
            particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1);

            // Adjust particle lifetime
            particleSystem.minLifeTime = 0.5;
            particleSystem.maxLifeTime = 1.5;

            // Adjust size for visibility
            particleSystem.minSize = 1.0;
            particleSystem.maxSize = 2.0;

            // Optional: Adjust colors to be more water-like (blue/cyan)
            particleSystem.color1 = new BABYLON.Color4(0.2, 0.5, 1.0, 0.8);
            particleSystem.color2 = new BABYLON.Color4(0.4, 0.7, 1.0, 0.6);
            particleSystem.colorDead = new BABYLON.Color4(0.1, 0.3, 0.8, 0.0);

            // Start the effect
            set.start();

            // Optional: Keep reference for later control
            // this.waterPillarSet = set;
        }).catch((error) => {
            console.error("Rain effect not available, trying fountain:", error);

            // Fallback: Try "fountain" if rain doesn't work
            BABYLON.ParticleHelper.CreateAsync("fountain", scene).then((set) => {
                set.emitterNode = playerMesh;
                set.start();
            });
        });
    }


    /**
     * Creates and runs a one-time particle explosion effect at a specified position.
     * The function waits for the explosion to complete (duration) before cleaning up.
     * * @param {object} options - Configuration options for the explosion.
     * @param {string} options.type - The type of explosion ('fire', 'ice', 'magic', 'water').
     * @param {number} options.intensity - Multiplier for size, speed, and particle count.
     * @param {number} options.duration - Multiplier for particle lifetime.
     * @returns {Promise<void>} A Promise that resolves when the explosion effect is complete and disposed.
     */
    async explosionEffect(options = {}) {

        // --- SETUP & VALIDATION ---
        // Ensure you have a valid position (BABYLON.Vector3) and scene
        const position = FundamentalSystemBridge["gameplayManagerComposite"].primaryActivePlayer.getPlayerModelDirectly().position;
        const scene = FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();

        if (!position) {
            console.error("Explosion failed: Scene or player position is undefined.");
            return;
        }

        // Default options
        const settings = {
            type: 'water', // 'fire', 'ice', 'magic', 'water'
            intensity: 1.0,
            duration: 2.0, // Base particle lifetime multiplier
            ...options
        };

        // Calculate maximum system run time (Max particle life + small buffer)
        const particleMaxLifeTime = 1.5 * settings.duration;
        const effectDurationInSeconds = particleMaxLifeTime + 0.1;


        // --- PARTICLE SYSTEM CREATION ---
        // The number of particles can be very high for an intense burst
        const maxParticles = 2000 * settings.intensity;
        let particleSystem = new BABYLON.ParticleSystem("explosion", maxParticles, scene);

        // Texture - using a default flare texture
        particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);

        // Set fixed position as the emitter
        particleSystem.emitter = position;

        // --- EXPLOSION SHAPE ---
        // Particles will be emitted from within a small box centered on the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);

        // --- PARTICLE BEHAVIOR ---

        // Emission - CRITICAL FIX: Only use manualEmitCount for a burst!
        // We set emitRate to zero or omit it to prevent continuous streaming.
        particleSystem.manualEmitCount = Math.floor(500 * settings.intensity);
        particleSystem.emitRate = 0; // Ensures no continuous emission

        // Lifetime
        particleSystem.minLifeTime = 0.3 * settings.duration;
        particleSystem.maxLifeTime = particleMaxLifeTime;

        // Size
        particleSystem.minSize = 0.3 * settings.intensity;
        particleSystem.maxSize = 1.5 * settings.intensity;
        particleSystem.minSizeScale = 0.2; // Particles shrink as they die
        particleSystem.maxSizeScale = 0.8;

        // Speed - explosion power
        particleSystem.minEmitPower = 5 * settings.intensity;
        particleSystem.maxEmitPower = 12 * settings.intensity;
        particleSystem.updateSpeed = 0.01;

        // Direction - spherical explosion in all directions
        particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

        // Gravity (Default)
        particleSystem.gravity = new BABYLON.Vector3(0, -5, 0);

        // --- COLOR SCHEMES ---
        switch (settings.type) {
            case 'fire':
                particleSystem.color1 = new BABYLON.Color4(1.0, 0.8, 0.2, 1.0);
                particleSystem.color2 = new BABYLON.Color4(1.0, 0.3, 0.0, 1.0);
                particleSystem.colorDead = new BABYLON.Color4(0.3, 0.0, 0.0, 0.0);
                break;
            case 'ice':
                particleSystem.color1 = new BABYLON.Color4(0.8, 0.9, 1.0, 1.0);
                particleSystem.color2 = new BABYLON.Color4(0.3, 0.6, 1.0, 1.0);
                particleSystem.colorDead = new BABYLON.Color4(0.1, 0.2, 0.5, 0.0);
                particleSystem.gravity = new BABYLON.Vector3(0, -2, 0);
                break;
            case 'magic':
                particleSystem.color1 = new BABYLON.Color4(1.0, 0.3, 1.0, 1.0);
                particleSystem.color2 = new BABYLON.Color4(0.6, 0.2, 1.0, 1.0);
                particleSystem.colorDead = new BABYLON.Color4(0.3, 0.0, 0.5, 0.0);
                particleSystem.gravity = new BABYLON.Vector3(0, 2, 0); // Floats up
                break;
            case 'water':
                particleSystem.color1 = new BABYLON.Color4(0.4, 0.7, 1.0, 0.9);
                particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 0.9, 0.8);
                particleSystem.colorDead = new BABYLON.Color4(0.1, 0.3, 0.6, 0.0);
                particleSystem.gravity = new BABYLON.Vector3(0, -8, 0);
                break;
        }

        // --- VISUAL EFFECTS ---
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE; // Additive blending (for glow)
        particleSystem.minAngularSpeed = -2;
        particleSystem.maxAngularSpeed = 2;
        particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;

        // --- START & CLEANUP ---
        particleSystem.start();

        // Use a Promise with setTimeout to wait for the effect duration, then clean up.
        return new Promise(resolve => {
            setTimeout(() => {
                // Stop is redundant since we only used manualEmitCount, but is good practice.
                particleSystem.stop();

                // CRITICAL STEP: Dispose to remove from memory and the scene render loop.
                particleSystem.dispose();

                console.log(`Explosion effect (${settings.type}) completed and disposed.`);
                resolve();
            }, effectDurationInSeconds * 1000); // Wait for the calculated duration (seconds to ms)
        });
    }
}