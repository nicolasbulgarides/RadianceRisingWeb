class GamemodeTestAssist extends GamemodeGeneric {
  constructor(
    uniqueId,
    modeNickName,
    enforcings,
    movementBounded,
    ignoreObstacles,
    usePlayerMovementDistance
  ) {
    super(
      uniqueId,
      modeNickName,
      enforcings,
      movementBounded,
      ignoreObstacles,
      usePlayerMovementDistance
    );
    console.log("Ignore obstacles: ", ignoreObstacles);
    this.initializeGamemode();
    // Specify test mode values and initialize the gamemode
  }

  initializeGamemode() {}
}
