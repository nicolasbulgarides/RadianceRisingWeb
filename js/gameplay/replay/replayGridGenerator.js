/**
 * ReplayGridGenerator - Thin Instance Implementation
 * 
 * Uses thin instances for performance with complete isolation from main grid.
 * 
 * Key Design Points:
 * 1. Uses completely different tiles than main grid to avoid cache/reference conflicts
 * 2. Main grid uses: tile1, tile3
 * 3. Replay grid uses: tile2, tile5 (completely separate tiles)
 * 4. Loads base meshes at (0, 0, 0) - thin instance transforms are relative to this
 * 5. Base meshes remain visible (thin instances inherit visibility from base mesh)
 * 6. Adds thin instances at offset positions (e.g. x=100 for offscreen replay grid)
 * 7. Filters for renderable meshes only (must have material, skips __root__)
 * 
 * This ensures zero conflicts - separate tiles = separate meshes = separate thin instance buffers.
 */
class ReplayGridGenerator {
    constructor() {
        this.tileTypes = []; // Array of loaded tile objects (same structure as main grid's loadedTiles)
    }

    /**
     * Loads base tile meshes for thin instancing
     * 
     * IMPORTANT: Base meshes are loaded at (0, 0, 0) because thin instance transforms
     * are RELATIVE to the base mesh position. The base meshes remain visible (thin
     * instances inherit parent visibility), so there will be single base tiles at (0,0,0)
     * plus all the thin instances at the offset positions.
     * 
     * Uses B-variant tiles (tile1B, tile3B, tile4B, tile6B) which point to separate
     * .glb files (tile1CompressedB.glb, etc.) to ensure completely independent meshes
     * with their own thin instance buffers, fully isolated from the main grid.
     * 
     * @returns {Promise<boolean>} Success status
     */
    async loadBaseTiles() {
        console.log("[REPLAY GRID] Loading B-variant base tiles for thin instancing...");

        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"]
            .getSceneBuilderForScene("BaseGameScene");

        if (!sceneBuilder) {
            console.error("[REPLAY GRID] SceneBuilder not found");
            return false;
        }

        // Use completely different tiles than main grid to avoid ANY cache/reference conflicts
        // Main grid uses: tile1, tile3
        // Replay grid uses: tile2, tile5 (completely separate tiles)
        const tileIds = ["tile2", "tile5"];
        // CRITICAL: Load at (0,0,0) - thin instance transforms are RELATIVE to this position!
        const basePosition = new BABYLON.Vector3(0, 0, 0);

        this.tileTypes = [];
        const failedTiles = [];

        for (const tileId of tileIds) {
            console.log(`[REPLAY GRID] Attempting to load: ${tileId}...`);

            // Create positioned object at (0,0,0) - thin instances will be relative to this
            const positionedObject = PositionedObject.getPositionedObjectQuick(
                tileId,
                basePosition,
                1,
                false, // Don't freeze - we need to manipulate it
                false, // Not interactive
                false  // Don't clone - separate tiles already provide isolation
            );

            // Load the base tile
            const loadedModel = await sceneBuilder.loadModel(positionedObject);

            if (!loadedModel || !loadedModel.meshes || loadedModel.meshes.length === 0) {
                console.error(`[REPLAY GRID] ✗ Failed to load base tile: ${tileId}`);
                failedTiles.push(tileId);
                continue;
            }

            // Since we're using completely different tiles (tile2, tile5) that main grid never uses,
            // we can use them directly without cloning - no contamination risk!

            // Debug: Log mesh structure
            console.log(`[REPLAY GRID] ${tileId} loaded with ${loadedModel.meshes.length} mesh(es):`);
            loadedModel.meshes.forEach((m, i) => {
                console.log(`  [${i}] ${m.name} (${m.constructor.name}) - visible: ${m.isVisible}, material: ${m.material ? '✓' : '✗'}`);
            });

            // Check children
            const children = loadedModel.meshes[0]?.getChildren(undefined, false);
            console.log(`  Root has ${children ? children.length : 0} children`);

            // Store the loaded model directly
            this.tileTypes.push(loadedModel);

            console.log(`[REPLAY GRID] ✓ Stored tile type "${tileId}"`);
        }

        if (failedTiles.length > 0) {
            console.error(`[REPLAY GRID] Failed to load tiles: ${failedTiles.join(", ")}`);
        }

        if (this.tileTypes.length === 0) {
            console.error("[REPLAY GRID] No tile types loaded!");
            return false;
        }

        console.log(`[REPLAY GRID] ✓ Loaded ${this.tileTypes.length} B-variant tile types out of ${tileIds.length} requested`);

        if (this.tileTypes.length < tileIds.length) {
            console.warn(`[REPLAY GRID] ⚠️ Missing ${tileIds.length - this.tileTypes.length} tiles - this will cause gaps in the grid!`);
        }

        return true;
    }

