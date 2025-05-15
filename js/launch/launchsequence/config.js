// File: js/initialization/config.js

/**
 * Config Class
 *
 * Global configuration constants used throughout the engine initialization and gameplay.
 * This includes settings for engine framerate, player defaults, level properties,
 * lighting and camera presets, and logging configurations.
 *
 * These configurations are referenced by various components during initialization,
 * such as EngineInitialization, GameInitialization, and GameplayManager.
 */
class Config {
  static CURRENT_GAME_VERSION = "0.0.0";
  static ASSUMED_GAME_VERSION = "0.0.0";
  static AUTHORIZE_ALL_PREMIUM_UNLOCKS = true;
  static LOAD_TEST_MANAGER = true;
  static STATUS_ENVIRONMENT = "DEVELOPMENT";
  static LOAD_LEVEL_FROM_DEVELOPER_OVERRIDE = false;
  static STATUS_IN_DEVELOPMENT = true;
  static STATUS_IN_DEPLOYMENT = false;
  static ITEM_REQUEST_VALIDATION_OVERRIDE = true;
  static UNLOCK_AREA_VALIDATION_OVERRIDE = true;

  static ITEMS_AND_REWARDS_ACTIVE = false;

  static LESS_ESSENTIAL_GAMEPLAY_SYSTEMS_TO_SKIP_LOADING = [
    "achievement",
    "history",
    "itemRequirements",
    "itemGeneral",
    "itemVerification",
    "reward",
  ];

  static NETWORKING_SYSTEMS_TO_SKIP_LOADING = [
    "networking",
    "transaction",
    "cheatPrevention",
    "successfulTransactionEvent",
    "platformTransaction",
    "playerSave",
    "playerSaveBatching",
  ];

  /**
   * Combined array of all systems to skip during development
   * This merges both LESS_ESSENTIAL_GAMEPLAY_SYSTEMS_TO_SKIP_LOADING and NETWORKING_SYSTEMS_TO_SKIP_LOADING
   * Used by ScriptManifest to determine which script categories to skip loading
   */
  static get SYSTEMS_TO_SKIP_LOADING() {
    // Use a Set to ensure uniqueness when combining arrays
    return [
      ...new Set([
        ...this.LESS_ESSENTIAL_GAMEPLAY_SYSTEMS_TO_SKIP_LOADING,
        ...this.NETWORKING_SYSTEMS_TO_SKIP_LOADING,
      ]),
    ];
  }

  // Engine infrastructure.
  static FPS = 60;
  // Default values (player).
  static DEFAULT_NAME = "Francisco";
  static DEFAULT_MODEL = "mechaSphereBlueBase";
  static DEFAULT_MAX_SPEED = 4;
  static DEFAULT_HINT_FREQUENCY = "often"; //default of option, can be "often", "sometimes','rare','pro,'legendary','developer'

  static GAME_SCENES_IN_DEVELOPMENT = {
    DEFAULT: 0,
  };
  static DEVELOPMENT_SCENE_TO_TEST = this.GAME_SCENES_IN_DEVELOPMENT.DEFAULT;

  // Player starting stats.
  static STARTING_HEALTH = 3;
  static STARTING_MAGICPOINTS = 3;
  static STARTING_LEVEL = 1;
  static STARTING_EXP = 0;

  static DEFAULT_GAME_MODE = "test";

  // Default values (level properties) & Collision/level properties.
  static DEMO_LEVEL = "testLevel0";
  static MAX_MOVEMENT = 1;
  static IGNORE_OBSTACLES = false;
  static UNBOUNDED_MOVEMENT = false;

  // Default values (lighting, camera).
  static DEFAULT_ENVIRONMENT_LIGHTING_TEMPLATE = "standardlevel0";
  static DEFAULT_PLAYER_LIGHTING_TEMPLATE = "default";

  // Presets for testing different setups.
  static CAMERA_PRESET = "gameleveltest"; // Options: 'ISOMETRIC', 'ORTHOGRAPHIC', 'PERSPECTIVE', etc.

  // Logging and benchmark utilities.
  static BENCHMARK_PRESET = 1;

  static REPORT_CATASTROPHE_TO_PLAYER = true;
  static REPORT_CATASTROPHE_TO_DEVELOPER = true;
  static LOGGING_CRITICAL_SYSTEMS_ENABLED = true;
  static LOGGING_FORCEFULLY_ENABLED = true;
  static LOGGING_OMEGA_DISABLED_GET_WRECKED = false;
  static LOGGING_ENABLED = true;

  static LOGGING_COOLDOWNS_FALLBACK_DEFAULT = 10; // Default cooldown of 10s for unlisted error types.
  static LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE = 0; // 0 means no cooldown override.
  static LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE_ACTIVE = false; // If true, override all cooldowns.

  static REGIONAL_ADAPTATION_ACCESS_CREDENTIALS = "";

  static RUN_LOCALLY_DETERMINED = true;
  static CURRENT_LOGGING_LEVEL =
    LoggerOmega.GetLoggingLevelByImportance("debug");

  static finalizeLocalDetermination(runLocally) {
    this.RUN_LOCALLY_DETERMINED = runLocally;
  }

  static IDEAL_UI_WIDTH = 1000;
  static IDEAL_UI_HEIGHT = 2000;

  /**
   * Adds support for custom audio unlocking.
   * Sets up an event listener for the first user click to unlock the audio engine.
   */
  static addAudioUnlock() {
    try {
      BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;

      window.addEventListener(
        "click",
        () => {
          if (!BABYLON.Engine.audioEngine.unlocked) {
            BABYLON.Engine.audioEngine.unlock();
          }
        },
        { once: true }
      );
    } catch (err) {
      InitializationDiagnosticsLogger.logPhaseError(
        "RadiantEngineConstructor-Failure to unlock audio engine: ",
        ", Error Found: " + err
      );
    }
  }
}
