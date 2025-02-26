/**
 * Factory class that serves as the single entry point for accomplishment recognition.
 *
 * This factory processes AccomplishmentProfileHeader objects and AccomplishmentGameStateCarrier
 * objects to create and populate the appropriate AccomplishmentDataComposite structures.
 * All game systems should use this factory as the singular point of entry for generating
 * accomplishment data.
 */
class AccomplishmentRecognitionFactory {
  /**
   * Creates a new AccomplishmentRecognitionFactory
   */
  constructor() {
    // Initialize specialized handlers for different accomplishment categories
    this.categoryHandlers = {
      quest: this.createQuestAccomplishment.bind(this),
      combat: this.createCombatAccomplishment.bind(this),
      achievement: this.createAchievementAccomplishment.bind(this),
      basicMilestone: this.createBasicMilestoneAccomplishment.bind(this),
      area: this.createAreaAccomplishment.bind(this),
      learned: this.createLearnedAccomplishment.bind(this),
      event: this.createEventAccomplishment.bind(this),
      acquiredObject: this.createAcquiredObjectAccomplishment.bind(this),
      competitive: this.createCompetitiveAccomplishment.bind(this),
      status: this.createStatusAccomplishment.bind(this),
      social: this.createSocialAccomplishment.bind(this),
      pet: this.createPetAccomplishment.bind(this),
      account: this.createAccountAccomplishment.bind(this),
      usage: this.createUsageAccomplishment.bind(this),
      minigame: this.createMinigameAccomplishment.bind(this),
      technical: this.createTechnicalAccomplishment.bind(this),
      crafting: this.createCraftingAccomplishment.bind(this),
      economy: this.createEconomyAccomplishment.bind(this),
      exploration: this.createExplorationAccomplishment.bind(this),
      progression: this.createProgressionAccomplishment.bind(this),
    };
  }

  /**
   * Main entry point for creating accomplishment data from game systems.
   * Processes an accomplishment profile header and game state carrier to create
   * a fully populated AccomplishmentDataComposite object.
   *
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header containing metadata
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The carrier containing game state data
   * @returns {AccomplishmentDataComposite} The created and populated accomplishment data composite
   * @throws {Error} If the profile header or game state carrier is invalid
   */
  recognizeAccomplishment(profileHeader, gameStateCarrier) {
    // Validate inputs
    if (!profileHeader || !profileHeader.isValid()) {
      throw new Error(
        "Invalid profile header provided to AccomplishmentRecognitionFactory"
      );
    }

    if (!gameStateCarrier) {
      throw new Error(
        "Invalid game state carrier provided to AccomplishmentRecognitionFactory"
      );
    }

    // Get the appropriate handler for this category
    const categoryHandler =
      this.categoryHandlers[profileHeader.accomplishmentCategory];

    if (!categoryHandler) {
      throw new Error(
        `No handler found for accomplishment category: ${profileHeader.accomplishmentCategory}`
      );
    }

    // Create the accomplishment data composite using the specialized handler
    const accomplishmentDataComposite = categoryHandler(
      profileHeader,
      gameStateCarrier
    );

    // Add metadata from the profile header to the composite's header
    accomplishmentDataComposite.accomplishmentHeader.accomplishmentCategory =
      profileHeader.accomplishmentCategory;
    accomplishmentDataComposite.accomplishmentHeader.accomplishmentNickName =
      profileHeader.metaData?.nickName ||
      `${profileHeader.accomplishmentCategory}:${profileHeader.accomplishmentSubCategory}`;

    // Log the recognition for debugging
    console.debug(`Recognized accomplishment: ${profileHeader.toString()}`);

    return accomplishmentDataComposite;
  }

