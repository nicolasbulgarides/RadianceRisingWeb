// File: js/utils/Config.js

/**
 * Config Class
 * Holds global configuration constants for the application.
 */
class Config {
  //engine infrastrustucture
  static FPS = 60;
  // Default values (player)
  static DEFAULT_NAME = "Francisco";
  static DEFAULT_MODEL = "mechaSphereBlueBase";
  static DEFAULT_SPEED = 4;

  //Player starting stats
  static STARTING_HEALTH = 3;
  static STARTING_MAGICPOINTS = 3;
  static STARTING_LEVEL = 1;
  static STARTING_EXP = 0;

  //default values (world properties) & Collision / level properties
  static DEMO_WORLD = "testWorld0";
  static MAX_MOVEMENT = 999;
  static IGNORE_OBSTACLES = false;
  static UNBOUNDED_MOVEMENT = true;

  //default values (lighting, camera)

  static DEFAULT_LIGHTING_TEMPLATE = "standardlevel0";
  static DEFAULT_PLAYER_LIGHTING_TEMPLATE = "default";

  // Presets for testing different setups
  static CAMERA_PRESET = "gameworldtest"; // Options: 'ISOMETRIC', 'ORTHOGRAPHIC', 'PERSPECTIVE', etc.

  //logging and benchmark utilities
  static BENCHMARK_PRESET = 1;

  static LOGGING_FORCEFULLY_ENABLED = true;
  static LOGGING_OMEGA_DISABLED_GET_WRECKED = false;
  static LOGGING_ENABLED = true;

  static LOGGING_COOLDOWNS_FALLBACK_DEFAULT = 10; // Default cooldown of 10s for unlisted error types
  static LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE = 0; // 0 means no cooldown override
  static LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE_ACTIVE = false; // If true, override all cooldowns

  static CURRENT_LOGGING_LEVEL = 5;
}
