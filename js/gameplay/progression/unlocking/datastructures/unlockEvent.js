/***
 *
 * Class for storing the data related to a specific unlock event.
 * Logic Flow: GameplayManagerComposite notices / remarks upon some sort of accomplishment
 * The accomplishment is then reported to the UnlockManager which converts an accomplishment into an UnlockEvent and
 * then validates the unlock event. After validation, the unlock is applied to the appropriate game content.
 */

class UnlockEvent {
  constructor(
    unlockId,
    unlockNickname,
    unlockDescription,
    relevantPlayer,
    whatWasUnlocked,
    unlockReason
  ) {
    this.unlockEventId = unlockId;
    this.unlockEventNickname = unlockNickname;
    this.unlockEventDescription = unlockDescription;
    this.unlockEventTimestamp = TimestampGenie.getTimestamp();
    this.relevantPlayer = relevantPlayer;
    this.whatWasUnlocked = whatWasUnlocked;
    this.unlockEventReason = unlockReason;
  }
}
