/**
 * Class for validating unlock requirements for specific content, features, items, areas, levels, or any other game elements.
 *
 *
 *  To do - build out premium unlock validation as well as more sophisticated unlock validation
 */
class UnlockValidator {
  static validateUnlockRequirementsWereMet(
    accomplishmentToEvaluate,
    requirementToEvaluate
  ) {
    let satisfiedUnlockRequirements = false;

    // to do - build out the logic for this

    return satisfiedUnlockRequirements;
  }

  static validateUnlockDeveloperOverride(
    accomplishmentToEvaluate,
    requirementToEvaluate,
    doDeveloperOverride = false
  ) {
    if (doDeveloperOverride) {
      return true;
    } else {
      return UnlockValidator.validateUnlockRequirementsWereMet(
        accomplishmentToEvaluate,
        requirementToEvaluate
      );
    }
  }

  static validatePremiumRequirementsPriorTransactions(
    playerAccount,
    successfulTransactionEvent,
    premiumUnlockRequirements
  ) {
    return Config.AUTHORIZE_ALL_PREMIUM_UNLOCKS;
  }

  static validatePremiumRequirementsNewTransactions(
    playerAccount,
    successfulTransactionEvent,
    premiumUnlockRequirements
  ) {
    // to do later on
    return Config.AUTHORIZE_ALL_PREMIUM_UNLOCKS;
  }
}
