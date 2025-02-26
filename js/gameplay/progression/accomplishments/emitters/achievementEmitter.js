/**
 * Emitter for achievement-related accomplishments.
 *
 * This class provides presets for common achievement accomplishments such as
 * unlocking achievements, milestone achievements, and special achievements.
 */
class AchievementEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      achievementUnlocked: {
        category: "achievement",
        subCategory: "unlock",
        metaData: {
          nickName: "Achievement Unlocked",
          description: "Player has unlocked an achievement",
        },
        defaultData: {
          achievementId: "",
          nameOfAcheivement: "",
          achivementPointsValue: 10,
          achievementGroup: "general",
        },
      },
      rareAchievementUnlocked: {
        category: "achievement",
        subCategory: "rare-unlock",
        metaData: {
          nickName: "Rare Achievement Unlocked",
          description: "Player has unlocked a rare achievement",
        },
        defaultData: {
          achievementId: "",
          nameOfAcheivement: "",
          achivementPointsValue: 50,
          achievementGroup: "rare",
        },
      },
      achievementMilestone: {
        category: "achievement",
        subCategory: "milestone",
        metaData: {
          nickName: "Achievement Milestone",
          description: "Player has reached an achievement milestone",
        },
        defaultData: {
          achievementId: "",
          nameOfAcheivement: "",
          achivementPointsValue: 25,
          achievementGroup: "milestone",
        },
      },
      secretAchievementUnlocked: {
        category: "achievement",
        subCategory: "secret-unlock",
        metaData: {
          nickName: "Secret Achievement Unlocked",
          description: "Player has unlocked a secret achievement",
        },
        defaultData: {
          achievementId: "",
          nameOfAcheivement: "",
          achivementPointsValue: 100,
          achievementGroup: "secret",
        },
      },
    };

    return presets[presetName] || null;
  }
}
