/**
 * LevelSolutionMegaAuditor
 *
 * Fetches every level registered in LevelProfileManifest, constructs a
 * headless (non-rendered) grid world from the level JSON, then simulates
 * the recorded solutionPath move-by-move using the same physics the live
 * game uses (slide until wall or boundary, pick up items along the way,
 * take spike damage, consume keys at locks).
 *
 * After all moves it checks:
 *   - All 4 stardusts were collected
 *   - Player health is still > 0
 *   - Move count equals perfectSolutionMovementCount
 *
 * Any level that fails these checks is reported with the specific reason(s).
 *
 * Usage (browser console, after the game has loaded):
 *   await LevelSolutionMegaAuditor.auditAllLevels()
 *   await LevelSolutionMegaAuditor.auditLevel("levelVoyage3")
 */
class LevelSolutionMegaAuditor {

    // ── Constants ──────────────────────────────────────────────────────────────

    static STARTING_HEALTH    = 4;
    static MAX_HEALTH         = 4;
    static REQUIRED_STARDUSTS = 4;
    static LOG_PREFIX         = "[MEGA AUDITOR]";

    /**
     * The four sliding directions.
     * dx/dz follow the live game convention: +Z is UP, -Z is DOWN,
     * -X is LEFT, +X is RIGHT (after builderToWorld coordinate flip).
     */
    static DIRECTIONS = {
        UP:    { dx:  0, dz:  1 },
        DOWN:  { dx:  0, dz: -1 },
        LEFT:  { dx: -1, dz:  0 },
        RIGHT: { dx:  1, dz:  0 },
    };

    // ── Public API ─────────────────────────────────────────────────────────────

    /**
     * Audits every level in LevelProfileManifest.levelProfiles.
     * Prints a full summary table to the console and returns the results.
     *
     * @returns {Promise<Array<Object>>} One result object per level.
     */
    static async auditAllLevels() {
        const p = LevelSolutionMegaAuditor.LOG_PREFIX;

        if (typeof LevelProfileManifest === "undefined") {
            console.error(`${p} LevelProfileManifest is not loaded. Ensure the game has initialised before calling this.`);
            return [];
        }

        const allLevelIds = LevelProfileManifest.getAllLevelIds();

        console.log(`\n${p} ${"=".repeat(64)}`);
        console.log(`${p} LEVEL SOLUTION MEGA AUDIT — ${allLevelIds.length} levels`);
        console.log(`${p} ${"=".repeat(64)}`);

        const results = [];
        for (const levelId of allLevelIds) {
            const result = await LevelSolutionMegaAuditor._auditSingleLevel(levelId);
            results.push(result);
            LevelSolutionMegaAuditor._printSingleResult(result, false);
        }

        LevelSolutionMegaAuditor._printSummary(results);
        return results;
    }

    /**
     * Audits one level by ID and prints a verbose result.
     *
     * @param {string} levelId
     * @returns {Promise<Object>}
     */
    static async auditLevel(levelId) {
        const p = LevelSolutionMegaAuditor.LOG_PREFIX;
        console.log(`\n${p} Single-level audit: ${levelId}`);
        const result = await LevelSolutionMegaAuditor._auditSingleLevel(levelId);
        LevelSolutionMegaAuditor._printSingleResult(result, true);
        return result;
    }

    // ── Core audit logic ───────────────────────────────────────────────────────