  /**
   * Creates a basic header for an accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @returns {AccomplishmentHeader} A new accomplishment header
   * @private
   */
  createBaseHeader(profileHeader) {
    return new AccomplishmentHeader(
      profileHeader.accomplishmentCategory,
      profileHeader.metaData?.nickName ||
        `${profileHeader.accomplishmentCategory}:${profileHeader.accomplishmentSubCategory}`,
      profileHeader.metaData?.minimumVersionRequirement || "1.0.0",
      profileHeader.metaData?.description || "",
      profileHeader.metaData?.isUnderDevelopment !== undefined
        ? profileHeader.metaData.isUnderDevelopment
        : true
    );
  }

  /**
   * Creates a quest accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createQuestAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const questData = new AccomplishmentQuestData(
      gameStateCarrier.getValue("questId"),
      gameStateCarrier.getValue("questName"),
      gameStateCarrier.getValue("questDescription"),
      gameStateCarrier.getValue("questProgressStage"),
      gameStateCarrier.getValue("questRarityTier"),
      gameStateCarrier.getValue("questDifficultyTier"),
      gameStateCarrier.getValue("questLocation")
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      questData, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a combat accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createCombatAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const combatData = new AccomplishmentCombatData(
      gameStateCarrier.getValue("combatEventType"),
      gameStateCarrier.getValue("combatOutcome"),
      gameStateCarrier.getValue("idsOfDefeatedEntities", []),
      gameStateCarrier.getValue("idsOfVictorEntities", []),
      gameStateCarrier.getValue("combatEventLocation"),
      gameStateCarrier.getValue("combatEventDifficultyTier"),
      gameStateCarrier.getValue("combatEventRarityTier"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      combatData, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates an achievement accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createAchievementAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const achievementData = new AccomplishmentAchievementData(
      gameStateCarrier.getValue("achievementId"),
      gameStateCarrier.getValue("nameOfAcheivement"),
      gameStateCarrier.getValue("achivementPointsValue"),
      gameStateCarrier.getValue("achievementGroup")
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      achievementData, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a basic milestone accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createBasicMilestoneAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const basicMilestoneData = new AccomplishmentBasicMilestoneData(
      gameStateCarrier.getValue("accomplishmentCategory"),
      gameStateCarrier.getValue("accomplishmentSubCategory"),
      gameStateCarrier.getValue("accomplishmentNickName"),
      gameStateCarrier.getValue("accomplishmentValue"),
      gameStateCarrier.getValue("accomplishmentMagnitude"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      basicMilestoneData, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates an area accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createAreaAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const areaData = new AccomplishmentAreaData(
      gameStateCarrier.getValue("isAreaOrLevel"),
      gameStateCarrier.getValue("areaId"),
      gameStateCarrier.getValue("areaName"),
      gameStateCarrier.getValue("accomplishmentCategory"),
      gameStateCarrier.getValue("accomplishmentSubCategory"),
      gameStateCarrier.getValue("accomplishmentValue"),
      gameStateCarrier.getValue("accomplishmentMagnitude"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      areaData, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a learned accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createLearnedAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const learnedData = new AccomplishmentLearnedData(
      gameStateCarrier.getValue("idOfLearnedThing"),
      gameStateCarrier.getValue("wasACapabilityLearned"),
      gameStateCarrier.getValue("capabilityCategory"),
      gameStateCarrier.getValue("wasALoreFactLearned"),
      gameStateCarrier.getValue("loreFactCategory"),
      gameStateCarrier.getValue("possiblyRelevantValue")
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      learnedData, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates an event accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createEventAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const eventData = new AccomplishmentEventData(
      gameStateCarrier.getValue("eventId"),
      gameStateCarrier.getValue("eventNickName"),
      gameStateCarrier.getValue("eventCategory"),
      gameStateCarrier.getValue("eventSubCategory"),
      gameStateCarrier.getValue("eventDescription"),
      gameStateCarrier.getValue("eventLocation"),
      gameStateCarrier.getValue("eventDateRange"),
      gameStateCarrier.getValue("eventDateCompleted"),
      gameStateCarrier.getValue("eventAccomplishmentValue"),
      gameStateCarrier.getValue("eventAccomplishmentMagnitude"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      eventData, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates an acquired object accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createAcquiredObjectAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const acquiredObjectData = new AccomplishmentAcquiredObjectData(
      gameStateCarrier.getValue("idOfAcquisition"),
      gameStateCarrier.getValue("acquisitionCategory"),
      gameStateCarrier.getValue("acquisitionLocation"),
      gameStateCarrier.getValue("acquisitionMethod"),
      gameStateCarrier.getValue("acquisitionNumericValue"),
      gameStateCarrier.getValue("acquisitionRarityTier")
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      acquiredObjectData, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a competitive accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createCompetitiveAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const competitiveData = new AccomplishmentCompetitiveData(
      gameStateCarrier.getValue("competitionCategory"),
      gameStateCarrier.getValue("competitionSubCategory"),
      gameStateCarrier.getValue("competitionNickName"),
      gameStateCarrier.getValue("publicProfileIdOfAllies", []),
      gameStateCarrier.getValue("publicProfileIdOfCompetitors", []),
      gameStateCarrier.getValue("competitionOutcome"),
      gameStateCarrier.getValue("competitionOutcomeMagnitude"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      competitiveData, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a status accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createStatusAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const statusData = new AccomplishmentStatusData(
      gameStateCarrier.getValue("statusId"),
      gameStateCarrier.getValue("statusCategory"),
      gameStateCarrier.getValue("nameOfSpecialStatus"),
      gameStateCarrier.getValue("statusPossiblyRelevantValue")
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      statusData, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a social accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createSocialAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const socialData = new AccomplishmentSocialData(
      gameStateCarrier.getValue("socialAccomplishmentCategory"),
      gameStateCarrier.getValue("socialAccomplishmentSubCategory"),
      gameStateCarrier.getValue("socialAccomplishmentNickName"),
      gameStateCarrier.getValue("socialAccomplishmentValue"),
      gameStateCarrier.getValue("socialAccomplishmentMagnitude"),
      gameStateCarrier.getValue("idsOfInvolvedFriends", []),
      gameStateCarrier.getValue("idsOfInvolvedAllies", []),
      gameStateCarrier.getValue("idsOfInvolvedEnemies", []),
      gameStateCarrier.getValue("idsOfInvolvedCommentators", []),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      socialData, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a pet accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createPetAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const petData = new AccomplishmentPetData(
      gameStateCarrier.getValue("idOfPet"),
      gameStateCarrier.getValue("petName"),
      gameStateCarrier.getValue("typeOfPetEvent"),
      gameStateCarrier.getValue("magnitudeOfPetEvent"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      petData, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates an account accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createAccountAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const accountData = new AccomplishmentAccountData(
      gameStateCarrier.getValue("accountEmailJustConfirmed"),
      gameStateCarrier.getValue("accountTwoFactorJustEnabled"),
      gameStateCarrier.getValue("accountNewAgeMilestone"),
      gameStateCarrier.getValue("totalHoursPlayedNewMilestone"),
      gameStateCarrier.getValue("currentLoginStreakNewMilestone")
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      accountData, // accountData
      null, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a usage accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createUsageAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const usageData = new AccomplishmentUsageData(
      gameStateCarrier.getValue("usageCategory"),
      gameStateCarrier.getValue("usageSubCategory"),
      gameStateCarrier.getValue("usageNickName"),
      gameStateCarrier.getValue("usageValue"),
      gameStateCarrier.getValue("usageMagnitude"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      usageData, // usageData
      null, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a minigame accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createMinigameAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const minigameData = new AccomplishmentMinigameData(
      gameStateCarrier.getValue("idOfMinigame"),
      gameStateCarrier.getValue("minigameName"),
      gameStateCarrier.getValue("minigameCategory"),
      gameStateCarrier.getValue("minigameAccompishmentType"),
      gameStateCarrier.getValue("accomplishmentMagnitude"),
      gameStateCarrier.getValue("minigameLocation"),
      gameStateCarrier.getValue("otherRelevantData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      minigameData, // minigameData
      null // technicalData
    );
  }

  /**
   * Creates a technical accomplishment data composite
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The game state carrier
   * @returns {AccomplishmentDataComposite} A new accomplishment data composite
   * @private
   */
  createTechnicalAccomplishment(profileHeader, gameStateCarrier) {
    const header = this.createBaseHeader(profileHeader);

    const technicalData = new AccomplishmentTechnicalData(
      gameStateCarrier.getValue("regionalData", {}),
      gameStateCarrier.getValue("businessData", {}),
      gameStateCarrier.getValue("futureProofData", {}),
      gameStateCarrier.getValue("emergencyData", {})
    );

    return new AccomplishmentDataComposite(
      header,
      null, // basicMilestoneData
      null, // areaData
      null, // learnedData
      null, // questData
      null, // achievementData
      null, // eventData
      null, // acquiredObjectData
      null, // combatData
      null, // competitiveData
      null, // statusData
      null, // socialData
      null, // petData
      null, // accountData
      null, // usageData
      null, // minigameData
      technicalData // technicalData
    );
  }

