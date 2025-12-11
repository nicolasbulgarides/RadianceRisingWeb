/**
 * LevelAuditor
 *
 * Utility class that simulates pathfinding through a level to determine:
 * - Minimum number of strokes (moves) to complete a level
 * - The optimal path to collect all 4 stardusts
 * - Validates paths don't result in player death
 *
 * Uses BFS (Breadth-First Search) to find the shortest valid path.
 */
console.log("[LEVEL AUDITOR] 📚 LevelAuditor script loaded and class defined");
class LevelAuditor {
    constructor() {
        // Default game constants (can be overridden)
        this.STARTING_HEALTH = 4;
        this.MAX_HEALTH = 4;
        this.REQUIRED_STARDUSTS = 4;

        // Directions for movement
        this.DIRECTIONS = {
            UP: { dx: 0, dz: 1 },
            DOWN: { dx: 0, dz: -1 },
            LEFT: { dx: -1, dz: 0 },
            RIGHT: { dx: 1, dz: 0 }
        };

        // Debug mode - set to true for detailed logging
        this.DEBUG_MODE = false;
    }

    /**
     * Enables debug mode for verbose logging
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        this.DEBUG_MODE = enabled;
        console.log(`[LEVEL AUDITOR] Debug mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }

    /**
     * Main entry point - audits a level after it's loaded
     * @param {Object} levelData - The raw level JSON data
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level (optional)
     */
    auditLevel(levelData, activeGameplayLevel = null) {
        console.log("═══════════════════════════════════════════════════════════");
        console.log("[LEVEL AUDITOR] 🔍 Starting level audit...");
        console.log("[LEVEL AUDITOR] 📥 Input levelData:", levelData ? "present" : "null");
        console.log("[LEVEL AUDITOR] 📥 Input activeGameplayLevel:", activeGameplayLevel ? "present" : "null");
        console.log("═══════════════════════════════════════════════════════════");

        try {
            // Parse level data into auditor format
            const parsedLevel = this.parseLevelData(levelData);

            if (!parsedLevel) {
                console.error("[LEVEL AUDITOR] ❌ Failed to parse level data");
                return null;
            }

            // Log level structure
            this.logLevelStructure(parsedLevel);

            // Run pathfinding simulation
            const result = this.findOptimalPath(parsedLevel);

            // Log results
            this.logAuditResults(result, parsedLevel);

            return result;
        } catch (error) {
            console.error("[LEVEL AUDITOR] ❌ Error during audit:", error);
            return null;
        }
    }

