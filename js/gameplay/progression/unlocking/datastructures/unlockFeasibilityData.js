/**
 * Class representing the feasibility data for unlock requirements.
 *
 * This class encapsulates capability requirements that determine whether a player
 * has the necessary tools, abilities, or items to feasibly access and complete
 * content.
 *
 * In Radiant Rays, these categories map to:
 * - Category A: Spells with specific uses
 * - Category B: Artifacts with specific uses
 * - Category C: Miscellaneous perks
 * - Category D: Special enhancements (auras, buffs from events/items/armor)
 *
 * @class UnlockFeasibilityData
 */
class UnlockFeasibilityData {
  /**
   * Constructs a new set of unlock feasibility data.
   *
   * @param {Array} capabilityCategoryA - First category of capabilities required (spells in Radiant Rays)
   * @param {Array} capabilityCategoryB - Second category of capabilities required (artifacts in Radiant Rays)
   * @param {Array} capabilityCategoryC - Third category of capabilities required (perks in Radiant Rays)
   * @param {Array} capabilityCategoryD - Fourth category of capabilities required (enhancements in Radiant Rays)
   * @param {number} playerLevelRequirement - The minimum player level required
   */
  constructor(
    capabilityCategoryA = [],
    capabilityCategoryB = [],
    capabilityCategoryC = [],
    capabilityCategoryD = [],
    playerLevelRequirement = 0
  ) {
    // First category of capabilities (spells in Radiant Rays)
    this.capabilityCategoryA = capabilityCategoryA;

    // Second category of capabilities (artifacts in Radiant Rays)
    this.capabilityCategoryB = capabilityCategoryB;

    // Third category of capabilities (perks in Radiant Rays)
    this.capabilityCategoryC = capabilityCategoryC;

    // Fourth category of capabilities (enhancements in Radiant Rays)
    this.capabilityCategoryD = capabilityCategoryD;

    // The minimum player level required
    this.playerLevelRequirement = playerLevelRequirement;
  }

  /**
   * Creates feasibility data with no special requirements.
   *
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockFeasibilityData} Basic feasibility data with just a level requirement
   */
  static createBasicLevelRequirement(playerLevel = 0) {
    return new UnlockFeasibilityData([], [], [], [], playerLevel);
  }

  /**
   * Creates feasibility data for spell-focused content.
   *
   * @param {Array} requiredSpells - Array of required spells
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockFeasibilityData} Spell-focused feasibility data
   */
  static createSpellFocusedRequirement(requiredSpells = [], playerLevel = 0) {
    return new UnlockFeasibilityData(requiredSpells, [], [], [], playerLevel);
  }

  /**
   * Creates feasibility data for artifact-focused content.
   *
   * @param {Array} requiredArtifacts - Array of required artifacts
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockFeasibilityData} Artifact-focused feasibility data
   */
  static createArtifactFocusedRequirement(
    requiredArtifacts = [],
    playerLevel = 0
  ) {
    return new UnlockFeasibilityData(
      [],
      requiredArtifacts,
      [],
      [],
      playerLevel
    );
  }

  /**
   * Creates feasibility data for content requiring specific perks.
   *
   * @param {Array} requiredPerks - Array of required perks
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockFeasibilityData} Perk-focused feasibility data
   */
  static createPerkFocusedRequirement(requiredPerks = [], playerLevel = 0) {
    return new UnlockFeasibilityData([], [], requiredPerks, [], playerLevel);
  }

  /**
   * Creates feasibility data for content requiring special enhancements.
   *
   * @param {Array} requiredEnhancements - Array of required enhancements
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockFeasibilityData} Enhancement-focused feasibility data
   */
  static createEnhancementFocusedRequirement(
    requiredEnhancements = [],
    playerLevel = 0
  ) {
    return new UnlockFeasibilityData(
      [],
      [],
      [],
      requiredEnhancements,
      playerLevel
    );
  }

  /**
   * Creates feasibility data for advanced content requiring multiple capability types.
   *
   * @param {Array} requiredSpells - Array of required spells
   * @param {Array} requiredArtifacts - Array of required artifacts
   * @param {Array} requiredPerks - Array of required perks
   * @param {Array} requiredEnhancements - Array of required enhancements
   * @param {number} playerLevel - The minimum player level required
   * @returns {UnlockFeasibilityData} Advanced feasibility data with multiple requirements
   */
  static createAdvancedRequirement(
    requiredSpells = [],
    requiredArtifacts = [],
    requiredPerks = [],
    requiredEnhancements = [],
    playerLevel = 10
  ) {
    return new UnlockFeasibilityData(
      requiredSpells,
      requiredArtifacts,
      requiredPerks,
      requiredEnhancements,
      playerLevel
    );
  }

  /**
   * Checks if this feasibility data is valid.
   *
   * @returns {boolean} True if the feasibility data is valid
   */
  isValid() {
    return this.playerLevelRequirement >= 0;
  }

  /**
   * Converts the feasibility data to a plain object for serialization.
   *
   * @returns {Object} A plain object representation of the feasibility data
   */
  toJSON() {
    return {
      capabilityCategoryA: this.capabilityCategoryA,
      capabilityCategoryB: this.capabilityCategoryB,
      capabilityCategoryC: this.capabilityCategoryC,
      capabilityCategoryD: this.capabilityCategoryD,
      playerLevelRequirement: this.playerLevelRequirement,
    };
  }

  /**
   * Creates an instance from a plain object (deserialization).
   *
   * @param {Object} data - The plain object to create an instance from
   * @returns {UnlockFeasibilityData} A new instance with the provided data
   */
  static fromJSON(data) {
    return new UnlockFeasibilityData(
      data.capabilityCategoryA,
      data.capabilityCategoryB,
      data.capabilityCategoryC,
      data.capabilityCategoryD,
      data.playerLevelRequirement
    );
  }

  /**
   * Creates a copy of this feasibility data.
   *
   * @returns {UnlockFeasibilityData} A new instance with the same properties
   */
  clone() {
    return new UnlockFeasibilityData(
      [...this.capabilityCategoryA],
      [...this.capabilityCategoryB],
      [...this.capabilityCategoryC],
      [...this.capabilityCategoryD],
      this.playerLevelRequirement
    );
  }
}
