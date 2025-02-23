class ValidActionChecker {
  static canMove(playerToCheck, direction) {
    if (playerToCheck instanceof PlayerUnit) {
      if (playerToCheck.playerStatus.playerCurrentActionStatus.canAct()) {
        return true;
      }
      //to do add status error logging
      return false;
    } else {
      MovementLogger.lazyLog(
        "Player Unable to move in direction: " +
          direction +
          " due to not being a valid player unit: " +
          typeof playerToCheck,
        "GameplayManagerComposite"
      );
      return false;
    }
  }
}
