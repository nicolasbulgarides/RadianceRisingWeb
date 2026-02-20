// CameraManager.js

class CameraManager {
  /**
   * Constructor for CameraManager.
   * Initializes the camera based on the provided preset.
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {String} initialPreset - The initial camera preset.
   * @param {BABYLON.Mesh} targetMesh - The mesh the camera should follow (e.g., the player).
   */
  constructor() {
    this.targetMesh = null;
  }

  registerPrimaryGameScene(scene) {
    this.scene = scene;
  }

  hasActiveCamera() {
    if (this.currentCamera == null) {
      return false;
    } else {
      return true;
    }
  }

  utilizeDefaultGameSceneForCamera() {
    this.registerPrimaryGameScene(
      FundamentalSystemBridge[renderSceneSwapper].getActiveGameLevelScene()
    );
  }

  /**
   * Creates a top-down free camera, centered on the board, with consistent orientation.
   * All gameplay cameras should use this helper for consistency.
   */
  createTopDownCamera(scene, name = "topDownCamera", center = new BABYLON.Vector3(7, 0, 7), height = 35) {
    const camera = new BABYLON.FreeCamera(
      name,
      new BABYLON.Vector3(center.x, height, center.z),
      scene
    );

    // Look straight down at the board center
    camera.setTarget(new BABYLON.Vector3(center.x, 0, center.z));

    // Top-down orientation: pitch 90deg, no yaw/roll tweaks
    camera.rotation.x = Math.PI / 2;
    camera.rotation.y = 0;
    camera.rotation.z = 0;

    return camera;
  }

  /**
   * Sets up the gameplay camera using the unified top-down camera.
   */
  setupGameLevelTestCamera() {
    const camera = this.createTopDownCamera(
      this.scene,
      "gameLevelTestCamera",
      new BABYLON.Vector3(7, 0, 7),
      40 // 15% further out than original 35
    );
    this.currentCamera = camera;
    return camera;
  }

  static setAndGetPlaceholderCamera(scene) {
    // Delegate to the unified top-down creator to avoid divergence
    const manager = new CameraManager();
    manager.registerPrimaryGameScene(scene);
    return manager.createTopDownCamera(scene, "defaultCamera", new BABYLON.Vector3(7, 0, 7), 40);
  }

  setCameraToChase(relevantScene, modelToChase) {
    if (!modelToChase) {
      console.error("Model to chase null");
      return;
    } else if (!(modelToChase instanceof BABYLON.AbstractMesh)) {
      console.error("Model to chase is not a valid AbstractMesh");
      return;
    }

    // Create and configure the new follow camera
    const followCamera = new BABYLON.FollowCamera(
      "helicopterFollowCamera",
      new BABYLON.Vector3(0, 0, 0),
      relevantScene
    );

    // Set the target mesh
    this.targetMesh = modelToChase;
    followCamera.lockedTarget = this.targetMesh; // Lock camera to the target

    // Configure the camera to follow from a height of 10 units

    followCamera.radius = 5; // Adjusted distance from the target (try increasing if needed)
    followCamera.heightOffset = 10; // Height above the target

    // followCamera.radius = 20; // Adjusted distance from the target (try increasing if needed)
    // followCamera.heightOffset = 40; // Height above the target
    followCamera.rotationOffset = 0; // Angle around the target (set to 0 for no rotation)
    followCamera.cameraAcceleration = 0.05; // Lower acceleration for smoother movement
    followCamera.maxCameraSpeed = 1; // Adjust maximum speed for smooth camera movement
    followCamera.rotationOffset = 180;
    // Assign the new camera and activate it
    this.currentCamera = followCamera;
  }

  // Deprecated/legacy setup methods were removed to enforce a single camera style.
}
