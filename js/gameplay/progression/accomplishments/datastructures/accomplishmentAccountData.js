/**
 * Data structure for tracking account-related accomplishments.
 * These include milestones such as email confirmation, enabling two-factor authentication,
 * account age milestones, playtime milestones, and login streak achievements.
 */
class AccomplishmentAccountData {
  /**
   * Creates a new account accomplishment data instance
   * @param {boolean} accountEmailJustConfirmed - Whether email was just confirmed
   * @param {boolean} accountTwoFactorJustEnabled - Whether two-factor authentication was just enabled
   * @param {number|null} accountNewAgeMilestone - New account age milestone reached (in days)
   * @param {number|null} totalHoursPlayedNewMilestone - New total playtime milestone reached (in hours)
   * @param {number|null} currentLoginStreakNewMilestone - New login streak milestone reached (in days)
   */
  constructor(
    accountEmailJustConfirmed,
    accountTwoFactorJustEnabled,
    accountNewAgeMilestone,
    totalHoursPlayedNewMilestone,
    currentLoginStreakNewMilestone
  ) {
    this.accountEmailJustConfirmed = accountEmailJustConfirmed;
    this.accountTwoFactorJustEnabled = accountTwoFactorJustEnabled;
    this.accountNewAgeMilestone = accountNewAgeMilestone;
    this.totalHoursPlayedNewMilestone = totalHoursPlayedNewMilestone;
    this.currentLoginStreakNewMilestone = currentLoginStreakNewMilestone;
  }
}
