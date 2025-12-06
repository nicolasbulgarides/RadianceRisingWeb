/**
 * SequentialLevelLoader
 * 
 * Chamber-based level loading system that uses spatial offsets instead of scene switching.
 * 
 * Chamber System:
 * - Chamber 1: x=0 (current level) + x=20 (replay clone)
 * - Chamber 2: x=50 (next level)
 * - When loading a third level, it goes back to Chamber 1 (x=0)
 * - Transitions are done by moving the camera by x=50 instead of switching scenes
 * 
 * This avoids vertex buffer issues from scene switching by keeping everything in one scene.
 */
class SequentialLevelLoader {
    constructor() {
        // Chamber system
        this.CHAMBER_1_OFFSET = new BABYLON.Vector3(0, 0, 0);
        this.CHAMBER_2_OFFSET = new BABYLON.Vector3(50, 0, 0);
        this.currentChamber = 1; // 1 or 2

        // Track which chambers have levels loaded (to prevent thin instance accumulation)
        this.chambersWithLevels = new Set(); // Tracks chamber offsets (as strings) that have levels

        // Store chamber-specific tile copies to avoid thin instance accumulation
        this.chamberTileCopies = new Map(); // Maps chamber key (string) to array of cloned tile meshes

        // Next level data
        this.nextLevelData = null;
        this.nextLevelActiveGameplayLevel = null;
        this.nextLevelChamberOffset = null; // Will be CHAMBER_2_OFFSET or CHAMBER_1_OFFSET
        this.isLoadingNextLevel = false;
        this.isNextLevelReady = false;
        this.isReplayComplete = false;
        this.nextLevelUrl = null;
        this.originalPlayerData = null;

        // Current scene (same for all chambers)
        this.currentScene = null;
        this.currentSceneBuilder = null;
    }

