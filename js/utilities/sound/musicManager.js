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
   * Stops any currently playing music.
   * @param {BABYLON.Scene} scene - The scene in which to play the sound.
   * @param {string} songName - The name of the song asset.
   * @param {boolean} autoplay - Whether the song should start automatically.
   * @param {boolean} loop - Whether the song should loop.
   */
  playSong(scene, songName, autoplay, loop) {
    // Stop previously playing music if any
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
