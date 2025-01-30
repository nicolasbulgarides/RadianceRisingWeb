// File: js/utils/Config.js

/**
 * Config Class
 * Holds global configuration constants for the application.
 */
class Config {
  // Default values
  static DEFAULT_NAME = "Francisco";
  static DEFAULT_MODEL = "mechaSphereBronzeLowRes";
  static DEMO_WORLD = "testWorld0";

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
}

// Expose Config globally
window.Config = Config;
