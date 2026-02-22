// SaveService — Firebase Realtime Database persistence
// Loaded as an ES module via firebaseInit.js; exposed globally as window.SaveService.
//
// Firebase DB structure:
//   users/{uid}/progress/levels/{constellationId}_{starId}
//       → { constellationId, starId, levelFileId, completed, bestStrokes, allLotusCollected, completedAt }
//   users/{uid}/settings    → { ...settingsKeys }
//   users/{uid}/purchases   → { purchased, purchasedAt }
//
// localStorage keys:
//   level_{constellationId}_{starId}  → same object as above
//   radianceRising_completedLevels    → JSON array of levelFileIds (used by LevelsSolvedStatusTracker)
//   radianceRising_settings           → JSON settings object
//   radianceRising_purchased          → "true" string

import { database } from "./firebaseConfig.js";
import {
  ref as dbRef,
  set,
  get,
  update
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

class SaveService {
  /**
   * Builds the composite storage key used for both localStorage and as the
   * Firebase node name under users/{uid}/progress/levels/.
   * Example: compositeKey("orion", 3) → "orion_3"
   * @param {string}        constellationId
   * @param {number|string} starId
   * @returns {string}
   */
  static _compositeKey(constellationId, starId) {
    return `${constellationId}_${starId}`;
  }

  /**
   * Saves a level completion. Preserves the best (lowest) stroke count across
   * both localStorage and Firebase. If the new run is not an improvement on
   * strokes but collected all lotus when the previous run did not, the lotus
   * flag is promoted.
   *
   * localStorage key: level_{constellationId}_{starId}
   * Firebase path:    users/{uid}/progress/levels/{constellationId}_{starId}
   *
   * @param {string}        constellationId  - e.g. "orion"
   * @param {number|string} starId           - Star index within the constellation (e.g. 3)
   * @param {string}        levelFileId      - Level file identifier (e.g. "level3Spikes"), stored as a field
   * @param {number}        strokes          - Move count for this run
   * @param {boolean}       allLotusCollected
   */
  static async saveLevelCompletion(constellationId, starId, levelFileId, strokes, allLotusCollected) {
    const composite = SaveService._compositeKey(constellationId, starId);
    const key = `level_${composite}`;
    let existing = null;
    try { existing = JSON.parse(localStorage.getItem(key)); } catch (e) {}

    const isBetterStrokes = !existing || strokes < existing.bestStrokes;
    const promotesLotus = allLotusCollected && !existing?.allLotusCollected;

    // This run provides no improvement — preserve the existing record unchanged.
    if (existing?.completed && !isBetterStrokes && !promotesLotus) return;

    const data = {
      constellationId,
      starId,
      levelFileId,
      completed: true,
      bestStrokes: isBetterStrokes ? strokes : existing.bestStrokes,
      allLotusCollected: allLotusCollected || existing?.allLotusCollected || false,
      completedAt: Date.now()
    };

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}

    // Keep the flat completedLevels array (used by LevelsSolvedStatusTracker) in sync.
    SaveService._addToCompletedLevels(levelFileId);

    const user = window.AuthService?.getCurrentUser();
    if (!user) return;

    try {
      await set(dbRef(database, `users/${user.uid}/progress/levels/${composite}`), data);
    } catch (err) {
      console.error("[SaveService] saveLevelCompletion Firebase write failed:", err);
    }
  }

  /**
   * Returns true if the given constellation+star has a completed save record
   * in localStorage (written by saveLevelCompletion / loadFromFirebase).
   * @param {string}        constellationId
   * @param {number|string} starId
   * @returns {boolean}
   */
  static isLevelCompleted(constellationId, starId) {
    try {
      const data = JSON.parse(
        localStorage.getItem(`level_${SaveService._compositeKey(constellationId, starId)}`)
      );
      return data?.completed === true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns true if the player's best stroke count for this star is at or below
   * the perfect solution movement count defined in LevelProfileManifest.
   * Returns false if the level is not completed, if no profile exists for
   * levelFileId, or if bestStrokes is not recorded.
   * @param {string}        constellationId
   * @param {number|string} starId
   * @param {string}        levelFileId - e.g. "level3Spikes"
   * @returns {boolean}
   */
  static isPerfectCompletion(constellationId, starId, levelFileId) {
    try {
      const data = JSON.parse(
        localStorage.getItem(`level_${SaveService._compositeKey(constellationId, starId)}`)
      );
      if (!data?.completed || data.bestStrokes == null) return false;
      const target = window.LevelProfileManifest?.getPerfectSolutionMovementCount(levelFileId);
      if (target == null) return false;
      return data.bestStrokes <= target;
    } catch (e) {
      return false;
    }
  }

  /**
   * Saves a settings object to localStorage and Firebase.
   * @param {Object} settings
   */
  static async saveSettings(settings) {
    try {
      localStorage.setItem("radianceRising_settings", JSON.stringify(settings));
    } catch (e) {}

    const user = window.AuthService?.getCurrentUser();
    if (!user) return;

    try {
      await set(dbRef(database, `users/${user.uid}/settings`), settings);
    } catch (err) {
      console.error("[SaveService] saveSettings Firebase write failed:", err);
    }
  }

  /**
   * Records that a purchase was made. Writes a timestamp to both localStorage
   * and Firebase.
   */
  static async savePurchase() {
    try {
      localStorage.setItem("radianceRising_purchased", "true");
    } catch (e) {}

    const user = window.AuthService?.getCurrentUser();
    if (!user) return;

    try {
      await set(dbRef(database, `users/${user.uid}/purchases`), {
        purchased: true,
        purchasedAt: Date.now()
      });
    } catch (err) {
      console.error("[SaveService] savePurchase Firebase write failed:", err);
    }
  }

  /**
   * Loads all saved data from Firebase for a given UID and merges it into
   * localStorage. Merge rules:
   *  - Level progress: take Firebase data if it has better strokes OR promotes
   *    the allLotusCollected flag; otherwise keep local.
   *  - Settings: overwrite local with Firebase version if present.
   *  - Purchases: if Firebase shows purchased, mark local as purchased too.
   *
   * After merging, dispatches 'radianceProgressLoaded' on window so the
   * constellation map can refresh star colors.
   *
   * @param {string} uid
   */
  static async loadFromFirebase(uid) {
    try {
      const snapshot = await get(dbRef(database, `users/${uid}`));
      const data = snapshot.val();
      if (!data) return;

      // Firebase keys are composite strings: "{constellationId}_{starId}"
      const levels = data.progress?.levels || {};
      for (const [compositeKey, fbLevel] of Object.entries(levels)) {
        const key = `level_${compositeKey}`;
        let local = null;
        try { local = JSON.parse(localStorage.getItem(key)); } catch (e) {}

        const fbHasBetterStrokes = !local || fbLevel.bestStrokes < local.bestStrokes;
        const fbPromotesLotus = fbLevel.allLotusCollected && (!local?.allLotusCollected);

        if (fbHasBetterStrokes || fbPromotesLotus) {
          const merged = {
            constellationId: fbLevel.constellationId || local?.constellationId || null,
            starId: fbLevel.starId ?? local?.starId ?? null,
            levelFileId: fbLevel.levelFileId || local?.levelFileId || null,
            completed: fbLevel.completed || local?.completed || false,
            bestStrokes: fbHasBetterStrokes ? fbLevel.bestStrokes : local.bestStrokes,
            allLotusCollected: fbLevel.allLotusCollected || local?.allLotusCollected || false,
            completedAt: fbLevel.completedAt || local?.completedAt || Date.now()
          };
          try {
            localStorage.setItem(key, JSON.stringify(merged));
          } catch (e) {}
        }

        // Keep the flat completedLevels array consistent for LevelsSolvedStatusTracker.
        const fileId = fbLevel.levelFileId || local?.levelFileId;
        if (fbLevel.completed && fileId) {
          SaveService._addToCompletedLevels(fileId);
        }
      }

      if (data.settings) {
        try {
          localStorage.setItem("radianceRising_settings", JSON.stringify(data.settings));
        } catch (e) {}
      }

      if (data.purchases?.purchased) {
        try {
          localStorage.setItem("radianceRising_purchased", "true");
        } catch (e) {}
      }
    } catch (err) {
      console.error("[SaveService] loadFromFirebase failed:", err);
      return;
    }

    // Notify the constellation map (and any other listeners) that Firebase
    // progress has been merged into localStorage and star colors may need refresh.
    try {
      window.dispatchEvent(new CustomEvent("radianceProgressLoaded", { detail: { uid } }));
    } catch (e) {}
  }

  /**
   * Pushes all localStorage level data to Firebase in a single multi-location
   * update. Reads all keys matching level_{compositeKey} plus settings and
   * purchase state.
   * @param {string} uid
   */
  static async mergeLocalToFirebase(uid) {
    const updates = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("level_")) continue;
      const compositeKey = key.slice(6); // strip "level_" prefix → "{constellationId}_{starId}"
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data) {
          updates[`users/${uid}/progress/levels/${compositeKey}`] = data;
        }
      } catch (e) {}
    }

    try {
      const rawSettings = localStorage.getItem("radianceRising_settings");
      if (rawSettings) {
        updates[`users/${uid}/settings`] = JSON.parse(rawSettings);
      }
    } catch (e) {}

    if (localStorage.getItem("radianceRising_purchased") === "true") {
      updates[`users/${uid}/purchases`] = {
        purchased: true,
        purchasedAt: Date.now()
      };
    }

    if (Object.keys(updates).length === 0) return;

    try {
      await update(dbRef(database, "/"), updates);
    } catch (err) {
      console.error("[SaveService] mergeLocalToFirebase failed:", err);
    }
  }

  /**
   * Adds levelFileId to the radianceRising_completedLevels localStorage array
   * if not already present. Keeps the flat list that LevelsSolvedStatusTracker
   * uses in sync when Firebase data is loaded.
   * @param {string} levelFileId - e.g. "level3Spikes"
   */
  static _addToCompletedLevels(levelFileId) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("radianceRising_completedLevels") || "[]"
      );
      if (!stored.includes(levelFileId)) {
        stored.push(levelFileId);
        localStorage.setItem("radianceRising_completedLevels", JSON.stringify(stored));
      }
    } catch (e) {}
  }
}

export { SaveService };
