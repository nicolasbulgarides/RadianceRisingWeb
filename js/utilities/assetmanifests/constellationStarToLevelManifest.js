/**
 * ConstellationStarToLevelManifest
 *
 * Maps every constellation star (by constellation ID + star ID) to a level.
 * Orion's 9 stars are paired 1-to-1 with the 9 demo levels (matching sphere
 * indices 0–8 from SequentialLevelLoader.initializeWorldLevelMapping).
 * Every other star across all constellations has a placeholder level entry,
 * ready to be replaced when new levels are created.
 *
 * Total registered stars: 181
 *   Orion(9)  Ursa Major(10)  Ursa Minor(7)   Cassiopeia(7)   Scorpius(15)
 *   Leo(10)   Cygnus(10)      Gemini(11)       Sagittarius(12) Perseus(14)
 *   Aquila(11) Virgo(11)      Lyra(7)          Hercules(13)    Boötes(10)
 *   Auriga(9)  Draco(15)
 *
 * Usage:
 *   ConstellationStarToLevelManifest.get("orion", 0)
 *   // → { levelId: "level3Spikes", levelName: "Level 3: Spikes", isPlaceholder: false }
 *
 *   ConstellationStarToLevelManifest.get("ursa_major", 3)
 *   // → { levelId: "placeholder_ursa_major_3", levelName: "Megrez (Ursa Major)", isPlaceholder: true }
 *
 *   ConstellationStarToLevelManifest.getForConstellation("lyra")
 *   // → array of 7 level-mapping entries
 */
class ConstellationStarToLevelManifest {

