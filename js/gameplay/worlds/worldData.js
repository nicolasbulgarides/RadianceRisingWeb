class WorldData {
  // Static array containing predefined world configurations.
  // Each configuration includes grid dimensions, player starting position, and obstacles.
  static worlds = [
    {
      nickname: "testWorld0", // Unique world identifier.
      depth: 21,              // Number of grid rows.
      width: 11,              // Number of grid columns.
      playerStartX: 5,        // Player starting X coordinate.
      playerStartY: 0.25,     // Player starting Y coordinate.
      playerStartZ: 10,       // Player starting Z coordinate.
      obstacles: [
        {
          obstacleArchetype: "testMountain", // Determines model and behavior.
          nickname: "mountain0",             // Friendly name for the obstacle.
          interactionId: "none",             // No special interactions.
          xPosition: 5,                      // X position within the grid.
          yPosition: 0,                      // Y (typically ground level).
          zPosition: 5,                      // Z position within the grid.
          scale: 1,                          // Scaling factor for the model.
        },
      ],
    },
  ];

  /**
   * Retrieves a world configuration by its nickname.
   *
   * @param {string} nickname - The unique identifier for the world.
   * @returns {Object|string} - World configuration object or an error string if not found.
   */
  static getWorldByNickname(nickname) {
    const world = this.worlds.find((world) => world.nickname === nickname);
    if (world) {
      return world;
    } else {
      window.Logger.log("Invalid world nickname");
      return "InvalidWorldNickname";
    }
  }

  /**
   * Adds a new world configuration to the static worlds array.
   *
   * @param {Object} world - The world configuration to add.
   */
  static addWorld(world) {
    this.worlds.push(world);
  }

  /**
   * Removes a world configuration based on its nickname.
   *
   * @param {string} nickname - The unique identifier of the world to remove.
   */
  static removeWorldByNickname(nickname) {
    this.worlds = this.worlds.filter((world) => world.nickname !== nickname);
  }
}
