/**
 * UnlockAccountData
 * Contains specific requirements related to account characteristics such as account age, login recency, playtime duration, friend list size, recruitment count,
 * guild membership, and account difficulty settings needed for unlocking content.
 */
class UnlockAccountData {
  /**
   * @param {number} minimumAccountAgeInDays - Minimum account age (in days) required.
   * @param {number} maximumDaysSinceLastLogin - Maximum allowed days since the last login.
   * @param {number} minimumHoursPlaytime - Minimum required playtime in hours.
   * @param {number} accountDifficultySettings - Difficulty or level-specific settings for the account.
   */
  constructor(
    minimumAccountAgeInDays = 0,
    maximumDaysSinceLastLogin = 0,
    minimumHoursPlaytime = 0,
    accountDifficultySettings = 0
  ) {
    this.minimumAccountAgeInDays = minimumAccountAgeInDays;
    this.maximumDaysSinceLastLogin = maximumDaysSinceLastLogin;
    this.minimumHoursPlaytime = minimumHoursPlaytime;
    this.accountDifficultySettings = accountDifficultySettings;
  }
}
