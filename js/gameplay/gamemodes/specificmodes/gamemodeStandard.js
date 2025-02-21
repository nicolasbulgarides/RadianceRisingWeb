class GamemodeStandard extends GamemodeGeneric {
  constructor() {
    super();
    // Initialize the standard gamemode settings
  }

  initializeGamemode() {
    // Set the movement and obstacle interaction rules for the standard gamemode
    this.MOVEMENT_IS_BOUNDED = false;
    this.OBSTACLES_ARE_IGNORED = false;
    this.MAX_MOVEMENT_DISTANCE = 999;
  }
}
