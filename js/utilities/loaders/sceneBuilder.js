/**
 * SceneBuilder orchestrates the loading and placement of models within a Babylon.js scene.
 * It supports both static and animated models, and provides utility methods for moving models.
 */
class SceneBuilder {
  /**
   * Constructs a SceneBuilder.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   */
  constructor(scene) {
    this.scene = scene;
    this.modelLoader = new ModelLoader();
    this.animatedModelLoader = new AnimatedModelLoader(this.scene);
    this.loadedModels = []; // Array to store references to loaded models
    // Set default background color for the scene
    this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1));
  }

  /**
   * Retrieves the Babylon.js scene managed by the SceneBuilder.
   * @returns {BABYLON.Scene} - The managed scene.
   */
  getGameWorldScene() {
    return this.scene;
  }

  /**
   * Sets the background color of the scene.
   * @param {BABYLON.Color4} color - The color to set as the background.
   */
  setBackgroundColor(color) {
    this.scene.clearColor = color;
  }

  /**
   * Retrieves an animated model, loading it if it hasn't been loaded already.
   * @returns {Promise<PositionedModel|null>} - The loaded animated model.
   */
  async getAnimatedModel() {
    if (!this.loadedAnimatedModel) {
      await this.loadAnimatedModel();
    }
    return this.loadedAnimatedModel;
  }

  /**
   * Loads an animated model using a PositionedObject.
   * @param {PositionedObject} positionedObject - The PositionedObject defining the model.
   * @returns {Promise<PositionedModel|null>} - The loaded animated model.
   */
  async loadAnimatedModel(positionedObject) {
    try {
      const positionedModel = await this.animatedModelLoader.loadModel(positionedObject);
      if (positionedModel) {
        this.loadedModels.push(positionedModel);
      }
      return positionedModel;
    } catch (error) {
      console.error("SceneBuilder: Error loading animated model:", error);
      return null;
    }
  }

  /**
   * Loads multiple models defined by an array of PositionedObject instances.
   * @param {Array<PositionedObject>} positionedObjects - Array of PositionedObject instances.
   * @returns {Promise<Array<BABYLON.Mesh|null>>} - An array of loaded models (null for failures).
   */
  async loadModels(positionedObjects) {
    const loadedModels = [];
    for (const positionedObject of positionedObjects) {
      if (!(positionedObject instanceof PositionedObject)) {
        throw new Error("SceneBuilder: Only instances of PositionedObject are allowed.");
      }
      // Retrieve model URL from AssetManifest
      const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
      if (!modelUrl) {
        console.error(
          `SceneBuilder: Asset '${positionedObject.modelId}' not found in AssetManifest.`
        );
        loadedModels.push(null);
        continue;
      }
      // Load the model and apply transformations
      const loadedModel = await this.loadSceneModel(positionedObject, modelUrl);
      if (loadedModel) {
        this.loadedModels.push(loadedModel);
        positionedObject.setModel(loadedModel);
      }
      loadedModels.push(loadedModel);
    }
    return loadedModels;
  }

  /**
   * Loads an individual model into the scene and applies transformations based on the PositionedObject.
   * @param {PositionedObject} positionedObject - The object defining the model and its transformations.
   * @returns {Promise<BABYLON.Mesh|null>} - The loaded model's root mesh or null if loading fails.
   */
  async loadModel(positionedObject) {
    if (!(positionedObject instanceof PositionedObject)) {
      throw new Error("SceneBuilder: Only instances of PositionedObject are allowed.");
    }
    try {
      const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
      const loadedModel = await this.modelLoader.loadModelFromUrl(this.scene, modelUrl);
      if (loadedModel) {
        positionedObject.setModel(loadedModel, positionedObject.modelId);
        if (positionedObject.cloneBase) {
          const loadedModelBase = loadedModel.meshes[0];
          loadedModelBase.setParent(null);
          loadedModel.meshes.forEach((mesh) => {
            // Optionally make meshes invisible for base cloning
          });
        }
        // Apply position, rotation, and scaling based on PositionedObject
        loadedModel.meshes[0].position = positionedObject.getCompositePositionBaseline();
        if (positionedObject.freeze) {
          loadedModel.meshes[0].freezeWorldMatrix();
          loadedModel.meshes[0].convertToUnIndexedMesh();
        }
        if (positionedObject.interactive == false) {
          loadedModel.meshes[0].isPickable = false;
          loadedModel.meshes[0].doNotSyncBoundingInfo = true;
        }
        loadedModel.meshes[0].scaling = positionedObject.scaling;
        loadedModel.meshes[0].rotation = positionedObject.rotation;
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
   * Moves a model to a new absolute position in the scene.
   * @param {PositionedObject} positionedObject - The object whose model is to be moved.
   * @param {BABYLON.Vector3} position - The new position.
   */
  moveModelTo(positionedObject, position) {
    if (!(positionedObject instanceof PositionedObject) || !positionedObject.model) {
      console.error("SceneBuilder: Invalid PositionedObject or model reference.");
      return;
    }
    positionedObject.model.position = position;
    window.Logger.log(`SceneBuilder: Model moved to new position: ${position}`);
  }

  /**
   * Moves a model by a given delta within the scene.
   * @param {PositionedObject} positionedObject - The object whose model is to be moved.
   * @param {BABYLON.Vector3} delta - The delta movement vector.
   */
  moveModelBy(positionedObject, delta) {
    if (!(positionedObject instanceof PositionedObject) || !positionedObject.model) {
      console.error("SceneBuilder: Invalid PositionedObject or model reference.");
      return;
    }
    positionedObject.model.position.addInPlace(delta);
    window.Logger.log(`SceneBuilder: Model moved by delta: ${delta}`);
  }
}
