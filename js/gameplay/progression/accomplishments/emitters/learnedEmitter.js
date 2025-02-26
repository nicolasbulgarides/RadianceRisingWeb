/**
 * Emitter for learned-related accomplishments.
 *
 * This class provides presets for common learning accomplishments such as
 * learning capabilities, discovering lore, and mastering skills.
 */
class LearnedEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      capabilityLearned: {
        category: "learned",
        subCategory: "capability",
        metaData: {
          nickName: "Capability Learned",
          description: "Player has learned a new capability",
        },
        defaultData: {
          idOfLearnedThing: "",
          wasACapabilityLearned: true,
          capabilityCategory: "",
          wasALoreFactLearned: false,
          loreFactCategory: "",
          possiblyRelevantValue: 1,
        },
      },
      loreDiscovered: {
        category: "learned",
        subCategory: "lore",
        metaData: {
          nickName: "Lore Discovered",
          description: "Player has discovered a piece of lore",
        },
        defaultData: {
          idOfLearnedThing: "",
          wasACapabilityLearned: false,
          capabilityCategory: "",
          wasALoreFactLearned: true,
          loreFactCategory: "",
          possiblyRelevantValue: 1,
        },
      },
      skillMastered: {
        category: "learned",
        subCategory: "mastery",
        metaData: {
          nickName: "Skill Mastered",
          description: "Player has mastered a skill",
        },
        defaultData: {
          idOfLearnedThing: "",
          wasACapabilityLearned: true,
          capabilityCategory: "mastery",
          wasALoreFactLearned: false,
          loreFactCategory: "",
          possiblyRelevantValue: 100,
        },
      },
      secretKnowledge: {
        category: "learned",
        subCategory: "secret",
        metaData: {
          nickName: "Secret Knowledge",
          description: "Player has discovered secret knowledge",
        },
        defaultData: {
          idOfLearnedThing: "",
          wasACapabilityLearned: false,
          capabilityCategory: "",
          wasALoreFactLearned: true,
          loreFactCategory: "secret",
          possiblyRelevantValue: 5,
        },
      },
    };

    return presets[presetName] || null;
  }
}
