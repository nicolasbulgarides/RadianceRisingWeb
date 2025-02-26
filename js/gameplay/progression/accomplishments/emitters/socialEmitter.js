/**
 * Emitter for social-related accomplishments.
 *
 * This class provides presets for common social accomplishments such as
 * making friends, joining groups, and social interactions.
 */
class SocialEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      friendshipFormed: {
        category: "social",
        subCategory: "friendship",
        metaData: {
          nickName: "Friendship Formed",
          description: "Player has formed a friendship with another character",
        },
        defaultData: {
          socialAccomplishmentCategory: "friendship",
          socialAccomplishmentSubCategory: "formed",
          socialAccomplishmentNickName: "",
          socialAccomplishmentValue: 1,
          socialAccomplishmentMagnitude: 1,
          idsOfInvolvedFriends: [],
          idsOfInvolvedAllies: [],
          idsOfInvolvedEnemies: [],
          idsOfInvolvedCommentators: [],
          otherRelevantData: {},
        },
      },
      groupJoined: {
        category: "social",
        subCategory: "group",
        metaData: {
          nickName: "Group Joined",
          description: "Player has joined a group or faction",
        },
        defaultData: {
          socialAccomplishmentCategory: "group",
          socialAccomplishmentSubCategory: "joined",
          socialAccomplishmentNickName: "",
          socialAccomplishmentValue: 1,
          socialAccomplishmentMagnitude: 2,
          idsOfInvolvedFriends: [],
          idsOfInvolvedAllies: [],
          idsOfInvolvedEnemies: [],
          idsOfInvolvedCommentators: [],
          otherRelevantData: {
            groupId: "",
            groupName: "",
          },
        },
      },
      allianceFormed: {
        category: "social",
        subCategory: "alliance",
        metaData: {
          nickName: "Alliance Formed",
          description: "Player has formed an alliance",
        },
        defaultData: {
          socialAccomplishmentCategory: "alliance",
          socialAccomplishmentSubCategory: "formed",
          socialAccomplishmentNickName: "",
          socialAccomplishmentValue: 1,
          socialAccomplishmentMagnitude: 2,
          idsOfInvolvedFriends: [],
          idsOfInvolvedAllies: [],
          idsOfInvolvedEnemies: [],
          idsOfInvolvedCommentators: [],
          otherRelevantData: {
            allianceType: "",
            allianceDuration: "",
          },
        },
      },
      socialInteraction: {
        category: "social",
        subCategory: "interaction",
        metaData: {
          nickName: "Social Interaction",
          description: "Player has engaged in a significant social interaction",
        },
        defaultData: {
          socialAccomplishmentCategory: "interaction",
          socialAccomplishmentSubCategory: "",
          socialAccomplishmentNickName: "",
          socialAccomplishmentValue: 1,
          socialAccomplishmentMagnitude: 1,
          idsOfInvolvedFriends: [],
          idsOfInvolvedAllies: [],
          idsOfInvolvedEnemies: [],
          idsOfInvolvedCommentators: [],
          otherRelevantData: {
            interactionType: "",
            interactionOutcome: "",
          },
        },
      },
    };

    return presets[presetName] || null;
  }
}
