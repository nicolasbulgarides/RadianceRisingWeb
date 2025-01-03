class AnimatedModelLoader {
    /**
     * Constructor for AnimatedModelLoader.
     * Initializes basic parameters for animation control.
     */
    constructor(scene) {
        this.scene = scene;
        console.log("Modular AnimatedModelLoader initialized");
    }

    /**
     * Loads a GLB model with specified position, rotation, scale, and animation setup.
     * @param {string} assetName - Name of the asset in the AssetManifest.
     * @param {object} options - Options for model loading including position, rotation, and scale.
     * @param {number} options.x - X position in the scene.
     * @param {number} options.y - Y position in the scene.
     * @param {number} options.z - Z position in the scene.
     * @param {number} options.pitch - Pitch rotation angle (in degrees).
     * @param {number} options.yaw - Yaw rotation angle (in degrees).
     * @param {number} options.roll - Roll rotation angle (in degrees).
     * @param {number} options.scale - Scale factor for the model.
     * @returns {Promise<BABYLON.Mesh|null>} - A promise that resolves with the loaded model mesh or null if loading fails.
     */
    loadModel(assetName, options = {}) {
        const modelUrl = AssetManifest.getAssetUrl(assetName);
        if (!modelUrl) {
            console.error(`AnimatedModelLoader: Asset '${assetName}' not found in AssetManifest.`);
            return Promise.resolve(null);
        }

        const {
            x = 0, y = 0, z = 0,
            pitch = 0, yaw = 0, roll = 0,
            scale = 1
        } = options;

        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh(
                null,
                "",
                modelUrl,
                this.scene,
                (meshes, particleSystems, skeletons, animationGroups) => {
                    const model = meshes[0];

                    if (model instanceof BABYLON.AbstractMesh) {
                        // Apply transformations only if it’s a mesh
                        model.position = new BABYLON.Vector3(x, y, z);
                        model.rotation = new BABYLON.Vector3(
                            BABYLON.Tools.ToRadians(pitch),
                            BABYLON.Tools.ToRadians(yaw),
                            BABYLON.Tools.ToRadians(roll)
                        );
                        model.scaling = new BABYLON.Vector3(scale, scale, scale);
                        window.Logger.log(`Model loaded with position: x=${model.position.x}, y=${model.position.y}, z=${model.position.z}`);
                    } else {
                        console.warn("Loaded model is not an instance of BABYLON.AbstractMesh. Position property may be missing.");
                    }

                    // Apply position, rotation, and scale
                    model.position = new BABYLON.Vector3(x, y, z);
                    model.rotation = new BABYLON.Vector3(
                        BABYLON.Tools.ToRadians(pitch),
                        BABYLON.Tools.ToRadians(yaw),
                        BABYLON.Tools.ToRadians(roll)
                    );
                    model.scaling = new BABYLON.Vector3(scale, scale, scale);

                    // Start animations if available
                    if (animationGroups.length > 0) {
                        animationGroups.forEach(animationGroup => {
                            animationGroup.start(true); // Loop all animations
                        });
                    }

                    console.log(`AnimatedModelLoader: Model '${assetName}' loaded successfully.`);
                    resolve(model); // Return the model for external manipulation
                },
                null,
                (scene, message, exception) => {
                    console.error("Error loading model:", message, exception);
                    resolve(null); // Resolve with null if there's an error
                }
            );
        });
    }
}
