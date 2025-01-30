class WorldData {
  // Static array of worlds
  static worlds = [
    {
      nickname: "testWorld0",
      depth: 21,
      width: 11,
      playerStartX: 5,
      playerStartY: 0.25,
      playerStartZ: 10,
      obstacles: [
        {
          obstacleArchetype: "testMountain",
          nickname: "mountain0",
          interactionId: "none",
          xPosition: 5,
          yPosition: 0,
          zPosition: 5,
          scale: 1,
        },
      ],
    },
  ];

  // Method to get a world by nickname
  static getWorldByNickname(nickname) {
    const world = this.worlds.find((world) => world.nickname === nickname);
    if (world) {
      console.log("World found: " + nickname);
      return world; // Return the world if found
    } else {
      window.Logger.log("Invalid world nickname"); // Log an error if the world is not found
      return "InvalidWorldNickname"; // Return a string indicating an invalid nickname
    }
  }
  // Method to add a new world
  static addWorld(world) {
    this.worlds.push(world);
  }

  // Method to remove a world by nickname
  static removeWorldByNickname(nickname) {
    this.worlds = this.worlds.filter((world) => world.nickname !== nickname);
  }
}
