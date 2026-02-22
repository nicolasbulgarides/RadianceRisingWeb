/**
 * ParticleController
 *
 * Global enable/disable switch for all particle effects.
 * When disabled, createParameterizedExplosion() and explosionEffect() skip
 * ParticleSystem creation and return immediately.
 *
 * localStorage key: radiance_particlesDisabled ("true" | "false")
 */
class ParticleController {
  static _disabled = localStorage.getItem("radiance_particlesDisabled") === "true";

  /** Returns true if particles are currently disabled. */
  static isDisabled() {
    return ParticleController._disabled;
  }

  /**
   * Enables or disables all particle effects.
   * @param {boolean} val - true to disable particles, false to enable.
   */
  static setDisabled(val) {
    ParticleController._disabled = Boolean(val);
    try {
      localStorage.setItem(
        "radiance_particlesDisabled",
        ParticleController._disabled ? "true" : "false"
      );
    } catch (e) {}
  }
}

window.ParticleController = ParticleController;
