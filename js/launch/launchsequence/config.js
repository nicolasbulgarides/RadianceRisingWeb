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
  static DEFAULT_MAX_SPEED = 16;
  static DEFAULT_HINT_FREQUENCY = "often"; //default of option, can be "often", "sometimes','rare','pro,'legendary','developer'

  static GAME_SCENES_IN_DEVELOPMENT = {
    DEFAULT: 0,
  };
  static DEVELOPMENT_SCENE_TO_TEST = this.GAME_SCENES_IN_DEVELOPMENT.DEFAULT;

  // Player starting stats.
  static STARTING_HEALTH = 4;
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
  
  // Mobile performance optimizations
  static DISABLE_CONSOLE_LOGGING_ON_MOBILE = true;
  static HARDWARE_SCALING_LEVEL = 2.0; // 2.0 = 50% resolution (inverse scale: higher value = lower resolution = better performance)

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

  // Static flag to track if audio has been unlocked by user interaction
  static audioHasBeenUnlocked = false;

  /**
   * Adds support for custom audio unlocking.
   * Sets up an event listener for the first user click to unlock the audio engine.
   * On mobile, audio must be unlocked via user interaction due to browser security restrictions.
   */
  static addAudioUnlock() {
    try {
      // console.log("[AUDIO] Setting up Babylon.js v8+ audio unlock...");

      // Ensure AudioEngine is created before setting up unlock
      this.ensureAudioEngineReady().then(() => {
        // console.log("[AUDIO] AudioEngine ready, setting up unlock listeners");

        let audioUnlocked = false;

        const unlockAudio = async () => {
          if (audioUnlocked) return;
          audioUnlocked = true;
          Config.audioHasBeenUnlocked = true; // Set global flag

          //console.log("[AUDIO UNLOCK] User interaction detected");

          const engine = FundamentalSystemBridge["babylonEngine"];
          const audioEngine = engine?.audioEngine;

          if (audioEngine) {
            try {
              // Unlock the audio engine
              if (audioEngine.unlock) {
                await audioEngine.unlock();
                //console.log("[AUDIO UNLOCK] AudioEngine unlocked successfully");
              }

              // Explicitly resume the AudioContext (try multiple access methods for v8)
              let audioContext = null;

              // Try different ways to access the AudioContext in Babylon.js v8
              if (audioEngine.audioContext) {
                audioContext = audioEngine.audioContext;
              } else if (audioEngine._audioContext) {
                audioContext = audioEngine._audioContext;
              } else if (typeof audioEngine.getAudioContext === 'function') {
                audioContext = audioEngine.getAudioContext();
              }

              // console.log("[AUDIO UNLOCK] AudioContext found:", !!audioContext, "State:", audioContext?.state);

              if (audioContext) {
                if (audioContext.state === 'suspended') {
                  await audioContext.resume();
                  // console.log("[AUDIO UNLOCK] AudioContext resumed, state:", audioContext.state);
                } else if (audioContext.state === 'running') {
                  // console.log("[AUDIO UNLOCK] AudioContext already running");
                } else {
                  //console.log("[AUDIO UNLOCK] AudioContext state:", audioContext.state);
                }
              } else {
                // console.warn("[AUDIO UNLOCK] Could not access AudioContext. AudioEngine properties:", Object.keys(audioEngine));
              }
            } catch (unlockError) {
              // console.warn("[AUDIO UNLOCK] Unlock failed:", unlockError);
            }
          }

          // Start music after unlock
          Config.startMusicAfterUnlock();
        };

        // Listen for various user interaction events to ensure mobile compatibility
        window.addEventListener("click", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });
        window.addEventListener("touchend", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });

        // console.log("[AUDIO] Audio unlock listeners set up");
      }).catch((error) => {
        // console.warn("[AUDIO] Failed to initialize AudioEngine:", error);
      });

    } catch (err) {
      // console.warn("[AUDIO] Audio unlock setup failed:", err);
    }
  }

  static async ensureAudioEngineReady() {
    const engine = FundamentalSystemBridge["babylonEngine"];
    if (!engine) {
      throw new Error("Babylon engine not available");
    }

    // If audio engine already exists, return it
    if (engine.audioEngine) {
      // console.log("[AUDIO] AudioEngine already initialized");
      return engine.audioEngine;
    }

    try {
      // console.log("[AUDIO] Creating AudioEngine with configuration...");
      engine.audioEngine = await BABYLON.CreateAudioEngineAsync({
        volume: 1.0,
        listenerAutoUpdate: true,
        listenerEnabled: true,
        resumeOnInteraction: true
      });
      // console.log("[AUDIO] AudioEngine created successfully");
      //console.log("[AUDIO] AudioEngine volume:", engine.audioEngine.volume);
      //console.log("[AUDIO] AudioEngine audioEnabled:", engine.audioEngine.audioEnabled);

      // Explicitly set volume to ensure it's not 0
      if (engine.audioEngine.setVolume) {
        engine.audioEngine.setVolume(1.0);
        // console.log("[AUDIO] Explicitly set AudioEngine volume to 1.0");
      }

      // Make sure audio is enabled
      if (engine.audioEngine.audioEnabled === false) {
        engine.audioEngine.audioEnabled = true;
        // console.log("[AUDIO] Enabled AudioEngine.audioEnabled");
      }

      return engine.audioEngine;
    } catch (error) {
      // console.warn("[AUDIO] Failed to create AudioEngine:", error);
      throw error;
    }
  }

  /**
   * Attaches the audio engine listener to the active camera of a scene.
   * This ensures 3D positional audio works correctly.
   * @param {BABYLON.Scene} scene - The scene whose camera should be used as the audio listener.
   */
  static attachAudioListenerToCamera(scene) {
    const engine = FundamentalSystemBridge["babylonEngine"];
    const audioEngine = engine?.audioEngine;

    if (!audioEngine) {
      // console.warn("[AUDIO] Cannot attach listener: AudioEngine not ready");
      return;
    }

    if (!scene || !scene.activeCamera) {
      // console.warn("[AUDIO] Cannot attach listener: Scene or active camera not available");
      return;
    }

    // Set up audio listener position provider

    if (!scene.audioListenerPositionProvider) {
      scene.audioListenerPositionProvider = () => scene.activeCamera.position;
      //console.log("[AUDIO] Set audio listener position provider to camera position");
    }

    try {
      if (audioEngine.listener && typeof audioEngine.listener.attach === 'function') {
        audioEngine.listener.attach(scene.activeCamera);
        // console.log("[AUDIO] Audio listener attached to camera:", scene.activeCamera.name);
      } else if (typeof audioEngine.useCustomAudioListener === 'function') {
        audioEngine.useCustomAudioListener(scene.activeCamera);
        // console.log("[AUDIO] Audio listener attached using useCustomAudioListener");
      } else {
        // console.warn("[AUDIO] No listener attachment method found on AudioEngine");
      }
    } catch (error) {
      // console.warn("[AUDIO] Failed to attach audio listener to camera:", error);
    }
  }

  /**
   * Starts the background music after audio is unlocked.
   * Called automatically when audio context is unlocked via user interaction.
   */
  static async startMusicAfterUnlock() {
    //console.log("[AUDIO UNLOCK] Starting music after unlock...");

    // Try to start music immediately after unlock
    const tryStartMusic = async () => {
      const musicManager = FundamentalSystemBridge["musicManager"];
      const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];

      if (musicManager && renderSceneSwapper) {
        let scene = renderSceneSwapper.getActiveGameLevelScene();
        if (!scene) {
          scene = renderSceneSwapper.getActiveUIScene();
        }

        if (scene) {
          try {
            // Attach audio listener to the camera for proper 3D audio
            Config.attachAudioListenerToCamera(scene);

            await musicManager.playSong(scene, "crystalVoyage", true, true);
            // console.log("[AUDIO UNLOCK] Started crystalVoyage music on loop");
          } catch (error) {
            // console.warn("[AUDIO UNLOCK] Failed to start music:", error);
            // Retry after a short delay if it fails
            setTimeout(tryStartMusic, 100);
          }
        } else {
          // Scenes not ready yet, retry after a short delay
          //console.log("[AUDIO UNLOCK] Scenes not ready, retrying...");
          setTimeout(tryStartMusic, 100);
        }
      } else {
        // Systems not ready yet, retry after a short delay
        //console.log("[AUDIO UNLOCK] Systems not ready, retrying...");
        setTimeout(tryStartMusic, 100);
      }
    };

    await tryStartMusic();
  }
}
