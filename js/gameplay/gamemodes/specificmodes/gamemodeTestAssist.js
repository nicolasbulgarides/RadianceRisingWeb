class GamemodeTestAssist extends GamemodeGeneric {
  constructor() {
    super();

    // Specify test mode values and initialize the gamemode
    this.specifyTestModeAssistValues();
  }

  specifyTestModeAssistValues() {
    // Set experimental values for the test assist gamemode
    this.experimentalMovementIsBounded = true; // Movement is restricted in test mode
    this.experimentalObstaclesAreIgnored = true; // Obstacles do not affect movement in test mode
  }

  initializeGamemode() {
    // Apply the specified test mode values to the gamemode settings
    this.MOVEMENT_IS_BOUNDED = this.experimentalMovementIsBounded;
    this.OBSTACLES_ARE_IGNORED = this.experimentalObstaclesAreIgnored;
  }
}
