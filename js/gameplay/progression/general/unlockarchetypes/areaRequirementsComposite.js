/**
 * AreaRequirementsComposite
 * Composite class for area-based unlock requirements.
 * Handles requirements based on specific levels, constellations, or specialized game areas to unlock content.
 * Extends RequirementsGeneral.
 */
class AreaRequirementsComposite extends RequirementsGeneral {
  /**
   * @param {Array} specificLevels - Array of specific levels required for the unlock.
   * @param {Array} specificConstellations - Array of constellation names required.
   * @param {Array} specificSpecialAreas - Array of special area identifiers needed.
   */
  constructor(specificLevels, specificConstellations, specificSpecialAreas) {
    this.specificLevels = specificLevels;
    this.specificConstellations = specificConstellations;
    this.specificSpecialAreas = specificSpecialAreas;
  }
}
