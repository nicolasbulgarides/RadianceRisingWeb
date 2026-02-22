// hintSystem.js
// Intelligent hint system for Radiant Rays.
//
// Opens via: window.dispatchEvent(new CustomEvent("radianceRequestHint"))
//         or: HintSystem.requestHint()
//
// localStorage keys:
//   radiance_hints           — integer, remaining hint count (default 3)
//   radianceRising_settings  — settings blob; hintsRemaining field kept in sync
//                              so Firebase saves hints when settings sync fires
//
// External events emitted:
//   radianceHintBadgeUpdate  — { detail: { count } } — update badge display
//   radianceGlowDpadButton   — { detail: { direction } } — glow a d-pad button (null to clear)
//
// Dev utility (call from browser console):
//   HintSystem.validateSolutionPath("levelVoyage1")

// ── Tips ────────────────────────────────────────────────────────────────────
// Stored as a separate constant so it can be edited or extended independently.
const HINT_SYSTEM_TIPS = [
  "Tap anywhere outside a menu to dismiss it",
  "Purple stars mean perfect completion — all lotuses collected",
  "Blue stars mean the level is solved but lotuses were missed",
  "You can restart any level using the restart button at the top",
  "Lotuses do not need to be collected in any order",
  "Your progress saves automatically to the cloud",
  "Completing a constellation unlocks new ones",
  "Spikes cost one heart — plan your path carefully",
  "Keys must be collected before their matching lock can be passed",
  "Sometimes the longest path is the correct one",
  // Additional tips based on codebase mechanics:
  "You slide until you hit a wall or obstacle — use walls to your advantage",
  "Hearts on the board restore one health — grab them when low",
  "Moving into a wall is free — use it to stop yourself in the right spot",
  "Your best stroke count for each level is saved permanently",
  "The move counter turns orange when you are within 3 strokes of perfect",
  "Mana powers your special ability — conserve it for tricky obstacles",
  "Artifacts can clear paths — think ahead before using them",
  "You can collect all lotuses on a later attempt after solving the level",
  "Each constellation introduces new obstacle combinations",
  "A perfect run requires the minimum stroke count AND all lotuses collected",
  "Locks block movement until unlocked — find the key first",
  "The restart button resets your current level without losing saved progress",
  "Picking up a key is automatic when you slide over it",
  "You can slide diagonally through gaps if no wall blocks the path",
];

// ── HintSystem ───────────────────────────────────────────────────────────────

class HintSystem {
  static _hintsRemaining = 3;
  static _hintPanel      = null;  // active panel control (confirm or hint)
  static _dismissTimer   = null;
  static _hintTierByLevel = {};   // { [levelId]: tierUsed (1|2|3) }
  static _badgeLabel      = null; // set externally by baseGameUIScene via _updateBadge event

  // ── Initialization ────────────────────────────────────────────────────────

  static init() {
    HintSystem._loadHintCount();

    // Warn loudly if debug override is active so it is never shipped by accident.
    if (HintSystem._isDebugMode()) {
      console.warn(
        "[HintSystem] \u26A0\uFE0F Debug mode active \u2014 hint count overridden to " +
        Config.HintDebuggingAdmin.overrideHintCount +
        ". Disable before release."
      );
    }

    window.addEventListener("radianceRequestHint", () => HintSystem.requestHint());

    // Re-read hint count after Firebase progress loads (may have updated settings).
    window.addEventListener("radianceProgressLoaded", () => {
      HintSystem._loadHintCount();
      HintSystem._updateBadge();
    });
  }

  // Returns true when the debug override is fully active.
  static _isDebugMode() {
    try {
      const cfg = Config.HintDebuggingAdmin;
      return cfg?.enabled === true && cfg?.overrideHintCount != null;
    } catch (e) { return false; }
  }

  // Returns the effective hint count (override or real).
  static _effectiveHintCount() {
    if (HintSystem._isDebugMode()) return Config.HintDebuggingAdmin.overrideHintCount;
    return HintSystem._hintsRemaining;
  }

  // ── Hint Count Persistence ────────────────────────────────────────────────

