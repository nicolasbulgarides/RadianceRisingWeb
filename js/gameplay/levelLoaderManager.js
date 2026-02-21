// Global debug flags for LevelLoaderManager
const LEVEL_LOADER_DEBUG = false;
const MUSIC_DEBUG = false;
const LEVEL_LOADING_DEBUG = false;
const OBSTACLE_CREATION_DEBUG = false;
const SPIKE_CREATION_DEBUG = false;
const STARDUST_CREATION_DEBUG = false;
const STARDUST_VERIFICATION_DEBUG = false;
const HEART_CREATION_DEBUG = false;
const KEY_CREATION_DEBUG = false;
const LEVEL_AUDIT_DEBUG = false;

class LevelLoaderManager {
    constructor() {
        // Initialize loading screen instance
        this.loadingScreen = null;
        this.initializeLoadingScreen();

        // Debug logging methods
        this.levelLoaderDebugLog = (...args) => {
            if (LEVEL_LOADER_DEBUG) console.log("[LEVEL LOADER]", ...args);
        };

        this.spikeCreationDebugLog = (...args) => {
            if (SPIKE_CREATION_DEBUG) console.log("[SPIKE CREATION]", ...args);
        };

        this.stardustCreationDebugLog = (...args) => {
            if (STARDUST_CREATION_DEBUG) console.log("[STARDUST CREATION]", ...args);
        };

        this.stardustVerificationDebugLog = (...args) => {
            if (STARDUST_VERIFICATION_DEBUG) console.log("[STARDUST VERIFICATION]", ...args);
        };

        this.heartCreationDebugLog = (...args) => {
            if (HEART_CREATION_DEBUG) console.log("[HEART CREATION]", ...args);
        };

        this.musicDebugLog = (...args) => {
            if (MUSIC_DEBUG) console.log("[MUSIC]", ...args);
        };

        this.levelLoadingDebugLog = (...args) => {
            if (LEVEL_LOADING_DEBUG) console.log("[LEVEL LOADING]", ...args);
        };

        this.obstacleCreationDebugLog = (...args) => {
            if (OBSTACLE_CREATION_DEBUG) console.log("[OBSTACLE CREATION]", ...args);
        };

        this.keyCreationDebugLog = (...args) => {
            if (KEY_CREATION_DEBUG) console.log("[KEY CREATION]", ...args);
        };

        this.levelAuditDebugLog = (...args) => {
            if (LEVEL_AUDIT_DEBUG) console.log("[LEVEL AUDIT]", ...args);
        };

        // Track which level number we're loading (for music selection)
        this.currentLevelNumber = 0; // 0 = first level, 1 = second level, etc.

        // Initialize level auditor for pathfinding analysis
        this.levelAuditor = null;
        this.initializeLevelAuditor();
    }

    /**
     * Initializes the level auditor if available.
     */
    initializeLevelAuditor() {
        this.levelLoaderDebugLog("🏗️ Attempting to initialize level auditor...");
        this.levelLoaderDebugLog("LevelAuditor global type:", typeof LevelAuditor);
        if (typeof LevelAuditor !== "undefined") {
            this.levelLoaderDebugLog("✅ LevelAuditor available, creating instance...");
            this.levelAuditor = new LevelAuditor();
            this.levelLoaderDebugLog("✅ Level auditor instance created:", !!this.levelAuditor);
        } else {
            this.levelLoaderDebugLog("❌ LevelAuditor not available globally");
        }
    }

    /**
     * Gets or creates the level auditor instance.
     * @returns {LevelAuditor|null} The level auditor instance or null if not available.
     */
    getLevelAuditor() {
        if (!this.levelAuditor && typeof LevelAuditor !== "undefined") {
            this.initializeLevelAuditor();
        }
        return this.levelAuditor;
    }

    /**
     * Initializes the loading screen if available.
     */
    initializeLoadingScreen() {
        if (typeof LoadingScreen !== "undefined") {
            this.loadingScreen = new LoadingScreen();
        }
    }

    /**
     * Gets or creates the loading screen instance.
     * @returns {LoadingScreen|null} The loading screen instance or null if not available.
     */
    getLoadingScreen() {
        // Try to initialize if not already done
        if (!this.loadingScreen && typeof LoadingScreen !== "undefined") {
            this.initializeLoadingScreen();
        }
        return this.loadingScreen;
    }

    logFailedToLoadLevel() {
        GameplayLogger.lazyLog("Failed to load level");
        // Stop loading screen even on failure
        const loadingScreen = this.getLoadingScreen();
        if (loadingScreen) {
            loadingScreen.stop();
        }
    }

    logFailedToRenderLevel() {
        GameplayLogger.lazyLog("Failed to render level");
        // Stop loading screen even on failure
        const loadingScreen = this.getLoadingScreen();
        if (loadingScreen) {
            loadingScreen.stop();
        }
    }