    /**
     * Starts loading the next level in the background
     * @param {string} nextLevelUrl - URL to the next level JSON data
     * @param {PlayerUnit} currentPlayer - Current player to extract data from
     */
    async startLoadingNextLevel(nextLevelUrl, currentPlayer) {
        if (this.isLoadingNextLevel) {
            console.warn("[SEQUENTIAL LOADER] Already loading next level");
            return;
        }

        this.nextLevelUrl = nextLevelUrl;
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

        // Determine which chamber to load into (alternate between 1 and 2)
        // If current chamber is 1, load into chamber 2 (x=50)
        // If current chamber is 2, load into chamber 1 (x=0)
        if (this.currentChamber === 1) {
            this.nextLevelChamberOffset = this.CHAMBER_2_OFFSET.clone();
            console.log("[SEQUENTIAL LOADER] Loading next level into Chamber 2 (x=50)");
        } else {
            this.nextLevelChamberOffset = this.CHAMBER_1_OFFSET.clone();
            console.log("[SEQUENTIAL LOADER] Loading next level into Chamber 1 (x=0)");
        }

        // Create or get chamber-specific tile copies to avoid thin instance accumulation
        const chamberKey = `${this.nextLevelChamberOffset.x}_${this.nextLevelChamberOffset.y}_${this.nextLevelChamberOffset.z}`;
        if (!this.chamberTileCopies.has(chamberKey)) {
            console.log(`[SEQUENTIAL LOADER] Creating tile copies for chamber at ${this.nextLevelChamberOffset.x}...`);
            await this.createChamberTileCopies(this.nextLevelChamberOffset);
        }

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

            // Load the level into the current scene with chamber offset
            await this.loadLevelIntoChamber(levelJsonData, this.currentScene, this.nextLevelChamberOffset);

            // Verify the level is fully ready
            if (!this.verifyLevelReady()) {
                throw new Error("Level verification failed - level not ready");
            }

            this.isNextLevelReady = true;
            console.log(`[SEQUENTIAL LOADER] Next level loaded and verified ready in Chamber at ${this.nextLevelChamberOffset.x}`);

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
     * Creates chamber-specific copies of the base tile meshes
     * This allows each chamber to have its own set of base meshes with thin instances,
     * preventing vertex buffer overflow from accumulating thin instances on the same meshes
     * @param {BABYLON.Vector3} chamberOffset - The chamber offset
     */
    async createChamberTileCopies(chamberOffset) {
        const gridManager = FundamentalSystemBridge["levelFactoryComposite"]?.gridManager;
        if (!gridManager || !gridManager.loadedTiles) {
            console.warn("[SEQUENTIAL LOADER] Cannot create tile copies - grid manager or tiles not available");
            return;
        }

        const chamberKey = `${chamberOffset.x}_${chamberOffset.y}_${chamberOffset.z}`;
        const scene = this.currentScene;

        if (!scene) {
            console.error("[SEQUENTIAL LOADER] Cannot create tile copies - scene not available");
            return;
        }

        console.log(`[SEQUENTIAL LOADER] Creating tile copies for chamber at ${chamberOffset.x}...`);

        const chamberTiles = [];

        // Clone each base tile for this chamber
        for (const originalTile of gridManager.loadedTiles) {
            if (originalTile && originalTile.meshes && originalTile.meshes.length > 0) {
                const originalRootMesh = originalTile.meshes[0];

                // Clone the root mesh and all its children
                const clonedRootMesh = originalRootMesh.clone(`${originalRootMesh.name}_chamber_${chamberOffset.x}`, null, false);
                clonedRootMesh.setEnabled(true);

                // Clone all child meshes
                const originalChildren = originalRootMesh.getChildren(undefined, false);
                const clonedChildren = [];

                for (const child of originalChildren) {
                    if (child instanceof BABYLON.Mesh) {
                        const clonedChild = child.clone(`${child.name}_chamber_${chamberOffset.x}`, clonedRootMesh, false);
                        clonedChild.setEnabled(true);

                        // Clear any thin instances that may have been copied from the original
                        // This ensures we start with clean meshes for this chamber
                        if (clonedChild.hasThinInstances && clonedChild.thinInstanceCount > 0) {
                            try {
                                clonedChild.thinInstanceSetBuffer("matrix", null);
                                console.log(`[SEQUENTIAL LOADER] Cleared ${clonedChild.thinInstanceCount} thin instances from cloned mesh ${clonedChild.name}`);
                            } catch (error) {
                                console.warn(`[SEQUENTIAL LOADER] Could not clear thin instances from ${clonedChild.name}:`, error);
                            }
                        }

                        clonedChildren.push(clonedChild);
                    }
                }

                // Create a tile object similar to the original structure
                const clonedTile = {
                    meshes: [clonedRootMesh],
                    // Store reference to cloned children for thin instance generation
                    clonedChildren: clonedChildren
                };

                chamberTiles.push(clonedTile);
            }
        }

        // Store the chamber-specific tiles
        this.chamberTileCopies.set(chamberKey, chamberTiles);

        console.log(`[SEQUENTIAL LOADER] Created ${chamberTiles.length} tile copies for chamber at ${chamberOffset.x}`);
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
        this.nextLevelChamberOffset = null;
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
     * Loads a level into a specific chamber (spatial offset) in the same scene
     * @param {Object} levelJsonData - The level JSON data
     * @param {BABYLON.Scene} targetScene - The scene to load the level into (same scene for all chambers)
     * @param {BABYLON.Vector3} chamberOffset - The spatial offset for this chamber (x=0 or x=50)
     */
    async loadLevelIntoChamber(levelJsonData, targetScene, chamberOffset) {
        // Parse JSON if it's a string
        let levelData = typeof levelJsonData === 'string'
            ? JSON.parse(levelJsonData)
            : levelJsonData;

        // Ensure factory support systems are loaded (tiles, etc.)
        await FundamentalSystemBridge["levelFactoryComposite"].loadFactorySupportSystems();

        // Parse the level data and create LevelDataComposite
        let levelDataComposite = this.parseLevelJsonToComposite(levelData, chamberOffset);

        if (!levelDataComposite) {
            throw new Error("Failed to parse level data");
        }

        // Create obstacles from the level data (with chamber offset)
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

        // Create active gameplay level for the chamber
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

        // Create stardust pickups (with chamber offset)
        await this.createStardustPickups(activeGameplayLevel, levelData, this.currentSceneBuilder, chamberOffset);

        // Render obstacles (with chamber offset)
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

        // Render the level grid (with chamber offset)
        // Get dimensions for grid generation
        const dimensions = this.getLevelDimensions(activeGameplayLevel);

        // Generate grid with offset for this chamber using chamber-specific tile copies
        const chamberKey = `${chamberOffset.x}_${chamberOffset.y}_${chamberOffset.z}`;
        const chamberTiles = this.chamberTileCopies.get(chamberKey);

        if (!chamberTiles) {
            throw new Error(`Chamber tile copies not found for chamber at ${chamberOffset.x}`);
        }

        const gridSuccess = await this.generateGridWithChamberTiles(
            chamberTiles,
            dimensions.width,
            dimensions.depth,
            chamberOffset.clone(),
            1 // tileSize
        );

        if (!gridSuccess) {
            throw new Error("Failed to generate grid for chamber");
        }

        // Initialize lighting for the level
        activeGameplayLevel.initializeLevelLighting();

        // Register microevents
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        if (microEventManager) {
            const levelId = levelDataComposite.levelHeaderData?.levelId;
            if (!microEventManager.gameplayLevelToMicroEventsMap[levelId]) {
                microEventManager.prepareAndRegisterMicroEventsForLevel(levelDataComposite);
            }
        }

        // Store references
        this.nextLevelActiveGameplayLevel = activeGameplayLevel;
        this.nextLevelData = levelDataComposite;

        // Mark this chamber as having a level (chamberKey already declared above)
        this.chambersWithLevels.add(chamberKey);

        console.log(`[SEQUENTIAL LOADER] Level loaded into chamber at offset ${chamberOffset.x}, ${chamberOffset.y}, ${chamberOffset.z}`);
    }

    /**
     * Generates a grid using chamber-specific tile copies
     * @param {Array} chamberTiles - The chamber-specific tile copies
     * @param {number} width - Grid width
     * @param {number} depth - Grid depth
     * @param {BABYLON.Vector3} offset - Chamber offset
     * @param {number} tileSize - Tile size
     * @returns {Promise<boolean>} Success status
     */
    async generateGridWithChamberTiles(chamberTiles, width, depth, offset, tileSize = 1) {
        // Validate input dimensions
        if (!width || !depth || width < 1 || depth < 1) {
            console.error(`[SEQUENTIAL LOADER] Invalid grid dimensions: ${width}x${depth}`);
            return false;
        }

        if (!chamberTiles || chamberTiles.length === 0) {
            console.error("[SEQUENTIAL LOADER] No chamber tiles provided");
            return false;
        }

        // Iterate over every grid cell position
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                // Use a pattern to vary the tile selection
                const rowOffset = x % chamberTiles.length;
                const tileIndex = (z + rowOffset) % chamberTiles.length;
                const baseTile = chamberTiles[tileIndex];

                if (!baseTile || !baseTile.meshes || baseTile.meshes.length === 0) {
                    console.warn(`[SEQUENTIAL LOADER] Missing or invalid tile at index ${tileIndex}`);
                    continue;
                }

                // Get the cloned children meshes for thin instancing
                const children = baseTile.clonedChildren || baseTile.meshes[0].getChildren(undefined, false);

                // Instance each child mesh at the correct grid position with offset
                for (const mesh of children) {
                    if (mesh instanceof BABYLON.Mesh) {
                        // Ensure the mesh is set up for thin instancing
                        if (mesh.isFrozen) {
                            mesh.unfreezeWorldMatrix();
                        }

                        // Enable thin instances if not already enabled
                        if (!mesh.hasThinInstances) {
                            mesh.thinInstanceEnablePicking = true;
                        }

                        // Calculate the space position based on grid coordinates with offset
                        const xPos = (x * tileSize) + offset.x;
                        const yPos = offset.y;
                        // Flip builder Y to Babylon Z for grid as well
                        const zPos = ((depth - 1 - z) * tileSize) + offset.z;
                        // Create a transformation matrix for placement with offset
                        const matrix = BABYLON.Matrix.Translation(xPos, yPos, zPos);
                        // Add the transformation as a thin instance
                        try {
                            mesh.thinInstanceAdd(matrix);
                        } catch (error) {
                            console.error(`[SEQUENTIAL LOADER] Error adding thin instance to mesh ${mesh.name}:`, error);
                        }
                    }
                }
            }
        }

        return true;
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
     * Parses JSON level data into a LevelDataComposite with chamber offset
     */
    parseLevelJsonToComposite(levelData, chamberOffset) {
        const levelId = levelData.levelName || "level0";
        const levelNickname = levelData.levelName || "Level 0";
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
     * Creates obstacle data objects from level JSON data with chamber offset
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
     * Creates stardust pickups from level data with chamber offset
     */
    async createStardustPickups(activeGameplayLevel, levelData, sceneBuilder, chamberOffset) {
        const stardustElements = levelData.allMapElements?.filter(el => el.element === "STAR_DUST") || [];
        const microEventManager = FundamentalSystemBridge["microEventManager"];
        const depth = this.getLevelDepth(levelData);

        const levelId = activeGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId || levelData.levelName || "level0";

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
     * Transitions to the next level: shows explosion, then teleports camera to new chamber
     */
    async transitionToNextLevel() {
        if (!this.isNextLevelReady || !this.nextLevelActiveGameplayLevel || !this.nextLevelChamberOffset) {
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

        // Teleport camera to the new chamber by adjusting its position
        const scene = this.currentScene;
        const camera = scene.activeCamera;

        if (camera) {
            // Calculate the offset needed to move camera to new chamber
            const currentChamberOffset = this.currentChamber === 1 ? this.CHAMBER_1_OFFSET.clone() : this.CHAMBER_2_OFFSET.clone();
            const offsetDelta = this.nextLevelChamberOffset.clone().subtract(currentChamberOffset);

            // Move camera instantly to new chamber
            if (camera.position) {
                camera.position = camera.position.add(offsetDelta);
            }

            // If camera has a target, move that too
            if (camera.target) {
                if (camera.setTarget) {
                    const newTarget = camera.target.clone().add(offsetDelta);
                    camera.setTarget(newTarget);
                } else {
                    // For cameras without setTarget, directly modify target
                    camera.target = camera.target.add(offsetDelta);
                }
            }

            console.log(`[SEQUENTIAL LOADER] Camera teleported to chamber at ${this.nextLevelChamberOffset.x}`);
        }

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

        // Start music for new level (only if audio has been unlocked)
        const musicManager = FundamentalSystemBridge["musicManager"];
        if (musicManager && this.currentScene && Config.audioHasBeenUnlocked) {
            musicManager.playSong(this.currentScene, "crystalVoyage", true, true);
        }

        // Update current chamber
        this.currentChamber = this.currentChamber === 1 ? 2 : 1;
        console.log(`[SEQUENTIAL LOADER] Switched to Chamber ${this.currentChamber}`);

        // Reset state for next transition
        this.isLoadingNextLevel = false;
        this.isNextLevelReady = false;
        this.isReplayComplete = false;
        this.nextLevelChamberOffset = null;

        console.log("[SEQUENTIAL LOADER] Transition to next level complete");
    }

    /**
     * Loads a player into the new level with transferred data
     */
    async loadPlayerWithTransferredData(gameplayManager, activeGameplayLevel) {
        // Create a new player instance
        let newPlayer = PlayerLoader.getFreshPlayer(activeGameplayLevel);
        newPlayer.playerMovementManager.setMaxMovementDistance(5);

        // Transfer player data if available
        if (this.originalPlayerData) {
            if (newPlayer.playerStatus) {
                newPlayer.playerStatus.name = this.originalPlayerData.name;
                newPlayer.playerStatus.currentLevel = this.originalPlayerData.currentLevel;
                newPlayer.playerStatus.currentExperience = this.originalPlayerData.currentExp;
                newPlayer.playerStatus.currentMagicLevel = this.originalPlayerData.currentMagicLevel;
                newPlayer.playerStatus.currentMagicPoints = this.originalPlayerData.currentMagicPoints;
                newPlayer.playerStatus.maximumMagicPoints = this.originalPlayerData.maximumMagicPoints;
                newPlayer.playerStatus.currentHealthPoints = this.originalPlayerData.currentHealthPoints;
                newPlayer.playerStatus.maximumHealthPoints = this.originalPlayerData.maximumHealthPoints;
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

            console.log("[SEQUENTIAL LOADER] Player data transferred to new player");
        }

        // Load the player into the level
        await gameplayManager.loadPlayerToGameplayLevel(activeGameplayLevel, newPlayer);

        console.log("[SEQUENTIAL LOADER] New player loaded into next level");
    }
}
