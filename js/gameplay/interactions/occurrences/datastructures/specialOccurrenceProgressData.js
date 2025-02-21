class SpecialOccurrenceProgressData {
  // Constructor for managing progress-related data within an occurrence.
  constructor(
    levelIdOfProgress = null, // ID of the level associated with the progress.
    levelProgressData = null, // Data related to the level's progress.
    attainedAchievements = null, // Achievements attained during the occurrence.
    questIdOfProgress = null, // ID of the quest associated with the progress.
    questProgressData = null, // Data related to the quest's progress.
    taskIdOfProgress = null, // ID of the task associated with the progress.
    taskProgressData = null // Data related to the task's progress.
  ) {
    this.levelIdOfProgress = levelIdOfProgress;
    this.levelProgressData = levelProgressData;
    this.attainedAchievements = attainedAchievements;
    this.questIdOfProgress = questIdOfProgress;
    this.questProgressData = questProgressData;
    this.taskIdOfProgress = taskIdOfProgress;
    this.taskProgressData = taskProgressData;
  }
}
