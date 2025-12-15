/**
 * WorldLoaderScene
 *
 * A world selection scene with 9 clickable spheres arranged in a 3x3 grid.
 * Each sphere represents a level/world that can be selected.
 */

// Global debug flag for WorldLoaderScene
const WORLD_LOADER_DEBUG = false;
class WorldLoaderScene extends GameWorldSceneGeneralized {
    constructor() {
        super();
        this.worldSpheres = []; // Array to store all world spheres
        this.centerSphere = null; // Reference to the center sphere (at 0, 0, 0)
        this.selectedWorldIndex = null;
        this.isLoadingWorld = false;
        this.worldSpheresInitialized = false; // Track if spheres have been created

        // Double click detection properties
        this.lastClickTime = 0;
        this.lastClickedSphere = null;
        this.doubleClickDelay = 300; // milliseconds

        // Hover tracking properties
        this.currentlyHoveredSphere = null;


        // Debug logging method
        this.worldLoaderDebugLog = (...args) => {
            if (WORLD_LOADER_DEBUG) this.worldLoaderDebugLog("", ...args);
        };

        // Register callback for level completion updates
        this.setupLevelCompletionCallback();
        this.setupBackgroundImage();
        this.setupCamera();
        this.setupLighting();
        // Delay sphere creation and click handler setup until sequential loader is available
        this.initializeWorldSpheresWhenReady();
    }



    setupBackgroundImage() {
        const backgroundImageUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/spaceBackground.jpg";

        // Create a layer to display the texture
        const backgroundLayer = new BABYLON.Layer("backgroundLayer", backgroundImageUrl, this, true);

        // Optional: Keep the scene clear color opaque if using a background layer
        this.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    }

    /**
     * Initialize world spheres when the sequential level loader becomes available
     * This handles the initialization order issue where the scene is created before all systems are ready
     */
    initializeWorldSpheresWhenReady() {
        // Check immediately if sequential loader is available
        if (FundamentalSystemBridge["sequentialLevelLoader"]) {
            this.createWorldSpheres();
            this.setupClickHandlers();
            return;
        }

        // If not available yet, set up a periodic check
        const checkInterval = setInterval(() => {
            if (FundamentalSystemBridge["sequentialLevelLoader"]) {
                clearInterval(checkInterval);
                this.createWorldSpheres();
                this.setupClickHandlers();
                // Ensure camera is set after initialization
                this.ensureWorldLoaderCamera();
            }
        }, 100); // Check every 100ms

        // Safety timeout after 10 seconds
        setTimeout(() => {
            if (!this.worldSpheresInitialized) {
                clearInterval(checkInterval);
                console.error("[WorldLoaderScene] Sequential level loader still not available after 10 seconds - creating spheres with fallback");
                this.createWorldSpheresWithFallback();
                this.setupClickHandlers();
                // Ensure camera is set even in fallback case
                this.ensureWorldLoaderCamera();
            }
        }, 10000);
    }

    /**
     * Creates 9 spheres arranged in a 3x3 grid, centered on screen
     */
    createWorldSpheres() {
        const sphereDiameter = 2;
        const spacing = 4; // Space between sphere centers
        const gridSize = 3; // 3x3 grid

        // Get level data from sequential level loader
        const sequentialLoader = FundamentalSystemBridge["sequentialLevelLoader"];
        if (!sequentialLoader) {
            console.error("[WorldLoaderScene] Sequential level loader not found");
            return;
        }

        // Position spheres relative to center
        // Center sphere (row 1, col 1) will be at (0, 0, 0)
        // Other spheres offset relative to center
        const centerRow = 1; // Middle row (0-based index)
        const centerCol = 1; // Middle column (0-based index)

        let sphereIndex = 0;

        // Create 3 rows
        for (let row = 0; row < gridSize; row++) {
            // Create 3 columns
            for (let col = 0; col < gridSize; col++) {
                // Calculate offset from center: (col - centerCol) * spacing for X, (row - centerRow) * spacing for Z
                const x = (col - centerCol) * spacing;
                const z = (row - centerRow) * spacing;
                const y = 0; // All spheres on horizontal plane (same as game board)

                // Create sphere
                const sphere = BABYLON.MeshBuilder.CreateSphere(
                    `worldSphere_${row}_${col}`,
                    {
                        diameter: sphereDiameter,
                        segments: 32
                    },
                    this
                );

                // Position the sphere
                sphere.position = new BABYLON.Vector3(x, y, z);

                // Store reference to center sphere (at 0, 0, 0)
                if (x === 0 && y === 0 && z === 0) {
                    this.centerSphere = sphere;
                }

                // Get level data from sequential loader
                const levelData = sequentialLoader.getWorldLevelData(sphereIndex);
                const isCompleted = FundamentalSystemBridge["levelsSolvedStatusTracker"]?.isLevelCompleted(sphereIndex) || false;

                // Create material based on level status
                const material = this.createSphereMaterial(sphereIndex, levelData, isCompleted);

                sphere.material = material;

                // Make sphere pickable for clicking (only if level is available)
                sphere.isPickable = levelData?.isAvailable || false;

                // Store level data with the sphere
                sphere.worldData = levelData;
                sphere.sphereIndex = sphereIndex;
                sphere.isCompleted = isCompleted;

                // Add hover effect (slight scale up and change to orange on hover) to all spheres
                this.addHoverEffect(sphere);

                this.worldSpheres.push(sphere);
                sphereIndex++;
            }
        }

        this.worldSpheresInitialized = true;
    }

