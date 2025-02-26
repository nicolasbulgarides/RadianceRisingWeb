/**
 * ScriptManifest Class
 *
 * Defines separate arrays of script URLs for each functional category required by the application.
 * Uses a centralized metadata-driven approach for script access and loading.
 *
 * On a script loading failure the following happens:
 *   • InitializationDiagnosticsLogger.logPhaseError is called to record the failure.
 *   • CatastropheManager.registerCatastrophe is invoked to log the catastrophic error.
 *   • CatastropheManager.displayCatastrophePage routes to catastropheReport.html.
 *
 * The class uses a metadata-driven approach with the scriptCategories array that maps
 * category names to their corresponding script arrays and display names. This enables:
 * 1. Generic access to script arrays via getScripts(category)
 * 2. Generic loading via loadCategoryScriptsPromise(category)
 *
 * IMPORTANT: All individual getXScripts and loadXScriptsPromise methods have been replaced
 * by the generic getScripts and loadCategoryScriptsPromise methods. Any code that was
 * previously using those methods should be updated to use the generic methods instead.
 *
 * For development and testing purposes, specific script categories can be skipped by
 * adding them to the loadsToSkip array. This allows for faster loading during development
 * by omitting non-essential systems.
 *
 * Categories include:
 * - EssentialInitializationScripts
 * - AssetManifestScripts
 * - AssetLoadersAndManagersScripts
 * - UI Scene Scripts (High Level)
 *  UI Construction / Factory Scripts
 *   UI Custom Nodes (Various Categories)
 * Cheat prevention / detection
 * UNlock
 * - LightingScripts
 * - CameraScripts
 * - InputScripts
 *  Unlocking / gameplay progression
 * - GameplayScripts - Abilities
 * Gameplay Scripts - Areas - Generation
 * Gameplay Scripts - Areas - Interaction
 * GameplayScripts - Hints
 * GameplayScripts - Interactions
 * GameplayScripts - Items - General
 * GameplayScripts - Items - Verification & Item Requirements
 *
 * - PlayerScripts
 * - GameInteractionsScripts
 * - GameAreaScripts
 * - SoundSystemsScripts
 * - MinorUtilityScripts
 *  Networking- General + Utilities
 * - NetworkingScripts - Transaction
 *  Networking Scripts - Platform Compatibility
 *  Achievements
 * - TransactionScripts
 * - PlayerSaveScripts
 */
class ScriptManifest {
  /**
   * Array of script categories to skip during development/testing
   * Add category names here to prevent them from loading
   * Example: ['cheatPrevention', 'accomplishment', 'networking']
   * @type {Array<string>}
   */
  static loadsToSkip = [];

  /**
   * Initializes the loadsToSkip array from Config settings
   * This method should be called after Config is fully loaded
   */
  static initializeSkipList() {
    try {
      // Check if Config exists and has the SYSTEMS_TO_SKIP_LOADING property
      if (typeof Config !== "undefined" && Config.SYSTEMS_TO_SKIP_LOADING) {
        this.loadsToSkip = [...Config.SYSTEMS_TO_SKIP_LOADING];
        console.info(
          `Initialized skip list from Config: ${this.loadsToSkip.join(", ")}`
        );
      }
    } catch (error) {
      console.warn("Failed to initialize skip list from Config:", error);
      this.loadsToSkip = [];
    }
  }