    /**
     * Core mapping.  Keyed by constellationId, then by starId (number).
     * Each entry: { levelId: string, levelName: string, isPlaceholder: boolean }
     */
    static _map = (() => {
        const m = {};

        // ── Helper to build a placeholder entry ─────────────────────────────
        const ph = (constellationId, starId, starName, constellationDisplayName) => ({
            levelId: `placeholder_${constellationId}_${starId}`,
            levelName: `${starName} (${constellationDisplayName})`,
            isPlaceholder: true,
        });

        // ── Helper to build a real level entry ───────────────────────────────
        const real = (levelId, levelName) => ({
            levelId,
            levelName,
            isPlaceholder: false,
        });

        // ════════════════════════════════════════════════════════════════════
        // ORION  (9 stars — maps 1-to-1 with the 9 demo levels, sphere 0–8)
        // ════════════════════════════════════════════════════════════════════
        m["orion"] = {
            0: real("level3Spikes",  "Level 3: Spikes"),        // Betelgeuse
            1: real("level4Spikes2", "Level 4: Spikes 2"),      // Bellatrix
            2: real("level4Spikes3", "Level 4: Spikes 3"),      // Alnitak
            3: real("level4Spikes4", "Level 4: Spikes 4"),      // Alnilam
            4: real("level5TrickyB", "Level 5: Tricky B"),      // Mintaka
            5: real("level6Locks",   "Level 6: Locks"),         // Saiph
            6: real("level7FlipsE",  "Level 7: Flips E"),       // Rigel
            7: real("level8SpookyB", "Level 8: Spooky B"),      // Meissa
            8: real("level9Wow",     "Level 9: Wow"),           // Hatsya
        };

        // ════════════════════════════════════════════════════════════════════
        // URSA MAJOR  (10 stars)
        // ════════════════════════════════════════════════════════════════════
        const ursaMajorStars = [
            "Dubhe", "Merak", "Phecda", "Megrez", "Alioth",
            "Mizar", "Alkaid", "Talitha", "Tania Bor.", "Muscida",
        ];
        m["ursa_major"] = {};
        ursaMajorStars.forEach((name, i) => {
            m["ursa_major"][i] = ph("ursa_major", i, name, "Ursa Major");
        });

        // ════════════════════════════════════════════════════════════════════
        // URSA MINOR  (7 stars)
        // ════════════════════════════════════════════════════════════════════
        const ursaMinorStars = [
            "Polaris", "Yildun", "Epsilon UMi", "Zeta UMi",
            "Eta UMi", "Beta UMi", "Gamma UMi",
        ];
        m["ursa_minor"] = {};
        ursaMinorStars.forEach((name, i) => {
            m["ursa_minor"][i] = ph("ursa_minor", i, name, "Ursa Minor");
        });

        // ════════════════════════════════════════════════════════════════════
        // CASSIOPEIA  (7 stars)
        // ════════════════════════════════════════════════════════════════════
        const cassiopeiaStars = [
            "Schedar", "Caph", "Gamma Cas", "Ruchbah",
            "Segin", "Eta Cas", "Zeta Cas",
        ];
        m["cassiopeia"] = {};
        cassiopeiaStars.forEach((name, i) => {
            m["cassiopeia"][i] = ph("cassiopeia", i, name, "Cassiopeia");
        });

        // ════════════════════════════════════════════════════════════════════
        // SCORPIUS  (15 stars)
        // ════════════════════════════════════════════════════════════════════
        const scorpiusStars = [
            "Antares", "Sigma Sco", "Alpha Sco2", "Nu Sco", "Beta Sco",
            "Rho Oph", "Tau Sco", "Epsilon Sco", "Mu Sco", "Zeta Sco",
            "Eta Sco", "Theta Sco", "Iota Sco", "Kappa Sco", "Lambda Sco",
        ];
        m["scorpius"] = {};
        scorpiusStars.forEach((name, i) => {
            m["scorpius"][i] = ph("scorpius", i, name, "Scorpius");
        });

        // ════════════════════════════════════════════════════════════════════
        // LEO  (10 stars)
        // ════════════════════════════════════════════════════════════════════
        const leoStars = [
            "Regulus", "Eta Leo", "Gamma Leo", "Zeta Leo", "Mu Leo",
            "Epsilon Leo", "Denebola", "Beta Leo", "Delta Leo", "Theta Leo",
        ];
        m["leo"] = {};
        leoStars.forEach((name, i) => {
            m["leo"][i] = ph("leo", i, name, "Leo");
        });

        // ════════════════════════════════════════════════════════════════════
        // CYGNUS  (10 stars)
        // ════════════════════════════════════════════════════════════════════
        const cygnusStars = [
            "Deneb", "Sadr", "Albireo", "Epsilon Cyg", "Delta Cyg",
            "Zeta Cyg", "Iota Cyg", "Kappa Cyg", "Nu Cyg", "Xi Cyg",
        ];
        m["cygnus"] = {};
        cygnusStars.forEach((name, i) => {
            m["cygnus"][i] = ph("cygnus", i, name, "Cygnus");
        });

        // ════════════════════════════════════════════════════════════════════
        // GEMINI  (11 stars)
        // ════════════════════════════════════════════════════════════════════
        const geminiStars = [
            "Castor", "Pollux", "Alhena", "Wasat", "Mebsuda",
            "Mekbuda", "Mu Gem", "Nu Gem", "Eta Gem", "Xi Gem", "Propus",
        ];
        m["gemini"] = {};
        geminiStars.forEach((name, i) => {
            m["gemini"][i] = ph("gemini", i, name, "Gemini");
        });

        // ════════════════════════════════════════════════════════════════════
        // SAGITTARIUS  (12 stars)
        // ════════════════════════════════════════════════════════════════════
        const sagittariusStars = [
            "Kaus Australis", "Kaus Media", "Kaus Borealis", "Nunki", "Ascella",
            "Phi Sgr", "Delta Sgr", "Gamma Sgr", "Tau Sgr", "Zeta2 Sgr",
            "Eta Sgr", "Pi Sgr",
        ];
        m["sagittarius"] = {};
        sagittariusStars.forEach((name, i) => {
            m["sagittarius"][i] = ph("sagittarius", i, name, "Sagittarius");
        });

        // ════════════════════════════════════════════════════════════════════
        // PERSEUS  (14 stars)
        // ════════════════════════════════════════════════════════════════════
        const perseusStars = [
            "Mirfak", "Algol", "Gamma Per", "Delta Per", "Epsilon Per",
            "Zeta Per", "Xi Per", "Eta Per", "Theta Per", "Iota Per",
            "Kappa Per", "Rho Per", "Beta Per2", "Omicron Per",
        ];
        m["perseus"] = {};
        perseusStars.forEach((name, i) => {
            m["perseus"][i] = ph("perseus", i, name, "Perseus");
        });

        // ════════════════════════════════════════════════════════════════════
        // AQUILA  (11 stars)
        // ════════════════════════════════════════════════════════════════════
        const aquilaStars = [
            "Altair", "Tarazed", "Alshain", "Delta Aql", "Zeta Aql",
            "Eta Aql", "Theta Aql", "Lambda Aql", "Epsilon Aql", "Nu Aql", "Xi Aql",
        ];
        m["aquila"] = {};
        aquilaStars.forEach((name, i) => {
            m["aquila"][i] = ph("aquila", i, name, "Aquila");
        });

        // ════════════════════════════════════════════════════════════════════
        // VIRGO  (11 stars)
        // ════════════════════════════════════════════════════════════════════
        const virgoStars = [
            "Spica", "Porrima", "Zaniah", "Zavijava", "Vindemiatrix",
            "Delta Vir", "Zeta Vir", "Mu Vir", "Iota Vir", "Kappa Vir", "Tau Vir",
        ];
        m["virgo"] = {};
        virgoStars.forEach((name, i) => {
            m["virgo"][i] = ph("virgo", i, name, "Virgo");
        });

        // ════════════════════════════════════════════════════════════════════
        // LYRA  (7 stars)
        // ════════════════════════════════════════════════════════════════════
        const lyraStars = [
            "Vega", "Sheliak", "Sulafat", "Delta Lyr",
            "Zeta Lyr", "Epsilon Lyr", "Eta Lyr",
        ];
        m["lyra"] = {};
        lyraStars.forEach((name, i) => {
            m["lyra"][i] = ph("lyra", i, name, "Lyra");
        });

        // ════════════════════════════════════════════════════════════════════
        // HERCULES  (13 stars)
        // ════════════════════════════════════════════════════════════════════
        const herculesStars = [
            "Kornephoros", "Zeta Her", "Eta Her", "Pi Her", "Epsilon Her",
            "Delta Her", "Alpha Her", "Theta Her", "Iota Her", "Xi Her",
            "Mu Her", "Omicron Her", "Lambda Her",
        ];
        m["hercules"] = {};
        herculesStars.forEach((name, i) => {
            m["hercules"][i] = ph("hercules", i, name, "Hercules");
        });

        // ════════════════════════════════════════════════════════════════════
        // BOÖTES  (10 stars)
        // ════════════════════════════════════════════════════════════════════
        const bootesStars = [
            "Arcturus", "Izar", "Eta Boo", "Beta Boo", "Gamma Boo",
            "Delta Boo", "Rho Boo", "Mu Boo", "Zeta Boo", "Tau Boo",
        ];
        m["bootes"] = {};
        bootesStars.forEach((name, i) => {
            m["bootes"][i] = ph("bootes", i, name, "Boötes");
        });

        // ════════════════════════════════════════════════════════════════════
        // AURIGA  (9 stars)
        // ════════════════════════════════════════════════════════════════════
        const aurigaStars = [
            "Capella", "Menkalinan", "Mahasim", "Delta Aur", "Zeta Aur",
            "Eta Aur", "Nu Aur", "Iota Aur", "Epsilon Aur",
        ];
        m["auriga"] = {};
        aurigaStars.forEach((name, i) => {
            m["auriga"][i] = ph("auriga", i, name, "Auriga");
        });

        // ════════════════════════════════════════════════════════════════════
        // DRACO  (15 stars)
        // ════════════════════════════════════════════════════════════════════
        const dracoStars = [
            "Eltanin", "Rastaban", "Nodus I", "Nu Dra", "Kappa Dra",
            "Lambda Dra", "Thuban", "Iota Dra", "Theta Dra", "Eta Dra",
            "Zeta Dra", "Phi Dra", "Chi Dra", "Psi Dra", "Delta Dra",
        ];
        m["draco"] = {};
        dracoStars.forEach((name, i) => {
            m["draco"][i] = ph("draco", i, name, "Draco");
        });

        return m;
    })();

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Returns the level mapping for a single star.
     * @param {string} constellationId  e.g. "orion"
     * @param {number} starId           star index within that constellation
     * @returns {{ levelId: string, levelName: string, isPlaceholder: boolean } | null}
     */
    static get(constellationId, starId) {
        return ConstellationStarToLevelManifest._map[constellationId]?.[starId] ?? null;
    }

    /**
     * Returns all star→level mappings for a given constellation as an array,
     * ordered by star ID.
     * @param {string} constellationId
     * @returns {Array<{ starId: number, levelId: string, levelName: string, isPlaceholder: boolean }>}
     */
    static getForConstellation(constellationId) {
        const entries = ConstellationStarToLevelManifest._map[constellationId];
        if (!entries) return [];
        return Object.entries(entries)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([starId, data]) => ({ starId: Number(starId), ...data }));
    }

    /**
     * Returns every registered constellation ID.
     * @returns {string[]}
     */
    static getAllConstellationIds() {
        return Object.keys(ConstellationStarToLevelManifest._map);
    }
}
