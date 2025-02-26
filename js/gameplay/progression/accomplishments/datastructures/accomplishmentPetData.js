/**
 * Data structure for tracking pet-related accomplishments.
 *
 * Tracks events related to pets such as acquisition, level-ups, ability learning,
 * status effects, and other significant pet milestones. This structure can be
 * extended for games with pet/companion systems.
 */
class AccomplishmentPetData {
  /**
   * Creates a new pet-related accomplishment data instance
   * @param {string} idOfPet - Unique identifier for the pet
   * @param {string} petName - Display name of the pet
   * @param {string} typeOfPetEvent - Type of pet-related event (e.g., "acquired", "levelUp", "abilityLearned")
   * @param {number} magnitudeOfPetEvent - Numeric measure of the event's significance
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    idOfPet,
    petName,
    typeOfPetEvent,
    magnitudeOfPetEvent,
    otherRelevantData
  ) {
    this.idOfPet = idOfPet;
    this.petName = petName;
    this.typeOfPetEvent = typeOfPetEvent;
    this.magnitudeOfPetEvent = magnitudeOfPetEvent;
    this.otherRelevantData = otherRelevantData;
  }
}
