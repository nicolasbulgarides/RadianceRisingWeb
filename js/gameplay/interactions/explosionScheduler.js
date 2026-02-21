/**
 * ExplosionScheduler
 *
 * Stateless explosion scheduling system that calculates and schedules explosions
 * for a single movement without maintaining any persistent state.
 */

// Global debug flag for ExplosionScheduler
const EXPLOSION_SCHEDULER_DEBUG = false;

/**
 * Debug logging method for ExplosionScheduler operations
 */
function explosionSchedulerDebugLog(...args) {
    if (EXPLOSION_SCHEDULER_DEBUG) {
        console.log("[EXPLOSION SCHEDULER]", ...args);
    }
}

/**
 * Schedules explosions for a single movement based on predicted collisions
 * @param {PlayerUnit} player - The player that's moving
 * @param {BABYLON.Vector3} startPosition - Starting position
 * @param {BABYLON.Vector3} destinationPosition - Destination position
 * @param {number} speed - Movement speed (from Config.DEFAULT_MAX_SPEED)
 * @param {number} currentFrame - Current frame count for frame-based scheduling
 */
function scheduleExplosionsForMovement(player, startPosition, destinationPosition, speed, currentFrame) {
    explosionSchedulerDebugLog(`🎬 scheduleExplosionsForMovement called for movement from (${startPosition.x.toFixed(2)}, ${startPosition.z.toFixed(2)}) to (${destinationPosition.x.toFixed(2)}, ${destinationPosition.z.toFixed(2)})`);

    // Debug: Check current level and microevents
    const gameplayManager2 = FundamentalSystemBridge["gameplayManagerComposite"];
    const level2 = gameplayManager2.primaryActiveGameplayLevel;
    if (level2) {
        const levelId = level2.levelDataComposite?.levelHeaderData?.levelId;
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const microEvents = microEventManager?.getMicroEventsByLevelId(levelId);
        explosionSchedulerDebugLog(`Current level: ${levelId}, microevents: ${microEvents?.length || 0}`);
        if (microEvents) {
            microEvents.forEach((event, i) => {
                explosionSchedulerDebugLog(`  ${i}: ${event.microEventNickname} at (${event.microEventLocation?.x?.toFixed(1)}, ${event.microEventLocation?.z?.toFixed(1)}) ${event.microEventCategory}`);
            });
        }
    }

    const totalDistance = BABYLON.Vector3.Distance(startPosition, destinationPosition);
    // Calculate total frames needed for movement at target speed (60 FPS)
    const totalTravelTimeMs = (totalDistance / speed) * 1000;
    const totalTravelFrames = Math.ceil((totalTravelTimeMs / 1000) * 60); // Convert to frames at 60 FPS

    // Calculate the position 0.25 units into the destination tile
    // This is where we want the explosion to trigger (when player model is 1/4 into the tile)
    const direction = destinationPosition.subtract(startPosition).normalize();
    const destTile = {
        x: Math.floor(destinationPosition.x),
        z: Math.floor(destinationPosition.z)
    };

    // Find the boundary of the DESTINATION tile (not the first boundary crossed)
    // We need to determine which edge of the destination tile the player enters from
    const startTile = {
        x: Math.floor(startPosition.x),
        z: Math.floor(startPosition.z)
    };

    // Calculate the entry boundary of the destination tile
    let destTileBoundaryX = destTile.x;
    let destTileBoundaryZ = destTile.z;

    // If coming from left (smaller x), enter at left edge of dest tile
    // If coming from right (larger x), enter at right edge (+ 1)
    if (startTile.x < destTile.x) {
        destTileBoundaryX = destTile.x; // Left edge
    } else if (startTile.x > destTile.x) {
        destTileBoundaryX = destTile.x + 1; // Right edge
    }

    if (startTile.z < destTile.z) {
        destTileBoundaryZ = destTile.z; // Front edge
    } else if (startTile.z > destTile.z) {
        destTileBoundaryZ = destTile.z + 1; // Back edge
    }

    explosionSchedulerDebugLog(`Movement detected:`);
    explosionSchedulerDebugLog(`  Start position: (${startPosition.x.toFixed(2)}, ${startPosition.z.toFixed(2)})`);
    explosionSchedulerDebugLog(`  Destination: (${destinationPosition.x.toFixed(2)}, ${destinationPosition.z.toFixed(2)})`);
    explosionSchedulerDebugLog(`  Start tile: (${startTile.x}, ${startTile.z})`);
    explosionSchedulerDebugLog(`  Dest tile: (${destTile.x}, ${destTile.z})`);
    explosionSchedulerDebugLog(`  Total distance: ${totalDistance.toFixed(2)} units`);
    explosionSchedulerDebugLog(`  Speed: ${speed} units/sec`);

    // Calculate ALL tiles that will be passed through (including destination)
    const tilesPassedThrough = calculateTilesPassedThrough(startPosition, destinationPosition);
    explosionSchedulerDebugLog(`Tiles to check: ${tilesPassedThrough.length} tiles`);

    // Check for microevents at ALL passed-through tiles
    const microEventManager = FundamentalSystemBridge["microEventManager"];
    if (!microEventManager) {
        return;
    }

    // Get microevents for current level
    const levelId = level2?.levelDataComposite?.levelHeaderData?.levelId;
    const microEvents = microEventManager.getMicroEventsByLevelId(levelId);

    // Debug logging for level ID consistency
    explosionSchedulerDebugLog(`Current level ID: ${levelId}`);
    explosionSchedulerDebugLog(`Found ${microEvents?.length || 0} microevents for level ${levelId}`);
    if (microEvents?.length === 0) {
        explosionSchedulerDebugLog(`WARNING: No microevents found for level ${levelId}!`);
    }

    // Log all microevent level IDs for debugging
    if (microEventManager.gameplayLevelToMicroEventsMap) {
        const allLevelIds = Object.keys(microEventManager.gameplayLevelToMicroEventsMap);
        explosionSchedulerDebugLog(`All registered level IDs: ${allLevelIds.join(', ')}`);
        allLevelIds.forEach(id => {
            const count = microEventManager.gameplayLevelToMicroEventsMap[id]?.length || 0;
            explosionSchedulerDebugLog(`  Level ${id}: ${count} microevents`);
        });
    }

    // Find microevents at ALL tiles passed through
    for (const tileInfo of tilesPassedThrough) {
        for (const microEvent of microEvents) {
            if (!microEvent.microEventLocation) {
                continue;
            }

            const eventTile = {
                x: Math.floor(microEvent.microEventLocation.x),
                z: Math.floor(microEvent.microEventLocation.z)
            };

            // Check if event is at this passed-through tile
            if (eventTile.x === tileInfo.tileX && eventTile.z === tileInfo.tileZ) {
                explosionSchedulerDebugLog(`✓ Found ${microEvent.microEventCategory} at tile (${tileInfo.tileX}, ${tileInfo.tileZ}) - triggering explosion`);

                // Trigger explosion immediately for this microevent
                triggerExplosion(microEvent);
            }
        }
    }
}

