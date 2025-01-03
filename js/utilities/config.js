// File: js/utils/Config.js

/**
 * Config Class
 * Holds global configuration constants for the application.
 */
class Config {
  // Enable or disable logging globally
  static LOGGING_ENABLED = true;

  // Presets for testing different setups
  static CAMERA_PRESET = "TESTINGUI"; // Options: 'ISOMETRIC', 'ORTHOGRAPHIC', 'PERSPECTIVE', etc.
  static LIGHTING_PRESET = "day"; // Options: 'day', 'night', 'dusk', etc.
}

// Expose Config globally
window.Config = Config;
