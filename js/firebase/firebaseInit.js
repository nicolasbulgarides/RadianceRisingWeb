// firebaseInit.js — Firebase module entry point
//
// Loaded in index.html as <script type="module">. ES modules are deferred by
// default, so this runs after the HTML is fully parsed (and after the inline
// body script that starts ScriptInitializer). Firebase auth initializes in the
// background without blocking game startup.
//
// Responsibilities:
//   1. Import AuthService and SaveService from their module files.
//   2. Expose both as window globals so non-module game code can call them.
//   3. Wire the sign-in → load-progress connection without creating circular imports.
//   4. Call AuthService.initialize() to begin anonymous auth and session restore.

import { AuthService } from "./authService.js";
import { SaveService } from "./saveService.js";

// Expose to the rest of the non-module codebase.
window.AuthService = AuthService;
window.SaveService = SaveService;

// When a user becomes signed in (anonymous or permanent), load their Firebase
// progress into localStorage. This hook is called by AuthService's internal
// onAuthStateChanged listener.
AuthService._onSignIn = (uid) => SaveService.loadFromFirebase(uid);

// Start the auth system. Resolves anonymously on first launch or restores an
// existing session for returning users. No await needed — everything downstream
// is event-driven via auth state changes.
AuthService.initialize();
