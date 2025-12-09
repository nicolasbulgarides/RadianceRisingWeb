/**
 * SceneBuilder orchestrates the loading and placement of models within a Babylon.js scene.
 * It supports both static and animated models, and provides utility methods for moving models.
 */
class SceneBuilder {
  static maxRetries = 3;
  static baseDelay = 2000; // Base delay in milliseconds
  static uiSceneInstance = null; // Store the UI scene instance

  /**
   * Creates a new UI scene instance
   * @param {BABYLON.Engine} engine - The Babylon.js engine instance
   * @returns {BABYLON.Scene} - The created UI scene
   */
  static createUIScene(engine) {
    if (SceneBuilder.uiSceneInstance) {
      return SceneBuilder.uiSceneInstance;
    }

    const uiScene = new BABYLON.Scene(engine);
    uiScene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Transparent background
    uiScene.autoClear = false; // Don't clear the scene automatically
    uiScene.autoClearDepthAndStencil = false; // Don't clear depth and stencil buffers

    // Create a basic camera for the UI scene
    const uiCamera = new BABYLON.ArcRotateCamera(
      "uiCamera",
      0,
      Math.PI / 2,
      10,
      BABYLON.Vector3.Zero(),
      uiScene
    );
    uiCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    uiCamera.setTarget(BABYLON.Vector3.Zero());

    // Create basic lighting
    const uiLight = new BABYLON.HemisphericLight(
      "uiLight",
      new BABYLON.Vector3(0, 1, 0),
      uiScene
    );
    uiLight.intensity = 1.0;

    SceneBuilder.uiSceneInstance = uiScene;
    return uiScene;
  }

  /**
   * Constructs a SceneBuilder.
   * @param {BABYLON.Scene} scene - The Babylon.js scene instance.
   * @param {boolean} isUIScene - Whether this is a UI scene instance
   */
  constructor(scene, isUIScene = false) {
    this.scene = scene;
    this.isUIScene = isUIScene;
    this.modelLoader = new ModelLoader();
    this.animatedModelLoader = new AnimatedModelLoader(this.scene);
    this.loadedModels = []; // Array to store references to loaded models

    // Set background color based on scene type
    if (isUIScene) {
      this.setBackgroundColor(new BABYLON.Color4(0, 0, 0, 0)); // Transparent for UI
      this.scene.autoClear = false;
      this.scene.autoClearDepthAndStencil = false;
    } else {
      this.setBackgroundColor(new BABYLON.Color4(0.1, 0.1, 0.3, 1)); // Default for game scenes
    }
  }

  /**
   * Calculates delay for exponential backoff
   * @param {number} attempt - Current retry attempt
   * @returns {number} - Delay in milliseconds
   */
  static getRetryDelay(attempt) {
    return Math.min(2000 * Math.pow(2, attempt), 30000); // Max 30 second delay
  }