  static _loadHintCount() {
    try {
      const raw = localStorage.getItem("radiance_hints");
      if (raw !== null) {
        const n = parseInt(raw, 10);
        HintSystem._hintsRemaining = (!isNaN(n) && n >= 0) ? n : 3;
        return;
      }
      // Fallback: read from settings blob (synced from Firebase).
      const settings = JSON.parse(localStorage.getItem("radianceRising_settings") || "{}");
      if (typeof settings.hintsRemaining === "number" && settings.hintsRemaining >= 0) {
        HintSystem._hintsRemaining = settings.hintsRemaining;
      }
    } catch (e) {
      HintSystem._hintsRemaining = 3;
    }
  }

  static _saveHintCount() {
    try { localStorage.setItem("radiance_hints", HintSystem._hintsRemaining.toString()); } catch (e) {}

    // Piggyback on the existing settings Firebase sync so hints persist to the cloud.
    try {
      const settings = JSON.parse(localStorage.getItem("radianceRising_settings") || "{}");
      settings.hintsRemaining = HintSystem._hintsRemaining;
      localStorage.setItem("radianceRising_settings", JSON.stringify(settings));
      window.SaveService?.saveSettings?.(settings);
    } catch (e) {}
  }

  // ── Game-State Helpers ────────────────────────────────────────────────────

  static _getCurrentLevelId() {
    try {
      const gm = FundamentalSystemBridge["gameplayManagerComposite"];
      return gm?.primaryActiveGameplayLevel?.levelDataComposite?.levelHeaderData?.levelId ?? null;
    } catch (e) { return null; }
  }

  static _getMoveHistory() {
    try {
      const tracker = FundamentalSystemBridge["movementTracker"];
      if (!tracker) return [];
      return tracker.eventLog
        .filter(e => e.type === "move")
        .map(e => (e.direction || "").toUpperCase());
    } catch (e) { return []; }
  }

  static _getSolutionPath(levelId) {
    if (!levelId) return null;
    try {
      return LevelProfileManifest.getLevelProfile(levelId)?.solutionPath || null;
    } catch (e) { return null; }
  }

  // ── State Analysis ────────────────────────────────────────────────────────

  // Compares the player's move history against the level's solution path.
  // Returns { state, divergeIndex, nextOptimalMove }.
  //   state: 'on_path' | 'diverged_recoverable' | 'unrecoverable' | 'unknown'
  static _analyzeState(moveHistory, solutionPath) {
    if (!solutionPath || solutionPath.length === 0) {
      return { state: "unknown", divergeIndex: -1, nextOptimalMove: null };
    }

    // Strip UNLOCK actions from solution path when comparing directional moves.
    const dirPath = solutionPath.filter(m => m !== "UNLOCK");

    let divergeIndex = -1;
    for (let i = 0; i < moveHistory.length; i++) {
      if (i >= dirPath.length || moveHistory[i] !== dirPath[i]) {
        divergeIndex = i;
        break;
      }
    }

    if (divergeIndex === -1) {
      // Player is following the optimal path.
      const nextOptimalMove = dirPath[moveHistory.length] || null;
      return { state: "on_path", divergeIndex: -1, nextOptimalMove };
    }

    // Diverged — heuristic: recoverable if under 2.5× the perfect move count.
    const state = moveHistory.length <= dirPath.length * 2.5
      ? "diverged_recoverable"
      : "unrecoverable";
    return { state, divergeIndex, nextOptimalMove: null };
  }

  // ── Public API ────────────────────────────────────────────────────────────

  static requestHint() {
    if (HintSystem._hintPanel) return; // already showing something

    // Reset tier tracking if the level was restarted (move count back to 0).
    try {
      const tracker = FundamentalSystemBridge["movementTracker"];
      if (tracker && tracker.realMoveCount === 0) {
        const levelId = HintSystem._getCurrentLevelId();
        if (levelId) delete HintSystem._hintTierByLevel[levelId];
      }
    } catch (e) {}

    if (HintSystem._effectiveHintCount() <= 0) {
      HintSystem._showNoHintsPanel();
      return;
    }

    HintSystem._showUseHintConfirm();
  }

  // ── Confirm Dialog ────────────────────────────────────────────────────────

