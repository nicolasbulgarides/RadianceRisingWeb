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
        this.constellationLineMesh = null; // Line system connecting the constellation stars
        this.shimmerParticleSystems = []; // One particle system per star sphere
        this._sparkleTexture = null;      // Shared texture for all shimmer particles
        this._activeConstellationId = "ursa_major"; // Currently displayed constellation
        this._constellationQueue = [];          // Non-repeating shuffle queue
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
        this._initCheckInterval = setInterval(() => {
            if (FundamentalSystemBridge["sequentialLevelLoader"]) {
                clearInterval(this._initCheckInterval);
                this._initCheckInterval = null;
                this.createWorldSpheres();
                this.setupClickHandlers();
                // Ensure camera is set after initialization
                this.ensureWorldLoaderCamera();
            }
        }, 100); // Check every 100ms

        // Safety timeout after 10 seconds
        this._initSafetyTimeout = setTimeout(() => {
            this._initSafetyTimeout = null;
            if (!this.worldSpheresInitialized) {
                clearInterval(this._initCheckInterval);
                this._initCheckInterval = null;
                console.error("[WorldLoaderScene] Sequential level loader still not available after 10 seconds - creating spheres with fallback");
                this.createWorldSpheresWithFallback();
                this.setupClickHandlers();
                // Ensure camera is set even in fallback case
                this.ensureWorldLoaderCamera();
            }
        }, 10000);
    }

    /**
     * Creates 9 spheres positioned at the Orion constellation star coordinates,
     * scaled and centered to fill the camera view.
     */
    createWorldSpheres() {
        const sequentialLoader = FundamentalSystemBridge["sequentialLevelLoader"];
        if (!sequentialLoader) {
            console.error("[WorldLoaderScene] Sequential level loader not found");
            return;
        }

        const constellation = ConstellationManifest.get(this._activeConstellationId);
        if (!constellation) {
            console.error("[WorldLoaderScene] Orion constellation not found in ConstellationManifest");
            return;
        }

        const starPositions = this._buildStarWorldPositions(constellation.stars);
        const posById = new Map(starPositions.map(s => [s.id, s]));

        for (const starData of starPositions) {
            const sphereIndex = starData.id;

            const sphere = BABYLON.MeshBuilder.CreateSphere(
                starData.name,
                { diameter: 1.5, segments: 24 },
                this
            );

            sphere.position = new BABYLON.Vector3(starData.worldX, 0, starData.worldZ);

            const levelData = sequentialLoader.getWorldLevelDataForConstellation(this._activeConstellationId, sphereIndex);
            const isCompleted = FundamentalSystemBridge["levelsSolvedStatusTracker"]?.isLevelCompleted(sphereIndex) || false;

            sphere.material        = this.createSphereMaterial(sphereIndex, levelData, isCompleted);
            sphere.isPickable      = levelData?.isAvailable || false;
            sphere.worldData       = levelData;
            sphere.sphereIndex     = sphereIndex;
            sphere.constellationId = this._activeConstellationId;
            sphere.isCompleted     = isCompleted;

            this.addHoverEffect(sphere);
            this._addStarShimmer(sphere);
            this.worldSpheres.push(sphere);
        }

        this._drawConstellationLines(posById, constellation.lines);
        this.worldSpheresInitialized = true;
    }

    /**
     * Creates world spheres with fallback data when sequential level loader is not available.
     * Uses the same constellation layout as createWorldSpheres().
     */
    createWorldSpheresWithFallback() {
        const constellation = ConstellationManifest.get(this._activeConstellationId);
        if (!constellation) {
            console.error("[WorldLoaderScene] Orion constellation not found — cannot create fallback spheres");
            return;
        }

        const starPositions = this._buildStarWorldPositions(constellation.stars);
        const posById = new Map(starPositions.map(s => [s.id, s]));

        for (const starData of starPositions) {
            const sphereIndex = starData.id;

            const sphere = BABYLON.MeshBuilder.CreateSphere(
                starData.name,
                { diameter: 1.5, segments: 24 },
                this
            );

            sphere.position = new BABYLON.Vector3(starData.worldX, 0, starData.worldZ);

            const fallbackLevelData = {
                levelId: `level${sphereIndex}`,
                name: `Level ${sphereIndex}`,
                isAvailable: sphereIndex < 6,
                levelUrl: null,
            };

            const material = new BABYLON.StandardMaterial(`worldSphereMaterial_${sphereIndex}`, this);
            const gray = new BABYLON.Color3(0.4, 0.4, 0.4);
            material.emissiveColor = gray;
            material.diffuseColor = gray.scale(0.5);
            material.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            material.emissiveIntensity = 0.8;
            material.roughness = 0.2;

            sphere.material = material;
            sphere.isPickable = fallbackLevelData.isAvailable;
            sphere.worldData = fallbackLevelData;
            sphere.sphereIndex = sphereIndex;
            sphere.isCompleted = false;

            this._addStarShimmer(sphere);
            this.worldSpheres.push(sphere);
        }

        this._drawConstellationLines(posById, constellation.lines);
        this.worldLoaderDebugLog(`Created ${this.worldSpheres.length} constellation spheres in fallback mode`);
        this.worldSpheresInitialized = true;
    }

    /**
     * Maps normalized star coordinates ([0,1] screen-space) to 3D world positions,
     * scaling uniformly so the longest constellation axis spans worldHalfSpan*2 units
     * and centering the result at the origin.
     *
     * @param {Array<{id, name, x, y}>} stars
     * @param {number} worldHalfSpan  Half-size in world units (default 9)
     * @returns {Array<{id, name, x, y, worldX, worldZ}>}
     */
    _buildStarWorldPositions(stars, worldHalfSpan = 9) {
        const xs = stars.map(s => s.x);
        const ys = stars.map(s => s.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        // Uniform scale preserves the constellation's aspect ratio
        const scale = (worldHalfSpan * 2) / Math.max(maxX - minX, maxY - minY);
        return stars.map(s => ({
            ...s,
            worldX: (s.x - cx) * scale,
            worldZ: (s.y - cy) * scale, // screen Y (down) → world +Z
        }));
    }

    /**
     * Creates a single Babylon.js line system that draws all constellation
     * connector lines between mapped star positions.
     *
     * @param {Map<number, {worldX, worldZ}>} posById  Star world positions keyed by star id
     * @param {Array<[number, number]>}       lines     Pairs of star ids to connect
     */
    _drawConstellationLines(posById, lines) {
        const lineArrays = lines.map(([a, b]) => {
            const pa = posById.get(a);
            const pb = posById.get(b);
            return [
                new BABYLON.Vector3(pa.worldX, 0.05, pa.worldZ),
                new BABYLON.Vector3(pb.worldX, 0.05, pb.worldZ),
            ];
        });

        this.constellationLineMesh = BABYLON.MeshBuilder.CreateLineSystem(
            "constellationLines",
            { lines: lineArrays },
            this
        );
        this.constellationLineMesh.color = new BABYLON.Color3(0.45, 0.65, 1.0); // faint blue-white
        this.constellationLineMesh.isPickable = false;
    }

    /**
     * Builds a shared radial-gradient DynamicTexture used for all sparkle particles.
     * Created once and reused across all star particle systems.
     */
    _createSparkleTexture() {
        const size = 64;
        const tex = new BABYLON.DynamicTexture("sparkleTexture", { width: size, height: size }, this, false);
        const ctx = tex.getContext();
        const c = size / 2;

        // Soft radial glow
        const radial = ctx.createRadialGradient(c, c, 0, c, c, c);
        radial.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
        radial.addColorStop(0.25, "rgba(200, 220, 255, 0.85)");
        radial.addColorStop(0.6, "rgba(120, 160, 255, 0.3)");
        radial.addColorStop(1.0, "rgba(80,  120, 255, 0.0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, size, size);

        // Cross-hair spike lines for the classic "star twinkle" look
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(c, 0); ctx.lineTo(c, size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, c); ctx.lineTo(size, c); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(size - 4, size - 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(size - 4, 4); ctx.lineTo(4, size - 4); ctx.stroke();

        tex.update();
        return tex;
    }

    /**
     * Attaches a small particle system to a star sphere that continuously emits
     * soft sparkle flares, giving the sphere a twinkling star appearance.
     * @param {BABYLON.Mesh} sphere
     */
    _addStarShimmer(sphere) {
        if (!this._sparkleTexture) {
            this._sparkleTexture = this._createSparkleTexture();
        }

        const ps = new BABYLON.ParticleSystem(`shimmer_${sphere.name}`, 18, this);
        ps.particleTexture = this._sparkleTexture;

        // Emit from a sphere shell just outside the star sphere's surface
        ps.emitter = sphere;
        ps.createSphereEmitter(1.0, 0); // radius 1.0, direction outward

        // Particle colours — white core fading to blue-white then transparent
        ps.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
        ps.color2 = new BABYLON.Color4(0.75, 0.88, 1.0, 0.85);
        ps.colorDead = new BABYLON.Color4(0.4, 0.6, 1.0, 0.0);

        // Varied sizes so sparks feel organic
        ps.minSize = 0.08;
        ps.maxSize = 0.28;

        // Short, varied lifetimes for a flickering rhythm
        ps.minLifeTime = 0.4;
        ps.maxLifeTime = 1.3;

        // Steady trickle of sparks
        ps.emitRate = 10;

        // Slow drift outward so particles gently float away
        ps.minEmitPower = 0.15;
        ps.maxEmitPower = 0.45;
        ps.updateSpeed = 0.012;

        // No gravity — sparks drift freely in space
        ps.gravity = BABYLON.Vector3.Zero();

        // Blend additively so overlapping sparks brighten rather than occlude
        ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

        ps.start();
        this.shimmerParticleSystems.push(ps);
    }

    /**
     * Returns a Fisher-Yates-shuffled array of all constellation IDs, excluding the
     * currently active one so the display never repeats back-to-back (unless only one
     * constellation is registered, in which case it is allowed to cycle to itself).
     */
    _buildShuffleQueue() {
        const allIds = [...ConstellationManifest._registry.keys()];
        for (let i = allIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
        }
        const withoutCurrent = allIds.filter(id => id !== this._activeConstellationId);
        return withoutCurrent.length > 0 ? withoutCurrent : allIds;
    }

    /** Pops the next constellation ID, rebuilding the shuffle queue when exhausted. */
    _nextConstellationId() {
        if (this._constellationQueue.length === 0) {
            this._constellationQueue = this._buildShuffleQueue();
        }
        return this._constellationQueue.shift() ?? this._activeConstellationId;
    }

    /**
     * Disposes all current star spheres, shimmer particle systems, and the constellation
     * line mesh so the scene can be populated with a fresh constellation.
     * The shared sparkle texture and glow layer are intentionally kept alive.
     */
    _clearConstellationDisplay() {
        this.shimmerParticleSystems.forEach(ps => { ps.stop(); ps.dispose(); });
        this.shimmerParticleSystems = [];

        if (this.constellationLineMesh) {
            this.constellationLineMesh.dispose();
            this.constellationLineMesh = null;
        }

        this.worldSpheres.forEach(sphere => {
            if (sphere.actionManager) sphere.actionManager.dispose();
            if (sphere.hoverMaterial) sphere.hoverMaterial.dispose();
            if (sphere.originalMaterial) sphere.originalMaterial.dispose();
            if (sphere.material) sphere.material.dispose();
            sphere.dispose();
        });
        this.worldSpheres = [];
    }

    /**
     * Called when the magic button is pressed while the world loader is active.
     * Picks the next constellation from the non-repeating shuffle queue,
     * clears the current display, and rebuilds the scene for the new constellation.
     */
    onMagicButtonPressed() {
        const nextId = this._nextConstellationId();
        const constellation = ConstellationManifest.get(nextId);
        if (!constellation) return;

        this._activeConstellationId = nextId;
        this._clearConstellationDisplay();

        const starPositions = this._buildStarWorldPositions(constellation.stars);
        const posById = new Map(starPositions.map(s => [s.id, s]));
        const sequentialLoader = FundamentalSystemBridge["sequentialLevelLoader"];

        for (const starData of starPositions) {
            const sphereIndex = starData.id;
            const sphere = BABYLON.MeshBuilder.CreateSphere(
                starData.name,
                { diameter: 1.5, segments: 24 },
                this
            );
            sphere.position = new BABYLON.Vector3(starData.worldX, 0, starData.worldZ);
            sphere.sphereIndex = sphereIndex;

            if (sequentialLoader) {
                const levelData = sequentialLoader.getWorldLevelDataForConstellation(this._activeConstellationId, sphereIndex);
                const isCompleted = FundamentalSystemBridge["levelsSolvedStatusTracker"]
                    ?.isLevelCompleted(sphereIndex) || false;
                sphere.material        = this.createSphereMaterial(sphereIndex, levelData, isCompleted);
                sphere.isPickable      = levelData?.isAvailable || false;
                sphere.worldData       = levelData;
                sphere.constellationId = this._activeConstellationId;
                sphere.isCompleted     = isCompleted;
                this.addHoverEffect(sphere);
            } else {
                const mat = new BABYLON.StandardMaterial(`worldSphereMaterial_${sphereIndex}`, this);
                const gray = new BABYLON.Color3(0.4, 0.4, 0.4);
                mat.emissiveColor = gray;
                mat.diffuseColor = gray.scale(0.5);
                mat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
                mat.emissiveIntensity = 0.8;
                mat.roughness = 0.2;
                sphere.material = mat;
                sphere.isPickable = false;
                sphere.worldData = { levelId: `level${sphereIndex}`, isAvailable: false };
                sphere.isCompleted = false;
            }

            this._addStarShimmer(sphere);
            this.worldSpheres.push(sphere);
        }

        this._drawConstellationLines(posById, constellation.lines);
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
        const entry = (typeof ConstellationStarToLevelManifest !== "undefined")
            ? ConstellationStarToLevelManifest.get(this._activeConstellationId, sphere.sphereIndex)
            : null;
        const label = entry?.levelName || sphere.worldData?.name || sphere.name;
        console.log(`[WorldLoader] Clicked star ${sphere.sphereIndex} (${sphere.name}): ${label}`);

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
        const selectedSphere = this.worldSpheres.find(s => s.sphereIndex === this.selectedWorldIndex);
        const constellationId = selectedSphere?.constellationId || this._activeConstellationId;
        const worldLevelData = sequentialLoader?.getWorldLevelDataForConstellation(constellationId, this.selectedWorldIndex);
        const levelId = worldLevelData?.levelId;
        const levelUrl = worldLevelData?.levelUrl
            ? SequentialLevelLoader.buildFullLevelUrl(worldLevelData.levelUrl)
            : null;

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
        const cameraY = 46; // Height above the board (zoomed out 10% from 42)
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
        camera.attachControl(this.getEngine().getRenderingCanvas(), false);
        camera.inputs.clear(); // Disable all camera movement — camera should be fully locked

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

        // Glow layer — makes emissive star spheres bloom like real stars
        this.glowLayer = new BABYLON.GlowLayer("starGlow", this);
        this.glowLayer.intensity = 0.7;

        // this.worldLoaderDebugLog(" Lighting set up");
    }

    /**
     * Cleanup method to dispose of resources
     */
    dispose() {
        // Clear initialization timers if scene is disposed before they fire
        if (this._initCheckInterval) {
            clearInterval(this._initCheckInterval);
            this._initCheckInterval = null;
        }
        if (this._initSafetyTimeout) {
            clearTimeout(this._initSafetyTimeout);
            this._initSafetyTimeout = null;
        }

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


        // Stop and dispose shimmer particle systems
        if (this.shimmerParticleSystems) {
            this.shimmerParticleSystems.forEach(ps => { ps.stop(); ps.dispose(); });
            this.shimmerParticleSystems = [];
        }
        if (this._sparkleTexture) {
            this._sparkleTexture.dispose();
            this._sparkleTexture = null;
        }
        if (this.glowLayer) {
            this.glowLayer.dispose();
            this.glowLayer = null;
        }

        // Dispose constellation line system
        if (this.constellationLineMesh) {
            this.constellationLineMesh.dispose();
            this.constellationLineMesh = null;
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
