/**
 * solvabilityWorker.js
 *
 * Web Worker for SolvabilityDetector BFS.
 * Pure logic only — no DOM, no Babylon, no window references.
 *
 * Receives a serialized parsedLevel (obstacles and spikes as arrays, not Sets).
 * Returns the BFS result object.
 */

const HARD_CAP  = 50000;
const MAX_HEALTH = 4;

self.onmessage = function (e) {
    const result = runBFS(e.data);
    self.postMessage(result);
};

function runBFS(parsedLevel) {
    const {
        width, depth, spawn,
        stardusts, obstacles: obstacleArr, locks, spikes: spikeArr,
        hearts, keys,
        startingHealth, startingKeys, startingLockMask,
    } = parsedLevel;

    // Reconstruct Sets from arrays (Sets cannot cross postMessage boundary)
    const obstacles = new Set(obstacleArr);
    const spikes    = new Set(spikeArr);

    if (stardusts.length === 0) {
        return { solvable: true, minStrokes: 0, statesExplored: 0, alreadyWon: true };
    }

    const targetMask = (1 << stardusts.length) - 1;

    // ── Helpers ────────────────────────────────────────────────────────────────
    const inBounds   = (x, z) => x >= 0 && x < width && z >= 0 && z < depth;
    const isWall     = (x, z) => obstacles.has(`${x},${z}`);
    const isSpike    = (x, z) => spikes.has(`${x},${z}`);
    const getLockIdx = (x, z) => locks.findIndex(l => l.x === x && l.z === z);
    const getSD      = (x, z) => stardusts.find(s => s.x === x && s.z === z);
    const getHeart   = (x, z) => hearts.find(h => h.x === x && h.z === z);
    const getKey     = (x, z) => keys.find(k => k.x === x && k.z === z);

    const DIRS = [
        { dx:  0, dz:  1 },
        { dx:  0, dz: -1 },
        { dx: -1, dz:  0 },
        { dx:  1, dz:  0 },
    ];

    const serialize = (s) =>
        `${s.x},${s.z},${s.health}|${s.sMask}|${s.hMask}|${s.kMask}|${s.kHand}|${s.lockMask}`;

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

    while (queue.length > 0) {
        if (statesExplored >= HARD_CAP) {
            return { solvable: "unknown", statesExplored, timedOut: true };
        }

        const cur = queue.shift();
        statesExplored++;

        for (const dir of DIRS) {
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
                if (isWall(nx, nz)) break;

                const lockIdx = getLockIdx(nx, nz);
                if (lockIdx >= 0 && !(lockMask & (1 << lockIdx)) && kHand <= 0) break;

                px = nx; pz = nz;

                const heart = getHeart(px, pz);
                if (heart && !(hMask & (1 << heart.id))) {
                    hMask |= (1 << heart.id);
                    health = Math.min(health + 1, MAX_HEALTH);
                }

                const key = getKey(px, pz);
                if (key && !(kMask & (1 << key.id))) {
                    kMask |= (1 << key.id);
                    kHand++;
                }

                if (lockIdx >= 0 && !(lockMask & (1 << lockIdx)) && kHand > 0) {
                    lockMask |= (1 << lockIdx);
                    kHand--;
                }

                if (isSpike(px, pz)) {
                    health--;
                    if (health <= 0) { died = true; break; }
                }

                const sd = getSD(px, pz);
                if (sd) sMask |= (1 << sd.id);

                nx = px + dir.dx; nz = pz + dir.dz;
            }

            if (died) continue;
            if (px === cur.x && pz === cur.z) continue;

            if (sMask === targetMask) {
                return { solvable: true, minStrokes: cur.strokes + 1, statesExplored };
            }

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