  static _showUseHintConfirm() {
    const adt = HintSystem._getAdt();
    if (!adt) return;

    const cc = new BABYLON.GUI.Rectangle("hs_cc");
    cc.width = "100%"; cc.height = "100%";
    cc.background = "transparent"; cc.color = "transparent";
    cc.thickness = 0; cc.alpha = 0;
    adt.addControl(cc);
    HintSystem._hintPanel = cc;

    const closeCC = () => {
      try { adt.removeControl(cc); } catch (e) {}
      HintSystem._hintPanel = null;
    };

    const overlay = new BABYLON.GUI.Rectangle("hs_cc_overlay");
    overlay.width = "100%"; overlay.height = "100%";
    overlay.background = "#000000"; overlay.alpha = 0.5;
    overlay.color = "transparent"; overlay.thickness = 0;
    cc.addControl(overlay);
    overlay.onPointerClickObservable.add(() => closeCC());

    const cpanel = new BABYLON.GUI.Rectangle("hs_cc_panel");
    cpanel.width = "300px"; cpanel.height = "160px";
    cpanel.background = "#1a0a2e"; cpanel.color = "#7b4fd4";
    cpanel.thickness = 2; cpanel.cornerRadius = 16;
    cc.addControl(cpanel);

    const msg = new BABYLON.GUI.TextBlock("hs_cc_msg",
      `Use a hint?\n${HintSystem._effectiveHintCount()} remaining`);
    msg.color = "#cccccc"; msg.fontSize = 18;
    msg.height = "56px"; msg.top = "-38px";
    msg.textWrapping = true;
    msg.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    cpanel.addControl(msg);

    const cancelBtn = new BABYLON.GUI.Rectangle("hs_cc_cancel");
    cancelBtn.width = "110px"; cancelBtn.height = "34px";
    cancelBtn.background = "#3a2060"; cancelBtn.color = "#7b4fd4";
    cancelBtn.thickness = 1; cancelBtn.cornerRadius = 4;
    cancelBtn.top = "38px"; cancelBtn.left = "-62px";
    cancelBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    cpanel.addControl(cancelBtn);
    const cancelLbl = new BABYLON.GUI.TextBlock("hs_cc_cancel_lbl", "Cancel");
    cancelLbl.color = "#ffffff"; cancelLbl.fontSize = 16;
    cancelBtn.addControl(cancelLbl);
    cancelBtn.onPointerClickObservable.add(() => closeCC());

    const useBtn = new BABYLON.GUI.Rectangle("hs_cc_use");
    useBtn.width = "110px"; useBtn.height = "34px";
    useBtn.background = "#7b4fd4"; useBtn.color = "transparent";
    useBtn.thickness = 0; useBtn.cornerRadius = 4;
    useBtn.top = "38px"; useBtn.left = "62px";
    useBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    cpanel.addControl(useBtn);
    const useLbl = new BABYLON.GUI.TextBlock("hs_cc_use_lbl", "Use");
    useLbl.color = "#ffffff"; useLbl.fontSize = 16; useLbl.fontWeight = "bold";
    useBtn.addControl(useLbl);
    useBtn.onPointerClickObservable.add(() => {
      closeCC();
      HintSystem._useHint();
    });

    HintSystem._animateIn(cc);
  }

  // ── Hint Computation & Display ────────────────────────────────────────────

  static _useHint() {
    // In debug mode hints never decrement so testing is uninterrupted.
    if (!HintSystem._isDebugMode()) {
      HintSystem._hintsRemaining = Math.max(0, HintSystem._hintsRemaining - 1);
      HintSystem._saveHintCount();
    }
    HintSystem._updateBadge();

    const levelId      = HintSystem._getCurrentLevelId();
    const moveHistory  = HintSystem._getMoveHistory();
    const solutionPath = HintSystem._getSolutionPath(levelId);
    const analysis     = HintSystem._analyzeState(moveHistory, solutionPath);

    // Advance the tier for this level (1 → 2 → 3, then stays at 3).
    const prevTier = HintSystem._hintTierByLevel[levelId] || 0;
    const tier = Math.min(prevTier + 1, 3);
    if (levelId) HintSystem._hintTierByLevel[levelId] = tier;

    let message      = "";
    let glowDir      = null;
    let offerRestart = false;

    // ── On optimal path ──────────────────────────────────────────────────────
    if (analysis.state === "on_path") {
      if (tier === 1) {
        message = "You are on the right track. Think about what the next move accomplishes.";
      } else if (tier === 2) {
        glowDir = analysis.nextOptimalMove;
        message = glowDir
          ? `The optimal next direction is highlighted on the d-pad.`
          : "You have followed the optimal path perfectly — keep going!";
      } else {
        const dir = analysis.nextOptimalMove;
        message = dir
          ? `The next optimal move is ${dir.charAt(0) + dir.slice(1).toLowerCase()}.`
          : "You have reached the end of the optimal path — complete the level!";
      }

    // ── Diverged but recoverable ──────────────────────────────────────────────
    } else if (analysis.state === "diverged_recoverable") {
      if (tier === 1) {
        message = "You took a different path but can still succeed. Think carefully about your remaining options.";
      } else if (tier === 2) {
        message = `Your move ${analysis.divergeIndex + 1} started a different path. Consider how to work from where you are.`;
      } else {
        message = "Consider restarting to follow the optimal path, or keep exploring from your current position.";
      }

    // ── Diverged and unrecoverable ────────────────────────────────────────────
    } else if (analysis.state === "unrecoverable") {
      if (tier === 1) {
        message = "There is no clear path forward from here. You will need to restart.";
      } else if (tier === 2) {
        message = analysis.divergeIndex >= 0
          ? `Move ${analysis.divergeIndex + 1} created an unsolvable position. Restart to try again.`
          : "This position cannot be solved. Restart to try again.";
      } else {
        message = "Tap the restart button at the top to begin a fresh attempt.";
        offerRestart = true;
      }

    // ── Unknown (no solution path) ────────────────────────────────────────────
    } else {
      message = "Keep exploring — no solution path is available for this level yet.";
    }

    HintSystem._showHintPanel(message, glowDir, offerRestart);
  }

