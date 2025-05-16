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

  constructor() {
    this.loadQueue = [];
    this.activeLoads = 0;
    this.loadAllSounds();
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
    return new Promise((resolve, reject) => {
      const url = SoundAssetManifest.getSoundUrl(soundName);
      const volume = SoundAssetManifest.getSoundVolume(soundName);

      const sound = new BABYLON.Sound(
        soundName,
        url,
        scene,
        () => {
          sound.setVolume(volume);
          SoundEffectsManager.sounds.set(soundName, sound);
          resolve();
        },
        async (error) => {
          console.warn(
            `Attempt ${attempt + 1} failed for sound: ${soundName}`,
            error
          );

          if (
            (error.status === 429 ||
              error.status === 403 ||
              error.status != null) &&
            attempt < SoundEffectsManager.maxRetries
          ) {
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
              `Failed to load sound after ${
                attempt + 1
              } attempts: ${soundName}`,
              error
            );
            reject(error);
          }
        }
      );
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
   * @param {BABYLON.Scene} scene - The scene in which to load the sounds.
   * @returns {Promise<void>} - Resolves when initial sound loading attempt is complete.
   */
  async loadAllSounds(scene) {
    const soundNames = Object.keys(SoundAssetManifest.allSounds);
    const loadPromises = soundNames.map((soundName) => {
      return new Promise((resolve, reject) => {
        this.loadQueue.push({ soundName, scene, resolve, reject });
        this.processQueue();
      });
    });

    try {
      await Promise.allSettled(loadPromises);
    } catch (error) {
      console.error("Error during sound loading:", error);
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
   * @param {string} soundName - The name of the sound to play.
   * @param {BABYLON.Scene} scene - The scene in which to load/play the sound.
   */
  static async playSound(soundName, scene) {
    // If sound isn't loaded, try to load it
    if (!SoundEffectsManager.sounds.has(soundName)) {
      await SoundEffectsManager.attemptLoadSound(soundName, scene);
    }

    const sound = SoundEffectsManager.sounds.get(soundName);
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound not found or failed to load: ${soundName}`);
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
