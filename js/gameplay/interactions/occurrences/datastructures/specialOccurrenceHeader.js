class SpecialOccurrenceHeader {
  // Constructor for initializing the special occurrence header with essential properties.
  constructor(
    occurenceId, // Unique identifier for the occurrence.
    occurenceCategory, // Category of the occurrence (e.g., event, action).
    occurenceSubCategory, // Sub-category for more specific classification.
    occurenceTimestamp // Timestamp indicating when the occurrence happened.
  ) {
    this.occurenceId = occurenceId;
    this.occurenceCategory = occurenceCategory;
    this.occurenceSubCategory = occurenceSubCategory;
    this.occurenceTimestamp = occurenceTimestamp;
  }
}
