/**
 * ReplayGridGenerator
 * 
 * A completely separate grid generator for the replay system.
 * Uses dedicated "B" variant tile assets (tile1B, tile3B, etc.) to ensure
 * complete isolation from the main gameplay grid's thin instances.
 * 
 * This class mirrors GameGridGenerator's structure exactly - the only difference
 * is using the B-suffix tile assets instead of the main tile assets.
 */
class ReplayGridGenerator {
    constructor() {
        // MATCH MAIN GRID: Simple array to store loaded tiles directly
        this.loadedTiles = [];
    }

    /**
     * Gets the replay grid tile IDs (B-suffix variants of main grid tiles)
     * @returns {Array<string>} Array of tile IDs for replay grid
     */
    static getReplayTileIds() {
        // Use B-suffix variants of the same tiles as main grid
        // Main grid uses: ["tile1", "tile3", "tile4", "tile6"]
        // Replay uses:    ["tile1B", "tile3B", "tile4B", "tile6B"]
        return ["tile1B", "tile3B", "tile4B", "tile6B"];
    }

    /**
     * Loads tile models for the replay grid.
     * Mirrors GameGridGenerator.loadTilesModels() exactly, using B-suffix tile assets.
     * @param {BABYLON.Scene} scene - The scene to load into (unused, kept for API compatibility)
     * @returns {Promise<boolean>} Success status
     */
    async loadTiles(scene) {
        console.log("[REPLAY GRID] Loading B-variant tiles for replay grid...");

        // Get the scene builder - MATCH MAIN GRID
        const relevantSceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");

        if (!relevantSceneBuilder) {
            console.error("[REPLAY GRID] SceneBuilder not found");
            return false;
        }

        // Get replay tile IDs (B-suffix variants)
        const tileIds = ReplayGridGenerator.getReplayTileIds();
        const tileSize = 1;

        // Use a zero vector position - MATCH MAIN GRID (line 52)
        const position = new BABYLON.Vector3(0, 0, 0);

        // Clear any existing tiles
        this.loadedTiles = [];

        // MATCH MAIN GRID: Load tiles sequentially
        for (const tileId of tileIds) {
            // Generate the configuration for a positioned tile - MATCH MAIN GRID (lines 57-64)
            const positionedObject = PositionedObject.getPositionedObjectQuick(
                tileId,
                position,
                tileSize,
                true, // freeze position during loading - MATCH MAIN GRID
                false, // not interactive - MATCH MAIN GRID
                true // clone the base model for instancing if needed - MATCH MAIN GRID
            );

            // Load tile - using normal cache since these are separate assets
            const baseTile = await relevantSceneBuilder.loadModel(positionedObject);

            if (baseTile) {
                // MATCH MAIN GRID: Store the raw loaded tile directly (line 70)
                this.loadedTiles.push(baseTile);
                console.log(`[REPLAY GRID] ✓ Loaded tile "${tileId}"`);
            } else {
                console.error(`[REPLAY GRID] Failed to load tile "${tileId}"`);
            }
        }

        // MATCH MAIN GRID: Check if all tiles loaded (lines 81-86)
        if (this.loadedTiles.length < tileIds.length) {
            console.error(`[REPLAY GRID] Only loaded ${this.loadedTiles.length} out of ${tileIds.length} tiles.`);
            return false;
        }

        console.log(`[REPLAY GRID] ✓ Loaded ${this.loadedTiles.length} B-variant tiles successfully`);
        return true;
    }