  /**
   * Registry of all script categories with metadata
   * @type {Array<{name: string, array: string, displayName: string}>}
   */
  static scriptCategories = [
    { name: "animation", array: "animationScripts", displayName: "Animation" },
    { name: "history", array: "historyScripts", displayName: "History" },
    { name: "gamemode", array: "gamemodeScripts", displayName: "Gamemode" },
    {
      name: "occurrence",
      array: "occurrenceScripts",
      displayName: "Occurrence",
    },
    {
      name: "microEvent",
      array: "microEventScripts",
      displayName: "MicroEvent",
    },
    { name: "trigger", array: "triggerScripts", displayName: "Trigger" },
    {
      name: "platformTransaction",
      array: "platformTransactionScripts",
      displayName: "PlatformTransaction",
    },
    { name: "testTool", array: "testToolScripts", displayName: "TestTool" },
    {
      name: "assetManifest",
      array: "assetManifestScripts",
      displayName: "AssetManifest",
    },
    {
      name: "assetLoadersAndManagers",
      array: "assetLoadersAndManagersScripts",
      displayName: "AssetLoadersAndManagers",
    },
    {
      name: "accomplishment",
      array: "accomplishmentScripts",
      displayName: "Accomplishment",
    },
    {
      name: "accomplishmentEmitter",
      array: "accomplishmentEmitterScripts",
      displayName: "AccomplishmentEmitter",
    },
    { name: "uiUtility", array: "uiUtilityScripts", displayName: "UIUtility" },
    {
      name: "uiSceneImplemented",
      array: "uiSceneScriptsImplemented",
      displayName: "UISceneImplemented",
    },
    {
      name: "cheatPrevention",
      array: "cheatPreventionScripts",
      displayName: "CheatPrevention",
    },
    { name: "lighting", array: "lightingScripts", displayName: "Lighting" },
    { name: "camera", array: "cameraScripts", displayName: "Camera" },
    { name: "input", array: "inputScripts", displayName: "Input" },
    { name: "gameplay", array: "gameplayScripts", displayName: "Gameplay" },
    { name: "player", array: "playerScripts", displayName: "Player" },
    {
      name: "itemGeneral",
      array: "itemGeneralScripts",
      displayName: "GeneralItem",
    },
    {
      name: "itemVerification",
      array: "itemVerificationScripts",
      displayName: "ItemVerification",
    },
    {
      name: "itemRequirements",
      array: "itemRequirementsScripts",
      displayName: "ItemRequirements",
    },
    { name: "movement", array: "movementScripts", displayName: "Movement" },
    {
      name: "gameInteractions",
      array: "gameInteractionsScripts",
      displayName: "GameInteractions",
    },
    { name: "reward", array: "rewardScripts", displayName: "Reward" },
    { name: "gameArea", array: "gameAreaScripts", displayName: "GameArea" },
    {
      name: "unlocking",
      array: "unlockingScriptsGeneral",
      displayName: "Unlocking",
    },
    {
      name: "unlockingRadiantRays",
      array: "unlockingScriptsRadiantRays",
      displayName: "RadiantRaysUnlocking",
    },
    {
      name: "soundSystems",
      array: "soundSystemsScripts",
      displayName: "SoundSystems",
    },
    {
      name: "minorUtility",
      array: "minorUtilityScripts",
      displayName: "MinorUtility",
    },
    {
      name: "networking",
      array: "networkingScripts",
      displayName: "Networking",
    },
    {
      name: "transaction",
      array: "transactionScripts",
      displayName: "Transaction",
    },
    {
      name: "playerSave",
      array: "playerSaveScripts",
      displayName: "PlayerSave",
    },
    {
      name: "playerSaveBatching",
      array: "playerSaveBatchingScripts",
      displayName: "PlayerSaveBatching",
    },
  ];

  static animationScripts = [
    "/animations/datastructures/programmaticAnimation.js",
    "/animations/datastructures/programmaticAnimationHeader.js",
    "/animations/datastructures/programmaticAnimationPlaybackStatus.js",
    "/animations/datastructures/programmaticAnimationSequence.js",
    "/animations/datastructures/programmaticAnimationTriggerEvent.js",
    "/animations/datastructures/programmaticAnimationValues.js",
    "/animations/datastructures/programmaticFrameShift.js",

    "/animations/utilities/programmaticAnimationFrameShiftCalculator.js",
    "/animations/utilities/programmaticFactoryForAnimations.js",
    "/animations/utilities/programmaticAnimationInterpolator.js",
    "/animations/programmaticAnimationManager.js",
  ];

  static historyScripts = [
    "/history/historyManager.js",
    "/history/historyFactory.js",
    "/history/datastructures/conflict/historyGuildStatement.js",
    "/history/datastructures/conflict/historyOfGuildWarComposite.js",
    "/history/datastructures/conflict/historyOfRivalryComposite.js",
    "/history/datastructures/conflict/historyOfNeutralCommentary.js",
    "/history/datastructures/conflict/historyStatementNotorietyData.js",
    "/history/datastructures/general/historyAcquisitionData.js",
    "/history/datastructures/general/historyActionData.js",
    "/history/datastructures/general/historyCompetitiveAffectData.js",
    "/history/datastructures/general/historyCompetitiveData.js",
    "/history/datastructures/general/historyEntryComposite.js",
    "/history/datastructures/general/historyEventGroup.js",
    "/history/datastructures/general/historyOtherSpecialData.js",
    "/history/datastructures/general/historyProgressData.js",
  ];
  static gamemodeScripts = [
    "/gameplay/gamemodes/gamemodeFactory.js",
    "/gameplay/gamemodes/specificmodes/gamemodeGeneric.js",
    "/gameplay/gamemodes/specificmodes/gamemodeStandard.js",
    "/gameplay/gamemodes/specificmodes/gamemodeTest.js",
    "/gameplay/gamemodes/gamemodeEnforcings.js",
  ];
  static occurrenceScripts = [
    "/gameplay/interactions/occurrences/specialOccurrenceComposite.js",
    "/gameplay/interactions/occurrences/specialOccurrenceManager.js",
    "/gameplay/interactions/occurrences/specialOccurrenceFactory.js",

    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceBasicData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceHeader.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceHyperspecificOtherData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceItemData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrencePetData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceProgressData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceSpecialEventData.js",
    "/gameplay/interactions/occurrences/datastructures/specialOccurrenceUnlockData.js",

    //to do - review various kinds of occurences will exist, when they will exist / priority, and what those occurences will entail including useful archetypes
    // "/gameplay/interactions/occurrences/datastructures/specialOccurrenceSocialData.js","
    // "/gameplay/interactions/occurrences/datastructures/specialOccurrenceCompetitiveData.js",
    // "/gameplay/interactions/occurrences/datastructures/specialOccurrenceStatusData.js",
  ];

