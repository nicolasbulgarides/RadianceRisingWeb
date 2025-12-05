/**
 * MusicManager handles the playback of music tracks in the game.
 * It stops any currently playing track before starting a new song.
 */
class MusicManager {
  constructor() {
    this.currentMusic = null;
  }

  /**
   * Plays a song by retrieving its URL and initializing a BABYLON.Sound.
   * Stops any currently playing music only if it's a different song.
   * If the same song is already playing, it will continue without restarting.
   * @param {BABYLON.Scene} scene - The scene in which to play the sound.
   * @param {string} songName - The name of the song asset.
   * @param {boolean} autoplay - Whether the song should start automatically.
   * @param {boolean} loop - Whether the song should loop.
   */
  playSong(scene, songName, autoplay, loop) {
    // Check if the same song is already playing
    if (this.currentMusic != null && this.currentMusic.name === songName) {
      // Same song is already playing, check if it's still playing
      if (this.currentMusic.isPlaying) {
        // Don't restart the same song
        return;
      }
    }

    // Stop previously playing music if any (different song or stopped)
    if (this.currentMusic != null) {
      this.currentMusic.stop();
    }
    let songUrl = SongAssetManifest.getSongUrl(songName);
    let autoplayVerified = autoplay === true;
    let loopVerified = loop === true;
    // Create and start a new BABYLON.Sound for the song
    this.currentMusic = new BABYLON.Sound(songName, songUrl, scene, null, {
      loop: loopVerified,
      autoplay: autoplayVerified,
    });
  }
}

window.MusicManager = this;