    /**
     * Generates the replay grid using thin instances at the specified offset.
     * Mirrors GameGridGenerator.generateGridWithOffset() exactly.
     * @param {number} width - Grid width
     * @param {number} depth - Grid depth
     * @param {BABYLON.Vector3} offset - Position offset for the entire grid
     * @param {number} tileSize - Size of each tile
     * @returns {Promise<boolean>} Success status
     */
    async generateGrid(width, depth, offset, tileSize = 1) {
        // MATCH MAIN GRID: Validate input dimensions (lines 169-174)
        if (!width || !depth || width < 1 || depth < 1) {
            console.error(`[REPLAY GRID] Invalid grid dimensions: ${width}x${depth}`);
            return false;
        }

        // MATCH MAIN GRID: Ensure tiles are loaded (lines 176-182)
        if (this.loadedTiles.length === 0) {
            console.error("[REPLAY GRID] No tiles loaded. Call loadTiles first.");
            return false;
        }

        console.log(`[REPLAY GRID] Generating ${width}x${depth} grid at offset (${offset.x}, ${offset.y}, ${offset.z})`);

        let instancesCreated = 0;

        // MATCH MAIN GRID: Iterate over every grid cell position (lines 185-186)
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                // MATCH MAIN GRID: Use a pattern to vary the tile selection (lines 188-190)
                const rowOffset = x % this.loadedTiles.length;
                const tileIndex = (z + rowOffset) % this.loadedTiles.length;
                const baseTile = this.loadedTiles[tileIndex];

                // MATCH MAIN GRID: Ensure the base tile has meshes (lines 193-198)
                if (!baseTile || !baseTile.meshes || baseTile.meshes.length === 0) {
                    console.warn(`[REPLAY GRID] Missing or invalid tile at index ${tileIndex}`);
                    continue;
                }

                // MATCH MAIN GRID: Prefer child meshes, fall back to all meshes if none (lines 201-203)
                let targetMeshes = baseTile.meshes[0].getChildren(undefined, false);
                if (!targetMeshes || targetMeshes.length === 0) {
                    targetMeshes = baseTile.meshes;
                }

                // MATCH MAIN GRID: Instance each mesh at the correct grid position (lines 207-225)
                for (const mesh of targetMeshes) {
                    if (mesh instanceof BABYLON.Mesh) {
                        // MATCH MAIN GRID: Unfreeze if frozen (lines 209-210)
                        if (mesh.isFrozen) {
                            mesh.unfreezeWorldMatrix();
                        }

                        // MATCH MAIN GRID: Enable thin instance picking if no thin instances yet (lines 212-213)
                        if (!mesh.hasThinInstances) {
                            mesh.thinInstanceEnablePicking = true;
                        }

                        // MATCH MAIN GRID: Calculate position with offset (lines 216-218)
                        const xPos = (x * tileSize) + offset.x;
                        const yPos = offset.y;
                        const zPos = ((depth - 1 - z) * tileSize) + offset.z;

                        // MATCH MAIN GRID: Create translation matrix (line 219)
                        const matrix = BABYLON.Matrix.Translation(xPos, yPos, zPos);

                        // MATCH MAIN GRID: Add thin instance (lines 220-224)
                        try {
                            mesh.thinInstanceAdd(matrix);
                            instancesCreated++;
                        } catch (error) {
                            console.error(`[REPLAY GRID] Error adding thin instance to mesh ${mesh.name}:`, error);
                        }
                    }
                }
            }
        }

        console.log(`[REPLAY GRID] ✓ Generated ${instancesCreated} thin instances for ${width * depth} cells`);
        return true;
    }

    /**
     * Clears all thin instances from the replay grid tiles
     */
    clearThinInstances() {
        console.log("[REPLAY GRID] Clearing thin instances...");

        for (const baseTile of this.loadedTiles) {
            if (!baseTile || !baseTile.meshes) continue;

            // Get target meshes same way as generateGrid
            let targetMeshes = baseTile.meshes[0]?.getChildren(undefined, false);
            if (!targetMeshes || targetMeshes.length === 0) {
                targetMeshes = baseTile.meshes;
            }

            for (const mesh of targetMeshes) {
                if (mesh instanceof BABYLON.Mesh && mesh.thinInstanceCount > 0) {
                    try {
                        mesh.thinInstanceSetBuffer("matrix", null, 16, true);
                        mesh.thinInstanceCount = 0;
                    } catch (error) {
                        console.warn(`[REPLAY GRID] Error clearing thin instances:`, error);
                    }
                }
            }
        }

        console.log("[REPLAY GRID] ✓ Thin instances cleared");
    }

    /**
     * Disposes all tiles and cleans up resources
     */
    dispose() {
        console.log("[REPLAY GRID] Disposing all tiles...");

        // First clear thin instances
        this.clearThinInstances();

        // Dispose meshes
        for (const baseTile of this.loadedTiles) {
            if (baseTile && baseTile.meshes) {
                for (const mesh of baseTile.meshes) {
                    if (mesh && mesh.dispose) {
                        try {
                            mesh.dispose(false, false); // Don't dispose materials (shared)
                        } catch (error) {
                            // Ignore disposal errors
                        }
                    }
                }
            }
        }

        this.loadedTiles = [];
        console.log("[REPLAY GRID] ✓ All tiles disposed");
    }
}