    async loadTilesAndFactorySupportSystems() {
        await FundamentalSystemBridge[
            "levelFactoryComposite"
        ].loadFactorySupportSystems();

    }
    /**
     * Loads a basic test level, the player, and renders the level
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance to process orders for.
     */
    async loadLevelTest2(gameplayManager) {
        // Get loading screen instance once for the entire function
        const loadingScreen = this.getLoadingScreen();

        // Start loading screen before anything else
        if (loadingScreen) {
            loadingScreen.start();
        }

        await this.loadTilesAndFactorySupportSystems();
        let gameplayLevel = await this.loadLevelAndPlayer(gameplayManager);

        if (!gameplayLevel) {
            this.logFailedToLoadLevel();
        }

        let finalizedRendering = await FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(
            gameplayLevel
        );

        if (!finalizedRendering) {
            this.logFailedToRenderLevel();
        }
        gameplayManager.setActiveGameplayLevel(gameplayLevel);

        // Preload essential sounds to eliminate latency during gameplay
        this.levelLoaderDebugLog(" Loading initial sounds...");
        const soundEffectsManager = FundamentalSystemBridge["soundEffectsManager"];
        if (soundEffectsManager && gameplayLevel.hostingScene) {
            await soundEffectsManager.loadInitialSounds(gameplayLevel.hostingScene);
            this.levelLoaderDebugLog(" Initial sounds loaded");
        }

        loadingScreen.destroy();

        // Start music on loop (only if audio has been unlocked by user interaction)
        // First level plays "crystalVoyage", all subsequent levels play "duskReverie"
        const musicManager = FundamentalSystemBridge["musicManager"];
        const activeScene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
        if (musicManager && activeScene && Config.audioHasBeenUnlocked) {
            const songName = this.currentLevelNumber === 0 ? "crystalVoyage" : "duskReverie";
            this.musicDebugLog(`Starting ${songName} music for level ${this.currentLevelNumber}`);
            await musicManager.playSong(activeScene, songName, true, true);
            this.musicDebugLog(`✓ Started ${songName} music on loop`);

            // Increment level number for next level
            this.currentLevelNumber++;
        } else if (musicManager && activeScene && !Config.audioHasBeenUnlocked) {
            this.levelLoaderDebugLog(" Skipping music start - waiting for user interaction to unlock audio");
        } else {
            if (MUSIC_DEBUG) console.warn(`[MUSIC] Cannot start music - musicManager:${!!musicManager}, scene:${!!activeScene}`);
        }

    }

    async loadLevelTest1(gameplayManager) {
        await this.loadTilesAndFactorySupportSystems();

        // Load level using the LevelProfileManifest
        // Available levels: level0Test2, level2Test, level3Spikes, level4Spikes2
        const levelId = "level3Spikes";

        try {
            const levelJsonData = await LevelProfileManifest.fetchLevelById(levelId);
            return await this.receiveLevelMapFromServer(gameplayManager, levelJsonData, levelId);
        } catch (error) {
            if (LEVEL_LOADING_DEBUG) console.error(`[LEVEL LOADING] Error loading level ${levelId}:`, error);
            this.logFailedToLoadLevel();
            return null;
        }
    }

    /**
     * Loads a level from JSON data received from the server/GUI
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {Object|string} levelJsonData - The level JSON data (object or JSON string)
     */

    /**
     * Fetches level JSON from a URL and loads it into the game
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {string} url - The URL to fetch the level JSON data from
     * @param {string} [levelId] - Optional level ID to use instead of deriving from JSON
     * @returns {Promise<ActiveGameplayLevel|null>} The loaded gameplay level or null if loading failed
     */
    async loadLevelFromUrl(gameplayManager, url, levelId = null) {
        this.levelLoadingDebugLog(`loadLevelFromUrl called with levelId: ${levelId}, url: ${url}`);
        try {
            const levelJsonData = await LevelProfileManifest.fetchLevelJsonFromUrl(url);
            this.levelLoadingDebugLog(`Fetched JSON data, calling receiveLevelMapFromServer with levelId: ${levelId}`);
            return await this.receiveLevelMapFromServer(gameplayManager, levelJsonData, levelId);
        } catch (error) {
            if (LEVEL_LOADING_DEBUG) console.error("[LEVEL LOADING] Error loading level from URL:", error);
            this.logFailedToLoadLevel();
            return null;
        }
    }

    getLevelDepth(levelData) {
        return levelData?.mapHeight || levelData?.mapDepth || levelData?.depth || 21;
    }