/**
 * Calculates all tiles the player will pass through during movement
 * @param {BABYLON.Vector3} startPosition - Starting position
 * @param {BABYLON.Vector3} destinationPosition - Destination position
 * @returns {Array<{tileX: number, tileZ: number}>} Array of tile coordinates
 */
function calculateTilesPassedThrough(startPosition, destinationPosition) {
    const startTile = {
        x: Math.floor(startPosition.x),
        z: Math.floor(startPosition.z)
    };
    const destTile = {
        x: Math.floor(destinationPosition.x),
        z: Math.floor(destinationPosition.z)
    };

    const tiles = [];

    // Use Bresenham-like algorithm to find all tiles along the path
    const dx = Math.abs(destTile.x - startTile.x);
    const dz = Math.abs(destTile.z - startTile.z);
    const sx = startTile.x < destTile.x ? 1 : -1;
    const sz = startTile.z < destTile.z ? 1 : -1;

    let currentX = startTile.x;
    let currentZ = startTile.z;
    let err = dx - dz;

    // Don't include the starting tile (player is already there)
    // Do include all tiles along the path including destination
    const visited = new Set();

    while (true) {
        // Move to next tile
        const e2 = 2 * err;
        if (e2 > -dz) {
            err -= dz;
            currentX += sx;
        }
        if (e2 < dx) {
            err += dx;
            currentZ += sz;
        }

        const tileKey = `${currentX}_${currentZ}`;
        if (!visited.has(tileKey)) {
            tiles.push({ tileX: currentX, tileZ: currentZ });
            visited.add(tileKey);
        }

        // Stop when we reach destination tile
        if (currentX === destTile.x && currentZ === destTile.z) {
            break;
        }
    }

    return tiles;
}

