/**
 * Emitter for progression-related accomplishments.
 *
 * This class provides presets for common progression accomplishments such as
 * level-ups, skill advancements, and progression milestones.
 */
class ProgressionEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      characterLevelUp: {
        category: "progression",
        subCategory: "level",
        metaData: {
          nickName: "Character Level Up",
          description: "Player's character has gained a level",
        },
        defaultData: {
          progressionType: "character",
          newLevel: 1,
          previousLevel: 0,
          isSignificantMilestone: false,
          unlockableFeatures: [],
          skillPointsGained: 1,
          attributePointsGained: 0,
          timeToReachLevel: 0,
        },
      },
      skillLevelUp: {
        category: "progression",
        subCategory: "skill",
        metaData: {
          nickName: "Skill Level Up",
          description: "Player has advanced a skill",
        },
        defaultData: {
          progressionType: "skill",
          skillName: "",
          skillCategory: "",
          newLevel: 1,
          previousLevel: 0,
          isSignificantMilestone: false,
          unlockableFeatures: [],
          skillPointsGained: 0,
          attributePointsGained: 0,
          timeToReachLevel: 0,
        },
      },
      prestigeLevel: {
        category: "progression",
        subCategory: "prestige",
        metaData: {
          nickName: "Prestige Level Achieved",
          description: "Player has reached a prestige level",
        },
        defaultData: {
          progressionType: "prestige",
          newLevel: 1,
          previousLevel: 0,
          isSignificantMilestone: true,
          unlockableFeatures: [],
          skillPointsGained: 5,
          attributePointsGained: 2,
          timeToReachLevel: 0,
        },
      },
      masteryAchieved: {
        category: "progression",
        subCategory: "mastery",
        metaData: {
          nickName: "Mastery Achieved",
          description: "Player has achieved mastery in a skill or area",
        },
        defaultData: {
          progressionType: "mastery",
          skillName: "",
          skillCategory: "",
          newLevel: 100,
          previousLevel: 99,
          isSignificantMilestone: true,
          unlockableFeatures: [],
          skillPointsGained: 10,
          attributePointsGained: 5,
          timeToReachLevel: 0,
        },
      },
      attributeIncrease: {
        category: "progression",
        subCategory: "attribute",
        metaData: {
          nickName: "Attribute Increase",
          description: "Player has increased a character attribute",
        },
        defaultData: {
          progressionType: "attribute",
          attributeName: "",
          attributeCategory: "",
          newLevel: 1,
          previousLevel: 0,
          isSignificantMilestone: false,
          unlockableFeatures: [],
          skillPointsGained: 0,
          attributePointsGained: 0,
          timeToReachLevel: 0,
        },
      },
    };

    return presets[presetName] || null;
  }
}
