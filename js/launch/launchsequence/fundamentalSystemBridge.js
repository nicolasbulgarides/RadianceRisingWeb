/**
 * FundamentalSystemBridge acts as a centralized registry for critical systems.
 * It holds references to various engine and game managers for quick access.
 *
 * Note: This class is built to work in a static context. All manager references are
 * stored as static fields.
 */
class FundamentalSystemBridge {
  // Static fields for system references (singletons).

  /**
   * Generic method to register a manager instance.
   * @param {string} managerName - The name of the manager to register.
   * @param {Object} managerInstance - The manager instance to register.
   * @param {Function} instanceType - The constructor function of the expected type.
   */
  static registerManager(managerName, managerInstance, instanceType) {
    if (managerInstance instanceof instanceType) {
      FundamentalSystemBridge[managerName] = managerInstance;
    } else {
      const providedType = typeof managerInstance;
      FundamentalSystemBridge.logCatastrophicRegistration(
        managerName,
        providedType
      );
    }
  }

  static registerAccomplishmentEmitterRegistry(accomplishmentEmitterRegistry) {
    FundamentalSystemBridge.registerManager(
      "accomplishmentEmitterRegistry",
      accomplishmentEmitterRegistry,
      AccomplishmentEmitterRegistry
    );
  }
  static registerBabylonEngine(engine) {
    FundamentalSystemBridge.registerManager(
      "babylonEngine",
      engine,
      BABYLON.Engine
    );
  }

  static registerHistoryManager(historyManager) {
    FundamentalSystemBridge.registerManager(
      "historyManager",
      historyManager,
      HistoryManager
    );
  }

  static registerPrimaryGameplayCameraManager(primaryCameraManager) {
    FundamentalSystemBridge.registerManager(
      "primaryGameplayCameraManager",
      primaryCameraManager,
      CameraManager
    );
  }

  static registerSecondaryGameplayCameraManager(secondaryCameraManager) {
    FundamentalSystemBridge.registerManager(
      "secondaryGameplayCameraManager",
      secondaryCameraManager,
      CameraManager
    );
  }

  static registerItemManager(itemManager) {
    FundamentalSystemBridge.registerManager(
      "itemManager",
      itemManager,
      ItemManager
    );
  }

  static registerAchievementManager(achievementManager) {
    FundamentalSystemBridge.registerManager(
      "achievementManager",
      achievementManager,
      AchievementManager
    );
  }

  static registerTransactionManager(transactionManager) {
    FundamentalSystemBridge.registerManager(
      "transactionManager",
      transactionManager,
      TransactionManager
    );
  }

  static loadLevelFactoryComposite() {
    let levelFactoryComposite = new LevelFactoryComposite();
    FundamentalSystemBridge.registerManager(
      "levelFactoryComposite",
      levelFactoryComposite,
      LevelFactoryComposite
    );
    FundamentalSystemBridge[
      "levelFactoryComposite"
    ].loadFactorySupportSystems();
  }

  static registerUIConstructionGrandManager(uiConstructionGrandManager) {
    FundamentalSystemBridge.registerManager(
      "uiConstructionGrandManager",
      uiConstructionGrandManager,
      UIConstructionGrandManager
    );
  }

  static registerPlayerSaveManager(playerSaveManager) {
    FundamentalSystemBridge.registerManager(
      "playerSaveManager",
      playerSaveManager,
      PlayerSaveManager
    );
  }

  static registerRadiantEngineManager(radiantEngineManager) {
    FundamentalSystemBridge.registerManager(
      "radiantEngineManager",
      radiantEngineManager,
      RadiantEngineManager
    );
  }

  static registerNetworkingManager(networkingManager) {
    FundamentalSystemBridge.registerManager(
      "networkingManager",
      networkingManager,
      NetworkingManager
    );
  }

  static loadGameplayManagerComposite() {
    let gameplayManagerComposite = new GameplayManagerComposite();
    FundamentalSystemBridge.registerManager(
      "gameplayManagerComposite",
      gameplayManagerComposite,
      GameplayManagerComposite
    );
  }

  static loadPlayerStatusTracker() {
    let playerStatusTracker = new PlayerStatusTracker();
    FundamentalSystemBridge.registerManager(
      "playerStatusTracker",
      playerStatusTracker,
      PlayerStatusTracker
    );
  }

  static registerPrimaryGameplayLightingManager(
    primaryGameplayLightingManager
  ) {
    FundamentalSystemBridge.registerManager(
      "primaryGameplayLightingManager",
      primaryGameplayLightingManager,
      LightingManager
    );
  }

  static registerSecondaryGameplayLightingManager(
    secondaryGameplayLightingManager
  ) {
    FundamentalSystemBridge.registerManager(
      "secondaryGameplayLightingManager",
      secondaryGameplayLightingManager,
      LightingManager
    );
  }