  // ── Hint Panel ────────────────────────────────────────────────────────────

  static _showHintPanel(message, glowDir, offerRestart) {
    const adt = HintSystem._getAdt();
    if (!adt) return;

    const container = new BABYLON.GUI.Rectangle("hs_panel_wrap");
    container.width = "100%"; container.height = "100%";
    container.background = "transparent"; container.color = "transparent";
    container.thickness = 0; container.alpha = 0;
    adt.addControl(container);
    HintSystem._hintPanel = container;

    const panel = new BABYLON.GUI.Rectangle("hs_panel");
    panel.width        = "800px";
    panel.height       = "340px";
    panel.background   = "#1a0a2e";
    panel.color        = "#7b4fd4";
    panel.thickness    = 2;
    panel.cornerRadius = 12;
    // Centered on screen, slightly above the midpoint.
    panel.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.top = "-80px";
    container.addControl(panel);

    // Tap panel to dismiss early.
    panel.onPointerClickObservable.add(() => HintSystem._dismissPanel());

    // Hint message — white, centered.
    const msgBlock = new BABYLON.GUI.TextBlock("hs_msg", message);
    msgBlock.color      = "#ffffff";
    msgBlock.fontSize   = 32;
    msgBlock.fontWeight = "normal";
    msgBlock.textWrapping = true;
    msgBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    msgBlock.width  = "720px";
    msgBlock.height = "160px";
    msgBlock.top    = "-56px";
    panel.addControl(msgBlock);

    // Rotating tip — italic, grey.
    const tip = HINT_SYSTEM_TIPS[Math.floor(Math.random() * HINT_SYSTEM_TIPS.length)];
    const tipBlock = new BABYLON.GUI.TextBlock("hs_tip", "Tip: " + tip);
    tipBlock.color      = "#888888";
    tipBlock.fontSize   = 24;
    tipBlock.fontStyle  = "italic";
    tipBlock.textWrapping = true;
    tipBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    tipBlock.width  = "720px";
    tipBlock.height = "88px";
    tipBlock.top    = "108px";
    panel.addControl(tipBlock);

    // Apply d-pad glow if requested.
    if (glowDir) HintSystem._triggerDpadGlow(glowDir);

    HintSystem._animateIn(container);

    // Auto-dismiss after 5 seconds.
    if (HintSystem._dismissTimer) clearTimeout(HintSystem._dismissTimer);
    HintSystem._dismissTimer = setTimeout(() => HintSystem._dismissPanel(), 5000);
  }

