/**
 * Emitter for pet-related accomplishments.
 *
 * This class provides presets for common pet accomplishments such as
 * acquiring pets, pet training, and pet achievements.
 */
class PetEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      petAcquired: {
        category: "pet",
        subCategory: "acquired",
        metaData: {
          nickName: "Pet Acquired",
          description: "Player has acquired a pet",
        },
        defaultData: {
          idOfPet: "",
          petName: "",
          typeOfPetEvent: "acquired",
          magnitudeOfPetEvent: 1,
          otherRelevantData: {
            petType: "",
            petRarity: "common",
          },
        },
      },
      petTrained: {
        category: "pet",
        subCategory: "trained",
        metaData: {
          nickName: "Pet Trained",
          description: "Player has trained a pet",
        },
        defaultData: {
          idOfPet: "",
          petName: "",
          typeOfPetEvent: "trained",
          magnitudeOfPetEvent: 1,
          otherRelevantData: {
            skillTrained: "",
            trainingLevel: 1,
          },
        },
      },
      petEvolved: {
        category: "pet",
        subCategory: "evolved",
        metaData: {
          nickName: "Pet Evolved",
          description: "Player's pet has evolved",
        },
        defaultData: {
          idOfPet: "",
          petName: "",
          typeOfPetEvent: "evolved",
          magnitudeOfPetEvent: 3,
          otherRelevantData: {
            previousForm: "",
            newForm: "",
          },
        },
      },
      rarePetAcquired: {
        category: "pet",
        subCategory: "rare-acquired",
        metaData: {
          nickName: "Rare Pet Acquired",
          description: "Player has acquired a rare pet",
        },
        defaultData: {
          idOfPet: "",
          petName: "",
          typeOfPetEvent: "acquired",
          magnitudeOfPetEvent: 3,
          otherRelevantData: {
            petType: "",
            petRarity: "rare",
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
