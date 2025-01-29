class PlayerUnit {
  constructor(name = "Player", playerModelPositionedObject, x, y, z) {
    this.name = name;

    // Player Stats
    this.currentLevel = 1;
    this.currentExperience = 0;
    this.currentXPosition = x;
    this.currentYPosition = y;
    this.currentZPosition = z;
    this.currentMagicPoints = 3;
    this.maximumMagicPoints = 3;
    this.currentHealthPoints = 5;
    this.maximumHealthPoints = 5;
    this.playerModelPositionedObject = playerModelPositionedObject;
    console.log(
      playerModelPositionedObject.modelId + " model id of player unit"
    );
  }

  // Update position
  setPosition(x, y, z) {
    this.currentXPosition = x;
    this.currentYPosition = y;
    this.currentZPosition = z;
    this.playerModelPositionedObject.setPosition(
      this.currentXPosition,
      this.currentYPosition,
      this.currentZPosition
    );
    console.log(
      "Position set to X,Y,Z:" +
        this.currentXPosition +
        " , " +
        this.currentYPosition +
        " , " +
        this.currentZPosition
    );
  }

  getPositionVector() {
    const position = new BABYLON.Vector3(
      this.currentXPosition,
      this.currentYPosition,
      this.currentZPosition
    );
    return position;
  }

  updatePosition(x, y, z) {
    this.currentXPosition += x;
    this.currentYPosition += y;
    this.currentZPosition += z;

    console.log(
      "Position updated to X,Y,Z:" +
        this.currentXPosition +
        " , " +
        this.currentYPosition +
        " , " +
        this.currentZPosition
    );

    this.playerModelPositionedObject.setPosition(
      this.currentXPosition,
      this.currentYPosition,
      this.currentZPosition
    );
  }

  // Add experience and level up if necessary
  addExperience(amount) {}

  // Level up function
  levelUp() {}

  // Damage the player
  takeDamage(amount) {}

  // Heal the player
  heal(amount) {}

  // Use magic points
  useMagic(amount) {}

  // Restore magic points
  restoreMagic(amount) {}

  // Handle player death
  die() {}
}
