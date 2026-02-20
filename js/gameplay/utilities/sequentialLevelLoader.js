/**
 * SequentialLevelLoader
 * 
 * Handles sequential loading of levels at the origin.
 * All levels are loaded at (0, 0, 0) for simplicity.
 */
class SequentialLevelLoader {
    constructor() {
        // All levels load at origin - no chamber system needed

        // Next level data
        this.nextLevelData = null;
        this.nextLevelActiveGameplayLevel = null;
        // All levels load at origin
        this.isLoadingNextLevel = false;
        this.isNextLevelReady = false;
        this.isReplayComplete = false;
        this.nextLevelUrl = null;
        this.originalPlayerData = null;

        // Current scene (same for all chambers)
        this.currentScene = null;
        this.currentSceneBuilder = null;

        // Track total level count for music selection (0 = first level, 1 = second, etc.)
        this.totalLevelsLoaded = 0;

        // Level mapping for world loader scene (9 spheres -> 6 levels + 3 placeholders)
        this.WORLD_LEVEL_MAPPING = this.initializeWorldLevelMapping();
    }

    /**
     * Starts loading the next level in the background
     * @param {string} nextLevelUrl - URL to the next level JSON data
     * @param {PlayerUnit} currentPlayer - Current player to extract data from
     * @param {number} sphereIndex - The world sphere index for level identification
     */
    async startLoadingNextLevel(nextLevelUrl, currentPlayer, sphereIndex = 0) {
        if (this.isLoadingNextLevel) {
            console.warn("[SEQUENTIAL LOADER] Already loading next level");
            return;
        }

        this.nextLevelUrl = nextLevelUrl;
        this.sphereIndex = sphereIndex;
        this.isLoadingNextLevel = true;
        this.isNextLevelReady = false;

        // Get current scene (same scene for all chambers)
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        this.currentScene = renderSceneSwapper?.getActiveGameLevelScene();
        if (!this.currentScene) {
            throw new Error("[SEQUENTIAL LOADER] No active scene found");
        }

        // Get scene builder for the current scene
        const sceneId = this.findSceneId(this.currentScene);
        this.currentSceneBuilder = renderSceneSwapper.getSceneBuilderForScene(sceneId);
        if (!this.currentSceneBuilder) {
            throw new Error("[SEQUENTIAL LOADER] No scene builder found");
        }

        // All levels load at origin - no special setup needed

        // Extract player data to transfer (but not the model)
        if (currentPlayer && currentPlayer.playerStatus) {
            this.originalPlayerData = {
                name: currentPlayer.playerStatus.name,
                currentLevel: currentPlayer.playerStatus.currentLevel,
                currentExp: currentPlayer.playerStatus.currentExperience,
                currentMagicLevel: currentPlayer.playerStatus.currentMagicLevel,
                currentMagicPoints: currentPlayer.playerStatus.currentMagicPoints,
                maximumMagicPoints: currentPlayer.playerStatus.maximumMagicPoints,
                currentHealthPoints: currentPlayer.playerStatus.currentHealthPoints,
                maximumHealthPoints: currentPlayer.playerStatus.maximumHealthPoints,
                baseMaxSpeed: currentPlayer.playerStatus.baseMaxSpeed,
                inventory: currentPlayer.playerStatus.playerInventoryMain,
                mockInventory: currentPlayer.mockInventory
            };
            console.log("[SEQUENTIAL LOADER] Extracted player data for transfer");
        }

        try {
            // Load the level data
            const levelJsonData = await this.fetchLevelJsonFromUrl(nextLevelUrl);

            // Load the level into the current scene at origin
            await this.loadLevelIntoChamber(levelJsonData, this.currentScene, new BABYLON.Vector3(0, 0, 0), this.sphereIndex);

            // Verify the level is fully ready
            if (!this.verifyLevelReady()) {
                throw new Error("Level verification failed - level not ready");
            }

            this.isNextLevelReady = true;
            console.log(`[SEQUENTIAL LOADER] Next level loaded and verified ready at origin`);

            // Check if we can transition now (replay might already be complete)
            if (this.isReplayComplete) {
                console.log("[SEQUENTIAL LOADER] Replay already complete, transitioning now...");
                await this.transitionToNextLevel();
            } else {
                console.log("[SEQUENTIAL LOADER] Waiting for replay to complete...");
            }
        } catch (error) {
            console.error("[SEQUENTIAL LOADER] Error loading next level:", error);
            this.cleanupFailedLoad();
            throw error;
        }
    }

