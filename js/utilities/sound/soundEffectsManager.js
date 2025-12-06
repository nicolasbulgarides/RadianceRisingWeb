/**
 * SoundEffectsManager loads and manages sound effect assets.
 * It maintains a map of sound names to BABYLON.Sound instances and provides methods to play sounds.
 */
class SoundEffectsManager {
  static sounds = new Map();
  static soundIndex = 0;
  static allSoundsLoaded = false;
  static maxConcurrentLoads = 5; // Only load one sound at a time
  static maxRetries = 5;
  static baseDelay = 3000; // Increased base delay to 3 seconds
  static soundLoadDelay = 2000; // Increased delay between sounds to 2 seconds
  static failedSounds = new Set(); // Track failed sound loads
  static recentlyPlayedSounds = new Map(); // Track recently played sounds to prevent duplicates (soundName -> timestamp)

  constructor() {
    this.loadQueue = [];
    this.activeLoads = 0;
    // Don't load sounds immediately - load on-demand when first played
    // This ensures the audio engine and scene are ready
    console.log("[SOUND] SoundEffectsManager initialized - sounds will load on-demand");
  }

  /**
   * Calculates delay for exponential backoff
   * @param {number} attempt - Current retry attempt
   * @returns {number} - Delay in milliseconds
   */
  static getRetryDelay(attempt) {
    return Math.min(3000 * Math.pow(2, attempt), 60000); // Max 60 second delay
  }

  /**
   * Delays execution for specified milliseconds
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Loads a single sound with retry logic
   * @param {string} soundName - Name of the sound to load
   * @param {BABYLON.Scene} scene - The scene in which to load the sound
   * @param {number} attempt - Current retry attempt
   * @returns {Promise<void>}
   */
  static async loadSoundWithRetry(soundName, scene, attempt = 0) {
    // Ensure AudioEngine is ready before creating sounds
    const engine = FundamentalSystemBridge["babylonEngine"];
    if (!engine) {
      throw new Error("Babylon engine not available");
    }

    if (!engine.audioEngine) {
      try {
        await Config.ensureAudioEngineReady();
      } catch (audioError) {
        console.error("[SOUND] Failed to initialize AudioEngine:", audioError);
        throw audioError;
      }
    }

    // CRITICAL: Ensure scene has audio engine assigned before creating sounds
    if (scene) {
      if (!scene._audioEngine && engine.audioEngine) {
        scene._audioEngine = engine.audioEngine;
      }
      if (!scene.audioEnabled) {
        scene.audioEnabled = true;
      }
      if (!scene.audioListenerPositionProvider && scene.activeCamera) {
        scene.audioListenerPositionProvider = () => scene.activeCamera.position;
      }
    }

    return new Promise((resolve, reject) => {
      const url = SoundAssetManifest.getSoundUrl(soundName);
      const volume = SoundAssetManifest.getSoundVolume(soundName);

      console.log(`[SOUND] Loading sound: ${soundName}, scene has _audioEngine: ${!!scene?._audioEngine}`);
      console.log(`[SOUND] Sound URL: ${url}`);

      // WORKAROUND: Check if ready callback fires within timeout
      let callbackFired = false;

      const sound = new BABYLON.Sound(
        soundName,
        url,
        scene,
        () => {
          // Success callback - sound loaded successfully
          callbackFired = true;
          console.log(`[SOUND] ✓ Sound ready: ${soundName}`);
          sound.setVolume(volume);
          SoundEffectsManager.sounds.set(soundName, sound);
          resolve();
        },
        {
          volume: volume,
          spatialSound: false, // Sound effects should be 2D (non-spatial) like music
          autoplay: true,
          // Babylon.js v8+ error handling via options
          onError: async (sound, message) => {
            console.warn(
              `Attempt ${attempt + 1} failed for sound: ${soundName}`,
              message
            );

            // Check if we should retry based on the error
            if (attempt < SoundEffectsManager.maxRetries) {
              const delay = SoundEffectsManager.getRetryDelay(attempt);
              console.log(`Retrying ${soundName} in ${delay}ms...`);

              await SoundEffectsManager.delay(delay);
              try {
                await SoundEffectsManager.loadSoundWithRetry(
                  soundName,
                  scene,
                  attempt + 1
                );
                resolve();
              } catch (retryError) {
                reject(retryError);
              }
            } else {
              console.error(
                `Failed to load sound after ${attempt + 1} attempts: ${soundName}`,
                message
              );
              reject(new Error(message));
            }
          }
        }
      );

      // Diagnostic: Check what audio source Babylon created
      setTimeout(() => {
        console.log(`[SOUND] Diagnostic for ${soundName}:`, {
          hasAudioBuffer: !!sound._audioBuffer,
          hasHtmlAudio: !!sound._htmlAudioElement,
          streaming: sound._streaming,
          callbackFired: callbackFired
        });
      }, 500);

      // WORKAROUND: If Babylon doesn't create audio source, try manual fallback after 2 seconds
      setTimeout(() => {
        if (!callbackFired) {
          console.warn(`[SOUND] Ready callback didn't fire for ${soundName} - trying manual HTML5 audio`);
          try {
            // Create HTML audio element manually as fallback
            const audio = new Audio(url);
            audio.volume = volume;
            audio.crossOrigin = "anonymous";
            audio.preload = "auto";

            // Wait for it to be loaded
            audio.addEventListener('canplaythrough', () => {
              console.log(`[SOUND] ✓ Manual audio loaded for ${soundName}`);
              // Store the audio element as a pseudo-sound object
              const pseudoSound = {
                _manualAudio: audio,
                isPlaying: false,
                spatialSound: false,
                play: function () {
                  this._manualAudio.currentTime = 0;
                  return this._manualAudio.play().then(() => {
                    this.isPlaying = true;
                  });
                },
                stop: function () {
                  this._manualAudio.pause();
                  this._manualAudio.currentTime = 0;
                  this.isPlaying = false;
                },
                setVolume: function (v) {
                  this._manualAudio.volume = v;
                },
                getVolume: function () {
                  return this._manualAudio.volume;
                }
              };
              SoundEffectsManager.sounds.set(soundName, pseudoSound);
              resolve();
            }, { once: true });

            audio.addEventListener('error', (e) => {
              console.error(`[SOUND] Manual audio failed for ${soundName}:`, e);
              reject(new Error(`Manual audio load failed: ${e.message}`));
            }, { once: true });

          } catch (manualError) {
            console.error(`[SOUND] Manual audio creation failed for ${soundName}:`, manualError);
            reject(manualError);
          }
        }
      }, 2000);
    });
  }

