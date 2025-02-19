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
   * Constructor for FundamentalSystemBridge.
   * Although system references are stored statically, an instance
   * constructor has been provided for potential future instance-level logic.
   */
  constructor() {
    this.initializeStorage();
    // Instance-level initialization (currently unused).
  }

  initializeStorage() {
    FundamentalSystemBridge.babylonEngine = null;
    FundamentalSystemBridge.radiantEngineManager = null;
    FundamentalSystemBridge.networkingManager = null;
    FundamentalSystemBridge.gameplayManagerComposite = null;
  }
  /**
   * Registers the Babylon Engine instance.
   * @param {BABYLON.Engine} engine - The Babylon engine instance.
   */
  static registerBabylonEngine(engine) {
    if (engine instanceof BABYLON.Engine) {
      this.babylonEngine = engine;
    } else {
      const providedType = typeof engine;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "BabylonEngine",
        providedType
      );
    }
  }

  static registerPrimaryGameplayCameraManager(primaryCameraManager) {
    if (primaryCameraManager instanceof CameraManager) {
      FundamentalSystemBridge.primaryGameplayCameraManager =
        primaryCameraManager;
    }
  }

  static registerSecondaryGameplayCameraManager(secondaryCameraManager) {
    if (secondaryCameraManager instanceof CameraManager) {
      FundamentalSystemBridge.secondaryGameplayCameraManager =
        secondaryCameraManager;
    }
  }

  /**
   * Registers the Sound Managers instances.
   * @param {MusicManager} musicManager - The music manager instance.
   * @param {SoundEffectsManager} soundEffectsManager - The sound effects manager instance.
   */
  static registerSoundManagers(musicManager, soundEffectsManager) {
    FundamentalSystemBridge.musicManager = musicManager;
    FundamentalSystemBridge.soundEffectsManager = soundEffectsManager;
  }

  /**
   * Registers the UILoadRequestManager instance.
   * @param {UILoadRequestManager} uiLoadRequestManager - The ui load request manager instance.
   */
  static registerUILoadRequestManager(uiLoadRequestManager) {
    if (uiLoadRequestManager instanceof UILoadRequestManager) {
      FundamentalSystemBridge.uiLoadRequestManager = uiLoadRequestManager;
    }
  }

  /**
   * Registers the Item Manager instance.
   * @param {ItemManager} itemManager - The item manager instance.
   */

  static registerItemManager(itemManager) {
    if (itemManager instanceof ItemManager) {
      FundamentalSystemBridge.itemManager = itemManager;
    } else {
      const providedType = typeof itemManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "ItemManager",
        providedType
      );
    }
  }

  /**
   * Registers the Achievement Manager instance.
   * @param {AchievementManager} achievementManager - The achievement manager instance.
   */

  static registerAchievementManager(achievementManager) {
    if (achievementManager instanceof AchievementManager) {
      FundamentalSystemBridge.achievementManager = achievementManager;
    } else {
      const providedType = typeof achievementManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "AcheivementManager",
        providedType
      );
    }
  }

  /**
   * Registers the Transaction Manager instance.
   * @param {TransactionManager} transactionManager - The transaction manager instance.
   */
  static registerTransactionManager(transactionManager) {
    if (transactionManager instanceof TransactionManager) {
      FundamentalSystemBridge.transactionManager = transactionManager;
    } else {
      const providedType = typeof transactionManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "TransactionManager",
        providedType
      );
    }
  }

  static registerLevelFactoryComposite(levelFactoryComposite) {
    if (levelFactoryComposite instanceof LevelFactoryComposite) {
      FundamentalSystemBridge.levelFactoryComposite = levelFactoryComposite;
    }
  }

  static registerUIConstructionGrandManager(uiConstructionGrandManager) {
    if (uiConstructionGrandManager instanceof UIConstructionGrandManager) {
      FundamentalSystemBridge.uiConstructionGrandManager =
        uiConstructionGrandManager;
    }
  }

  /**
   * Registers the Babylon Engine instance.
   * @param {PlayerSaveManager} playerSaveManager - The player save manager instance.
   */
  static registerPlayerSaveManager(playerSaveManager) {
    if (playerSaveManager instanceof PlayerSaveManager) {
      FundamentalSystemBridge.playerSaveManager = playerSaveManager;
    } else {
      const providedType = typeof playerSaveManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "PlayerSaveManager",
        providedType
      );
    }
  }

  /**
   * Registers the Radiant Engine Manager.
   * @param {RadiantEngineManager} radiantEngineManager - The radiant engine manager instance.
   */
  static registerRadiantEngineManager(radiantEngineManager) {
    if (radiantEngineManager instanceof RadiantEngineManager) {
      FundamentalSystemBridge.radiantEngineManager = radiantEngineManager;
    } else {
      const providedType = typeof radiantEngineManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "RadiantEngineManager",
        providedType
      );
    }
  }

  /**
   * Registers the Networking Manager.
   * @param {NetworkingManager} networkingManager - The networking manager instance.
   */
  static registerNetworkingManager(networkingManager) {
    if (networkingManager instanceof NetworkingManager) {
      FundamentalSystemBridge.networkingManager = networkingManager;
    } else {
      const providedType = typeof networkingManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "NetworkingManager",
        providedType
      );
    }
  }

  /**
   * Registers the Render Scene Swapper.
   * @param {RenderSceneSwapper} renderSceneSwapper - The render scene swapper instance.
   */
  static registerRenderSceneSwapper(renderSceneSwapper) {
    if (renderSceneSwapper instanceof RenderSceneSwapper) {
      FundamentalSystemBridge.renderSceneSwapper = renderSceneSwapper;
    }
  }

  /**
   * Registers the Gameplay Manager.
   * @param {GameplayManagerComposite} gameplayManagerComposite - The gameplay manager instance.
   */
  static registerGameplayManagerComposite(gameplayManagerComposite) {
    if (gameplayManagerComposite instanceof GameplayManagerComposite) {
      FundamentalSystemBridge.gameplayManagerComposite =
        gameplayManagerComposite;
    } else {
      const providedType = typeof gameplayManagerComposite;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "GameplayManagerComposite",
        providedType
      );
    }
  }

  /**
   * Registers the Lighting Manager.
   * @param {LightingManager} primaryGameplayLightingManager - The primary gameplay lighting manager instance.
   */
  static registerPrimaryGameplayLightingManager(
    primaryGameplayLightingManager
  ) {
    if (primaryGameplayLightingManager instanceof LightingManager) {
      FundamentalSystemBridge.primaryGameplayLightingManager =
        primaryGameplayLightingManager;
    } else {
      const providedType = typeof primaryGameplayLightingManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "PrimaryGameplayLightingManager",
        providedType
      );
    }
  }
  /**
   * Registers the Lighting Manager.
   * @param {LightingManager} lightingManager - The lighting manager instance.
   */
  static registerSecondaryGameplayLightingManager(
    secondaryGameplayLightingManager
  ) {
    if (secondaryGameplayLightingManager instanceof LightingManager) {
      FundamentalSystemBridge.secondaryGameplayLightingManager =
        secondaryGameplayLightingManager;
    } else {
      const providedType = typeof secondaryGameplayLightingManager;
      FundamentalSystemBridge.logCatastrophicRegistration(
        "SecondaryGameplayLightingManager",
        providedType
      );
    }
  }
  /**
   * Logs a catastrophic registration error.
   * @param {string} systemName - The name of the system being registered.
   * @param {string} providedType - The type of object that was provided.
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