    /**
     * Finds the scene ID for a given scene
     * @param {BABYLON.Scene} scene - The scene to find
     * @returns {string|null} The scene ID or null if not found
     */
    findSceneId(scene) {
        if (!scene) return null;
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        if (!renderSceneSwapper) return null;

        for (const [id, storedScene] of Object.entries(renderSceneSwapper.allStoredScenes)) {
            if (storedScene === scene) {
                return id;
            }
        }
        return null;
    }

    /**
     * Verifies that the level is fully ready for transition
     * @returns {boolean} True if level is ready
     */
    verifyLevelReady() {
        if (!this.nextLevelActiveGameplayLevel) {
            console.error("[SEQUENTIAL LOADER] Next level ActiveGameplayLevel is null");
            return false;
        }

        if (!this.currentScene || !this.currentScene.activeCamera) {
            console.error("[SEQUENTIAL LOADER] Current scene or camera is null");
            return false;
        }

        console.log("[SEQUENTIAL LOADER] Level verification passed");
        return true;
    }

    /**
     * Cleans up resources if loading fails
     */
    cleanupFailedLoad() {
        // Clean up any partially loaded level data
        this.nextLevelActiveGameplayLevel = null;
        this.nextLevelData = null;
        this.isLoadingNextLevel = false;
        this.isNextLevelReady = false;
    }

