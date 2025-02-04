// File: js/utils/Config.js

/**
 * Config Class
 * Holds global configuration constants for the application.
 */
class Config {
  // Default values
  static DEFAULT_NAME = "Francisco";

  // static DEFAULT_MODEL = "mechaSphereLowPolygonPurple";
  static DEFAULT_MODEL = "mechaSphereBronzeLowRes";
  static DEFAULT_ENVIRONMENT_LIGHT_ARCHETYPE = "directional";
  static DEFAULT_ENVIRONMENT_LIGHT_PRESET = "mysticbluegradient";
  static DEFAULT_ENVIRONMENT_CONTEXT = "standardlevel0";
  static DEFAULT_PLAYER_LIGHT_PRESET = "playerpreset0";
  static DEMO_WORLD = "testWorld0";
  static DEFAULT_SPEED = 4;
  static MAX_MOVEMENT = 999;
  static IGNORE_OBSTACLES = false;
  static UNBOUNDED_MOVEMENT = true;

  //logging and benchmark utilities
  static LOGGING_ENABLED = true;
  static LOGGING_LEVEL = "UNUSED";
  static BENCHMARK_PRESET = 1;

  //Player statrs
  static STARTING_HEALTH = 3;
  static STARTING_MAGICPOINTS = 3;
  static STARTING_LEVEL = 1;
  static STARTING_EXP = 0;

  // Presets for testing different setups
  static CAMERA_PRESET = "gameworldtest"; // Options: 'ISOMETRIC', 'ORTHOGRAPHIC', 'PERSPECTIVE', etc.
  static LIGHTING_PRESET = "day"; // Options: 'day', 'night', 'dusk', etc.
  static FPS = 60;
}

// Expose Config globally
window.Config = Config;
