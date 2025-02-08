class LightingTemplateStorage {
  /**
   * 
  a given template is all characteristics for a given lighting set-up including the "both the player and environment light preset (intensity, hue, variation),
  the player light offset, the environment light archetype (directional vs positional), and the directional angles or positional values corresponding to each type of light

   */
  getEnvironmentLightingPresetConfigurationByTemplate(configurationTemplate) {
    let templateConfigurationDefault = {
      environmentLightingCount: 4,

      environmentLightingArchetypes: [
        "direction",
        "direction",
        "direction",
        "direction",
      ],
      environmentLightingColorPresets: [
        "standard",
        "standard",
        "standard",
        "standard",
      ],
      environmentLightingMotionPresets: [
        "standard",
        "standard",
        "standard",
        "standard",
      ],
    };

    let doTemplateOverride = false;
    let templateConfigurationLoaded = templateConfigurationDefault;
    let templateConfigurationOverride = null;

    switch (configurationTemplate) {
      case "CURRENT_EXPERIMENT": {
        templateConfigurationOverride = {
          environmentLightingCount: 4,
          environmentLightingArchetypes: [
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
          ],
          environmentLightingColorPresets: [
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
          ],
          environmentLightingMotionPresets: [
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
            "CURRENT_EXPERIMENT",
          ],
        };
        doTemplateOverride = true;
      }
    }
    if (doTemplateOverride) {
      templateConfigurationLoaded = templateConfigurationOverride;
    }
    return new EnvironmentLightingTemplate(
      templateConfigurationLoaded.environmentLightingCount,
      templateConfigurationLoaded.environmentLightingArchetypes,
      templateConfigurationLoaded.environmentLightingColorPresets,
      templateConfigurationLoaded.environmentLightingMotionPresets
    );
  }
}

class EnvironmentLightingTemplate {
  constructor(
    environmentLightingCount,
    environmentLightingArchetypes,
    environmentLightingColorPresets,
    environmentLightingMotionPresets
  ) {
    this.environmentLightingCount = environmentLightingCount;
    this.environmentLightingArchetypes = environmentLightingArchetypes;
    this.environmentLightingColorPresets = environmentLightingColorPresets;
    this.environmentLightingPositionPresets = environmentLightingMotionPresets;
  }
}

class PlayerLightingTemplate {
  constructor(
    playerLightingCount,
    playerLightingArchetypes,
    playerLightingColorPresets,
    playerLightingMotionPreset
  ) {
    this.playerLightingCount = playerLightingCount;
    this.playerLightingArchetypes = playerLightingArchetypes;
    this.playerLightingColorPresets = playerLightingColorPresets;
    this.playerLightingMotionPreset = playerLightingMotionPreset;
  }
}