    /**
     * Parses level JSON data into a format suitable for pathfinding
     * @param {Object} levelData - The raw level JSON data
     * @returns {Object} Parsed level data
     */
    parseLevelData(levelData) {
        console.log("[LEVEL AUDITOR] 🔧 Parsing level data...");
        console.log("[LEVEL AUDITOR] 🔧 Level data keys:", Object.keys(levelData || {}));
        const width = levelData.mapWidth || 21;
        const depth = levelData.mapHeight || levelData.mapDepth || 21;
        console.log(`[LEVEL AUDITOR] 🔧 Level dimensions: ${width} x ${depth}`);

        // Find spawn position
        const spawnElement = levelData.allMapElements?.find(el => el.element === "SPAWN_POSITION");
        const spawnCoords = spawnElement?.coordinates || { x: 10, y: 10 };
        const spawn = this.builderToWorld(spawnCoords, depth);

        // Find all stardusts
        const stardusts = [];
        const stardustElements = levelData.allMapElements?.filter(el => el.element === "STAR_DUST") || [];
        for (const el of stardustElements) {
            const worldCoords = this.builderToWorld(el.coordinates, depth);
            stardusts.push({ x: worldCoords.x, z: worldCoords.z, id: stardusts.length });
        }

        // Find all obstacles (mountains)
        const obstacles = new Set();
        const obstacleElements = levelData.allMapElements?.filter(el => el.element === "MOUNTAIN") || [];
        for (const el of obstacleElements) {
            const worldCoords = this.builderToWorld(el.coordinates, depth);
            obstacles.add(`${worldCoords.x},${worldCoords.z}`);
        }

        // Find all locks (unlockable obstacles)
        const locks = new Set();
        const lockElements = levelData.allMapElements?.filter(el => el.element === "LOCK") || [];
        console.log(`[LEVEL AUDITOR] 🔧 Found ${lockElements.length} LOCK elements`);
        for (const el of lockElements) {
            const worldCoords = this.builderToWorld(el.coordinates, depth);
            locks.add(`${worldCoords.x},${worldCoords.z}`);
            console.log(`[LEVEL AUDITOR] 🔧 Lock at (${worldCoords.x}, ${worldCoords.z})`);
        }

        // Find all spike traps
        const spikes = new Set();
        const spikeElements = levelData.allMapElements?.filter(el => el.element === "SPIKE_TRAP") || [];
        for (const el of spikeElements) {
            const worldCoords = this.builderToWorld(el.coordinates, depth);
            spikes.add(`${worldCoords.x},${worldCoords.z}`);
        }

        // Find all heart pickups
        const hearts = [];
        const heartElements = levelData.allMapElements?.filter(el => el.element === "HEART") || [];
        for (const el of heartElements) {
            const worldCoords = this.builderToWorld(el.coordinates, depth);
            hearts.push({ x: worldCoords.x, z: worldCoords.z, id: hearts.length });
        }

        // Find all keys
        const keys = [];
        const keyElements = levelData.allMapElements?.filter(el => el.element === "KEY") || [];
        console.log(`[LEVEL AUDITOR] 🔧 Found ${keyElements.length} KEY elements`);
        for (const el of keyElements) {
            const worldCoords = this.builderToWorld(el.coordinates, depth);
            keys.push({ x: worldCoords.x, z: worldCoords.z, id: keys.length });
            console.log(`[LEVEL AUDITOR] 🔧 Key at (${worldCoords.x}, ${worldCoords.z})`);
        }

        return {
            width,
            depth,
            spawn,
            stardusts,
            obstacles,
            spikes,
            hearts,
            locks,
            keys,
            levelName: levelData.levelName || "Unknown"
        };
    }

    /**
     * Converts builder coordinates (top-left origin) to world coordinates (bottom-left origin)
     * @param {Object} coords - Builder coordinates {x, y}
     * @param {number} depth - Level depth
     * @returns {Object} World coordinates {x, z}
     */
    builderToWorld(coords, depth) {
        return {
            x: coords.x,
            z: (depth - 1 - coords.y)
        };
    }

