// AuthService — Firebase Authentication
// Loaded as an ES module via firebaseInit.js; exposed globally as window.AuthService.
import { auth } from "./firebaseConfig.js";
import {
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  linkWithPopup,
  onAuthStateChanged as fbOnAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

class AuthService {
  // Current Firebase User object (null until auth resolves).
  static _user = null;

  // Set of external onAuthStateChanged callbacks registered via AuthService.onAuthStateChanged().
  static _listeners = new Set();

  // Injected by firebaseInit.js — called with uid whenever a user becomes signed in.
  // Used to load/merge progress from Firebase without creating a circular module dependency.
  static _onSignIn = null;

  /**
   * Sets up the persistent auth state listener and signs in anonymously if no
   * session exists. Should be called once at app startup (from firebaseInit.js).
   *
   * Flow:
   *  - If Firebase already has a persisted session (returning user), the listener
   *    fires immediately with that user; _onSignIn is called to load progress.
   *  - If no session exists, signs in anonymously; the listener fires again with
   *    the new anonymous user.
   */
  static initialize() {
    let resolvedInitial = false;

    fbOnAuthStateChanged(auth, async (user) => {
      if (!resolvedInitial) {
        resolvedInitial = true;
        if (!user) {
          // No persisted session — sign in as guest.
          try {
            await signInAnonymously(auth);
          } catch (err) {
            console.error("[AuthService] Anonymous sign-in failed:", err);
          }
          // onAuthStateChanged will fire again once signInAnonymously resolves.
          return;
        }
      }

      AuthService._user = user;

      // Notify any external listeners.
      AuthService._listeners.forEach(cb => {
        try { cb(user); } catch (e) { console.error("[AuthService] Listener error:", e); }
      });

      // Trigger progress load hook (set by firebaseInit.js to call SaveService).
      if (user) {
        AuthService._onSignIn?.(user.uid);
      }
    });
  }

  /**
   * Signs in with a Google popup. Intended for fully signed-out users.
   * If the user is a guest, use upgradeGuestWithGoogle() instead to preserve
   * data continuity.
   * @returns {Promise<firebase.User>}
   */
  static async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      console.error("[AuthService] Google sign-in failed:", err);
      throw err;
    }
  }

  /**
   * Upgrades the current anonymous (guest) account to a permanent Google account
   * using linkWithPopup. The UID is preserved, so all data already saved to
   * Firebase under the anonymous UID remains intact. mergeLocalToFirebase is
   * triggered to push any locally-only data up to Firebase.
   *
   * Throws if the current user is not anonymous, or if the Google account is
   * already associated with a different Firebase account.
   * @returns {Promise<firebase.User>}
   */
  static async upgradeGuestWithGoogle() {
    if (!auth.currentUser?.isAnonymous) {
      throw new Error("[AuthService] upgradeGuestWithGoogle: current user is not a guest.");
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await linkWithPopup(auth.currentUser, provider);
      // UID is unchanged after link — push any offline-only local data to Firebase.
      AuthService._onSignIn?.(result.user.uid);
      return result.user;
    } catch (err) {
      // The Google account is already linked to a different Firebase account.
      // Sign in to that existing account directly, then merge any local progress.
      if (err.code === "auth/credential-already-in-use") {
        const credential = GoogleAuthProvider.credentialFromError(err);
        if (!credential) {
          console.error("[AuthService] credential-already-in-use but no credential in error:", err);
          throw err;
        }
        try {
          const result = await signInWithCredential(auth, credential);
          await window.SaveService?.mergeLocalToFirebase(result.user.uid);
          return result.user;
        } catch (signInErr) {
          console.error("[AuthService] Sign-in to existing account failed:", signInErr);
          throw signInErr;
        }
      }
      console.error("[AuthService] Guest upgrade failed:", err);
      throw err;
    }
  }

  /**
   * Triggers Google sign-in via a native DOM click event to guarantee the browser
   * treats the window.open() call inside linkWithPopup as a trusted user gesture.
   *
   * Background: browsers only allow popup windows when window.open() is called
   * within a trusted user-activation context. Babylon.js GUI observables fire
   * through the canvas pointer-event system, which some browsers do not propagate
   * as a trusted activation all the way into Firebase's linkWithPopup internals.
   * Routing through a native <button> click (which always carries user activation)
   * fixes the popup-blocking issue.
   *
   * Call this from Babylon.js button handlers instead of upgradeGuestWithGoogle().
   * @returns {void}
   */
  static triggerGoogleSignIn() {
    const btn = document.createElement("button");
    btn.style.cssText = "position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;";
    document.body.appendChild(btn);
    btn.addEventListener("click", () => {
      document.body.removeChild(btn);
      AuthService.upgradeGuestWithGoogle().catch(err => {
        console.warn("[AuthService] triggerGoogleSignIn failed:", err);
      });
    }, { once: true });
    btn.click();
  }

  /**
   * Returns the current Firebase User, or null if not yet signed in.
   * @returns {firebase.User|null}
   */
  static getCurrentUser() {
    return AuthService._user;
  }

  /**
   * Returns true if the current user is an anonymous guest.
   * @returns {boolean}
   */
  static isGuest() {
    return AuthService._user?.isAnonymous === true;
  }

  /**
   * Registers an external listener for auth state changes.
   * Fires immediately with the current user if one is already known.
   * @param {Function} callback - Called with (user) on each auth state change.
   * @returns {Function} Unsubscribe function.
   */
  static onAuthStateChanged(callback) {
    AuthService._listeners.add(callback);
    if (AuthService._user !== null) {
      try { callback(AuthService._user); } catch (e) {}
    }
    return () => AuthService._listeners.delete(callback);
  }
}

export { AuthService };
