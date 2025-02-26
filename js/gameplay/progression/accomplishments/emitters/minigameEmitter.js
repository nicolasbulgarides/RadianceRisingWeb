/**
 * Emitter for minigame-related accomplishments.
 *
 * This class provides presets for common minigame accomplishments such as
 * completing minigames, achieving high scores, speedruns, and special minigame challenges.
 */
class MinigameEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      minigameCompleted: {
        category: "minigame",
        subCategory: "completion",
        metaData: {
          nickName: "Minigame Completed",
          description: "Player has completed a minigame",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "standard",
          minigameDifficulty: "normal",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "standard",
          perfectCompletion: false,
        },
      },
      minigameHighScore: {
        category: "minigame",
        subCategory: "highscore",
        metaData: {
          nickName: "Minigame High Score",
          description: "Player has achieved a high score in a minigame",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "standard",
          minigameDifficulty: "normal",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "enhanced",
          previousHighScore: 0,
          isPersonalBest: true,
          isGlobalLeaderboard: false,
          leaderboardRank: 0,
        },
      },
      minigameSpeedrun: {
        category: "minigame",
        subCategory: "speedrun",
        metaData: {
          nickName: "Minigame Speedrun",
          description: "Player has completed a minigame in record time",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "speedrun",
          minigameDifficulty: "challenging",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "enhanced",
          previousBestTime: 0,
          isPersonalBest: true,
          isGlobalRecord: false,
          speedrunRank: 0,
        },
      },
      minigamePerfectScore: {
        category: "minigame",
        subCategory: "perfect",
        metaData: {
          nickName: "Minigame Perfect Score",
          description: "Player has achieved a perfect score in a minigame",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "standard",
          minigameDifficulty: "variable",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "premium",
          perfectCompletion: true,
          noMistakesMade: true,
          bonusObjectivesCompleted: true,
        },
      },
      minigameChallenge: {
        category: "minigame",
        subCategory: "challenge",
        metaData: {
          nickName: "Minigame Challenge",
          description: "Player has completed a special minigame challenge",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "challenge",
          minigameDifficulty: "hard",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "premium",
          challengeType: "",
          challengeRestrictions: [],
          challengeModifiers: [],
        },
      },
      puzzleSolved: {
        category: "minigame",
        subCategory: "puzzle",
        metaData: {
          nickName: "Puzzle Solved",
          description: "Player has solved a puzzle minigame",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "puzzle",
          minigameDifficulty: "variable",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "standard",
          puzzleType: "",
          hintsUsed: 0,
          solutionEfficiency: 100,
        },
      },
      minigameStreak: {
        category: "minigame",
        subCategory: "streak",
        metaData: {
          nickName: "Minigame Streak",
          description: "Player has achieved a winning streak in minigames",
        },
        defaultData: {
          minigameId: "",
          minigameName: "",
          minigameCategory: "streak",
          minigameDifficulty: "variable",
          completionTime: 0,
          score: 0,
          isFirstCompletion: false,
          attemptCount: 1,
          rewardTier: "enhanced",
          currentStreak: 3,
          previousBestStreak: 0,
          streakThreshold: 3,
          consecutiveGames: true,
        },
      },
    };

    return presets[presetName] || null;
  }
}
