class LevelObjective {
  constructor(
    objectiveId = "-no-objective-id",
    objectiveNickname = "-no-objective-nickname",
    objectiveDescription = "-no-objective-description",
    objectiveCategory = "-no-objective-category",
    objectiveValue = "-no-objective-value",
    earnsFullVictory = false,
    specialTriggerId = "-no-special-trigger-id"
  ) {
    this.objectiveId = objectiveId;
    this.objectiveNickname = objectiveNickname;
    this.objectiveDescription = objectiveDescription;
    this.objectiveCategory = objectiveCategory;
    this.objectiveValue = objectiveValue;
    this.earnsFullVictory = earnsFullVictory;
    this.specialTriggerId = specialTriggerId;
    this.isCompleted = false;
  }

  markObjectiveAsCompleted() {
    this.isCompleted = true;
  }

  resetObjectiveToIncomplete() {
    this.isCompleted = false;
  }
}
