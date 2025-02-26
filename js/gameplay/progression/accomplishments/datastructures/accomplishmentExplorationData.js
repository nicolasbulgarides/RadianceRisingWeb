/**
 * Data structure for tracking exploration-related accomplishments.
 * Used to record exploration activities such as discovering new areas, finding landmarks,
 * uncovering secret areas, completing map exploration, and world-first discoveries.
 * Supports tracking of area types, discovery methods, and exploration percentages.
 */
class AccomplishmentExplorationData {
  /**
   * Creates a new exploration accomplishment data instance
   * @param {string} areaId - Unique identifier for the explored area
   * @param {string} areaName - Display name of the explored area
   * @param {string} areaType - Type of area (standard, landmark, secret, etc.)
   * @param {string} areaSize - Size of the area (small, medium, large, variable)
   * @param {string} areaRarity - Rarity of the area (common, uncommon, rare, legendary)
   * @param {boolean} isSecretArea - Whether the area is a secret or hidden area
   * @param {boolean} isFirstPlayerToDiscover - Whether the player is the first to discover this area
   * @param {string} discoveryMethod - Method of discovery (walking, investigation, quest, etc.)
   * @param {boolean} containsSpecialLandmarks - Whether the area contains special landmarks
   * @param {number} explorationPercentage - Percentage of the area that has been explored
   * @param {Object} discoveryRewards - Rewards granted for the discovery
   * @param {Date} discoveryDate - Date and time of the discovery
   */
  constructor(
    areaId,
    areaName,
    areaType,
    areaSize,
    areaRarity,
    isSecretArea,
    isFirstPlayerToDiscover,
    discoveryMethod,
    containsSpecialLandmarks,
    explorationPercentage,
    discoveryRewards,
    discoveryDate
  ) {
    this.areaId = areaId;
    this.areaName = areaName;
    this.areaType = areaType;
    this.areaSize = areaSize;
    this.areaRarity = areaRarity;
    this.isSecretArea = isSecretArea;
    this.isFirstPlayerToDiscover = isFirstPlayerToDiscover;
    this.discoveryMethod = discoveryMethod;
    this.containsSpecialLandmarks = containsSpecialLandmarks;
    this.explorationPercentage = explorationPercentage;
    this.discoveryRewards = discoveryRewards;
    this.discoveryDate = discoveryDate;
  }
}
