class WorldMap {
  constructor() {
    this.boardSlots = []; // Add this line to store grid slots
    this.mapWidth = 1;
    this.mapDepth = 1;
    this.startingPosition = null;
    this.obstacles = {};
  }

  attemptToLoadMapComposite(worldPreset) {
    let worldToLoad = WorldData.getWorldByNickname(worldPreset);
    this.mapWidth = worldToLoad.width;
    this.mapDepth = worldToLoad.depth;

    //console.log("Width: " + this.mapWidth + " , depth " + this.mapDepth);
    this.initializeBoardSlots(this.mapWidth, this.mapDepth);
    this.initializeStartingPosition(worldToLoad);
  }
  initializeStartingPosition(worldToLoad) {
    this.startingPosition = new BABYLON.Vector3(
      worldToLoad.playerStartX,
      worldToLoad.playerStartY,
      worldToLoad.playerStartZ
    );
    /**
    console.log(
      "Starting position of map:" + this.startingPosition.x + " , " + this,
      this.startingPosition.y + ",  " + this.startingPosition.z
    );
     */
  }

  worldObstacleTest(generator) {
    generator.generateEdgeMountains(this);
    generator.initializeObstacles(this);
  }
  initializeBoardSlots(width, depth) {
    this.boardSlots = new Array(width);
    for (let x = 0; x < width; x++) {
      this.boardSlots[x] = new Array(depth);

      for (let z = 0; z < depth; z++) {
        this.boardSlots[x][z] = new BoardSlot(x, 0, z);
      }
    }
  }

  getPlayerStartingPosition() {
    return this.startingPosition;
  }
}
