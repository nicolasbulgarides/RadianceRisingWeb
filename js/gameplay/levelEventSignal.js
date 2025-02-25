//The gameplay manager will generate level event signals based off of a players actions.
//level event signals are a general signal which is used by other systems to identify what special
//events should happen - depending on what the kind of event is, it might be under the category of "micro event"
//where microevents are simple, common and generic and do not have complex event chains.
//Triggers are much more complex, modular and can generate an arbitrary number of occurences, and each occurence
//can cause other occurences which can do essentially anything.

//Logic flow -
//  Player or environment does X, X is checked against Triggers (Which may result in Y)  and MicroEvents (which may Result in M)

class LevelEventSignal {
  constructor(
    levelEventId,
    levelEventTimestamp,
    levelEventNickName,
    levelEventDescription,
    levelEventCategory,
    levelEventCause,
    levelEventPrimaryTarget,
    levelEventSecondaryTargets,
    levelEventRelevantValue,
    levelEventPlaceholderData
  ) {
    this.levelEventId = levelEventId;
    this.levelEventTimestamp = levelEventTimestamp;
    this.levelEventNickName = levelEventNickName;
    this.levelEventDescription = levelEventDescription;
    this.levelEventCategory = levelEventCategory;
    this.levelEventCause = levelEventCause;
    this.levelEventPrimaryTarget = levelEventPrimaryTarget;
    this.levelEventSecondaryTargets = levelEventSecondaryTargets;
    this.levelEventRelevantValue = levelEventRelevantValue;
    this.levelEventPlaceholderData = levelEventPlaceholderData;
  }
}