  static microEventScripts = [
    "/gameplay/interactions/microevents/microEvent.js",
    "/gameplay/interactions/microevents/microEventManager.js",
    "/gameplay/interactions/microevents/microEventSignal.js",
    "/gameplay/interactions/microevents/microEventFactory.js",
  ];

  static triggerScripts = [
    "/gameplay/interactions/triggers/datastructures/triggerHeader.js",
    "/gameplay/interactions/triggers/datastructures/triggerSpecialData.js",
    "/gameplay/interactions/triggers/datastructures/triggerBehavior.js",
    "/gameplay/interactions/triggers/datastructures/triggerEvent.js",
    "/gameplay/interactions/triggers/datastructures/triggerInstructionPreset.js",
    "/gameplay/interactions/triggers/datastructures/triggerInstruction.js",

    "/gameplay/interactions/triggers/activeTriggerManager.js",
    "/gameplay/interactions/triggers/triggerFactory.js",
  ];

  static platformTransactionScripts = [
    "/networking/transactions/platforms/transactionArchetype.js",
    "/networking/transactions/platforms/platformDetectionChecker.js",
    "/networking/transactions/platforms/platformDetection.js",
    "/networking/transactions/platforms/successfulPlatformDetection.js",
    "/networking/transactions/platforms/transactionAndroid.js",
    "/networking/transactions/platforms/transactionIOS.js",
    "/networking/transactions/platforms/transactionWindows.js",
    "/networking/transactions/platforms/transactionMacOS.js",
    "/networking/transactions/platforms/transactionFacebook.js",
    "/networking/transactions/platforms/transactionSteam.js",
  ];

  static testToolScripts = [
    "/testtools/testManager.js",
    "/testtools/testLevelDataCompositeLoader.js",
    "/testtools/testLevelJsonBuilder.js",
  ];
  static assetManifestScripts = [
    "/utilities/assetmanifests/assetManifest.js",
    "/utilities/assetmanifests/assetManifestOverrides.js",
    "/utilities/assetmanifests/uiAssetManifest.js",
    "/utilities/assetmanifests/itemIconAssetManifest.js",
    "/utilities/assetmanifests/soundAssetManifest.js",
    "/utilities/assetmanifests/songAssetManifest.js",
    "/utilities/assetmanifests/levelRetrievalHeader.js",
    "/utilities/assetmanifests/levelManifest.js",
  ];

  static assetLoadersAndManagersScripts = [
    "/utilities/loaders/positionedObject.js",
    "/utilities/loaders/modelLoader.js",
    "/utilities/loaders/modelLoadingLogger.js",
    "/utilities/loaders/animatedModelLoader.js",
    "/utilities/loaders/sceneBuilder.js",
    "/utilities/loaders/levelDataFileLoader.js",
  ];

  static accomplishmentScripts = [
    "/gameplay/progression/accomplishments/datastructures/accomplishmentProfileHeader.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentEventData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentAccountData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentAchievementData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentAcquiredObjectData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentAreaData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentBasicMilestoneData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentCombatData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentCompetitiveData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentDataComposite.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentGameStateCarrier.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentHeader.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentLearnedData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentMinigameData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentPetData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentQuestData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentSocialData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentStatusData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentTechnicalData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentUsageData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentExplorationData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentEconomyData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentProgressionData.js",
    "/gameplay/progression/accomplishments/datastructures/accomplishmentCraftingData.js",

    "/gameplay/progression/accomplishments/accomplishmentRecognitionFactory.js",
    "/gameplay/progression/accomplishments/accomplishmentToRewardFactory.js",
  ];