    /**
     * Creates world spheres with fallback data when sequential level loader is not available
     * This provides basic sphere creation for development/testing when the full level system isn't ready
     */
    createWorldSpheresWithFallback() {
        const sphereDiameter = 2;
        const spacing = 4; // Space between sphere centers
        const gridSize = 3; // 3x3 grid

        // Position spheres relative to center
        // Center sphere (row 1, col 1) will be at (0, 0, 0)
        // Other spheres offset relative to center
        const centerRow = 1; // Middle row (0-based index)
        const centerCol = 1; // Middle column (0-based index)

        let sphereIndex = 0;

        // Create 3 rows
        for (let row = 0; row < gridSize; row++) {
            // Create 3 columns
            for (let col = 0; col < gridSize; col++) {
                // Calculate offset from center: (col - centerCol) * spacing for X, (row - centerRow) * spacing for Z
                const x = (col - centerCol) * spacing;
                const z = (row - centerRow) * spacing;
                const y = 0; // All spheres on horizontal plane (same as game board)

                // Create sphere
                const sphere = BABYLON.MeshBuilder.CreateSphere(
                    `worldSphere_${row}_${col}`,
                    {
                        diameter: sphereDiameter,
                        segments: 32
                    },
                    this
                );

                // Position the sphere
                sphere.position = new BABYLON.Vector3(x, y, z);

                // Store reference to center sphere (at 0, 0, 0)
                if (x === 0 && y === 0 && z === 0) {
                    this.centerSphere = sphere;
                }

                // Create fallback level data for development
                const fallbackLevelData = {
                    levelId: `level${sphereIndex}`,
                    name: `Level ${sphereIndex}`,
                    isAvailable: sphereIndex < 6, // First 6 levels available
                    levelUrl: null
                };

                // Create material based on level status (gray for all in fallback mode)
                const material = new BABYLON.StandardMaterial(`worldSphereMaterial_${sphereIndex}`, this);
                const notAvailableGray = new BABYLON.Color3(0.4, 0.4, 0.4);
                material.emissiveColor = notAvailableGray;
                material.diffuseColor = notAvailableGray.scale(0.5);
                material.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
                material.emissiveIntensity = 0.8;
                material.roughness = 0.2;

                sphere.material = material;

                // Make sphere pickable for available levels only
                sphere.isPickable = fallbackLevelData.isAvailable;

                // Store level data with the sphere
                sphere.worldData = fallbackLevelData;
                sphere.sphereIndex = sphereIndex;
                sphere.isCompleted = false;

                this.worldSpheres.push(sphere);
                sphereIndex++;
            }
        }

        this.worldLoaderDebugLog(`Created ${this.worldSpheres.length} world spheres in fallback mode (sequential loader unavailable)`);

        this.worldSpheresInitialized = true;
    }