  static _showNoHintsPanel() {
    const adt = HintSystem._getAdt();
    if (!adt) return;

    const container = new BABYLON.GUI.Rectangle("hs_nohints_wrap");
    container.width = "100%"; container.height = "100%";
    container.background = "transparent"; container.color = "transparent";
    container.thickness = 0; container.alpha = 0;
    adt.addControl(container);
    HintSystem._hintPanel = container;

    const panel = new BABYLON.GUI.Rectangle("hs_nohints_panel");
    panel.width  = "600px"; panel.height = "180px";
    panel.background = "#1a0a2e"; panel.color = "#7b4fd4";
    panel.thickness = 2; panel.cornerRadius = 12;
    panel.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.top = "-80px";
    container.addControl(panel);
    panel.onPointerClickObservable.add(() => HintSystem._dismissPanel());

    const msg = new BABYLON.GUI.TextBlock("hs_nohints_msg", "You have no hints remaining.");
    msg.color = "#cccccc"; msg.fontSize = 32;
    msg.textWrapping = true;
    msg.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    msg.width = "520px"; msg.height = "120px";
    panel.addControl(msg);

    HintSystem._animateIn(container);
    if (HintSystem._dismissTimer) clearTimeout(HintSystem._dismissTimer);
    HintSystem._dismissTimer = setTimeout(() => HintSystem._dismissPanel(), 4000);
  }

  static _dismissPanel() {
    if (HintSystem._dismissTimer) { clearTimeout(HintSystem._dismissTimer); HintSystem._dismissTimer = null; }
    if (!HintSystem._hintPanel) return;
    const adt = HintSystem._getAdt();
    if (!adt) { HintSystem._hintPanel = null; return; }
    HintSystem._animateOut(HintSystem._hintPanel, adt);
    HintSystem._hintPanel = null;
  }

  // ── D-Pad Glow ────────────────────────────────────────────────────────────

  // Emits an event that baseGameUIScene listens for to place a glow overlay.
  static _triggerDpadGlow(direction) {
    if (!direction) return;
    window.dispatchEvent(new CustomEvent("radianceGlowDpadButton",
      { detail: { direction: direction.toUpperCase() } }));
    // Remove the glow after 3 seconds.
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("radianceGlowDpadButton",
        { detail: { direction: null } }));
    }, 3000);
  }

  // ── Badge ─────────────────────────────────────────────────────────────────

  static _updateBadge() {
    window.dispatchEvent(new CustomEvent("radianceHintBadgeUpdate", {
      detail: {
        count: HintSystem._effectiveHintCount(),
        debug: HintSystem._isDebugMode(),
      }
    }));
  }

  // ── Animations ────────────────────────────────────────────────────────────

  static _animateIn(container) {
    const dur = 400, t0 = performance.now();
    const step = now => {
      container.alpha = Math.min((now - t0) / dur, 1);
      if (container.alpha < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  static _animateOut(container, adt) {
    const dur = 200, t0 = performance.now(), a0 = container.alpha;
    const step = now => {
      const t = Math.min((now - t0) / dur, 1);
      container.alpha = a0 * (1 - t);
      if (t < 1) requestAnimationFrame(step);
      else { try { adt.removeControl(container); } catch (e) {} }
    };
    requestAnimationFrame(step);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  static _getAdt() {
    try {
      const swapper  = FundamentalSystemBridge["renderSceneSwapper"];
      const uiScene  = swapper?.getSceneByName?.("BaseUIScene");
      return uiScene?.advancedTexture || null;
    } catch (e) { return null; }
  }

  // ── Dev Utility ───────────────────────────────────────────────────────────

  /**
   * Validates that a level's solutionPath move count matches perfectSolutionMovementCount.
   * Call from the browser console: HintSystem.validateSolutionPath("levelVoyage1")
   * @param {string} levelId
   * @returns {{ levelId, solutionMoveCount, perfectSolutionMovementCount, valid }|null}
   */
  static validateSolutionPath(levelId) {
    const profile = LevelProfileManifest.getLevelProfile(levelId);
    if (!profile) {
      console.warn(`[HintSystem] validateSolutionPath: level not found — "${levelId}"`);
      return null;
    }
    if (!profile.solutionPath || profile.solutionPath.length === 0) {
      console.warn(`[HintSystem] validateSolutionPath: no solutionPath for "${levelId}"`);
      return null;
    }
    // UNLOCK steps don't count toward the movement count.
    const solutionMoveCount = profile.solutionPath.filter(m => m !== "UNLOCK").length;
    const perfect = profile.perfectSolutionMovementCount;
    const valid   = solutionMoveCount === perfect;
    console.log(
      `[HintSystem] validateSolutionPath("${levelId}"): ` +
      `solution moves=${solutionMoveCount}, perfect=${perfect} → ${valid ? "✓ VALID" : "✗ MISMATCH"}`
    );
    return { levelId, solutionMoveCount, perfectSolutionMovementCount: perfect, valid };
  }
}

HintSystem.init();
window.HintSystem = HintSystem;