  /**
   * Processes the next item in the load queue
   * @private
   */
  async processQueue() {
    if (
      this.loadQueue.length === 0 ||
      this.activeLoads >= SoundEffectsManager.maxConcurrentLoads
    ) {
      return;
    }

    this.activeLoads++;
    const { soundName, scene, resolve, reject } = this.loadQueue.shift();

    try {
      await SoundEffectsManager.loadSoundWithRetry(soundName, scene);
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      this.activeLoads--;
      await SoundEffectsManager.delay(SoundEffectsManager.soundLoadDelay);
      this.processQueue();
    }
  }

  /**
   * Loads all sound effects sequentially based on the SoundAssetManifest.
   * Call this manually when you want to preload all sounds.
   * @param {BABYLON.Scene} scene - The scene in which to load the sounds.
   * @returns {Promise<void>} - Resolves when initial sound loading attempt is complete.
   */
  async loadAllSounds(scene) {
    if (!scene) {
      console.error("[SOUND] Cannot load sounds without a scene. Sounds will load on-demand instead.");
      return;
    }

    console.log("[SOUND] Preloading all sound effects...");
    const soundNames = Object.keys(SoundAssetManifest.allSounds);
    const loadPromises = soundNames.map((soundName) => {
      return new Promise((resolve, reject) => {
        this.loadQueue.push({ soundName, scene, resolve, reject });
        this.processQueue();
      });
    });

    try {
      await Promise.allSettled(loadPromises);
      console.log("[SOUND] Finished preloading sound effects");
    } catch (error) {
      console.error("[SOUND] Error during sound loading:", error);
    }

    // Set allSoundsLoaded to true regardless of individual sound load status
    SoundEffectsManager.allSoundsLoaded = true;
  }

  /**
   * Attempts to load a sound if it hasn't been loaded successfully yet
   * @param {string} soundName - Name of the sound to load
   * @param {BABYLON.Scene} scene - The scene in which to load the sound
   * @returns {Promise<void>}
   */
  static async attemptLoadSound(soundName, scene) {
    if (
      !SoundEffectsManager.sounds.has(soundName) &&
      !SoundEffectsManager.failedSounds.has(soundName)
    ) {
      try {
        await SoundEffectsManager.loadSoundWithRetry(soundName, scene);
        SoundEffectsManager.failedSounds.delete(soundName);
      } catch (error) {
        console.warn(`Failed to load sound ${soundName}:`, error);
        SoundEffectsManager.failedSounds.add(soundName);
      }
    }
  }

