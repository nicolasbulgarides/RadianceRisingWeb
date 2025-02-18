/**
 * PremiumRequirementsComposite
 * Composite class for premium-based unlock requirements.
 * Handles conditions involving overall premium status and additional premium sub-requirements.
 * Extends RequirementsGeneral.
 */
class PremiumRequirementsComposite extends RequirementsGeneral {
  /**
   * @param {boolean} generalPremiumStatusRequired - Indicates if a general premium status is required.
   * @param {Array} specificPremiumSubRequirements - List of additional premium sub-requirements.
   */
  constructor(generalPremiumStatusRequired, specificPremiumSubRequirements) {
    this.generalPremiumStatusRequired = generalPremiumStatusRequired;
    this.specificPremiumSubRequirements = specificPremiumSubRequirements;
  }
}
