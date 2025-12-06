/**
 * WorldLoaderScene
 * 
 * A world selection scene with 9 clickable spheres arranged in a 3x3 grid.
 * Each sphere represents a level/world that can be selected.
 */
class WorldLoaderScene extends GameWorldSceneGeneralized {
    constructor() {
        super();
        this.worldSpheres = []; // Array to store all world spheres
        this.centerSphere = null; // Reference to the center sphere (at 0, 0, 0)
        this.selectedWorldIndex = null;
        this.isLoadingWorld = false;
        this.setupBackgroundImage();
        this.createWorldSpheres();
        this.setupCamera();
        this.setupLighting();
        this.setupClickHandlers();
        this.createCameraControlUI();
    }

    setupBackgroundImage() {
        const backgroundImageUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/spaceBackground.jpg";

        // Create a background texture
        const backgroundTexture = new BABYLON.Texture(backgroundImageUrl, this);

        // Create a layer to display the texture
        const backgroundLayer = new BABYLON.Layer("backgroundLayer", backgroundImageUrl, this, true);

        // Optional: Keep the scene clear color opaque if using a background layer
        this.clearColor = new BABYLON.Color4(0, 0, 0, 1);

        console.log("[WorldLoaderScene] Background Layer created.");
    }

    /**
     * Creates 9 spheres arranged in a 3x3 grid, centered on screen
     */
    createWorldSpheres() {
        const sphereDiameter = 2;
        const spacing = 4; // Space between sphere centers
        const gridSize = 3; // 3x3 grid

        // Define level data for each sphere (can be expanded later)
        const levelData = [
            { levelId: "level0", levelUrl: "level0Test.txt", name: "Level 1" },
            { levelId: "level1", levelUrl: "level1Test.txt", name: "Level 2" },
            { levelId: "level2", levelUrl: "level2Test.txt", name: "Level 3" },
            { levelId: "level3", levelUrl: "level3Test.txt", name: "Level 4" },
            { levelId: "level4", levelUrl: "level4Test.txt", name: "Level 5" },
            { levelId: "level5", levelUrl: "level5Test.txt", name: "Level 6" },
            { levelId: "level6", levelUrl: "level6Test.txt", name: "Level 7" },
            { levelId: "level7", levelUrl: "level7Test.txt", name: "Level 8" },
            { levelId: "level8", levelUrl: "level8Test.txt", name: "Level 9" }
        ];

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

                // Create material with consistent blue tint to indicate "not finished"
                const material = new BABYLON.StandardMaterial(`worldSphereMaterial_${row}_${col}`, this);
                const baseBlue = new BABYLON.Color3(0.2, 0.6, 1.0);
                material.emissiveColor = baseBlue;
                material.diffuseColor = baseBlue.scale(0.6);
                material.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                material.emissiveIntensity = 1.4;
                material.roughness = 0.2;
                sphere.material = material;

                // Make sphere pickable for clicking
                sphere.isPickable = true;

                // Store level data with the sphere
                sphere.worldData = levelData[sphereIndex] || {
                    levelId: `level${sphereIndex}`,
                    levelUrl: `level${sphereIndex}Test.txt`,
                    name: `Level ${sphereIndex + 1}`
                };
                sphere.sphereIndex = sphereIndex;

                // Add hover effect (slight scale up on hover)
                this.addHoverEffect(sphere);

                this.worldSpheres.push(sphere);
                sphereIndex++;
            }
        }

        console.log(`[WorldLoaderScene] Created ${this.worldSpheres.length} world spheres in 3x3 grid`);
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
     * Adds hover effect to a sphere (scale up slightly when mouse is over it)
     */
    addHoverEffect(sphere) {
        const originalScale = 1.0;
        const hoverScale = 1.2;

        // Store original scaling
        sphere.originalScaling = sphere.scaling.clone();

        // Use action manager for pointer enter/exit
        const actionManager = new BABYLON.ActionManager(this);
        sphere.actionManager = actionManager;

        // On pointer over, scale up
        actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    sphere.scaling = new BABYLON.Vector3(hoverScale, hoverScale, hoverScale);
                }
            )
        );

        // On pointer out, scale back
        actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    sphere.scaling = sphere.originalScaling.clone();
                }
            )
        );
    }

    /**
     * Sets up click handlers for all spheres
     */
    setupClickHandlers() {
        // Enable pointer events on the scene
        this.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                const pickResult = pointerInfo.pickInfo || this.pick(pointerInfo.event.pointerX, pointerInfo.event.pointerY);

                if (pickResult.hit && pickResult.pickedMesh) {
                    const clickedSphere = this.worldSpheres.find(sphere =>
                        sphere === pickResult.pickedMesh ||
                        pickResult.pickedMesh.parent === sphere ||
                        (typeof pickResult.pickedMesh.getParent === "function" && pickResult.pickedMesh.getParent() === sphere)
                    );

                    if (clickedSphere && clickedSphere.worldData) {
                        this.onWorldSelected(clickedSphere);
                    }
                }
            }
        });

        console.log("[WorldLoaderScene] Click handlers set up");
    }

    /**
     * Handles when a world sphere is clicked
     * @param {BABYLON.Mesh} sphere - The clicked sphere
     */
    async onWorldSelected(sphere) {
        if (this.isLoadingWorld) {
            console.log("[WorldLoaderScene] Level load already in progress, ignoring click");
            return;
        }
        this.isLoadingWorld = true;
        const worldData = sphere.worldData;
        console.log(`[WorldLoaderScene] World selected: ${worldData.name} (${worldData.levelId})`);

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
        console.log(`[WorldLoaderScene] Loading level from world selection: ${worldData.levelId}`);

        // Get the level loader manager
        const levelLoaderManager = FundamentalSystemBridge["levelLoaderManager"];
        const gameplayManager = FundamentalSystemBridge["gameplayManagerComposite"];

        if (!levelLoaderManager || !gameplayManager) {
            console.error("[WorldLoaderScene] Level loader or gameplay manager not found");
            return;
        }

        // Reset pickup streak/experience so new worlds start fresh
        const specialOccurrenceManager = FundamentalSystemBridge["specialOccurrenceManager"];
        specialOccurrenceManager?.pickupOccurrenceSubManager?.resetPickupProgress?.();

        // Construct the full URL for the level (hard-coded to level2Test.txt per request)
        const levelUrl = "https://raw.githubusercontent.com/nicolasbulgarides/testmodels/main/assets/level2Test.txt";

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
            await levelLoaderManager.loadLevelFromUrl(gameplayManager, levelUrl);

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

            console.log(`[WorldLoaderScene] Loaded ${worldData.name} from ${levelUrl} and activated BaseGameScene`);
        } catch (error) {
            console.error(`[WorldLoaderScene] Error loading level ${worldData.levelUrl}:`, error);
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

        // Disable camera controls to keep it fixed (matching game board behavior)
        // camera.attachControl(this.getEngine().getRenderingCanvas(), true);

        this.activeCamera = camera;

        // Register camera with render scene swapper
        const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
        if (renderSceneSwapper) {
            renderSceneSwapper.allStoredCameras[this] = camera;
        }

        console.log("[WorldLoaderScene] Game board style camera set up - positioned at (0, 35, 0) looking straight down at (0, 0, 0)");
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

        console.log("[WorldLoaderScene] Lighting set up");
    }

    /**
     * Creates a UI panel with sliders to adjust camera parameters
     */
    createCameraControlUI() {
        // Intentionally disabled; fixed camera does not need on-screen controls.
        console.log("[WorldLoaderScene] Camera controls UI disabled");
        return;

        // Helper function to create a slider with label
        // Step is calculated as 5% of the range
        const createSliderControl = (label, property, min, max, topOffset = 0) => {
            const range = max - min;
            const step = range * 0.05; // 5% of the range
            // Container for this slider row
            const rowContainer = new BABYLON.GUI.StackPanel(`${property}Row`);
            rowContainer.width = "100%";
            rowContainer.height = "60px";
            rowContainer.top = `${topOffset}px`;
            rowContainer.isVertical = true;
            panel.addControl(rowContainer);

            // Label and value row
            const labelRow = new BABYLON.GUI.StackPanel(`${property}LabelRow`);
            labelRow.width = "100%";
            labelRow.height = "25px";
            labelRow.isVertical = false;
            rowContainer.addControl(labelRow);

            // Label
            const labelText = new BABYLON.GUI.TextBlock(`${property}Label`, label);
            labelText.width = "60%";
            labelText.height = "25px";
            labelText.color = "white";
            labelText.fontSize = 14;
            labelText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelText.paddingLeft = "10px";
            labelRow.addControl(labelText);

            // Value display
            const valueText = new BABYLON.GUI.TextBlock(`${property}Value`, `${followCamera[property].toFixed(2)}`);
            valueText.width = "40%";
            valueText.height = "25px";
            valueText.color = "yellow";
            valueText.fontSize = 12;
            valueText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            valueText.paddingRight = "10px";
            labelRow.addControl(valueText);

            // Slider
            const slider = new BABYLON.GUI.Slider(`${property}Slider`);
            slider.minimum = min;
            slider.maximum = max;
            slider.value = followCamera[property];
            slider.step = step; // Set step to 5% of range
            slider.height = "20px";
            slider.width = "90%";
            slider.color = "white";
            slider.background = "gray";
            slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            slider.top = "5px";
            slider.onValueChangedObservable.add((value) => {
                // Update the camera property
                followCamera[property] = value;
                valueText.text = value.toFixed(2);

                // Debug: Verify the property was set
                console.log(`[Camera Controls] Updated ${property} to ${value}, actual value: ${followCamera[property]}`);

                // Ensure scene's active camera is set to the follow camera
                if (this.activeCamera !== followCamera) {
                    this.activeCamera = followCamera;
                    console.log("[Camera Controls] Active camera updated");
                }

                // Output all camera variables to console for hard coding
                console.log("[Camera Controls] Current camera settings:");
                console.log(`  radius: ${followCamera.radius.toFixed(2)}`);
                console.log(`  heightOffset: ${followCamera.heightOffset.toFixed(2)}`);
                console.log(`  rotationOffset: ${followCamera.rotationOffset.toFixed(2)}`);
                console.log(`  cameraAcceleration: ${followCamera.cameraAcceleration.toFixed(4)}`);
                console.log(`  maxCameraSpeed: ${followCamera.maxCameraSpeed.toFixed(2)}`);
                console.log("---");
            });
            rowContainer.addControl(slider);

            return { slider, valueText };
        };


        // Create sliders for each camera parameter with proper spacing
        let currentTop = 40; // Start below title (reduced from 50)
        const rowHeight = 70; // Height of each row including spacing

        this.cameraControls = {
            radius: createSliderControl("Radius", "radius", 5, 50, currentTop),
            heightOffset: createSliderControl("Height Offset", "heightOffset", 0, 40, currentTop += rowHeight),
            rotationOffset: createSliderControl("Rotation Offset", "rotationOffset", -180, 180, currentTop += rowHeight),
            cameraAcceleration: createSliderControl("Acceleration", "cameraAcceleration", 0, 1, currentTop += rowHeight),
            maxCameraSpeed: createSliderControl("Max Speed", "maxCameraSpeed", 0, 10, currentTop += rowHeight)
        };

        // Create reset button
        const resetButton = new BABYLON.GUI.Button("resetCameraButton");
        resetButton.width = "200px";
        resetButton.height = "40px";
        resetButton.color = "white";
        resetButton.background = "rgba(200, 50, 50, 0.8)";
        resetButton.cornerRadius = 5;
        resetButton.thickness = 2;
        resetButton.top = `${currentTop + rowHeight + 10}px`; // Add 10px spacing after last slider
        resetButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        resetButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        const resetButtonText = new BABYLON.GUI.TextBlock("resetButtonText", "Reset to Defaults");
        resetButtonText.color = "white";
        resetButtonText.fontSize = 16;
        resetButtonText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        resetButton.addControl(resetButtonText);

        resetButton.onPointerClickObservable.add(() => {
            console.log("[Camera Controls] Resetting camera to default values");

            // Get fresh reference to camera in case it changed
            const currentCamera = this.followCamera || this.activeCamera;
            if (!currentCamera || !(currentCamera instanceof BABYLON.FollowCamera)) {
                console.error("[Camera Controls] Cannot reset: FollowCamera not found");
                return;
            }

            // Temporarily increase camera speed for instant reset
            const originalAcceleration = currentCamera.cameraAcceleration;
            const originalMaxSpeed = currentCamera.maxCameraSpeed;
            currentCamera.cameraAcceleration = 1.0; // Maximum acceleration
            currentCamera.maxCameraSpeed = 100; // Very high speed for instant movement

            // Reset each camera property to default
            for (const [property, defaultValue] of Object.entries(this.defaultCameraValues)) {
                currentCamera[property] = defaultValue;

                // Update the slider and value text
                if (this.cameraControls[property]) {
                    this.cameraControls[property].slider.value = defaultValue;
                    this.cameraControls[property].valueText.text = defaultValue.toFixed(2);
                }
            }

            // Restore original acceleration and speed after a brief moment
            // This allows the camera to snap to position quickly, then return to smooth movement
            setTimeout(() => {
                currentCamera.cameraAcceleration = originalAcceleration;
                currentCamera.maxCameraSpeed = originalMaxSpeed;
            }, 100);

            // Ensure scene's active camera is set to the follow camera
            this.activeCamera = currentCamera;

            // Output reset values to console
            console.log("[Camera Controls] Camera reset to defaults:");
            console.log(`  radius: ${currentCamera.radius.toFixed(2)}`);
            console.log(`  heightOffset: ${currentCamera.heightOffset.toFixed(2)}`);
            console.log(`  rotationOffset: ${currentCamera.rotationOffset.toFixed(2)}`);
            console.log(`  cameraAcceleration: ${currentCamera.cameraAcceleration.toFixed(4)}`);
            console.log(`  maxCameraSpeed: ${currentCamera.maxCameraSpeed.toFixed(2)}`);
            console.log(`  lockedTarget: ${currentCamera.lockedTarget ? currentCamera.lockedTarget.name : 'null'}`);
            console.log("[Camera Controls] Camera will update position in next frame(s)");
        });

        panel.addControl(resetButton);

        console.log("[WorldLoaderScene] Camera control UI created");
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
}
