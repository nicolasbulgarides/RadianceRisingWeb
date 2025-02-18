/**
 * GameModeRequirementsComposite
 * Composite class for game mode-based unlock requirements.
 * Tracks conditions related to specific game modes that are required for unlocking levels or features.
 * Extends RequirementsGeneral.
 */
class GameModeRequirementsComposite extends RequirementsGeneral {
  constructor() {
    // Initialize an empty list for game mode-specific unlock requirements.
    this.gameModeRequirements = [];
  }
}