    /**
     * Fetches JSON level data from a URL
     * @param {string} url - The URL to fetch the level JSON data from
     * @returns {Promise<Object>} The parsed JSON level data
     */
    async fetchLevelJsonFromUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch level data: ${response.status} ${response.statusText}`);
            }
            const levelJsonData = await response.json();
            return levelJsonData;
        } catch (error) {
            console.error("[SEQUENTIAL LOADER] Error fetching level JSON from URL:", error);
            throw error;
        }
    }

    /**
     * Loads a level into the scene at origin
     * @param {Object} levelJsonData - The level JSON data
     * @param {BABYLON.Scene} targetScene - The scene to load the level into
     * @param {BABYLON.Vector3} offset - The spatial offset (always 0,0,0)
     * @param {number} sphereIndex - The world sphere index for level identification
     */
    async loadLevelIntoChamber(levelJsonData, targetScene, chamberOffset, sphereIndex = 0) {
        // Parse JSON if it's a string
        let levelData = typeof levelJsonData === 'string'
            ? JSON.parse(levelJsonData)
            : levelJsonData;

        // Ensure factory support systems are loaded (tiles, etc.)
        await FundamentalSystemBridge["levelFactoryComposite"].loadFactorySupportSystems();

        // Parse the level data and create LevelDataComposite
        let levelDataComposite = this.parseLevelJsonToComposite(levelData, chamberOffset, sphereIndex);

        if (!levelDataComposite) {
            throw new Error("Failed to parse level data");
        }

        // Create obstacles from the level data
        let obstacles = this.createObstaclesFromLevelData(levelData, chamberOffset);
        if (obstacles.length > 0) {
            levelDataComposite.obstacles = obstacles;
            if (!levelDataComposite.levelGameplayTraitsData.featuredObjects) {
                levelDataComposite.levelGameplayTraitsData.featuredObjects = [];
            }
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

        // Use existing camera and lighting managers (same scene)
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];
        const currentLevel = gameplayManager?.primaryActiveGameplayLevel;
        const cameraManager = currentLevel?.cameraManager || new CameraManager();
        const lightingManager = currentLevel?.lightingManager || new LightingManager();

        if (!currentLevel) {
            cameraManager.registerPrimaryGameScene(targetScene);
            lightingManager.initializeConstructSystems(false, targetScene);
        }

        // Create active gameplay level
        let gameMode = GamemodeFactory.initializeSpecifiedGamemode("test");
        let activeGameplayLevel = new ActiveGameplayLevel(
            targetScene,
            gameMode,
            levelDataComposite,
            cameraManager,
            lightingManager
        );

        // Store obstacles
        if (levelDataComposite.obstacles && levelDataComposite.obstacles.length > 0) {
            if (!activeGameplayLevel.levelMap) {
                activeGameplayLevel.levelMap = {};
            }
            activeGameplayLevel.obstacles = levelDataComposite.obstacles;
            activeGameplayLevel.levelMap.obstacles = levelDataComposite.obstacles;
        }

        // Create stardust pickups
        await this.createStardustPickups(activeGameplayLevel, levelData, this.currentSceneBuilder, chamberOffset);

        // Render obstacles
        const obstacleGenerator = FundamentalSystemBridge["levelFactoryComposite"].levelMapObstacleGenerator;
        if (obstacleGenerator && obstacles.length > 0) {
            const validObstacles = obstacles.filter(obs => {
                if (!obs.position || !(obs.position instanceof BABYLON.Vector3)) {
                    return false;
                }
                return true;
            });
            if (validObstacles.length > 0) {
                activeGameplayLevel.obstacles = validObstacles;
                activeGameplayLevel.levelMap.obstacles = validObstacles;
                obstacleGenerator.renderObstaclesForLevel(activeGameplayLevel, this.currentSceneBuilder);
            }
        }

        // Render the level grid at origin
        // Get dimensions for grid generation
        const dimensions = this.getLevelDimensions(activeGameplayLevel);

        // Generate grid using the level factory
        const levelFactory = FundamentalSystemBridge["levelFactoryComposite"];
        if (levelFactory && levelFactory.generateLevelGrid) {
            const gridSuccess = await levelFactory.generateLevelGrid(
                activeGameplayLevel,
                dimensions.width,
                dimensions.depth,
                1 // tileSize
            );

            if (!gridSuccess) {
                throw new Error("Failed to generate grid");
            }
        } else {
            console.warn("[SEQUENTIAL LOADER] Level factory not available for grid generation");
        }

        // Initialize lighting for the level
        activeGameplayLevel.initializeLevelLighting();

        // Register microevents - clear ALL old microevents and create fresh ones
        // Microevents are already created by createStardustPickups above
        // No additional microevent management needed

        // Clear any existing scheduled explosions for clean level state
        if (window.ExplosionScheduler) {
            window.ExplosionScheduler.clearAllScheduledExplosions();
        }
        console.log("[SEQUENTIAL LOADER] Cleared existing explosions for clean level state");

        // Store references
        this.nextLevelActiveGameplayLevel = activeGameplayLevel;
        this.nextLevelData = levelDataComposite;

        console.log(`[SEQUENTIAL LOADER] Level loaded at origin`);
    }


    /**
     * Gets the dimensions of the level for grid generation
     * @param {ActiveGameplayLevel} gameplayLevel - The gameplay level
     * @returns {Object} Object containing width and depth
     */
    getLevelDimensions(gameplayLevel) {
        const levelData = gameplayLevel.levelDataComposite;
        if (levelData && levelData.customGridSize) {
            return {
                width: levelData.customGridSize.width || 21,
                depth: levelData.customGridSize.depth || 21
            };
        }
        return { width: 21, depth: 21 };
    }

    /**
     * Gets level depth (rows) from level JSON
     */
    getLevelDepth(levelData) {
        return levelData?.mapHeight || levelData?.mapDepth || levelData?.depth || 21;
    }

    /**
     * Converts builder (top-left origin) coordinates to Babylon world coords (bottom-left origin).
     * Optional offset allows re-use for chamber offsets.
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
     * Parses JSON level data into a LevelDataComposite
     */
    parseLevelJsonToComposite(levelData, chamberOffset, sphereIndex = 0) {
        // Get the correct level ID from the world mapping instead of relying on levelData.levelName
        const worldLevelData = this.WORLD_LEVEL_MAPPING[sphereIndex];
        const levelId = worldLevelData?.levelId || levelData.levelName || "level0";
        const levelNickname = worldLevelData?.name || levelData.levelName || "Level 0";

        console.log(`[SEQUENTIAL LOADER] Using level ID: ${levelId} for sphere index ${sphereIndex}`);
        const levelHint = levelData.levelHint || "";
        const width = levelData.mapWidth || 21;
        const depth = levelData.mapHeight || 21;

        const spawnElement = levelData.allMapElements?.find(el => el.element === "SPAWN_POSITION");
        const spawnCoords = spawnElement?.coordinates || { x: 10, y: 10 };
        const depthForFlip = this.getLevelDepth(levelData);
        const spawnWorld = this.builderToWorld(spawnCoords, depthForFlip, { x: chamberOffset.x, z: chamberOffset.z });
        const playerStart = {
            x: spawnWorld.x,
            y: 0.5,
            z: spawnWorld.z
        };

        const levelDataComposite = TestLevelJsonBuilder.buildCustomSizeLevel(
            levelId,
            levelNickname,
            width,
            depth,
            playerStart
        );

        levelDataComposite.levelHint = levelHint;
        levelDataComposite.levelMapVersion = levelData.levelMapVersion;

        return levelDataComposite;
    }

    /**
     * Creates obstacle data objects from level JSON data
     */
    createObstaclesFromLevelData(levelData, chamberOffset) {
        const obstacles = [];
        const mountainElements = levelData.allMapElements?.filter(el => el.element === "MOUNTAIN") || [];
        const depth = this.getLevelDepth(levelData);

        for (const mountainEl of mountainElements) {
            const coords = mountainEl.coordinates;
            if (!coords || coords.x === undefined || coords.y === undefined) {
                continue;
            }

            const worldCoords = this.builderToWorld(coords, depth, { x: chamberOffset.x, z: chamberOffset.z });
            const position = new BABYLON.Vector3(
                worldCoords.x,
                0.5 + chamberOffset.y,
                worldCoords.z
            );

            const obstacleData = {
                obstacleArchetype: "mountain",
                nickname: `mountain_${coords.x}_${coords.y}_chamber_${chamberOffset.x}`,
                interactionId: "none",
                directionsBlocked: "all",
                position: position,
                isObstacle: true
            };

            obstacles.push(obstacleData);
        }

        return obstacles;
    }

    /**
     * Creates stardust pickups from level data
     */
    async createStardustPickups(activeGameplayLevel, levelData, sceneBuilder, chamberOffset) {
        const stardustElements = levelData.allMapElements?.filter(el => el.element === "STAR_DUST") || [];
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

        // Clear any existing microevents for this level to ensure clean state
        if (microEventManager) {
            microEventManager.clearMicroEventsExceptForLevel(levelId); // Keep other levels, clear this one
            console.log(`[STARDUST PICKUPS] Cleared existing microevents for level ${levelId}`);

            // Debug: Log current microevent state
            if (microEventManager.gameplayLevelToMicroEventsMap) {
                const allLevelIds = Object.keys(microEventManager.gameplayLevelToMicroEventsMap);
                console.log(`[STARDUST PICKUPS] Microevent levels after clear: ${allLevelIds.join(', ')}`);
            }
        }

        if (stardustElements.length === 0) {
            console.log(`[STARDUST PICKUPS] No STAR_DUST elements found in level ${levelId}`);
            return;
        }

        console.log(`[STARDUST PICKUPS] Creating ${stardustElements.length} stardust pickups for level ${levelId}`);

        for (const stardustEl of stardustElements) {
            const coords = stardustEl.coordinates;
            const worldCoords = this.builderToWorld(coords, depth, { x: chamberOffset.x, z: chamberOffset.z });
            const position = new BABYLON.Vector3(
                worldCoords.x,
                0.25 + chamberOffset.y,
                worldCoords.z
            );

            const offset = new BABYLON.Vector3(0, 0, 0);
            const rotation = new BABYLON.Vector3(0, 0, 0);
            const stardustObject = new PositionedObject(
                "lotus",
                position,
                rotation,
                offset,
                "",
                "",
                "",
                0.66,
                false,
                true,
                false
            );

            await sceneBuilder.loadModel(stardustObject);

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
                const registrationLevelId = levelDataForRegistration.levelHeaderData?.levelId;
                console.log(`[STARDUST PICKUPS] Registering microevent for level ${registrationLevelId} (stardust at ${position.x.toFixed(1)}, ${position.z.toFixed(1)})`);
                microEventManager.addNewMicroEventToLevel(
                    levelDataForRegistration,
                    stardustEvent
                );
            }
        }
    }

    /**
     * Called when replay completes - transitions immediately if level is ready, otherwise waits
     */
    async onReplayComplete() {
        this.isReplayComplete = true;
        console.log("[SEQUENTIAL LOADER] Replay marked as complete");

        // Transition immediately if level is ready, otherwise wait for it
        if (this.isNextLevelReady) {
            console.log("[SEQUENTIAL LOADER] Level is ready, transitioning immediately...");
            await this.transitionToNextLevel();
        } else {
            console.log("[SEQUENTIAL LOADER] Level not ready yet, will transition when it loads...");
        }
    }

    /**
     * Transitions to the next level: shows explosion effect
     */
    async transitionToNextLevel() {
        if (!this.isNextLevelReady || !this.nextLevelActiveGameplayLevel) {
            console.error("[SEQUENTIAL LOADER] Cannot transition - level not ready");
            return;
        }

        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

        // Show colorful explosion effect
        console.log("[SEQUENTIAL LOADER] Showing transition explosion");
        const effectGenerator = new EffectGenerator();
        await effectGenerator.explosionEffect({
            type: 'magic',
            intensity: 2.0,
            duration: 3.0
        });

        // Since we always load at the origin, no camera movement is needed
        console.log("[SEQUENTIAL LOADER] Level loaded at origin - no camera movement required");

        // Load player with transferred data
        await this.loadPlayerWithTransferredData(gameplayManager, this.nextLevelActiveGameplayLevel);

        // Set the new level as active
        gameplayManager.setActiveGameplayLevel(this.nextLevelActiveGameplayLevel);

        // Configure collectible manager
        const collectibleManager = FundamentalSystemBridge["collectiblePlacementManager"];
        if (collectibleManager) {
            collectibleManager.activeGameplayLevel = this.nextLevelActiveGameplayLevel;
            collectibleManager.isInitialized = true;
        }

        // Start movement tracking for the new level
        const movementTracker = FundamentalSystemBridge["movementTracker"];
        if (movementTracker) {
            movementTracker.startTracking();
        }

        // Increment total levels loaded counter (used for music selection)
        this.totalLevelsLoaded++;

        console.log(`[SEQUENTIAL LOADER] ============================================`);
        console.log(`[SEQUENTIAL LOADER] Level loaded (total levels loaded: ${this.totalLevelsLoaded})`);

        // Start music for new level (only if audio has been unlocked)
        // First level (totalLevelsLoaded === 0) uses "crystalVoyage"
        // All subsequent levels use "duskReverie"
        const musicManager = FundamentalSystemBridge["musicManager"];
        console.log(`[SEQUENTIAL LOADER] musicManager exists:`, !!musicManager);
        console.log(`[SEQUENTIAL LOADER] this.currentScene exists:`, !!this.currentScene);
        console.log(`[SEQUENTIAL LOADER] Config.audioHasBeenUnlocked:`, Config.audioHasBeenUnlocked);

        if (musicManager && this.currentScene) {
            // Use totalLevelsLoaded for music selection (0 = first level gets crystalVoyage)
            const songName = this.totalLevelsLoaded === 0 ? "crystalVoyage" : "duskReverie";
            console.log(`[SEQUENTIAL LOADER] Selected song: ${songName} (level ${this.totalLevelsLoaded})`);

            if (Config.audioHasBeenUnlocked) {
                console.log(`[SEQUENTIAL LOADER] Calling musicManager.playSong(scene, "${songName}", true, true)...`);
                try {
                    await musicManager.playSong(this.currentScene, songName, true, true);
                    console.log(`[SEQUENTIAL LOADER] ✓ Music started successfully: ${songName}`);
                } catch (error) {
                    console.error(`[SEQUENTIAL LOADER] ✗ Error starting music:`, error);
                }
            } else {
                console.warn(`[SEQUENTIAL LOADER] Skipping music - audio not yet unlocked by user interaction`);
            }
        } else {
            console.error(`[SEQUENTIAL LOADER] Cannot play music - musicManager:${!!musicManager}, scene:${!!this.currentScene}`);
        }
        console.log(`[SEQUENTIAL LOADER] ============================================`);

        // Reset state for next transition
        this.isLoadingNextLevel = false;
        this.isNextLevelReady = false;
        this.isReplayComplete = false;

        console.log("[SEQUENTIAL LOADER] Transition to next level complete");
    }

    /**
     * Builds the world sphere → level mapping dynamically from ConstellationManifest,
     * ConstellationStarToLevelManifest, and LevelProfileManifest.
     * One entry is created per star in the default constellation, keyed by star id.
     * A sphere is marked isAvailable only when LevelProfileManifest has a matching profile.
     * @returns {Object} Mapping of sphere indices to level data
     */
    initializeWorldLevelMapping() {
        const constellation = ConstellationManifest.getDefault();
        if (!constellation) {
            console.warn("[SequentialLevelLoader] No default constellation found — world mapping empty");
            return {};
        }

        const mapping = {};
        const stars = [...constellation.stars].sort((a, b) => a.id - b.id);

        for (const star of stars) {
            const entry = ConstellationStarToLevelManifest.get(constellation.id, star.id);

            if (!entry || entry.isPlaceholder) {
                mapping[star.id] = {
                    levelId: entry?.levelId || `placeholder_${constellation.id}_${star.id}`,
                    levelUrl: null,
                    name: entry?.levelName || star.name,
                    isAvailable: false,
                };
                continue;
            }

            const profile = LevelProfileManifest.levelProfiles?.[entry.levelId];
            mapping[star.id] = {
                levelId: entry.levelId,
                levelUrl: profile?.filename || (entry.levelId + ".txt"),
                name: entry.levelName,
                isAvailable: !!profile,
            };
        }

        return mapping;
    }

    /**
     * Gets level data for a specific world sphere index
     * @param {number} sphereIndex - Index of the sphere (0-8)
     * @returns {Object|null} Level data or null if invalid index
     */
    getWorldLevelData(sphereIndex) {
        return this.WORLD_LEVEL_MAPPING[sphereIndex] || null;
    }

    /**
     * Gets the full level URL for a world sphere, including the base URL
     * @param {number} sphereIndex - Index of the sphere (0-8)
     * @returns {string|null} Full level URL or null if not available
     */
    getWorldLevelUrl(sphereIndex) {
        const levelData = this.getWorldLevelData(sphereIndex);
        if (!levelData || !levelData.levelUrl) {
            return null;
        }

        // Construct full URL (assuming GitHub raw content URL like other levels)
        return `https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/${levelData.levelUrl}`;
    }

    /**
     * Loads a player into the new level with transferred data
     */
    async loadPlayerWithTransferredData(gameplayManager, activeGameplayLevel) {
        // Create a new player instance
        let newPlayer = PlayerLoader.getFreshPlayer(activeGameplayLevel.levelDataComposite);
        newPlayer.playerMovementManager.setMaxMovementDistance(5);

        // Transfer player data if available (EXCEPT health - always reset to full)
        if (this.originalPlayerData) {
            if (newPlayer.playerStatus) {
                newPlayer.playerStatus.name = this.originalPlayerData.name;
                newPlayer.playerStatus.currentLevel = this.originalPlayerData.currentLevel;
                newPlayer.playerStatus.currentExperience = this.originalPlayerData.currentExp;
                newPlayer.playerStatus.currentMagicLevel = this.originalPlayerData.currentMagicLevel;
                newPlayer.playerStatus.currentMagicPoints = this.originalPlayerData.currentMagicPoints;
                newPlayer.playerStatus.maximumMagicPoints = this.originalPlayerData.maximumMagicPoints;
                newPlayer.playerStatus.baseMaxSpeed = this.originalPlayerData.baseMaxSpeed;

                // Transfer inventory if available
                if (this.originalPlayerData.inventory) {
                    newPlayer.playerStatus.playerInventoryMain = this.originalPlayerData.inventory;
                }
            }

            // Transfer mock inventory if available
            if (this.originalPlayerData.mockInventory) {
                newPlayer.setMockInventory(this.originalPlayerData.mockInventory);
            }

            console.log("[SEQUENTIAL LOADER] Player data transferred (health will be set by PlayerStatusTracker)");
        }

        // Ensure PlayerStatusTracker is attached BEFORE loading player into level
        const playerStatusTracker = FundamentalSystemBridge["playerStatusTracker"];
        if (playerStatusTracker instanceof PlayerStatusTracker) {
            console.log("[SEQUENTIAL LOADER] Attaching PlayerStatusTracker - current tracker health:", playerStatusTracker.getCurrentHealth());
            // Only attach if not already attached (player should already have tracker status from PlayerLoader)
            if (newPlayer.playerStatus !== playerStatusTracker.playerStatus) {
                playerStatusTracker.attachStatusToPlayer(newPlayer);
                console.log("[SEQUENTIAL LOADER] PlayerStatusTracker attached (was not already attached)");
            } else {
                console.log("[SEQUENTIAL LOADER] PlayerStatusTracker already attached from PlayerLoader");
            }
            // Force health to full before loading into level
            if (playerStatusTracker.playerStatus) {
                console.log("[SEQUENTIAL LOADER] Before health reset - tracker shows:", playerStatusTracker.getCurrentHealth());
                playerStatusTracker.playerStatus.currentHealthPoints = Config.STARTING_HEALTH;
                playerStatusTracker.playerStatus.maximumHealthPoints = Config.STARTING_HEALTH;
                console.log("[SEQUENTIAL LOADER] PlayerStatusTracker health forced to:", Config.STARTING_HEALTH, "- tracker now shows:", playerStatusTracker.getCurrentHealth());
            }
            playerStatusTracker.updateHealthUI();
        }

        // Load the player into the level
        await gameplayManager.loadPlayerToGameplayLevel(activeGameplayLevel, newPlayer);

        // Final verification that health is correct
        if (newPlayer.playerStatus) {
            console.log("[SEQUENTIAL LOADER] Final health check - player status health:", newPlayer.playerStatus.currentHealthPoints, "/", newPlayer.playerStatus.maximumHealthPoints);
        }
        if (playerStatusTracker) {
            console.log("[SEQUENTIAL LOADER] Final health check - tracker health:", playerStatusTracker.getCurrentHealth());
        }

        // Reset UI bars to full for new level
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        const uiScene = renderSceneSwapper?.getActiveUIScene();
        if (uiScene) {
            // Reset health bar to full (4/4)
            if (uiScene.heartSocketBar && typeof uiScene.heartSocketBar.setCurrentHearts === 'function') {
                uiScene.heartSocketBar.setCurrentHearts(4);
                console.log("[SEQUENTIAL LOADER] Health bar reset to full (4/4)");
            }

            // Reset mana bar to full (3/3)
            if (uiScene.manaBar && typeof uiScene.manaBar.setCurrentMana === 'function') {
                uiScene.manaBar.setCurrentMana(3);
                console.log("[SEQUENTIAL LOADER] Mana bar reset to full (3/3)");
            }

            // Reset artifact bar to full (3/3)
            if (uiScene.artifactSocketBar && typeof uiScene.artifactSocketBar.setCurrentArtifacts === 'function') {
                uiScene.artifactSocketBar.setCurrentArtifacts(3);
                console.log("[SEQUENTIAL LOADER] Artifact bar reset to full (3/3)");
            }
        }

        console.log("[SEQUENTIAL LOADER] New player loaded into next level");
    }
}
