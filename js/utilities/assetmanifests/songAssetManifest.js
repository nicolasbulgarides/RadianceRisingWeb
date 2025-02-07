class SongAssetManifest {
  static baseUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/";

  // Song asset manifest data with all volumes set to 1.0
  static songs = {
    duskReverie: { volume: 1.0 },
    crystalVoyage: { volume: 1.0 },
  };

  /**
   * Retrieves the URL for a given song
   * @param {string} songName - The name of the song
   * @returns {string} - The full URL of the song
   */
  static getSongUrl(songName) {
    if (this.songs[songName] != null) {
      return `${this.baseUrl}${songName}.mp3`;
    } else {
      return `${this.baseUrl}${"crystalVoyage"}.mp3`;
    }
  }

  /**
   * Retrieves the volume for a given sound effect name.
   * @param {string} songName - The name of the song
   * @returns {number} - The volume of the song or 1.0 if not found.
   */
  static getSongVolume(songName) {
    return this.sounds[songName]?.volume || 1.0;
  }
}
