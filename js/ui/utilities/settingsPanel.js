// settingsPanel.js
// Full-screen Babylon.js GUI settings overlay, matching the sign-in prompt aesthetic.
//
// Opens via:  window.dispatchEvent(new CustomEvent("radianceOpenSettings"))
//         or: SettingsPanel.show()
//
// localStorage keys managed here:
//   radianceRising_settings  — JSON object; fields sfxVolume, musicVolume (0-100)
//   radiance_muteAll         — "true" | "false"
//   radiance_showStrokes     — "true" | "false"  (defaults true)
//
// Methods that need external wiring:
//   window.AudioManager.setSFXVolume(0-100)   — called on SFX slider release
//   window.AudioManager.setMusicVolume(0-100) — called on Music slider release
//   window.AudioManager.muteAll()             — called when Mute All is toggled on
//   window.AudioManager.unmuteAll()           — called when Mute All is toggled off
//   window.SaveService.resetProgress()        — called on confirmed Reset Progress
//   radiance_showStrokes localStorage key     — read by caller to hide/show move counter

class SettingsPanel {
  static _isVisible = false;
  static _debounceTimer = null;

  // Register the "radianceOpenSettings" event listener once at load time.
  static init() {
    window.addEventListener("radianceOpenSettings", () => {
      SettingsPanel.show();
    });
  }

  static show() {
    if (SettingsPanel._isVisible) return;

    const swapper = FundamentalSystemBridge["renderSceneSwapper"];
    const uiScene = swapper?.getSceneByName?.("BaseUIScene");
    const adt = uiScene?.advancedTexture;
    if (!adt) {
      console.warn("[SettingsPanel] BaseUIScene advancedTexture not available");
      return;
    }

    SettingsPanel._isVisible = true;
    SettingsPanel._buildPanel(adt);
  }

  // ── Settings I/O ────────────────────────────────────────────────────────

  static _readVolumes() {
    let sfx = 75, music = 75;
    try {
      const obj = JSON.parse(localStorage.getItem("radianceRising_settings") || "{}");
      sfx   = obj.sfxVolume   ?? 75;
      music = obj.musicVolume ?? 75;
    } catch (e) {}
    return { sfx, music };
  }

  static _saveVolumes(sfx, music) {
    let obj = {};
    try { obj = JSON.parse(localStorage.getItem("radianceRising_settings") || "{}"); } catch (e) {}
    obj.sfxVolume   = sfx;
    obj.musicVolume = music;
    try { localStorage.setItem("radianceRising_settings", JSON.stringify(obj)); } catch (e) {}

    // Debounced Firebase sync (1 second).
    if (SettingsPanel._debounceTimer) clearTimeout(SettingsPanel._debounceTimer);
    SettingsPanel._debounceTimer = setTimeout(() => {
      window.SaveService?.saveSettings?.(obj);
      SettingsPanel._debounceTimer = null;
    }, 1000);
  }

  // Snap value to nearest of 25/50/75/100 if within 8 units; otherwise keep exact value.
  static _snapVolume(raw) {
    const snaps = [25, 50, 75, 100];
    for (const s of snaps) {
      if (Math.abs(raw - s) <= 8) return s;
    }
    return raw;
  }

  // ── Panel construction ───────────────────────────────────────────────────

  static _buildPanel(adt) {
    const vols           = SettingsPanel._readVolumes();
    const isMutedInitial = localStorage.getItem("radiance_muteAll") === "true";

    // Outer container — single node whose alpha we animate for fade-in/out.
    const container = new BABYLON.GUI.Rectangle("sp_container");
    container.width      = "100%";
    container.height     = "100%";
    container.background = "transparent";
    container.color      = "transparent";
    container.thickness  = 0;
    container.alpha      = 0;
    adt.addControl(container);

    // Dismiss helper — all close paths funnel through here.
    let dismissed = false;
    let escHandler;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      if (escHandler) window.removeEventListener("keydown", escHandler);
      SettingsPanel._animateOut(container, adt);
    };
    escHandler = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", escHandler);

    // Overlay — click outside panel to dismiss.
    // Added before panel so panel (added after) renders on top and absorbs its own clicks.
    const overlay = new BABYLON.GUI.Rectangle("sp_overlay");
    overlay.width      = "100%";
    overlay.height     = "100%";
    overlay.background = "#000000";
    overlay.alpha      = 0.6;
    overlay.color      = "transparent";
    overlay.thickness  = 0;
    container.addControl(overlay);
    overlay.onPointerClickObservable.add(() => dismiss());

