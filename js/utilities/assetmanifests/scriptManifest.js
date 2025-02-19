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
 * GameplayScripts - Items - Verificiation & Item Requirements
 *
 *
 *
 * - PlayerScripts
 * - GameInteractionsScripts
 * - GameAreaScripts
 * - SoundSystemsScripts
 * - MinorUtilityScripts
 *  Networking- General + Utilities
 * - NetworkingScripts - Transcaction
 *  Networking Scripts - Platform Compatibility
 *  Achievements
 * - TransactionScripts
 * - PlayerSaveScripts
 */
class ScriptManifest {
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
    "/gameplay/gameplayLogger.js",
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
    "/gameplay/player/utilities/playerPositionAndModelManager.js",
    "/gameplay/player/utilities/playerModelMovementManager.js",
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

  static gameInteractionsScripts = [
    "/gameplay/interactions/movementPathManager.js",
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

  static getGeneralItemScripts() {
    return this.itemGeneralScripts;
  }

  static getItemVerificationScripts() {
    return this.itemVerificationScripts;
  }

  static getRegionalAdaptationScripts() {
    return this.regionalAdaptationScripts;
  }
  // Getter methods for each script category

  static getAssetManifestScripts() {
    return this.assetManifestScripts;
  }

  static getAssetLoadersAndManagersScripts() {
    return this.assetLoadersAndManagersScripts;
  }

  static getUISceneScriptsImplemented() {
    return this.uiSceneScriptsImplemented;
  }
  static getUIUtilityScripts() {
    return this.uiUtilityScripts;
  }
  static getPlatformTransactionScripts() {
    return this.platformTransactionScripts;
  }

  static getItemRequirementsScripts() {
    return this.itemRequirementsScripts;
  }

  static getLightingScripts() {
    return this.lightingScripts;
  }

  static getCameraScripts() {
    return this.cameraScripts;
  }

  static getInputScripts() {
    return this.inputScripts;
  }

  static getGameplayScripts() {
    return this.gameplayScripts;
  }

  static getPlayerScripts() {
    return this.playerScripts;
  }

  static getGameInteractionsScripts() {
    return this.gameInteractionsScripts;
  }

  static getGameAreaScripts() {
    return this.gameAreaScripts;
  }

  static getSoundSystemsScripts() {
    return this.soundSystemsScripts;
  }

  static getCheatPreventionScripts() {
    return this.cheatPreventionScripts;
  }

  static getMinorUtilityScripts() {
    return this.minorUtilityScripts;
  }

  static getNetworkingScripts() {
    return this.networkingScripts;
  }

  static getTransactionScripts() {
    return this.transactionScripts;
  }

  static getPlayerSaveScripts() {
    return this.playerSaveScripts;
  }

  static getGeneralProgressionScripts() {
    return this.progressionScriptsGeneral;
  }

  static getRadiantRaysProgressionScripts() {
    return this.progressionScriptsRadiantRays;
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

  static loadGeneralItemScriptsPromise() {
    return this.loadScriptsArray(this.getGeneralItemScripts(), "GeneralItem");
  }

  static loadAssetManifestScriptsPromise() {
    return this.loadScriptsArray(
      this.getAssetManifestScripts(),
      "AssetManifest"
    );
  }
  static loadGeneralProgressionScriptsPromise() {
    return this.loadScriptsArray(
      this.getGeneralProgressionScripts(),
      "GeneralProgression"
    );
  }
  static loadRegionalAdaptationScriptsPromise() {
    return this.loadScriptsArray(
      this.getRegionalAdaptationScripts(),
      "RegionalAdaptation"
    );
  }

  static loadRadiantRaysProgressionScriptsPromise() {
    return this.loadScriptsArray(
      this.getRadiantRaysProgressionScripts(),
      "RadiantRaysProgression"
    );
  }
  static loadAssetLoadersAndManagersScriptsPromise() {
    return this.loadScriptsArray(
      this.getAssetLoadersAndManagersScripts(),
      "AssetLoadersAndManagers"
    );
  }

  static loadItemRequirementsScriptsPromise() {
    return this.loadScriptsArray(
      this.getItemRequirementsScripts(),
      "ItemRequirements"
    );
  }

  static loadUISceneScriptsImplementedPromise() {
    return this.loadScriptsArray(
      this.getUISceneScriptsImplemented(),
      "UISceneScriptsImplemented"
    );
  }

  static loadLightingScriptsPromise() {
    return this.loadScriptsArray(this.getLightingScripts(), "Lighting");
  }

  static loadCameraScriptsPromise() {
    return this.loadScriptsArray(this.getCameraScripts(), "Camera");
  }

  static loadInputScriptsPromise() {
    return this.loadScriptsArray(this.getInputScripts(), "Input");
  }

  static loadItemVerificationScriptsPromise() {
    return this.loadScriptsArray(
      this.getItemVerificationScripts(),
      "ItemVerification"
    );
  }

  static loadCheatPreventionScriptsPromise() {
    return this.loadScriptsArray(
      this.getCheatPreventionScripts(),
      "CheatPrevention"
    );
  }
  static loadGameplayScriptsPromise() {
    return this.loadScriptsArray(this.getGameplayScripts(), "Gameplay");
  }

  static loadPlayerScriptsPromise() {
    return this.loadScriptsArray(this.getPlayerScripts(), "Player");
  }

  static loadGameInteractionsScriptsPromise() {
    return this.loadScriptsArray(
      this.getGameInteractionsScripts(),
      "GameInteractions"
    );
  }

  static loadPlatformTransactionScriptsPromise() {
    return this.loadScriptsArray(
      this.getPlatformTransactionScripts(),
      "PlatformTransactions"
    );
  }

  static loadGameAreaScriptsPromise() {
    return this.loadScriptsArray(this.getGameAreaScripts(), "GameArea");
  }

  static loadSoundSystemsScriptsPromise() {
    return this.loadScriptsArray(this.getSoundSystemsScripts(), "SoundSystems");
  }

  static loadMinorUtilityScriptsPromise() {
    return this.loadScriptsArray(this.getMinorUtilityScripts(), "MinorUtility");
  }

  static loadNetworkingScriptsPromise() {
    return this.loadScriptsArray(this.getNetworkingScripts(), "Networking");
  }

  static loadTransactionScriptsPromise() {
    return this.loadScriptsArray(this.getTransactionScripts(), "Transaction");
  }

  static loadPlayerSaveScriptsPromise() {
    return this.loadScriptsArray(this.getPlayerSaveScripts(), "PlayerSave");
  }

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
      .then(() => this.loadGameplayScriptsPromise())
      .then(() => this.loadPlayerScriptsPromise())
      .then(() => this.loadGeneralProgressionScriptsPromise())
      .then(() => this.loadGameAreaScriptsPromise())
      .then(() => this.loadGameInteractionsScriptsPromise())
      .then(() => this.loadRadiantRaysProgressionScriptsPromise())
      .then(() => this.loadSoundSystemsScriptsPromise())
      .then(() => this.loadMinorUtilityScriptsPromise())
      .catch((error) => {
        console.error("Failed to load all scripts:", error);
        CatastropheManager.displayCatastrophePage();
      });
  }
}
