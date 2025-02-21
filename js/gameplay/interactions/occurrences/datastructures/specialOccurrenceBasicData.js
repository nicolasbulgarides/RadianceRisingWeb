class SpecialOccurrenceBasicData {
  // Constructor for managing basic data related to occurrences.
  constructor(
    wasFullyRefreshed = false, // Flag indicating if the occurrence was fully refreshed.
    healthPointsRefreshed = 0, // Health points refreshed during the occurrence.
    magicPointsRefreshed = 0, // Magic points refreshed during the occurrence.
    levelsGained = 0, // Levels gained during the occurrence.
    expGained = 0, // Experience gained during the occurrence.
    currencyGained = 0 // Currency gained during the occurrence.
  ) {
    this.wasFullyRefreshed = wasFullyRefreshed;
    this.healthPointsRefreshed = healthPointsRefreshed;
    this.magicPointsRefreshed = magicPointsRefreshed;
    this.levelsGained = levelsGained;
    this.expGained = expGained;
    this.currencyGained = currencyGained;
  }
}
