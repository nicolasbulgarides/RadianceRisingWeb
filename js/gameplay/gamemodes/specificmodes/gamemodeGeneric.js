class GamemodeGeneric {
  static MOVEMENT_IS_BOUNDED = false; // Indicates if player movement is restricted
  static OBSTACLES_ARE_IGNORED = false; // Determines if obstacles affect player movement
  static MAX_MOVEMENT_DISTANCE = 999; // Maximum distance a player can move in one action
  static USE_PLAYER_MOVEMENT_DISTANCE = false;
  constructor(
    modeUniqueId,
    category,
    enforcings,
    movementBounded,
    ignoreObstacles,
    usePlayerMovementDistance
  ) {
    this.modeUniqueId = modeUniqueId;
    this.category = category;
    this.MOVEMENT_IS_BOUNDED = movementBounded;
    this.OBSTACLES_ARE_IGNORED = ignoreObstacles;
    this.USE_PLAYER_MOVEMENT_DISTANCE = usePlayerMovementDistance;
    this.currentEnforcings = enforcings;
  }

  initializeGamemode() {
    // Placeholder for gamemode-specific initialization logic
  }

  describeCurrentGamemode() {
    const description = {
      modeId: this.modeUniqueId,
      category: this.category,
      rules: {
        movementBounded: this.MOVEMENT_IS_BOUNDED,
        ignoresObstacles: this.OBSTACLES_ARE_IGNORED,
        usesPlayerMovementDistance: this.USE_PLAYER_MOVEMENT_DISTANCE,
        maxMovementDistance: GamemodeGeneric.MAX_MOVEMENT_DISTANCE,
      },
      activeEnforcings: this.currentEnforcings,
    };

    // Log formatted description for debugging
    console.log(
      "🎮 Gamemode Configuration:",
      JSON.stringify(description, null, 2)
    );

    return description;
  }
}