  /**
   * Creates a crafting accomplishment data structure.
   *
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header containing metadata
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The carrier containing game state data
   * @returns {AccomplishmentDataComposite} The created accomplishment data composite
   */
  createCraftingAccomplishment(profileHeader, gameStateCarrier) {
    // Create base header
    const header = this.createBaseHeader(profileHeader);

    // Create crafting data
    const craftingData = new AccomplishmentCraftingData({
      craftedItemId: gameStateCarrier.getValue("craftedItemId"),
      craftedItemType: gameStateCarrier.getValue("craftedItemType"),
      craftedItemRarity: gameStateCarrier.getValue("craftedItemRarity"),
      craftedItemQuality: gameStateCarrier.getValue("craftedItemQuality"),
      craftingRecipeId: gameStateCarrier.getValue("craftingRecipeId"),
      craftingSkillLevel: gameStateCarrier.getValue("craftingSkillLevel"),
      craftingMaterialsUsed: gameStateCarrier.getValue("craftingMaterialsUsed"),
      craftingLocation: gameStateCarrier.getValue("craftingLocation"),
      craftingDuration: gameStateCarrier.getValue("craftingDuration"),
      craftingSuccess: gameStateCarrier.getValue("craftingSuccess", true),
      craftingCriticalSuccess: gameStateCarrier.getValue(
        "craftingCriticalSuccess",
        false
      ),
      craftingFailureReason: gameStateCarrier.getValue("craftingFailureReason"),
    });

    // Create composite
    const composite = new AccomplishmentDataComposite();
    composite.accomplishmentHeader = header;
    composite.accomplishmentCraftingData = craftingData;

    return composite;
  }

