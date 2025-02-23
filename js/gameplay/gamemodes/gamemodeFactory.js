class GamemodeFactory {
  static initializeSpecifiedGamemode(gameModeUniqueId, gamemodeCategoryToLoad) {
    // Load the appropriate gamemode based on the input
    switch (gamemodeCategoryToLoad) {
      case "standard":
        return new GamemodeStandard(gameModeUniqueId);
      case "test":
        return GamemodeTestAssist(gameModeUniqueId);
      default:
        return new GamemodeStandard(gameModeUniqueId);
    }
  }
}