  static accomplishmentEmitterScripts = [
    // Specific emitters corresponding to accomplishment data structures
    "/gameplay/progression/accomplishments/emitters/accomplishmentEmitterBase.js",
    "/gameplay/progression/accomplishments/emitters/accomplishmentEmitterRegistry.js",

    //specific emitter categories
    "/gameplay/progression/accomplishments/emitters/accountEmitter.js", // Handles accomplishmentAccountData
    "/gameplay/progression/accomplishments/emitters/achievementEmitter.js", // Handles accomplishmentAchievementData
    "/gameplay/progression/accomplishments/emitters/acquiredObjectEmitter.js", // Handles accomplishmentAcquiredObjectData
    "/gameplay/progression/accomplishments/emitters/areaEmitter.js", // Handles accomplishmentAreaData
    "/gameplay/progression/accomplishments/emitters/basicMilestoneEmitter.js", // Handles accomplishmentBasicMilestoneData
    "/gameplay/progression/accomplishments/emitters/combatEmitter.js", // Handles accomplishmentCombatData
    "/gameplay/progression/accomplishments/emitters/competitiveEmitter.js", // Handles accomplishmentCompetitiveData
    "/gameplay/progression/accomplishments/emitters/craftingEmitter.js", // Handles accomplishmentCraftingData
    "/gameplay/progression/accomplishments/emitters/economyEmitter.js", // Handles accomplishmentEconomyData
    "/gameplay/progression/accomplishments/emitters/eventEmitter.js", // Handles accomplishmentEventData
    "/gameplay/progression/accomplishments/emitters/explorationEmitter.js", // Handles accomplishmentExplorationData
    "/gameplay/progression/accomplishments/emitters/learnedEmitter.js", // Handles accomplishmentLearnedData
    "/gameplay/progression/accomplishments/emitters/minigameEmitter.js", // Handles accomplishmentMinigameData
    "/gameplay/progression/accomplishments/emitters/petEmitter.js", // Handles accomplishmentPetData
    "/gameplay/progression/accomplishments/emitters/progressionEmitter.js", // Handles accomplishmentProgressionData
    "/gameplay/progression/accomplishments/emitters/questEmitter.js", // Handles accomplishmentQuestData
    "/gameplay/progression/accomplishments/emitters/socialEmitter.js", // Handles accomplishmentSocialData
    "/gameplay/progression/accomplishments/emitters/statusEmitter.js", // Handles accomplishmentStatusData
    "/gameplay/progression/accomplishments/emitters/technicalEmitter.js", // Handles accomplishmentTechnicalData
    "/gameplay/progression/accomplishments/emitters/usageEmitter.js", // Handles accomplishmentUsageData

    // Template for creating new emitters
    "/gameplay/progression/accomplishments/emitters/emitterTemplate.js",

    // Utility classes for emitters
    "/gameplay/progression/accomplishments/utilities/accomplishmentValidator.js",
    "/gameplay/progression/accomplishments/utilities/accomplishmentConverter.js",
  ];

  static uiSpecialFunctionScripts = [];

  static uiUtilityScripts = [
    "/ui/utilities/responsiveUIManager.js",
    "/ui/utilities/renderSceneSwapper.js",
    "/ui/utilities/uiConstructionLogger.js",
    "/ui/utilities/uiErrorLogger.js",
    "/ui/utilities/uiLoadRequest.js",
    "/ui/utilities/uiLoadRequestManager.js",

    "/ui/uiconstruction/basicfactories/buttonFactory.js",
    "/ui/uiconstruction/basicfactories/containerFactory.js",
    "/ui/uiconstruction/basicfactories/imageFactory.js",
    "/ui/uiconstruction/basicfactories/nodeTriggerFactory.js",
  ];

  static uiSceneScriptsImplemented = [
    "/ui/scenes/implemented/uiSceneGeneralized.js",
    "/ui/scenes/implemented/baseGameUIScene.js",
    "/ui/scenes/implemented/gameWorldSceneGeneralized.js",
    "/ui/scenes/implemented/baseGameWorldScene.js",
    "/ui/scenes/implemented/experienceBarUIScene.js",
  ];

  static cheatPreventionScripts = [
    "/cheatprevention/cheatDetection.js",
    "/cheatprevention/cheatDetectionFactory.js",
    "/cheatprevention/cheatDetectionManager.js",
    "/cheatprevention/cheatPresets.js",
    "/cheatprevention/cheatLogger.js",
    "/cheatprevention/validatorGeneral.js",
  ];
  static uiSceneScriptsNotImplemented = [
    "/ui/scenes/placeholder/playerInventoryUI.js",
    "/ui/scenes/placeholder/loreBookUI.js",
    "/ui/scenes/placeholder/levelCompleteUI.js",
    "/ui/scenes/placeholder/levelUpUI.js",
    "/ui/scenes/placeholder/mainMenuUI.js",
    "/ui/scenes/placeholder/gameStoreUI.js",
    "/ui/scenes/placeholder/achievementsCatalogueUI.js",
    "/ui/scenes/placeholder/achievementsRemarkableUI.js",
    "/ui/scenes/placeholder/cheatWarningUI.js",
  ];
  static lightingScripts = [
    "/lighting/lightingLogger.js",
    "/lighting/lightingColorShiftProfile.js",
    "/lighting/lightingMotionProfile.js",
    "/lighting/lightingMotionPresets.js",
    "/lighting/lightingColorPresets.js",
    "/lighting/lightingPropertyCalculator.js",
    "/lighting/lightingTemplates.js",
    "/lighting/lightingObject.js",
    "/lighting/lightingExperiments.js",
    "/lighting/lightingFactory.js",
    "/lighting/lightingFrameUpdates.js",
    "/lighting/lightingManager.js",
  ];

