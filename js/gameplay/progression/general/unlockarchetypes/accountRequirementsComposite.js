/**
 * AccountRequirementsComposite
 * Composite class for account-related unlock requirements.
 * Conditions include account age, login recency, playtime duration, friend list size, recruitment count,
 * guild membership, and account difficulty settings needed for unlocking content.
 * Extends RequirementsGeneral.
 */
class AccountRequirementsComposite extends RequirementsGeneral {
  /**
   * @param {number} minimumAccountAgeInDays - Minimum account age (in days) required.
   * @param {number} maximumDaysSinceLastLogin - Maximum allowed days since the last login.
   * @param {number} minimumHoursPlaytime - Minimum required playtime in hours.
   * @param {number} minimumFriendsListSize - Minimum number of friends required.
   * @param {number} minimumRecruitmentCount - Minimum recruitment count required.
   * @param {boolean} guildMembershipStatus - Whether guild membership is needed.
   * @param {number} accountDifficultySettings - Difficulty or level-specific settings for the account.
   */
  constructor(
    minimumAccountAgeInDays = 0,
    maximumDaysSinceLastLogin = 0,
    minimumHoursPlaytime = 0,
    minimumFriendsListSize = 0,
    minimumRecruitmentCount = 0,
    guildMembershipStatus = false,
    accountDifficultySettings = 0
  ) {
    this.minimumAccountAgeInDays = minimumAccountAgeInDays;
    this.maximumDaysSinceLastLogin = maximumDaysSinceLastLogin;
    this.minimumHoursPlaytime = minimumHoursPlaytime;
    this.minimumFriendsListSize = minimumFriendsListSize;
    this.minimumRecruitmentCount = minimumRecruitmentCount;
    this.guildMembershipStatus = guildMembershipStatus;
    this.accountDifficultySettings = accountDifficultySettings;
  }
}
