/**
 * Class representing a composite of specific item requirements.
 * This class aggregates multiple categorized requirement objects (basic, account, completion, premium, PvP, and social)
 * into a single structure for evaluating whether a given item usage or acquisition is valid.
 * It is part of an over-engineered validation system designed to be highly modular, future-proof, and versatile for a wide range of mobile game scenarios.
 *
 * @class SpecificItemRequirements
 */
class SpecificItemRequirements {
  /**
   * Constructs a composite of specific item requirements.
   * @param {string} itemName - The name or identifier of the item.
   * @param {ItemRequirementsBasic|null} basicRequirements - Basic player progression requirements.
   * @param {ItemRequirementsAccount|null} accountRequirements - Account-specific requirements.
   * @param {ItemRequirementsCompletion|null} completionRequirements - Progress and completion-based requirements.
   * @param {ItemRequirementsPremium|null} premiumStatusRequirements - Premium membership and spending requirements.
   * @param {ItemRequirementsPvP|null} pvpRequirements - PvP specific competitive requirements.
   * @param {ItemRequirementsSocial|null} socialRequirements - Social interaction based requirements.
   */
  constructor(
    itemName = "INVALID-ITEM",
    basicRequirements = null,
    accountRequirements = null,
    completionRequirements = null,
    premiumStatusRequirements = null,
    pvpRequirements = null,
    socialRequirements = null
  ) {
    this.itemName = itemName;
    this.basicRequirements = basicRequirements;
    this.accountRequirements = accountRequirements;
    this.completionRequirements = completionRequirements;
    this.premiumStatusRequirements = premiumStatusRequirements;
    this.pvpRequirements = pvpRequirements;
    this.socialRequirements = socialRequirements;
  }
}