    /**
     * Finds the optimal path to collect all stardusts using BFS
     * @param {Object} parsedLevel - The parsed level data
     * @returns {Object} Result containing min strokes, path, and validity
     */
    findOptimalPath(parsedLevel) {
        const { width, depth, spawn, stardusts, obstacles, spikes, hearts, locks, keys } = parsedLevel;

        if (stardusts.length === 0) {
            console.warn("[LEVEL AUDITOR] ⚠ No stardusts found in level");
            return { valid: false, reason: "No stardusts in level" };
        }

        // State: { x, z, health, collectedStardusts (bitmask), collectedHearts (bitmask) }
        // We use BFS to find shortest path

        const initialState = {
            x: spawn.x,
            z: spawn.z,
            health: this.STARTING_HEALTH,
            collectedStardusts: 0,
            collectedHearts: 0,
            collectedKeys: 0,
            strokes: 0,
            path: []
        };

        // Create visited state key
        const getStateKey = (state) => {
            return `${state.x},${state.z},${state.health},${state.collectedStardusts},${state.collectedHearts},${state.collectedKeys}`;
        };

        const visited = new Set();
        const queue = [initialState];
        visited.add(getStateKey(initialState));

        // Target: collect all stardusts
        const targetStardustMask = (1 << stardusts.length) - 1;

        // Helper to check if position is an obstacle (considering keys for locks)
        const isObstacle = (x, z, availableKeys) => {
            // Mountains are always obstacles
            if (obstacles.has(`${x},${z}`)) return true;
            // Locks are obstacles only if no keys available
            if (locks.has(`${x},${z}`)) return availableKeys <= 0;
            return false;
        };

        // Helper to check if position is within bounds
        const isInBounds = (x, z) => x >= 0 && x < width && z >= 0 && z < depth;

        // Helper to get stardust at position
        const getStardustAt = (x, z) => stardusts.find(s => s.x === x && s.z === z);

        // Helper to get heart at position
        const getHeartAt = (x, z) => hearts.find(h => h.x === x && h.z === z);

        // Helper to check if position is a spike
        const isSpike = (x, z) => spikes.has(`${x},${z}`);

        // Helper to check if position is a lock
        const isLock = (x, z) => locks.has(`${x},${z}`);

        // Helper to get key at position
        const getKeyAt = (x, z) => keys.find(k => k.x === x && k.z === z);

        let iterations = 0;
        const MAX_ITERATIONS = 1000000; // Prevent infinite loops

        // Track stats for debugging
        let maxStardustsReached = 0;
        let bestPartialPath = null;
        let deathCount = 0;
        let lowHealthSurvivalCount = 0; // Paths where we reached 1 HP

        while (queue.length > 0 && iterations < MAX_ITERATIONS) {
            iterations++;
            const current = queue.shift();

            // Track best partial progress for debugging
            const currentStardusts = this.countBits(current.collectedStardusts);
            if (currentStardusts > maxStardustsReached) {
                maxStardustsReached = currentStardusts;
                bestPartialPath = current;
            }

            // Track 1 HP survival for debugging
            if (current.health === 1) {
                lowHealthSurvivalCount++;
            }

            // Check if we've collected all stardusts
            if (current.collectedStardusts === targetStardustMask) {
                return {
                    valid: true,
                    minStrokes: current.strokes,
                    path: current.path,
                    finalHealth: current.health,
                    heartsCollected: this.countBits(current.collectedHearts),
                    keysCollected: this.countBits(current.collectedKeys),
                    iterations
                };
            }

            // Try all four directions
            for (const [dirName, dir] of Object.entries(this.DIRECTIONS)) {
                // Calculate destination (move until hitting obstacle or boundary)
                let destX = current.x;
                let destZ = current.z;
                let nextX = current.x + dir.dx;
                let nextZ = current.z + dir.dz;

                // Keep moving until we hit obstacle or boundary (unlimited distance)
                while (isInBounds(nextX, nextZ) && !isObstacle(nextX, nextZ, this.countBits(current.collectedKeys))) {
                    destX = nextX;
                    destZ = nextZ;
                    nextX += dir.dx;
                    nextZ += dir.dz;
                }

                // Skip if we didn't move
                if (destX === current.x && destZ === current.z) {
                    continue;
                }

                // Simulate movement - check all tiles along the path
                let newHealth = current.health;
                let newCollectedStardusts = current.collectedStardusts;
                let newCollectedHearts = current.collectedHearts;
                let newCollectedKeys = current.collectedKeys;
                let damageTaken = 0;
                let heartsPickedUp = 0;
                let keysPickedUp = 0;

                // Walk through each tile from start to destination
                let pathX = current.x;
                let pathZ = current.z;
                let died = false;

                while (pathX !== destX || pathZ !== destZ) {
                    pathX += dir.dx;
                    pathZ += dir.dz;

                    // Check for heart FIRST (allows surviving spike on same tile)
                    const heart = getHeartAt(pathX, pathZ);
                    if (heart && !(newCollectedHearts & (1 << heart.id))) {
                        newCollectedHearts |= (1 << heart.id);
                        const oldHealth = newHealth;
                        newHealth = Math.min(newHealth + 1, this.MAX_HEALTH);
                        if (newHealth > oldHealth) heartsPickedUp++;
                    }

                    // Check for key collection
                    const key = getKeyAt(pathX, pathZ);
                    if (key && !(newCollectedKeys & (1 << key.id))) {
                        newCollectedKeys |= (1 << key.id);
                        keysPickedUp++;
                    }

                    // Check for lock unlocking (consume key if passing through)
                    if (isLock(pathX, pathZ)) {
                        // We should have a key available since we passed the obstacle check
                        // Consume one key (find first available key)
                        for (let keyId = 0; keyId < keys.length; keyId++) {
                            if (newCollectedKeys & (1 << keyId)) {
                                newCollectedKeys &= ~(1 << keyId); // Remove this key
                                break;
                            }
                        }
                    }

                    // Check for spike damage at this position
                    if (isSpike(pathX, pathZ)) {
                        newHealth -= 1;
                        damageTaken++;
                        if (newHealth <= 0) {
                            died = true;
                            if (this.DEBUG_MODE) {
                                console.log(`[AUDIT DEBUG] Death at (${pathX},${pathZ}) - took ${damageTaken} damage, started with ${current.health} HP`);
                            }
                            break; // Died
                        }
                    }

                    // Check for stardust at this position
                    const stardust = getStardustAt(pathX, pathZ);
                    if (stardust) {
                        newCollectedStardusts |= (1 << stardust.id);
                    }
                }

                // Skip if player died
                if (died || newHealth <= 0) {
                    continue;
                }

                const newState = {
                    x: destX,
                    z: destZ,
                    health: newHealth,
                    collectedStardusts: newCollectedStardusts,
                    collectedHearts: newCollectedHearts,
                    collectedKeys: newCollectedKeys,
                    strokes: current.strokes + 1,
                    path: [...current.path, {
                        direction: dirName,
                        from: { x: current.x, z: current.z },
                        to: { x: destX, z: destZ },
                        healthAfter: newHealth,
                        stardustsAfter: this.countBits(newCollectedStardusts),
                        keysAfter: this.countBits(newCollectedKeys)
                    }]
                };

                const stateKey = getStateKey(newState);
                if (!visited.has(stateKey)) {
                    visited.add(stateKey);
                    queue.push(newState);
                }
            }
        }

        // No valid path found - include debug info
        return {
            valid: false,
            reason: iterations >= MAX_ITERATIONS ? "Max iterations reached" : "No valid path exists",
            iterations,
            debug: {
                maxStardustsReached,
                bestPartialPath: bestPartialPath ? {
                    strokes: bestPartialPath.strokes,
                    position: { x: bestPartialPath.x, z: bestPartialPath.z },
                    health: bestPartialPath.health,
                    stardusts: this.countBits(bestPartialPath.collectedStardusts),
                    path: bestPartialPath.path
                } : null,
                lowHealthSurvivalCount,
                statesExplored: visited.size
            }
        };
    }