  /**
   * Creates an economy accomplishment data structure.
   *
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header containing metadata
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The carrier containing game state data
   * @returns {AccomplishmentDataComposite} The created accomplishment data composite
   */
  createEconomyAccomplishment(profileHeader, gameStateCarrier) {
    // Create base header
    const header = this.createBaseHeader(profileHeader);

    // Create economy data
    const economyData = new AccomplishmentEconomyData({
      transactionType: gameStateCarrier.getValue("transactionType"),
      transactionAmount: gameStateCarrier.getValue("transactionAmount"),
      transactionCurrency: gameStateCarrier.getValue("transactionCurrency"),
      transactionItemId: gameStateCarrier.getValue("transactionItemId"),
      transactionItemType: gameStateCarrier.getValue("transactionItemType"),
      transactionItemQuantity: gameStateCarrier.getValue(
        "transactionItemQuantity"
      ),
      transactionPartyId: gameStateCarrier.getValue("transactionPartyId"),
      transactionPartyType: gameStateCarrier.getValue("transactionPartyType"),
      transactionLocation: gameStateCarrier.getValue("transactionLocation"),
      transactionTimestamp: gameStateCarrier.getValue(
        "transactionTimestamp",
        Date.now()
      ),
      economyMilestone: gameStateCarrier.getValue("economyMilestone"),
      economyStatus: gameStateCarrier.getValue("economyStatus"),
    });

    // Create composite
    const composite = new AccomplishmentDataComposite();
    composite.accomplishmentHeader = header;
    composite.accomplishmentEconomyData = economyData;

    return composite;
  }

