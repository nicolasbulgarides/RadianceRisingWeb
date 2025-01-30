class WorldData {
  // Static array of worlds
  static worlds = [
    {
      nickname: "testWorld0",
      depth: 21,
      width: 11,
      playerStartX: 5,
      playerStartY: 0.5,
      playerStartZ: 11,
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
    return this.worlds.find((world) => world.nickname === nickname);
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

export default WorldData;