/**
 * Calculates when the player will be 0.25 units into a specific tile
 * @param {BABYLON.Vector3} startPosition - Starting position
 * @param {BABYLON.Vector3} destinationPosition - Destination position
 * @param {number} tileX - Tile X coordinate
 * @param {number} tileZ - Tile Z coordinate
 * @param {BABYLON.Vector3} direction - Movement direction (normalized)
 * @param {number} speed - Movement speed
 * @returns {number} Time in milliseconds when player will be 0.25 into tile
 */
function calculateExplosionTimeForTile(startPosition, destinationPosition, tileX, tileZ, direction, speed) {
    const startTile = {
        x: Math.floor(startPosition.x),
        z: Math.floor(startPosition.z)
    };

    // Determine which edge of this tile the player enters from
    let tileBoundaryX = tileX;
    let tileBoundaryZ = tileZ;

    // Calculate entry boundary based on direction
    if (direction.x > 0) {
        tileBoundaryX = tileX; // Entering from left edge
    } else if (direction.x < 0) {
        tileBoundaryX = tileX + 1; // Entering from right edge
    } else {
        // Moving purely in Z direction, use current x position
        tileBoundaryX = startPosition.x;
    }

    if (direction.z > 0) {
        tileBoundaryZ = tileZ; // Entering from front edge
    } else if (direction.z < 0) {
        tileBoundaryZ = tileZ + 1; // Entering from back edge
    } else {
        // Moving purely in X direction, use current z position
        tileBoundaryZ = startPosition.z;
    }

    const tileBoundaryPosition = new BABYLON.Vector3(
        tileBoundaryX,
        startPosition.y,
        tileBoundaryZ
    );

    // Position 0.25 units into this tile
    const positionIntoTile = tileBoundaryPosition.add(direction.scale(0.25));

    // Calculate distance from start to the 0.25-into-tile position
    const distanceToExplosionPoint = BABYLON.Vector3.Distance(startPosition, positionIntoTile);

    // Calculate time to reach that position
    const explosionTriggerTimeMs = (distanceToExplosionPoint / speed) * 1000;

    return explosionTriggerTimeMs;
}



/**
 * Triggers an explosion for a microevent
 * @param {MicroEvent} microEvent - The microevent to trigger explosion for
 */
function triggerExplosion(microEvent) {
    const scene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
    explosionSchedulerDebugLog(`triggerExplosion - scene: ${scene?.name || 'null'}, location: ${microEvent.microEventLocation ? 'valid' : 'null'}`);
    if (!scene || !microEvent.microEventLocation) {
        explosionSchedulerDebugLog(`Cannot trigger explosion - missing scene or location`);
        return;
    }

    const category = microEvent.microEventCategory;
    const isHeart = microEvent.microEventValue === "heart" || microEvent.microEventNickname?.includes("Heart");

    // Trigger appropriate explosion using our own methods
    if (category === "pickup" && isHeart) {
        createHeartExplosion(microEvent.microEventLocation, scene).catch(error => {
            console.error(`[EXPLOSION SCHEDULER] Heart explosion failed:`, error);
        });
    } else if (category === "pickup") {
        createStardustExplosion(microEvent.microEventLocation, scene).catch(error => {
            console.error(`[EXPLOSION SCHEDULER] Stardust explosion failed:`, error);
        });
    } else if (category === "damage") {
        createDamageExplosion(microEvent.microEventLocation, scene).catch(error => {
            console.error(`[EXPLOSION SCHEDULER] Damage explosion failed:`, error);
        });
    }
}

/**
 * Ensures the particle texture is loaded and cached per scene
 * @param {BABYLON.Scene} scene - The scene to load texture into
 * @returns {BABYLON.Texture} The cached texture for this scene
 */
function ensureParticleTextureLoaded(scene) {
    // Initialize scene-specific texture cache if it doesn't exist
    if (!window.sceneParticleTextures) {
        window.sceneParticleTextures = new Map();
    }

    // Check if we already have a texture for this scene
    if (window.sceneParticleTextures.has(scene)) {
        const cachedTexture = window.sceneParticleTextures.get(scene);
        // Check if texture is still valid (not disposed)
        if (cachedTexture && !cachedTexture.isDisposed) {
            return cachedTexture;
        } else {
            // Remove invalid texture
            window.sceneParticleTextures.delete(scene);
        }
    }

    // Create new texture for this scene
    if (scene) {
        const texture = new BABYLON.Texture(
            "https://assets.babylonjs.com/textures/flare.png",
            scene
        );
        window.sceneParticleTextures.set(scene, texture);
        return texture;
    }

    return null;
}

