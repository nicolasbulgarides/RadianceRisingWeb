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

    // Collect all the arrays for validation
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

    // Check if all arrays have the same length
    const expectedLength = allMotionProfileIds.length;
    if (!arraysToCheck.every((arr) => arr.length === expectedLength)) {
      ChadUtilities.SmartLogger(
        this.LOGGING_ENABLED,
        "All arrays inside of the lighting motion profile bag must have the same length."
      );
    } else {
      // Store validated arrays in instance variables
      this.allMotionProfileIds = allMotionProfileIds;
      this.allPathCategories = allPathCategories;
      this.allBasePositions = allBasePositions;
      this.allBaseSpeeds = allBaseSpeeds;
      this.allRadiusOrDistances = allRadiusOrDistances;
      this.allStartMomentRatios = allStartMomentRatios;
      this.allDoesLoop = allDoesLoop;
      this.allTeleportsOrReverses = allTeleportsOrReverses;
      this.allOnEndInteractions = allOnEndInteractions;

      // Generate motion profiles
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

  generateMotionProfile(
    primaryId,
    motionProfileId,
    category,
    position,
    baseSpeed,
    radiusOrDistance,
    startRatio,
    doesLoop,
    teleportOrReverse,
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
      teleportOrReverse,
      onEndInteraction
    );
  }
}

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
