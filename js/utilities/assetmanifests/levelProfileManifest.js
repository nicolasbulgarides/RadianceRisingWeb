/**
 * LevelProfileManifest manages level metadata including URLs, difficulty metrics, and obstacle information.
 * This provides a centralized registry for all game levels and their properties.
 */
class LevelProfileManifest {
    // Base URL for all level data files
    static baseUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/";

    /**
     * Level profiles containing metadata for each level
     * Each profile includes:
     * - levelId: Unique identifier for the level
     * - filename: Name of the level data file
     * - perfectSolutionMovementCount: Optimal number of moves to complete the level
     * - obstacles: Array of obstacle types present in the level (for UI display)
     */
    static levelProfiles = {
        levelVoyage1: {
            levelId: "levelVoyage1",
            filename: "levelVoyage1.txt",
            perfectSolutionMovementCount: 12,
            obstacles: ["mountain"]
        },
        level0Test2: {
            levelId: "level0Test2",
            filename: "level0Test2.txt",
            perfectSolutionMovementCount: 12,
            obstacles: ["mountain"]
        },
        level2Test: {
            levelId: "level2Test",
            filename: "level2Test.txt",
            perfectSolutionMovementCount: 15,
            obstacles: ["mountain"]
        },
        level3Spikes: {
            levelId: "level3Spikes",
            filename: "level3Spikes.txt",
            perfectSolutionMovementCount: 11,
            obstacles: ["mountain", "spike"],
            solutionPath: [
                "UP",
                "RIGHT",
                "DOWN",
                "LEFT",
                "UP",
                "LEFT",
                "DOWN",
                "UP",
                "RIGHT",
                "UP",
                "DOWN"
            ]
        },
        level4Spikes2: {
            levelId: "level4Spikes2",
            filename: "level4Spikes2.txt",
            perfectSolutionMovementCount: 8,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "UP",
                "RIGHT",
                "DOWN",
                "LEFT",
                "DOWN",
                "LEFT",
                "UP",
                "RIGHT",
                "DOWN",
            ]
        },
        level4Spikes3: {
            levelId: "level4Spikes3",
            filename: "level4Spikes3.txt",
            perfectSolutionMovementCount: 13,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "UP",
                "DOWN",
                "RIGHT",
                "UP",
                "RIGHT",
                "DOWN",
                "LEFT",
                "UNLOCK",
                "LEFT",
                "DOWN",
                "RIGHT",
                "UP",
                "LEFT",

            ]
        },
        level4Spikes4: {
            levelId: "level4Spikes4",
            filename: "level4Spikes4D.txt",
            perfectSolutionMovementCount: 18,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "LEFT",
                "UP",
                "LEFT",
                "DOWN",
                "RIGHT",
                "DOWN",
                "RIGHT",
                "LEFT",
                "UP",
                "LEFT",
                "DOWN",
                "UNLOCK",
                "DOWN",
                "LEFT",
                "UP",
                "RIGHT",
                "UP",
                "LEFT"
            ]
        },
        level5TrickyB: {
            levelId: "level5TrickyB",
            filename: "level5TrickyB.txt",
            perfectSolutionMovementCount: 8,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "RIGHT",
                "UP",
                "LEFT",
                "DOWN",
                "RIGHT",
                "DOWN",
                "RIGHT",
                "UP"
            ]
        },
        level6Locks: {
            levelId: "level6Locks",
            filename: "level6Locks.txt",
            perfectSolutionMovementCount: 15,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "DOWN",
                "LEFT",
                "UP",
                "DOWN",
                "RIGHT",
                "UP",
                "RIGHT",
                "DOWN",
                "LEFT",
                "RIGHT",
                "DOWN",
                "UNLOCK",
                "DOWN",
                "LEFT",
                "UP"
            ]
        },
        level7FlipsE: {
            levelId: "level7FlipsE",
            filename: "level7FlipsE.txt",
            perfectSolutionMovementCount: 10,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "DOWN",
                "RIGHT",
                "UP",
                "RIGHT",
                "UP",
                "DOWN",
                "LEFT",
                "DOWN",
                "UP",
                "RIGHT"
            ]
        },
        level8SpookyB: {
            levelId: "level8SpookyB",
            filename: "level8SpookyB.txt",
            perfectSolutionMovementCount: 14,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "LEFT",
                "UP",
                "RIGHT",
                "LEFT",
                "UP",
                "DOWN",
                "RIGHT",
                "DOWN",
                "RIGHT",
                "UP",
                "LEFT",
                "RIGHT",
                "UNLOCK",
                "LEFT"
            ]
        },
        level9Wow: {
            levelId: "level9Wow",
            filename: "level9Wow.txt",
            perfectSolutionMovementCount: 16,
            obstacles: ["mountain", "spike", "lock"],
            solutionPath: [
                "RIGHT",
                "UP",
                "RIGHT",
                "DOWN",
                "RIGHT",
                "DOWN",
                "LEFT",
                "UP",
                "LEFT",
                "DOWN",
                "LEFT",
                "UP",
                "RIGHT",
                "UP",
                "UNLOCK",
                "UP"
            ]
        }
    }

    /**
     * Retrieves the full URL for a level's data file
     * @param {string} levelId - The unique identifier for the level
     * @returns {string|null} The full URL to the level data file, or null if level not found
     */
    static getLevelUrl(levelId) {
        const profile = this.levelProfiles[levelId];
        if (!profile) {
            console.warn(`[LEVEL PROFILE MANIFEST] Level not found: ${levelId}`);
            return null;
        }
        return this.baseUrl + profile.filename;
    }

    /**
     * Retrieves the complete profile for a level
     * @param {string} levelId - The unique identifier for the level
     * @returns {Object|null} The level profile object, or null if not found
     */
    static getLevelProfile(levelId) {
        const profile = this.levelProfiles[levelId];
        if (!profile) {
            console.warn(`[LEVEL PROFILE MANIFEST] Level profile not found: ${levelId}`);
            return null;
        }
        return { ...profile }; // Return a copy to prevent modification
    }

    /**
     * Gets all available level IDs
     * @returns {Array<string>} Array of all level IDs
     */
    static getAllLevelIds() {
        return Object.keys(this.levelProfiles);
    }

    /**
     * Fetches JSON level data from a URL
     * @param {string} url - The URL to fetch the level JSON data from
     * @returns {Promise<Object>} The parsed JSON level data
     * @throws {Error} If the fetch fails or the response is not valid JSON
     */
    static async fetchLevelJsonFromUrl(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch level data: ${response.status} ${response.statusText}`);
            }

            const levelJsonData = await response.json();
            return levelJsonData;
        } catch (error) {
            console.error("[LEVEL PROFILE MANIFEST] Error fetching level JSON from URL:", error);
            throw error;
        }
    }

    /**
     * Fetches level data by level ID using the manifest
     * @param {string} levelId - The unique identifier for the level
     * @returns {Promise<Object>} The parsed JSON level data
     * @throws {Error} If the level is not found or fetch fails
     */
    static async fetchLevelById(levelId) {
        const url = this.getLevelUrl(levelId);
        if (!url) {
            throw new Error(`Level not found in manifest: ${levelId}`);
        }
        console.log(`[LEVEL PROFILE MANIFEST] Fetching level ${levelId} from ${url}`);
        return await this.fetchLevelJsonFromUrl(url);
    }

    /**
     * Gets the perfect solution movement count for a level
     * @param {string} levelId - The unique identifier for the level
     * @returns {number|null} The perfect solution movement count, or null if not found
     */
    static getPerfectSolutionMovementCount(levelId) {
        const profile = this.levelProfiles[levelId];
        return profile ? profile.perfectSolutionMovementCount : null;
    }

    /**
     * Gets the obstacles for a level
     * @param {string} levelId - The unique identifier for the level
     * @returns {Array<string>|null} Array of obstacle types, or null if not found
     */
    static getLevelObstacles(levelId) {
        const profile = this.levelProfiles[levelId];
        return profile ? [...profile.obstacles] : null; // Return a copy
    }
}

// Expose the class globally
window.LevelProfileManifest = LevelProfileManifest;


