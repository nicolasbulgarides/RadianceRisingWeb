class PlayerUnit {
  constructor(
    name = "Player",
    playerModelPositionedObject,
    x,
    y,
    z,
    currentLevel,
    currentExperience,
    baseMagicPoints,
    baseHealthPoints
  ) {
    this.name = name;

    // Player Stats
    this.currentLevel = currentLevel;
    this.currentExperience = currentExperience;
    this.currentXPosition = x;
    this.currentYPosition = y;
    this.currentZPosition = z;
    this.currentMagicPoints = baseMagicPoints;
    this.maximumMagicPoints = baseMagicPoints;
    this.currentHealthPoints = baseHealthPoints;
    this.maximumHealthPoints = baseHealthPoints;
    this.playerModelPositionedObject = playerModelPositionedObject;
  }

  getPlayerModel() {
    return this.playerModelPositionedObject;
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
