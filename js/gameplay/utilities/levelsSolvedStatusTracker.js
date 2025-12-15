/**
 * LevelsSolvedStatusTracker
 *
 * Tracks the completion status of levels in the world loader scene.
 * Manages persistence of level completion data and provides methods
 * to check and update level status.
 */
class LevelsSolvedStatusTracker {
    constructor() {
        // Debug mode - set to true for detailed logging
        this.DEBUG_MODE = false;

        // Available levels mapping (6 levels + 3 placeholders for future expansion)
        this.LEVEL_MAPPING = {
            // First 6 spheres map to actual levels
            0: { levelId: "level3Spikes", levelUrl: "level3Spikes.txt", name: "Level 3: Spikes", isAvailable: true },
            1: { levelId: "level4Spikes2", levelUrl: "level4Spikes2.txt", name: "Level 4: Spikes 2", isAvailable: true },
            2: { levelId: "level4Spikes3", levelUrl: "level4Spikes3.txt", name: "Level 4: Spikes 3", isAvailable: true },
            3: { levelId: "level4Spikes4", levelUrl: "level4Spikes4.txt", name: "Level 4: Spikes 4", isAvailable: true },
            4: { levelId: "level5TrickyB", levelUrl: "level5TrickyB.txt", name: "Level 5: Tricky B", isAvailable: true },
            5: { levelId: "level6Locks", levelUrl: "level6Locks.txt", name: "Level 6: Locks", isAvailable: true },
            // Last 3 spheres are placeholders for future levelsalse
            6: { levelId: "level7FlipsE", levelUrl: "level7FlipsE.txt", name: "Level 7 Flips", isAvailable: true },
            7: { levelId: "level8SpookyB", levelUrl: "level8SpookyB.txt", name: "Level 8 Spooky", isAvailable: true },
            8: { levelId: "level9Wow", levelUrl: "level9Wow.txt", name: "Level 9 Wow", isAvailable: true }
        };

        // Track completed levels (persisted to localStorage)
        this.completedLevels = new Set();
        this.loadCompletedLevels();

        // Track levels that have granted experience (persisted to localStorage)
        this.experienceGrantedLevels = new Set();
        this.loadExperienceGrantedLevels();

        // Callback system for level completion events
        this.completionCallbacks = new Set();

        if (this.DEBUG_MODE) console.log("[LevelsSolvedStatusTracker] Initialized with level mapping and completion tracking");
    }

    /**
     * Loads completed levels from localStorage
     */
    loadCompletedLevels() {
        try {
            const stored = localStorage.getItem('radianceRising_completedLevels');
            if (stored) {
                const completedArray = JSON.parse(stored);
                this.completedLevels = new Set(completedArray);
                if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Loaded ${this.completedLevels.size} completed levels from storage`);
            }
        } catch (error) {
            console.warn("[LevelsSolvedStatusTracker] Failed to load completed levels from storage:", error);
            this.completedLevels = new Set();
        }
    }

    /**
     * Saves completed levels to localStorage
     */
    saveCompletedLevels() {
        try {
            const completedArray = Array.from(this.completedLevels);
            localStorage.setItem('radianceRising_completedLevels', JSON.stringify(completedArray));
            if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Saved ${this.completedLevels.size} completed levels to storage`);
        } catch (error) {
            console.error("[LevelsSolvedStatusTracker] Failed to save completed levels to storage:", error);
        }
    }

    /**
     * Loads experience granted levels from localStorage
     */
    loadExperienceGrantedLevels() {
        try {
            const stored = localStorage.getItem('radianceRising_experienceGrantedLevels');
            if (stored) {
                const experienceArray = JSON.parse(stored);
                this.experienceGrantedLevels = new Set(experienceArray);
                if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Loaded ${this.experienceGrantedLevels.size} experience granted levels from storage`);
            }
        } catch (error) {
            console.warn("[LevelsSolvedStatusTracker] Failed to load experience granted levels from storage:", error);
            this.experienceGrantedLevels = new Set();
        }
    }

    /**
     * Saves experience granted levels to localStorage
     */
    saveExperienceGrantedLevels() {
        try {
            const experienceArray = Array.from(this.experienceGrantedLevels);
            localStorage.setItem('radianceRising_experienceGrantedLevels', JSON.stringify(experienceArray));
            if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Saved ${this.experienceGrantedLevels.size} experience granted levels to storage`);
        } catch (error) {
            console.error("[LevelsSolvedStatusTracker] Failed to save experience granted levels to storage:", error);
        }
    }

    /**
     * Gets level data for a specific sphere index
     * @param {number} sphereIndex - Index of the sphere (0-8)
     * @returns {Object} Level data object
     */
    getLevelData(sphereIndex) {
        return this.LEVEL_MAPPING[sphereIndex] || null;
    }

