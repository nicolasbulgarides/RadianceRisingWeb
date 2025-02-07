class PlayerStatus {
  constructor(
    name,
    currentLevel,
    currentExp,
    currentMagic,
    maximumMagic,
    currentHealth,
    maximumHealth
  ) {
    this.name = name;
    // Player Stats
    this.currentLevel = currentLevel;
    this.currentExperience = currentExp;
    this.currentMagicPoints = currentMagic;
    this.maximumMagicPoints = maximumMagic;
    this.currentHealthPoints = currentHealth;
    this.maximumHealthPoints = maximumHealth;
  }

  static getPlayerStatusFresh(
    name,
    currentLevel,
    currentExp,
    maximumMagic,
    maximumHealth
  ) {
    let status = new PlayerStatus(
      name,
      currentLevel,
      currentExp,
      maximumMagic,
      maximumMagic,
      maximumHealth,
      maximumHealth
    );

    return status;
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
