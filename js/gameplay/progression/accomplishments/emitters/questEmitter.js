/**
 * Emitter for quest-related accomplishments.
 *
 * This class provides presets for common quest accomplishments such as
 * quest completion, quest chains, and special quest achievements.
 */
class QuestEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      questCompleted: {
        category: "quest",
        subCategory: "completion",
        metaData: {
          nickName: "Quest Completed",
          description: "Player has completed a quest",
        },
        defaultData: {
          questId: "",
          questName: "",
          questCategory: "standard",
          questDifficulty: "normal",
          questCompletionTime: 0,
          questRewardTier: "standard",
          isQuestChainCompleted: false,
          isHiddenQuest: false,
          isTimeLimitedQuest: false,
        },
      },
      questChainCompleted: {
        category: "quest",
        subCategory: "chain",
        metaData: {
          nickName: "Quest Chain Completed",
          description: "Player has completed a chain of related quests",
        },
        defaultData: {
          questId: "",
          questName: "",
          questCategory: "chain",
          questDifficulty: "normal",
          questCompletionTime: 0,
          questRewardTier: "enhanced",
          isQuestChainCompleted: true,
          isHiddenQuest: false,
          isTimeLimitedQuest: false,
        },
      },
      hiddenQuestDiscovered: {
        category: "quest",
        subCategory: "hidden",
        metaData: {
          nickName: "Hidden Quest Discovered",
          description: "Player has discovered a hidden quest",
        },
        defaultData: {
          questId: "",
          questName: "",
          questCategory: "hidden",
          questDifficulty: "challenging",
          questCompletionTime: 0,
          questRewardTier: "special",
          isQuestChainCompleted: false,
          isHiddenQuest: true,
          isTimeLimitedQuest: false,
        },
      },
      timeLimitedQuestCompleted: {
        category: "quest",
        subCategory: "time-limited",
        metaData: {
          nickName: "Time-Limited Quest Completed",
          description: "Player has completed a time-limited quest",
        },
        defaultData: {
          questId: "",
          questName: "",
          questCategory: "time-limited",
          questDifficulty: "variable",
          questCompletionTime: 0,
          questRewardTier: "enhanced",
          isQuestChainCompleted: false,
          isHiddenQuest: false,
          isTimeLimitedQuest: true,
        },
      },
      legendaryQuestCompleted: {
        category: "quest",
        subCategory: "legendary",
        metaData: {
          nickName: "Legendary Quest Completed",
          description: "Player has completed a legendary difficulty quest",
        },
        defaultData: {
          questId: "",
          questName: "",
          questCategory: "legendary",
          questDifficulty: "legendary",
          questCompletionTime: 0,
          questRewardTier: "legendary",
          isQuestChainCompleted: false,
          isHiddenQuest: false,
          isTimeLimitedQuest: false,
        },
      },
    };

    return presets[presetName] || null;
  }
}
