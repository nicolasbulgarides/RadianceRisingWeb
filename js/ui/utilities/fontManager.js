/**
 * FontManager
 *
 * Manages the active UI font for all Babylon.js GUI elements in Radiant Rays.
 * Persists the user's selection to localStorage key "radiance_font".
 * Exposed globally as window.FontManager.
 *
 * Usage:
 *   FontManager.setFont("Cinzel")        — change font, sweeps all live controls
 *   FontManager.getCurrentFont()         — returns current font name string
 *   FontManager.applyToElement(element)  — applies current font to one control
 */
class FontManager {

    static FONTS = {
        "Cinzel": {
            family: "Cinzel, Georgia, serif",
            label:  "Cinzel",
        },
        "Raleway": {
            family: "Raleway, Arial, sans-serif",
            label:  "Raleway",
        },
        "Orbitron": {
            family: "Orbitron, Arial, sans-serif",
            label:  "Orbitron",
        },
        "Exo 2": {
            family: "'Exo 2', Arial, sans-serif",
            label:  "Exo 2",
        },
        "Philosopher": {
            family: "Philosopher, Georgia, serif",
            label:  "Philosopher",
        },
    };

    static FONT_NAMES = ["Cinzel", "Raleway", "Orbitron", "Exo 2", "Philosopher"];

    static _currentFont = "Cinzel";

    // ── Initialisation ───────────────────────────────────────────────────────

    /** Load stored preference and register as window.FontManager. */
    static init() {
        try {
            const stored = localStorage.getItem("radiance_font");
            if (stored && FontManager.FONTS[stored]) {
                FontManager._currentFont = stored;
            }
        } catch (e) {}
        window.FontManager = FontManager;
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /** Returns the currently active font name (e.g. "Cinzel"). */
    static getCurrentFont() {
        return FontManager._currentFont;
    }

    /** Returns the CSS font-family string for the active font. */
    static getCurrentFontFamily() {
        return (FontManager.FONTS[FontManager._currentFont] ?? FontManager.FONTS["Cinzel"]).family;
    }

    /**
     * Applies the current font to a single Babylon GUI control.
     * Safe to call on any object — silently no-ops if fontFamily is absent.
     */
    static applyToElement(element) {
        if (!element || typeof element.fontFamily === "undefined") return;
        element.fontFamily = FontManager.getCurrentFontFamily();
    }

    /**
     * Sets the active font, persists to localStorage, and immediately
     * updates fontFamily on every live control across all registered scenes.
     * @param {string} fontName  One of FontManager.FONT_NAMES
     */
    static setFont(fontName) {
        if (!FontManager.FONTS[fontName]) return;
        FontManager._currentFont = fontName;
        try { localStorage.setItem("radiance_font", fontName); } catch (e) {}
        FontManager._sweepAllTextures();
    }

    // ── Internal helpers ─────────────────────────────────────────────────────

    /**
     * Iterates every scene registered in RenderSceneSwapper and applies the
     * current font to all controls in each scene's AdvancedDynamicTexture.
     */
    static _sweepAllTextures() {
        try {
            const swapper = FundamentalSystemBridge?.["renderSceneSwapper"];
            if (!swapper || !swapper.allStoredScenes) return;
            for (const scene of Object.values(swapper.allStoredScenes)) {
                if (scene && scene.advancedTexture) {
                    FontManager._sweepTexture(scene.advancedTexture);
                }
            }
        } catch (e) {}
    }

    /**
     * Recursively walks the control tree of one AdvancedDynamicTexture and
     * sets fontFamily on every control that exposes the property.
     * @param {BABYLON.GUI.AdvancedDynamicTexture} adt
     */
    static _sweepTexture(adt) {
        if (!adt || !adt._rootContainer) return;
        const family = FontManager.getCurrentFontFamily();
        const visit = (ctrl) => {
            if (ctrl && typeof ctrl.fontFamily !== "undefined") {
                ctrl.fontFamily = family;
            }
            if (ctrl?.children?.length) {
                ctrl.children.forEach(visit);
            }
        };
        try { visit(adt._rootContainer); } catch (e) {}
    }
}

FontManager.init();
