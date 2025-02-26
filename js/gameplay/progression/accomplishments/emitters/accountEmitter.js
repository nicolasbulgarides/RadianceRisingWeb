/**
 * Emitter for account-related accomplishments.
 *
 * This class provides presets for common account accomplishments such as
 * account milestones, security enhancements, and playtime achievements.
 */
class AccountEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      emailConfirmed: {
        category: "account",
        subCategory: "email",
        metaData: {
          nickName: "Email Confirmed",
          description: "Player has confirmed their email address",
        },
        defaultData: {
          accountEmailJustConfirmed: true,
          accountTwoFactorJustEnabled: false,
          accountNewAgeMilestone: 0,
          totalHoursPlayedNewMilestone: 0,
          currentLoginStreakNewMilestone: 0,
        },
      },
      twoFactorEnabled: {
        category: "account",
        subCategory: "security",
        metaData: {
          nickName: "Two-Factor Authentication Enabled",
          description: "Player has enabled two-factor authentication",
        },
        defaultData: {
          accountEmailJustConfirmed: false,
          accountTwoFactorJustEnabled: true,
          accountNewAgeMilestone: 0,
          totalHoursPlayedNewMilestone: 0,
          currentLoginStreakNewMilestone: 0,
        },
      },
      accountAgeMilestone: {
        category: "account",
        subCategory: "age",
        metaData: {
          nickName: "Account Age Milestone",
          description: "Player's account has reached an age milestone",
        },
        defaultData: {
          accountEmailJustConfirmed: false,
          accountTwoFactorJustEnabled: false,
          accountNewAgeMilestone: 30, // Default 30 days
          totalHoursPlayedNewMilestone: 0,
          currentLoginStreakNewMilestone: 0,
        },
      },
      playtimeMilestone: {
        category: "account",
        subCategory: "playtime",
        metaData: {
          nickName: "Playtime Milestone",
          description: "Player has reached a playtime milestone",
        },
        defaultData: {
          accountEmailJustConfirmed: false,
          accountTwoFactorJustEnabled: false,
          accountNewAgeMilestone: 0,
          totalHoursPlayedNewMilestone: 10, // Default 10 hours
          currentLoginStreakNewMilestone: 0,
        },
      },
      loginStreakMilestone: {
        category: "account",
        subCategory: "login-streak",
        metaData: {
          nickName: "Login Streak Milestone",
          description: "Player has achieved a login streak milestone",
        },
        defaultData: {
          accountEmailJustConfirmed: false,
          accountTwoFactorJustEnabled: false,
          accountNewAgeMilestone: 0,
          totalHoursPlayedNewMilestone: 0,
          currentLoginStreakNewMilestone: 7, // Default 7 days
        },
      },
    };

    return presets[presetName] || null;
  }
}
