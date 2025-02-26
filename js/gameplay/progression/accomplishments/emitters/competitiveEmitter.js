/**
 * Emitter for competitive accomplishments.
 *
 * This class provides presets for common competitive accomplishments such as
 * winning competitions, achieving rankings, and tournament participation.
 */
class CompetitiveEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      competitionWon: {
        category: "competitive",
        subCategory: "victory",
        metaData: {
          nickName: "Competition Won",
          description: "Player has won a competition",
        },
        defaultData: {
          competitionCategory: "general",
          competitionSubCategory: "",
          competitionNickName: "",
          publicProfileIdOfAllies: [],
          publicProfileIdOfCompetitors: [],
          competitionOutcome: "victory",
          competitionOutcomeMagnitude: 1,
          otherRelevantData: {},
        },
      },
      rankingAchieved: {
        category: "competitive",
        subCategory: "ranking",
        metaData: {
          nickName: "Ranking Achieved",
          description: "Player has achieved a ranking in a competition",
        },
        defaultData: {
          competitionCategory: "ranking",
          competitionSubCategory: "",
          competitionNickName: "",
          publicProfileIdOfAllies: [],
          publicProfileIdOfCompetitors: [],
          competitionOutcome: "ranked",
          competitionOutcomeMagnitude: 1,
          otherRelevantData: {
            rankAchieved: 0,
            totalParticipants: 0,
          },
        },
      },
      tournamentParticipation: {
        category: "competitive",
        subCategory: "tournament",
        metaData: {
          nickName: "Tournament Participation",
          description: "Player has participated in a tournament",
        },
        defaultData: {
          competitionCategory: "tournament",
          competitionSubCategory: "participation",
          competitionNickName: "",
          publicProfileIdOfAllies: [],
          publicProfileIdOfCompetitors: [],
          competitionOutcome: "participation",
          competitionOutcomeMagnitude: 1,
          otherRelevantData: {
            tournamentRound: 0,
            tournamentTotalRounds: 0,
          },
        },
      },
      teamVictory: {
        category: "competitive",
        subCategory: "team",
        metaData: {
          nickName: "Team Victory",
          description: "Player's team has won a competition",
        },
        defaultData: {
          competitionCategory: "team",
          competitionSubCategory: "victory",
          competitionNickName: "",
          publicProfileIdOfAllies: [],
          publicProfileIdOfCompetitors: [],
          competitionOutcome: "team-victory",
          competitionOutcomeMagnitude: 2,
          otherRelevantData: {
            teamName: "",
            teamSize: 0,
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
