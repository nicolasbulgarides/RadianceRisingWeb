/**
 * Class representing the header data for unlock requirements.
 *
 * This class encapsulates basic identification and classification information
 * for an unlockable content item (feature, area, level, item, ability, etc.).
 *
 * Note that due to OCD and perfectionism, the general importance of header data is in exact and calculated order
 *
 * @class UnlockHeaderData
 */
class UnlockHeaderData {
  static ASSUMED_MINIMUM_GAME_VERSION = Config.GAME_VERSION;
  static ASSUMED_UNDER_ACTIVE_DEVELOPMENT = true;

  /**
   * Constructs a new set of unlock header data.
   *
   * @param {string} contentType - Identifier indicating the target type ("area", "level", "feature", "item", "ability", etc.)
   * @param {string} contentName - The name of the content to be unlocked
   * @param {string} minimumVersionRequirement - The minimum game version required to unlock
   * @param {string} contentCategory - The category of the content to be unlocked - techdemo, tutorial, free, premium
   * @param {Array} premiumRequirements - Array of premium conditions required for unlocking
   * @param {boolean} isUnderActiveDevelopment - Whether the content is undergoing active development
   */
  constructor(
    contentType = "unspecified-content-type",
    contentName = "unspecified-content-name",
    minimumVersionRequirement = "no-game-minimum-version-requirement",
    contentCategory = "unspecified-content-category",
    premiumRequirements = [],
    isUnderActiveDevelopment = true
  ) {
    // Indicates the type of content this unlock applies to (area, level, feature, item, etc.)
    this.contentType = contentType;

    // Provides a human-readable name for the content
    this.contentName = contentName;

    // Specifies the minimum required game version for unlocking
    this.minimumVersionRequirement = minimumVersionRequirement;

    // Specifies the category of the content
    this.contentCategory = contentCategory;

    // Conditions related to premium access or subscriptions
    this.premiumRequirements = premiumRequirements;

    // Specifies if the content is undergoing active development
    this.isUnderActiveDevelopment = isUnderActiveDevelopment;
  }

  /**
   * Creates a basic header for tech demo content.
   * Note that tech demos are broken into either a general tech demo showing engine capabilities, or actual tutorials meant to teach the player how to play the game.
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {boolean} isATechDemoTutorial - Whether the content is a tech demo tutorial or just a general tech demo
   * @returns {UnlockHeaderData} A header for tech demo content
   */
  static createTechDemoHeader(
    contentType,
    contentName,
    isATechDemoTutorial = false
  ) {
    let techDemoSubCategory = isATechDemoTutorial
      ? "techdemo-tutorial"
      : "techdemo";

    return new UnlockHeaderData(
      contentType,
      contentName,
      UnlockHeaderData.ASSUMED_MINIMUM_GAME_VERSION,
      techDemoSubCategory,
      [], // No premium requirements
      UnlockHeaderData.ASSUMED_UNDER_ACTIVE_DEVELOPMENT
    );
  }

  /**
   * Creates a basic header for free content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {boolean} contentIsATutorial - Whether the content is a tutorial
   * @returns {UnlockHeaderData} A header for free content
   */
  static createFreeContentHeader(
    contentType = "unspecified-content-type",
    contentName = "unspecified-content-name",
    specifiedMinimumGameVersion = UnlockHeaderData.ASSUMED_MINIMUM_GAME_VERSION,
    contentIsATutorial = false
  ) {
    let levelDeterminedCategory = contentIsATutorial ? "tutorial" : "free";

    return new UnlockHeaderData(
      contentType,
      contentName,
      specifiedMinimumGameVersion,
      levelDeterminedCategory,
      [], // No premium requirements
      false // is assumed to be a completed content, not a development content
    );
  }

  /**
   * Creates a header for premium content.
   *
   * @param {string} contentType - The type of content
   * @param {string} contentName - The name of the content
   * @param {string} specifiedMinimumGameVersion - The minimum game version required
   * @param {string} premiumRequirements - The type of premium status required
   * @returns {UnlockHeaderData} A header for premium content
   */
  static createPremiumContentHeader(
    contentType = "-unspecified-content-type",
    contentName = "-unspecified-content-name-",
    specifiedMinimumGameVersion = UnlockHeaderData.ASSUMED_MINIMUM_GAME_VERSION,
    premiumRequirements = ["standard-subscription"]
  ) {
    return new UnlockHeaderData(
      contentType,
      contentName,
      specifiedMinimumGameVersion,
      "premium",
      premiumRequirements,
      false
    );
  }

  /**
   * Converts the header data to a plain object for serialization.
   *
   * @returns {Object} A plain object representation of the header data
   */
  toJSON() {
    return {
      contentType: this.contentType,
      contentName: this.contentName,
      gameVersionRequirement: this.gameVersionRequirement,
      contentCategory: this.contentCategory,
      premiumRequirements: this.premiumRequirements,
      isUnderActiveDevelopment: this.isUnderActiveDevelopment,
    };
  }

  /**
   * Creates an instance from a plain object (deserialization).
   *
   * @param {Object} data - The plain object to create an instance from
   * @returns {UnlockHeaderData} A new instance with the provided data
   */
  static fromJSON(data) {
    return new UnlockHeaderData(
      data.contentType,
      data.contentName,
      data.gameVersionRequirement,
      data.premiumRequirements
    );
  }

  /**
   * Creates a copy of this header data.
   *
   * @returns {UnlockHeaderData} A new instance with the same properties
   */
  clone() {
    return new UnlockHeaderData(
      this.contentType,
      this.contentName,
      this.gameVersionRequirement,
      [...this.premiumRequirements]
    );
  }
}
