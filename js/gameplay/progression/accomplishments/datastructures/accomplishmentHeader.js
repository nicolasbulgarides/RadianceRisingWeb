/**
 * Header information for accomplishment data.
 * This class provides essential metadata for the AccomplishmentDataComposite class.
 * Based on the accomplishment category in this header, the accomplishment will be
 * processed and converted to appropriate rewards.
 */
class AccomplishmentHeader {
  /**
   * Creates a new accomplishment header
   * @param {string} accomplishmentCategory - Primary classification of the accomplishment\
   * @param {string} accomplishmentAbsoluteId - Unique identifier for the accomplishment - individual accomplishment "subfactories" will use this to identify relevant criteria from game state
   * @param {string} accomplishmentNickName - User-friendly name for the accomplishment
   * @param {string} minimumVersionRequirement - Minimum game version required for this accomplishment
   * @param {string} accomplishmentDescription - Detailed description of the accomplishment
   * @param {boolean} isUnderActiveDevelopment - Whether this accomplishment type is still being developed
   */
  constructor(
    accomplishmentCategory = "-unspecified-accomplishment-category",
    accomplishmentNickName = "unspecified-accomplishment-nickname",
    minimumVersionRequirement = "no-game-minimum-version-requirement",
    accomplishmentDescription = "unspecified-accomplishment-description",
    isUnderActiveDevelopment = true
  ) {
    this.accomplishmentCategory = accomplishmentCategory;
    this.accomplishmentNickName = accomplishmentNickName;
    this.minimumVersionRequirement = minimumVersionRequirement;
    this.accomplishmentDescription = accomplishmentDescription;
    this.isUnderActiveDevelopment = isUnderActiveDevelopment;
  }

  /**
   * Creates a clone of this header with modified properties
   * @param {Object} overrides - Properties to override in the cloned header
   * @returns {AccomplishmentHeader} A new header with the specified overrides
   */
  clone(overrides = {}) {
    return new AccomplishmentHeader(
      overrides.accomplishmentCategory || this.accomplishmentCategory,
      overrides.accomplishmentNickName || this.accomplishmentNickName,
      overrides.minimumVersionRequirement || this.minimumVersionRequirement,
      overrides.accomplishmentDescription || this.accomplishmentDescription,
      overrides.isUnderActiveDevelopment !== undefined
        ? overrides.isUnderActiveDevelopment
        : this.isUnderActiveDevelopment
    );
  }

  /**
   * Checks if this accomplishment is available in the current game version
   * @param {string} currentGameVersion - The current game version
   * @returns {boolean} Whether the accomplishment is available
   */
  isAvailableInVersion(currentGameVersion) {
    // Simple version comparison - in a real implementation, this would use
    // a more sophisticated version comparison algorithm
    return currentGameVersion >= this.minimumVersionRequirement;
  }

  /**
   * Returns a string representation of this header
   * @returns {string} A string representation of this header
   */
  toString() {
    return `${this.accomplishmentCategory}: ${this.accomplishmentNickName} (${
      this.isUnderActiveDevelopment ? "In Development" : "Released"
    })`;
  }
}