/**
 * Creates a parameterized particle explosion effect
 * @param {Object} config - Explosion configuration
 * @param {BABYLON.Vector3} config.position - Position for the explosion
 * @param {BABYLON.Scene} config.scene - The scene
 * @param {number} config.maxParticles - Maximum number of particles
 * @param {number} config.emitCount - Number of particles to emit
 * @param {BABYLON.Vector3} config.emitBox - Emission box size
 * @param {number} config.minLifeTime - Minimum particle lifetime
 * @param {number} config.maxLifeTime - Maximum particle lifetime
 * @param {number} config.minSize - Minimum particle size
 * @param {number} config.maxSize - Maximum particle size
 * @param {number} config.minEmitPower - Minimum emission power
 * @param {number} config.maxEmitPower - Maximum emission power
 * @param {BABYLON.Color4} config.color1 - Primary color
 * @param {BABYLON.Color4} config.color2 - Secondary color
 * @param {BABYLON.Color4} config.colorDead - Death color
 * @param {BABYLON.Vector3} config.gravity - Gravity vector
 * @param {number} config.cleanupTimeMs - Time before cleanup (ms)
 * @param {string} config.name - Name for the particle system
 * @returns {Promise<void>}
 */
async function createParameterizedExplosion(config) {
    if (window.RenderController) window.RenderController.markDirty(60);

    const particleSystem = new BABYLON.ParticleSystem(
        config.name || `explosion_${Date.now()}`,
        config.maxParticles,
        config.scene
    );

    // Texture - use cached texture for instant start
    const texture = ensureParticleTextureLoaded(config.scene);
    particleSystem.particleTexture = texture;

    // Set position as emitter
    particleSystem.emitter = config.position.clone();

    // Explosion shape
    particleSystem.minEmitBox = config.emitBox.scale(-1);
    particleSystem.maxEmitBox = config.emitBox;

    // Emission - burst effect
    particleSystem.manualEmitCount = config.emitCount;
    particleSystem.emitRate = 0;

    // Lifetime
    particleSystem.minLifeTime = config.minLifeTime;
    particleSystem.maxLifeTime = config.maxLifeTime;

    // Size
    particleSystem.minSize = config.minSize;
    particleSystem.maxSize = config.maxSize;

    // Speed
    particleSystem.minEmitPower = config.minEmitPower;
    particleSystem.maxEmitPower = config.maxEmitPower;
    particleSystem.updateSpeed = 0.01;

    // Direction - spherical explosion
    particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

    // Colors
    particleSystem.color1 = config.color1;
    particleSystem.color2 = config.color2;
    particleSystem.colorDead = config.colorDead;
    particleSystem.gravity = config.gravity;

    // Visual effects
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;

    // Start the effect
    particleSystem.start();

    // Verify the particle system is properly set up
    explosionSchedulerDebugLog(`Particle system started: ${particleSystem.name}, scene: ${particleSystem._scene?.name || 'unknown'}, hasTexture: ${!!particleSystem.particleTexture}`);

    // Clean up after specified time
    return new Promise((resolve) => {
        setTimeout(() => {
            explosionSchedulerDebugLog(`Stopping and disposing particle system: ${particleSystem.name}`);
            particleSystem.stop();
            particleSystem.dispose(false); // Keep texture cached
            resolve();
        }, config.cleanupTimeMs);
    });
}

/**
 * Creates a damage explosion (red/orange burst for spikes)
 * @param {BABYLON.Vector3} position - Position for the explosion
 * @param {BABYLON.Scene} scene - The scene
 * @returns {Promise<void>}
 */
