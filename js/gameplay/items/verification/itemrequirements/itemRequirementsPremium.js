/**
 * Class representing premium-specific item requirements.
 * This class details checks primarily designed for premium-related attributes,
 * such as financial spending, premium membership status, and accrued premium days.
 * It supports both current premium activity validations as well as historical premium status confirmations.
 *
 * @class ItemRequirementsPremium
 * @extends ItemRequirementCategory
 */
class ItemRequirementsPremium extends ItemRequirementCategory {
  /**
   * Constructs premium-specific item requirements.
   * @param {string} categoryName - Identifier for the premium requirements category.
   * @param {string} categoryDescription - Description detailing the premium requirements.
   * @param {boolean} requiresHasSpentMoney - Whether the player must have spent money.
   * @param {number} minimumSpentThresholdInCurrencyStandard - Minimum spending threshold required.
   * @param {boolean} requiresActivePremium - Indicates if an active premium subscription is necessary.
   * @param {boolean} requiresFormerPremium - Indicates if having been a premium user in the past is required.
   * @param {number} minimumTotalDaysAsPremium - Minimum number of days as a premium member required.
   * @param {number} totalDaysAsPremium - Total number of days the player has been premium.
   */
  constructor(
    categoryName,
    categoryDescription,
    requiresHasSpentMoney = false,
    minimumSpentThresholdInCurrencyStandard = 0,
    requiresActivePremium = false,
    requiresFormerPremium = false,
    minimumTotalDaysAsPremium = 0,
    totalDaysAsPremium = 0
  ) {
    super(categoryName, categoryDescription);
    this.requiresHasSpentMoney = requiresHasSpentMoney;
    this.minimumSpentThresholdInCurrencyStandard =
      minimumSpentThresholdInCurrencyStandard;
    this.requiresActivePremium = requiresActivePremium;
    this.requiresFormerPremium = requiresFormerPremium;
    this.minimumTotalDaysAsPremium = minimumTotalDaysAsPremium;
    this.totalDaysAsPremium = totalDaysAsPremium;
  }
}
