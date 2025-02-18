/**
 * Class representing account-specific item requirements.
 * This extends the base ItemRequirementCategory to encapsulate conditions specifically related to player account attributes.
 * Such attributes include the account age, region, email verification status, two-factor authentication status,
 * and a flag for special occasions such as birthday weeks. These requirements enable complex validation
 * mechanics tailored to mobile game monetization and security.
 *
 * @class ItemRequirementsAccount
 * @extends ItemRequirementCategory
 */
class ItemRequirementsAccount extends ItemRequirementCategory {
  /**
   * Constructs account-specific requirements for an item.
   * @param {string} categoryName - Category identifier.
   * @param {string} categoryDescription - Brief description of the account requirement category.
   * @param {number} accountAgeInDays - Minimum age of the account in days.
   * @param {string} accountRegion - Required region or locale for the account.
   * @param {boolean} emailVerified - Flag indicating if email verification is mandatory.
   * @param {boolean} has2FAEnabled - Flag indicating if two-factor authentication is required.
   * @param {boolean} isBirthWeek - Flag specifying if the validation is applied during a birthday week.
   */
  constructor(
    categoryName,
    categoryDescription,
    accountAgeInDays,
    accountRegion,
    emailVerified,
    has2FAEnabled,
    isBirthWeek
  ) {
    super(categoryName, categoryDescription);
    this.accountAgeInDays = accountAgeInDays;
    this.accountRegion = accountRegion;
    this.emailVerified = emailVerified;
    this.has2FAEnabled = has2FAEnabled;
    this.isBirthWeek = isBirthWeek;
  }
}
