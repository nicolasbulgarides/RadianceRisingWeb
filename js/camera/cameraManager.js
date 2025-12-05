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
   * Sets up a default camera.
   * @returns {BABYLON.ArcRotateCamera} The configured default camera.
   */
  setupGameLevelTestCamera() {
    // Define the center of the game level for a 15x15 board
    const centerX = 7; // Center of the X-axis for 15x15 board
    const centerZ = 7; // Center of the Z-axis for 15x15 board

    // Camera position - directly above the center, looking straight down
    const cameraX = centerX; // Match X with center for orthogonal view
    const cameraY = 35; // Height above the board (lower = bigger/closer view)
    const cameraZ = centerZ; // Match Z with center for orthogonal view

    // Create a FreeCamera positioned directly above the board center
    const camera = new BABYLON.FreeCamera(
      "gameLevelTestCamera",
      new BABYLON.Vector3(cameraX, cameraY, cameraZ),
      this.scene
    );

    // Set the camera to look straight down - target matches camera X/Z to keep it orthogonal
    // This ensures the camera is perfectly orthogonal (perpendicular) to the board
    camera.setTarget(new BABYLON.Vector3(cameraX, 0, cameraZ));

    // Rotate camera to look straight down (rotation around X axis)
    camera.rotation.x = Math.PI / 2; // 90 degrees to look straight down

    // Rotate camera 180 degrees around Z-axis (horizontal/roll) so D-pad down moves down on board
    camera.rotation.z = Math.PI; // 180 degrees rotation

    // Disable camera controls to keep it fixed
    // camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

    this.currentCamera = camera;
    return camera;
  }

  static setAndGetPlaceholderCamera(scene) {
    // Use the same overhead view as the game camera to avoid visible transition
    // Position directly above center (7, 40, 7) looking straight down at (7, 0, 7) for 15x15 board
    const centerX = 7; // Center of the X-axis for 15x15 board
    const centerZ = 7; // Center of the Z-axis for 15x15 board
    const cameraX = centerX; // Match X with center for orthogonal view
    const cameraY = 35; // Height above the board (lower = bigger/closer view)
    const cameraZ = centerZ; // Match Z with center for orthogonal view

    const camera = new BABYLON.FreeCamera(
      "defaultCamera",
      new BABYLON.Vector3(cameraX, cameraY, cameraZ),
      scene
    );

    // Set the camera to look straight down - target matches camera X/Z to keep it orthogonal
    camera.setTarget(new BABYLON.Vector3(cameraX, 0, cameraZ));

    // Rotate camera to look straight down (rotation around X axis)
    camera.rotation.x = Math.PI / 2; // 90 degrees to look straight down

    // Rotate camera 180 degrees around Z-axis (horizontal/roll) so D-pad down moves down on board
    camera.rotation.z = Math.PI; // 180 degrees rotation

    return camera;
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

  /**
   * Sets up a default camera.
   * @returns {BABYLON.ArcRotateCamera} The configured default camera.
   */
  setupDefaultCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      "defaultCamera",
      Math.PI / 2,
      Math.PI / 4,
      10,
      BABYLON.Vector3.Zero(),
      this.scene
    );

    camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

    return camera;
  }
  setupDeviceMotionCamera() {
    const camera = new BABYLON.DeviceOrientationCamera(
      "motionCamera",
      BABYLON.Vector3.Zero(),
      this.scene
    );
    return camera;
  }

  /**
   * Sets up a helicopter-style follow camera.
   * @returns {BABYLON.FollowCamera} The configured helicopter follow camera.
   */
  setupHelicopterFollowCamera() {
    if (!this.targetMesh) {
      window.Logger.warn(
        "CameraManager: Target mesh for helicopter camera is not defined."
      );
      return null;
    }

    const followCamera = new BABYLON.FollowCamera(
      "helicopterFollowCamera",
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    followCamera.lockedTarget = this.targetMesh;
    followCamera.radius = 2;
    followCamera.heightOffset = 10;
    followCamera.cameraAcceleration = 0.05;
    followCamera.maxCameraSpeed = 10;
    followCamera.rotationOffset = 180;

    return followCamera;
  }

  /**
   * Switches to a new camera preset dynamically.
   * @param {String} presetName - The name of the new camera preset to apply.
   */
  switchCameraPreset(presetName) {
    this.applyPresetCamera(presetName);
  }

  // Additional camera setup methods (setupOrthographicCamera, setupPerspectiveCamera, setupIsometricCamera)...
}
