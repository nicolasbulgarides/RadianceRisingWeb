// audioManager.js
// Thin facade over MusicManager and SoundEffectsManager.
// Exposed globally as window.AudioManager for SettingsPanel and any other callers.
//
// Volume scale: public API accepts 0-100; internal conversion to 0-1 happens here.
//
// External wiring that may be useful:
//   AudioManager.applyStoredSettings() — re-apply localStorage volumes to all loaded
//   sounds. Call this after a batch of sounds finishes loading if you want the stored
//   setting to take effect immediately on startup rather than waiting for first slider move.

class AudioManager {
  static _sfxVolume   = 75; // 0-100, authoritative value even while muted
  static _musicVolume = 75; // 0-100, authoritative value even while muted
  static _prevSfx     = null; // saved before muteAll
  static _prevMusic   = null;
  static _isMuted     = false;

  // Reads stored volumes from localStorage at definition time.
  static _init() {
    try {
      const obj = JSON.parse(localStorage.getItem("radianceRising_settings") || "{}");
      if (typeof obj.sfxVolume   === "number") AudioManager._sfxVolume   = obj.sfxVolume;
      if (typeof obj.musicVolume === "number") AudioManager._musicVolume  = obj.musicVolume;
    } catch (e) {}
  }

  // ── Internal application helpers ─────────────────────────────────────────

  // Applies value (0-100) to every sound currently in SoundEffectsManager.sounds.
  // Handles both BABYLON.Sound instances and the HTML5-audio pseudo-sound fallback.
  static _applySFXVolume(value) {
    const vol01 = Math.max(0, Math.min(1, value / 100));
    for (const [, sound] of SoundEffectsManager.sounds) {
      try { sound.setVolume(vol01); } catch (e) {}
      // HTML5 manual-audio fallback stored on the pseudo-sound object
      if (sound._manualAudio) {
        try { sound._manualAudio.volume = vol01; } catch (e) {}
      }
    }
  }

  // Applies value (0-100) to the music track currently held by MusicManager.
  // Covers three possible audio backing objects created by MusicManager.playSong:
  //   1. BABYLON.Sound  (setVolume)
  //   2. _htmlAudioElement  (created when streaming: true)
  //   3. _manualAudio  (HTML5 Audio created in the 1-second fallback timeout)
  static _applyMusicVolume(value) {
    const vol01 = Math.max(0, Math.min(1, value / 100));
    const mm = FundamentalSystemBridge["musicManager"];
    if (!mm?.currentMusic) return;
    try { mm.currentMusic.setVolume(vol01); } catch (e) {}
    if (mm.currentMusic._htmlAudioElement) {
      try { mm.currentMusic._htmlAudioElement.volume = vol01; } catch (e) {}
    }
    if (mm.currentMusic._manualAudio) {
      try { mm.currentMusic._manualAudio.volume = vol01; } catch (e) {}
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  // Sets SFX volume (0-100). Applies immediately to all loaded sounds.
  static setSFXVolume(value) {
    AudioManager._sfxVolume = value;
    AudioManager._applySFXVolume(value);
  }

  // Sets music volume (0-100). Applies immediately to the current music track.
  static setMusicVolume(value) {
    AudioManager._musicVolume = value;
    AudioManager._applyMusicVolume(value);
  }

  // Mutes all audio. Saves current volumes so unmuteAll() can restore them.
  // Safe to call multiple times — only acts on the first call while muted.
  static muteAll() {
    if (AudioManager._isMuted) return;
    AudioManager._isMuted   = true;
    AudioManager._prevSfx   = AudioManager._sfxVolume;
    AudioManager._prevMusic = AudioManager._musicVolume;
    AudioManager._applySFXVolume(0);
    AudioManager._applyMusicVolume(0);
  }

  // Restores previously saved volumes. If muteAll() was never called, this is a no-op.
  static unmuteAll() {
    if (!AudioManager._isMuted) return;
    AudioManager._isMuted = false;
    AudioManager._applySFXVolume(AudioManager._prevSfx   ?? AudioManager._sfxVolume);
    AudioManager._applyMusicVolume(AudioManager._prevMusic ?? AudioManager._musicVolume);
  }

  // Re-applies the stored volumes to all currently loaded sounds and the active music track.
  // Useful to call after a batch of sounds finishes loading so the player's saved preference
  // takes effect without them having to open settings again.
  static applyStoredSettings() {
    if (AudioManager._isMuted) return; // don't overwrite mute state
    AudioManager._applySFXVolume(AudioManager._sfxVolume);
    AudioManager._applyMusicVolume(AudioManager._musicVolume);
  }
}

AudioManager._init();
window.AudioManager = AudioManager;