  /**
   * Creates an exploration accomplishment data structure.
   *
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header containing metadata
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The carrier containing game state data
   * @returns {AccomplishmentDataComposite} The created accomplishment data composite
   */
  createExplorationAccomplishment(profileHeader, gameStateCarrier) {
    // Create base header
    const header = this.createBaseHeader(profileHeader);

    // Create exploration data
    const explorationData = new AccomplishmentExplorationData({
      areaId: gameStateCarrier.getValue("areaId"),
      areaName: gameStateCarrier.getValue("areaName"),
      areaType: gameStateCarrier.getValue("areaType"),
      discoveryType: gameStateCarrier.getValue("discoveryType"),
      discoveryId: gameStateCarrier.getValue("discoveryId"),
      discoveryName: gameStateCarrier.getValue("discoveryName"),
      discoveryRarity: gameStateCarrier.getValue("discoveryRarity"),
      explorationProgress: gameStateCarrier.getValue("explorationProgress"),
      explorationCompletionPercentage: gameStateCarrier.getValue(
        "explorationCompletionPercentage"
      ),
      explorationDifficulty: gameStateCarrier.getValue("explorationDifficulty"),
      explorationReward: gameStateCarrier.getValue("explorationReward"),
      explorationTimestamp: gameStateCarrier.getValue(
        "explorationTimestamp",
        Date.now()
      ),
    });

    // Create composite
    const composite = new AccomplishmentDataComposite();
    composite.accomplishmentHeader = header;
    composite.accomplishmentExplorationData = explorationData;

    return composite;
  }

  /**
   * Creates a progression accomplishment data structure.
   *
   * @param {AccomplishmentProfileHeader} profileHeader - The profile header containing metadata
   * @param {AccomplishmentGameStateCarrier} gameStateCarrier - The carrier containing game state data
   * @returns {AccomplishmentDataComposite} The created accomplishment data composite
   */
  createProgressionAccomplishment(profileHeader, gameStateCarrier) {
    // Create base header
    const header = this.createBaseHeader(profileHeader);

    // Create progression data
    const progressionData = new AccomplishmentProgressionData({
      progressionType: gameStateCarrier.getValue("progressionType"),
      progressionCategory: gameStateCarrier.getValue("progressionCategory"),
      progressionLevel: gameStateCarrier.getValue("progressionLevel"),
      progressionPreviousLevel: gameStateCarrier.getValue(
        "progressionPreviousLevel"
      ),
      progressionExperience: gameStateCarrier.getValue("progressionExperience"),
      progressionExperienceRequired: gameStateCarrier.getValue(
        "progressionExperienceRequired"
      ),
      progressionSkillPoints: gameStateCarrier.getValue(
        "progressionSkillPoints"
      ),
      progressionUnlocks: gameStateCarrier.getValue("progressionUnlocks"),
      progressionMilestone: gameStateCarrier.getValue("progressionMilestone"),
      progressionTimestamp: gameStateCarrier.getValue(
        "progressionTimestamp",
        Date.now()
      ),
    });

    // Create composite
    const composite = new AccomplishmentDataComposite();
    composite.accomplishmentHeader = header;
    composite.accomplishmentProgressionData = progressionData;

    return composite;
  }
}
