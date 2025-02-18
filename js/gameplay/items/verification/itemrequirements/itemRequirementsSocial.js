/**
 * Class representing social-based item requirements.
 * This class encapsulates conditions based on the player's social interactions, such as friend counts,
 * recruitment of friends, challenges issued, event participation, guild membership and enrollment duration.
 * It enables the design of items that require players to engage with the game's community, making it integral
 * for balancing social gameplay incentives.
 *
 * @class ItemRequirementsSocial
 * @extends ItemRequirementCategory
 */
class ItemRequirementsSocial extends ItemRequirementCategory {
  /**
   * Constructs social requirements for an item.
   * @param {string} categoryName - Unique identifier for the social requirements category (default: "-item-category-placeholder").
   * @param {string} categoryDescription - Description for the social requirements (default: "-item-category-description-placeholder").
   * @param {number} minimumCurrentFriends - Minimum number of current friends.
   * @param {number} minimumFriendsRecruited - Minimum number of friends recruited into the game.
   * @param {number} minimumFriendsChallenged - Minimum number of friends challenged in gameplay.
   * @param {number} minimumEventsParticipatedIn - Minimum number of community events the player must participate in.
   * @param {number} minimumEventsWithRecognizedGlory - Minimum number of events where the player achieved recognition.
   * @param {boolean} mustBeInGuild - Flag indicating guild membership is required.
   * @param {number} minimumGuildEnrollmentDuration - Minimum duration (in days) required for guild membership.
   */
  constructor(
    categoryName = "-item-category-placeholder",
    categoryDescription = "-item-category-description-placeholder",
    minimumCurrentFriends,
    minimumFriendsRecruited,
    minimumFriendsChallenged,
    minimumEventsParticipatedIn,
    minimumEventsWithRecognizedGlory,
    mustBeInGuild,
    minimumGuildEnrollmentDuration
  ) {
    super(categoryName, categoryDescription);
    this.minimumCurrentFriends = minimumCurrentFriends;
    this.minimumFriendsRecruited = minimumFriendsRecruited;
    this.minimumFriendsChallenged = minimumFriendsChallenged;
    this.mustBeInGuild = mustBeInGuild;
    this.minimumGuildEnrollmentDuration = minimumGuildEnrollmentDuration;
    this.minimumEventsParticipatedIn = minimumEventsParticipatedIn;
    this.minimumEventsWithRecognizedGlory = minimumEventsWithRecognizedGlory;
  }
}
