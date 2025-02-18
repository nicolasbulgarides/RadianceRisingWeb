/**
 * Base class representing a category of item requirements.
 * This class serves as a foundational template for specialized
 * item requirement classes (e.g. Account, Basic, Premium, PvP, Social, Completion).
 * It centralizes common properties such as the category name and description,
 * enabling future-proof and highly modular game item validation logic.
 *
 * @class ItemRequirementCategory
 */
class ItemRequirementCategory {
  /**
   * Create an item requirement category.
   * @param {string} categoryName - Unique identifier for the requirement category.
   * @param {string} categoryDescription - Detailed description providing context for the requirement category.
   */
  constructor(categoryName, categoryDescription) {
    this.categoryName = categoryName;
    this.categoryDescription = categoryDescription;
  }
}
