/**
 * Utility class for converting between different accomplishment data formats.
 *
 * This class provides methods for converting between emitter presets, data structures,
 * and composite objects, ensuring data consistency across the accomplishment system.
 */
class AccomplishmentConverter {
  /**
   * Converts a preset and custom data into a composite object.
   *
   * @param {Object} preset - The preset configuration
   * @param {Object} customData - Custom data to override preset defaults
   * @returns {AccomplishmentDataComposite} - The composite object
   */
  static presetToComposite(preset, customData = {}) {
    if (!preset) {
      console.error("Cannot convert null or undefined preset to composite");
      return null;
    }

    try {
      // Create header
      const header = {
        category: preset.category,
        subCategory: preset.subCategory,
        metaData: { ...preset.metaData },
      };

      // Merge data
      const mergedData = { ...preset.defaultData, ...customData };

      // Create the appropriate data structure based on category
      const composite = {
        accomplishmentHeader: header,
      };

      // Determine which data structure to use based on category
      switch (preset.category) {
        case "basicMilestone":
          composite.accomplishmentBasicMilestoneData = mergedData;
          break;
        case "area":
          composite.accomplishmentAreaData = mergedData;
          break;
        case "learned":
          composite.accomplishmentLearnedData = mergedData;
          break;
        case "quest":
          composite.accomplishmentQuestData = mergedData;
          break;
        case "achievement":
          composite.accomplishmentAchievementData = mergedData;
          break;
        case "event":
          composite.accomplishmentEventData = mergedData;
          break;
        case "acquiredObject":
          composite.accomplishmentAcquiredObjectData = mergedData;
          break;
        case "combat":
          composite.accomplishmentCombatData = mergedData;
          break;
        case "competitive":
          composite.accomplishmentCompetitiveData = mergedData;
          break;
        case "status":
          composite.accomplishmentStatusData = mergedData;
          break;
        case "social":
          composite.accomplishmentSocialData = mergedData;
          break;
        case "pet":
          composite.accomplishmentPetData = mergedData;
          break;
        case "account":
          composite.accomplishmentAccountData = mergedData;
          break;
        case "crafting":
          composite.accomplishmentCraftingData = mergedData;
          break;
        case "economy":
          composite.accomplishmentEconomyData = mergedData;
          break;
        case "exploration":
          composite.accomplishmentExplorationData = mergedData;
          break;
        case "progression":
          composite.accomplishmentProgressionData = mergedData;
          break;
        default:
          console.warn(
            `Unknown category: ${preset.category}, using technical data`
          );
          composite.accomplishmentTechnicalData = mergedData;
      }

      return composite;
    } catch (error) {
      console.error("Error converting preset to composite:", error);
      return null;
    }
  }

  /**
   * Extracts the relevant data from a composite based on its category.
   *
   * @param {AccomplishmentDataComposite} composite - The composite object
   * @returns {Object} - The extracted data
   */
  static extractDataFromComposite(composite) {
    if (!composite || !composite.accomplishmentHeader) {
      console.error("Invalid composite provided to extractDataFromComposite");
      return null;
    }

    const category = composite.accomplishmentHeader.category;

    // Map category to property name
    const categoryToProperty = {
      basicMilestone: "accomplishmentBasicMilestoneData",
      area: "accomplishmentAreaData",
      learned: "accomplishmentLearnedData",
      quest: "accomplishmentQuestData",
      achievement: "accomplishmentAchievementData",
      event: "accomplishmentEventData",
      acquiredObject: "accomplishmentAcquiredObjectData",
      combat: "accomplishmentCombatData",
      competitive: "accomplishmentCompetitiveData",
      status: "accomplishmentStatusData",
      social: "accomplishmentSocialData",
      pet: "accomplishmentPetData",
      account: "accomplishmentAccountData",
      crafting: "accomplishmentCraftingData",
      economy: "accomplishmentEconomyData",
      exploration: "accomplishmentExplorationData",
      progression: "accomplishmentProgressionData",
    };

    const propertyName =
      categoryToProperty[category] || "accomplishmentTechnicalData";
    return composite[propertyName];
  }

  /**
   * Creates a serializable representation of an accomplishment composite.
   *
   * @param {AccomplishmentDataComposite} composite - The composite to serialize
   * @returns {Object} - Serializable representation
   */
  static compositeToSerializable(composite) {
    if (!composite) {
      console.error(
        "Cannot convert null or undefined composite to serializable"
      );
      return null;
    }

    try {
      // Create a deep copy to avoid modifying the original
      return JSON.parse(JSON.stringify(composite));
    } catch (error) {
      console.error("Error converting composite to serializable:", error);
      return null;
    }
  }

  /**
   * Creates a composite from a serialized representation.
   *
   * @param {Object} serialized - The serialized representation
   * @returns {AccomplishmentDataComposite} - The composite object
   */
  static serializableToComposite(serialized) {
    if (!serialized) {
      console.error(
        "Cannot convert null or undefined serialized data to composite"
      );
      return null;
    }

    try {
      // Create a deep copy to avoid modifying the original
      return JSON.parse(JSON.stringify(serialized));
    } catch (error) {
      console.error("Error converting serialized data to composite:", error);
      return null;
    }
  }
}
