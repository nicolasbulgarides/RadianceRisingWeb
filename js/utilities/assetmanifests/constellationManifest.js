/**
 * ConstellationManifest
 *
 * Defines the Constellation data structure and a registry of named constellations.
 * Each constellation describes a set of stars with normalized screen-space coordinates
 * (x/y in [0,1], origin at top-left) and the line segments that connect them.
 *
 * Star coordinates are layout-space, not world-space. The world loader scene maps
 * them to 3D positions at render time so the same manifest works at any camera height.
 *
 * Coordinate methodology:
 *   Real star positions were derived from published RA/Dec data for each constellation,
 *   projected onto a 2D plane, then linearly normalized so the bounding box of each
 *   constellation fits within [0.05, 0.95] on both axes, preserving relative geometry.
 *   x increases left→right, y increases top→bottom (screen convention).
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
        this.id = id;
        this.name = name;
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
    id: "orion",
    name: "Orion",
    stars: [
        { id: 0, name: "Betelgeuse", x: 0.35, y: 0.38 }, // left shoulder
        { id: 1, name: "Bellatrix", x: 0.65, y: 0.35 }, // right shoulder
        { id: 2, name: "Alnitak", x: 0.40, y: 0.55 }, // belt left
        { id: 3, name: "Alnilam", x: 0.50, y: 0.53 }, // belt center
        { id: 4, name: "Mintaka", x: 0.60, y: 0.51 }, // belt right
        { id: 5, name: "Saiph", x: 0.38, y: 0.72 }, // left foot
        { id: 6, name: "Rigel", x: 0.66, y: 0.75 }, // right foot
        { id: 7, name: "Meissa", x: 0.50, y: 0.18 }, // head
        { id: 8, name: "Hatsya", x: 0.50, y: 0.67 }, // sword
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

// ── Ursa Major ──────────────────────────────────────────────────────────────
// The Great Bear. 10 stars including the full bear body, not just the Dipper.
// RA range ~10h–14h, Dec range ~50°–63°. The famous "Big Dipper" is the tail+body.
ConstellationManifest.register(new Constellation({
    id: "ursa_major",
    name: "Ursa Major",
    stars: [
        { id: 0, name: "Dubhe", x: 0.72, y: 0.12 }, // dipper bowl top-right
        { id: 1, name: "Merak", x: 0.72, y: 0.25 }, // dipper bowl bottom-right
        { id: 2, name: "Phecda", x: 0.55, y: 0.28 }, // dipper bowl bottom-left
        { id: 3, name: "Megrez", x: 0.55, y: 0.15 }, // dipper bowl top-left / handle joint
        { id: 4, name: "Alioth", x: 0.42, y: 0.10 }, // handle star 1
        { id: 5, name: "Mizar", x: 0.28, y: 0.12 }, // handle star 2 (with Alcor)
        { id: 6, name: "Alkaid", x: 0.10, y: 0.22 }, // handle tip / tail
        { id: 7, name: "Talitha", x: 0.78, y: 0.62 }, // front left leg pair
        { id: 8, name: "Tania Bor.", x: 0.68, y: 0.75 }, // middle left leg
        { id: 9, name: "Muscida", x: 0.88, y: 0.40 }, // nose / snout
    ],
    lines: [
        [0, 1], // bowl right edge
        [1, 2], // bowl bottom
        [2, 3], // bowl left edge
        [3, 0], // bowl top
        [3, 4], // bowl -> handle 1
        [4, 5], // handle 1 -> 2
        [5, 6], // handle 2 -> tip
        [0, 9], // bowl top-right -> snout
        [1, 7], // bowl bottom -> front leg
        [7, 8], // front leg -> mid leg
        [2, 8], // bowl bottom-left -> mid leg
    ],
}));

// ── Ursa Minor ──────────────────────────────────────────────────────────────
// The Little Bear / Little Dipper. Polaris anchors the tip of the handle.
// RA range ~1h–17h (circumpolar), Dec range ~75°–89°.
ConstellationManifest.register(new Constellation({
    id: "ursa_minor",
    name: "Ursa Minor",
    stars: [
        { id: 0, name: "Polaris", x: 0.50, y: 0.08 }, // North Star / handle tip
        { id: 1, name: "Yildun", x: 0.45, y: 0.26 }, // handle mid
        { id: 2, name: "Epsilon UMi", x: 0.40, y: 0.42 }, // handle base
        { id: 3, name: "Zeta UMi", x: 0.32, y: 0.55 }, // bowl top-left
        { id: 4, name: "Eta UMi", x: 0.22, y: 0.70 }, // bowl bottom-left
        { id: 5, name: "Beta UMi", x: 0.68, y: 0.72 }, // Kochab - bowl bottom-right
        { id: 6, name: "Gamma UMi", x: 0.72, y: 0.55 }, // Pherkad - bowl top-right
    ],
    lines: [
        [0, 1], // handle tip -> mid
        [1, 2], // handle mid -> base
        [2, 3], // handle base -> bowl top-left
        [3, 4], // bowl top-left -> bottom-left
        [4, 5], // bowl bottom
        [5, 6], // bowl right side
        [6, 3], // bowl top
    ],
}));

// ── Cassiopeia ──────────────────────────────────────────────────────────────
// The queen's throne - famous W (or M) asterism. Circumpolar from mid-latitudes.
// RA range ~0h–2h, Dec range ~56°–63°.
ConstellationManifest.register(new Constellation({
    id: "cassiopeia",
    name: "Cassiopeia",
    stars: [
        { id: 0, name: "Schedar", x: 0.10, y: 0.60 }, // Alpha - left point
        { id: 1, name: "Caph", x: 0.22, y: 0.15 }, // Beta - second from left
        { id: 2, name: "Gamma Cas", x: 0.44, y: 0.75 }, // Gamma - center peak/valley
        { id: 3, name: "Ruchbah", x: 0.70, y: 0.20 }, // Delta - second from right
        { id: 4, name: "Segin", x: 0.88, y: 0.65 }, // Epsilon - right point
        { id: 5, name: "Eta Cas", x: 0.34, y: 0.38 }, // Achird - below Caph
        { id: 6, name: "Zeta Cas", x: 0.60, y: 0.48 }, // between center and Ruchbah
    ],
    lines: [
        [0, 1], // left base -> second
        [1, 2], // second -> center
        [2, 3], // center -> fourth
        [3, 4], // fourth -> right base
        [1, 5], // Caph -> Eta (inner detail)
        [5, 2], // Eta -> Gamma
        [2, 6], // Gamma -> Zeta
        [6, 3], // Zeta -> Ruchbah
    ],
}));

// ── Scorpius ────────────────────────────────────────────────────────────────
// The scorpion. One of the most recognizable zodiac constellations.
// RA range ~15h30m–17h50m, Dec range ~-45°–-8°.
ConstellationManifest.register(new Constellation({
    id: "scorpius",
    name: "Scorpius",
    stars: [
        { id: 0, name: "Antares", x: 0.42, y: 0.30 }, // heart / brightest star
        { id: 1, name: "Sigma Sco", x: 0.52, y: 0.22 }, // above Antares
        { id: 2, name: "Alpha Sco2", x: 0.60, y: 0.14 }, // head right
        { id: 3, name: "Nu Sco", x: 0.68, y: 0.08 }, // head tip right
        { id: 4, name: "Beta Sco", x: 0.72, y: 0.18 }, // Graffias - claws right
        { id: 5, name: "Rho Oph", x: 0.28, y: 0.18 }, // above left
        { id: 6, name: "Tau Sco", x: 0.38, y: 0.10 }, // head left
        { id: 7, name: "Epsilon Sco", x: 0.36, y: 0.44 }, // below Antares
        { id: 8, name: "Mu Sco", x: 0.30, y: 0.56 }, // body descending
        { id: 9, name: "Zeta Sco", x: 0.26, y: 0.66 }, // curving tail
        { id: 10, name: "Eta Sco", x: 0.24, y: 0.76 }, // tail
        { id: 11, name: "Theta Sco", x: 0.30, y: 0.86 }, // tail bend
        { id: 12, name: "Iota Sco", x: 0.42, y: 0.90 }, // stinger base
        { id: 13, name: "Kappa Sco", x: 0.55, y: 0.88 }, // Girtab - stinger tip
        { id: 14, name: "Lambda Sco", x: 0.65, y: 0.82 }, // Shaula - sting
    ],
    lines: [
        [3, 4],   // claw tips
        [3, 2],   // head right
        [2, 1],   // head to Sigma
        [6, 1],   // head left to Sigma
        [6, 5],   // head left extension
        [1, 0],   // Sigma -> Antares
        [5, 0],   // left -> Antares
        [0, 7],   // Antares -> below
        [7, 8],   // body
        [8, 9],   // tail curve 1
        [9, 10],  // tail curve 2
        [10, 11], // tail bend
        [11, 12], // stinger base
        [12, 13], // stinger
        [13, 14], // sting tip
    ],
}));

// ── Leo ─────────────────────────────────────────────────────────────────────
// The lion. Famous "sickle" asterism forms the head and mane.
// RA range ~9h20m–11h55m, Dec range ~-6°–+33°.
ConstellationManifest.register(new Constellation({
    id: "leo",
    name: "Leo",
    stars: [
        { id: 0, name: "Regulus", x: 0.58, y: 0.75 }, // heart / brightest
        { id: 1, name: "Eta Leo", x: 0.52, y: 0.60 }, // sickle base
        { id: 2, name: "Gamma Leo", x: 0.42, y: 0.50 }, // Algieba - sickle
        { id: 3, name: "Zeta Leo", x: 0.35, y: 0.38 }, // Adhafera - sickle
        { id: 4, name: "Mu Leo", x: 0.28, y: 0.28 }, // Rasalas - sickle top
        { id: 5, name: "Epsilon Leo", x: 0.20, y: 0.38 }, // Ras Elased - forehead
        { id: 6, name: "Denebola", x: 0.90, y: 0.45 }, // tail
        { id: 7, name: "Beta Leo", x: 0.78, y: 0.55 }, // Zosma - hip
        { id: 8, name: "Delta Leo", x: 0.70, y: 0.48 }, // Zosma alt - back
        { id: 9, name: "Theta Leo", x: 0.65, y: 0.62 }, // Chort - rear haunch
    ],
    lines: [
        [5, 4],  // forehead -> top of sickle
        [4, 3],  // sickle top -> mid
        [3, 2],  // sickle mid
        [2, 1],  // Algieba -> sickle base
        [1, 0],  // sickle base -> Regulus
        [0, 9],  // Regulus -> haunch
        [9, 8],  // haunch -> back
        [8, 7],  // back -> hip
        [7, 6],  // hip -> tail
        [8, 6],  // shortcut back to tail
        [2, 8],  // Algieba to back (body line)
    ],
}));

// ── Cygnus ──────────────────────────────────────────────────────────────────
// The swan / Northern Cross. One of the Summer Triangle constellation.
// RA range ~19h20m–22h, Dec range ~27°–61°.
ConstellationManifest.register(new Constellation({
    id: "cygnus",
    name: "Cygnus",
    stars: [
        { id: 0, name: "Deneb", x: 0.50, y: 0.08 }, // tail / top of cross
        { id: 1, name: "Sadr", x: 0.50, y: 0.42 }, // center of cross
        { id: 2, name: "Albireo", x: 0.50, y: 0.90 }, // head / bottom of cross (double star)
        { id: 3, name: "Epsilon Cyg", x: 0.15, y: 0.42 }, // left wing tip / Gienah
        { id: 4, name: "Delta Cyg", x: 0.30, y: 0.38 }, // left wing inner
        { id: 5, name: "Zeta Cyg", x: 0.72, y: 0.50 }, // right wing inner
        { id: 6, name: "Iota Cyg", x: 0.62, y: 0.28 }, // upper right
        { id: 7, name: "Kappa Cyg", x: 0.85, y: 0.40 }, // right wing tip
        { id: 8, name: "Nu Cyg", x: 0.40, y: 0.65 }, // neck left
        { id: 9, name: "Xi Cyg", x: 0.58, y: 0.68 }, // neck right
    ],
    lines: [
        [0, 1],  // tail -> center (spine)
        [1, 2],  // center -> head (spine)
        [3, 4],  // left wing outer
        [4, 1],  // left wing -> center
        [1, 5],  // center -> right wing inner
        [5, 7],  // right wing inner -> tip
        [0, 6],  // tail -> upper right
        [6, 1],  // upper right -> center
        [1, 8],  // center -> neck left
        [1, 9],  // center -> neck right
        [8, 2],  // neck left -> head
        [9, 2],  // neck right -> head
    ],
}));

// ── Gemini ──────────────────────────────────────────────────────────────────
// The twins. Pollux and Castor are the bright twin heads.
// RA range ~6h–8h, Dec range ~16°–33°.
ConstellationManifest.register(new Constellation({
    id: "gemini",
    name: "Gemini",
    stars: [
        { id: 0, name: "Castor", x: 0.32, y: 0.08 }, // twin head left
        { id: 1, name: "Pollux", x: 0.65, y: 0.10 }, // twin head right (brighter)
        { id: 2, name: "Alhena", x: 0.70, y: 0.55 }, // Pollux foot
        { id: 3, name: "Wasat", x: 0.48, y: 0.52 }, // center body
        { id: 4, name: "Mebsuda", x: 0.35, y: 0.45 }, // Castor knee
        { id: 5, name: "Mekbuda", x: 0.55, y: 0.38 }, // between twins
        { id: 6, name: "Mu Gem", x: 0.28, y: 0.60 }, // Castor foot inner
        { id: 7, name: "Nu Gem", x: 0.18, y: 0.72 }, // Castor foot outer / Tejat Prior
        { id: 8, name: "Eta Gem", x: 0.20, y: 0.85 }, // Tejat Posterior - foot tip
        { id: 9, name: "Xi Gem", x: 0.55, y: 0.72 }, // Pollux shin
        { id: 10, name: "Propus", x: 0.38, y: 0.82 }, // Castor toe
    ],
    lines: [
        [0, 4],  // Castor head -> knee
        [4, 6],  // knee -> foot inner
        [6, 7],  // foot inner -> outer
        [7, 8],  // foot to tip
        [6, 10], // foot branch
        [1, 5],  // Pollux head -> mid
        [5, 3],  // mid -> waist
        [3, 2],  // waist -> Alhena
        [2, 9],  // Alhena -> shin
        [4, 3],  // Castor knee -> center (body)
        [0, 1],  // heads connected
        [3, 5],  // body cross
    ],
}));

// ── Sagittarius ─────────────────────────────────────────────────────────────
// The archer / teapot. Points toward the galactic center.
// RA range ~17h40m–20h, Dec range ~-45°–-12°.
ConstellationManifest.register(new Constellation({
    id: "sagittarius",
    name: "Sagittarius",
    stars: [
        { id: 0, name: "Kaus Australis", x: 0.55, y: 0.85 }, // Epsilon - teapot bottom
        { id: 1, name: "Kaus Media", x: 0.48, y: 0.72 }, // Delta - teapot middle
        { id: 2, name: "Kaus Borealis", x: 0.40, y: 0.58 }, // Lambda - teapot top
        { id: 3, name: "Nunki", x: 0.75, y: 0.55 }, // Sigma - handle top
        { id: 4, name: "Ascella", x: 0.80, y: 0.72 }, // Zeta - handle bottom
        { id: 5, name: "Phi Sgr", x: 0.68, y: 0.82 }, // spout base
        { id: 6, name: "Delta Sgr", x: 0.48, y: 0.88 }, // Kaus Media base
        { id: 7, name: "Gamma Sgr", x: 0.32, y: 0.92 }, // Alnasl - spout tip
        { id: 8, name: "Tau Sgr", x: 0.88, y: 0.60 }, // handle curve
        { id: 9, name: "Zeta2 Sgr", x: 0.62, y: 0.42 }, // above handle
        { id: 10, name: "Eta Sgr", x: 0.25, y: 0.72 }, // spout extension
        { id: 11, name: "Pi Sgr", x: 0.22, y: 0.50 }, // archer's bow tip
    ],
    lines: [
        [7, 10],  // spout tip -> spout
        [10, 1],  // spout -> middle
        [2, 1],   // top -> middle (left side of teapot)
        [1, 0],   // middle -> bottom
        [0, 5],   // bottom -> spout base
        [5, 6],   // spout base -> Kaus base
        [6, 7],   // Kaus base -> spout tip (base of teapot)
        [0, 4],   // bottom -> handle base
        [4, 3],   // handle base -> top
        [3, 9],   // handle top -> above
        [4, 8],   // handle extra
        [2, 11],  // bow arc from top
        [11, 7],  // bow to spout
    ],
}));

// ── Perseus ──────────────────────────────────────────────────────────────────
// The hero. Contains the famous variable star Algol (the "Demon Star").
// RA range ~1h30m–4h50m, Dec range +31°–+58°.
ConstellationManifest.register(new Constellation({
    id: "perseus",
    name: "Perseus",
    stars: [
        { id: 0, name: "Mirfak", x: 0.50, y: 0.30 }, // Alpha - brightest, center
        { id: 1, name: "Algol", x: 0.22, y: 0.42 }, // Beta - demon star (eclipsing binary)
        { id: 2, name: "Gamma Per", x: 0.35, y: 0.18 }, // top cluster
        { id: 3, name: "Delta Per", x: 0.48, y: 0.12 }, // top
        { id: 4, name: "Epsilon Per", x: 0.62, y: 0.20 }, // upper right
        { id: 5, name: "Zeta Per", x: 0.70, y: 0.38 }, // right arm
        { id: 6, name: "Xi Per", x: 0.80, y: 0.28 }, // Menkib - right shoulder
        { id: 7, name: "Eta Per", x: 0.65, y: 0.08 }, // upper right tip
        { id: 8, name: "Theta Per", x: 0.35, y: 0.52 }, // left body
        { id: 9, name: "Iota Per", x: 0.55, y: 0.55 }, // lower center
        { id: 10, name: "Kappa Per", x: 0.20, y: 0.60 }, // left arm
        { id: 11, name: "Rho Per", x: 0.32, y: 0.70 }, // left leg
        { id: 12, name: "Beta Per2", x: 0.55, y: 0.75 }, // right leg
        { id: 13, name: "Omicron Per", x: 0.68, y: 0.65 }, // right knee
    ],
    lines: [
        [7, 4],   // tip -> upper right
        [4, 3],   // upper right -> top
        [3, 2],   // top cluster
        [2, 0],   // top -> Mirfak
        [0, 4],   // Mirfak -> upper right
        [4, 6],   // upper right -> shoulder
        [6, 5],   // shoulder -> arm
        [0, 5],   // Mirfak -> right arm
        [5, 9],   // right arm -> lower
        [9, 12],  // lower -> right leg
        [12, 13], // right leg -> knee
        [13, 5],  // knee -> arm
        [0, 8],   // Mirfak -> left body
        [8, 1],   // left body -> Algol
        [1, 10],  // Algol -> left arm
        [8, 11],  // left body -> left leg
    ],
}));

// ── Aquila ──────────────────────────────────────────────────────────────────
// The eagle. Altair is one of the Summer Triangle's three bright stars.
// RA range ~18h40m–20h10m, Dec range -12°–+18°.
ConstellationManifest.register(new Constellation({
    id: "aquila",
    name: "Aquila",
    stars: [
        { id: 0, name: "Altair", x: 0.50, y: 0.42 }, // brightest - eagle's neck
        { id: 1, name: "Tarazed", x: 0.40, y: 0.32 }, // Gamma - above Altair left
        { id: 2, name: "Alshain", x: 0.62, y: 0.38 }, // Beta - above Altair right
        { id: 3, name: "Delta Aql", x: 0.42, y: 0.55 }, // body below left
        { id: 4, name: "Zeta Aql", x: 0.58, y: 0.55 }, // body below right
        { id: 5, name: "Eta Aql", x: 0.34, y: 0.68 }, // tail left
        { id: 6, name: "Theta Aql", x: 0.50, y: 0.72 }, // tail center
        { id: 7, name: "Lambda Aql", x: 0.62, y: 0.78 }, // tail right
        { id: 8, name: "Epsilon Aql", x: 0.28, y: 0.42 }, // left wing tip
        { id: 9, name: "Nu Aql", x: 0.76, y: 0.48 }, // right wing
        { id: 10, name: "Xi Aql", x: 0.50, y: 0.22 }, // head
    ],
    lines: [
        [10, 1],  // head -> Tarazed
        [10, 2],  // head -> Alshain
        [1, 0],   // Tarazed -> Altair
        [2, 0],   // Alshain -> Altair
        [0, 3],   // Altair -> body left
        [0, 4],   // Altair -> body right
        [3, 5],   // body -> tail left
        [4, 7],   // body -> tail right
        [5, 6],   // tail left -> center
        [6, 7],   // tail center -> right
        [8, 1],   // left wing -> Tarazed
        [2, 9],   // Alshain -> right wing
    ],
}));

// ── Virgo ────────────────────────────────────────────────────────────────────
// The maiden. Spica is one of the brightest stars in the sky.
// RA range ~11h40m–15h10m, Dec range -22°–+14°.
ConstellationManifest.register(new Constellation({
    id: "virgo",
    name: "Virgo",
    stars: [
        { id: 0, name: "Spica", x: 0.62, y: 0.85 }, // Alpha - brightest
        { id: 1, name: "Porrima", x: 0.48, y: 0.65 }, // Gamma - famous double star
        { id: 2, name: "Zaniah", x: 0.35, y: 0.52 }, // Eta - left mid
        { id: 3, name: "Zavijava", x: 0.20, y: 0.40 }, // Beta - far left
        { id: 4, name: "Vindemiatrix", x: 0.72, y: 0.32 }, // Epsilon - upper right (grape harvester)
        { id: 5, name: "Delta Vir", x: 0.55, y: 0.42 }, // upper center
        { id: 6, name: "Zeta Vir", x: 0.65, y: 0.55 }, // right mid
        { id: 7, name: "Mu Vir", x: 0.48, y: 0.80 }, // lower center
        { id: 8, name: "Iota Vir", x: 0.38, y: 0.72 }, // lower left
        { id: 9, name: "Kappa Vir", x: 0.78, y: 0.70 }, // lower right
        { id: 10, name: "Tau Vir", x: 0.85, y: 0.48 }, // right arm tip
    ],
    lines: [
        [3, 2],   // far left -> left mid
        [2, 1],   // left mid -> center
        [1, 5],   // center -> upper center
        [5, 4],   // upper center -> Vindemiatrix
        [4, 10],  // Vindemiatrix -> right arm
        [10, 6],  // right arm -> right mid
        [5, 6],   // upper -> right mid (shoulder)
        [1, 7],   // Porrima -> lower center
        [7, 0],   // lower center -> Spica
        [0, 9],   // Spica -> lower right
        [9, 6],   // lower right -> right mid
        [1, 8],   // Porrima -> lower left
        [8, 0],   // lower left -> Spica
    ],
}));

// ── Lyra ─────────────────────────────────────────────────────────────────────
// The lyre. Vega is the brightest of the Summer Triangle and 5th brightest in the sky.
// RA range ~18h10m–19h30m, Dec range +25°–+48°.
ConstellationManifest.register(new Constellation({
    id: "lyra",
    name: "Lyra",
    stars: [
        { id: 0, name: "Vega", x: 0.50, y: 0.08 }, // Alpha - brightest, top
        { id: 1, name: "Sheliak", x: 0.30, y: 0.45 }, // Beta - lyre left-top (eclipsing binary)
        { id: 2, name: "Sulafat", x: 0.70, y: 0.45 }, // Gamma - lyre right-top
        { id: 3, name: "Delta Lyr", x: 0.28, y: 0.65 }, // lyre left-bottom (optical double)
        { id: 4, name: "Zeta Lyr", x: 0.38, y: 0.30 }, // upper left of parallelogram
        { id: 5, name: "Epsilon Lyr", x: 0.65, y: 0.28 }, // Double-double - upper right
        { id: 6, name: "Eta Lyr", x: 0.72, y: 0.65 }, // lyre right-bottom
    ],
    lines: [
        [0, 4],  // Vega -> upper left
        [0, 5],  // Vega -> upper right (Double-double)
        [4, 1],  // upper left -> Sheliak
        [5, 2],  // upper right -> Sulafat
        [1, 2],  // Sheliak -> Sulafat (top of lyre box)
        [1, 3],  // Sheliak -> left bottom
        [2, 6],  // Sulafat -> right bottom
        [3, 6],  // left bottom -> right bottom (base of lyre)
    ],
}));

// ── Hercules ─────────────────────────────────────────────────────────────────
// The hero kneeling. Contains the great globular cluster M13.
// RA range ~16h–18h40m, Dec range +12°–+51°.
ConstellationManifest.register(new Constellation({
    id: "hercules",
    name: "Hercules",
    stars: [
        { id: 0, name: "Kornephoros", x: 0.52, y: 0.28 }, // Beta - right shoulder (brightest)
        { id: 1, name: "Zeta Her", x: 0.35, y: 0.32 }, // left shoulder
        { id: 2, name: "Eta Her", x: 0.38, y: 0.20 }, // head
        { id: 3, name: "Pi Her", x: 0.60, y: 0.18 }, // right of head
        { id: 4, name: "Epsilon Her", x: 0.65, y: 0.38 }, // right body
        { id: 5, name: "Delta Her", x: 0.45, y: 0.45 }, // Sarin - center body (near M13)
        { id: 6, name: "Alpha Her", x: 0.42, y: 0.55 }, // Rasalgethi - hip
        { id: 7, name: "Theta Her", x: 0.28, y: 0.48 }, // left body
        { id: 8, name: "Iota Her", x: 0.20, y: 0.35 }, // left arm
        { id: 9, name: "Xi Her", x: 0.22, y: 0.62 }, // left leg upper
        { id: 10, name: "Mu Her", x: 0.30, y: 0.72 }, // left leg lower
        { id: 11, name: "Omicron Her", x: 0.58, y: 0.70 }, // right leg upper
        { id: 12, name: "Lambda Her", x: 0.68, y: 0.82 }, // right leg lower / foot
    ],
    lines: [
        [2, 1],   // head -> left shoulder
        [2, 3],   // head -> right
        [3, 0],   // right of head -> right shoulder
        [0, 1],   // shoulders
        [1, 5],   // left shoulder -> center body
        [0, 4],   // right shoulder -> right body
        [4, 5],   // right -> center
        [5, 6],   // center -> hip
        [1, 7],   // left shoulder -> left body
        [7, 8],   // left body -> left arm
        [7, 9],   // left body -> left leg
        [9, 10],  // left leg
        [6, 11],  // hip -> right leg
        [11, 12], // right leg -> foot
    ],
}));

// ── Boötes ───────────────────────────────────────────────────────────────────
// The herdsman. Arcturus is the 4th brightest star in the sky.
// RA range ~13h35m–15h50m, Dec range +7°–+55°.
ConstellationManifest.register(new Constellation({
    id: "bootes",
    name: "Boötes",
    stars: [
        { id: 0, name: "Arcturus", x: 0.50, y: 0.70 }, // Alpha - brightest, base
        { id: 1, name: "Izar", x: 0.40, y: 0.50 }, // Epsilon - left waist (beautiful double)
        { id: 2, name: "Eta Boo", x: 0.58, y: 0.48 }, // Muphrid - right waist
        { id: 3, name: "Beta Boo", x: 0.32, y: 0.35 }, // Nekkar - upper left
        { id: 4, name: "Gamma Boo", x: 0.62, y: 0.32 }, // Seginus - upper right
        { id: 5, name: "Delta Boo", x: 0.52, y: 0.22 }, // upper center
        { id: 6, name: "Rho Boo", x: 0.35, y: 0.20 }, // upper left cluster
        { id: 7, name: "Mu Boo", x: 0.65, y: 0.18 }, // Alkalurops - staff top right
        { id: 8, name: "Zeta Boo", x: 0.45, y: 0.58 }, // center (double star)
        { id: 9, name: "Tau Boo", x: 0.70, y: 0.58 }, // exoplanet host star - right
    ],
    lines: [
        [0, 1],  // Arcturus -> left waist
        [0, 2],  // Arcturus -> right waist
        [1, 3],  // left waist -> upper left
        [2, 4],  // right waist -> upper right
        [3, 6],  // upper left -> top left
        [4, 5],  // upper right -> top center
        [5, 6],  // top center -> top left
        [5, 7],  // top center -> staff top
        [4, 7],  // upper right -> staff
        [1, 8],  // left waist -> center
        [8, 2],  // center -> right waist
        [2, 9],  // right waist -> right
    ],
}));

// ── Auriga ───────────────────────────────────────────────────────────────────
// The charioteer. Capella is the 6th brightest star in the sky.
// RA range ~4h40m–7h30m, Dec range +28°–+56°.
ConstellationManifest.register(new Constellation({
    id: "auriga",
    name: "Auriga",
    stars: [
        { id: 0, name: "Capella", x: 0.48, y: 0.10 }, // Alpha - brightest (quadruple system)
        { id: 1, name: "Menkalinan", x: 0.72, y: 0.20 }, // Beta - second brightest
        { id: 2, name: "Mahasim", x: 0.80, y: 0.45 }, // Theta - right side
        { id: 3, name: "Delta Aur", x: 0.68, y: 0.62 }, // right lower
        { id: 4, name: "Zeta Aur", x: 0.48, y: 0.72 }, // Sadatoni - bottom (eclipsing binary)
        { id: 5, name: "Eta Aur", x: 0.28, y: 0.62 }, // left lower
        { id: 6, name: "Nu Aur", x: 0.18, y: 0.42 }, // left side
        { id: 7, name: "Iota Aur", x: 0.22, y: 0.22 }, // Hassaleh - left
        { id: 8, name: "Epsilon Aur", x: 0.38, y: 0.50 }, // Almaaz - center (long-period eclipsing binary)
    ],
    lines: [
        [0, 1],  // Capella -> Menkalinan
        [1, 2],  // Menkalinan -> right
        [2, 3],  // right -> lower right
        [3, 4],  // lower right -> bottom
        [4, 5],  // bottom -> lower left
        [5, 6],  // lower left -> left
        [6, 7],  // left -> upper left
        [7, 0],  // upper left -> Capella (close the pentagon)
        [0, 8],  // Capella -> center
        [8, 4],  // center -> bottom
        [8, 5],  // center -> lower left
    ],
}));

// ── Draco ────────────────────────────────────────────────────────────────────
// The dragon. Thuban was the pole star ~3000 BCE. A long winding constellation.
// RA range ~9h–22h (circumpolar), Dec range +51°–+86°.
ConstellationManifest.register(new Constellation({
    id: "draco",
    name: "Draco",
    stars: [
        { id: 0, name: "Eltanin", x: 0.22, y: 0.12 }, // Gamma - head, brightest
        { id: 1, name: "Rastaban", x: 0.35, y: 0.10 }, // Beta - head
        { id: 2, name: "Nodus I", x: 0.50, y: 0.18 }, // Zeta - head cluster
        { id: 3, name: "Nu Dra", x: 0.15, y: 0.22 }, // head outer (optical double)
        { id: 4, name: "Kappa Dra", x: 0.28, y: 0.30 }, // neck
        { id: 5, name: "Lambda Dra", x: 0.40, y: 0.32 }, // neck
        { id: 6, name: "Thuban", x: 0.55, y: 0.28 }, // Alpha - former pole star
        { id: 7, name: "Iota Dra", x: 0.65, y: 0.38 }, // upper body
        { id: 8, name: "Theta Dra", x: 0.72, y: 0.50 }, // body
        { id: 9, name: "Eta Dra", x: 0.68, y: 0.62 }, // body
        { id: 10, name: "Zeta Dra", x: 0.58, y: 0.70 }, // tail base
        { id: 11, name: "Phi Dra", x: 0.72, y: 0.78 }, // tail
        { id: 12, name: "Chi Dra", x: 0.82, y: 0.72 }, // tail
        { id: 13, name: "Psi Dra", x: 0.88, y: 0.60 }, // tail tip
        { id: 14, name: "Delta Dra", x: 0.42, y: 0.42 }, // upper body left
    ],
    lines: [
        [3, 0],   // head outer -> Eltanin
        [0, 1],   // head stars
        [1, 2],   // head cluster
        [0, 4],   // Eltanin -> neck
        [4, 5],   // neck
        [5, 6],   // neck -> Thuban
        [6, 2],   // Thuban -> head cluster
        [6, 7],   // Thuban -> upper body
        [5, 14],  // neck branch -> upper body left
        [14, 8],  // upper body left -> body
        [7, 8],   // upper body -> body
        [8, 9],   // body
        [9, 10],  // body -> tail base
        [10, 11], // tail
        [11, 12], // tail
        [12, 13], // tail tip
    ],
}));
