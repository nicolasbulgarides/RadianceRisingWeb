/**
 * ShareButton
 *
 * Creates the "Share Solution" button and the Share Panel overlay in Babylon.js GUI.
 * Attaches to the BaseGameUIScene's AdvancedDynamicTexture as a floating overlay.
 *
 * Lifecycle:
 *   1. Listens for "radianceLevelCompleted" event — stores pending completion data.
 *   2. Listens for "radianceLevelCompleted" — shows a "Share Solution" button
 *      once the WorldLoaderScene becomes active (the star map view after replay).
 *   3. Tapping "Share Solution" opens the Share Panel with a live preview + slider.
 *   4. Slider adjusts how many moves are revealed; preview updates (debounced 250ms).
 *   5. "Share to Clipboard" copies the current preview and closes the panel.
 *   6. "✕ Close" or tap-outside dismisses the panel without sharing.
 *
 * Exposed as window.ShareButton.
 */

class ShareButton {

    static _shareButtonRect    = null;  // the small "Share Solution" button control
    static _sharePanelRoot     = null;  // the full share panel overlay
    static _completionData     = null;  // stored on "radianceLevelCompleted"
    static _currentPreviewCanvas = null;
    static _debounceTimer      = null;
    static _currentMovesToShow = null;
    static _generatingPreview  = false;
    static _activeSliderValue  = null;

    // ── Initialization ────────────────────────────────────────────────────────

    static init() {
        // Store completion data when a level finishes
        window.addEventListener("radianceLevelCompleted", (evt) => {
            ShareButton._completionData = evt.detail || null;
            ShareButton._currentMovesToShow = null;
        });

        // Show/hide share button based on WorldLoaderScene being active
        window.addEventListener("radianceLevelCompleted", () => {
            // Delay slightly so the replay can start, then show after replay ends
            // We detect WorldLoaderScene by polling — same scene as HintSystem approach
            ShareButton._scheduleShareButtonVisibilityCheck();
        });
    }

    static _scheduleShareButtonVisibilityCheck() {
        // Poll until WorldLoaderScene is active (after replay completes)
        const check = () => {
            const rss = FundamentalSystemBridge?.["renderSceneSwapper"];
            if (!rss) { setTimeout(check, 500); return; }
            const scene = rss.getActiveGameLevelScene?.();
            const inWorld = scene && (scene instanceof WorldLoaderScene);
            if (inWorld && ShareButton._completionData) {
                const elig = window.ShareEligibility?.canShare(ShareButton._completionData);
                if (elig?.eligible) {
                    ShareButton._showShareButton();
                }
            } else if (!inWorld) {
                // Still in game/replay — check again later
                setTimeout(check, 800);
            }
        };
        setTimeout(check, 500);
    }

    // ── Share Button ──────────────────────────────────────────────────────────

    static _getAdt() {
        const rss = FundamentalSystemBridge?.["renderSceneSwapper"];
        if (!rss) return null;
        const uiScene = rss.getSceneByName?.("BaseUIScene")
                     || rss.getSceneBuilderForScene?.("BaseUIScene");
        return uiScene?.advancedTexture || window.gameUIInstance?.advancedTexture || null;
    }

    static _showShareButton() {
        const adt = ShareButton._getAdt();
        if (!adt) return;
        if (ShareButton._shareButtonRect) return; // already shown

        const btn = new BABYLON.GUI.Rectangle("shareBtn");
        btn.width               = "220px";
        btn.height              = "60px";
        btn.background          = "#1a0a2e";
        btn.color               = "#7b4fd4";
        btn.thickness           = 2;
        btn.cornerRadius        = 12;
        btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        btn.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        btn.top                 = "-180px";
        btn.alpha               = 0;
        btn.zIndex              = 200;

        const lbl = new BABYLON.GUI.TextBlock("shareBtnLbl", "\u2605 Share Solution");
        lbl.color    = "#ffffff";
        lbl.fontSize = 22;
        lbl.fontFamily = window.FontManager ? FontManager.getCurrentFontFamily() : "Arial";
        btn.addControl(lbl);

        adt.addControl(btn);
        ShareButton._shareButtonRect = btn;

        // Fade in
        ShareButton._fadeControl(btn, 0, 1, 400);

        btn.onPointerClickObservable.add(() => {
            ShareButton._openSharePanel();
        });

        // Also dismiss when the player navigates away into a level
        ShareButton._watchForLevelStart();
    }

