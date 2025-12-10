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
  async playSong(scene, songName, autoplay, loop) {
    // console.log("[MUSIC] Playing song:", songName, "autoplay:", autoplay, "loop:", loop);

    // Stop previously playing music if any
    if (this.currentMusic != null) {
      // console.log("[MUSIC] Stopping previous music");
      try {
        if (this.currentMusic.stop) {
          this.currentMusic.stop();
        }
      } catch (stopError) {
        // console.warn("[MUSIC] Error stopping music:", stopError.message);
      }

      try {
        if (this.currentMusic.dispose) {
          this.currentMusic.dispose();
        }
      } catch (disposeError) {
        // console.warn("[MUSIC] Error disposing music:", disposeError.message);
      }

      this.currentMusic = null;
    }

    // Ensure AudioEngine is ready before creating sounds
    const engine = FundamentalSystemBridge["babylonEngine"];
    if (!engine) {
      // console.error("[MUSIC] Babylon engine not available");
      return;
    }

    // Ensure audio engine is created and ready
    if (!engine.audioEngine) {
      //console.log("[MUSIC] Waiting for AudioEngine initialization...");
      try {
        await Config.ensureAudioEngineReady();
        // console.log("[MUSIC] AudioEngine ready for sound creation");
      } catch (audioError) {
        // console.error("[MUSIC] Failed to initialize AudioEngine:", audioError);
        return;
      }
    }

    // Try to unlock the audio engine and resume AudioContext
    try {
      if (engine.audioEngine.unlockAsync) {
        await engine.audioEngine.unlockAsync();
        //  console.log("[MUSIC] AudioEngine unlocked");
      } else if (engine.audioEngine.unlock) {
        await engine.audioEngine.unlock();
        // console.log("[MUSIC] AudioEngine unlocked (sync method)");
      }

      // Explicitly resume the AudioContext if needed (try multiple access methods for v8)
      let audioContext = null;

      if (engine.audioEngine.audioContext) {
        audioContext = engine.audioEngine.audioContext;
      } else if (engine.audioEngine._audioContext) {
        audioContext = engine.audioEngine._audioContext;
      } else if (typeof engine.audioEngine.getAudioContext === 'function') {
        audioContext = engine.audioEngine.getAudioContext();
      }

      // console.log("[MUSIC] AudioContext found:", !!audioContext, "State:", audioContext?.state);

      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
        // console.log("[MUSIC] AudioContext resumed, state:", audioContext.state);
      } else if (audioContext) {
        // console.log("[MUSIC] AudioContext state:", audioContext.state);
      }
    } catch (unlockError) {
      // console.log("[MUSIC] AudioEngine unlock not ready yet (user interaction may be required):", unlockError.message);
    }

    const songUrl = SongAssetManifest.getSongUrl(songName);
    // console.log("[MUSIC] Song URL:", songUrl);

    // Test if the URL is accessible (check for CORS/network issues)
    // console.log("[MUSIC] Testing URL accessibility...");
    fetch(songUrl, { method: 'HEAD' })
      .then(response => {
        // console.log("[MUSIC] ✓ URL is accessible, status:", response.status);
        // console.log("[MUSIC] CORS headers:", {
        /*  'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'content-type': response.headers.get('content-type'),
          'content-length': response.headers.get('content-length')
        }); */
      })
      .catch(error => {
        // console.error("[MUSIC] ✗ URL fetch failed:", error);
        // console.error("[MUSIC] This could be a CORS or network issue!");
      });

    // Attach audio listener to the scene's active camera if available
    if (scene && scene.activeCamera && engine.audioEngine) {
      try {
        if (engine.audioEngine.listener && typeof engine.audioEngine.listener.attach === 'function') {
          engine.audioEngine.listener.attach(scene.activeCamera);
          // console.log("[MUSIC] Audio listener attached to camera using listener.attach()");
        } else if (typeof engine.audioEngine.useCustomAudioListener === 'function') {
          // Alternative method for v8
          engine.audioEngine.useCustomAudioListener(scene.activeCamera);
          // console.log("[MUSIC] Audio listener attached to camera using useCustomAudioListener()");
        } else {
          // console.warn("[MUSIC] No listener attachment method found on AudioEngine");
        }
      } catch (attachError) {
        //  console.warn("[MUSIC] Could not attach audio listener to camera:", attachError.message);
      }
    } else {
      console.warn("[MUSIC] Cannot attach listener - missing:", {
        scene: !!scene,
        activeCamera: !!scene?.activeCamera,
        audioEngine: !!engine.audioEngine
      });
    }

    try {
      // console.log("[MUSIC] Creating Sound object for:", songName, "with autoplay:", autoplay, "loop:", loop);
      // console.log("[MUSIC] Scene provided:", !!scene, "Scene type:", scene?.constructor?.name);
      // console.log("[MUSIC] Engine:", !!engine, "AudioEngine:", !!engine?.audioEngine);

      // Check if scene has audio enabled
      if (scene) {
        // console.log("[MUSIC] Scene audioEnabled:", scene.audioEnabled);
        // console.log("[MUSIC] Scene audioListenerPositionProvider:", !!scene.audioListenerPositionProvider);
        //  console.log("[MUSIC] Scene._audioEngine before:", !!scene._audioEngine);

        // CRITICAL: Assign the audio engine to the scene FIRST before enabling audio
        if (engine.audioEngine) {
          scene._audioEngine = engine.audioEngine;
          // console.log("[MUSIC] Assigned audio engine to scene");
        } else {
          console.error("[MUSIC] No AudioEngine available to assign to scene!");
        }

        // Ensure audio is enabled on the scene AFTER assigning the engine
        scene.audioEnabled = true;
        // console.log("[MUSIC] Set scene.audioEnabled = true");

        // Set up audio listener position provider if not already set
        if (!scene.audioListenerPositionProvider && scene.activeCamera) {
          scene.audioListenerPositionProvider = () => scene.activeCamera.position;
          // console.log("[MUSIC] Set audio listener position provider to camera position");
        } else if (!scene.audioListenerPositionProvider) {
          // Fallback to origin if no camera
          scene.audioListenerPositionProvider = () => BABYLON.Vector3.Zero();
          // console.log("[MUSIC] Set audio listener position provider to origin (no camera found)");
        }

        // console.log("[MUSIC] Scene._audioEngine after:", !!scene._audioEngine);
        // console.log("[MUSIC] Scene.audioEnabled after:", scene.audioEnabled);
      }

      // Babylon.js v8+ Sound constructor with proper async handling
      // Constructor: new Sound(name, url, scene, readyCallback, options)
      // console.log("[MUSIC] About to call new BABYLON.Sound()");
      // console.log("[MUSIC] Parameters:", { songName, songUrl, sceneType: scene?.constructor?.name });
      // console.log("[MUSIC] Engine.audioEngine available:", !!engine.audioEngine);
      // console.log("[MUSIC] Scene has _audioEngine:", !!scene._audioEngine);

      // In Babylon.js v8, we need to ensure the scene has the audio engine before creating sounds
      if (!scene._audioEngine && engine.audioEngine) {
        // console.warn("[MUSIC] Scene missing _audioEngine right before Sound creation! Assigning now...");
        scene._audioEngine = engine.audioEngine;
      }

      this.currentMusic = new BABYLON.Sound(
        songName,
        songUrl,
        scene,
        () => {
          // Ready callback - called when sound is loaded and ready to play
          // console.log("[MUSIC] ✓ Sound ready callback fired for:", songName);

          try {
            // console.log("[MUSIC] Sound status - isPlaying:", this.currentMusic?.isPlaying, "isReady:", this.currentMusic?.isReady);
          } catch (statusError) {
            // console.warn("[MUSIC] Could not read sound status:", statusError.message);
          }

          if (autoplay) {
            if (this.currentMusic && !this.currentMusic.isPlaying) {
              try {
                // console.log("[MUSIC] Attempting to play sound...");
                this.currentMusic.play();
                // console.log("[MUSIC] ✓ Play() called successfully. isPlaying:", this.currentMusic.isPlaying);
              } catch (playError) {
                console.error("[MUSIC] ✗ Failed to play sound:", playError);
              }
            } else {
              //  console.log("[MUSIC] Sound already playing or currentMusic is null");
            }
          } else {
            // console.log("[MUSIC] Autoplay is false, not playing automatically");
          }
        },
        {
          loop: loop,
          autoplay: true,
          volume: 0.5,
          streaming: true, // Enable streaming for music files
          spatialSound: false, // Try false first (2D audio). If no sound, user can test with true
          maxDistance: 1000, // If using 3D audio, set large distance so camera position doesn't matter
          // Error callback for load failures
          onError: (sound, message) => {
            console.error("[MUSIC] ✗ Sound load error for", songName, ":", message);
          }
        }
      );

      //   console.log("[MUSIC] Sound object created:", !!this.currentMusic);

      // WORKAROUND: If Babylon didn't create an audio source, try manual creation
      setTimeout(() => {
        if (this.currentMusic && !this.currentMusic._htmlAudioElement && !this.currentMusic._audioBuffer) {
          // console.warn("[MUSIC] Babylon didn't create audio source. Trying manual fallback...");
          try {
            // Create HTML audio element manually
            const audio = new Audio(songUrl);
            audio.loop = loop;
            audio.volume = 0.5; // Default music volume set to 50%
            audio.crossOrigin = "anonymous";

            // Try to play it
            audio.play().then(() => {
              // console.log("[MUSIC] ✓✓✓ MANUAL AUDIO PLAYBACK SUCCESSFUL! ✓✓✓");
              // console.log("[MUSIC] This proves the audio works, but Babylon.js Sound creation is broken");
              // Store reference so we can stop it later
              this.currentMusic._manualAudio = audio;
            }).catch(err => {
              // console.error("[MUSIC] Manual audio play failed:", err);
            });
          } catch (manualError) {
            // console.error("[MUSIC] Manual audio creation failed:", manualError);
          }
        }
      }, 1000);

      // Try to safely log sound properties
      if (this.currentMusic) {
        // console.log("[MUSIC] Sound successfully instantiated");

        try {
          // isReady might be a function or property in v8
          const isReady = typeof this.currentMusic.isReady === 'function'
            ? this.currentMusic.isReady()
            : this.currentMusic.isReady;
          // console.log("[MUSIC] isReady:", isReady);
        } catch (e1) {
          // console.error("[MUSIC] Error accessing isReady:", e1.message);
        }

        try {
          const isPlaying = this.currentMusic.isPlaying;
          // console.log("[MUSIC] isPlaying:", isPlaying);
        } catch (e2) {
          // console.error("[MUSIC] Error accessing isPlaying:", e2.message);
        }

        try {
          const spatialSound = this.currentMusic.spatialSound;
          // console.log("[MUSIC] spatialSound:", spatialSound);
        } catch (e3) {
          // console.error("[MUSIC] Error accessing spatialSound:", e3.message);
        }

        try {
          const vol = this.currentMusic.getVolume();
          // console.log("[MUSIC] volume:", vol);
        } catch (e4) {
          // console.error("[MUSIC] Error accessing volume:", e4.message);
        }

        // Check AudioEngine and AudioContext state
        try {
          const audioContext = engine.audioEngine?.audioContext || engine.audioEngine?._audioContext;
          if (audioContext) {
            // console.log("[MUSIC] AudioContext state:", audioContext.state);
            // console.log("[MUSIC] AudioContext sampleRate:", audioContext.sampleRate);
            // console.log("[MUSIC] AudioContext currentTime:", audioContext.currentTime);


          }



          // Check if the sound has an audio buffer (indicates file loaded)
          if (this.currentMusic) {

            // If using HTML audio element, check its properties
            if (this.currentMusic._htmlAudioElement) {
              const audio = this.currentMusic._htmlAudioElement;
              /**
              console.log("[MUSIC] HTML Audio readyState:", audio.readyState);
              console.log("[MUSIC] HTML Audio paused:", audio.paused);
              console.log("[MUSIC] HTML Audio volume:", audio.volume);
              console.log("[MUSIC] HTML Audio muted:", audio.muted);
              console.log("[MUSIC] HTML Audio src:", audio.src);
               */
            } else {
              // console.warn("[MUSIC] ⚠ No HTML Audio Element created! This means streaming didn't work.");
            }

            if (!this.currentMusic._audioBuffer && !this.currentMusic._htmlAudioElement) {
              // console.error("[MUSIC] ⚠⚠⚠ CRITICAL: No audio source created at all!");
              // console.error("[MUSIC] Scene._audioEngine:", !!scene._audioEngine);
              // console.error("[MUSIC] This means the Sound constructor failed to create the audio source");
            }
          }
        } catch (e5) {
          // console.error("[MUSIC] Error checking AudioContext:", e5.message);
        }
      }

      //  console.log("[MUSIC] Waiting for sound to load and ready callback to fire...");

      // Add periodic checks to see the sound loading progress
      let checkCount = 0;
      const checkInterval = setInterval(() => {
        checkCount++;
        try {
          if (this.currentMusic) {
            // isReady might be a function in v8
            const isReady = typeof this.currentMusic.isReady === 'function'
              ? this.currentMusic.isReady()
              : this.currentMusic.isReady;
            const isPlaying = this.currentMusic.isPlaying;
            const volume = this.currentMusic.getVolume();

            //  console.log(`[MUSIC] Check ${checkCount}: isReady=${isReady}, isPlaying=${isPlaying}, volume=${volume}`);

            // If ready but not playing, try to play manually
            if (isReady && !isPlaying && autoplay) {
              //console.log("[MUSIC] Sound is ready but not playing. Attempting manual play...");
              try {
                this.currentMusic.play();
                //console.log("[MUSIC] ✓ Manual play successful");
              } catch (manualPlayError) {
                console.error("[MUSIC] ✗ Manual play failed:", manualPlayError);
              }
            }

            // If playing but volume is 0, try setting it
            if (isPlaying && volume === 0) {
              console.warn("[MUSIC] Sound is playing but volume is 0! Setting to 0.5...");
              this.currentMusic.setVolume(0.5);
            }

            if (isReady || checkCount >= 10) {
              clearInterval(checkInterval);
              if (!isReady) {
                //  console.error("[MUSIC] ⚠ Sound failed to load after 5 seconds!");
                //  console.error("[MUSIC] Sound URL:", songUrl);
                //  console.error("[MUSIC] Check network tab for failed requests or CORS errors");
              } else if (isPlaying) {
                //console.log("[MUSIC] ✓✓✓ SOUND IS PLAYING! ✓✓✓");
                //console.log("[MUSIC] Final state: volume=" + volume + ", spatialSound=" + this.currentMusic.spatialSound);
              }
            }
          } else {
            clearInterval(checkInterval);
          }
        } catch (checkError) {
          console.warn("[MUSIC] Error during sound check:", checkError.message);
          clearInterval(checkInterval);
        }
      }, 500);

    } catch (error) {
      console.error("[MUSIC] Failed to create sound for", songName, ":", error);
      console.error("[MUSIC] Error stack:", error.stack);
      this.currentMusic = null;
      throw error;
    }
  }
}

window.MusicManager = this;
