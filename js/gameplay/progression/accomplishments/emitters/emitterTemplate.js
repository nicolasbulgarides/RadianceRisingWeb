/**
 * Template for creating new accomplishment emitters.
 *
 * This template provides a starting point for creating new emitters.
 * Copy this file and customize it for each accomplishment category.
 */
class EmitterTemplate extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      examplePreset1: {
        category: "categoryName",
        subCategory: "subCategoryName",
        metaData: {
          nickName: "Example Preset 1",
          description: "Description of the preset",
        },
        defaultData: {
          // Add default data fields specific to this category
          field1: "",
          field2: 0,
          field3: [],
          otherRelevantData: {},
        },
      },
      examplePreset2: {
        category: "categoryName",
        subCategory: "anotherSubCategory",
        metaData: {
          nickName: "Example Preset 2",
          description: "Description of the preset",
        },
        defaultData: {
          // Add default data fields specific to this category
          field1: "",
          field2: 0,
          field3: [],
          otherRelevantData: {
            additionalField1: "",
            additionalField2: 0,
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
