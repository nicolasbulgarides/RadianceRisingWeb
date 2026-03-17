/**
 * SolvabilityDetector
 *
 * Runs a BFS on the current game state after every player move to determine
 * whether the level is still solvable from the current position. Shows an
 * "unsolvable" panel if it detects a dead-end.
 *
 * Win condition: collect all STAR_DUST tiles while health > 0.
 * There is no exit tile — stardust collection IS the win condition.
 *
 * Console API:
 *   SolvabilityDetector.analyze()          — BFS on current live state, logs result
 *   SolvabilityDetector.testLevel(id)      — BFS from initial state of a level
 *   SolvabilityDetector.testAllLevels()    — tests every level in the manifest
 *   SolvabilityDetector.benchmark()        — 20-run avg ms for current level
 *   SolvabilityDetector.getStateCount()    — statesExplored from last result
 *   SolvabilityDetector.lastResult         — full result object from last BFS
 */

// PORTAL_HOOK — onLand: redirect sphere to paired exit tile, update sphere position in state
// Requires: portal tile stores pairedTileId. State needs no new fields, just position change.

// SPEEDBOOST_HOOK — onPass: mark state.boosted = true, sphere does not stop on next wall
// Requires: state.boosted boolean field added to serialization

// BREAKABLE_HOOK — onLand/onPass: if state.boosted, add tile coords to state.brokenBlocks
// brokenBlocks must be included in state serialization and isObstacle() check

// KEY_LOCK_BRANCH — keys are currently auto-consumed (no player choice, no branching needed).
// If a future mechanic requires explicit player choice at a lock, add two branches here:
//   Branch A: consume key → open lock → continue slide
//   Branch B: keep key   → treat lock as wall → stop before it
// This would be O(2^n) for n locks with matching keys. Monitor statesExplored on complex levels.

class SolvabilityDetector {

    // ── Config ─────────────────────────────────────────────────────────────────

    static HARD_CAP           = 50000;   // max BFS states before returning "unknown"
    static SHOW_PANEL_DELAY   = 800;     // ms delay before showing unsolvable panel
    static PANEL_AUTODISMISS  = 8000;    // ms before panel auto-dismisses

    // ── State ──────────────────────────────────────────────────────────────────

    static lastResult    = null;
    static _analysisId   = 0;    // incremented to cancel stale callbacks
    static _workerRef    = null; // active Worker, terminated on new analysis
    static _pendingPanel = null; // setTimeout ID for panel show delay
    static _activePanel  = null; // active Babylon GUI container

    // ── Initialization ─────────────────────────────────────────────────────────