  /**
   * Delays execution for specified milliseconds
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Loads a model with retry logic
   * @param {PositionedObject} positionedObject - The object defining the model
   * @param {number} attempt - Current retry attempt
   * @param {boolean} useCache - Whether to use cached model (default: true)
   * @returns {Promise<BABYLON.Mesh|null>}
   */
  async loadModelWithRetry(positionedObject, attempt = 0, useCache = true) {
    try {
      const modelUrl = AssetManifest.getAssetUrl(positionedObject.modelId);
      if (!modelUrl) {
        console.error(
          `SceneBuilder: Asset '${positionedObject.modelId}' not found in AssetManifest.`
        );
        return null;
      }

      const loadedModel = await this.modelLoader.loadModelFromUrl(
        this.scene,
        modelUrl,
        useCache // Pass through cache setting
      );

      if (loadedModel) {
        // Apply transformations to the cloned model
        const rootMesh = loadedModel.meshes[0];
        if (rootMesh) {
          positionedObject.setModel(loadedModel);

          if (positionedObject.cloneBase) {
            rootMesh.setParent(null);
          }

          // Apply transformations
          rootMesh.position = positionedObject.getCompositePositionBaseline();
          rootMesh.rotation = positionedObject.rotation;
          rootMesh.scaling = positionedObject.scaling;

          // Apply performance optimizations
          if (positionedObject.freeze) {
            rootMesh.freezeWorldMatrix();
            rootMesh.convertToUnIndexedMesh();
            // Also freeze all child meshes
            if (rootMesh.getChildMeshes) {
              rootMesh.getChildMeshes().forEach((childMesh) => {
                if (childMesh instanceof BABYLON.Mesh) {
                  childMesh.freezeWorldMatrix();
                }
              });
            }
          }

          // Set interactivity
          if (!positionedObject.interactive) {
            rootMesh.isPickable = false;
            rootMesh.doNotSyncBoundingInfo = true;
          }
        }
        return loadedModel;
      }
      return null;
    } catch (error) {
      console.warn(
        `Attempt ${attempt + 1} failed for model: ${positionedObject.modelId}`,
        error
      );

      if (
        (error.status === 429 ||
          error.status === 403 ||
          error.status != null) &&
        attempt < SceneBuilder.maxRetries
      ) {
        const delay = SceneBuilder.getRetryDelay(attempt);
        console.log(`Retrying ${positionedObject.modelId} in ${delay}ms...`);

        await SceneBuilder.delay(delay);
        return this.loadModelWithRetry(positionedObject, attempt + 1, useCache);
      }

      console.error(
        `Failed to load model after ${attempt + 1} attempts: ${positionedObject.modelId
        }`,
        error
      );
      return null;
    }
  }

  /**
   * Retrieves the Babylon.js scene managed by the SceneBuilder.
   * @returns {BABYLON.Scene} - The managed scene.
   */
  getGameLevelScene() {
    return this.scene;
  }

  /**
   * Sets the background color of the scene.
   * @param {BABYLON.Color4} color - The color to set as the background.
   */
  setBackgroundColor(color) {
    this.scene.clearColor = color;
    if (this.isUIScene) {
      this.scene.autoClear = false;
      this.scene.autoClearDepthAndStencil = false;
    }
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
      const positionedModel = await this.animatedModelLoader.loadModel(
        positionedObject
      );
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
    const loadPromises = positionedObjects.map(async (positionedObject) => {
      if (!(positionedObject instanceof PositionedObject)) {
        throw new Error(
          "SceneBuilder: Only instances of PositionedObject are allowed."
        );
      }

      const model = await this.loadModelWithRetry(positionedObject);
      if (model) {
        this.loadedModels.push(model);
      }
      return model;
    });

    return Promise.all(loadPromises);
  }

  /**
   * Loads an individual model into the scene and applies transformations based on the PositionedObject.
   * @param {PositionedObject} positionedObject - The object defining the model and its transformations.
   * @param {boolean} useCache - Whether to use cached model (default: true). Set to false for independent copies.
   * @returns {Promise<BABYLON.Mesh|null>} - The loaded model's root mesh or null if loading fails.
   */
  async loadModel(positionedObject, useCache = true) {
    if (!(positionedObject instanceof PositionedObject)) {
      throw new Error(
        "SceneBuilder: Only instances of PositionedObject are allowed."
      );
    }

    const model = await this.loadModelWithRetry(positionedObject, 0, useCache);
    if (model) {
      this.loadedModels.push(model);
    }
    return model;
  }

  /**
   * Moves a model to a new absolute position in the scene.
   * @param {PositionedObject} positionedObject - The object whose model is to be moved.
   * @param {BABYLON.Vector3} position - The new position.
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
   * Moves a model by a given delta within the scene.
   * @param {PositionedObject} positionedObject - The object whose model is to be moved.
   * @param {BABYLON.Vector3} delta - The delta movement vector.
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