  /**
   * Loads he Soundand Music Managers instances.
   */
  static loadSoundManagers() {
    let musicManager = new MusicManager();
    FundamentalSystemBridge.registerManager(
      "musicManager",
      musicManager,
      MusicManager
    );
    let soundEffectsManager = new SoundEffectsManager();
    FundamentalSystemBridge.registerManager(
      "soundEffectsManager",
      soundEffectsManager,
      SoundEffectsManager
    );
  }

  /**
   * Registers the UILoadRequestManager instance.
   * @param {UILoadRequestManager} uiLoadRequestManager - The ui load request manager instance.
   */
  static registerUILoadRequestManager(uiLoadRequestManager) {
    if (uiLoadRequestManager instanceof UILoadRequestManager) {
      FundamentalSystemBridge["uiLoadRequestManager"] = uiLoadRequestManager;
    }
  }

  static possiblyLoadAndActivateTestManager() {
    if (Config.LOAD_TEST_MANAGER) {
      let testManager = new TestManager();
      FundamentalSystemBridge.registerManager(
        "testManager",
        testManager,
        TestManager
      );
      FundamentalSystemBridge["testManager"].processTestOrders(
        FundamentalSystemBridge["gameplayManagerComposite"]
      );
    }
  }

  static loadAndActivateLevelLoaderManager() {
    let levelLoaderManager = new LevelLoaderManager();
    FundamentalSystemBridge.registerManager(
      "levelLoaderManager",
      levelLoaderManager,
      LevelLoaderManager
    );

    levelLoaderManager.loadLevelTest1(FundamentalSystemBridge["gameplayManagerComposite"]);


  }

  static loadUnlockManager() {
    let unlockManager = new UnlockManager();
    FundamentalSystemBridge.registerManager(
      "unlockManager",
      unlockManager,
      UnlockManager
    );
  }

  static loadProgrammaticAnimationManager() {
    let programmaticAnimationManager = new ProgrammaticAnimationManager();
    FundamentalSystemBridge.registerManager(
      "programmaticAnimationManager",
      programmaticAnimationManager,
      ProgrammaticAnimationManager
    );
  }

  static loadActiveTriggerManager() {
    let activeTriggerManager = new ActiveTriggerManager();
    FundamentalSystemBridge.registerManager(
      "activeTriggerManager",
      activeTriggerManager,
      ActiveTriggerManager
    );
  }

  static registerSpecialOccurrenceManager(specialOccurrenceManager) {
    FundamentalSystemBridge.registerManager(
      "specialOccurrenceManager",
      specialOccurrenceManager,
      SpecialOccurrenceManager
    );
  }
  static registerMicroEventManager(microEventManager) {
    FundamentalSystemBridge.registerManager(
      "microEventManager",
      microEventManager,
      MicroEventManager
    );
  }

  static loadRenderSceneSwapper() {
    let renderSceneSwapper = new RenderSceneSwapper();
    FundamentalSystemBridge.registerManager(
      "renderSceneSwapper",
      renderSceneSwapper,
      RenderSceneSwapper
    );
  }

  /**
   * Registers the CollectiblePlacementManager instance.
   * @param {CollectiblePlacementManager} collectiblePlacementManager - The collectible placement manager instance.
   */
  static registerCollectiblePlacementManager(collectiblePlacementManager) {
    FundamentalSystemBridge.registerManager(
      "collectiblePlacementManager",
      collectiblePlacementManager,
      CollectiblePlacementManager
    );
  }

  static registerLevelsSolvedStatusTracker(levelsSolvedStatusTracker) {
    FundamentalSystemBridge.registerManager(
      "levelsSolvedStatusTracker",
      levelsSolvedStatusTracker,
      LevelsSolvedStatusTracker
    );
  }

  /**
   * Logs a catastrophic registration error.
   * @param {string} systemName - The name of the system being registered.
   * @param {string} providedType - The type of object that was provided.
   * This method attempts to log the error via the CatastropheManager and LoggerOmega.
   * If logging services are missing, it falls back to console logging.
   */
  static logCatastrophicRegistration(systemName, providedType) {
    // Build the error message with proper spacing.
    const catastrophe =
      systemName +
      " CATASTROPHE: incorrect object type registered in FundamentalSystemBridge. " +
      "Provided type: " +
      providedType;

    // Attempt to log the error via the CatastropheManager and LoggerOmega.
    // Fallback to console.log if logging services are missing.
    try {
      CatastropheManager.registerCatastrophe(catastrophe);
      LoggerOmega.SmartLog(
        Config.LOGGING_CRITICAL_SYSTEMS_ENABLED,
        catastrophe,
        "FSBridge-" + systemName
      );
    } catch (error) {
      console.log(
        "Error in logCatastrophicRegistration of FundamentalSystemBridge - Catastrophe Manager or Logger not found: " +
        error.message
      );
    }
  }
}
