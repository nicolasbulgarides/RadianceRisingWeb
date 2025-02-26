/**
 * Data structure for tracking social interaction accomplishments.
 *
 * Designed for future social features, this tracks accomplishments related to
 * player interactions such as adding friends/enemies, social media engagement
 * (comments, likes, shares), declarations of war, hosting events, and other
 * social activities within the game community.
 */
class AccomplishmentSocialData {
  /**
   * Creates a new social accomplishment data instance
   * @param {string} socialAccomplishmentCategory - Primary classification of the social accomplishment
   * @param {string} socialAccomplishmentSubCategory - Secondary classification of the social accomplishment
   * @param {string} socialAccomplishmentNickName - User-friendly name for the social accomplishment
   * @param {string|number} socialAccomplishmentValue - Primary value associated with the social accomplishment
   * @param {number} socialAccomplishmentMagnitude - Numeric measure of the accomplishment's significance
   * @param {Array<string>} idsOfInvolvedFriends - IDs of friends involved in the social interaction
   * @param {Array<string>} idsOfInvolvedAllies - IDs of allies involved in the social interaction
   * @param {Array<string>} idsOfInvolvedEnemies - IDs of enemies involved in the social interaction
   * @param {Array<string>} idsOfInvolvedCommentators - IDs of commentators involved in the social interaction
   * @param {Object} otherRelevantData - Additional contextual information
   */
  constructor(
    socialAccomplishmentCategory,
    socialAccomplishmentSubCategory,
    socialAccomplishmentNickName,
    socialAccomplishmentValue,
    socialAccomplishmentMagnitude,
    idsOfInvolvedFriends,
    idsOfInvolvedAllies,
    idsOfInvolvedEnemies,
    idsOfInvolvedCommentators,
    otherRelevantData
  ) {
    this.socialAccomplishmentCategory = socialAccomplishmentCategory;
    this.socialAccomplishmentSubCategory = socialAccomplishmentSubCategory;
    this.socialAccomplishmentNickName = socialAccomplishmentNickName;
    this.socialAccomplishmentValue = socialAccomplishmentValue;
    this.socialAccomplishmentMagnitude = socialAccomplishmentMagnitude;
    this.idsOfInvolvedFriends = idsOfInvolvedFriends;
    this.idsOfInvolvedAllies = idsOfInvolvedAllies;
    this.idsOfInvolvedEnemies = idsOfInvolvedEnemies;
    this.idsOfInvolvedCommentators = idsOfInvolvedCommentators;
    this.otherRelevantData = otherRelevantData;
  }
}