    /**
     * Counts the number of set bits in a number (used for bitmask counting)
     * @param {number} n - The number to count bits in
     * @returns {number} The number of set bits
     */
    countBits(n) {
        let count = 0;
        while (n) {
            count += n & 1;
            n >>= 1;
        }
        return count;
    }

    /**
     * Logs the parsed level structure
     * @param {Object} parsedLevel - The parsed level data
     */
    logLevelStructure(parsedLevel) {
        console.log("\n[LEVEL AUDITOR] 📋 Level Structure:");
        console.log(`  Level: ${parsedLevel.levelName}`);
        console.log(`  Dimensions: ${parsedLevel.width} x ${parsedLevel.depth}`);
        console.log(`  Spawn: (${parsedLevel.spawn.x}, ${parsedLevel.spawn.z})`);
        console.log(`  Stardusts: ${parsedLevel.stardusts.length}`);
        parsedLevel.stardusts.forEach((s, i) => {
            console.log(`    ${i + 1}. (${s.x}, ${s.z})`);
        });
        console.log(`  Obstacles: ${parsedLevel.obstacles.size}`);
        console.log(`  Locks: ${parsedLevel.locks.size}`);
        console.log(`  Keys: ${parsedLevel.keys.length}`);
        parsedLevel.keys.forEach((k, i) => {
            console.log(`    ${i + 1}. (${k.x}, ${k.z})`);
        });
        console.log(`  Spikes: ${parsedLevel.spikes.size}`);
        console.log(`  Hearts: ${parsedLevel.hearts.length}`);
        parsedLevel.hearts.forEach((h, i) => {
            console.log(`    ${i + 1}. (${h.x}, ${h.z})`);
        });
        console.log(`\n[LEVEL AUDITOR] ⚙️ Simulation Settings:`);
        console.log(`  Starting Health: ${this.STARTING_HEALTH}`);
        console.log(`  Movement: Unlimited (until obstacle or boundary)`);
        console.log(`  Death threshold: Health <= 0 (1 HP is survivable)`);
    }