    /**
     * Fetches, parses, and simulates a single level.
     * @param {string} levelId
     * @returns {Promise<Object>} Result object — see _buildResult() for shape.
     */
    static async _auditSingleLevel(levelId) {
        // 1. Look up the profile ---------------------------------------------------
        const profile = LevelProfileManifest.getLevelProfile(levelId);
        if (!profile) {
            return LevelSolutionMegaAuditor._buildResult(levelId, "NO_PROFILE", null, null,
                [`No entry found in LevelProfileManifest for "${levelId}"`]);
        }

        const solutionPath        = profile.solutionPath || [];
        const expectedMoveCount   = profile.perfectSolutionMovementCount;

        // 2. Fetch level JSON from CDN (uses the manifest's built-in cache) --------
        let levelData;
        try {
            levelData = await LevelProfileManifest.fetchLevelById(levelId);
        } catch (err) {
            return LevelSolutionMegaAuditor._buildResult(levelId, "FETCH_ERROR", solutionPath, null,
                [`Could not fetch level data: ${err.message}`]);
        }

        // 3. Parse the JSON into a headless grid -----------------------------------
        let parsedLevel;
        try {
            parsedLevel = LevelSolutionMegaAuditor._parseLevelData(levelData);
        } catch (err) {
            return LevelSolutionMegaAuditor._buildResult(levelId, "PARSE_ERROR", solutionPath, null,
                [`Could not parse level JSON: ${err.message}`]);
        }

        // 4. Validate that a solution path exists ---------------------------------
        if (!solutionPath || solutionPath.length === 0) {
            return LevelSolutionMegaAuditor._buildResult(levelId, "INVALID", solutionPath, parsedLevel,
                [`solutionPath is empty — no moves recorded in the level profile`]);
        }

        // 5. Simulate the solution path -------------------------------------------
        const sim = LevelSolutionMegaAuditor._simulateSolutionPath(parsedLevel, solutionPath);

        // 6. Cross-check the move count -------------------------------------------
        if (solutionPath.length !== expectedMoveCount) {
            sim.issues.push(
                `Move count mismatch: solutionPath has ${solutionPath.length} entries ` +
                `but perfectSolutionMovementCount is ${expectedMoveCount}`
            );
        }

        // 7. Classify -------------------------------------------------------------
        const status = sim.valid && sim.issues.length === 0
            ? "PASS"
            : sim.valid
                ? "PASS_WITH_WARNINGS"
                : "INVALID";

        return LevelSolutionMegaAuditor._buildResult(levelId, status, solutionPath, parsedLevel, sim.issues, {
            health:             sim.health,
            stardustsCollected: sim.stardustsCollected,
            moveCount:          solutionPath.length,
            expectedMoveCount,
        });
    }

    // ── Headless grid simulation ───────────────────────────────────────────────

