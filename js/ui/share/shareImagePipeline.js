/**
 * ShareImagePipeline
 *
 * Orchestrates the four stages of share image generation.
 * Stores completion data at level finish and drives the pipeline on demand.
 *
 * Exposed as window.ShareImagePipeline.
 *
 * Key design:
 *   - Stage 1 canvas is cached per level (RTT/capture is expensive; only done once)
 *   - Stages 2+3 run on every slider change (fast Canvas 2D ops)
 *   - Pipeline is fully async
 *
 * Integration point (called by pickupOccurrenceSubManager at 4th lotus):
 *   ShareImagePipeline.recordLevelCompletion(levelId, activeLevel, movementTracker, heartsRemaining)
 */

class ShareImagePipeline {

    // Data saved at level completion time
    static _pendingCompletionData = null;

    // Cached Stage-1 canvas (reused across slider changes)
    static _cachedBaseCanvas = null;
    static _cachedBaseGridMapping = null;

    // Pipeline stage references (swappable)
    static stages = {
        capture:     null,  // set after window load
        path:        null,
        overlay:     null,
        output:      null,
        eligibility: null,
    };

    // ── Public API ──────────────────────────────────────────────────────────

    /**
     * Saves level completion data immediately at the 4th lotus pickup.
     * Called from pickupOccurrenceSubManager BEFORE the replay starts.
     *
     * @param {string}           levelId
     * @param {ActiveGameplayLevel} activeLevel
     * @param {MovementTracker}  movementTracker
     * @param {number}           heartsRemaining — hearts at moment of completion
     */
    static recordLevelCompletion(levelId, activeLevel, movementTracker, heartsRemaining) {
        try {
            // Grid dimensions
            const dims = activeLevel?.getGridDimensions?.() || { width: 11, depth: 21 };
            const startPos = activeLevel?.getPlayerStartPosition?.() || { x: 5, y: 0, z: 10 };

            // Obstacle positions
            const obstacles = (activeLevel?.getObstacles?.() || []).map(obs => ({
                obstacleArchetype: obs.obstacleArchetype || "default",
                position: obs.position
                    ? { x: obs.position.x, z: obs.position.z }
                    : (obs.positionedObject?.position
                        ? { x: obs.positionedObject.position.x, z: obs.positionedObject.position.z }
                        : null)
            })).filter(o => o.position);

            // Collectible (lotus) positions — from microEventManager
            const collectibles = [];
            const mem = FundamentalSystemBridge["microEventManager"];
            if (mem) {
                const events = mem.getMicroEventsByLevelId?.(levelId) || [];
                for (const e of events) {
                    if (e.microEventCategory === "pickup" && e.microEventLocation) {
                        collectibles.push({
                            type:     e.microEventValue || "stardust",
                            position: { x: e.microEventLocation.x, z: e.microEventLocation.z },
                        });
                    }
                }
            }

            // Move path: copy event log entries that are type='move'
            const movePath = (movementTracker?.eventLog || [])
                .filter(e => e.type === "move")
                .map(e => ({
                    type:                "move",
                    direction:            e.direction,
                    startPosition:       { x: e.startPosition.x,       z: e.startPosition.z },
                    destinationPosition: { x: e.destinationPosition.x, z: e.destinationPosition.z },
                }));

            const totalMoves   = movePath.length;
            const optimalMoves = LevelProfileManifest.getPerfectSolutionMovementCount(levelId);

            // Star / constellation info
            let starName = levelId, constellationName = null;
            try {
                if (typeof ConstellationStarToLevelManifest !== "undefined") {
                    const si = ConstellationStarToLevelManifest.getStarInfoByLevelId(levelId);
                    if (si) {
                        starName         = si.starName;
                        constellationName = ConstellationStarToLevelManifest.formatConstellationName(si.constellationId);
                    }
                }
            } catch (_) {}

            // Hint usage: check HintSystem per-level tier map
            let hintsUsedForLevel = false;
            try {
                hintsUsedForLevel = !!(window.HintSystem?._hintTierByLevel?.[levelId]);
            } catch (_) {}

            ShareImagePipeline._pendingCompletionData = {
                levelId,
                gridWidth:         dims.width,
                gridDepth:         dims.depth,
                playerStartPos:    { x: startPos.x, z: startPos.z },
                obstacles,
                collectibles,
                movePath,
                totalMoves,
                optimalMoves,
                starName,
                constellationName,
                heartsRemaining,
                hintsUsedForLevel,
                timestamp:         Date.now(),
            };

            // Invalidate cached capture so fresh data is used
            ShareImagePipeline._cachedBaseCanvas     = null;
            ShareImagePipeline._cachedBaseGridMapping = null;

            window.dispatchEvent(new CustomEvent("radianceLevelCompleted", {
                detail: ShareImagePipeline._pendingCompletionData
            }));

        } catch (err) {
            console.warn("[ShareImagePipeline] recordLevelCompletion error:", err);
        }
    }

