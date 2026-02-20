/**
 * ConstellationManifest
 *
 * Defines the Constellation data structure and a registry of named constellations.
 * Each constellation describes a set of stars with normalized screen-space coordinates
 * (x/y in [0,1], origin at top-left) and the line segments that connect them.
 *
 * Star coordinates are layout-space, not world-space. The world loader scene maps
 * them to 3D positions at render time so the same manifest works at any camera height.
 */

class Constellation {
    /**
     * @param {Object} opts
     * @param {string}   opts.id    - Unique identifier (e.g. "orion")
     * @param {string}   opts.name  - Display name (e.g. "Orion")
     * @param {Array<{id:number, name:string, x:number, y:number}>} opts.stars
     *   Star definitions.  x/y are normalized [0,1] layout coords (0,0 = top-left).
     *   id matches the level/sphere index used by the world loader.
     * @param {Array<[number, number]>} opts.lines
     *   Pairs of star ids that should be connected by a line segment.
     */
    constructor({ id, name, stars, lines }) {
        this.id    = id;
        this.name  = name;
        this.stars = stars; // [{ id, name, x, y }, ...]
        this.lines = lines; // [[starIdA, starIdB], ...]
    }
}

class ConstellationManifest {
    static _registry = new Map();

    /** Register a constellation so it can be retrieved by id. */
    static register(constellation) {
        ConstellationManifest._registry.set(constellation.id, constellation);
    }

    /** @returns {Constellation|null} */
    static get(id) {
        return ConstellationManifest._registry.get(id) ?? null;
    }

    /** Returns the first registered constellation (used as the scene default). */
    static getDefault() {
        return ConstellationManifest._registry.values().next().value ?? null;
    }
}

// ── Orion ───────────────────────────────────────────────────────────────────
// Stars ordered by id 0-8, which maps directly to level/sphere index.
ConstellationManifest.register(new Constellation({
    id:   "orion",
    name: "Orion",
    stars: [
        { id: 0, name: "Betelgeuse", x: 0.35, y: 0.38 }, // left shoulder
        { id: 1, name: "Bellatrix",  x: 0.65, y: 0.35 }, // right shoulder
        { id: 2, name: "Alnitak",    x: 0.40, y: 0.55 }, // belt left
        { id: 3, name: "Alnilam",    x: 0.50, y: 0.53 }, // belt center
        { id: 4, name: "Mintaka",    x: 0.60, y: 0.51 }, // belt right
        { id: 5, name: "Saiph",      x: 0.38, y: 0.72 }, // left foot
        { id: 6, name: "Rigel",      x: 0.66, y: 0.75 }, // right foot
        { id: 7, name: "Meissa",     x: 0.50, y: 0.18 }, // head
        { id: 8, name: "Hatsya",     x: 0.50, y: 0.67 }, // sword
    ],
    lines: [
        [7, 0], // head -> left shoulder
        [7, 1], // head -> right shoulder
        [0, 1], // left shoulder -> right shoulder
        [0, 2], // left shoulder -> belt left
        [1, 4], // right shoulder -> belt right
        [2, 3], // belt left -> belt center
        [3, 4], // belt center -> belt right
        [2, 5], // belt left -> left foot
        [4, 6], // belt right -> right foot
        [3, 8], // belt center -> sword
    ],
}));