    /**
     * Generates the replay grid with thin instances at the specified offset
     * @param {number} width - Grid width
     * @param {number} depth - Grid depth
     * @param {BABYLON.Vector3} offset - Position offset for the entire grid
     * @returns {Promise<boolean>} Success status
     */
    async generateGrid(width, depth, offset) {
        console.log(`[REPLAY GRID] Generating ${width}x${depth} grid at offset (${offset.x}, ${offset.y}, ${offset.z})`);

        // Validate dimensions
        if (!width || !depth || width < 1 || depth < 1) {
            console.error(`[REPLAY GRID] Invalid grid dimensions: ${width}x${depth}`);
            return false;
        }

        // Load base tiles if not already loaded
        if (this.tileTypes.length === 0) {
            const loaded = await this.loadBaseTiles();
            if (!loaded) {
                console.error("[REPLAY GRID] Failed to load base tiles");
                return false;
            }
        }

        const tileSize = 1;
        const numTileTypes = this.tileTypes.length;
        let totalInstances = 0;
        let skippedPositions = 0;

        console.log(`[REPLAY GRID] Starting grid generation with ${numTileTypes} tile types`);

        // MATCH MAIN GRID: Iterate over every grid cell position
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                // MATCH MAIN GRID: Use same pattern to vary tile selection
                const rowOffset = x % numTileTypes;
                const tileTypeIndex = (z + rowOffset) % numTileTypes;
                const baseTile = this.tileTypes[tileTypeIndex];

                // MATCH MAIN GRID: Ensure the base tile has meshes
                if (!baseTile || !baseTile.meshes || baseTile.meshes.length === 0) {
                    console.warn(`[REPLAY GRID] Missing or invalid tile at index ${tileTypeIndex} for position (${x}, ${z})`);
                    skippedPositions++;
                    continue;
                }

                // Get child meshes only - skip the root container
                let targetMeshes = baseTile.meshes[0].getChildren(undefined, false);
                if (!targetMeshes || targetMeshes.length === 0) {
                    targetMeshes = baseTile.meshes;
                }

                // CRITICAL: Filter to only meshes with materials (skip root containers)
                targetMeshes = targetMeshes.filter(m => m instanceof BABYLON.Mesh && m.material);

                // Debug first position
                if (x === 0 && z === 0) {
                    console.log(`[REPLAY GRID] First position (0,0) using tileIndex=${tileTypeIndex}, found ${targetMeshes.length} renderable meshes (with materials)`);
                }

                // Calculate world position with offset (same as main grid)
                const xPos = (x * tileSize) + offset.x;
                const yPos = offset.y;
                const zPos = ((depth - 1 - z) * tileSize) + offset.z; // flip Z like main grid

                // MATCH MAIN GRID: Instance each mesh at the correct grid position
                for (const mesh of targetMeshes) {
                    if (mesh instanceof BABYLON.Mesh) {
                        // MATCH MAIN GRID: Unfreeze if frozen
                        if (mesh.isFrozen) {
                            mesh.unfreezeWorldMatrix();
                        }

                        // MATCH MAIN GRID: Enable thin instance picking if no thin instances yet
                        if (!mesh.hasThinInstances) {
                            mesh.thinInstanceEnablePicking = false;
                        }

                        const matrix = BABYLON.Matrix.Translation(xPos, yPos, zPos);

                        // Debug first few instances
                        if (totalInstances < 5) {
                            console.log(`[REPLAY GRID] Adding instance #${totalInstances} to mesh "${mesh.name}" at (${xPos}, ${yPos}, ${zPos})`);
                        }

                        try {
                            mesh.thinInstanceAdd(matrix);
                            totalInstances++;
                        } catch (error) {
                            console.error(`[REPLAY GRID] Error adding thin instance to ${mesh.name} at (${xPos}, ${yPos}, ${zPos}):`, error);
                        }
                    }
                }
            }
        }

        console.log(`[REPLAY GRID] ✓ Generated ${totalInstances} thin instances for ${width * depth} grid cells`);

        if (skippedPositions > 0) {
            console.warn(`[REPLAY GRID] ⚠️ Skipped ${skippedPositions} positions due to missing tiles`);
        }

        return totalInstances > 0;
    }

    /**
     * Clears all thin instances from replay grid
     */
    clearThinInstances() {
        if (this.tileTypes.length === 0) {
            return;
        }

        console.log("[REPLAY GRID] Clearing thin instances...");

        for (const baseTile of this.tileTypes) {
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
     * Disposes all base tiles and cleans up resources
     */
    dispose() {
        if (this.tileTypes.length === 0) {
            return;
        }

        console.log(`[REPLAY GRID] Disposing replay grid...`);

        // Clear thin instances first
        this.clearThinInstances();

        // Dispose each tile's meshes
        for (const baseTile of this.tileTypes) {
            if (baseTile && baseTile.meshes) {
                for (const mesh of baseTile.meshes) {
                    try {
                        mesh.dispose(false, false); // Don't dispose materials (shared)
                    } catch (error) {
                        // Ignore disposal errors
                    }
                }
            }
        }

        this.tileTypes = [];
        console.log("[REPLAY GRID] ✓ Replay grid disposed");
    }
}