    /**
     * Steps through every entry in solutionPath, applying sliding-movement
     * physics on the headless grid.
     *
     * Movement rules (mirror of the live game):
     *   - Player slides in the chosen direction until hitting an obstacle or boundary.
     *   - At every tile along the slide path (excluding the start tile):
     *       1. Heart pickup (heals before potential spike — same-tile survival possible).
     *       2. Key pickup.
     *       3. Lock consumption (auto-consume one key when sliding through a lock).
     *       4. Spike damage.
     *       5. Stardust pickup.
     *   - Health reaching 0 is instant death; simulation stops.
     *
     * @param {Object} parsedLevel  Output of _parseLevelData().
     * @param {Array<string>} solutionPath  Array of direction strings.
     * @returns {{ valid: boolean, health: number, stardustsCollected: number, issues: string[] }}
     */
    static _simulateSolutionPath(parsedLevel, solutionPath) {
        const { width, depth, spawn, stardusts, obstacles, spikes, hearts, locks, keys } = parsedLevel;
        const self = LevelSolutionMegaAuditor;

        let x                = spawn.x;
        let z                = spawn.z;
        let health           = self.STARTING_HEALTH;
        let collectedStardusts = 0;   // bitmask — bit i = stardust i collected
        let collectedHearts    = 0;   // bitmask — bit i = heart i collected
        let collectedKeys      = 0;   // bitmask — bit i = key i currently held
        const issues           = [];
        let died               = false;

        const targetStardustMask = (1 << stardusts.length) - 1;

        for (let moveIdx = 0; moveIdx < solutionPath.length; moveIdx++) {
            if (died) break;

            const rawDir  = solutionPath[moveIdx];
            // Normalise: strip trailing commas/spaces that sometimes appear as typos
            const dir     = rawDir.trim().replace(/,+$/, "").toUpperCase();
            const moveNum = moveIdx + 1;
            const delta   = self.DIRECTIONS[dir];

            // ── Unknown / special direction ─────────────────────────────────────
            if (!delta) {
                // "UNLOCK" appears in some solution paths as an annotation for a
                // planned explicit-unlock action. The live game auto-unlocks locks
                // when the player slides through them with a key, so UNLOCK has no
                // movement effect here. We note it and continue.
                issues.push(
                    `Move ${moveNum}: unrecognised direction "${rawDir}" — treated as no-op (does not advance player)`
                );
                continue;
            }

            // ── Calculate slide destination ─────────────────────────────────────
            // Step forward until hitting a wall or the map boundary.
            let destX  = x;
            let destZ  = z;
            let nextX  = x + delta.dx;
            let nextZ  = z + delta.dz;

            while (self._inBounds(nextX, nextZ, width, depth) &&
                   !self._isObstacle(nextX, nextZ, obstacles, locks, collectedKeys)) {
                destX  = nextX;
                destZ  = nextZ;
                nextX += delta.dx;
                nextZ += delta.dz;
            }

            // Player pressed into a wall — no movement at all.
            if (destX === x && destZ === z) {
                issues.push(
                    `Move ${moveNum}: ${dir} had no effect — player is flush against a wall or boundary at (${x},${z})`
                );
                continue;
            }

            // ── Walk the slide path, applying tile effects ──────────────────────
            // Start tile is excluded (effects were applied when we landed here).
            let pathX  = x;
            let pathZ  = z;

            while (pathX !== destX || pathZ !== destZ) {
                pathX += delta.dx;
                pathZ += delta.dz;

                // 1. Heart pickup — heals BEFORE spike so same-tile survival is possible.
                const heartIdx = self._indexAt(hearts, pathX, pathZ);
                if (heartIdx >= 0 && !(collectedHearts & (1 << heartIdx))) {
                    collectedHearts |= (1 << heartIdx);
                    const before = health;
                    health = Math.min(health + 1, self.MAX_HEALTH);
                    if (health > before) {
                        // Healed — nothing extra to log unless debugging is wanted.
                    }
                }

                // 2. Key pickup.
                const keyIdx = self._indexAt(keys, pathX, pathZ);
                if (keyIdx >= 0 && !(collectedKeys & (1 << keyIdx))) {
                    collectedKeys |= (1 << keyIdx);
                }

                // 3. Lock — consume one held key when sliding through.
                if (locks.has(`${pathX},${pathZ}`)) {
                    for (let k = 0; k < keys.length; k++) {
                        if (collectedKeys & (1 << k)) {
                            collectedKeys &= ~(1 << k);
                            break;
                        }
                    }
                }

                // 4. Spike damage.
                if (spikes.has(`${pathX},${pathZ}`)) {
                    health--;
                    if (health <= 0) {
                        issues.push(
                            `Move ${moveNum}: ${dir} — player dies to spike at (${pathX},${pathZ}); ` +
                            `health was ${health + 1} before this tile`
                        );
                        died = true;
                        break;
                    }
                }

                // 5. Stardust pickup.
                const sdIdx = self._indexAt(stardusts, pathX, pathZ);
                if (sdIdx >= 0 && !(collectedStardusts & (1 << sdIdx))) {
                    collectedStardusts |= (1 << sdIdx);
                }
            }

            if (!died) {
                x = destX;
                z = destZ;
            }
        }

        // ── Post-run checks ─────────────────────────────────────────────────────
        const stardustsCollected = self._countBits(collectedStardusts);

        if (!died && collectedStardusts !== targetStardustMask) {
            issues.push(
                `After all moves: only ${stardustsCollected}/${stardusts.length} stardust(s) collected ` +
                `— missing ${stardusts.length - stardustsCollected}`
            );
        }

        const valid = !died && (collectedStardusts === targetStardustMask);

        return { valid, health: died ? 0 : health, stardustsCollected, issues };
    }

