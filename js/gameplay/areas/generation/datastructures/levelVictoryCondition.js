class LevelVictoryCondition {
  constructor(
    matchingLevelId,
    victoryConditionNickname,
    victoryConditionDescription,
    allLevelObjectives
  ) {
    this.matchingLevelId = matchingLevelId;
    this.victoryConditionNickname = victoryConditionNickname;
    this.victoryConditionDescription = victoryConditionDescription;
    this.allLevelObjectives = allLevelObjectives;
  }

  checkIfLevelEventSatisfiesAnyObjectives(levelEvent) {
    //to do - check if the level event has completed any of the objectives

    let objectivesNewlySatisfied = [];
    this.allLevelObjectives.forEach((objective) => {
      if (
        this.checkIfObjectiveAndLevelEventMatchCategory(objective, levelEvent)
      ) {
        let objectiveSatisfied = this.checkIfEventSatisfiesObjectiveValue(
          objective,
          levelEvent
        );

        if (objectiveSatisfied) {
          objectivesNewlySatisfied.push(objective);
        }
      }
    });
    return objectivesNewlySatisfied;
  }

  checkIfAllObjectivesCompleted() {
    if (this.allLevelObjectives.length >= 1) {
      return this.allLevelObjectives.every(
        (objective) => objective.isCompleted
      );
    } else {
      // to do update logging
      console.log("No objectives found for level");
      return false;
    }
  }

  static checkIfObjectiveAndLevelEventMatchCategory(objective, event) {
    return objective.objectiveCategory === event.levelEventCategory;
  }

  static checkIfEventSatisfiesObjectiveValue(objective, event) {
    //to do - add more complex satisfaction logic to allow for more complex objectives

    return true;
  }
}