  /**
   * Plays a sound effect by name. Attempts to load the sound if it hasn't been loaded yet.
   * Creates a new sound instance for concurrent playback to prevent clipping when the same sound
   * is triggered multiple times quickly.
   * @param {string} soundName - The name of the sound to play.
   * @param {BABYLON.Scene} scene - The scene in which to load/play the sound.
   */
  static async playSound(soundName, scene) {
    // If no scene provided, try to get the active UI scene or game scene
    if (!scene) {
      const renderSceneSwapper = FundamentalSystemBridge["renderSceneSwapper"];
      scene = renderSceneSwapper?.getActiveUIScene() || renderSceneSwapper?.getActiveGameLevelScene();
      if (!scene) {
        console.error(`[SOUND] Cannot play sound ${soundName}: No scene available`);
        return;
      }
      console.log(`[SOUND] Using active scene for ${soundName}`);
    }

    // Ensure audio engine is assigned to scene before playing
    const engine = FundamentalSystemBridge["babylonEngine"];
    if (scene && engine?.audioEngine) {
      if (!scene._audioEngine) {
        scene._audioEngine = engine.audioEngine;
        console.log(`[SOUND] Assigned audio engine to scene for ${soundName}`);
      }
      if (!scene.audioEnabled) {
        scene.audioEnabled = true;
      }
      if (!scene.audioListenerPositionProvider && scene.activeCamera) {
        scene.audioListenerPositionProvider = () => scene.activeCamera.position;
      }
    } else if (!engine?.audioEngine) {
      console.error(`[SOUND] Cannot play sound ${soundName}: AudioEngine not ready`);
      return;
    }

    // If sound isn't loaded, try to load it
    if (!SoundEffectsManager.sounds.has(soundName)) {
      await SoundEffectsManager.attemptLoadSound(soundName, scene);
    }

    const templateSound = SoundEffectsManager.sounds.get(soundName);
    if (templateSound) {
      console.log(`[SOUND] Playing sound: ${soundName}`);

      // For pickup sequence sounds, prevent the same sound from playing multiple times in quick succession
      // This prevents duplicate playback when the same pickup is processed multiple times
      const now = Date.now();
      const lastPlayed = SoundEffectsManager.recentlyPlayedSounds.get(soundName);
      const cooldownMs = 100; // 100ms cooldown to prevent duplicate plays

      if (lastPlayed && (now - lastPlayed) < cooldownMs) {
        // Sound was recently played, skip to prevent duplicates
        return;
      }

      // Update the last played timestamp
      SoundEffectsManager.recentlyPlayedSounds.set(soundName, now);

      // Clean up old entries (older than 1 second)
      for (const [name, timestamp] of SoundEffectsManager.recentlyPlayedSounds.entries()) {
        if (now - timestamp > 1000) {
          SoundEffectsManager.recentlyPlayedSounds.delete(name);
        }
      }

      // Check if the sound is currently playing
      // If it is, create a new instance to allow concurrent playback
      // If not, we can reuse the existing instance
      if (templateSound.isPlaying) {
        // Ensure audio engine is ready before creating new instance
        const engine = FundamentalSystemBridge["babylonEngine"];
        if (!engine || !engine.audioEngine) {
          console.warn("[SOUND] AudioEngine not ready for concurrent playback");
          return;
        }

        // Ensure scene has audio engine assigned
        if (scene && !scene._audioEngine && engine.audioEngine) {
          scene._audioEngine = engine.audioEngine;
          scene.audioEnabled = true;
          if (!scene.audioListenerPositionProvider && scene.activeCamera) {
            scene.audioListenerPositionProvider = () => scene.activeCamera.position;
          }
        }

        // Create a new instance for concurrent playback
        const url = SoundAssetManifest.getSoundUrl(soundName);
        const volume = SoundAssetManifest.getSoundVolume(soundName);

        const soundInstance = new BABYLON.Sound(
          `${soundName}_${Date.now()}_${Math.random()}`,
          url,
          scene,
          () => {
            console.log(`[SOUND] ✓ Concurrent instance ready for: ${soundName}`);
            soundInstance.setVolume(volume);
            soundInstance.play();
          },
          {
            volume: volume,
            spatialSound: false, // Sound effects should be 2D (non-spatial)
            // Babylon.js v8+ error handling
            onError: (sound, message) => {
              console.warn(`Failed to play sound instance ${soundName}:`, message);
            }
          }
        );
      } else {
        // Sound is not playing, we can safely use the existing instance
        try {
          templateSound.play();
          console.log(`[SOUND] ✓ Sound played: ${soundName}`);
        } catch (playError) {
          console.error(`[SOUND] ✗ Failed to play sound ${soundName}:`, playError);
        }
      }
    } else {
      console.warn(`[SOUND] ✗ Sound not found or failed to load: ${soundName}`);
    }
  }

  /**
   * Plays the next sound in the list based on the current sound index.
   * Cycles through all available sounds.
   */
  playNextSound() {
    const soundNames = Object.keys(SoundAssetManifest.sounds);
    if (this.soundIndex < soundNames.length) {
      const soundName = soundNames[this.soundIndex];
      this.playSound(soundName);
      this.soundIndex++;
    } else {
      this.soundIndex = 0;
    }
  }
}
