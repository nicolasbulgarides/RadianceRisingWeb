class SpecialOccurrenceHeader {
  // Constructor for initializing the special occurrence header with essential properties.
  constructor(
    occurrenceId, // Unique identifier for the occurrence.
    occurrenceCategory, // Category of the occurrence (e.g., event, action).
    occurrenceSubCategory, // Sub-category for more specific classification.
    occurrenceTimestamp // Timestamp indicating when the occurrence happened.
  ) {
    this.occurrenceId = occurrenceId;
    this.occurrenceCategory = occurrenceCategory;
    this.occurrenceSubCategory = occurrenceSubCategory;
    this.occurrenceTimestamp = occurrenceTimestamp;
  }
}