    /**
     * Logs the audit results
     * @param {Object} result - The pathfinding result
     * @param {Object} parsedLevel - The parsed level data
     */
    logAuditResults(result, parsedLevel) {
        console.log("\n═══════════════════════════════════════════════════════════");
        console.log("[LEVEL AUDITOR] 📊 AUDIT RESULTS");
        console.log("═══════════════════════════════════════════════════════════");

        if (!result.valid) {
            console.log(`\n  ❌ Level is UNSOLVABLE`);
            console.log(`  Reason: ${result.reason}`);
            if (result.iterations) {
                console.log(`  BFS Iterations: ${result.iterations}`);
            }
            if (result.debug) {
                console.log(`\n  📊 DEBUG INFO:`);
                console.log(`  States explored: ${result.debug.statesExplored}`);
                console.log(`  Max stardusts reached: ${result.debug.maxStardustsReached}/${parsedLevel.stardusts.length}`);
                console.log(`  Paths reaching 1 HP: ${result.debug.lowHealthSurvivalCount}`);

                if (result.debug.bestPartialPath) {
                    console.log(`\n  📍 Best partial path (${result.debug.bestPartialPath.stardusts} stardusts):`);
                    console.log(`    Final position: (${result.debug.bestPartialPath.position.x}, ${result.debug.bestPartialPath.position.z})`);
                    console.log(`    Strokes used: ${result.debug.bestPartialPath.strokes}`);
                    console.log(`    Health remaining: ${result.debug.bestPartialPath.health}`);
                    if (result.debug.bestPartialPath.path && result.debug.bestPartialPath.path.length > 0) {
                        console.log(`    Path: ${result.debug.bestPartialPath.path.map(m => m.direction[0]).join(" → ")}`);
                    }
                }
            }
            console.log("\n═══════════════════════════════════════════════════════════\n");
            return;
        }

        console.log(`\n  ✅ Level is SOLVABLE`);
        console.log(`  ⭐ Minimum Strokes: ${result.minStrokes}`);
        console.log(`  ❤ Final Health: ${result.finalHealth}/${this.MAX_HEALTH}`);
        console.log(`  💖 Hearts Collected: ${result.heartsCollected}`);
        console.log(`  🔑 Keys Collected: ${result.keysCollected}`);
        console.log(`  🔍 States Explored: ${result.iterations}`);

        console.log(`\n  📍 OPTIMAL PATH (${result.minStrokes} moves):`);
        console.log("  ─────────────────────────────────────────────────────────");

        result.path.forEach((move, i) => {
            const dirEmoji = this.getDirectionEmoji(move.direction);
            console.log(`  ${i + 1}. ${dirEmoji} ${move.direction.padEnd(5)} │ (${move.from.x},${move.from.z}) → (${move.to.x},${move.to.z}) │ ❤${move.healthAfter} ⭐${move.stardustsAfter} 🔑${move.keysAfter || 0}`);
        });

        console.log("\n  📋 PATH SUMMARY:");
        console.log(`  ${result.path.map(m => m.direction[0]).join(" → ")}`);

        console.log("\n═══════════════════════════════════════════════════════════\n");
    }

