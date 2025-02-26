class UnlockSocialData {
  /**
   * @param {number} minimumFriendsActivityLevel - The minimum activity level of friends required.
   * @param {number} minimumFriendLifetimeRecruitmentCount - The minimum lifetime recruitment count of friends required.
   * @param {boolean} guildMembershipStatusRequired - Whether guild membership is required.
   * @param {number} guildMinimumSizeRequired - The minimum size of the guild required.
   * @param {number} guildBasicLevelRequired - The basic level of the guild required.
   * @param {number} guildEliteSpecialTierRequired - The elite special tier of the guild required.
   */
  constructor(
    minimumFriendsActivityLevel = 0,
    minimumFriendLifetimeRecruitmentCount = 0,
    guildMembershipStatusRequired = false,
    guildMinimumSizeRequired = 0,
    guildBasicLevelRequired = 0,
    guildEliteSpecialTierRequired = "-no-special-guild-tier-required-"
  ) {
    this.minimumFriendsActivityLevel = minimumFriendsActivityLevel;
    this.minimumFriendLifetimeRecruitmentCount =
      minimumFriendLifetimeRecruitmentCount;
    this.guildMembershipStatusRequired = guildMembershipStatusRequired;
    this.guildMinimumSizeRequired = guildMinimumSizeRequired;
    this.guildBasicLevelRequired = guildBasicLevelRequired;
    this.guildEliteSpecialTierRequired = guildEliteSpecialTierRequired;
  }
}
