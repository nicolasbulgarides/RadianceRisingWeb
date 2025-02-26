/**
 * @class UnlockReport
 * @description A class for reporting unlock events to the server.
 */
class UnlockReport {
  constructor(player, unlockEvent) {
    this.unlockReportTimestamp = TimestampGenie.getTimestamp();
    this.unlockingPlayer = player;
    this.unlockingEvent = unlockEvent;
  }

  //to do - update implementation
  assembleUnlockReportInstruction() {
    let reportInstruction =
      "-placeholder-conveniently-shaped-report-instruction-";

    return reportInstruction;
  }

  //this is a method that generates a server informer id for the unlock receipt
  //the unlock manager will then use this ID to keep track of whether or not the server has received, processed and confirmed the receipt of an unlock event
  //as stored on the players account in our main server database
  generateAndStoreServerInformerId() {
    this.serverInformerId =
      "-placeholder-conveniently-shaped-server-informer-id-";
  }
}