    /**
     * Loads a level from JSON data received from the server/GUI
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager instance
     * @param {Object|string} levelJsonData - The level JSON data (object or JSON string)
     * @param {string} [levelId] - Optional level ID from manifest (for proper level identification)
     */
    async receiveLevelMapFromServer(gameplayManager, levelJsonData, levelId) {
        this.levelLoadingDebugLog(`receiveLevelMapFromServer called with levelId: ${levelId}`);
        // Get loading screen instance
        const loadingScreen = this.getLoadingScreen();

        // Start loading screen before anything else
        if (loadingScreen) {
            loadingScreen.start();
        }

        // CRITICAL: Reset flags for new level to allow player loading
        // This ensures the main player can be loaded and clears death-related flags
        if (gameplayManager && gameplayManager.resetForNewLevel) {
            gameplayManager.resetForNewLevel();
        }

        // Reset death-related flags for the new level
        const levelResetHandler = FundamentalSystemBridge["levelResetHandler"];
        if (levelResetHandler) {
            levelResetHandler.hasEverDied = false;
            levelResetHandler.isResetting = false;
            levelResetHandler.playerDiedThisAttempt = false;
        }

        // Reset replay manager for new level
        const replayManager = FundamentalSystemBridge["levelReplayManager"];
        if (replayManager) {
            replayManager.duplicatePlayerCreationBlocked = false;
        }

        // Reset pickup streak/experience for the new level so 4th pickup logic re-triggers
        const specialOccurrenceManager = FundamentalSystemBridge["specialOccurrenceManager"];
        specialOccurrenceManager?.pickupOccurrenceSubManager?.resetPickupProgress?.();

        // Clear microevents for clean level state (except for the current level if levelId is provided)
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (microEventManager) {
            // If we have a specific levelId, clear all other levels. Otherwise clear everything.
            const keepLevelId = levelId || null;
            microEventManager.clearMicroEventsExceptForLevel(keepLevelId);
            this.levelLoadingDebugLog(`Cleared microevents, keeping level: ${keepLevelId}`);
        }

        try {
            // Parse JSON if it's a string
            let levelData = typeof levelJsonData === 'string'
                ? JSON.parse(levelJsonData)
                : levelJsonData;

            this.levelLoadingDebugLog(`Level data parsed. levelName: ${levelData.levelName}, allMapElements count: ${levelData.allMapElements?.length || 0}`);
            if (levelData.allMapElements) {
                const elementCounts = {};
                levelData.allMapElements.forEach(el => {
                    elementCounts[el.element] = (elementCounts[el.element] || 0) + 1;
                });
                this.levelLoadingDebugLog(`Element counts:`, elementCounts);
            }

            // Load factory support systems
            await this.loadTilesAndFactorySupportSystems();

            // Parse the level data and create LevelDataComposite
            let levelDataComposite = this.parseLevelJsonToComposite(levelData, levelId);

            if (!levelDataComposite) {
                this.logFailedToLoadLevel();
                return null;
            }

            // Create obstacles from the level data
            let obstacles = this.createObstaclesFromLevelData(levelData);
            if (obstacles.length > 0) {
                levelDataComposite.obstacles = obstacles;
                // Also store in levelGameplayTraitsData.featuredObjects for compatibility
                // But avoid duplication - check if obstacles already exist
                if (!levelDataComposite.levelGameplayTraitsData.featuredObjects) {
                    levelDataComposite.levelGameplayTraitsData.featuredObjects = [];
                }
                // Only add obstacles that aren't already in featuredObjects
                const existingObstacleIds = new Set(
                    levelDataComposite.levelGameplayTraitsData.featuredObjects
                        .filter(obj => obj.isObstacle)
                        .map(obj => obj.nickname)
                );
                const newObstacles = obstacles.filter(obs => !existingObstacleIds.has(obs.nickname));
                if (newObstacles.length > 0) {
                    levelDataComposite.levelGameplayTraitsData.featuredObjects.push(...newObstacles);
                }
            }

            // Create an active gameplay level instance
            let activeGameplayLevel = await this.prepareGameplayLevelObject(levelDataComposite);

            if (activeGameplayLevel == null) {
                this.logFailedToLoadLevel();
                return null;
            }

            // Load all collectible types in parallel — they register independent microevents
            await Promise.all([
                this.createStardustPickups(activeGameplayLevel, levelData),
                this.createSpikeTraps(activeGameplayLevel, levelData),
                this.createHeartPickups(activeGameplayLevel, levelData),
                this.createKeyPickups(activeGameplayLevel, levelData),
            ]);

            // Render obstacles
            const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");



            const obstacleGenerator = FundamentalSystemBridge["levelFactoryComposite"].levelMapObstacleGenerator;
            if (obstacleGenerator && obstacles.length > 0) {
                // Validate obstacles have valid positions before rendering
                const validObstacles = obstacles.filter(obs => {
                    if (!obs.position || !(obs.position instanceof BABYLON.Vector3)) {
                        if (OBSTACLE_CREATION_DEBUG) console.warn("[OBSTACLE CREATION] Obstacle missing valid position:", obs);
                        return false;
                    }
                    return true;
                });

                if (validObstacles.length !== obstacles.length) {
                    if (OBSTACLE_CREATION_DEBUG) console.warn(`[OBSTACLE CREATION] Filtered out ${obstacles.length - validObstacles.length} invalid obstacles`);
                }

                // Ensure obstacles are accessible from activeGameplayLevel
                if (activeGameplayLevel.levelDataComposite) {
                    activeGameplayLevel.levelDataComposite.obstacles = validObstacles;
                }
                // Also ensure they're in levelMap for backward compatibility
                if (!activeGameplayLevel.levelMap) {
                    activeGameplayLevel.levelMap = {};
                }
                activeGameplayLevel.levelMap.obstacles = validObstacles;

                if (validObstacles.length > 0) {
                    await obstacleGenerator.renderObstaclesForLevel(activeGameplayLevel, sceneBuilder);
                }
            }





            // Render the level
            let finalizedRendering = await FundamentalSystemBridge["levelFactoryComposite"].renderGameplayLevel(
                activeGameplayLevel
            );

            if (!finalizedRendering) {
                this.logFailedToRenderLevel();
            }

            // Load player into the level FIRST
            let gameplayLevel = await this.loadLevelAndPlayerFromComposite(gameplayManager, activeGameplayLevel);

            if (!gameplayLevel) {
                console.error("[LEVEL LOADER] ⛔ Player loading failed, cannot proceed with level setup");
                return null;
            }

            // Register microevents for the level
            // Note: Stardust microevents are already registered in createStardustPickups
            // Only call prepareAndRegisterMicroEventsForLevel if level doesn't already have microevents
            const microEventManager = FundamentalSystemBridge["microEventManager"];
            if (microEventManager) {
                const levelId = levelDataComposite.levelHeaderData?.levelId;
                // Only register if level doesn't already have microevents (from manual registration)
                if (!microEventManager.gameplayLevelToMicroEventsMap[levelId]) {
                    microEventManager.prepareAndRegisterMicroEventsForLevel(levelDataComposite);
                }
            }



            // CRITICAL: Only set the level as active AFTER player loading is successful
            FundamentalSystemBridge["gameplayManagerComposite"].setActiveGameplayLevel(activeGameplayLevel);

            // Set the active gameplay level in the CollectiblePlacementManager
            // Note: We skip auto-placing mangos since we're manually placing stardust pickups
            const collectibleManager = FundamentalSystemBridge["collectiblePlacementManager"];
            if (collectibleManager) {
                collectibleManager.activeGameplayLevel = gameplayLevel;
                // Mark as initialized to prevent auto-placing mangos
                collectibleManager.isInitialized = true;
                // console.log(`[LEVEL LOADER] CollectiblePlacementManager configured with activeGameplayLevel`);
                // console.log(`[LEVEL LOADER] Player registered:`, !!gameplayLevel.currentPrimaryPlayer);
            } else {
                // console.error(`[LEVEL LOADER] CollectiblePlacementManager not found in FundamentalSystemBridge!`);
            }

            // Start movement tracking for replay
            const movementTracker = FundamentalSystemBridge["movementTracker"];
            if (movementTracker) {
                movementTracker.startTracking();
                //  console.log(`[LEVEL LOADER] Movement tracking started`);
            }

            // Update UI level name after level is fully loaded
            setTimeout(() => {
                if (typeof BaseGameUIScene !== 'undefined' && BaseGameUIScene.updateLevelNameGlobally) {
                    BaseGameUIScene.updateLevelNameGlobally();
                }
            }, 100);
            // this.runLevelAudit(levelData, activeGameplayLevel);

            // Preload essential sounds to eliminate latency during gameplay.
            // Race against a 6-second timeout so iOS audio hangs never block level load.
            this.levelLoaderDebugLog(" Loading initial sounds...");
            const soundEffectsManager = FundamentalSystemBridge["soundEffectsManager"];
            if (soundEffectsManager && gameplayLevel.hostingScene) {
                const soundTimeout = new Promise(function(resolve) { setTimeout(resolve, 6000); });
                await Promise.race([
                    soundEffectsManager.loadInitialSounds(gameplayLevel.hostingScene),
                    soundTimeout
                ]);
            }

            if (loadingScreen) {
                loadingScreen.destroy();
            }

            this.playMusic();
            // Run level audit to determine minimum strokes and optimal path
            this.levelAuditDebugLog("🎯 About to call runLevelAudit...");
            this.levelAuditDebugLog("✅ runLevelAudit call completed");

            if (window.RenderController) window.RenderController.markDirty();
            return gameplayLevel;
        } catch (error) {
            //console.error("Error loading level from server:", error);
            this.logFailedToLoadLevel();
            return null;
        }
    }

