/**
 * SpecialRequirementsComposite
 * Composite class for special unlock requirements.
 * Contains custom or exceptional unlock conditions that do not fit into the other categories.
 * Extends RequirementsGeneral.
 */
class SpecialRequirements extends RequirementsGeneral {
  /**
   * @param {Array} specialRequirements - List of special conditions required for the unlock.
   */
  constructor(specialRequirements = []) {
    this.specialRequirements = specialRequirements;
  }
}
