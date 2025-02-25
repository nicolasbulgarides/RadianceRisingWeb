class TriggerFactory {
  /**
   * @param {LevelDataComposite} levelDataComposite - Defines all gameplay data for a level
   */

  static formAllTriggersFromLevelData(levelData) {
    let assembledTriggers = [];
    let gameplayTraits = levelData.levelGameplayTraitsData;
    let allTriggerInstructions = gameplayTraits.allLevelTriggers;

    let timestamp = TimestampGenie.getTimestamp();

    let hostedLevel = levelData.levelHeaderData.levelId;

    for (let triggerInstruction of allTriggerInstructions) {
      assembledTriggers.push(
        new TriggerEvent(triggerInstruction, hostedLevel, timestamp)
      );
    }

    return assembledTriggers;
  }
}