    // ── Headless grid parser ───────────────────────────────────────────────────

    /**
     * Converts raw level JSON into the flat data structures used by the simulator.
     * Applies the same builderToWorld coordinate flip as the live game:
     *   worldX = builderX
     *   worldZ = (depth - 1) - builderY
     *
     * @param {Object} levelData  Raw JSON fetched from the CDN.
     * @returns {Object} { width, depth, spawn, stardusts, obstacles, locks, spikes, hearts, keys }
     */
    static _parseLevelData(levelData) {
        const width = levelData.mapWidth  || 21;
        const depth = levelData.mapHeight || levelData.mapDepth || 21;

        // Builder-to-world coordinate transform (matches LevelLoaderManager.builderToWorld)
        const bw = (coords) => ({
            x: coords.x,
            z: (depth - 1 - coords.y),
        });

        const els = levelData.allMapElements || [];

        // Spawn
        const spawnEl = els.find(e => e.element === "SPAWN_POSITION");
        const spawn   = spawnEl ? bw(spawnEl.coordinates) : { x: 10, z: 10 };

        // Stardusts — ordered by their position in allMapElements for stable bitmask IDs
        const stardusts = els
            .filter(e => e.element === "STAR_DUST")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        // Mountains — block all movement
        const obstacles = new Set(
            els.filter(e => e.element === "MOUNTAIN")
               .map(e => { const w = bw(e.coordinates); return `${w.x},${w.z}`; })
        );

        // Locks — block movement unless the player holds a key
        const locks = new Set(
            els.filter(e => e.element === "LOCK")
               .map(e => { const w = bw(e.coordinates); return `${w.x},${w.z}`; })
        );

        // Spike traps — deal 1 damage when passed through or landed on
        const spikes = new Set(
            els.filter(e => e.element === "SPIKE_TRAP")
               .map(e => { const w = bw(e.coordinates); return `${w.x},${w.z}`; })
        );

        // Hearts — heal +1 HP (capped at MAX_HEALTH), one-time pickup
        const hearts = els
            .filter(e => e.element === "HEART")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        // Keys — one-time pickup, consumed at locks
        const keys = els
            .filter(e => e.element === "KEY")
            .map((e, i) => { const w = bw(e.coordinates); return { x: w.x, z: w.z, id: i }; });

        return { width, depth, spawn, stardusts, obstacles, locks, spikes, hearts, keys };
    }

    // ── Grid utility helpers ───────────────────────────────────────────────────

    static _inBounds(x, z, width, depth) {
        return x >= 0 && x < width && z >= 0 && z < depth;
    }

    /**
     * Returns true if the tile at (x,z) blocks movement.
     * Mountains always block. Locks block only when the player holds no keys.
     */
    static _isObstacle(x, z, obstacles, locks, collectedKeys) {
        if (obstacles.has(`${x},${z}`)) return true;
        if (locks.has(`${x},${z}`) && LevelSolutionMegaAuditor._countBits(collectedKeys) <= 0) return true;
        return false;
    }

