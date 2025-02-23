/**
 * ScriptManifest Class
 *
 * Defines separate arrays of script URLs for each functional category required by the application.
 * Each category has a dedicated getter method and an associated promise-based loader.
 *
 * On a script loading failure the following happens:
 *   • InitializationDiagnosticsLogger.logPhaseError is called to record the failure.
 *   • CatastropheManager.registerCatastrophe is invoked to log the catastrophic error.
 *   • CatastropheManager.displayCatastrophePage routes to catastropheReport.html.
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
    "/gameplay/gamemodes/specificmodes/gamemodeTestAssist.js",
    "/gameplay/gamemodes/gamemodeCurrentEnforcings.js",
  ];
  static occurrenceScripts = [
    "/gameplay/interactions/occurrences/specialOccurrenceComposite.js",
    "/gameplay/interactions/occurrences/specialOccurrenceManager.js",
    "/gameplay/interactions/occurrences/occurrenceFactory.js",

    "/gameplay/interactions/datastructures/specialOccurrenceBasicData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceHeader.js",
    "/gameplay/interactions/datastructures/specialOccurrenceStatus.js",
    "/gameplay/interactions/datastructures/specialOccurrenceHyperspecificOtherData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceItemData.js",
    "/gameplay/interactions/datastructures/specialOccurrencePetData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceProgressData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceCompetitiveData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceSocialData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceSpecialEventData.js",
    "/gameplay/interactions/datastructures/specialOccurrenceUnlockData.js",
  ];

  static triggerScripts = [
    "/gameplay/interactions/triggers/triggerReadyCheck.js",
    "/gameplay/interactions/triggers/triggerEvent.js",
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

  static testToolScripts = ["/gameplay/testtools/testManager.js"];
  static assetManifestScripts = [
    "/utilities/assetmanifests/assetManifest.js",
    "/utilities/assetmanifests/assetManifestOverrides.js",
    "/utilities/assetmanifests/uiAssetManifest.js",
    "/utilities/assetmanifests/itemIconAssetManifest.js",
    "/utilities/assetmanifests/soundAssetManifest.js",
    "/utilities/assetmanifests/songAssetManifest.js",
  ];

  static assetLoadersAndManagersScripts = [
    "/utilities/loaders/positionedObject.js",
    "/utilities/loaders/modelLoader.js",
    "/utilities/loaders/modelLoadingLogger.js",
    "/utilities/loaders/animatedModelLoader.js",
    "/utilities/loaders/sceneBuilder.js",
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
    "/gameplay/gameplayManagerComposite.js",
    "/gameplay/gameplayEndOfFrameCoordinator.js",
    "/gameplay/gameplayloggers/gameplayLogger.js",
    "/gameplay/gameplayloggers/movementLogger.js",
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
    "/gameplay/player/utilities/playerMovementManager.js",
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
    "/gameplay/action/movement/movementDestinationCalculator.js",
  ];
  static gameInteractionsScripts = [
    "/gameplay/action/utilities/validActionChecker.js",
  ];
  static gameAreaScripts = [
    "/gameplay/areas/interactions/obstacle.js",
    "/gameplay/areas/interactions/obstacleFinder.js",
    "/gameplay/areas/generation/levelData.js",
    "/gameplay/areas/generation/boardSlot.js",
    "/gameplay/areas/generation/activeGameplayLevel.js",
    "/gameplay/areas/generation/levelFactoryComposite.js",
    "/gameplay/areas/generation/gameGridGenerator.js",
    "/gameplay/areas/generation/levelMapObstacleGenerator.js",
    "/gameplay/areas/generation/levelMap.js",
  ];

  static progressionScriptsRadiantRays = [
    "/gameplay/progression/gamespecific/radiantrays/constellationOrLevelUnlockRequirements.js",
    "/gameplay/progression/gamespecific/radiantrays/constellationOrLevelUnlockValidator.js",
    "/gameplay/progression/gamespecific/radiantrays/constellationOrLevelUnlockPresets.js",
  ];

  static progressionScriptsGeneral = [
    "/gameplay/progression/general/areaunlocking/areaUnlockRequirements.js",
    "/gameplay/progression/general/areaunlocking/areaUnlockValidator.js",
    "/gameplay/progression/general/areaunlocking/areaUnlockPresets.js",
    "/gameplay/progression/general/areaunlocking/areaUnlockManager.js",

    "/gameplay/progression/general/unlockarchetypes/requirementsGeneral.js",

    "/gameplay/progression/general/unlockarchetypes/accountRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/achievementRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/areaRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/artifactRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/basicStatRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/itemRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/gameModeRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/premiumRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/specialRequirementsComposite.js",
    "/gameplay/progression/general/unlockarchetypes/unlockRequirementsComposite.js",
  ];

  static soundSystemsScripts = [
    "/utilities/sound/soundEffectsManager.js",
    "/utilities/sound/musicManager.js",
  ];

  static minorUtilityScripts = [
    "/utilities/misc/chadUtilities.js",
    "/utilities/misc/timestampGenie.js",
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
   * Retrieves the general item scripts.
   * @returns {Array<string>} Array of general item script URLs.
   */
  static getGeneralItemScripts() {
    return this.itemGeneralScripts;
  }

  /**
   * Retrieves the test tool scripts.
   * @returns {Array<string>} Array of test tool script URLs.
   */
  static getTestToolScripts() {
    return this.testToolScripts;
  }

  /**
   * Retrieves the item verification scripts.
   * @returns {Array<string>} Array of item verification script URLs.
   */
  static getItemVerificationScripts() {
    return this.itemVerificationScripts;
  }

  /**
   * Retrieves the regional adaptation scripts.
   * @returns {Array<string>} Array of regional adaptation script URLs.
   */
  static getRegionalAdaptationScripts() {
    return this.regionalAdaptationScripts;
  }

  /**
   * Retrieves the gamemode scripts.
   * @returns {Array<string>} Array of gamemode script URLs.
   */
  static getGamemodeScripts() {
    return this.gamemodeScripts;
  }

  /**
   * Retrieves the asset manifest scripts.
   * @returns {Array<string>} Array of asset manifest script URLs.
   */
  static getAssetManifestScripts() {
    return this.assetManifestScripts;
  }

  /**
   * Retrieves the asset loaders and managers scripts.
   * @returns {Array<string>} Array of asset loaders and managers script URLs.
   */
  static getAssetLoadersAndManagersScripts() {
    return this.assetLoadersAndManagersScripts;
  }

  /**
   * Retrieves the implemented UI scene scripts.
   * @returns {Array<string>} Array of implemented UI scene script URLs.
   */
  static getUISceneScriptsImplemented() {
    return this.uiSceneScriptsImplemented;
  }

  static getMovementScripts() {
    return this.movementScripts;
  }

  /**
   * Retrieves the UI utility scripts.
   * @returns {Array<string>} Array of UI utility script URLs.
   */
  static getUIUtilityScripts() {
    return this.uiUtilityScripts;
  }

  /**
   * Retrieves the platform transaction scripts.
   * @returns {Array<string>} Array of platform transaction script URLs.
   */
  static getPlatformTransactionScripts() {
    return this.platformTransactionScripts;
  }

  /**
   * Retrieves the item requirements scripts.
   * @returns {Array<string>} Array of item requirements script URLs.
   */
  static getItemRequirementsScripts() {
    return this.itemRequirementsScripts;
  }

  /**
   * Retrieves the history scripts.
   * @returns {Array<string>} Array of history script URLs.
   */
  static getHistoryScripts() {
    return this.historyScripts;
  }

  /**
   * Retrieves the lighting scripts.
   * @returns {Array<string>} Array of lighting script URLs.
   */
  static getLightingScripts() {
    return this.lightingScripts;
  }

  /**
   * Retrieves the camera scripts.
   * @returns {Array<string>} Array of camera script URLs.
   */
  static getCameraScripts() {
    return this.cameraScripts;
  }

  /**
   * Retrieves the input scripts.
   * @returns {Array<string>} Array of input script URLs.
   */
  static getInputScripts() {
    return this.inputScripts;
  }

  /**
   * Retrieves the gameplay scripts.
   * @returns {Array<string>} Array of gameplay script URLs.
   */
  static getGameplayScripts() {
    return this.gameplayScripts;
  }

  /**
   * Retrieves the player scripts.
   * @returns {Array<string>} Array of player script URLs.
   */
  static getPlayerScripts() {
    return this.playerScripts;
  }

  /**
   * Retrieves the game interactions scripts.
   * @returns {Array<string>} Array of game interactions script URLs.
   */
  static getGameInteractionsScripts() {
    return this.gameInteractionsScripts;
  }

  /**
   * Retrieves the game area scripts.
   * @returns {Array<string>} Array of game area script URLs.
   */
  static getGameAreaScripts() {
    return this.gameAreaScripts;
  }

  /**
   * Retrieves the sound systems scripts.
   * @returns {Array<string>} Array of sound systems script URLs.
   */
  static getSoundSystemsScripts() {
    return this.soundSystemsScripts;
  }

  /**
   * Retrieves the trigger scripts.
   * @returns {Array<string>} Array of trigger script URLs.
   */
  static getTriggerScripts() {
    return this.triggerScripts;
  }

  /**
   * Retrieves the cheat prevention scripts.
   * @returns {Array<string>} Array of cheat prevention script URLs.
   */
  static getCheatPreventionScripts() {
    return this.cheatPreventionScripts;
  }

  /**
   * Retrieves the minor utility scripts.
   * @returns {Array<string>} Array of minor utility script URLs.
   */
  static getMinorUtilityScripts() {
    return this.minorUtilityScripts;
  }

  /**
   * Retrieves the networking scripts.
   * @returns {Array<string>} Array of networking script URLs.
   */
  static getNetworkingScripts() {
    return this.networkingScripts;
  }

  /**
   * Retrieves the transaction scripts.
   * @returns {Array<string>} Array of transaction script URLs.
   */
  static getTransactionScripts() {
    return this.transactionScripts;
  }

  /**
   * Retrieves the player save scripts.
   * @returns {Array<string>} Array of player save script URLs.
   */
  static getPlayerSaveScripts() {
    return this.playerSaveScripts;
  }

  /**
   * Retrieves the general progression scripts.
   * @returns {Array<string>} Array of general progression script URLs.
   */
  static getGeneralProgressionScripts() {
    return this.progressionScriptsGeneral;
  }

  /**
   * Retrieves the radiant rays progression scripts.
   * @returns {Array<string>} Array of radiant rays progression script URLs.
   */
  static getRadiantRaysProgressionScripts() {
    return this.progressionScriptsRadiantRays;
  }

  /**
   * Retrieves the radiant rays animation scripts.
   * @returns {Array<string>} Array of radiant rays animation script URLs.
   */
  static getRadiantRaysAnimationScripts() {
    return this.animationScripts;
  }

  /**
   * Retrieves the radiant rays trigger scripts.
   * @returns {Array<string>} Array of radiant rays trigger script URLs.
   */
  static getRadiantRaysTriggerScripts() {
    return this.triggerScripts;
  }

  /**
   * Retrieves the radiant rays occurrence scripts.
   * @returns {Array<string>} Array of radiant rays occurrence script URLs.
   */
  static getRadiantRaysOccurenceScripts() {
    return this.occurenceScripts;
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
            reject(new Error(`Failed to load ${src}`));
          };

          document.head.appendChild(script);
        });
      }
    })();
  }

  /**
   * Loads the gamemode scripts and returns a promise.
   * @returns {Promise} Resolves when gamemode scripts are loaded.
   */
  static loadGamemodeScriptsPromise() {
    return this.loadScriptsArray(this.getGamemodeScripts(), "Gamemode");
  }

  /**
   * Loads the general item scripts and returns a promise.
   * @returns {Promise} Resolves when general item scripts are loaded.
   */
  static loadGeneralItemScriptsPromise() {
    return this.loadScriptsArray(this.getGeneralItemScripts(), "GeneralItem");
  }

  /**
   * Loads the test tool scripts and returns a promise.
   * @returns {Promise} Resolves when test tool scripts are loaded.
   */
  static loadTestToolScriptsPromise() {
    return this.loadScriptsArray(this.getTestToolScripts(), "TestTool");
  }

  /**
   * Loads the trigger scripts and returns a promise.
   * @returns {Promise} Resolves when trigger scripts are loaded.
   */
  static loadTriggerScriptsPromise() {
    return this.loadScriptsArray(this.getTriggerScripts(), "Trigger");
  }

  /**
   * Loads the occurrence scripts and returns a promise.
   * @returns {Promise} Resolves when occurrence scripts are loaded.
   */
  static loadOccurenceScriptsPromise() {
    return this.loadScriptsArray(this.getOccurenceScripts(), "Occurence");
  }

  /**
   * Loads the asset manifest scripts and returns a promise.
   * @returns {Promise} Resolves when asset manifest scripts are loaded.
   */
  static loadAssetManifestScriptsPromise() {
    return this.loadScriptsArray(
      this.getAssetManifestScripts(),
      "AssetManifest"
    );
  }

  /**
   * Loads the general progression scripts and returns a promise.
   * @returns {Promise} Resolves when general progression scripts are loaded.
   */
  static loadGeneralProgressionScriptsPromise() {
    return this.loadScriptsArray(
      this.getGeneralProgressionScripts(),
      "GeneralProgression"
    );
  }

  /**
   * Loads the regional adaptation scripts and returns a promise.
   * @returns {Promise} Resolves when regional adaptation scripts are loaded.
   */
  static loadRegionalAdaptationScriptsPromise() {
    return this.loadScriptsArray(
      this.getRegionalAdaptationScripts(),
      "RegionalAdaptation"
    );
  }

  /**
   * Loads the radiant rays progression scripts and returns a promise.
   * @returns {Promise} Resolves when radiant rays progression scripts are loaded.
   */
  static loadRadiantRaysProgressionScriptsPromise() {
    return this.loadScriptsArray(
      this.getRadiantRaysProgressionScripts(),
      "RadiantRaysProgression"
    );
  }

  /**
   * Loads the asset loaders and managers scripts and returns a promise.
   * @returns {Promise} Resolves when asset loaders and managers scripts are loaded.
   */
  static loadAssetLoadersAndManagersScriptsPromise() {
    return this.loadScriptsArray(
      this.getAssetLoadersAndManagersScripts(),
      "AssetLoadersAndManagers"
    );
  }

  /**
   * Loads the item requirements scripts and returns a promise.
   * @returns {Promise} Resolves when item requirements scripts are loaded.
   */
  static loadItemRequirementsScriptsPromise() {
    return this.loadScriptsArray(
      this.getItemRequirementsScripts(),
      "ItemRequirements"
    );
  }

  /**
   * Loads the implemented UI scene scripts and returns a promise.
   * @returns {Promise} Resolves when implemented UI scene scripts are loaded.
   */
  static loadUISceneScriptsImplementedPromise() {
    return this.loadScriptsArray(
      this.getUISceneScriptsImplemented(),
      "UISceneScriptsImplemented"
    );
  }

  /**
   * Loads the lighting scripts and returns a promise.
   * @returns {Promise} Resolves when lighting scripts are loaded.
   */
  static loadLightingScriptsPromise() {
    return this.loadScriptsArray(this.getLightingScripts(), "Lighting");
  }

  static loadMovementScriptsPromise() {
    return this.loadScriptsArray(this.getMovementScripts(), "Movement");
  }

  /**
   * Loads the camera scripts and returns a promise.
   * @returns {Promise} Resolves when camera scripts are loaded.
   */
  static loadCameraScriptsPromise() {
    return this.loadScriptsArray(this.getCameraScripts(), "Camera");
  }

  /**
   * Loads the input scripts and returns a promise.
   * @returns {Promise} Resolves when input scripts are loaded.
   */
  static loadInputScriptsPromise() {
    return this.loadScriptsArray(this.getInputScripts(), "Input");
  }

  /**
   * Loads the history scripts and returns a promise.
   * @returns {Promise} Resolves when history scripts are loaded.
   */
  static loadHistoryScriptsPromise() {
    return this.loadScriptsArray(this.getHistoryScripts(), "History");
  }

  /**
   * Loads the item verification scripts and returns a promise.
   * @returns {Promise} Resolves when item verification scripts are loaded.
   */
  static loadItemVerificationScriptsPromise() {
    return this.loadScriptsArray(
      this.getItemVerificationScripts(),
      "ItemVerification"
    );
  }

  /**
   * Loads the cheat prevention scripts and returns a promise.
   * @returns {Promise} Resolves when cheat prevention scripts are loaded.
   */
  static loadCheatPreventionScriptsPromise() {
    return this.loadScriptsArray(
      this.getCheatPreventionScripts(),
      "CheatPrevention"
    );
  }

  /**
   * Loads the gameplay scripts and returns a promise.
   * @returns {Promise} Resolves when gameplay scripts are loaded.
   */
  static loadGameplayScriptsPromise() {
    return this.loadScriptsArray(this.getGameplayScripts(), "Gameplay");
  }

  /**
   * Loads the player scripts and returns a promise.
   * @returns {Promise} Resolves when player scripts are loaded.
   */
  static loadPlayerScriptsPromise() {
    return this.loadScriptsArray(this.getPlayerScripts(), "Player");
  }

  /**
   * Loads the game interactions scripts and returns a promise.
   * @returns {Promise} Resolves when game interactions scripts are loaded.
   */
  static loadGameInteractionsScriptsPromise() {
    return this.loadScriptsArray(
      this.getGameInteractionsScripts(),
      "GameInteractions"
    );
  }

  /**
   * Loads the radiant rays animation scripts and returns a promise.
   * @returns {Promise} Resolves when radiant rays animation scripts are loaded.
   */
  static loadRadiantRaysAnimationScriptsPromise() {
    return this.loadScriptsArray(
      this.getRadiantRaysAnimationScripts(),
      "RadiantRaysAnimation"
    );
  }

  /**
   * Loads the platform transaction scripts and returns a promise.
   * @returns {Promise} Resolves when platform transaction scripts are loaded.
   */
  static loadPlatformTransactionScriptsPromise() {
    return this.loadScriptsArray(
      this.getPlatformTransactionScripts(),
      "PlatformTransactions"
    );
  }

  /**
   * Loads the game area scripts and returns a promise.
   * @returns {Promise} Resolves when game area scripts are loaded.
   */
  static loadGameAreaScriptsPromise() {
    return this.loadScriptsArray(this.getGameAreaScripts(), "GameArea");
  }

  /**
   * Loads the sound systems scripts and returns a promise.
   * @returns {Promise} Resolves when sound systems scripts are loaded.
   */
  static loadSoundSystemsScriptsPromise() {
    return this.loadScriptsArray(this.getSoundSystemsScripts(), "SoundSystems");
  }

  /**
   * Loads the minor utility scripts and returns a promise.
   * @returns {Promise} Resolves when minor utility scripts are loaded.
   */
  static loadMinorUtilityScriptsPromise() {
    return this.loadScriptsArray(this.getMinorUtilityScripts(), "MinorUtility");
  }

  /**
   * Loads the networking scripts and returns a promise.
   * @returns {Promise} Resolves when networking scripts are loaded.
   */
  static loadNetworkingScriptsPromise() {
    return this.loadScriptsArray(this.getNetworkingScripts(), "Networking");
  }

  /**
   * Loads the transaction scripts and returns a promise.
   * @returns {Promise} Resolves when transaction scripts are loaded.
   */
  static loadTransactionScriptsPromise() {
    return this.loadScriptsArray(this.getTransactionScripts(), "Transaction");
  }

  /**
   * Loads the player save scripts and returns a promise.
   * @returns {Promise} Resolves when player save scripts are loaded.
   */
  static loadPlayerSaveScriptsPromise() {
    return this.loadScriptsArray(this.getPlayerSaveScripts(), "PlayerSave");
  }

  /**
   * Loads the UI utility scripts and returns a promise.
   * @returns {Promise} Resolves when UI utility scripts are loaded.
   */
  static loadUIUtilityScriptsPromise() {
    return this.loadScriptsArray(this.getUIUtilityScripts(), "UIUtility");
  }

  /**
   * Loads all script categories sequentially.
   * If any category fails to load, a catastrophe is reported and the promise chain is halted.
   *
   * @returns {Promise} Resolves when all script categories are successfully loaded.
   */
  static loadAllScriptsPromise() {
    return this.loadAssetLoadersAndManagersScriptsPromise()
      .then(() => this.loadAssetManifestScriptsPromise())
      .then(() => this.loadCheatPreventionScriptsPromise())
      .then(() => this.loadUIUtilityScriptsPromise())
      .then(() => this.loadUISceneScriptsImplementedPromise())
      .then(() => this.loadLightingScriptsPromise())
      .then(() => this.loadCameraScriptsPromise())
      .then(() => this.loadInputScriptsPromise())
      .then(() => this.loadTriggerScriptsPromise())
      .then(() => this.loadRadiantRaysAnimationScriptsPromise())
      .then(() => this.loadMovementScriptsPromise())
      .then(() => this.loadGamemodeScriptsPromise())
      .then(() => this.loadGameplayScriptsPromise())
      .then(() => this.loadPlayerScriptsPromise())
      .then(() => this.loadGeneralProgressionScriptsPromise())
      .then(() => this.loadGameAreaScriptsPromise())
      .then(() => this.loadGameInteractionsScriptsPromise())
      .then(() => this.loadRadiantRaysProgressionScriptsPromise())
      .then(() => this.loadSoundSystemsScriptsPromise())
      .then(() => this.loadMinorUtilityScriptsPromise())
      .then(() => this.loadTestToolScriptsPromise())
      .catch((error) => {
        console.error("Failed to load all scripts:", error);
        CatastropheManager.displayCatastrophePage();
      });
  }
}