    playMusic() {
        // Start music on loop (only if audio has been unlocked by user interaction)
        // First level plays "crystalVoyage", all subsequent levels play "duskReverie"
        const musicManager = FundamentalSystemBridge["musicManager"];
        const activeScene = FundamentalSystemBridge["renderSceneSwapper"]?.getActiveGameLevelScene();
        if (musicManager && activeScene && Config.audioHasBeenUnlocked) {
            const songName = this.currentLevelNumber === 0 ? "crystalVoyage" : "duskReverie";
            // console.log(`[LEVEL LOADER] Starting ${songName} music for level ${this.currentLevelNumber}`);
            musicManager.playSong(activeScene, songName, true, true);
            // console.log(`[LEVEL LOADER] ✓ Started ${songName} music on loop`);

            // Increment level number for next level
            this.currentLevelNumber++;
        } else if (musicManager && activeScene && !Config.audioHasBeenUnlocked) {
            // this.levelLoaderDebugLog(" Skipping music start - waiting for user interaction to unlock audio");
        }

    }
    /**
     * Parses JSON level data into a LevelDataComposite
     * @param {Object} levelData - The parsed level JSON data
     * @param {string} [levelId] - Optional level ID from manifest
     * @returns {LevelDataComposite} The created level data composite
     */
    parseLevelJsonToComposite(levelData, levelId) {
        // Use provided levelId, or fall back to levelData.levelName, or default to "level0"
        const finalLevelId = levelId || levelData.levelName || "level0";
        const levelNickname = levelData.levelName || finalLevelId; // Use levelId as fallback for nickname too

        this.levelLoadingDebugLog(`parseLevelJsonToComposite: provided levelId=${levelId}, levelData.levelName=${levelData.levelName}, finalLevelId=${finalLevelId}`);
        const levelHint = levelData.levelHint || "";
        const width = levelData.mapWidth || 21;
        const depth = levelData.mapHeight || 21;

        // Find spawn position (builder space) and convert once
        const spawnElement = levelData.allMapElements?.find(el => el.element === "SPAWN_POSITION");
        const spawnCoords = spawnElement?.coordinates || { x: 10, y: 10 };
        const spawnWorld = this.builderToWorld(spawnCoords, depth);
        const playerStart = {
            x: spawnWorld.x,
            y: 0.25, // Default height above ground
            z: spawnWorld.z
        };

        // Create level data composite using TestLevelJsonBuilder
        const levelDataComposite = TestLevelJsonBuilder.buildCustomSizeLevel(
            finalLevelId,
            levelNickname,
            width,
            depth,
            playerStart
        );

        // Ensure levelHeaderData has the correct levelId
        if (levelDataComposite.levelHeaderData) {
            levelDataComposite.levelHeaderData.levelId = finalLevelId;
        }

        // Store custom properties
        levelDataComposite.levelHint = levelHint;
        levelDataComposite.levelMapVersion = levelData.levelMapVersion;

        return levelDataComposite;
    }

