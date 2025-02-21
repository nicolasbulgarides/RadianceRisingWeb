class ValidActionChecker {
  checkIfAllowedToMove(playerToCheckIfAllowedToMove) {
    if (playerToCheckIfAllowedToMove.playerCurrentActionStatus.canAct()) {
      return true;
    }
    return false;
  }

  logInvalidMovementAttempt(direction, player) {
    let reasonCannotMoveOrAct =
      player.playerCurrentActionStatus.assembleReasonCannotMoveOrAct();
    GameplayLogger.lazyLog(
      "Movement towards  " +
        direction +
        " is prohibited because: " +
        reasonCannotMoveOrAct,
      "ValidActionChecker",
      0
    );
  }
}
