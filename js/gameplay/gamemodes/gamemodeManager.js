class GamemodeManager {
  static CURRENT_GAMEMODE = null;

  constructor(gamemodeToLoad) {
    // Initialize the current gamemode based on the provided type
    this.initializeGamemode(gamemodeToLoad);
  }

  initializeGamemode(gamemodeToLoad) {
    // Load the appropriate gamemode based on the input
    switch (gamemodeToLoad) {
      case "standard":
        this.CURRENT_GAMEMODE = new GamemodeStandard();
        break;
      case "test":
        this.CURRENT_GAMEMODE = new GamemodeTestAssist();
        break;
      default:
        this.CURRENT_GAMEMODE = new GamemodeStandard();
        break;
    }
  }
}