    /**
     * Creates obstacle data objects from level JSON data
     * @param {Object} levelData - The parsed level JSON data
     * @returns {Array<Object>} Array of obstacle data objects (not Obstacle instances)
     */
    createObstaclesFromLevelData(levelData) {
        const obstacles = [];
        const mountainElements = levelData.allMapElements?.filter(el => el.element === "MOUNTAIN") || [];
        const lockElements = levelData.allMapElements?.filter(el => el.element === "LOCK") || [];

        if (Config.LOGGING_OBSTACLE_CREATION || OBSTACLE_CREATION_DEBUG) {
            console.log(`[OBSTACLE CREATION] Found ${lockElements.length} LOCK elements in level data`);
            console.log(`[OBSTACLE CREATION] LOCK elements:`, lockElements);
            console.log(`[OBSTACLE CREATION] Creating ${lockElements.length} lock obstacles`);
        }

        const depth = this.getLevelDepth(levelData);

        for (const mountainEl of mountainElements) {
            const coords = mountainEl.coordinates;

            // Validate coordinates exist
            if (!coords || coords.x === undefined || coords.y === undefined) {
                if (OBSTACLE_CREATION_DEBUG) console.warn("[OBSTACLE CREATION] Skipping mountain obstacle with invalid coordinates:", mountainEl);
                continue;
            }

            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, 0, worldCoords.z);

            // Validate position was created successfully
            if (!position || position.x === undefined) {
                if (OBSTACLE_CREATION_DEBUG) console.warn("[OBSTACLE CREATION] Failed to create position for mountain obstacle:", coords);
                continue;
            }

            // Create obstacle data object (not Obstacle instance)
            // renderObstaclesForLevel will create the Obstacle instances
            const obstacleData = {
                obstacleArchetype: "mountain",
                nickname: `mountain_${coords.x}_${coords.y}`,
                interactionId: "none",
                directionsBlocked: "all",
                position: position,
                isObstacle: true
            };

            obstacles.push(obstacleData);
        }

        // Process LOCK elements as unlockable obstacles
        for (const lockEl of lockElements) {
            const coords = lockEl.coordinates;

            // Validate coordinates exist
            if (!coords || coords.x === undefined || coords.y === undefined) {
                if (OBSTACLE_CREATION_DEBUG) console.warn("[OBSTACLE CREATION] Skipping lock obstacle with invalid coordinates:", lockEl);
                continue;
            }

            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, 0, worldCoords.z);

            // Validate position was created successfully
            if (!position || position.x === undefined) {
                if (OBSTACLE_CREATION_DEBUG) console.warn("[OBSTACLE CREATION] Failed to create position for lock obstacle:", coords);
                continue;
            }

            // Create obstacle data object for lock (similar to mountain but unlockable)
            const lockObstacleData = {
                obstacleArchetype: "lock",
                nickname: `lock_${coords.x}_${coords.y}`,
                interactionId: "lock", // Special interaction ID for locks
                directionsBlocked: "all",
                position: position,
                isObstacle: true,
                isUnlockable: true // Special property to mark as unlockable
            };

