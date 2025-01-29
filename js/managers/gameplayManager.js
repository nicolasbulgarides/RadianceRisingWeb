class GameplayManager {
  constructor(sceneBuilder, cameraManager, lightingManager, scene) {
    this.lightingManager = lightingManager;
    this.sceneBuilder = sceneBuilder;
    this.scene = scene;
    this.cameraManager = cameraManager;

    this.gameworldScene = scene;
  }

  async initializeGameplay() {
    this.movementManager = new MovementManager();
    window.movementManager = this.movementManager;
    const demoWorld = new DemoWorld1(
      this.sceneBuilder,
      this.cameraManager,
      this.lightingManager,
      this.gridManager,
      this.scene
    );

    demoWorld.buildDemoWorld();

    await this.loadPlayer();
    this.demoWorldLoaded = true;
  }
  async loadPlayer() {
    const playerModelObject = new PositionedObject(
      "mechaSphereBronzeLowRes",
      5,
      0,
      10,
      0,
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      0.25,
      false,
      false,
      false
    );

    await window.sceneBuilder.loadAnimatedModel(playerModelObject);
    this.gamePlayer = new PlayerUnit("Francisco", playerModelObject, 5, 0, 10);
    this.cameraManager.setCameraToChase(playerModelObject.model);
  }

  processEndOfFrameEvents() {
    if (this.movementManager.movementActive) {
      let vectorMovement = this.movementManager.getNextPosition();

      // Validate the vector components
      if (
        isFinite(vectorMovement.x) &&
        isFinite(vectorMovement.y) &&
        isFinite(vectorMovement.z)
      ) {
        // If valid, update the position
        this.gamePlayer.setPosition(
          vectorMovement.x,
          vectorMovement.y,
          vectorMovement.z
        );
      } else {
        // Log an error if any component of the vector is invalid
        console.error(
          "Invalid position detected in vector movement:",
          vectorMovement
        );
      }
    }
  }
  2;
  processAttemptedMovement(direction) {
    const currentPosition = this.gamePlayer.getPositionVector();

    let goal = new BABYLON.Vector3(0, 0, 0);
    if (direction == "LEFTCLICK") {
      goal = new BABYLON.Vector3(2, 0, 2);

      // this.gamePlayer.updatePosition(-1, 0, 0);
    } else if (direction == "RIGHTCLICK") {
      goal = new BABYLON.Vector3(12, 0, 6);

      // this.gamePlayer.updatePosition(1, 0, 0);
    } else if (direction == "UPCLICK") {
      goal = new BABYLON.Vector3(6, 0, 4);

      // this.gamePlayer.updatePosition(0, 0, 1);
    } else if (direction == "DOWNCLICK") {
      goal = new BABYLON.Vector3(3, 3, 3);

      //  this.gamePlayer.updatePosition(0, 0, -1);
    }

    this.movementManager.initMovement(currentPosition, goal, 4, 60);
  }
}
