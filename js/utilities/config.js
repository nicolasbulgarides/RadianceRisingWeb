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
  static DEFAULT_MODEL = "mechaSphereBronzeLowRes";
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

  //Player light position and properties
  static DEFAULT_PLAYER_LIGHT_OFFSET = "standardlevel0"; //standardlevel0 refers to flat 2d world, more complex environments may have different light positions
  static DEFAULT_PLAYER_LIGHT_PRESET = "playerpreset0";

  //environment light structural properties + color shifts
  static DEFAULT_ENVIRONMENT_LIGHT_ARCHETYPE = "directional"; //refers to the light structure as either positional (moving lights) or directional
  static DEFAULT_ENVIRONMENT_LIGHT_PRESET = "mysticbluegradient"; //refers to the actual color and shift properties of the starting light

  //whereas archetype is a fundamental change in lighting paradigm, and preset is a change in specific color and intensity properties, the below values relate to specific lighting set-ups for specific worlds which may have different layouts
  //for example orbiting lights / stars may have different positions (POSITION_VECTORS), or light may come different angles(DIRECTION_VECTORS). The context referring to
  static DEFAULT_ENVIRONMENT_DIRECTION_LIGHT_ANGLE_VECTORS = "standardlevel0";
  static DEFAULT_ENVIRONMENT_POSITION_LIGHT_POSITION_VECTORS = "standardlevel0";

  //the default light intensity's
  static DEFAULT_ENVIRONMENT_DIRECTION_LIGHT_BASE_INTENSITY = "standardlevel0";
  static DEFAULT_ENVIRONMENT_POSITION_LIGHT_BASE_INTENSITY = "standardlevel0";

  // Presets for testing different setups
  static CAMERA_PRESET = "gameworldtest"; // Options: 'ISOMETRIC', 'ORTHOGRAPHIC', 'PERSPECTIVE', etc.

  //logging and benchmark utilities
  static LOGGING_ENABLED = true;
  static LOGGING_LEVEL = "UNUSED";
  static BENCHMARK_PRESET = 1;
}

// Expose Config globally
window.Config = Config;