    // Panel — centered, sits above the overlay in z-order.
    const panel = new BABYLON.GUI.Rectangle("sp_panel");
    panel.width        = "360px";
    panel.height       = "480px";
    panel.background   = "#1a0a2e";
    panel.color        = "#7b4fd4";
    panel.thickness    = 2;
    panel.cornerRadius = 16;
    container.addControl(panel);

    // ── Title ──────────────────────────────────────────────────────────────
    const title = new BABYLON.GUI.TextBlock("sp_title", "Settings");
    title.color                   = "#ffffff";
    title.fontSize                = 20;
    title.fontWeight              = "bold";
    title.height                  = "30px";
    title.top                     = "-200px";
    title.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(title);

    // Thin purple divider under title.
    const divider = new BABYLON.GUI.Rectangle("sp_divider");
    divider.width      = "310px";
    divider.height     = "1px";
    divider.background = "#7b4fd4";
    divider.color      = "transparent";
    divider.thickness  = 0;
    divider.top        = "-174px";
    panel.addControl(divider);

    // Close X — upper-right of panel.
    // panel is 360×480. CENTER-aligned children: left=+150 places center 150px right of
    // panel center → (360/2 - 150) = 30px padding from right edge. top=-213 → 27px from top.
    const closeBtn = new BABYLON.GUI.Rectangle("sp_close_btn");
    closeBtn.width        = "26px";
    closeBtn.height       = "26px";
    closeBtn.background   = "transparent";
    closeBtn.color        = "#7b4fd4";
    closeBtn.thickness    = 1;
    closeBtn.cornerRadius = 4;
    closeBtn.left         = "150px";
    closeBtn.top          = "-213px";
    panel.addControl(closeBtn);
    const closeLbl = new BABYLON.GUI.TextBlock("sp_close_lbl", "\u2715");
    closeLbl.color    = "#cccccc";
    closeLbl.fontSize = 13;
    closeBtn.addControl(closeLbl);
    closeBtn.onPointerClickObservable.add(() => dismiss());

    // ── SFX Volume ─────────────────────────────────────────────────────────
    SettingsPanel._addSectionLabel(panel, "Sound Effects", -145);
    SettingsPanel._addSliderRow(panel, "sfx", -115, vols.sfx, (val) => {
      const cur = SettingsPanel._readVolumes();
      SettingsPanel._saveVolumes(val, cur.music);
      if (window.AudioManager) {
        window.AudioManager.setSFXVolume(val);
      } else {
        console.warn("[SettingsPanel] window.AudioManager not found — setSFXVolume skipped");
      }
    });

    // ── Music Volume ────────────────────────────────────────────────────────
    SettingsPanel._addSectionLabel(panel, "Music Volume", -80);
    SettingsPanel._addSliderRow(panel, "music", -50, vols.music, (val) => {
      const cur = SettingsPanel._readVolumes();
      SettingsPanel._saveVolumes(cur.sfx, val);
      if (window.AudioManager) {
        window.AudioManager.setMusicVolume(val);
      } else {
        console.warn("[SettingsPanel] window.AudioManager not found — setMusicVolume skipped");
      }
    });

    // ── Mute All ────────────────────────────────────────────────────────────
    // Single centered button whose label toggles between "Mute All" and "Unmute All".
    let isMuted = isMutedInitial;
    const muteBtn = new BABYLON.GUI.Rectangle("sp_mute_btn");
    muteBtn.width        = "200px";
    muteBtn.height       = "34px";
    muteBtn.background   = isMuted ? "#c0392b" : "#3a2060";
    muteBtn.color        = "#7b4fd4";
    muteBtn.thickness    = 1;
    muteBtn.cornerRadius = 4;
    muteBtn.top          = "-6px";
    panel.addControl(muteBtn);
    const muteLbl = new BABYLON.GUI.TextBlock("sp_mute_lbl", isMuted ? "Unmute All" : "Mute All");
    muteLbl.color    = "#ffffff";
    muteLbl.fontSize = 13;
    muteBtn.addControl(muteLbl);
    muteBtn.onPointerClickObservable.add(() => {
      isMuted            = !isMuted;
      muteBtn.background = isMuted ? "#c0392b" : "#3a2060";
      muteLbl.text       = isMuted ? "Unmute All" : "Mute All";
      try { localStorage.setItem("radiance_muteAll", isMuted ? "true" : "false"); } catch (e) {}
      if (window.AudioManager) {
        if (isMuted) window.AudioManager.muteAll?.();
        else         window.AudioManager.unmuteAll?.();
      } else {
        console.warn("[SettingsPanel] window.AudioManager not found — mute state not applied");
      }
    });

