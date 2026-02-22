/**
 * TextScaleManager
 *
 * Provides font-size scaling for UI text elements across the game.
 * Three preset sizes:
 *   Small  — 0.85× base font sizes
 *   Medium — 1.0×  base font sizes (default)
 *   Large  — 1.2×  base font sizes
 *
 * localStorage key: radiance_textScale ("Small" | "Medium" | "Large")
 *
 * Usage:
 *   const fontSize = TextScaleManager.scaledSize(34); // scales 34px by current factor
 *
 * Listen for changes:
 *   window.addEventListener("radianceTextScaleChanged", (evt) => {
 *     // evt.detail.scaleName, evt.detail.scale
 *   });
 */
class TextScaleManager {
  static SCALES = { Small: 0.85, Medium: 1.0, Large: 1.2 };

  /** Returns the name of the active scale ("Small" | "Medium" | "Large"). Always reads from localStorage. */
  static getCurrentScaleName() {
    const stored = localStorage.getItem("radiance_textScale") || "Medium";
    return TextScaleManager.SCALES[stored] !== undefined ? stored : "Medium";
  }

  /** Returns the numeric multiplier for the active scale. */
  static getCurrentScale() {
    return TextScaleManager.SCALES[TextScaleManager.getCurrentScaleName()] ?? 1.0;
  }

  /**
   * Returns base font size multiplied by the current scale, rounded to nearest integer.
   * @param {number} base - Base font size in pixels.
   * @returns {number} Scaled font size.
   */
  static scaledSize(base) {
    return Math.round(base * TextScaleManager.getCurrentScale());
  }

  /**
   * Returns scaledSize(base) clamped to a maximum value.
   * @param {number} base - Base font size in pixels.
   * @param {number} max  - Maximum allowed size.
   * @returns {number} Scaled font size, not exceeding max.
   */
  static clampedSize(base, max) {
    return Math.min(TextScaleManager.scaledSize(base), max);
  }

  /**
   * Sets the active text scale by preset name and fires "radianceTextScaleChanged".
   * @param {string} name - "Small" | "Medium" | "Large"
   */
  static setScale(name) {
    if (!TextScaleManager.SCALES[name]) return;
    try { localStorage.setItem("radiance_textScale", name); } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent("radianceTextScaleChanged", {
        detail: { scaleName: name, scale: TextScaleManager.getCurrentScale() }
      }));
    } catch (e) {}
  }
}

window.TextScaleManager = TextScaleManager;