    static init() {
        // Hook: after every slide animation completes
        GameEventBus.on("movementComplete", () => {
            SolvabilityDetector.analyzeCurrentState();
        });

        // Hook: after undo (small delay so position settles)
        window.addEventListener("radianceUndoStackChanged", () => {
            setTimeout(() => SolvabilityDetector.analyzeCurrentState(), 50);
        });

        // Hook: after level loads
        window.addEventListener("radianceLevelLoaded", () => {
            SolvabilityDetector.analyzeCurrentState();
        });
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    /** Analyze the live game state. Called automatically after every move. */
    static analyzeCurrentState() {
        const levelData = SolvabilityDetector._getCurrentLevelData();
        if (!levelData) return;
        const parsedLevel = SolvabilityDetector._parseLevelForCurrentState(levelData);
        if (!parsedLevel) return;
        SolvabilityDetector._runAnalysis(parsedLevel, false);
    }

    /** Dev console: BFS on current live state, returns and logs result. */
    static analyze() {
        const levelData = SolvabilityDetector._getCurrentLevelData();
        if (!levelData) {
            console.warn("[SolvabilityDetector] analyze(): no level data in cache — play a level first");
            return null;
        }
        const parsedLevel = SolvabilityDetector._parseLevelForCurrentState(levelData);
        if (!parsedLevel) return null;
        const result = SolvabilityDetector._runBFS(parsedLevel);
        console.log("[SolvabilityDetector] analyze():", result);
        SolvabilityDetector.lastResult = result;
        return result;
    }

    /** Dev console: number of states explored in the last BFS. */
    static getStateCount() {
        return SolvabilityDetector.lastResult?.statesExplored ?? 0;
    }

    /** Dev console: avg BFS time over 20 runs on the current live state. */
    static benchmark() {
        const levelData = SolvabilityDetector._getCurrentLevelData();
        if (!levelData) {
            console.warn("[SolvabilityDetector] benchmark(): no level data");
            return;
        }
        const parsedLevel = SolvabilityDetector._parseLevelForCurrentState(levelData);
        if (!parsedLevel) return;
        const times = [];
        for (let i = 0; i < 20; i++) {
            const t = performance.now();
            SolvabilityDetector._runBFS(parsedLevel);
            times.push(performance.now() - t);
        }
        const avg = times.reduce((a, b) => a + b) / times.length;
        console.log(`[SolvabilityDetector] benchmark: avg ${avg.toFixed(2)}ms over 20 runs`);
        return avg;
    }

    /** Dev console: test a level from its initial state (full health, nothing collected). */
    static testLevel(levelId) {
        const cached = LevelProfileManifest._levelCache.get(levelId);
        const run = (data) => {
            const parsedLevel = SolvabilityDetector._parseLevelFromData(data);
            parsedLevel.startingHealth = 4;
            parsedLevel.startingKeys   = 0;
            parsedLevel.startingLockMask = 0;
            const result = SolvabilityDetector._runBFS(parsedLevel);
            console.log(`[SolvabilityDetector] testLevel(${levelId}):`, {
                solvable:       result.solvable,
                statesExplored: result.statesExplored,
                minStrokes:     result.minStrokes,
            });
            return result;
        };
        if (cached) return run(cached);
        return LevelProfileManifest.fetchLevelById(levelId).then(run);
    }

    /** Dev console: test all levels in the manifest from initial state. */
    static async testAllLevels() {
        const profiles = LevelProfileManifest.levelProfiles;
        const results  = {};
        let failCount  = 0;
        for (const id of Object.keys(profiles)) {
            try {
                const data = await LevelProfileManifest.fetchLevelById(id);
                const parsedLevel = SolvabilityDetector._parseLevelFromData(data);
                parsedLevel.startingHealth   = 4;
                parsedLevel.startingKeys     = 0;
                parsedLevel.startingLockMask = 0;
                const result = SolvabilityDetector._runBFS(parsedLevel);
                results[id] = result;
                if (result.solvable === false) {
                    console.warn(`[SolvabilityDetector] UNSOLVABLE LEVEL: ${id}`);
                    failCount++;
                }
            } catch (err) {
                console.error(`[SolvabilityDetector] Error testing ${id}:`, err);
                results[id] = { solvable: "error", error: err.message };
            }
        }
        console.log(
            `[SolvabilityDetector] testAllLevels complete. ${failCount} unsolvable levels found.`
        );
        return results;
    }

    // ── Level Data Helpers ─────────────────────────────────────────────────────

    static _getCurrentLevelData() {
        try {
            const gm    = FundamentalSystemBridge["gameplayManagerComposite"];
            const level = gm?.primaryActiveGameplayLevel;
            const id    = level?.levelDataComposite?.levelHeaderData?.levelId;
            if (!id) return null;
            return LevelProfileManifest._levelCache.get(id) || null;
        } catch (e) { return null; }
    }

    static _getCurrentLevelId() {
        try {
            const gm = FundamentalSystemBridge["gameplayManagerComposite"];
            return gm?.primaryActiveGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId ?? null;
        } catch (e) { return null; }
    }

    // ── Level Parsing ──────────────────────────────────────────────────────────

    /**
     * Parses raw level JSON into the BFS data structure, starting from full initial state.
     * Call _applyCollectedItems separately to adjust for mid-game state.
     */
    static _parseLevelFromData(levelData) {
        const width = levelData.mapWidth  || 21;
        const depth = levelData.mapHeight || levelData.mapDepth || 21;
        // Builder-space to world-space: world.x = bx, world.z = depth - 1 - by
        const bw = (c) => ({ x: c.x, z: (depth - 1 - c.y) });

        const els = levelData.allMapElements || [];

        const spawnEl = els.find(e => e.element === "SPAWN_POSITION");
        const spawn   = spawnEl ? bw(spawnEl.coordinates) : { x: 10, z: 10 };

        const stardusts = els
            .filter(e => e.element === "STAR_DUST")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        const obstacles = new Set();
        els.filter(e => e.element === "MOUNTAIN").forEach(e => {
            const w = bw(e.coordinates); obstacles.add(`${w.x},${w.z}`);
        });

        const locks = els
            .filter(e => e.element === "LOCK")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        const spikes = new Set();
        els.filter(e => e.element === "SPIKE_TRAP").forEach(e => {
            const w = bw(e.coordinates); spikes.add(`${w.x},${w.z}`);
        });

        const hearts = els
            .filter(e => e.element === "HEART")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        const keys = els
            .filter(e => e.element === "KEY")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        return {
            width, depth, spawn,
            stardusts, obstacles, locks, spikes, hearts, keys,
            startingHealth:   4,
            startingKeys:     0,
            startingLockMask: 0,
        };
    }

    /**
     * Parses level data and adjusts for the current live game state:
     * current player position, current health, already-collected items.
     */
    static _parseLevelForCurrentState(levelData) {
        try {
            const parsed = SolvabilityDetector._parseLevelFromData(levelData);

            // Override spawn with current player position
            const player = FundamentalSystemBridge["gameplayManagerComposite"]?.primaryActivePlayer;
            if (player?.playerMovementManager?.currentPosition) {
                const pos = player.playerMovementManager.currentPosition;
                parsed.spawn = { x: Math.round(pos.x), z: Math.round(pos.z) };
            }

            // Override health with current health
            const tracker = FundamentalSystemBridge["playerStatusTracker"];
            if (tracker && typeof tracker.getCurrentHealth === "function") {
                parsed.startingHealth = tracker.getCurrentHealth();
            }

            // Remove already-collected items and account for keys held/locks opened
            const levelId = SolvabilityDetector._getCurrentLevelId();
            if (levelId) SolvabilityDetector._applyCollectedItems(parsed, levelId);

            return parsed;
        } catch (e) {
            console.error("[SolvabilityDetector] _parseLevelForCurrentState error:", e);
            return null;
        }
    }

    /**
     * Removes already-collected stardusts, hearts, and keys from parsed level.
     * Sets startingKeys to reflect keys currently held.
     * Sets startingLockMask to reflect locks already opened.
     */
    static _applyCollectedItems(parsed, levelId) {
        try {
            const mem = FundamentalSystemBridge["microEventManager"];

            if (mem) {
                const events = mem.getMicroEventsByLevelId(levelId) || [];

                // ── Stardusts ──────────────────────────────────────────────────
                const collectedSD = new Set();
                events.forEach(ev => {
                    if (ev.microEventCategory === "pickup" &&
                        (ev.microEventValue === "stardust" || ev.microEventNickname?.includes("Stardust")) &&
                        ev.hasBeenTriggered) {
                        const p = ev.position || ev.triggerPosition;
                        if (p) collectedSD.add(`${Math.round(p.x)},${Math.round(p.z)}`);
                    }
                });
                parsed.stardusts = parsed.stardusts.filter(
                    s => !collectedSD.has(`${s.x},${s.z}`)
                );
                parsed.stardusts.forEach((s, i) => { s.id = i; });

                // ── Hearts ─────────────────────────────────────────────────────
                const collectedH = new Set();
                events.forEach(ev => {
                    if (ev.microEventCategory === "pickup" &&
                        ev.microEventValue === "heart" &&
                        ev.hasBeenTriggered) {
                        const p = ev.position || ev.triggerPosition;
                        if (p) collectedH.add(`${Math.round(p.x)},${Math.round(p.z)}`);
                    }
                });
                parsed.hearts = parsed.hearts.filter(
                    h => !collectedH.has(`${h.x},${h.z}`)
                );
                parsed.hearts.forEach((h, i) => { h.id = i; });

                // ── Keys ───────────────────────────────────────────────────────
                const collectedKPos = new Set();
                let keysPickedUp = 0;
                events.forEach(ev => {
                    if (ev.microEventCategory === "pickup" &&
                        ev.microEventValue === "key" &&
                        ev.hasBeenTriggered) {
                        const p = ev.position || ev.triggerPosition;
                        if (p) collectedKPos.add(`${Math.round(p.x)},${Math.round(p.z)}`);
                        keysPickedUp++;
                    }
                });
                // Remove picked-up keys from the board
                parsed.keys = parsed.keys.filter(k => !collectedKPos.has(`${k.x},${k.z}`));
                parsed.keys.forEach((k, i) => { k.id = i; });

                // ── Locks (opened = passthroughAllowed on live obstacle) ───────
                const gm = FundamentalSystemBridge["gameplayManagerComposite"];
                const activeLevel = gm?.primaryActiveGameplayLevel;
                let keysConsumed = 0;
                let openedLockMask = 0;

                if (activeLevel) {
                    const seen = new Set();
                    const allObs = [
                        ...(activeLevel.levelDataComposite?.obstacles || []),
                        ...(activeLevel.levelMap?.obstacles || []),
                    ];
                    allObs.forEach(obs => {
                        if (!obs || seen.has(obs.nickname)) return;
                        seen.add(obs.nickname);
                        if (obs.obstacleArchetype === "lock" && obs.passthroughAllowed) {
                            keysConsumed++;
                            const p = obs.position;
                            if (p) {
                                const idx = parsed.locks.findIndex(
                                    l => l.x === Math.round(p.x) && l.z === Math.round(p.z)
                                );
                                if (idx >= 0) openedLockMask |= (1 << idx);
                            }
                        }
                    });
                }

                parsed.startingKeys     = Math.max(0, keysPickedUp - keysConsumed);
                parsed.startingLockMask = openedLockMask;
            }
        } catch (e) {
            console.warn("[SolvabilityDetector] _applyCollectedItems error:", e);
        }
    }

    // ── BFS ────────────────────────────────────────────────────────────────────

    /**
     * Synchronous BFS. Adapted from LevelAuditor.findOptimalPath.
     *
     * State: { x, z, health, sMask, hMask, kHand, kMask, lockMask }
     *   sMask    — bitmask of stardusts collected so far in this BFS path
     *   hMask    — bitmask of hearts collected (dedup guard)
     *   kHand    — count of keys currently held (can be consumed at locks)
     *   kMask    — bitmask of key board-tiles collected (dedup guard)
     *   lockMask — bitmask of opened locks
     *
     * Win condition: sMask === (1 << stardusts.length) - 1 (all remaining stardusts collected)
     *
     * @param {Object} parsedLevel
     * @returns {{ solvable: boolean|'unknown', statesExplored, minStrokes? }}
     */
    static _runBFS(parsedLevel) {
        const {
            width, depth, spawn, stardusts, obstacles, locks, spikes, hearts, keys,
            startingHealth, startingKeys, startingLockMask,
        } = parsedLevel;

        // If no stardusts remain, the level is already won from this state
        if (stardusts.length === 0) {
            return { solvable: true, minStrokes: 0, statesExplored: 0, alreadyWon: true };
        }

        const MAX_HEALTH  = 4;
        const targetMask  = (1 << stardusts.length) - 1;

        // ── Helpers ──────────────────────────────────────────────────────────
        const inBounds   = (x, z) => x >= 0 && x < width && z >= 0 && z < depth;
        const isWall     = (x, z) => obstacles.has(`${x},${z}`);
        const isSpike    = (x, z) => spikes.has(`${x},${z}`);
        const getLockIdx = (x, z) => locks.findIndex(l => l.x === x && l.z === z);
        const getSD      = (x, z) => stardusts.find(s => s.x === x && s.z === z);
        const getHeart   = (x, z) => hearts.find(h => h.x === x && h.z === z);
        const getKey     = (x, z) => keys.find(k => k.x === x && k.z === z);

        const DIRS = [
            { dx:  0, dz:  1 },  // UP
            { dx:  0, dz: -1 },  // DOWN
            { dx: -1, dz:  0 },  // LEFT
            { dx:  1, dz:  0 },  // RIGHT
        ];

        // ── Serialization ─────────────────────────────────────────────────────
        // kMask tracks which key board-tiles have been picked up (dedup).
        // kHand is the count of usable keys (can be derived but kept explicit).
        const serialize = (s) =>
            `${s.x},${s.z},${s.health}|${s.sMask}|${s.hMask}|${s.kMask}|${s.kHand}|${s.lockMask}`;

        // ── Initial state ─────────────────────────────────────────────────────
        const init = {
            x:        spawn.x,
            z:        spawn.z,
            health:   startingHealth ?? 4,
            sMask:    0,
            hMask:    0,
            kHand:    startingKeys     ?? 0,
            kMask:    0,
            lockMask: startingLockMask ?? 0,
            strokes:  0,
        };

        const visited = new Set([serialize(init)]);
        const queue   = [init];
        let statesExplored = 0;

        // ── BFS loop ──────────────────────────────────────────────────────────
        while (queue.length > 0) {
            if (statesExplored >= SolvabilityDetector.HARD_CAP) {
                return { solvable: "unknown", statesExplored, timedOut: true };
            }

            const cur = queue.shift();
            statesExplored++;

            for (const dir of DIRS) {
                // ── Simulate one slide ────────────────────────────────────────
                // Walk tile-by-tile, stopping BEFORE a wall or un-keyed lock.
                // Apply pickups / damage along the way (matches actual game physics).

                let px = cur.x, pz = cur.z;
                let nx = px + dir.dx, nz = pz + dir.dz;

                let health   = cur.health;
                let sMask    = cur.sMask;
                let hMask    = cur.hMask;
                let kHand    = cur.kHand;
                let kMask    = cur.kMask;
                let lockMask = cur.lockMask;
                let died     = false;

                while (inBounds(nx, nz)) {
                    // Wall check — stop before mountain
                    if (isWall(nx, nz)) break;

                    // Lock check — stop before locked lock if no key held
                    const lockIdx = getLockIdx(nx, nz);
                    if (lockIdx >= 0 && !(lockMask & (1 << lockIdx)) && kHand <= 0) break;

                    // Move into next tile
                    px = nx; pz = nz;

                    // ── Apply tile effects at (px, pz) ────────────────────────
                    // BREAKABLE_HOOK — future: if state.boosted and tile is breakable, break it

                    // Heart first (lets player survive a spike on the same tile)
                    const heart = getHeart(px, pz);
                    if (heart && !(hMask & (1 << heart.id))) {
                        hMask |= (1 << heart.id);
                        health = Math.min(health + 1, MAX_HEALTH);
                    }

                    // Key pickup
                    const key = getKey(px, pz);
                    if (key && !(kMask & (1 << key.id))) {
                        kMask |= (1 << key.id);
                        kHand++;
                    }

                    // Lock — auto-consume one key to open (re-check lockIdx for this tile)
                    if (lockIdx >= 0 && !(lockMask & (1 << lockIdx)) && kHand > 0) {
                        lockMask |= (1 << lockIdx);
                        kHand--;
                    }

                    // SPEEDBOOST_HOOK — future: if tile is speedBoost, mark state.boosted

                    // Spike damage
                    if (isSpike(px, pz)) {
                        health--;
                        if (health <= 0) { died = true; break; }
                    }

                    // Stardust
                    const sd = getSD(px, pz);
                    if (sd) sMask |= (1 << sd.id);

                    // PORTAL_HOOK — future: if tile is portal, redirect to pairedTileId and break

                    nx = px + dir.dx; nz = pz + dir.dz;
                }

                // Player died — discard this branch
                if (died) continue;

                // No movement — skip direction
                if (px === cur.x && pz === cur.z) continue;

                // ── Check win ─────────────────────────────────────────────────
                if (sMask === targetMask) {
                    return { solvable: true, minStrokes: cur.strokes + 1, statesExplored };
                }

                // ── Enqueue next state ────────────────────────────────────────
                const next = {
                    x: px, z: pz, health, sMask, hMask, kHand, kMask, lockMask,
                    strokes: cur.strokes + 1,
                };
                const key2 = serialize(next);
                if (!visited.has(key2)) {
                    visited.add(key2);
                    queue.push(next);
                }
            }
        }

        return { solvable: false, statesExplored };
    }

    // ── Analysis Orchestration ─────────────────────────────────────────────────

    /**
     * Runs BFS via Web Worker with main-thread rAF fallback.
     * @param {Object} parsedLevel
     * @param {boolean} silent — if true, suppress UI panel even if unsolvable
     */
    static _runAnalysis(parsedLevel, silent) {
        SolvabilityDetector._cancelPendingPanel();

        const myId = ++SolvabilityDetector._analysisId;

        // Terminate any running worker from a previous move
        if (SolvabilityDetector._workerRef) {
            SolvabilityDetector._workerRef.terminate();
            SolvabilityDetector._workerRef = null;
        }

        const onResult = (result) => {
            if (myId !== SolvabilityDetector._analysisId) return; // stale — a newer analysis started
            SolvabilityDetector.lastResult = result;

            // Notify HintSystem so it can use real solvability instead of its heuristic
            window.HintSystem?.onSolvabilityResult?.(result);

            if (!silent && result.solvable === false) {
                SolvabilityDetector._schedulePanelIfNeeded();
            }
        };

        // ── Try Web Worker ────────────────────────────────────────────────────
        if (typeof Worker !== "undefined") {
            try {
                const isLocal = (typeof Config !== "undefined")
                    ? Config.RUN_LOCALLY_DETERMINED
                    : true;
                const workerUrl = isLocal
                    ? "./workers/solvabilityWorker.js"
                    : "/workers/solvabilityWorker.js";

                const worker = new Worker(workerUrl);
                SolvabilityDetector._workerRef = worker;

                worker.postMessage(SolvabilityDetector._serializeForWorker(parsedLevel));

                worker.onmessage = (e) => {
                    worker.terminate();
                    SolvabilityDetector._workerRef = null;
                    onResult(e.data);
                };

                worker.onerror = () => {
                    // Worker failed to load or threw — fall back to main thread
                    worker.terminate();
                    SolvabilityDetector._workerRef = null;
                    requestAnimationFrame(() => {
                        if (myId !== SolvabilityDetector._analysisId) return;
                        onResult(SolvabilityDetector._runBFS(parsedLevel));
                    });
                };

                return;
            } catch (e) {
                // Worker construction failed — fall through to main thread
            }
        }

        // ── Main-thread fallback (deferred via rAF to avoid blocking input) ───
        requestAnimationFrame(() => {
            if (myId !== SolvabilityDetector._analysisId) return;
            onResult(SolvabilityDetector._runBFS(parsedLevel));
        });
    }

    /**
     * Serialize parsedLevel for postMessage to worker.
     * Sets cannot cross the worker boundary — convert to arrays.
     */
    static _serializeForWorker(parsedLevel) {
        return {
            width:            parsedLevel.width,
            depth:            parsedLevel.depth,
            spawn:            parsedLevel.spawn,
            stardusts:        parsedLevel.stardusts,
            obstacles:        [...parsedLevel.obstacles],   // Set → Array
            locks:            parsedLevel.locks,
            spikes:           [...parsedLevel.spikes],      // Set → Array
            hearts:           parsedLevel.hearts,
            keys:             parsedLevel.keys,
            startingHealth:   parsedLevel.startingHealth,
            startingKeys:     parsedLevel.startingKeys,
            startingLockMask: parsedLevel.startingLockMask,
        };
    }

    // ── Unsolvable UI Panel ────────────────────────────────────────────────────

    static _schedulePanelIfNeeded() {
        // Suppress if HintSystem is already showing a dead-end message
        if (window.HintSystem?._hintPanel) return;
        if (SolvabilityDetector._activePanel) return; // already visible

        SolvabilityDetector._cancelPendingPanel();

        SolvabilityDetector._pendingPanel = setTimeout(() => {
            SolvabilityDetector._pendingPanel = null;
            // Re-check: result may have changed if player undid
            if (SolvabilityDetector.lastResult?.solvable !== false) return;
            if (window.HintSystem?._hintPanel) return;
            if (SolvabilityDetector._activePanel) return;
            SolvabilityDetector._showUnsolvablePanel();
        }, SolvabilityDetector.SHOW_PANEL_DELAY);
    }

    static _cancelPendingPanel() {
        if (SolvabilityDetector._pendingPanel) {
            clearTimeout(SolvabilityDetector._pendingPanel);
            SolvabilityDetector._pendingPanel = null;
        }
    }

    static _showUnsolvablePanel() {
        const adt = SolvabilityDetector._getAdt();
        if (!adt) return;

        const container = new BABYLON.GUI.Rectangle("sd_wrap");
        container.width      = "100%";
        container.height     = "100%";
        container.background = "transparent";
        container.color      = "transparent";
        container.thickness  = 0;
        container.alpha      = 0;
        adt.addControl(container);
        SolvabilityDetector._activePanel = container;

        // Dim background (added first so it renders behind panel)
        const bg = new BABYLON.GUI.Rectangle("sd_bg");
        bg.width      = "100%";
        bg.height     = "100%";
        bg.background = "#000000";
        bg.alpha      = 0.45;
        bg.color      = "transparent";
        bg.thickness  = 0;
        container.addControl(bg);
        bg.onPointerClickObservable.add(() => SolvabilityDetector._dismissPanel());

        // Panel — matches HintSystem aesthetic: #1a0a2e bg, #7b4fd4 border
        const panel = new BABYLON.GUI.Rectangle("sd_panel");
        panel.width                  = "700px";
        panel.height                 = "240px";
        panel.background             = "#1a0a2e";
        panel.color                  = "#7b4fd4";
        panel.thickness              = 2;
        panel.cornerRadius           = 16;
        panel.verticalAlignment      = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        panel.horizontalAlignment    = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.top                    = "-80px";
        container.addControl(panel);
        panel.onPointerClickObservable.add(() => SolvabilityDetector._dismissPanel());

        const msg = new BABYLON.GUI.TextBlock("sd_msg",
            "No path forward from here.\nRestart to try again.");
        msg.color                        = "#ffffff";
        msg.fontSize                     = 30;
        msg.textWrapping                 = true;
        msg.textHorizontalAlignment      = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        msg.width                        = "620px";
        msg.height                       = "100px";
        msg.top                          = "-48px";
        panel.addControl(msg);

        // Restart button
        const restartBtn = new BABYLON.GUI.Rectangle("sd_restart_btn");
        restartBtn.width               = "160px";
        restartBtn.height              = "40px";
        restartBtn.background          = "#7b4fd4";
        restartBtn.color               = "transparent";
        restartBtn.thickness           = 0;
        restartBtn.cornerRadius        = 6;
        restartBtn.top                 = "60px";
        restartBtn.left                = "-90px";
        restartBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.addControl(restartBtn);
        const restartLbl = new BABYLON.GUI.TextBlock("sd_restart_lbl", "Restart");
        restartLbl.color      = "#ffffff";
        restartLbl.fontSize   = 18;
        restartLbl.fontWeight = "bold";
        restartBtn.addControl(restartLbl);
        restartBtn.onPointerClickObservable.add(() => {
            SolvabilityDetector._dismissPanel();
            window.dispatchEvent(new CustomEvent("radianceRequestRestart"));
        });

        // Keep Trying button
        const keepBtn = new BABYLON.GUI.Rectangle("sd_keep_btn");
        keepBtn.width               = "160px";
        keepBtn.height              = "40px";
        keepBtn.background          = "#3a2060";
        keepBtn.color               = "#7b4fd4";
        keepBtn.thickness           = 1;
        keepBtn.cornerRadius        = 6;
        keepBtn.top                 = "60px";
        keepBtn.left                = "90px";
        keepBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.addControl(keepBtn);
        const keepLbl = new BABYLON.GUI.TextBlock("sd_keep_lbl", "Keep Trying");
        keepLbl.color    = "#ffffff";
        keepLbl.fontSize = 18;
        keepBtn.addControl(keepLbl);
        keepBtn.onPointerClickObservable.add(() => SolvabilityDetector._dismissPanel());

        SolvabilityDetector._animateIn(container);

        setTimeout(
            () => SolvabilityDetector._dismissPanel(),
            SolvabilityDetector.PANEL_AUTODISMISS
        );
    }

    static _dismissPanel() {
        SolvabilityDetector._cancelPendingPanel();
        if (!SolvabilityDetector._activePanel) return;
        const adt = SolvabilityDetector._getAdt();
        if (!adt) { SolvabilityDetector._activePanel = null; return; }
        SolvabilityDetector._animateOut(SolvabilityDetector._activePanel, adt);
        SolvabilityDetector._activePanel = null;
    }

    static _animateIn(container) {
        const dur = 400, t0 = performance.now();
        const step = (now) => {
            container.alpha = Math.min((now - t0) / dur, 1);
            if (container.alpha < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    static _animateOut(container, adt) {
        const dur = 200, t0 = performance.now(), a0 = container.alpha;
        const step = (now) => {
            const t = Math.min((now - t0) / dur, 1);
            container.alpha = a0 * (1 - t);
            if (t < 1) requestAnimationFrame(step);
            else { try { adt.removeControl(container); } catch (e) {} }
        };
        requestAnimationFrame(step);
    }

    static _getAdt() {
        try {
            const swapper = FundamentalSystemBridge["renderSceneSwapper"];
            const uiScene = swapper?.getSceneByName?.("BaseUIScene");
            return uiScene?.advancedTexture || null;
        } catch (e) { return null; }
    }
}

SolvabilityDetector.init();
window.SolvabilityDetector = SolvabilityDetector;
