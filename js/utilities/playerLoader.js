class PlayerLoader {
  loadModelAndPosition(player, position) {
    const playerModelObject = PositionedObject.getPositionedObjectQuick(
      Config.DEFAULT_MODEL,
      position,
      0.25,
      false,
      false,
      false
    );

    player.loadPositionManager(playerModelObject, position);
    console.log("Default model: " + Config.DEFAULT_MODEL);
  }

  getDemoPlayer(defaultMap) {
    let gamePlayer = new PlayerUnit();
    gamePlayer.loadStatusFresh(
      Config.DEFAULT_NAME,
      Config.STARTING_LEVEL,
      Config.STARTING_EXP,
      Config.STARTING_HEALTH,
      Config.STARTING_HEALTH
    );

    let position = defaultMap.getPlayerStartingPosition();
    console.log(
      "Position: " + position.x + " , " + position.y + " , " + position.z
    );

    this.loadModelAndPosition(gamePlayer, position);

    return gamePlayer;
  }
}
