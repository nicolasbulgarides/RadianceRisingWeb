class SpecialOccurrencePetData {
  // Constructor for managing pet-related data within an occurrence.
  constructor(
    generalIdOfRelevantPet = null, // General ID of the pet involved.
    uniqueIdOfRelevantPet = null, // Unique ID of the pet involved.
    expGainedByPet = 0, // Experience gained by the pet.
    levelsGainedByPet = 0, // Levels gained by the pet.
    healthPointsHealedByPet = 0, // Health points healed by the pet.
    abilityGainedByPet = null, // Ability gained by the pet.
    didPetFaint = false, // Flag indicating if the pet fainted.
    nameOfPetsNewFriend = null, // Name of the pet's new friend.
    generalIdOfPetsNewFriend = null, // General ID of the pet's new friend.
    uniqueIdOfPetsNewFriend = null, // Unique ID of the pet's new friend.
    nameOfPetsNewBaby = null, // Name of the pet's new baby.
    generalIdOfPetsNewBaby = null, // General ID of the pet's new baby.
    uniqueIdOfPetsNewBaby = null, // Unique ID of the pet's new baby.
    expGainedByPetsNewBaby = 0 // Experience gained by the pet's new baby.
  ) {
    this.generalIdOfRelevantPet = generalIdOfRelevantPet;
    this.uniqueIdOfRelevantPet = uniqueIdOfRelevantPet;
    this.expGainedByPet = expGainedByPet;
    this.levelsGainedByPet = levelsGainedByPet;
    this.healthPointsHealedByPet = healthPointsHealedByPet;
    this.abilityGainedByPet = abilityGainedByPet;
    this.didPetFaint = didPetFaint;
    this.nameOfPetsNewFriend = nameOfPetsNewFriend;
    this.generalIdOfPetsNewFriend = generalIdOfPetsNewFriend;
    this.uniqueIdOfPetsNewFriend = uniqueIdOfPetsNewFriend;
    this.nameOfPetsNewBaby = nameOfPetsNewBaby;
    this.generalIdOfPetsNewBaby = generalIdOfPetsNewBaby;
    this.uniqueIdOfPetsNewBaby = uniqueIdOfPetsNewBaby;
    this.expGainedByPetsNewBaby = expGainedByPetsNewBaby;
  }
}