async function createDamageExplosion(position, scene) {
    // Adjust position to be more visible - raise Y position and make it more prominent
    const adjustedPosition = position.clone();
    adjustedPosition.y = 1.0; // Raise above ground level

    return createParameterizedExplosion({
        position: adjustedPosition,
        scene: scene,
        maxParticles: 300, // Increase particle count
        emitCount: 150, // Increase emit count
        emitBox: new BABYLON.Vector3(0.3, 0.3, 0.3), // Larger emission area
        minLifeTime: 0.25, // Longer lifetime
        maxLifeTime: 0.5, // Longer lifetime
        minSize: 0.2, // Larger particles
        maxSize: 0.6, // Larger particles
        minEmitPower: 3, // More powerful emission
        maxEmitPower: 7, // More powerful emission
        color1: new BABYLON.Color4(1.0, 0.2, 0.0, 1.0), // Red
        color2: new BABYLON.Color4(1.0, 0.5, 0.0, 1.0), // Orange
        colorDead: new BABYLON.Color4(0.5, 0.0, 0.0, 0.0),
        gravity: new BABYLON.Vector3(0, -3, 0), // Less gravity
        cleanupTimeMs: 600, // Longer duration
        name: `damageExplosion_${Date.now()}`
    });
}

/**
 * Creates a stardust explosion (blue/purple burst)
 * @param {BABYLON.Vector3} position - Position for the explosion
 * @param {BABYLON.Scene} scene - The scene
 * @returns {Promise<void>}
 */
async function createStardustExplosion(position, scene) {
    // Adjust position to be more visible - raise Y position
    const adjustedPosition = position.clone();
    adjustedPosition.y = 1.0; // Raise above ground level

    return createParameterizedExplosion({
        position: adjustedPosition,
        scene: scene,
        maxParticles: 600, // Increase particle count
        emitCount: 400, // Increase emit count
        emitBox: new BABYLON.Vector3(0.4, 0.4, 0.4), // Larger emission area
        minLifeTime: 0.3, // Longer lifetime
        maxLifeTime: 0.6, // Longer lifetime
        minSize: 0.3, // Larger particles
        maxSize: 1.0, // Larger particles
        minEmitPower: 4, // More powerful emission
        maxEmitPower: 10, // More powerful emission
        color1: new BABYLON.Color4(0.2, 0.4, 1.0, 1.0), // Bright blue
        color2: new BABYLON.Color4(0.6, 0.2, 1.0, 1.0), // Purple
        colorDead: new BABYLON.Color4(0.1, 0.0, 0.5, 0.0),
        gravity: new BABYLON.Vector3(0, 1, 0), // Float up gently
        cleanupTimeMs: 700, // Longer duration
        name: `stardustExplosion_${Date.now()}`
    });
}

/**
 * Creates a heart explosion (pink burst)
 * @param {BABYLON.Vector3} position - Position for the explosion
 * @param {BABYLON.Scene} scene - The scene
 * @returns {Promise<void>}
 */
async function createHeartExplosion(position, scene) {
    // Adjust position to be more visible - raise Y position
    const adjustedPosition = position.clone();
    adjustedPosition.y = 1.0; // Raise above ground level

    return createParameterizedExplosion({
        position: adjustedPosition,
        scene: scene,
        maxParticles: 200, // Increase particle count
        emitCount: 120, // Increase emit count
        emitBox: new BABYLON.Vector3(0.3, 0.3, 0.3), // Larger emission area
        minLifeTime: 0.25, // Longer lifetime
        maxLifeTime: 0.5, // Longer lifetime
        minSize: 0.2, // Larger particles
        maxSize: 0.7, // Larger particles
        minEmitPower: 3, // More powerful emission
        maxEmitPower: 6, // More powerful emission
        color1: new BABYLON.Color4(1.0, 0.4, 0.7, 1.0), // Bright pink
        color2: new BABYLON.Color4(1.0, 0.7, 0.9, 1.0), // Light pink
        colorDead: new BABYLON.Color4(0.8, 0.2, 0.5, 0.0),
        gravity: new BABYLON.Vector3(0, 0.5, 0), // Float up gently
        cleanupTimeMs: 500, // Longer duration
        name: `heartExplosion_${Date.now()}`
    });
}

/**
 * Clears all scheduled explosions (no-op since we trigger immediately now)
 */
function clearAllScheduledExplosions() {
    // No scheduled explosions to clear since we trigger immediately
    explosionSchedulerDebugLog(`Clear scheduled explosions called (no-op)`);
}

// Export the main functions
window.ExplosionScheduler = {
    scheduleExplosionsForMovement,
    clearAllScheduledExplosions
};