  static cameraScripts = [
    "/camera/cameraManager.js",
    "/camera/cameraInstructions.js",
  ];

  static inputScripts = [
    // Add input related scripts when available
  ];

  // Top-level gameplay scripts (other gameplay subcategories are loaded separately)
  static gameplayScripts = [
    "/gameplay/levelEventSignal.js",
    "/gameplay/gameplayManagerComposite.js",
    "/gameplay/gameplayEndOfFrameCoordinator.js",
    "/gameplay/gameplayProgressionManager.js",
    "/gameplay/gameplayloggers/gameplayLogger.js",
    "/gameplay/gameplayloggers/movementLogger.js",

    //to do - reorganize
    "/gameplay/player/utilities/playerMovementManager.js",
    "/gameplay/action/movement/tileBoundaryDetector.js",
  ];

  static playerScripts = [
    "/gameplay/player/datastructures/playergamestate/playerStatusComposite.js",
    "/gameplay/player/datastructures/playergamestate/playerCurrentActionStatus.js",
    "/gameplay/player/datastructures/playergamestate/playerUnit.js",
    "/gameplay/player/datastructures/playergamestate/playerInventory.js",
    "/gameplay/player/datastructures/playergamestate/playerUnlocksComposite.js",
    "/gameplay/player/datastructures/accounts/abstractAccount.js",
    "/gameplay/player/datastructures/accounts/guestAccount.js",
    "/gameplay/player/datastructures/accounts/authenticatedAccount.js",
    "/gameplay/player/datastructures/accounts/accountPreferences.js",
    "/gameplay/player/utilities/playerLoader.js",
  ];

  static itemGeneralScripts = [
    "/gameplay/items/general/item.js",
    "/gameplay/items/general/itemBundle.js",
    "/gameplay/items/general/itemPresets.js",
    "/gameplay/items/general/itemFactory.js",
    "/gameplay/items/general/itemUniformBundle.js",
  ];

  static itemVerificationScripts = [
    "/gameplay/items/verification/itemAcquisitionEvent.js",
    "/gameplay/items/verification/itemJustification.js",
    "/gameplay/items/verification/itemLogger.js",
    "/gameplay/items/verification/itemRequestValidator.js",
    "/gameplay/items/verification/itemUsageFailure.js",
    "/gameplay/items/verification/itemUsageFailurePresets.js",
  ];

  static itemRequirementsScripts = [
    "/gameplay/items/itemrequirements/itemRequirementCategory.js",
    "/gameplay/items/itemrequirements/itemRequirementsAccount.js",
    "/gameplay/items/itemrequirements/itemRequirementsBasic.js",
    "/gameplay/items/itemrequirements/itemRequirementsCompletion.js",
    "/gameplay/items/itemrequirements/itemRequirementsPremium.js",
    "/gameplay/items/itemrequirements/itemRequirementsCompetitive.js",
    "/gameplay/items/itemrequirements/itemRequirementsSocial.js",
    "/gameplay/items/itemrequirements/specificItemRequirements.js",
  ];

  static movementScripts = [
    "/gameplay/action/movement/movementDestinationManager.js",
    "/gameplay/action/movement/boundedDestinationCalculator.js",
    "/gameplay/action/movement/unboundedDestinationCalculator.js",

    "/gameplay/action/utilities/obstacleFinder.js",
  ];
  static gameInteractionsScripts = [
    "/gameplay/action/utilities/validActionChecker.js",
  ];

  static rewardScripts = [
    "/gameplay/rewards/rewardManagerComposite.js",
    "/gameplay/rewards/rewardReporter.js",
    "/gameplay/rewards/rewardUIManager.js",

    "/gameplay/rewards/datastructures/rewardBasic.js",
    "/gameplay/rewards/datastructures/rewardBundleHeader.js",
    "/gameplay/rewards/datastructures/rewardBundleComposite.js",
    "/gameplay/rewards/datastructures/rewardSpecial.js",
    "/gameplay/rewards/datastructures/rewardUnlocks.js",
    "/gameplay/rewards/datastructures/rewardReason.js",
    "/gameplay/rewards/datastructures/rewardEventRecord.js",

    "/gameplay/rewards/mojo/mojoAuditor.js",
    "/gameplay/rewards/mojo/mojoUIManager.js",
    "/gameplay/rewards/mojo/mojoManagerComposite.js",
    "/gameplay/rewards/mojo/mojoMilestoneCalculator.js",
  ];
  static gameAreaScripts = [
    "/gameplay/areas/generation/datastructures/obstacle.js",
    "/gameplay/areas/generation/datastructures/levelVictoryCondition.js",
    "/gameplay/areas/generation/datastructures/levelObjective.js",
    "/gameplay/areas/generation/datastructures/levelFeaturedObject.js",
    "/gameplay/areas/generation/datastructures/levelHeaderData.js",
    "/gameplay/areas/generation/datastructures/levelGameplayTraitsData.js",
    "/gameplay/areas/generation/datastructures/levelDataComposite.js",
    "/gameplay/areas/generation/datastructures/boardSlot.js",
    "/gameplay/areas/generation/datastructures/activeGameplayLevel.js",
    "/gameplay/areas/generation/levelFactoryComposite.js",
    "/gameplay/areas/generation/gameGridGenerator.js",
    "/gameplay/areas/generation/levelMapObstacleGenerator.js",
    "/gameplay/areas/generation/datastructures/levelMap.js",
  ];
  static unlockingScriptsRadiantRays = [
    "/gameplay/progression/unlocking/gamespecific/radiantrays/constellationOrLevelUnlockRequirements.js",
    "/gameplay/progression/unlocking/gamespecific/radiantrays/constellationOrLevelUnlockPresets.js",
  ];

