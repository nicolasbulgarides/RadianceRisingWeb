class MusicLoder {
  constructor() {
    this.currentMusic = null;
  }

  playSong(scene, songName, autoplay, loop) {
    if (this.currentMusic != null) {
      this.currentMusic.stop();
    }
    let songUrl = SongAssetManifest.getSongUrl(songName);
    let autoplayVerified = false;
    let loopVerified = false;

    if (autoplay == true) {
      autoplayVerified = true;
    } else if (autoplay == false) {
      autoplayVerified = false;
    }

    if (loop == true) {
      loopVerified = true;
    } else if (loop == false) {
      loopVerified = false;
    }

    this.currentMusic = new BABYLON.Sound(songName, songUrl, scene, null, {
      loop: loopVerified,
      autoplay: autoplayVerified,
    });
  }
}
