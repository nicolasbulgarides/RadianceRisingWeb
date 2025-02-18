/**
 * Class representing basic item requirements applying to core player progression.
 * This includes validations for minimum required level, tutorial completion, and ensuring the player is not a guest.
 * It leverages default placeholders for category name and description which can be overridden.
 *
 * @class ItemRequirementsBasic
 * @extends ItemRequirementCategory
 */
class ItemRequirementsBasic extends ItemRequirementCategory {
  /**
   * Constructs basic requirements for an item.
   * @param {string} categoryName - Unique identifier for the basic requirements category (default: "-item-category-placeholder").
   * @param {string} categoryDescription - Brief description for the basic requirements (default: "-item-category-description-placeholder").
   * @param {number} minimumLevel - Minimum player level required.
   * @param {boolean} requiresTutorialCompletion - Indicates if the player must have completed the tutorial.
   * @param {boolean} requiresNotAGuestPlayer - Boolean check to ensure the player is not using a guest account.
   */
  constructor(
    categoryName = "-item-category-placeholder",
    categoryDescription = "-item-category-description-placeholder",
    minimumLevel,
    requiresTutorialCompletion = false,
    requiresNotAGuestPlayer = false
  ) {
    super(categoryName, categoryDescription);

    this.minimumLevel = minimumLevel;
    this.requiresTutorialCompletion = requiresTutorialCompletion;
    this.requiresNotAGuestPlayer = requiresNotAGuestPlayer;
  }
}