  static unlockingScriptsGeneral = [
    "/gameplay/progression/unlocking/datastructures/unlockHeaderData.js",
    "/gameplay/progression/unlocking/datastructures/areaUnlockRequirements.js",
    "/gameplay/progression/unlocking/datastructures/areaUnlockPresets.js",
    "/gameplay/progression/unlocking/datastructures/unlockAccountData.js",
    "/gameplay/progression/unlocking/datastructures/unlockFeasibilityData.js",
    "/gameplay/progression/unlocking/datastructures/unlockProgressData.js",
    "/gameplay/progression/unlocking/datastructures/unlockSocialData.js",
    "/gameplay/progression/unlocking/datastructures/unlockTechnicalData.js",
    "/gameplay/progression/unlocking/datastructures/unlockReport.js",
    "/gameplay/progression/unlocking/datastructures/unlockRequirementsComposite.js",
    "/gameplay/progression/unlocking/datastructures/unlockEvent.js",
    "/gameplay/progression/unlocking/datastructures/unlockPresets.js",

    "/gameplay/progression/unlocking/utilities/unlockReporter.js",
    "/gameplay/progression/unlocking/utilities/unlockValidator.js",
    "/gameplay/progression/unlocking/utilities/unlockUIManager.js",
    "/gameplay/progression/unlocking/unlockManagerComposite.js",

    // to do - add unlock area requirements
  ];

  static soundSystemsScripts = [
    "/utilities/sound/soundEffectsManager.js",
    "/utilities/sound/musicManager.js",
  ];

  static minorUtilityScripts = [
    "/utilities/misc/chadUtilities.js",
    "/utilities/misc/timestampGenie.js",
    "/utilities/misc/randomAssist.js",
    "/utilities/misc/vectorAssist.js",
  ];

  static networkingScripts = [
    "/networking/networkingAccountRetrieval.js",
    "/networking/networkingApiRequest.js",
    "/networking/networkingApiRequestRouter.js",
    "/networking/networkingManager.js",
    "/networking/networkingPlayerSaveRetrieval.js",
    "/networking/networkingRetrievalManager.js",
    "/networking/networkingSaveSubmitter.js",
  ];

  static transactionScripts = [
    "/networking/transactions/transactionInwardValidator.js",
    "/networking/transactions/transactionManager.js",
    "/networking/transactions/transactionOutwardRequest.js",
    "/networking/transactions/transactionUIManager.js",
    "/networking/transactions/successfulTransactionEvent.js",
  ];

  static playerSaveScripts = [
    "/saving/playerSaveLogger.js",
    "/saving/playerSaveManager.js",
    "/saving/playerSaveComposite.js",
    "/saving/playerSaveSettings.js",
    "/saving/playerSaveInventory.js",
    "/saving/playerSaveAchievements.js",
    "/saving/playerSaveIndividualAchievements.js",
    "/saving/playerSaveAllLevelData.js",
    "/saving/playerSaveIndividualLevelData.js",
    "/saving/playerSaveUnlockedArtifacts.js",
    "/saving/playerSaveUnlockedAreas.js",
    "/saving/playerSaveUnlockedMagic.js",
  ];

  static playerSaveBatchingScripts = [
    "/saving/batching/batchconflicts/batchConflict.js",
    "/saving/batching/batchconflicts/batchConflictDetector.js",
    "/saving/batching/batchconflicts/batchConflictResolver.js",
    "/saving/batching/batchtypes/batchAbstract.js",
    "/saving/batching/batchtypes/batchCritical.js",
    "/saving/batching/batchtypes/batchHeavy.js",
    "/saving/batching/batchtypes/batchSlim.js",
    "/saving/batching/batchtypes/batchSuperBackup.js",
    "/saving/batching/batchmanagers/batchCadenceManager.js",
    "/saving/batching/batchmanagers/batchTracker.js",
    "/saving/batching/batchmanagers/batchMergeFactory.js",
  ];

