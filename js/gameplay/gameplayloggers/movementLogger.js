class MovementLogger {
  static LOG_ALL_GAMEPLAY_EVENTS_OVERRIDE = false;
  static LOG_ALL_PLAYER_MOVEMENTS = true;

  static lazyLog(logMessage, sender, importance) {
    let finalDecision = LoggerOmega.GetFinalizedLoggingDecision(
      this.LOG_ALL_GAMEPLAY_EVENTS_OVERRIDE,
      this.LOG_ALL_PLAYER_MOVEMENTS,
      importance
    );

    if (finalDecision) {
      LoggerOmega.SmartLogger(finalDecision, logMessage, sender);
    }
  }

  static autoDisplayInvalidMovement(currentPosition, destinationVector) {
    let doIntelligentLog = false;
    if (
      currentPosition instanceof BABYLON.Vector3 &&
      destinationVector instanceof BABYLON.Vector3
    ) {
      doIntelligentLog = true;
    }
    if (!doIntelligentLog) {
      let currentMsg = ChadUtilities.convertVectorToString(currentPosition);
      let destinationMsg =
        ChadUtilities.convertVectorToString(destinationVector);

      GameplayLogger.lazyLog(
        currentMsg,
        "GameplayLogger-Status of Current Vector for movement failure",
        0
      );
      GameplayLogger.lazyLog(
        destinationMsg,
        "GameplayLogger-Status of Destination Vector for movement failure",
        0
      );
    }
  }

  /**
   * Logs both the current and destination positions to the console for debugging purposes.
   * @param {BABYLON.Vector3} currentPositionVector - The player's current position.
   * @param {BABYLON.Vector3} destinationVector - The intended destination position.
   */
  displayCurrentPositionAndDestination(
    currentPositionVector,
    destinationVector
  ) {
    let logMessage =
      "Current position: X" +
      currentPositionVector.x +
      ", " +
      currentPositionVector.y +
      " , " +
      currentPositionVector.z +
      " destination of: X" +
      destinationVector.x +
      " , Y: " +
      destinationVector.y +
      " , " +
      destinationVector.z;

    LoggerOmega.SmartLogger(
      true,
      logMessage,
      "MovementPathManager-DisplayCurrentPositionAndDestination"
    );
  }

  static logInabilityToMoveOrAct(direction, player) {
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
