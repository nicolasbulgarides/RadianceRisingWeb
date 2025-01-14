class SoundAssetManifest {
  static baseUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/";

  // Sound asset manifest data with all volumes set to 1.0
  static sounds = {
    artifactSelect: { volume: 1.0 },
    artifactUsage: { volume: 1.0 },
    characterFailure: { volume: 1.0 },
    characterLevelUp: { volume: 1.0 },
    checkpointReached: { volume: 1.0 },
    constellationLevelGroupCompleted: { volume: 1.0 },
    healthRestoration: { volume: 1.0 },
    mapWorldSelect: { volume: 1.0 },
    menuMovement: { volume: 1.0 },
    menuValueChange: { volume: 1.0 },
    radianceGameStart: { volume: 1.0 },
    secretReveal: { volume: 1.0 },
    startOfLevel: { volume: 1.0 },
    tipAttentionGetter: { volume: 1.0 },
    windPush: { volume: 1.0 },
  };

  /**
   * Retrieves the URL for a given sound effect name.
   * @param {string} soundName - The name of the sound effect (without .wav).
   * @returns {string} - The full URL of the sound effect.
   */
  static getSoundUrl(soundName) {
    return `${this.baseUrl}${soundName}.wav`;
  }

  /**
   * Retrieves the volume for a given sound effect name.
   * @param {string} soundName - The name of the sound effect.
   * @returns {number} - The volume of the sound effect, or 1.0 if not found.
   */
  static getSoundVolume(soundName) {
    return this.sounds[soundName]?.volume || 1.0;
  }
}