  /**
   * Generic method to get scripts for a specific category.
   * This method replaces all the individual getter methods (getXScripts).
   *
   * Example:
   * // Instead of: ScriptManifest.getLightingScripts()
   * // You can use: ScriptManifest.getScripts('lighting')
   *
   * Available categories:
   * - animation, history, gamemode, occurrence, microEvent, trigger
   * - platformTransaction, testTool, assetManifest, assetLoadersAndManagers
   * - accomplishment, accomplishmentEmitter, uiUtility, uiSceneImplemented
   * - cheatPrevention, lighting, camera, input, gameplay, player
   * - itemGeneral, itemVerification, itemRequirements, movement
   * - gameInteractions, reward, gameArea, unlocking, unlockingRadiantRays
   * - soundSystems, minorUtility, networking, transaction
   * - playerSave, playerSaveBatching
   *
   * @param {string} category - The category name from scriptCategories
   * @returns {Array<string>} Array of script URLs for the category
   */
  static getScripts(category) {
    const categoryInfo = this.scriptCategories.find((c) => c.name === category);
    return categoryInfo ? this[categoryInfo.array] : [];
  }

  /**
   * Generic method to load scripts for a specific category.
   * This method replaces all the individual loader methods (loadXScriptsPromise).
   *
   * Example:
   * // Instead of: ScriptManifest.loadLightingScriptsPromise()
   * // You can use: ScriptManifest.loadCategoryScriptsPromise('lighting')
   *
   * Available categories:
   * - animation, history, gamemode, occurrence, microEvent, trigger
   * - platformTransaction, testTool, assetManifest, assetLoadersAndManagers
   * - accomplishment, accomplishmentEmitter, uiUtility, uiSceneImplemented
   * - cheatPrevention, lighting, camera, input, gameplay, player
   * - itemGeneral, itemVerification, itemRequirements, movement
   * - gameInteractions, reward, gameArea, unlocking, unlockingRadiantRays
   * - soundSystems, minorUtility, networking, transaction
   * - playerSave, playerSaveBatching
   *
   * @param {string} category - The category name from scriptCategories
   * @returns {Promise} Resolves when scripts are loaded
   */
  static loadCategoryScriptsPromise(category) {
    const categoryInfo = this.scriptCategories.find((c) => c.name === category);
    if (!categoryInfo) {
      return Promise.reject(new Error(`Unknown category: ${category}`));
    }

    return this.loadScriptsArray(
      this[categoryInfo.array],
      categoryInfo.displayName
    );
  }

  /**
   * Reports a failure during the loading of a specific script category.
   * Uses InitializationDiagnosticsLogger to log a phase error and registers the catastrophe.
   * Finally, it routes the user to the catastrophe report page.
   *
   * @param {string} categoryName - The name of the category that failed to load.
   * @param {string} errorMsg - A descriptive error message.
   */
  static reportScriptsCategoryFailure(categoryName, errorMsg) {
    const phase = `ScriptLoading-${categoryName}`;
    const fullErrorMessage = `Failure in loading ${categoryName} scripts: ${errorMsg}`;
    InitializationDiagnosticsLogger.logPhaseError(phase, fullErrorMessage);
    CatastropheManager.registerCatastrophe(fullErrorMessage);
    CatastropheManager.displayCatastrophePage();
  }

