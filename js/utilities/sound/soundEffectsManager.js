/**
 * SoundEffectsManager loads and manages sound effect assets.
 * It maintains a map of sound names to BABYLON.Sound instances and provides methods to play sounds.
 */
class SoundEffectsManager {
  static sounds = new Map();
  static soundIndex = 0;
  static allSoundsLoaded = false;
  constructor() {
    this.loadAllSounds();
  }

  /**
   * Loads all sound effects asynchronously based on the SoundAssetManifest.
   * @param {BABYLON.Scene} scene - The scene in which to load the sounds.
   * @returns {Promise<void>} - Resolves when all sounds are loaded.
   */
  async loadAllSounds(scene) {
    const promises = Object.keys(SoundAssetManifest.allSounds).map(
      (soundName) => {
        return new Promise((resolve, reject) => {
          const url = SoundAssetManifest.getSoundUrl(soundName);
          const volume = SoundAssetManifest.getSoundVolume(soundName);
          // Create a new sound and configure its volume
          const sound = new BABYLON.Sound(
            soundName,
            url,
            scene,
            () => {
              sound.setVolume(volume);
              SoundEffectsManager.sounds.set(soundName, sound);
              resolve();
            },
            (error) => {
              console.error(`Error loading sound: ${soundName}`, error);
              reject(error);
            }
          );
        });
      }
    );
    await Promise.all(promises);
    SoundEffectsManager.allSoundsLoaded = true;
  }

  /**
   * Plays a sound effect by name.
   * @param {string} soundName - The name of the sound to play.
   */
  static playSound(soundName) {
    if (!SoundEffectsManager.allSoundsLoaded) {
      console.warn("Sounds are not loaded yet.");
      return;
    }
    const sound = SoundEffectsManager.sounds.get(soundName);
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound not found: ${soundName}`);
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