    /**
     * Checks if a level is completed
     * @param {number} sphereIndex - Index of the sphere (0-8)
     * @returns {boolean} True if level is completed
     */
    isLevelCompleted(sphereIndex) {
        const levelData = this.getLevelData(sphereIndex);
        return levelData && this.completedLevels.has(levelData.levelId);
    }

    /**
     * Checks if experience has already been granted for a level
     * @param {number} sphereIndex - Index of the sphere (0-8)
     * @returns {boolean} True if experience has been granted
     */
    hasExperienceBeenGranted(sphereIndex) {
        const levelData = this.getLevelData(sphereIndex);
        return levelData && this.experienceGrantedLevels.has(levelData.levelId);
    }

    /**
     * Marks that experience has been granted for a level
     * @param {number} sphereIndex - Index of the sphere (0-8)
     */
    markExperienceGranted(sphereIndex) {
        const levelData = this.getLevelData(sphereIndex);
        if (levelData) {
            this.experienceGrantedLevels.add(levelData.levelId);
            this.saveExperienceGrantedLevels();
            if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Marked experience granted for level ${levelData.levelId}`);
        }
    }

    /**
     * Marks a level as completed
     * @param {number} sphereIndex - Index of the sphere (0-8)
     */
    markLevelCompleted(sphereIndex) {
        const levelData = this.getLevelData(sphereIndex);
        if (levelData && levelData.isAvailable) {
            this.completedLevels.add(levelData.levelId);
            this.saveCompletedLevels();
            if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Marked level ${levelData.levelId} as completed`);

            // Trigger any completion callbacks
            this.onLevelCompleted?.(sphereIndex, levelData);

            // Notify registered callbacks
            if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Notifying ${this.completionCallbacks.size} registered callbacks`);
            this.notifyLevelCompleted(sphereIndex, levelData);
        } else {
            console.warn(`[LevelsSolvedStatusTracker] Cannot mark level as completed: sphereIndex=${sphereIndex}, levelData=${levelData}, isAvailable=${levelData?.isAvailable}`);
        }
    }

    /**
     * Gets the completion status for all levels
     * @returns {Object} Object mapping sphere indices to completion status
     */
    getAllCompletionStatus() {
        const status = {};
        for (let i = 0; i < 9; i++) {
            status[i] = {
                levelData: this.getLevelData(i),
                isCompleted: this.isLevelCompleted(i)
            };
        }
        return status;
    }

    /**
     * Gets the count of completed levels
     * @returns {number} Number of completed levels
     */
    getCompletedCount() {
        return this.completedLevels.size;
    }

    /**
     * Gets the count of available levels
     * @returns {number} Number of available levels
     */
    getAvailableCount() {
        return Object.values(this.LEVEL_MAPPING).filter(level => level.isAvailable).length;
    }

    /**
     * Registers a callback to be called when a level is completed
     * @param {Function} callback - Function to call with (sphereIndex, levelData)
     */
    registerCompletionCallback(callback) {
        this.completionCallbacks.add(callback);
    }

    /**
     * Unregisters a completion callback
     * @param {Function} callback - The callback function to remove
     */
    unregisterCompletionCallback(callback) {
        this.completionCallbacks.delete(callback);
    }

    /**
     * Notifies all registered callbacks of level completion
     * @param {number} sphereIndex - Index of completed sphere
     * @param {Object} levelData - Data of completed level
     */
    notifyLevelCompleted(sphereIndex, levelData) {
        if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Calling ${this.completionCallbacks.size} completion callbacks`);
        this.completionCallbacks.forEach((callback, index) => {
            try {
                if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Calling callback ${index + 1}`);
                callback(sphereIndex, levelData);
            } catch (error) {
                console.error("[LevelsSolvedStatusTracker] Error in completion callback:", error);
            }
        });
    }

    /**
     * Resets all progress (for debugging/testing)
     */
    resetAllProgress() {
        if (this.DEBUG_MODE) console.log("[LevelsSolvedStatusTracker] Resetting all progress - before:", Array.from(this.completedLevels));
        this.completedLevels.clear();
        this.saveCompletedLevels();
        if (this.DEBUG_MODE) console.log("[LevelsSolvedStatusTracker] All progress reset - after:", Array.from(this.completedLevels));
    }

    /**
     * Callback that can be set to handle level completion events
     * @param {number} sphereIndex - Index of completed sphere
     * @param {Object} levelData - Data of completed level
     */
    onLevelCompleted(sphereIndex, levelData) {
        // Override this method to handle level completion events
        if (this.DEBUG_MODE) console.log(`[LevelsSolvedStatusTracker] Level completed: ${levelData.name} (sphere ${sphereIndex})`);
    }
}

// Create a global instance
const levelsSolvedStatusTracker = new LevelsSolvedStatusTracker();
