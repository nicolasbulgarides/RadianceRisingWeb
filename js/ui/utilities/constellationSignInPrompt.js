// constellationSignInPrompt.js
// Listens for the "radianceConstellationComplete" custom event and shows a
// Babylon.js GUI sign-in modal if the player is an anonymous guest who hasn't
// seen the prompt yet.
//
// Modal specs:
//   - Fullscreen overlay (60 % black), centered 340×220 panel (#1a0a2e, #7b4fd4 border)
//   - Title: "Constellation Complete!" (white, 18 px bold)
//   - Body: "#cccccc", 13 px
//   - "Sign in with Google" button (#4285f4)
//   - "Maybe Later" button (transparent, #888888 label)
//   - 400 ms fade-in, 200 ms fade-out
//   - ESC key and click-outside-panel both dismiss
//   - Either dismissal writes localStorage key "radiance_shownSignInPrompt"

class ConstellationSignInPrompt {
  static _isVisible = false;

  // Called once at load time to register the event listener.
  static init() {
    window.addEventListener("radianceConstellationComplete", (evt) => {
      const constellationId = evt.detail?.constellationId ?? "the constellation";
      setTimeout(() => {
        ConstellationSignInPrompt._tryShow(constellationId);
      }, 1500);
    });
  }

  // Gate-checks before building the modal.
  static _tryShow(constellationId) {
    if (ConstellationSignInPrompt._isVisible) return;
    if (!window.AuthService?.isGuest?.()) return;
    try {
      if (localStorage.getItem("radiance_shownSignInPrompt")) return;
    } catch (e) {}

    const swapper = FundamentalSystemBridge["renderSceneSwapper"];
    const uiScene = swapper?.getSceneByName?.("BaseUIScene");
    const adt = uiScene?.advancedTexture;
    if (!adt) return;

    ConstellationSignInPrompt._isVisible = true;
    ConstellationSignInPrompt._buildModal(adt);
  }

  static _buildModal(adt) {
    // Outer container — the single node whose alpha we animate for fade-in/out.
    // Both overlay and panel are children, so they fade together.
    const container = new BABYLON.GUI.Rectangle("csp_container");
    container.width = "100%";
    container.height = "100%";
    container.background = "transparent";
    container.color = "transparent";
    container.thickness = 0;
    container.alpha = 0;
    adt.addControl(container);

    // Dismiss helper — all close paths funnel through here.
    let dismissed = false;
    let escKeyHandler;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      try { localStorage.setItem("radiance_shownSignInPrompt", "true"); } catch (e) {}
      if (escKeyHandler) window.removeEventListener("keydown", escKeyHandler);
      ConstellationSignInPrompt._animateOut(container, adt);
    };

    escKeyHandler = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", escKeyHandler);

    // Overlay — full-screen backdrop; clicking it (outside the panel) dismisses.
    // Added first so panel (added after) is rendered on top and absorbs its own clicks.
    const overlay = new BABYLON.GUI.Rectangle("csp_overlay");
    overlay.width = "100%";
    overlay.height = "100%";
    overlay.background = "#000000";
    overlay.alpha = 0.6;
    overlay.color = "transparent";
    overlay.thickness = 0;
    container.addControl(overlay);
    overlay.onPointerClickObservable.add(() => dismiss());

    // Panel — centered, sits above the overlay in z-order.
    const panel = new BABYLON.GUI.Rectangle("csp_panel");
    panel.width = "340px";
    panel.height = "220px";
    panel.background = "#1a0a2e";
    panel.color = "#7b4fd4";
    panel.thickness = 2;
    panel.cornerRadius = 8;
    container.addControl(panel);

    // Title
    const title = new BABYLON.GUI.TextBlock("csp_title", "Constellation Complete!");
    title.color = "#ffffff";
    title.fontSize = 18;
    title.fontWeight = "bold";
    title.height = "28px";
    title.top = "-72px";
    title.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(title);

    // Body text
    const body = new BABYLON.GUI.TextBlock(
      "csp_body",
      "Sign in with Google to save your\nprogress across all your devices."
    );
    body.color = "#cccccc";
    body.fontSize = 13;
    body.height = "44px";
    body.top = "-25px";
    body.textWrapping = true;
    body.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(body);

    // "Sign in with Google" button
    const googleBtn = new BABYLON.GUI.Rectangle("csp_google_btn");
    googleBtn.width = "220px";
    googleBtn.height = "36px";
    googleBtn.background = "#4285f4";
    googleBtn.color = "transparent";
    googleBtn.thickness = 0;
    googleBtn.cornerRadius = 4;
    googleBtn.top = "28px";
    panel.addControl(googleBtn);

    const googleLabel = new BABYLON.GUI.TextBlock("csp_google_label", "Sign in with Google");
    googleLabel.color = "#ffffff";
    googleLabel.fontSize = 14;
    googleLabel.fontWeight = "bold";
    googleBtn.addControl(googleLabel);

    googleBtn.onPointerClickObservable.add(() => {
      try { localStorage.setItem("radiance_shownSignInPrompt", "true"); } catch (e) {}
      if (escKeyHandler) window.removeEventListener("keydown", escKeyHandler);
      dismissed = true;
      ConstellationSignInPrompt._animateOut(container, adt);
      // triggerGoogleSignIn routes through a native DOM click so the browser
      // recognises window.open() as a trusted user gesture (popup stays open).
      window.AuthService?.triggerGoogleSignIn?.();
    });

    // "Maybe Later" button
    const laterBtn = new BABYLON.GUI.Rectangle("csp_later_btn");
    laterBtn.width = "220px";
    laterBtn.height = "28px";
    laterBtn.background = "transparent";
    laterBtn.color = "transparent";
    laterBtn.thickness = 0;
    laterBtn.top = "73px";
    panel.addControl(laterBtn);

    const laterLabel = new BABYLON.GUI.TextBlock("csp_later_label", "Maybe Later");
    laterLabel.color = "#888888";
    laterLabel.fontSize = 13;
    laterBtn.addControl(laterLabel);

    laterBtn.onPointerClickObservable.add(() => dismiss());

    // Start the fade-in animation.
    ConstellationSignInPrompt._animateIn(container);
  }

  static _animateIn(container) {
    const duration = 400;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      container.alpha = t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  static _animateOut(container, adt) {
    const duration = 200;
    const startTime = performance.now();
    const startAlpha = container.alpha;
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      container.alpha = startAlpha * (1 - t);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        try { adt.removeControl(container); } catch (e) {}
        ConstellationSignInPrompt._isVisible = false;
      }
    };
    requestAnimationFrame(step);
  }
}

ConstellationSignInPrompt.init();
