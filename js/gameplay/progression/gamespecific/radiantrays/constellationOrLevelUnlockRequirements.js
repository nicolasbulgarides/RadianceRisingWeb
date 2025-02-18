/**
 * Class representing unlock requirements for either a game level or a constellation.
 *
 * This module defines the criteria needed to unlock specific game content. The unlock
 * requirements may include minimum player level, required spells or artifacts, premium
 * conditions, achievement-related criteria, constellation-based conditions, and additional
 * special requirements.
 *
 * Example usage:

 *   const unlockReq = new ConstellationOrLevelUnlockRequirements(
 *     "level",
 *     "MysticLevel",
 *     10,
 *     ["fireSpell", "waterSpell"],
 *     ["ancientArtifact"],
 *     ["premiumSubscription"],
 *     ["firstBlood"],
 *     100,
 *     "orion",
 *     ["specialEvent"]
 *   );
 *
 * @class ConstellationOrLevelUnlockRequirements
 */
class ConstellationOrLevelUnlockRequirements extends AreaUnlockRequirements {
  /**
   * Construct a set of unlock requirements for a level or constellation.
   *
   * @param {string} levelOrConstellation - Identifier indicating the target type ("level", "constellation", etc.). Default: "neither-level-nor-constellation".
   * @param {string} levelOrConstellationName - The name of the level or constellation to be unlocked. Default: "-invalid-constellation-or-level".


   * @param {number} levelRequirement - The minimum player level required to unlock. Default: -1.
   * @param {Array} specificSpellRequirements - Array of spell identifiers required for unlocking. Default: [].
   * @param {Array} specificArtifactRequirements - Array of artifact identifiers required for unlocking. Default: [].
   * @param {Array} premiumRequirements - Array of premium conditions (e.g., subscriptions) required for unlocking. Default: [].
   * @param {Array} specificAchievementRequirement - Array of achievement identifiers required for unlocking. Default: [].
   * @param {number} totalAchievementPointsRequirement - Total achievement points required. Default: 0.
   * @param {string} specificConstellationRequirement - Specific constellation condition required (for thematic events, etc.). Default: "none".
   * @param {Array} otherSpecialRequirements - Array of any additional special requirements. Default: [].
   */
  constructor(
    levelOrConstellation = "neither-level-nor-constellation",
    levelOrConstellationName = "-invalid-constellation-or-level",
    levelRequirement = -1,
    specificSpellRequirements = [],
    specificArtifactRequirements = [],
    premiumRequirements = [],
    specificAchievementRequirement = [],

    totalAchievementPointsRequirement = 0,
    specificConstellationRequirement = "none",
    otherSpecialRequirements = []
  ) {
    // Indicates if the unlock applies to a level or a constellation.
    this.levelOrConstellation = levelOrConstellation;

    // Provides a human-readable name for the level or constellation.
    this.levelOrConstellationName = levelOrConstellationName;

    // Specifies the minimum required level for unlocking.
    this.levelRequirement = levelRequirement;

    // A set of spells that must be available or learned.
    this.specificSpellRequirements = specificSpellRequirements;

    // A collection of artifact identifiers necessary for unlocking.
    this.specificArtifactRequirements = specificArtifactRequirements;

    // Conditions related to premium access or subscriptions.
    this.premiumRequirements = premiumRequirements;

    // Achievement identifiers that may be required as part of unlock conditions.
    this.specificAchievementRequirement = specificAchievementRequirement;

    // The total achievement points a player must accumulate.
    this.totalAchievementPointsRequirement = totalAchievementPointsRequirement;

    // A specific constellation or themed requirement for unlocking.
    this.specificConstellationRequirement = specificConstellationRequirement;

    // Additional special requirements that don't fall into the above categories.
    this.otherSpecialRequirements = otherSpecialRequirements;
  }
}
