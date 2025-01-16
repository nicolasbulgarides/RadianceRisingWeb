class SceneBuilder {
  /**
   * Constructor for SceneBuilder.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   * @param {ModelLoader} modelLoader - The globally loaded ModelLoader instance.
   */
  constructor(scene, modelLoader, animatedModelLoader) {
    this.scene = scene;
    this.modelLoader = modelLoader;
    this.animatedModelLoader = animatedModelLoader;
    this.loadedModels = []; // Array to store references to all loaded models
    this.loadedAnimatedModel = null;
    this.loadingAnimatedModel = null;
  }
  setBackgroundColor(color) {
    this.scene.clearColor = color;
    window.Logger.log("SceneBuilder: Background color set.");
  }
  // Loads the animated model only if it's not already loading
  async loadAnimatedModel() {
    if (this.loadingAnimatedModel) {
      // If already loading, return the in-progress Promise
      return this.loadingAnimatedModel;
    }

    // Otherwise, start the loading process
    this.loadingAnimatedModel = this.animatedModelLoader.loadModel("running", {
      x: 0,
      y: 0,
      z: 0,
    });

    try {
      this.loadedAnimatedModel = await this.loadingAnimatedModel;
      return this.loadedAnimatedModel;
    } catch (error) {
      console.error("Error loading animated model:", error);
      this.loadedAnimatedModel = null; // Reset on failure
      throw error;
    } finally {
      // Reset loading flag to prevent queueing
      this.loadingAnimatedModel = null;
    }
  }

  // Ensures that the animated model is loaded and returns it
  async getAnimatedModel() {
    if (!this.loadedAnimatedModel) {
      // Call loadAnimatedModel if the model isn't already loaded
      await this.loadAnimatedModel();
    }
    return this.loadedAnimatedModel;
  }

  async loadAnimatedModel() {
    // Assuming loadModel is a function that returns a Promise
    this.loadedAnimatedModel = await this.animatedModelLoader.loadModel(
      "running",
      { x: 0, y: 0, z: 0 }
    );
    return this.loadedAnimatedModel;
  }

  /**
   * Loads a list of PositionedObject instances into the scene.
   * @param {Array<PositionedObject>} positionedObjects - Array of PositionedObject instances to load.
   * @returns {Promise<Array<BABYLON.Mesh|null>>} - A promise that resolves to an array of loaded models.
   */
  async loadSceneModels(positionedObjects) {
    const loadedModels = [];

    for (const positionedObject of positionedObjects) {
      if (!(positionedObject instanceof PositionedObject)) {
        throw new Error(
          "SceneBuilder: Only instances of PositionedObject are allowed."
        );
      }

      // Retrieve model URL from AssetManifest
      const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
      if (!modelUrl) {
        console.error(
          `SceneBuilder: Asset '${positionedObject.modelId}' not found in AssetManifest.`
        );
        loadedModels.push(null); // Keep index alignment
        continue;
      }

      // Load the model and apply transformations
      const loadedModel = await this.loadSceneModel(positionedObject, modelUrl);

      if (loadedModel) {
        this.loadedModels.push(loadedModel); // Store reference
        positionedObject.setModel(loadedModel); // Link the model
      }

      loadedModels.push(loadedModel);
    }

    return loadedModels;
  }

  /**
   * Loads an individual PositionedObject model into the scene, applies position and rotation.
   * @param {PositionedObject} positionedObject - The PositionedObject instance to load.
   * @returns {Promise<BABYLON.Mesh|null>} - A promise that resolves to the root mesh of the loaded model, or null if loading fails.
   */
  async loadSceneModel(positionedObject) {
    if (!(positionedObject instanceof PositionedObject)) {
      throw new Error(
        "SceneBuilder: Only instances of PositionedObject are allowed."
      );
    }

    try {
      const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
      const loadedModel = await this.modelLoader.loadModelFromUrl(
        this.scene,
        modelUrl
      );
      if (loadedModel) {
        if (positionedObject.cloneBase) {
          const loadedModelBase = loadedModel.meshes[0];
          loadedModelBase.isVisible = false;
          loadedModelBase.setParent(null);

          // loadedModelBase.isVisible = false;
          //  loadedModelBase.setParent(null);

          window.Logger.log("Invisible clone");
        }
        window.Logger.log(
          `SceneBuilder: Model '${positionedObject.modelId}' loaded into the scene.`
        );

        // Apply position and rotation
        loadedModel.meshes[0].position = new BABYLON.Vector3(
          positionedObject.position.x,
          positionedObject.position.y,
          positionedObject.position.z
        );

        if (positionedObject.freeze) {
          loadedModel.meshes[0].freezeWorldMatrix();
          loadedModel.meshes[0].convertToUnIndexedMesh();
        }

        if (positionedObject.interactive == false) {
          loadedModel.meshes[0].isPickable = false;
          loadedModel.meshes[0].doNotSyncBoundingInfo = true;
        }

        // Apply scaling
        loadedModel.meshes[0].scaling.x = positionedObject.scaling;
        loadedModel.meshes[0].scaling.y = positionedObject.scaling;
        loadedModel.meshes[0].scaling.z = positionedObject.scaling;

        // Debugging log for scaling
        window.Logger.log(
          `SceneBuilder: Applied scaling to model '${positionedObject.modelId}' - x: ${loadedModel.meshes[0].scaling.x}, y: ${loadedModel.meshes[0].scaling.y}, z: ${loadedModel.meshes[0].scaling.z}`
        );

        // Apply rotation in radians for Babylon.js compatibility
        loadedModel.meshes[0].rotation = new BABYLON.Vector3(
          BABYLON.Tools.ToRadians(positionedObject.rotation.pitch),
          BABYLON.Tools.ToRadians(positionedObject.rotation.yaw),
          BABYLON.Tools.ToRadians(positionedObject.rotation.roll)
        );

        return loadedModel;
      } else {
        console.error(
          `SceneBuilder: Failed to load model '${positionedObject.modelId}'.`
        );
        return null;
      }
    } catch (error) {
      console.error(
        `SceneBuilder: Error loading model '${positionedObject.modelId}':`,
        error
      );
      return null;
    }
  }

  /**
   * Moves a specific PositionedObject to a specific position in the scene.
   * @param {PositionedObject} positionedObject - The PositionedObject to move.
   * @param {BABYLON.Vector3} position - The new position for the model.
   */
  moveModelTo(positionedObject, position) {
    if (
      !(positionedObject instanceof PositionedObject) ||
      !positionedObject.model
    ) {
      console.error(
        "SceneBuilder: Invalid PositionedObject or model reference."
      );
      return;
    }
    positionedObject.model.position = position;
    window.Logger.log(`SceneBuilder: Model moved to new position: ${position}`);
  }

  /**
   * Moves a specific PositionedObject by a specified delta amount in the scene.
   * @param {PositionedObject} positionedObject - The PositionedObject to move.
   * @param {BABYLON.Vector3} delta - The amount to move the model by.
   */
  moveModelBy(positionedObject, delta) {
    if (
      !(positionedObject instanceof PositionedObject) ||
      !positionedObject.model
    ) {
      console.error(
        "SceneBuilder: Invalid PositionedObject or model reference."
      );
      return;
    }
    positionedObject.model.position.addInPlace(delta);
    window.Logger.log(`SceneBuilder: Model moved by delta: ${delta}`);
  }
}