    static _hideShareButton() {
        if (!ShareButton._shareButtonRect) return;
        const adt = ShareButton._getAdt();
        const btn = ShareButton._shareButtonRect;
        ShareButton._shareButtonRect = null;
        ShareButton._fadeControl(btn, 1, 0, 200, () => {
            try { adt?.removeControl(btn); } catch (_) {}
        });
    }

    static _watchForLevelStart() {
        // Hide share button when a new level loads (movementTracker starts tracking)
        const handler = () => {
            ShareButton._hideShareButton();
            window.removeEventListener("radianceLevelCompleted", handler);
        };
        // Re-use GameEventBus for moves: hide after first real move
        const onMove = (data) => {
            if (data.type === "move") {
                ShareButton._hideShareButton();
                GameEventBus.off("gameInteraction", onMove);
            }
        };
        GameEventBus.on("gameInteraction", onMove);
    }

    // ── Share Panel ───────────────────────────────────────────────────────────

    static async _openSharePanel() {
        const adt = ShareButton._getAdt();
        if (!adt || ShareButton._sharePanelRoot) return;

        const data = ShareButton._completionData;
        if (!data) return;

        const totalMoves = data.totalMoves || 1;
        ShareButton._currentMovesToShow = totalMoves; // default = full solution

        // Pre-generate Stage 1 (cache it now so slider changes are fast)
        ShareImagePipeline.clearCache();

        // ── Full overlay background (tap-outside to dismiss) ──
        const overlay = new BABYLON.GUI.Rectangle("sharePanelOverlay");
        overlay.width      = "100%";
        overlay.height     = "100%";
        overlay.background = "rgba(0,0,0,0.55)";
        overlay.color      = "transparent";
        overlay.thickness  = 0;
        overlay.alpha      = 0;
        overlay.zIndex     = 300;
        adt.addControl(overlay);
        ShareButton._sharePanelRoot = overlay;

        overlay.onPointerClickObservable.add((evtData) => {
            // Dismiss on outside click
            ShareButton._closeSharePanel();
        });

        // ── Panel card ──
        const panelW = 580, panelH = 720;
        const panel = new BABYLON.GUI.Rectangle("sharePanel");
        panel.width               = `${panelW}px`;
        panel.height              = `${panelH}px`;
        panel.background          = "#1a0a2e";
        panel.color               = "#7b4fd4";
        panel.thickness           = 2;
        panel.cornerRadius        = 16;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        panel.zIndex              = 310;
        overlay.addControl(panel);

        // Prevent click-through to overlay dismiss
        panel.onPointerClickObservable.add((evtData) => {
            evtData.skipNextObservers = true;
        });

        // ── Title ──
        const titleLbl = new BABYLON.GUI.TextBlock("sharePanelTitle", "Share Solution");
        titleLbl.color    = "#ffffff";
        titleLbl.fontSize = 28;
        titleLbl.fontFamily = window.FontManager ? FontManager.getCurrentFontFamily() : "Arial";
        titleLbl.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleLbl.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        titleLbl.top  = "20px";
        panel.addControl(titleLbl);

        // ── Preview image area ──
        const previewW = 380, previewH = 320;
        const previewBorder = new BABYLON.GUI.Rectangle("sharePanelPreviewBorder");
        previewBorder.width               = `${previewW}px`;
        previewBorder.height              = `${previewH}px`;
        previewBorder.background          = "#0a0520";
        previewBorder.color               = "#3d2066";
        previewBorder.thickness           = 1;
        previewBorder.cornerRadius        = 8;
        previewBorder.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        previewBorder.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        previewBorder.top                 = "65px";
        panel.addControl(previewBorder);

        // Placeholder "Generating..." label shown while preview loads
        const genLabel = new BABYLON.GUI.TextBlock("shareGenLabel", "Generating...");
        genLabel.color    = "#b8a9d4";
        genLabel.fontSize = 18;
        previewBorder.addControl(genLabel);

        const previewImage = new BABYLON.GUI.Image("sharePanelPreview", null);
        previewImage.width   = `${previewW - 4}px`;
        previewImage.height  = `${previewH - 4}px`;
        previewImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
        previewImage.isVisible = false;
        previewBorder.addControl(previewImage);

        // ── Moves revealed label ──
        const movesLabel = new BABYLON.GUI.TextBlock("sharePanelMovesLbl", `Moves revealed: ${totalMoves} / ${totalMoves}`);
        movesLabel.color    = "#b8a9d4";
        movesLabel.fontSize = 20;
        movesLabel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        movesLabel.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        movesLabel.top = "400px";
        panel.addControl(movesLabel);

        // ── Slider ──
        const slider = new BABYLON.GUI.Slider("sharePanelSlider");
        slider.minimum              = 1;
        slider.maximum              = totalMoves;
        slider.value                = totalMoves;
        slider.step                 = 1;
        slider.width                = "440px";
        slider.height               = "32px";
        slider.color                = "#7b4fd4";
        slider.background           = "#1a0a2e";
        slider.borderColor          = "#3d2066";
        slider.thumbColor           = "#7b4fd4";
        slider.isThumbCircle        = true;
        slider.horizontalAlignment  = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        slider.verticalAlignment    = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        slider.top                  = "440px";
        panel.addControl(slider);

        // Endpoint labels
        const sliderEndLabels = new BABYLON.GUI.StackPanel("sliderEndLabels");
        sliderEndLabels.isVertical          = false;
        sliderEndLabels.width               = "440px";
        sliderEndLabels.height              = "24px";
        sliderEndLabels.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        sliderEndLabels.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        sliderEndLabels.top                 = "478px";
        panel.addControl(sliderEndLabels);

        const hintLbl = new BABYLON.GUI.TextBlock("sliderHint", "Hint");
        hintLbl.color    = "#8888aa";
        hintLbl.fontSize = 14;
        hintLbl.width    = "50%";
        hintLbl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        sliderEndLabels.addControl(hintLbl);

        const fullLbl = new BABYLON.GUI.TextBlock("sliderFull", "Full");
        fullLbl.color    = "#8888aa";
        fullLbl.fontSize = 14;
        fullLbl.width    = "50%";
        fullLbl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        sliderEndLabels.addControl(fullLbl);

        // ── Share to Clipboard button ──
        const shareBtn = new BABYLON.GUI.Rectangle("sharePanelShareBtn");
        shareBtn.width               = "280px";
        shareBtn.height              = "52px";
        shareBtn.background          = "#7b4fd4";
        shareBtn.color               = "transparent";
        shareBtn.thickness           = 0;
        shareBtn.cornerRadius        = 10;
        shareBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        shareBtn.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        shareBtn.top                 = "520px";
        panel.addControl(shareBtn);

        const shareBtnLbl = new BABYLON.GUI.TextBlock("sharePanelShareBtnLbl", "Share to Clipboard");
        shareBtnLbl.color    = "#ffffff";
        shareBtnLbl.fontSize = 20;
        shareBtn.addControl(shareBtnLbl);

        // ── Close button ──
        const closeBtn = new BABYLON.GUI.TextBlock("sharePanelCloseBtn", "\u2715 Close");
        closeBtn.color    = "#cccccc";
        closeBtn.fontSize = 20;
        closeBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        closeBtn.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        closeBtn.top      = "592px";
        closeBtn.isPointerBlocker = true;
        panel.addControl(closeBtn);

        // ── Panel fade in ──
        ShareButton._fadeControl(overlay, 0, 1, 400);

        // ── Event handlers ──

        // Slider: update label immediately, debounce preview generation
        slider.onValueChangedObservable.add((value) => {
            const v = Math.round(value);
            ShareButton._activeSliderValue = v;
            movesLabel.text = `Moves revealed: ${v} / ${totalMoves}`;
            // Show loading state
            previewImage.isVisible = false;
            genLabel.isVisible     = true;
            genLabel.text          = "Generating...";
            // Debounce
            if (ShareButton._debounceTimer) clearTimeout(ShareButton._debounceTimer);
            ShareButton._debounceTimer = setTimeout(() => {
                ShareButton._regeneratePreview(v, previewImage, genLabel, data);
            }, 250);
        });

        shareBtn.onPointerClickObservable.add(async () => {
            if (ShareButton._generatingPreview) return;
            shareBtnLbl.text     = "Copying...";
            shareBtn.background  = "#5a3aaa";
            shareBtn.isEnabled   = false;

            const n = ShareButton._activeSliderValue ?? totalMoves;
            // Use the already-generated canvas if available
            let canvas = ShareButton._currentPreviewCanvas;
            if (!canvas) {
                const result = await ShareImagePipeline.generate(data, n);
                canvas = result.canvas;
            }
            const ok = canvas ? await ShareOutputHandler.toClipboard(canvas) : false;

            if (ok) {
                shareBtnLbl.text    = "Copied!";
                shareBtn.background = "#3a8a4a";
                setTimeout(() => ShareButton._closeSharePanel(), 1500);
            } else {
                shareBtnLbl.text    = "Couldn't copy — try again";
                shareBtn.background = "#7b4fd4";
                shareBtn.isEnabled  = true;
                setTimeout(() => { shareBtnLbl.text = "Share to Clipboard"; }, 2500);
            }
        });

        closeBtn.onPointerClickObservable.add(() => {
            ShareButton._closeSharePanel();
        });

        // Generate initial preview (full solution)
        ShareButton._activeSliderValue = totalMoves;
        ShareButton._regeneratePreview(totalMoves, previewImage, genLabel, data);
    }

