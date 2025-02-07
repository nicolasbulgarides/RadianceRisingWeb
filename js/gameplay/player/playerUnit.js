class PlayerUnit {
  constructor() {}
  loadPositionManager(playerModelPositionedObject, position) {
    this.playerPositionAndModelManager = new PlayerPositionAndModelManager(
      playerModelPositionedObject,
      position
    );
  }
  loadStatusFresh(
    name,
    currentLevel,
    currentExperience,
    baseMagicPoints,
    baseHealthPoints
  ) {
    this.playerStatus = PlayerStatus.getPlayerStatusFresh(
      name,
      currentLevel,
      currentExperience,
      baseMagicPoints,
      baseHealthPoints
    );
  }

  loadStatusPartiallyDepleted(
    name,
    currentLevel,
    currentExperience,
    baseMagicPoints,
    currentMagicPoints,
    baseHealthPoints,
    currentHealthPoints
  ) {
    this.playerStatus = new PlayerStatus(
      name,
      currentLevel,
      currentExperience,
      currentMagicPoints,
      baseMagicPoints,
      currentHealthPoints,
      baseHealthPoints
    );
  }

  getPlayerPositionAndModelManager() {
    return this.playerPositionAndModelManager;
  }

  getPlayerModelDirectly() {
    return this.getPlayerPositionAndModelManager().getPlayerModelDirectly();
  }
  getPlayerStatus() {
    return this.playerStatus;
  }
}
