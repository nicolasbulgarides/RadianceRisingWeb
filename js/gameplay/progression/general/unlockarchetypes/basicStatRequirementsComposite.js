/**
 * BasicStatusRequirementsComposite
 * Composite class for basic status (stat)-based unlock requirements.
 * Includes key parameters such as player level, magic level, health, and magic points necessary for unlocking.
 * Extends RequirementsGeneral.
 */
class BasicStatusRequirementsComposite extends RequirementsGeneral {
  /**
   * @param {number} minLevel - Minimum player level required.
   * @param {number} minMagicLevel - Minimum magic level required.
   * @param {number} mininumBaseHealth - Minimum base health required.
   * @param {number} mininumBaseMagicPoints - Minimum base magic points required.
   * @param {number} minimumCurrentHealthPoints - Minimum current health points required.
   * @param {number} minimumCurrentMagicPointsPoints - Minimum current magic points required.
   */
  constructor(
    minLevel,
    minMagicLevel,
    mininumBaseHealth,
    mininumBaseMagicPoints,
    minimumCurrentHealthPoints,
    minimumCurrentMagicPointsPoints
  ) {
    this.minLevel = minLevel;
    this.minMagicLevel = minMagicLevel;
    this.minHealth = minHealth;
    this.minMagicPoints = minMagicPoints;
    this.minHealthPoints = minHealthPoints;
  }
}
