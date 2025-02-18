class LevelData {
  // Static array containing predefined level configurations.
  // Each configuration includes grid dimensions, player starting position, and obstacles.
  static levels = [
    {
      nickname: "testLevel0", // Unique level identifier.
      depth: 21, // Number of grid rows.
      width: 11, // Number of grid columns.
      playerStartX: 5, // Player starting X coordinate.
      playerStartY: 0.25, // Player starting Y coordinate.

      playerStartZ: 10, // Player starting Z coordinate.
      obstacles: [
        {
          obstacleArchetype: "testMountain", // Determines model and behavior.
          nickname: "mountain0", // Friendly name for the obstacle.
          interactionId: "none", // No special interactions.
          xPosition: 5, // X position within the grid.
          yPosition: 0, // Y (typically ground level).
          zPosition: 5, // Z position within the grid.
          scale: 1, // Scaling factor for the model.
        },
      ],
    },
  ];

  /**
   * Retrieves a level configuration by its nickname.
   *
   * @param {string} nickname - The unique identifier for the level.
   * @returns {Object|string} - Level configuration object or an error string if not found.
   */
  static getLevelByNickname(nickname) {
    const level = this.levels.find((level) => level.nickname === nickname);
    if (level) {
      return level;
    } else {
      window.Logger.log("Invalid level nickname");
      return "InvalidLevelNickname";
    }
  }

  /**
   * Adds a new level configuration to the static levels array.
   *
   * @param {Object} level - The level configuration to add.
   */
  static addLevel(level) {
    this.levels.push(level);
  }

  /**
   * Removes a level configuration based on its nickname.
   *
   * @param {string} nickname - The unique identifier of the level to remove.
   */
  static removeLevelByNickname(nickname) {
    this.levels = this.levels.filter((level) => level.nickname !== nickname);
  }
}
