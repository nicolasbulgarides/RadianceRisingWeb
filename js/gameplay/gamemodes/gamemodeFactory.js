class GamemodeFactory {
  static initializeSpecifiedGamemode(categoryToLoad) {
    let uniqueId = categoryToLoad + RandomAssist.getRandomInt(10000, 99999);
    let enforcings = GamemodeFactory.getEnforcings(categoryToLoad);

    // Load the appropriate gamemode based on the input
    switch (categoryToLoad) {
      case "standard":
        return GamemodeFactory.getStandardGamemode(uniqueId, enforcings);
      case "test":
        return GamemodeFactory.getTestGamemode(
          uniqueId,
          categoryToLoad,
          enforcings
        );
      default:
        return GamemodeFactory.getStandardGamemode(uniqueId, enforcings);
    }
  }

  static getStandardGamemode(uniqueId, category, enforcings) {
    let ignoreObstacles = true;
    let movementBounded = true;
    let usePlayerMovementDistance = true;
    return new GamemodeStandard(
      uniqueId,
      category,
      enforcings,
      movementBounded,
      ignoreObstacles,
      usePlayerMovementDistance
    );
  }
  static getTestGamemode(uniqueId, category, enforcings) {
    let ignoreObstacles = false;
    let movementBounded = true;
    let usePlayerMovementDistance = false;
    return new GamemodeTestAssist(
      uniqueId,
      category,
      enforcings,
      movementBounded,
      ignoreObstacles,
      usePlayerMovementDistance
    );
  }

  static getEnforcings(category) {
    switch (category) {
      case "standard":
        return GamemodeFactory.getStandardEnforcings();
      case "test":
        return GamemodeFactory.getTestEnforcings();
      default:
        return GamemodeFactory.getStandardEnforcings();
    }
  }

  static getStandardEnforcings() {
    let enforcings = new GamemodeEnforcings();
    return enforcings;
  }
  static getTestEnforcings() {
    let enforcings = new GamemodeEnforcings();
    enforcings.setMaximumMovementDistance(2);
    return enforcings;
  }
}