    static async _regeneratePreview(movesToShow, previewImageControl, genLabelControl, data) {
        ShareButton._generatingPreview = true;
        try {
            const result = await ShareImagePipeline.generate(data, movesToShow);
            if (!result.eligible || !result.canvas) {
                genLabelControl.text      = "Preview unavailable";
                genLabelControl.isVisible = true;
                return;
            }
            ShareButton._currentPreviewCanvas = result.canvas;
            const dataUrl = ShareOutputHandler.toDataURL(result.canvas);
            previewImageControl.source    = dataUrl;
            previewImageControl.isVisible = true;
            genLabelControl.isVisible     = false;
        } catch (err) {
            console.warn("[ShareButton] Preview generation error:", err);
            genLabelControl.text      = "Preview error";
            genLabelControl.isVisible = true;
        } finally {
            ShareButton._generatingPreview = false;
        }
    }

    static _closeSharePanel() {
        const adt = ShareButton._getAdt();
        const root = ShareButton._sharePanelRoot;
        if (!root) return;
        ShareButton._sharePanelRoot = null;
        ShareButton._currentPreviewCanvas = null;
        if (ShareButton._debounceTimer) { clearTimeout(ShareButton._debounceTimer); ShareButton._debounceTimer = null; }
        ShareImagePipeline.clearCache();
        ShareButton._fadeControl(root, 1, 0, 200, () => {
            try { adt?.removeControl(root); } catch (_) {}
        });
    }

    // ── Utilities ──────────────────────────────────────────────────────────────

    static _fadeControl(ctrl, fromAlpha, toAlpha, durationMs, onComplete) {
        const startTime = performance.now();
        const step = (now) => {
            const t = Math.min((now - startTime) / durationMs, 1);
            ctrl.alpha = fromAlpha + (toAlpha - fromAlpha) * t;
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                ctrl.alpha = toAlpha;
                if (onComplete) onComplete();
            }
        };
        requestAnimationFrame(step);
    }
}

// Auto-initialize when the page loads
window.addEventListener("load", () => {
    ShareButton.init();
});

window.ShareButton = ShareButton;
