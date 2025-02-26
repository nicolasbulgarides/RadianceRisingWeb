// to do - review various kinds of occurences will exist, when they will exist / priority, and what those occurences will entail including useful archetypes

//does occurence need a corresponding data object for every kind of accomplishment? Is that an inherent necessity?

class SpecialOccurrenceComposite {
  // Constructor for managing a composite occurrence that aggregates various data classes.
  constructor(
    occurrenceHeader, // Header data for the occurrence.
    occurrenceBasicData, // Basic data related to the occurrence.
    occurrenceItemData, // Item data related to the occurrence.
    occurrenceProgressData, // Progress data related to the occurrence.
    occurrenceSpecialEventData, // Special event data related to the occurrence.
    occurrencePetData, // Pet data related to the occurrence.
    occurrenceHyperspecificOtherData // Additional hyperspecific data related to the occurrence.
  ) {
    this.occurrenceHeader = occurrenceHeader;
    this.occurrenceBasicData = occurrenceBasicData;
    this.occurrenceItemData = occurrenceItemData;
    this.occurrenceProgressData = occurrenceProgressData;
    this.occurrenceSpecialEventData = occurrenceSpecialEventData;
    this.occurrencePetData = occurrencePetData;
    this.occurrenceHyperspecificOtherData = occurrenceHyperspecificOtherData;
  }
}