    /**
     * Converts HSL to RGB color
     */
    hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r, g, b };
    }

    /**
     * Adds hover effect preparation to a sphere (materials are managed centrally)
     */
    addHoverEffect(sphere) {

        // Store original scaling and material
        sphere.originalScaling = sphere.scaling.clone();
        sphere.originalMaterial = sphere.material.clone();

        // Create orange hover material
        const hoverMaterial = sphere.material.clone();
        const hoverOrange = new BABYLON.Color3(1.0, 0.6, 0.0); // Orange color
        hoverMaterial.emissiveColor = hoverOrange;
        hoverMaterial.diffuseColor = hoverOrange.scale(0.8);
        hoverMaterial.specularColor = new BABYLON.Color3(1.0, 0.8, 0.4);
        hoverMaterial.emissiveIntensity = 1.5;
        sphere.hoverMaterial = hoverMaterial;

        // Ensure sphere is pickable for hover detection
        sphere.isPickable = true;
    }


    /**
     * Creates appropriate material for sphere based on level status
     * @param {number} sphereIndex - Index of the sphere
     * @param {Object} levelData - Level data for this sphere
     * @param {boolean} isCompleted - Whether the level is completed
     * @returns {BABYLON.StandardMaterial} The material for the sphere
     */
    createSphereMaterial(sphereIndex, levelData, isCompleted) {
        const material = new BABYLON.StandardMaterial(`worldSphereMaterial_${sphereIndex}`, this);

        if (isCompleted) {
            // Green for completed levels
            const completedGreen = new BABYLON.Color3(0.2, 0.8, 0.3);
            material.emissiveColor = completedGreen;
            material.diffuseColor = completedGreen.scale(0.7);
            material.specularColor = new BABYLON.Color3(0.8, 1.0, 0.8);
            material.emissiveIntensity = 1.2;
        } else if (levelData?.isAvailable) {
            // Blue for available but not completed levels
            const availableBlue = new BABYLON.Color3(0.2, 0.6, 1.0);
            material.emissiveColor = availableBlue;
            material.diffuseColor = availableBlue.scale(0.6);
            material.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
            material.emissiveIntensity = 1.4;
        } else {
            // Gray for levels not yet made
            const notAvailableGray = new BABYLON.Color3(0.4, 0.4, 0.4);
            material.emissiveColor = notAvailableGray;
            material.diffuseColor = notAvailableGray.scale(0.5);
            material.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            material.emissiveIntensity = 0.8;
        }

        material.roughness = 0.2;
        return material;
    }

    /**
     * Updates the color of a specific sphere based on its completion status
     * @param {number} sphereIndex - Index of the sphere to update
     */
    updateSphereColor(sphereIndex) {
        const sphere = this.worldSpheres[sphereIndex];
        if (!sphere) {
            console.warn(`[WorldLoaderScene] Sphere ${sphereIndex} not found in worldSpheres array`);
            return;
        }

        const levelData = sphere.worldData;
        const isCompleted = FundamentalSystemBridge["levelsSolvedStatusTracker"]?.isLevelCompleted(sphereIndex) || false;

        // Update sphere properties
        sphere.isCompleted = isCompleted;
        sphere.isPickable = levelData?.isAvailable || false;

        // Create new material
        const newMaterial = this.createSphereMaterial(sphereIndex, levelData, isCompleted);
        sphere.material = newMaterial;
    }

    /**
     * Sets up click handlers for all spheres
     */
    setupClickHandlers() {
        // Ensure pointer events are enabled for picking
        this.preventDefaultOnPointerDown = false;
        this.preventDefaultOnPointerUp = false;

        // Enable pointer events on the scene
        this.onPointerObservable.add((pointerInfo) => {

            // Handle hover effects centrally
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                // Use Babylon.js standard approach: pointerInfo.pickInfo.pickedMesh
                let hoveredSphere = null;

                if (pointerInfo.pickInfo && pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh) {
                    hoveredSphere = this.worldSpheres.find(sphere =>
                        sphere === pointerInfo.pickInfo.pickedMesh ||
                        pointerInfo.pickInfo.pickedMesh.parent === sphere ||
                        (typeof pointerInfo.pickInfo.pickedMesh.getParent === "function" && pointerInfo.pickInfo.pickedMesh.getParent() === sphere)
                    );
                }

                // Handle hover state changes
                this.handleHoverChange(hoveredSphere);
            }

            // Handle clicks
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                const pickResult = pointerInfo.pickInfo || this.pick(pointerInfo.event.pointerX, pointerInfo.event.pointerY);

                if (pickResult.hit && pickResult.pickedMesh) {
                    const clickedSphere = this.worldSpheres.find(sphere =>
                        sphere === pickResult.pickedMesh ||
                        pickResult.pickedMesh.parent === sphere ||
                        (typeof pickResult.pickedMesh.getParent === "function" && pickResult.pickedMesh.getParent() === sphere)
                    );

                    if (clickedSphere && clickedSphere.worldData) {
                        this.handleSphereClick(clickedSphere);
                    }
                }
            }
        });

        //this.worldLoaderDebugLog(" Click handlers set up");
    }

    /**
     * Handles sphere clicks with double-click detection
     * @param {BABYLON.Mesh} sphere - The clicked sphere
     */
    handleSphereClick(sphere) {
        const currentTime = Date.now();

        // Check if this is a double click (within time window and same sphere)
        if (this.lastClickedSphere === sphere &&
            (currentTime - this.lastClickTime) < this.doubleClickDelay) {
            // Double click detected - load the level
            this.onWorldSelected(sphere);
            // Reset click tracking
            this.lastClickedSphere = null;
            this.lastClickTime = 0;
        } else {
            // Single click - store for potential double click
            this.lastClickedSphere = sphere;
            this.lastClickTime = currentTime;
        }
    }

    /**
     * Handles hover state changes centrally
     * @param {BABYLON.Mesh|null} newHoveredSphere - The sphere currently being hovered, or null
     */
    handleHoverChange(newHoveredSphere) {
        if (WORLD_LOADER_DEBUG) {
            console.log("[WorldLoaderScene] handleHoverChange called with:", newHoveredSphere ? newHoveredSphere.name : "null");
        }

        // If hovering over the same sphere, do nothing
        if (this.currentlyHoveredSphere === newHoveredSphere) {
            return;
        }

        // Reset previous hover state
        if (this.currentlyHoveredSphere) {
            if (WORLD_LOADER_DEBUG) {
                console.log("[WorldLoaderScene] Resetting hover state for:", this.currentlyHoveredSphere.name);
            }
            this.currentlyHoveredSphere.scaling = this.currentlyHoveredSphere.originalScaling.clone();
            this.currentlyHoveredSphere.material = this.currentlyHoveredSphere.originalMaterial;
        }

        // Apply new hover state
        if (newHoveredSphere) {
            if (WORLD_LOADER_DEBUG) {
                console.log("[WorldLoaderScene] Applying hover state to:", newHoveredSphere.name);
            }
            const hoverScale = 1.2;
            newHoveredSphere.scaling = new BABYLON.Vector3(hoverScale, hoverScale, hoverScale);
            newHoveredSphere.material = newHoveredSphere.hoverMaterial;
        }

        // Update current hover tracking
        this.currentlyHoveredSphere = newHoveredSphere;
    }

    /**
     * Handles when a world sphere is clicked
     * @param {BABYLON.Mesh} sphere - The clicked sphere
     */
    async onWorldSelected(sphere) {
        if (this.isLoadingWorld) {
            //this.worldLoaderDebugLog(" Level load already in progress, ignoring click");
            return;
        }
        this.isLoadingWorld = true;
        this.selectedWorldIndex = sphere.sphereIndex; // Track which sphere was selected
        const worldData = sphere.worldData;

        // Visual feedback: pulse the selected sphere
        this.pulseSphere(sphere);

        // Load the selected level
        await this.loadSelectedLevel(worldData);
        this.isLoadingWorld = false;
    }

    /**
     * Creates a pulsing animation effect on the selected sphere
     */
    pulseSphere(sphere) {
        const originalScale = sphere.scaling.clone();
        let pulseTime = 0;
        const pulseDuration = 1000; // 1 second
        const startTime = Date.now();

        const pulseObserver = this.onBeforeRenderObservable.add(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed < pulseDuration) {
                pulseTime = elapsed / pulseDuration;
                const scale = 1.0 + Math.sin(pulseTime * Math.PI * 4) * 0.3; // Pulse 4 times
                sphere.scaling = new BABYLON.Vector3(scale, scale, scale);
            } else {
                sphere.scaling = originalScale;
                this.onBeforeRenderObservable.remove(pulseObserver);
            }
        });
    }

    /**
     * Loads the selected level
     * @param {Object} worldData - The level data for the selected world
     */
    async loadSelectedLevel(worldData) {
        // Get the level loader manager
        const levelLoaderManager = FundamentalSystemBridge["levelLoaderManager"];
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

        if (!levelLoaderManager || !gameplayManager) {
            // console.error("[WorldLoaderScene] Level loader or gameplay manager not found");
            return;
        }

        // Reset pickup streak/experience so new worlds start fresh
        const specialOccurrenceManager = FundamentalSystemBridge["specialOccurrenceManager"];
        specialOccurrenceManager?.pickupOccurrenceSubManager?.resetPickupProgress?.();

        // Clear any existing scheduled explosions for fresh level start
        if (window.ExplosionScheduler) {
            window.ExplosionScheduler.clearAllScheduledExplosions();
        }
        this.worldLoaderDebugLog(" Cleared existing explosions for fresh level start");

        // Get the level URL and level ID from sequential loader

        const sequentialLoader = FundamentalSystemBridge["sequentialLevelLoader"];
        const levelUrl = sequentialLoader?.getWorldLevelUrl(this.selectedWorldIndex);
        const worldLevelData = sequentialLoader?.getWorldLevelData(this.selectedWorldIndex);
        const levelId = worldLevelData?.levelId;

        if (!levelUrl) {
            console.error("[WorldLoaderScene] No level URL available for sphere", this.selectedWorldIndex);
            this.isLoadingWorld = false;
            return;
        }

        if (WORLD_LOADER_DEBUG) console.log(`[WorldLoaderScene] Loading level: ${levelId} from sphere ${this.selectedWorldIndex}`);

        try {
            const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];

            // Dispose and recreate the base game scene for a clean load (player reset)
            renderSceneSwapper.recreateBaseGameScene();

            // Keep UI scene active before and after load to avoid it being lost
            renderSceneSwapper.setActiveUIScene("BaseUIScene");

            // Reset replay manager so duplicate/replay state is clean for the new level
            const replayManager = FundamentalSystemBridge["levelReplayManager"];
            if (replayManager && typeof replayManager.resetForNewLevel === "function") {
                replayManager.resetForNewLevel();
            }

            // After recreation, make sure the base scene has a camera bound
            const baseScene = renderSceneSwapper.getSceneByName("BaseGameScene");
            if (baseScene) {
                let cam = renderSceneSwapper.allStoredCameras[baseScene];
                if (!cam) {
                    cam = CameraManager.setAndGetPlaceholderCamera(baseScene);
                    renderSceneSwapper.allStoredCameras[baseScene] = cam;
                }
                // Ensure orientation matches game board: top-down with 180 roll (no yaw flip)
                cam.rotation.x = Math.PI / 2;
                cam.rotation.y = 0;
                cam.rotation.z = 0;
                baseScene.activeCamera = cam;

                // Make the new base scene active BEFORE loading, so loaders build into it
                renderSceneSwapper.setActiveGameLevelScene("BaseGameScene");
                renderSceneSwapper.setActiveUIScene("BaseUIScene");
            }

            // Load the level via URL using the loader manager helper
            await levelLoaderManager.loadLevelFromUrl(gameplayManager, levelUrl, levelId);

            // After load, ensure the gameplay scene is active (redundant safety)
            renderSceneSwapper.setActiveGameLevelScene("BaseGameScene");
            // Reapply orientation on active camera in case it was replaced during load
            const activeCam = renderSceneSwapper.allStoredCameras[renderSceneSwapper.getSceneByName("BaseGameScene")];
            if (activeCam) {
                activeCam.rotation.x = Math.PI / 2;
                activeCam.rotation.y = 0;
                activeCam.rotation.z = 0;
            }
            // Re-activate the UI scene to ensure it stays rendered after game scene swap
            renderSceneSwapper.setActiveUIScene("BaseUIScene");

            // Store the sphere index globally so level completion can be tracked back to the sphere
            if (!window.currentLevelSphereIndex) {
                window.currentLevelSphereIndex = this.selectedWorldIndex;
            }

            //console.log(`[WorldLoaderScene] Loaded ${worldData.name} from ${levelUrl} and activated BaseGameScene`);
        } catch (error) {
            // console.error(`[WorldLoaderScene] Error loading level ${worldData.levelUrl}:`, error);
            // Clear the sphere index on error
            window.currentLevelSphereIndex = null;
        }
    }

    /**
     * Ensures the WorldLoaderScene camera is properly set and preserved
     * This prevents the render loop from overriding it with a placeholder camera
     */
    ensureWorldLoaderCamera() {
        // Only run if render scene swapper is available (prevents issues during initialization)
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        if (!renderSceneSwapper) return;

        // If we don't have our custom camera set, restore it
        if (!this.activeCamera || this.activeCamera.name !== "worldLoaderCamera") {
            const storedCamera = renderSceneSwapper.allStoredCameras[this];

            if (storedCamera && storedCamera.name === "worldLoaderCamera") {
                // Restore our stored camera
                this.activeCamera = storedCamera;
                // this.worldLoaderDebugLog(" Restored world loader camera from storage");
            } else if (!this.activeCamera || this.activeCamera.name !== "worldLoaderCamera") {
                // Only recreate if we still don't have the right camera
                // this.worldLoaderDebugLog(" World loader camera was missing, recreating...");
                this.setupCamera();
            }
        }
    }

    /**
     * Sets up a follow camera to view the sphere grid
     * Camera follows the center sphere at (0, 0, 0) and is positioned to see all 9 spheres
     */
    setupCamera() {
        // Center of the grid is at (0, 0, 0) - this is where the center sphere is
        const centerX = 0;
        const centerZ = 0;

        // Camera position - directly above the center, looking straight down
        // Using same height as game board camera (35 units) to match the view
        const cameraX = centerX;
        const cameraY = 35; // Height above the board (same as game board camera)
        const cameraZ = centerZ;

        // Create a FreeCamera positioned directly above the board center (matching game board camera)
        const camera = new BABYLON.FreeCamera(
            "worldLoaderCamera",
            new BABYLON.Vector3(cameraX, cameraY, cameraZ),
            this
        );

        // Set the camera to look straight down at the center of the grid
        // This ensures the camera is perfectly orthogonal (perpendicular) to the board
        camera.setTarget(new BABYLON.Vector3(centerX, 0, centerZ));

        // Rotate camera to look straight down (rotation around X axis) - same as game board
        camera.rotation.x = Math.PI / 2; // 90 degrees to look straight down

        // Rotate camera 180 degrees around Z-axis (horizontal/roll) - same as game board
        camera.rotation.z = 0; // No roll; data flip handles orientation

        // Attach camera to canvas for pointer events to work properly
        // Use false to attach for picking but not enable camera controls
        camera.attachControl(this.getEngine().getRenderingCanvas(), false);

        this.activeCamera = camera;

        // Register camera with render scene swapper
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        if (renderSceneSwapper) {
            renderSceneSwapper.allStoredCameras[this] = camera;
        }

        // Ensure camera stays set during render loop (prevents placeholder camera override)
        this.worldLoaderCameraObserver = this.onBeforeRenderObservable.add(() => {
            this.ensureWorldLoaderCamera();
        });

        // this.worldLoaderDebugLog(" Game board style camera set up - positioned at (0, 35, 0) looking straight down at (0, 0, 0)");
    }

    /**
     * Sets up basic lighting for the scene
     */
    setupLighting() {
        // Create ambient light
        const ambientLight = new BABYLON.HemisphericLight(
            "worldLoaderAmbientLight",
            new BABYLON.Vector3(0, 1, 0),
            this
        );
        ambientLight.intensity = 0.7;

        // Create a point light at the center for better illumination
        const pointLight = new BABYLON.PointLight(
            "worldLoaderPointLight",
            new BABYLON.Vector3(0, 5, 0),
            this
        );
        pointLight.intensity = 1.5;
        pointLight.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);

        // this.worldLoaderDebugLog(" Lighting set up");
    }

    /**
     * Cleanup method to dispose of resources
     */
    dispose() {
        // Remove animation observers
        if (this.glowAnimationObserver) {
            this.onBeforeRenderObservable.remove(this.glowAnimationObserver);
            this.glowAnimationObserver = null;
        }
        if (this.cameraRotationObserver) {
            this.onBeforeRenderObservable.remove(this.cameraRotationObserver);
            this.cameraRotationObserver = null;
        }
        if (this.worldLoaderCameraObserver) {
            this.onBeforeRenderObservable.remove(this.worldLoaderCameraObserver);
            this.worldLoaderCameraObserver = null;
        }


        // Dispose all world spheres
        if (this.worldSpheres) {
            this.worldSpheres.forEach(sphere => {
                if (sphere.actionManager) {
                    sphere.actionManager.dispose();
                }
                sphere.dispose();
            });
            this.worldSpheres = [];
        }

        // Dispose camera control UI
        if (this.cameraControlUI) {
            this.cameraControlUI.dispose();
            this.cameraControlUI = null;
        }

        super.dispose();
    }

    /**
     * Sets up callback to handle level completion events
     */
    setupLevelCompletionCallback() {
        const levelsSolvedStatusTracker = FundamentalSystemBridge["levelsSolvedStatusTracker"];
        if (levelsSolvedStatusTracker) {
            this.worldLoaderDebugLog(" Registering level completion callback with levelsSolvedStatusTracker");
            levelsSolvedStatusTracker.registerCompletionCallback((sphereIndex, levelData) => {
                this.updateSphereColor(sphereIndex);
            });
        } else {
            console.warn("[WorldLoaderScene] levelsSolvedStatusTracker not found in FundamentalSystemBridge during callback setup");
        }
    }
}