  /**
   * Loads all scripts from a given array sequentially using async/await.
   * If a script fails to load, the failure is reported and the promise is rejected.
   *
   * @param {Array<string>} scriptArray - Array of script URLs to load.
   * @param {string} categoryName - The name of the script category.
   * @returns {Promise} Resolves when all scripts are loaded or rejects if any fail.
   */
  static loadScriptsArray(scriptArray, categoryName) {
    // Using an async IIFE to loop through scripts sequentially
    return (async () => {
      for (const src of scriptArray) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");

          // Determine the correct script source based on the run mode.
          const scriptSrcWrapped = Config.RUN_LOCALLY_DETERMINED
            ? "." + src
            : "https://radiant-rays.com" + src;

          script.src = scriptSrcWrapped;
          script.async = false; // Force synchronous execution order

          script.onload = () => resolve(src);
          script.onerror = () => {
            // Use the class name explicitly in case "this" context is lost.
            ScriptManifest.reportScriptsCategoryFailure(
              categoryName,
              `Failed to load ${src}`
            );
            //to do update logger

            reject(new Error(`Failed to load ${src}`));
          };

          document.head.appendChild(script);
        });
      }
    })();
  }

  /**
   * Adds one or more categories to the loadsToSkip array.
   * This is useful for developers to dynamically disable script categories.
   *
   * @param {...string} categories - One or more category names to skip
   */
  static skipCategories(...categories) {
    categories.forEach((category) => {
      if (!this.loadsToSkip.includes(category)) {
        this.loadsToSkip.push(category);
      }
    });
    //to do update logger

    console.info(`Updated skip list: ${this.loadsToSkip.join(", ")}`);
  }

  /**
   * Removes one or more categories from the loadsToSkip array.
   * This is useful for developers to re-enable previously skipped categories.
   *
   * @param {...string} categories - One or more category names to unskip
   */
  static unskipCategories(...categories) {
    categories.forEach((category) => {
      const index = this.loadsToSkip.indexOf(category);
      if (index !== -1) {
        this.loadsToSkip.splice(index, 1);
      }
    });
    //to do update logger

    console.info(`Updated skip list: ${this.loadsToSkip.join(", ")}`);
  }

  /**
   * Clears all categories from the loadsToSkip array.
   * This is useful for developers to re-enable all script categories.
   */
  static clearSkipList() {
    this.loadsToSkip = [];
    //to do update logger
    console.info("All script categories will be loaded");
  }

  /**
   * Checks if a specific category should be skipped based on Config settings
   *
   * @param {string} category - The category name to check
   * @returns {boolean} True if the category should be skipped, false otherwise
   */
  static shouldSkipCategory(category) {
    // First check our local loadsToSkip array
    if (this.loadsToSkip.includes(category)) {
      return true;
    }

    // Then check Config arrays directly if available
    try {
      if (typeof Config !== "undefined") {
        // Check LESS_ESSENTIAL_GAMEPLAY_SYSTEMS_TO_SKIP_LOADING
        if (
          Config.LESS_ESSENTIAL_GAMEPLAY_SYSTEMS_TO_SKIP_LOADING &&
          Config.LESS_ESSENTIAL_GAMEPLAY_SYSTEMS_TO_SKIP_LOADING.includes(
            category
          )
        ) {
          return true;
        }

        // Check NETWORKING_SYSTEMS_TO_SKIP_LOADING
        if (
          Config.NETWORKING_SYSTEMS_TO_SKIP_LOADING &&
          Config.NETWORKING_SYSTEMS_TO_SKIP_LOADING.includes(category)
        ) {
          return true;
        }
      }
    } catch (error) {
      console.warn(
        `Error checking if category ${category} should be skipped:`,
        error
      );
    }

    return false;
  }

  /**
   * Loads all script categories sequentially.
   * If any category fails to load, a catastrophe is reported and the promise chain is halted.
   *
   * This method uses the metadata-driven approach with a predefined loading order
   * to ensure scripts are loaded in the exact same sequence as before.
   * The order is critical for dependencies between script categories.
   *
   * During development, categories listed in loadsToSkip will be omitted from loading.
   * The skip list is initialized from Config.SYSTEMS_TO_SKIP_LOADING.
   *
   * @returns {Promise} Resolves when all script categories are successfully loaded.
   */
  static loadAllScriptsPromise() {
    // Initialize the skip list from Config
    this.initializeSkipList();

    // to do - refine and tweak the script loading order including the display of a game loading screen which may involve assets / essential loaders
    // Define the exact loading order to maintain the same sequence as before
    const loadingOrder = [
      "assetLoadersAndManagers",
      "assetManifest",
      "cheatPrevention",
      "uiUtility",
      "uiSceneImplemented",
      "lighting",
      "camera",
      "input",
      "microEvent",
      "trigger",
      "occurrence",
      "animation",
      "movement",
      "gamemode",
      "gameplay",
      "player",
      "gameArea",
      "gameInteractions",
      "soundSystems",
      "minorUtility",
      "testTool",
      "accomplishment",
      "accomplishmentEmitter",
      "history",
      "itemVerification",
      "itemRequirements",
      "platformTransaction",
      "unlocking",
      "unlockingRadiantRays",
      "networking",
      "transaction",
      "playerSave",
      "playerSaveBatching",
      "reward",
      "itemGeneral",
    ];

    // Filter out categories that should be skipped
    const filteredLoadingOrder = loadingOrder.filter(
      (category) => !this.shouldSkipCategory(category)
    );

    // Collect all skipped categories for logging
    const skippedCategories = loadingOrder.filter((category) =>
      this.shouldSkipCategory(category)
    );

    // Log skipped categories if any
    if (skippedCategories.length > 0) {
      console.warn(
        `Development mode: Skipping script categories: ${skippedCategories.join(
          ", "
        )}`
      );
    }

    // Create a promise chain that follows the filtered loading order
    return filteredLoadingOrder
      .reduce((chain, category) => {
        return chain.then(() => {
          //to do update logger

          //console.log(`Loading script category: ${category}`);
          return this.loadCategoryScriptsPromise(category);
        });
      }, Promise.resolve())
      .catch((error) => {
        console.error("Failed to load all scripts:", error);
        CatastropheManager.displayCatastrophePage();
      });
  }
}
