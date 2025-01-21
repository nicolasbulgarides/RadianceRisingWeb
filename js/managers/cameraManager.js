// CameraManager.js

class CameraManager {
  /**
   * Constructor for CameraManager.
   * Initializes the camera based on the provided preset.
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {String} initialPreset - The initial camera preset.
   * @param {BABYLON.Mesh} targetMesh - The mesh the camera should follow (e.g., the player).
   */
  constructor(scene, initialPreset = CameraPreset.DEFAULT, targetMesh = null) {
    this.scene = scene;
    this.targetMesh = targetMesh;
    this.currentCamera = null;

    // Apply the initial camera preset
    this.applyPresetCamera(initialPreset);
  }

  /**
   * Applies a camera preset to the scene.
   * @param {String} presetName - The name of the camera preset.
   */
  applyPresetCamera(presetName) {
    // Dispose of any existing camera and remove it from the scene
    if (this.currentCamera) {
      this.currentCamera.detachControl();
      this.currentCamera.dispose();
    }

    // Set up the camera based on the preset name
    switch (presetName) {
      case CameraPreset.DEFAULT:
        this.currentCamera = this.setupDefaultCamera();
        break;
      case CameraPreset.GAMEWORLDTEST:
        this.currentCamera = this.setupGameWorldTestCamera();
        break;
      case CameraPreset.ORTHOGRAPHIC:
        this.currentCamera = this.setupOrthographicCamera();
        break;
      case CameraPreset.PERSPECTIVE:
        this.currentCamera = this.setupPerspectiveCamera();
        break;
      case CameraPreset.ISOMETRIC:
        this.currentCamera = this.setupIsometricCamera();
        break;
      case CameraPreset.HELICOPTER:
        this.currentCamera = this.setupHelicopterFollowCamera();
        break;
      default:
        window.Logger.warn(
          `CameraManager: Unknown or unused camera preset '${presetName}'. Reverting to DEFAULT.`
        );
        this.currentCamera = this.setupDefaultCamera();
    }

    // Set the new camera as active and attach control to it
    if (this.currentCamera) {
      this.scene.activeCamera = this.currentCamera;
      //this.currentCamera.inputs.addDeviceOrientation();

      this.currentCamera.attachControl(
        this.scene.getEngine().getRenderingCanvas(),
        true
      );

      window.Logger.log(`CameraManager: Applied preset '${presetName}'.`);
    }
  }

  /**
   * Sets up a default camera.
   * @returns {BABYLON.ArcRotateCamera} The configured default camera.
   */
  setupGameWorldTestCamera() {
    // Define the center of the game world
    const centerX = 10; // Center of the X-axis
    const centerZ = 10; // Center of the Z-axis

    ///const centerX = 0;
    ///const centerZ = 0;
    // Create an ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera(
      "gameWorldTestCamera",
      Math.PI / 2, // Angle around the Y-axis (horizontal rotation)
      Math.PI / 4, // Angle above the ground (vertical rotation)
      30, // Distance from the target (radius)
      new BABYLON.Vector3(centerX, 0, centerZ), // Target position (center of the game world)
      this.scene // The scene
    );

    // Attach camera controls to the canvas for interaction
    // camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

    return camera;
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
      new BABYLON.Vector3(0, 5, -10),
      this.scene
    );
    followCamera.lockedTarget = this.targetMesh;
    followCamera.radius = 10;
    followCamera.heightOffset = 5;
    followCamera.rotationOffset = -45;
    followCamera.cameraAcceleration = 0.05;
    followCamera.maxCameraSpeed = 10;

    return followCamera;
  }

  /**
   * Switches to a new camera preset dynamically.
   * @param {String} presetName - The name of the new camera preset to apply.
   */
  switchCameraPreset(presetName) {
    window.Logger.log(`CameraManager: Switching to preset '${presetName}'.`);
    this.applyPresetCamera(presetName);
  }

  // Additional camera setup methods (setupOrthographicCamera, setupPerspectiveCamera, setupIsometricCamera)...
}

// IIFE to attach CameraManager and CameraPreset to the global window object
(function () {
  if (typeof window !== "undefined") {
    window.CameraManager = CameraManager;
    window.CameraPreset = {
      DEFAULT: "DEFAULT",
      ORTHOGRAPHIC: "ORTHOGRAPHIC",
      PERSPECTIVE: "PERSPECTIVE",
      ISOMETRIC: "ISOMETRIC",
      HELICOPTER: "HELICOPTER",
    };
    console.log(
      "CameraManager and CameraPreset successfully loaded and available globally."
    );
  } else {
    console.log("Global export not available; `window` is undefined.");
  }
})();