    /**
     * Gets an emoji for the direction
     * @param {string} direction - The direction
     * @returns {string} The emoji
     */
    getDirectionEmoji(direction) {
        const emojis = {
            UP: "⬆️",
            DOWN: "⬇️",
            LEFT: "⬅️",
            RIGHT: "➡️"
        };
        return emojis[direction] || "•";
    }

    /**
     * Generates a visual ASCII map of the level with the optimal path
     * @param {Object} parsedLevel - The parsed level data
     * @param {Object} result - The pathfinding result
     */
    generateVisualMap(parsedLevel, result) {
        if (!result.valid) {
            console.log("[LEVEL AUDITOR] Cannot generate map for unsolvable level");
            return;
        }

        const { width, depth, spawn, stardusts, obstacles, spikes, hearts, locks, keys } = parsedLevel;

        // Create grid
        const grid = [];
        for (let z = depth - 1; z >= 0; z--) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push('·');
            }
            grid.push(row);
        }

        // Mark obstacles
        for (const obsKey of obstacles) {
            const [x, z] = obsKey.split(',').map(Number);
            const gridZ = depth - 1 - z;
            if (gridZ >= 0 && gridZ < depth && x >= 0 && x < width) {
                grid[gridZ][x] = '█';
            }
        }

        // Mark spikes
        for (const spikeKey of spikes) {
            const [x, z] = spikeKey.split(',').map(Number);
            const gridZ = depth - 1 - z;
            if (gridZ >= 0 && gridZ < depth && x >= 0 && x < width) {
                grid[gridZ][x] = '▲';
            }
        }

        // Mark hearts
        for (const heart of hearts) {
            const gridZ = depth - 1 - heart.z;
            if (gridZ >= 0 && gridZ < depth && heart.x >= 0 && heart.x < width) {
                grid[gridZ][heart.x] = '♥';
            }
        }

        // Mark stardusts
        for (const stardust of stardusts) {
            const gridZ = depth - 1 - stardust.z;
            if (gridZ >= 0 && gridZ < depth && stardust.x >= 0 && stardust.x < width) {
                grid[gridZ][stardust.x] = '★';
            }
        }

        // Mark locks
        for (const lockKey of locks) {
            const [x, z] = lockKey.split(',').map(Number);
            const gridZ = depth - 1 - z;
            if (gridZ >= 0 && gridZ < depth && x >= 0 && x < width) {
                grid[gridZ][x] = '🔒';
            }
        }

        // Mark keys
        for (const key of keys) {
            const gridZ = depth - 1 - key.z;
            if (gridZ >= 0 && gridZ < depth && key.x >= 0 && key.x < width) {
                grid[gridZ][key.x] = '🔑';
            }
        }

        // Mark spawn
        const spawnGridZ = depth - 1 - spawn.z;
        if (spawnGridZ >= 0 && spawnGridZ < depth && spawn.x >= 0 && spawn.x < width) {
            grid[spawnGridZ][spawn.x] = 'S';
        }

        console.log("\n[LEVEL AUDITOR] 🗺 LEVEL MAP:");
        console.log("  Legend: S=Spawn, ★=Stardust, █=Obstacle, ▲=Spike, ♥=Heart, 🔒=Lock, 🔑=Key, ·=Empty");
        console.log("");

        for (let z = 0; z < grid.length; z++) {
            console.log("  " + grid[z].join(' '));
        }
        console.log("");
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelAuditor;
}

console.log("[LEVEL AUDITOR] 🎯 LevelAuditor script fully loaded and exported");