    /**
     * Main pipeline entry point.
     * @param {Object|null} completionData — if null, uses _pendingCompletionData
     * @param {number|null} movesToShow    — how many moves to reveal; null = full
     * @returns {Promise<{ canvas, blob, eligible, reason, movesRevealed, totalMoves }>}
     */
    static async generate(completionData, movesToShow) {
        const data = completionData || ShareImagePipeline._pendingCompletionData;
        if (!data) {
            return { eligible: false, reason: "No completion data", canvas: null, blob: null };
        }

        // Eligibility check
        const elig = ShareImagePipeline.stages.eligibility.canShare(data);
        if (!elig.eligible) {
            return { eligible: false, reason: elig.reason, canvas: null, blob: null };
        }

        const totalMoves = data.totalMoves || data.movePath?.length || 0;
        const n = (movesToShow == null)
            ? totalMoves
            : Math.max(1, Math.min(movesToShow, totalMoves));
        const isPartial = n < totalMoves;

        // Stage 1: capture (cached)
        let baseCanvas, gridMapping;
        if (ShareImagePipeline._cachedBaseCanvas) {
            baseCanvas  = ShareImagePipeline._cachedBaseCanvas;
            gridMapping = ShareImagePipeline._cachedBaseGridMapping;
        } else {
            const captured = ShareImagePipeline.stages.capture.capture(data);
            baseCanvas  = captured.canvas;
            gridMapping = captured.gridMapping;
            ShareImagePipeline._cachedBaseCanvas     = baseCanvas;
            ShareImagePipeline._cachedBaseGridMapping = gridMapping;
        }

        // Clone base canvas for Stage 2+3 (we never mutate the cached one)
        const workCanvas = ShareImagePipeline._cloneCanvas(baseCanvas);

        // Stage 2: path drawing
        ShareImagePipeline.stages.path.drawPath(workCanvas, data.movePath, gridMapping, n);

        // Stage 3: overlay
        const metadata = {
            starName:         data.starName,
            constellationName: data.constellationName,
            moveCount:        totalMoves,
            optimalMoves:     data.optimalMoves,
            heartsRemaining:  data.heartsRemaining,
            movesRevealed:    n,
            totalMoves,
            isPartialReveal:  isPartial,
        };
        const finalCanvas = ShareImagePipeline.stages.overlay.applyOverlay(workCanvas, metadata);

        // Stage 4: blob
        const blob = await ShareImagePipeline.stages.output.toBlob(finalCanvas);

        return { canvas: finalCanvas, blob, eligible: true, reason: "", movesRevealed: n, totalMoves };
    }

    /**
     * Clears the cached Stage-1 canvas.
     * Call when the share panel is closed to free memory.
     */
    static clearCache() {
        ShareImagePipeline._cachedBaseCanvas     = null;
        ShareImagePipeline._cachedBaseGridMapping = null;
    }

    // ── Debug helpers ────────────────────────────────────────────────────────

    static debug = {
        forceGenerate: () =>
            ShareImagePipeline.generate(null, null),

        forceGeneratePartial: (movesToShow) =>
            ShareImagePipeline.generate(null, movesToShow),

        testClipboard: async () => {
            const result = await ShareImagePipeline.generate(null, null);
            if (!result.eligible) { console.warn("[Share debug] Not eligible:", result.reason); return false; }
            return ShareOutputHandler.toClipboard(result.canvas);
        },

        preview: async () => {
            const result = await ShareImagePipeline.generate(null, null);
            if (!result.eligible) { console.warn("[Share debug] Not eligible:", result.reason); return; }
            window.open(ShareOutputHandler.toDataURL(result.canvas));
        },

        previewPartial: async (movesToShow) => {
            const result = await ShareImagePipeline.generate(null, movesToShow);
            if (!result.eligible) { console.warn("[Share debug] Not eligible:", result.reason); return; }
            window.open(ShareOutputHandler.toDataURL(result.canvas));
        },

        testCapture: () => {
            const data = ShareImagePipeline._pendingCompletionData;
            if (!data) { console.warn("[Share debug] No completion data"); return null; }
            return ShareCaptureProvider.capture(data);
        },

        testPath: async () => {
            const data = ShareImagePipeline._pendingCompletionData;
            if (!data) { console.warn("[Share debug] No completion data"); return null; }
            const { canvas, gridMapping } = ShareCaptureProvider.capture(data);
            SharePathRenderer.drawPath(canvas, data.movePath, gridMapping, data.totalMoves);
            return canvas;
        },

        previewAllPartials: async () => {
            const data = ShareImagePipeline._pendingCompletionData;
            if (!data) { console.warn("[Share debug] No completion data"); return; }
            for (let m = 1; m <= data.totalMoves; m++) {
                const result = await ShareImagePipeline.generate(data, m);
                if (result.eligible) {
                    console.log(`[Share debug] Partial ${m}/${data.totalMoves}:`, ShareOutputHandler.toDataURL(result.canvas));
                }
            }
        },

        showConfig: () => {
            console.log("[ShareCaptureProvider.config]",   ShareCaptureProvider.config);
            console.log("[SharePathRenderer.config]",      SharePathRenderer.config);
            console.log("[ShareOverlayRenderer.config]",   ShareOverlayRenderer.config);
            console.log("[ShareOutputHandler.config]",     ShareOutputHandler.config);
        },
    };

    // ── Private helpers ──────────────────────────────────────────────────────

    static _cloneCanvas(src) {
        const dst = document.createElement("canvas");
        dst.width  = src.width;
        dst.height = src.height;
        dst.getContext("2d").drawImage(src, 0, 0);
        return dst;
    }
}

// Wire up stage references after all scripts are loaded
window.addEventListener("load", () => {
    ShareImagePipeline.stages.capture     = window.ShareCaptureProvider;
    ShareImagePipeline.stages.path        = window.SharePathRenderer;
    ShareImagePipeline.stages.overlay     = window.ShareOverlayRenderer;
    ShareImagePipeline.stages.output      = window.ShareOutputHandler;
    ShareImagePipeline.stages.eligibility = window.ShareEligibility;
});

window.ShareImagePipeline = ShareImagePipeline;
