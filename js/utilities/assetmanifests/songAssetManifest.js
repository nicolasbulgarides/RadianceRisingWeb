/**
 * SongAssetManifest manages the music assets including song URLs and volume configuration.
 * It facilitates retrieval of song URLs and associated volume settings.
 */
class SongAssetManifest {
  static baseUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/";

  // Song asset manifest data with all volumes set to 1.0
  static songs = {
    duskReverie: { volume: 1.0 },
    crystalVoyage: { volume: 1.0 },
  };

  /**
   * Retrieves the URL for a given song.
   * If the song is not found, it defaults to the 'crystalVoyage' song.
   * @param {string} songName - The name of the song.
   * @returns {string} - The full URL of the song.
   */
  static getSongUrl(songName) {
    if (this.songs[songName] != null) {
      return `${this.baseUrl}${songName}.mp3`;
    } else {
      return `${this.baseUrl}${"crystalVoyage"}.mp3`;
    }
  }

  /**
   * Retrieves the volume for a given song.
   * Note: This method references 'this.sounds', which may be intended to be 'this.songs'.
   * @param {string} songName - The name of the song.
   * @returns {number} - The volume of the song or 1.0 if not found.
   */
  static getSongVolume(songName) {
    return this.sounds[songName]?.volume || 1.0;
  }
}