    /**
     * Returns the index of the first item in arr whose (x,z) matches,
     * or -1 if not found.
     * @param {Array<{x:number,z:number}>} arr
     */
    static _indexAt(arr, x, z) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].x === x && arr[i].z === z) return i;
        }
        return -1;
    }

    /** Population-count (number of set bits). */
    static _countBits(n) {
        let count = 0;
        while (n) { count += n & 1; n >>>= 1; }
        return count;
    }

    // ── Result construction ────────────────────────────────────────────────────

    static _buildResult(levelId, status, solutionPath, parsedLevel, issues, extra = {}) {
        return {
            levelId,
            status,
            moveCount:          solutionPath ? solutionPath.length : null,
            expectedMoveCount:  extra.expectedMoveCount  ?? null,
            health:             extra.health             ?? null,
            stardustsCollected: extra.stardustsCollected ?? null,
            stardustsRequired:  parsedLevel ? parsedLevel.stardusts.length : null,
            issues: issues || [],
        };
    }

    // ── Console reporting ──────────────────────────────────────────────────────

    /** Prints a one-liner (or verbose block) for a single result. */
    static _printSingleResult(result, verbose) {
        const p    = LevelSolutionMegaAuditor.LOG_PREFIX;
        const icon = { PASS: "PASS", PASS_WITH_WARNINGS: "WARN", INVALID: "FAIL",
                       FETCH_ERROR: "ERR!", PARSE_ERROR: "ERR!", NO_PROFILE: "ERR!" }[result.status] || "????";

        if (result.status === "PASS" && !verbose) {
            console.log(`${p}   [${icon}] ${result.levelId}`);
            return;
        }

        const statLine = result.moveCount != null
            ? `moves:${result.moveCount}/${result.expectedMoveCount}  health:${result.health}  stars:${result.stardustsCollected}/${result.stardustsRequired}`
            : "";

        console.log(`${p}   [${icon}] ${result.levelId}  ${statLine}`);
        for (const issue of result.issues) {
            console.log(`${p}         - ${issue}`);
        }
    }

    /** Prints the final summary table after all levels have been checked. */
    static _printSummary(results) {
        const p        = LevelSolutionMegaAuditor.LOG_PREFIX;
        const pass     = results.filter(r => r.status === "PASS");
        const warnings = results.filter(r => r.status === "PASS_WITH_WARNINGS");
        const invalid  = results.filter(r => r.status === "INVALID");
        const errors   = results.filter(r => ["FETCH_ERROR", "PARSE_ERROR", "NO_PROFILE"].includes(r.status));

        console.log(`\n${p} ${"─".repeat(64)}`);
        console.log(`${p} RESULTS: ${results.length} levels checked`);
        console.log(`${p}   PASS              ${pass.length}`);
        console.log(`${p}   PASS (warnings)   ${warnings.length}`);
        console.log(`${p}   INVALID           ${invalid.length}`);
        console.log(`${p}   ERROR             ${errors.length}`);
        console.log(`${p} ${"─".repeat(64)}`);

        if (warnings.length > 0) {
            console.log(`\n${p} PASSED WITH WARNINGS — solution is correct but has minor issues:`);
            for (const r of warnings) {
                console.log(`${p}   ${r.levelId}  (moves:${r.moveCount}/${r.expectedMoveCount})`);
                for (const issue of r.issues) {
                    console.log(`${p}     ! ${issue}`);
                }
            }
        }

        if (invalid.length > 0) {
            console.log(`\n${p} INVALID SOLUTIONS — these levels will not play through correctly:`);
            for (const r of invalid) {
                console.log(`${p}   ${r.levelId}`);
                console.log(`${p}     moves: ${r.moveCount ?? "?"}  expected: ${r.expectedMoveCount ?? "?"}  health: ${r.health ?? "?"}  stars: ${r.stardustsCollected ?? "?"}/${r.stardustsRequired ?? "?"}`);
                for (const issue of r.issues) {
                    console.log(`${p}     x ${issue}`);
                }
            }
        }

        if (errors.length > 0) {
            console.log(`\n${p} ERRORS — level data could not be loaded or parsed:`);
            for (const r of errors) {
                console.log(`${p}   ${r.levelId}  [${r.status}]`);
                for (const issue of r.issues) {
                    console.log(`${p}     ! ${issue}`);
                }
            }
        }

        const allGood = invalid.length === 0 && errors.length === 0 && warnings.length === 0;
        if (allGood) {
            console.log(`${p}   All ${pass.length} level solution(s) passed with no issues.`);
        }

        console.log(`${p} ${"=".repeat(64)}\n`);
    }
}

window.LevelSolutionMegaAuditor = LevelSolutionMegaAuditor;
