/**
 * SongAssetManifest manages the music assets including song URLs and volume configuration.
 * It facilitates retrieval of song URLs and associated volume settings.
 */
class SongAssetManifest {
  // Base URL for local development (GitHub)
  static githubUrl =
    "https://raw.githubusercontent.com/nicolasbulgarides/radiancesoundfx/main/";

  // Production URL for song assets in the game website bucket
  static productionUrl =
    "https://radianceloader.nicolasbulgarides.workers.dev/";

  // Song asset manifest data with all volumes set to 1.0
  static songs = {
    duskReverie: { volume: 1.0 },
    crystalVoyage: { volume: 1.0 },
  };

  /**
   * Retrieves the URL for a given song.
   * Routes to GitHub or the production bucket based on Config.RUN_LOCALLY_DETERMINED.
   * If the song is not found, it defaults to the 'crystalVoyage' song.
   * @param {string} songName - The name of the song.
   * @returns {string} - The full URL of the song.
   */
  static getSongUrl(songName) {
    const baseUrl = Config.RUN_LOCALLY_DETERMINED
      ? this.githubUrl
      : this.productionUrl;
    return this.songs[songName]
      ? `${baseUrl}${songName}.mp3`
      : `${baseUrl}crystalVoyage.mp3`;
  }

  /**
   * Retrieves the volume for a given song.
   * @param {string} songName - The name of the song.
   * @returns {number} - The volume of the song or 1.0 if not found.
   */
  static getSongVolume(songName) {
    return this.songs[songName]?.volume || 1.0;
  }
}
