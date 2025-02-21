// Represents data related to progress in the game.
// This includes information on the progress category, name, and values.
class HistoryProgressData {
  constructor(
    progressCategory, // Category of the progress (e.g., "level", "achievement").
    progressName, // Name of the progress.
    progressDescription, // Description of the progress.
    progressInitialValue, // Initial value of the progress.
    progressEndingValue // Ending value of the progress.
  ) {
    // Initialize properties with provided values.
    this.progressCategory = progressCategory;
    this.progressName = progressName;
    this.progressDescription = progressDescription;
    this.progressInitialValue = progressInitialValue;
    this.progressEndingValue = progressEndingValue;
  }

  // Consider adding a method to calculate the progress delta.
  // calculateProgressDelta() {
  //   return this.progressEndingValue - this.progressInitialValue;
  // }
}
