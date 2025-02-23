class ValidActionChecker {
  static canMove(playerToCheck) {
    if (playerToCheck instanceof PlayerUnit) {
      if (playerToCheck.playerStatus.playerCurrentActionStatus.canAct()) {
        return true;
      }
      MovementLogger.lazyLog(
        "Player Unable to move due to something stopping their ability to act: " +
          playerToCheck.playerCurrentActionStatus.assembleReasonCannotMoveOrAct(),
        "GameplayManagerComposite"
      );
      MovementLogger.logInabilityToMoveOrAct(direction, playerToCheck);

      return false;
    } else {
      MovementLogger.lazyLog(
        "Player Unable to move due to not being a valid player unit: " +
          typeof playerToCheck,
        "GameplayManagerComposite"
      );
      return false;
    }
  }
}
