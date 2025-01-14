class SoundEffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.soundIndex = 0;
    this.sounds = new Map(); // A map to store BABYLON.Sound instances

    window.soundManager = this;
    this.loadSounds();
  }

  /**
   * Loads all sound effects from the manifest asynchronously.
   * @returns {Promise<void>} - Resolves when all sounds are loaded.
   */
  async loadSounds() {
    const promises = Object.keys(SoundAssetManifest.sounds).map((soundName) => {
      return new Promise((resolve, reject) => {
        const url = SoundAssetManifest.getSoundUrl(soundName);
        const volume = SoundAssetManifest.getSoundVolume(soundName);

        const sound = new BABYLON.Sound(
          soundName,
          url,
          this.scene,
          () => {
            sound.setVolume(volume); // Set the volume from the manifest
            this.sounds.set(soundName, sound);
            console.log(`Sound loaded: ${soundName}`);
            resolve();
          },
          (error) => {
            console.error(`Error loading sound: ${soundName}`, error);
            reject(error);
          }
        );
      });
    });

    await Promise.all(promises);
    console.log("All sounds loaded successfully.");
  }

  /**
   * Plays a sound by name.
   * @param {string} soundName - The name of the sound to play.
   */
  playSound(soundName) {
    const sound = this.sounds.get(soundName);

    if (sound) {
      sound.play();
      console.log(`Playing sound: ${soundName}`);
    } else {
      console.warn(`Sound not found: ${soundName}`);
    }
  }

  /**
   * Plays the next sound in the manifest based on the current sound index.
   */
  playNextSound() {
    const soundNames = Object.keys(SoundAssetManifest.sounds);

    if (this.soundIndex < soundNames.length) {
      const soundName = soundNames[this.soundIndex];
      this.playSound(soundName);
      console.log(
        `Playing sound ${this.soundIndex + 1}/${
          soundNames.length
        }: ${soundName}`
      );
      this.soundIndex++;
    } else {
      console.log("All sounds have been played.");
      this.soundIndex = 0; // Reset the index to loop again if needed
    }
  }
}
