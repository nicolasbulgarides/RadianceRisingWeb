/**
 * LightingMotionProfileBag Class
 *
 * Encapsulates a set of motion profiles for a lighting preset.
 * Validates that internal arrays are consistent before generating individual motion profiles.
 */
class LightingMotionProfileBag {
  static LOGGING_ENABLED = true;
  constructor(
    primaryProfileId,
    allMotionProfileIds,
    allPathCategories,
    allBasePositions,
    allBaseSpeeds,
    allRadiusOrDistances,
    allStartMomentRatios,
    allDoesLoop,
    allTeleportsOrReverses,
    allOnEndInteractions
  ) {
    this.primaryProfileId = primaryProfileId;
    this.allMotionProfiles = [];

    // Validate that all input arrays have equal lengths.
    const arraysToCheck = [
      allMotionProfileIds,
      allPathCategories,
      allBasePositions,
      allBaseSpeeds,
      allRadiusOrDistances,
      allStartMomentRatios,
      allDoesLoop,
      allTeleportsOrReverses,
      allOnEndInteractions,
    ];

    const expectedLength = allMotionProfileIds.length;
    if (!arraysToCheck.every((arr) => arr.length === expectedLength)) {
      ChadUtilities.SmartLogger(
        this.LOGGING_ENABLED,
        "All arrays inside of the lighting motion profile bag must have the same length."
      );
    } else {
      // Store arrays and generate individual motion profiles.
      this.allMotionProfileIds = allMotionProfileIds;
      this.allPathCategories = allPathCategories;
      this.allBasePositions = allBasePositions;
      this.allBaseSpeeds = allBaseSpeeds;
      this.allRadiusOrDistances = allRadiusOrDistances;
      this.allStartMomentRatios = allStartMomentRatios;
      this.allDoesLoop = allDoesLoop;
      this.allTeleportsOrReverses = allTeleportsOrReverses;
      this.allOnEndInteractions = allOnEndInteractions;

      for (let i = 0; i < expectedLength; i++) {
        let motionProfile = this.generateMotionProfile(
          primaryProfileId,
          allMotionProfileIds[i],
          allPathCategories[i],
          allBasePositions[i],
          allBaseSpeeds[i],
          allRadiusOrDistances[i],
          allStartMomentRatios[i],
          allDoesLoop[i],
          allTeleportsOrReverses[i],
          allOnEndInteractions[i]
        );
        this.allMotionProfiles.push(motionProfile);
      }
    }
  }

  /**
   * Generates an individual LightingMotionProfile.
   *
   * @param {string} primaryId - Primary preset identifier.
   * @param {string} motionProfileId - Unique identifier for this motion profile.
   * @param {string} category - Motion category (e.g., "static", "linear").
   * @param {BABYLON.Vector3} position - Initial position for the light.
   * @param {BABYLON.Vector3} baseSpeed - Base speed vector.
   * @param {BABYLON.Vector3} radiusOrDistance - Orbit radius or movement distance.
   * @param {number} startRatio - Starting phase ratio.
   * @param {boolean} doesLoop - Whether the motion loops.
   * @param {string} teleportOrReverse - Behavior at end of motion.
   * @param {string} onEndInteraction - Additional interaction on motion end.
   * @returns {LightingMotionProfile} A new motion profile instance.
   */
  generateMotionProfile(
    primaryId,
    motionProfileId,
    category,
    position,
    baseSpeed,
    radiusOrDistance,
    startRatio,
    doesLoop,
    teleportOrReverses,
    onEndInteraction
  ) {
    return new LightingMotionProfile(
      primaryId,
      motionProfileId,
      category,
      position,
      baseSpeed,
      radiusOrDistance,
      startRatio,
      doesLoop,
      teleportOrReverses,
      onEndInteraction
    );
  }
}

/**
 * LightingMotionProfile Class
 *
 * Represents a single motion profile for a light, containing parameters such as
 * path category, base position, movement speed, and looping properties.
 */
class LightingMotionProfile {
  constructor(
    parentId,
    profileId,
    pathCategory,
    basePosition,
    baseSpeed,
    radiusOrDistance,
    startMomentRatio,
    doesLoop,
    teleportsOrReverses,
    onEndInteraction
  ) {
    this.parentId = parentId;
    this.profileId = profileId;
    this.pathCategory = pathCategory;
    this.basePosition = basePosition;
    this.baseSpeed = baseSpeed;
    this.radiusOrDistance = radiusOrDistance;
    this.startMomentRatio = startMomentRatio;
    this.doesLoop = doesLoop;
    this.teleportsOrReverses = teleportsOrReverses;
    this.onEndInteraction = onEndInteraction;
  }
}