            obstacles.push(lockObstacleData);
            if (Config.LOGGING_OBSTACLE_CREATION || OBSTACLE_CREATION_DEBUG) {
                console.log(`[OBSTACLE CREATION] Added lock obstacle:`, {
                    obstacleArchetype: lockObstacleData.obstacleArchetype,
                    isUnlockable: lockObstacleData.isUnlockable,
                    position: lockObstacleData.position,
                    nickname: lockObstacleData.nickname
                });
            }
        }

        if (Config.LOGGING_OBSTACLE_CREATION || OBSTACLE_CREATION_DEBUG) {
            console.log(`[OBSTACLE CREATION] Total obstacles created: ${obstacles.length}`);
        }
        return obstacles;
    }

    /**
     * Creates stardust pickups from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createStardustPickups(activeGameplayLevel, levelData) {
        this.stardustCreationDebugLog(`createStardustPickups called`);
        const stardustElements = levelData.allMapElements?.filter(el => el.element === "STAR_DUST") || [];
        this.stardustCreationDebugLog(`Found ${stardustElements.length} STAR_DUST elements in level data`);
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        // Get levelId from the activeGameplayLevel's levelDataComposite if available
        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        this.stardustCreationDebugLog(`Creating ${stardustElements.length} stardust pickups for levelId: ${levelId}`);
        this.stardustCreationDebugLog(`ActiveGameplayLevel levelDataComposite levelId:`, activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId);
        this.stardustCreationDebugLog(`LevelData levelName:`, levelData.levelName);

        // Step 1: Build all PositionedObjects up front (no await)
        const allStardustObjects = stardustElements.map(stardustEl => {
            const coords = stardustEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, Config.PLAYER_HEIGHT, worldCoords.z);
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const stardustObject = new PositionedObject(
                "lotus",
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                0.66, // Scale factor for stardust
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );
            return { stardustObject, position };
        });

        // Step 2: Load all models in parallel
        await Promise.all(allStardustObjects.map(({ stardustObject }) => sceneBuilder.loadModel(stardustObject)));

        // Step 3: Register microevents (sync, no await needed)
        for (const { stardustObject, position } of allStardustObjects) {
            const stardustEvent = MicroEventFactory.generatePickup(
                "Stardust Pickup",
                "You grasped the iridescent glow of a stardust fragment!",
                "stardust",
                1,
                position,
                stardustObject
            );

            if (microEventManager) {
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    stardustEvent
                );
            } else {
                if (STARDUST_CREATION_DEBUG) console.error(`[STARDUST CREATION] MicroEventManager not found!`);
            }

            // Spawn arrival VFX using centralized explosion system
            try {
                const predictiveManager = FundamentalSystemBridge["predictiveExplosionManager"];
                if (predictiveManager && sceneBuilder.scene) {
                    predictiveManager.createSpawnExplosion(position, sceneBuilder.scene, 0.4).catch(() => { /* ignore */ });
                }
            } catch (err) {
                if (STARDUST_CREATION_DEBUG) console.warn("[STARDUST CREATION] Spawn effect failed:", err);
            }
        }

        // Verify that 4 stardusts were registered
        if (microEventManager) {
            const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
            const registeredEvents = microEventManager.getMicroEventsByLevelId(levelDataForRegistration.levelHeaderData?.levelId || levelId);
            const stardustEvents = registeredEvents.filter(e =>
                e.microEventCategory === "pickup" &&
                (e.microEventValue === "stardust" || e.microEventNickname?.includes("Stardust"))
            );

            if (stardustEvents.length !== 4) {
                if (STARDUST_VERIFICATION_DEBUG) console.warn(`[STARDUST VERIFICATION] Expected 4 stardusts, but found ${stardustEvents.length} registered for levelId: ${levelId}`);
            } else {
                this.stardustVerificationDebugLog(`✓ Successfully registered 4 stardusts for levelId: ${levelId}`);
            }
        }
    }

    /**
     * Creates spike traps from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createSpikeTraps(activeGameplayLevel, levelData) {
        this.spikeCreationDebugLog(`createSpikeTraps called`);
        const spikeTrapElements = levelData.allMapElements?.filter(el => el.element === "SPIKE_TRAP") || [];
        this.spikeCreationDebugLog(`Found ${spikeTrapElements.length} SPIKE_TRAP elements in level data`);
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        // Step 1: Build all PositionedObjects up front (no await)
        const allSpikeObjects = spikeTrapElements.map(spikeTrapEl => {
            const coords = spikeTrapEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, Config.PLAYER_HEIGHT, worldCoords.z);
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const spikeTrapObject = new PositionedObject(
                "testStarSpike",
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                0.5, // Scale factor for spike trap
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );
            return { spikeTrapObject, position };
        });

        // Step 2: Load all models in parallel
        await Promise.all(allSpikeObjects.map(({ spikeTrapObject }) => sceneBuilder.loadModel(spikeTrapObject)));

        // Step 3: Register microevents (sync, no await needed)
        for (const { spikeTrapObject, position } of allSpikeObjects) {
            const spikeTrapEvent = MicroEventFactory.generateDamage(
                "Spike Trap",
                "Sharp spikes pierce through your defenses!",
                "spike",
                1,
                position,
                spikeTrapObject
            );

            // Initialize flag for movement-based damage system
            spikeTrapEvent.hasTriggeredThisMovement = false;

            if (microEventManager) {
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    spikeTrapEvent
                );
            } else {
                if (SPIKE_CREATION_DEBUG) console.error(`[SPIKE CREATION] MicroEventManager not found!`);
            }
        }

        //this.spikeCreationDebugLog(`✓ Created ${spikeTrapElements.length} spike traps for levelId: ${levelId}`);
    }

    /**
     * Creates heart pickups from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createHeartPickups(activeGameplayLevel, levelData) {
        this.heartCreationDebugLog(`createHeartPickups called`);
        const heartElements = levelData.allMapElements?.filter(el => el.element === "HEART") || [];
        this.heartCreationDebugLog(`Found ${heartElements.length} HEART elements in level data`);
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        //this.heartCreationDebugLog(`Creating ${heartElements.length} hearts for levelId: ${levelId}`);

        // Step 1: Build all PositionedObjects up front (no await)
        const allHeartObjects = heartElements.map(heartEl => {
            const coords = heartEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, Config.PLAYER_HEIGHT, worldCoords.z);
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const heartObject = new PositionedObject(
                "testHeartRed",
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                0.5, // Scale factor for heart
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );
            return { heartObject, position };
        });

        // Step 2: Load all models in parallel
        await Promise.all(allHeartObjects.map(({ heartObject }) => sceneBuilder.loadModel(heartObject)));

        // Step 3: Register microevents (sync, no await needed)
        for (const { heartObject, position } of allHeartObjects) {
            const heartEvent = MicroEventFactory.generatePickup(
                "Heart Pickup",
                "You absorbed the healing energy of a radiant heart!",
                "heart",
                1,
                position,
                heartObject
            );

            if (microEventManager) {
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    heartEvent
                );
            } else {
                if (HEART_CREATION_DEBUG) console.error(`[HEART CREATION] MicroEventManager not found!`);
            }
        }

        //this.heartCreationDebugLog(`✓ Created ${heartElements.length} hearts for levelId: ${levelId}`);
    }

    /**
     * Creates key pickups from level data and registers them as microevents
     * @param {ActiveGameplayLevel} activeGameplayLevel - The active gameplay level
     * @param {Object} levelData - The parsed level JSON data
     */
    async createKeyPickups(activeGameplayLevel, levelData) {
        const keyElements = levelData.allMapElements?.filter(el => el.element === "KEY") || [];
        const sceneBuilder = FundamentalSystemBridge["renderSceneSwapper"].getSceneBuilderForScene("BaseGameScene");
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        if (Config.LOGGING_KEY_CREATION || KEY_CREATION_DEBUG) {
            console.log(`[KEY CREATION] Found ${keyElements.length} KEY elements in level data`);
        }
        if (Config.LOGGING_KEY_CREATION || KEY_CREATION_DEBUG) {
            console.log(`[KEY CREATION] Creating ${keyElements.length} key pickups for levelId: ${levelId}`);
        }

        // Step 1: Build all PositionedObjects up front (no await)
        const allKeyObjects = keyElements.map(keyEl => {
            const coords = keyEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth);
            const position = new BABYLON.Vector3(worldCoords.x, Config.PLAYER_HEIGHT, worldCoords.z);
            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const keyObject = new PositionedObject(
                "key", // Using existing key model
                position,
                rotation,
                offset,
                "", // No animations
                "",
                "",
                1.0, // Scale factor for key
                false, // Don't freeze
                true, // Interactive
                false // Not a clone base
            );
            return { keyObject, position };
        });

        // Step 2: Load all models in parallel
        if (Config.LOGGING_KEY_CREATION || KEY_CREATION_DEBUG) {
            console.log(`[KEY CREATION] Loading models for ${allKeyObjects.length} keys in parallel`);
        }
        await Promise.all(allKeyObjects.map(({ keyObject }) => sceneBuilder.loadModel(keyObject)));
        if (Config.LOGGING_KEY_CREATION || KEY_CREATION_DEBUG) {
            console.log(`[KEY CREATION] All key models loaded`);
        }

        // Step 3: Register microevents (sync, no await needed)
        for (const { keyObject, position } of allKeyObjects) {
            const keyEvent = MicroEventFactory.generatePickup(
                "Key Pickup",
                "You collected a glowing key fragment!",
                "key",
                1,
                position,
                keyObject
            );

            if (microEventManager) {
                const levelDataForRegistration = activeGameplayLevel?.levelDataComposite || { levelHeaderData: { levelId: levelId } };
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    keyEvent
                );
                if (Config.LOGGING_KEY_CREATION || KEY_CREATION_DEBUG) {
                    console.log(`[KEY CREATION] Microevent registered for key pickup`);
                }
            } else {
                if (KEY_CREATION_DEBUG) console.error(`[KEY CREATION] MicroEventManager not found!`);
            }

            // Spawn arrival VFX using centralized explosion system
            try {
                const predictiveManager = FundamentalSystemBridge["predictiveExplosionManager"];
                if (predictiveManager && sceneBuilder.scene) {
                    predictiveManager.createSpawnExplosion(position, sceneBuilder.scene, 0.4).catch(() => { /* ignore */ });
                }
            } catch (err) {
                if (KEY_CREATION_DEBUG) console.warn("[KEY CREATION] Spawn effect failed:", err);
            }
        }

        if (Config.LOGGING_KEY_CREATION || KEY_CREATION_DEBUG) {
            console.log(`[KEY CREATION] ✓ Created ${keyElements.length} key pickups for levelId: ${levelId}`);
        }
    }

    /**
     * Converts builder (top-left origin) coordinates to Babylon world coords (bottom-left origin).
     * Optional offset allows re-use for duplicate/chamber grids.
     */
    builderToWorld(coords, depth, offset = { x: 0, z: 0 }) {
        const offX = offset.x || 0;
        const offZ = offset.z || 0;
        return {
            x: coords.x + offX,
            z: (depth - 1 - coords.y) + offZ
        };
    }

    /**
     * Loads player into a level that was already prepared
     * @param {GameplayManagerComposite} gameplayManager - The gameplay manager
     * @param {ActiveGameplayLevel} activeGameplayLevel - The prepared gameplay level
     * @returns {ActiveGameplayLevel} The gameplay level with player loaded
     */
    async loadLevelAndPlayerFromComposite(gameplayManager, activeGameplayLevel) {
        if (activeGameplayLevel == null) {
            GameplayLogger.lazyLog(
                "GameplayLevel is null at load, cannot load player to gameplay level"
            );
            return null;
        }

        // Create a player using the level data
        let demoPlayer = PlayerLoader.getFreshPlayer(activeGameplayLevel.levelDataComposite);

        if (!demoPlayer) {
            console.error("[LEVEL LOADER] ⛔ Player creation failed, cannot load player to level");
            return null;
        }

        demoPlayer.playerMovementManager.setMaxMovementDistance(5);

        let playerLoadedSuccessfully = await gameplayManager.loadPlayerToGameplayLevel(
            activeGameplayLevel,
            demoPlayer
        ); // Load the player into the level.

        if (!playerLoadedSuccessfully) {
            console.error("[LEVEL LOADER] ⛔ Player loading failed, level will not be playable");
            return null;
        }
        demoPlayer.setMockInventory(new PlayerMockInventory());

        // Reset UI bars to full for new level
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        const uiScene = renderSceneSwapper?.getActiveUIScene();
        if (uiScene) {
            // Reset health bar to full (4/4)
            if (uiScene.heartSocketBar && typeof uiScene.heartSocketBar.setCurrentHearts === 'function') {
                uiScene.heartSocketBar.setCurrentHearts(4);
                this.levelLoaderDebugLog(" Health bar reset to full (4/4)");
            }

            // Reset mana bar to full (3/3)
            if (uiScene.manaBar && typeof uiScene.manaBar.setCurrentMana === 'function') {
                uiScene.manaBar.setCurrentMana(3);
                this.levelLoaderDebugLog(" Mana bar reset to full (3/3)");
            }

            // Reset artifact bar to full (3/3)
            if (uiScene.artifactSocketBar && typeof uiScene.artifactSocketBar.setCurrentArtifacts === 'function') {
                uiScene.artifactSocketBar.setCurrentArtifacts(3);
                this.levelLoaderDebugLog(" Artifact bar reset to full (3/3)");
            }
        }

        return activeGameplayLevel;
    }






    async loadLevelAndPlayer(gameplayManager) {
        let gameplayLevel = await this.generateGameplayLevelComposite(
            gameplayManager
        );

        if (gameplayLevel == null) {
            GameplayLogger.lazyLog(
                "GameplayLevel is null at load, cannot load player to gameplay level"
            );
            return null;
        }

        // Create a player using the level data
        let demoPlayer = PlayerLoader.getFreshPlayer(gameplayLevel.levelDataComposite);
        demoPlayer.playerMovementManager.setMaxMovementDistance(5);

        let loadedPlayer = await gameplayManager.loadPlayerToGameplayLevel(
            gameplayLevel,
            demoPlayer
        ); // Load the player into the level.

        demoPlayer.setMockInventory(new PlayerMockInventory());

        return gameplayLevel;
    }




    /**
     * Core code that pulls gameplay testlevel data, currently a level full of mangos, needs to be paramaterized as of 12-2-2025
     */
    async generateGameplayLevelComposite(gameplayManager) {
        // Use the new TestLevelDataLoader to create a LevelDataComposite
        let levelDataComposite = TestLevelDataCompositeLoader.createTestLevelData();

        // Create an active gameplay level instance with the loaded configurations.
        let activeDemoGameplayLevel = await this.prepareGameplayLevelObject(
            levelDataComposite
        );

        if (activeDemoGameplayLevel == null) {
            GameplayLogger.lazyLog(
                "ActiveDemoGameplayLevel is null at generate, post setting active gameplay level cannot generate gameplay level"
            );
            return null;
        }

        gameplayManager.setActiveGameplayLevel(activeDemoGameplayLevel); // Set the loaded level as active.

        // Set the active gameplay level in the CollectiblePlacementManager - currently places mangos
        await FundamentalSystemBridge[
            "collectiblePlacementManager"
        ].setActiveGameplayLevel(activeDemoGameplayLevel);


        return activeDemoGameplayLevel; // Return the configured gameplay level.
    }

    generateAndRegisterCameraAndLightingManagers() {
        let primaryCameraManager = new CameraManager();
        let primaryLightingManager = new LightingManager();
        FundamentalSystemBridge.registerPrimaryGameplayCameraManager(
            primaryCameraManager
        );
        FundamentalSystemBridge.registerPrimaryGameplayLightingManager(
            primaryLightingManager
        );
        return { primaryCameraManager, primaryLightingManager };
    }

    async prepareGameplayLevelObject(levelDataComposite) {
        let { primaryCameraManager, primaryLightingManager } =
            this.generateAndRegisterCameraAndLightingManagers();
        let gameMode = GamemodeFactory.initializeSpecifiedGamemode("test");

        let activeGameLevelScene =
            FundamentalSystemBridge["renderSceneSwapper"].getActiveGameLevelScene();

        // Register the scene with the camera manager and set up the camera
        primaryCameraManager.registerPrimaryGameScene(activeGameLevelScene);
        const camera = primaryCameraManager.setupGameLevelTestCamera();
        if (camera) {
            // Set the camera as the active camera for the scene
            activeGameLevelScene.activeCamera = camera;
            // Also register it with the render scene swapper
            FundamentalSystemBridge["renderSceneSwapper"].allStoredCameras[activeGameLevelScene] = camera;
        }

        let activeDemoGameplayLevel = new ActiveGameplayLevel(
            activeGameLevelScene,
            gameMode,
            levelDataComposite,
            primaryCameraManager,
            primaryLightingManager
        );

        // Ensure obstacles are properly transferred to the active gameplay level
        if (
            levelDataComposite &&
            levelDataComposite.obstacles &&
            levelDataComposite.obstacles.length > 0
        ) {
            // Ensure the level map exists
            if (!activeDemoGameplayLevel.levelMap) {
                activeDemoGameplayLevel.levelMap = {};
            }

            // Store obstacles in multiple locations to ensure they're found
            activeDemoGameplayLevel.obstacles = levelDataComposite.obstacles;
            activeDemoGameplayLevel.levelMap.obstacles = levelDataComposite.obstacles;
        }

        return activeDemoGameplayLevel;
    }

    /**
     * Runs the level audit to determine minimum strokes and optimal path.
     * Logs results to console for developer review.
     * @param {Object} levelData - The raw level JSON data
     * @param {ActiveGameplayLevel} activeGameplayLevel - The loaded gameplay level
     */
    runLevelAudit(levelData, activeGameplayLevel) {
        this.levelAuditDebugLog("🔍 Attempting to run level audit...");
        const auditor = this.getLevelAuditor();
        if (!auditor) {
            if (LEVEL_AUDIT_DEBUG) console.warn("[LEVEL AUDIT] ❌ Level auditor not available - skipping audit");
            this.levelAuditDebugLog("LevelAuditor global available:", typeof LevelAuditor);
            return;
        }

        this.levelAuditDebugLog("✅ Level auditor found, running audit...");

        try {
            // Enable debug mode to see detailed pathfinding information
            auditor.setDebugMode(false);
            this.levelAuditDebugLog("🔧 Debug mode enabled on auditor");
            this.levelLoaderDebugLog(" 📊 Calling auditor.auditLevel...");
            const result = auditor.auditLevel(levelData, activeGameplayLevel);
            this.levelAuditDebugLog("📊 auditor.auditLevel completed, result:", result);

            // Optionally generate visual map for debugging
            if (result && result.valid) {
                const parsedLevel = auditor.parseLevelData(levelData);
                auditor.generateVisualMap(parsedLevel, result);
            }
        } catch (error) {
            if (LEVEL_AUDIT_DEBUG) console.error("[LEVEL AUDIT] Error running level audit:", error);
        }
    }

}