    // ── Reset Progress ──────────────────────────────────────────────────────
    const resetBtn = new BABYLON.GUI.Rectangle("sp_reset_btn");
    resetBtn.width        = "220px";
    resetBtn.height       = "36px";
    resetBtn.background   = "#c0392b";
    resetBtn.color        = "transparent";
    resetBtn.thickness    = 0;
    resetBtn.cornerRadius = 4;
    resetBtn.top          = "75px";
    panel.addControl(resetBtn);
    const resetLbl = new BABYLON.GUI.TextBlock("sp_reset_lbl", "Reset Progress");
    resetLbl.color      = "#ffffff";
    resetLbl.fontSize   = 14;
    resetLbl.fontWeight = "bold";
    resetBtn.addControl(resetLbl);
    resetBtn.onPointerClickObservable.add(() => {
      SettingsPanel._showConfirmDialog(adt);
    });

    SettingsPanel._animateIn(container);
  }

  // ── Shared row builders ──────────────────────────────────────────────────

  // Section label — left-aligned text above a control row.
  static _addSectionLabel(panel, text, topPx) {
    const lbl = new BABYLON.GUI.TextBlock("sp_lbl_" + topPx, text);
    lbl.color                   = "#cccccc";
    lbl.fontSize                = 13;
    lbl.height                  = "20px";
    lbl.width                   = "280px";
    lbl.top                     = topPx + "px";
    lbl.left                    = "-15px";
    lbl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    lbl.horizontalAlignment     = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(lbl);
  }

  // Slider + value label row.
  // Slider is 200px wide, shifted left to leave room for the value text on the right.
  static _addSliderRow(panel, name, topPx, initialValue, onRelease) {
    const slider = new BABYLON.GUI.Slider("sp_slider_" + name);
    slider.minimum       = 0;
    slider.maximum       = 100;
    slider.value         = initialValue;
    slider.width         = "200px";
    slider.height        = "20px";
    slider.color         = "#7b4fd4";
    slider.background    = "#3a2060";
    slider.borderColor   = "transparent";
    slider.thumbWidth    = 18;
    slider.isThumbCircle = true;
    slider.top           = topPx + "px";
    slider.left          = "-28px";
    slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(slider);

    const valTxt = new BABYLON.GUI.TextBlock("sp_val_" + name, Math.round(initialValue).toString());
    valTxt.color                   = "#ffffff";
    valTxt.fontSize                = 13;
    valTxt.width                   = "36px";
    valTxt.height                  = "20px";
    valTxt.top                     = topPx + "px";
    valTxt.left                    = "130px";
    valTxt.horizontalAlignment     = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    valTxt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(valTxt);

    // Update display live while dragging.
    slider.onValueChangedObservable.add((value) => {
      valTxt.text = Math.round(value).toString();
    });

    // On pointer release: snap to nearest 25/50/75/100 if within 8 units, then fire callback.
    slider.onPointerUpObservable.add(() => {
      const snapped = SettingsPanel._snapVolume(Math.round(slider.value));
      slider.value = snapped;
      valTxt.text  = snapped.toString();
      onRelease(snapped);
    });

    return slider;
  }

  // Label-on-left + ON/OFF toggle-on-right row.
  static _addToggleRow(panel, name, topPx, labelText, initialOn, onChange) {
    let isOn = initialOn;

    const row = new BABYLON.GUI.Container("sp_row_" + name);
    row.width               = "310px";
    row.height              = "36px";
    row.top                 = topPx + "px";
    row.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(row);

    const rowLbl = new BABYLON.GUI.TextBlock("sp_rowlbl_" + name, labelText);
    rowLbl.color                   = "#cccccc";
    rowLbl.fontSize                = 13;
    rowLbl.width                   = "200px";
    rowLbl.height                  = "36px";
    rowLbl.horizontalAlignment     = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rowLbl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    row.addControl(rowLbl);

    const toggleBtn = new BABYLON.GUI.Rectangle("sp_toggle_" + name);
    toggleBtn.width               = "68px";
    toggleBtn.height              = "28px";
    toggleBtn.cornerRadius        = 4;
    toggleBtn.background          = isOn ? "#7b4fd4" : "#3a2060";
    toggleBtn.color               = "transparent";
    toggleBtn.thickness           = 0;
    toggleBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    row.addControl(toggleBtn);

    const toggleLbl = new BABYLON.GUI.TextBlock("sp_togglelbl_" + name, isOn ? "ON" : "OFF");
    toggleLbl.color    = "#ffffff";
    toggleLbl.fontSize = 13;
    toggleBtn.addControl(toggleLbl);

    toggleBtn.onPointerClickObservable.add(() => {
      isOn               = !isOn;
      toggleBtn.background = isOn ? "#7b4fd4" : "#3a2060";
      toggleLbl.text       = isOn ? "ON" : "OFF";
      onChange(isOn);
    });
  }

  // ── Confirm dialog ───────────────────────────────────────────────────────

  // Layered on top of the settings panel inside the same ADT.
  // Cancel or click-outside closes only the confirm dialog, not the settings panel.
  static _showConfirmDialog(adt) {
    const cc = new BABYLON.GUI.Rectangle("sp_cc");
    cc.width      = "100%";
    cc.height     = "100%";
    cc.background = "transparent";
    cc.color      = "transparent";
    cc.thickness  = 0;
    cc.alpha      = 0;
    adt.addControl(cc);

    const closeCC = () => { try { adt.removeControl(cc); } catch (e) {} };

    const ccOverlay = new BABYLON.GUI.Rectangle("sp_cc_overlay");
    ccOverlay.width      = "100%";
    ccOverlay.height     = "100%";
    ccOverlay.background = "#000000";
    ccOverlay.alpha      = 0.4;
    ccOverlay.color      = "transparent";
    ccOverlay.thickness  = 0;
    cc.addControl(ccOverlay);
    ccOverlay.onPointerClickObservable.add(() => closeCC());

    const cpanel = new BABYLON.GUI.Rectangle("sp_cc_panel");
    cpanel.width        = "300px";
    cpanel.height       = "160px";
    cpanel.background   = "#1a0a2e";
    cpanel.color        = "#7b4fd4";
    cpanel.thickness    = 2;
    cpanel.cornerRadius = 12;
    cc.addControl(cpanel);

    const msg = new BABYLON.GUI.TextBlock("sp_cc_msg", "Are you sure?\nThis cannot be undone.");
    msg.color                   = "#cccccc";
    msg.fontSize                = 13;
    msg.height                  = "48px";
    msg.top                     = "-38px";
    msg.textWrapping            = true;
    msg.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    cpanel.addControl(msg);

    const cancelBtn = new BABYLON.GUI.Rectangle("sp_cc_cancel");
    cancelBtn.width               = "110px";
    cancelBtn.height              = "32px";
    cancelBtn.background          = "#3a2060";
    cancelBtn.color               = "#7b4fd4";
    cancelBtn.thickness           = 1;
    cancelBtn.cornerRadius        = 4;
    cancelBtn.top                 = "38px";
    cancelBtn.left                = "-62px";
    cancelBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    cpanel.addControl(cancelBtn);
    const cancelLbl = new BABYLON.GUI.TextBlock("sp_cc_cancel_lbl", "Cancel");
    cancelLbl.color    = "#ffffff";
    cancelLbl.fontSize = 13;
    cancelBtn.addControl(cancelLbl);
    cancelBtn.onPointerClickObservable.add(() => closeCC());

    const confirmBtn = new BABYLON.GUI.Rectangle("sp_cc_confirm");
    confirmBtn.width               = "110px";
    confirmBtn.height              = "32px";
    confirmBtn.background          = "#c0392b";
    confirmBtn.color               = "transparent";
    confirmBtn.thickness           = 0;
    confirmBtn.cornerRadius        = 4;
    confirmBtn.top                 = "38px";
    confirmBtn.left                = "62px";
    confirmBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    cpanel.addControl(confirmBtn);
    const confirmLbl = new BABYLON.GUI.TextBlock("sp_cc_confirm_lbl", "Confirm");
    confirmLbl.color      = "#ffffff";
    confirmLbl.fontSize   = 13;
    confirmLbl.fontWeight = "bold";
    confirmBtn.addControl(confirmLbl);
    confirmBtn.onPointerClickObservable.add(() => {
      closeCC();
      if (typeof window.SaveService?.resetProgress === "function") {
        window.SaveService.resetProgress().catch(err => {
          console.error("[SettingsPanel] resetProgress failed:", err);
        });
      } else {
        console.warn("[SettingsPanel] SaveService.resetProgress is not available");
      }
    });

    SettingsPanel._animateIn(cc);
  }

  // ── Animations ───────────────────────────────────────────────────────────

  static _animateIn(container) {
    const duration  = 400;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      container.alpha = t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  static _animateOut(container, adt) {
    const duration   = 200;
    const startTime  = performance.now();
    const startAlpha = container.alpha;
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      container.alpha = startAlpha * (1 - t);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        try { adt.removeControl(container); } catch (e) {}
        SettingsPanel._isVisible = false;
      }
    };
    requestAnimationFrame(step);
  }
}

SettingsPanel.init();
