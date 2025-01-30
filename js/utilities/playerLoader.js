class PlayerLoader {
  constructor() {
    loadPlayerModel();
  }

  getDefaultPlayerModel(xPosition, yPosition, zPosition) {
    const playerModelObject = new PositionedObject(
      "mechaSphereBronzeLowRes",
      xPosition,
      yPosition,
      zPosition,
      0,
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      0.25,
      false,
      false,
      false
    );

    return playerModelObject;
  }

  getDemoPlayer(playerName, xPosition, yPosition, zPosition) {
    let playerModel = this.getDefaultPlayerModel();

    let gamePlayer = new PlayerUnit(
      playerName,
      playerModel,
      xPosition,
      yPosition,
      zPosition
    );
    return gamePlayer;
  }
}
