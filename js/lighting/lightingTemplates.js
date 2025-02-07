class LightingTemplateStorage {
  /**
   * 
  a given template is all characteristics for a given lighting set-up including the "both the player and environment light preset (intensity, hue, variation),
  the player light offset, the environment light archetype (directional vs positional), and the directional angles or positional values corresponding to each type of light

   */
  getPresetConfigurationByTemplate(configurationTemplate) {
    let templateConfigurationDefault = {
      playerLightingPreset: "standardlevel0",
      playerLightingOffset: "standardlevel0",
      environmentLightingArchetype: "directional",
      environmentLightingColorPreset: "standardwhite",
      environmentLightingMotionPreset: "standardlevel0",
    };

    let doTemplateOverride = false;
    let templateConfigurationLoaded = templateConfigurationDefault;
    let templateConfigurationOverride = null;

    switch (configurationTemplate) {
      case "CURRENT_EXPERIMENT": {
        templateConfigurationOverride = {
          playerLightingPreset: "CURRENT_EXPERIMENT",
          playerLightingOffset: "CURRENT_EXPERIMENT",
          environmentLightingArchetype: "CURRENT_EXPERIMENT",
          environmentLightingColorPreset: "CURRENT_EXPERIMENT",
          environmentLightingMotionPreset: "CURRENT_EXPERIMENT",
        };
        doTemplateOverride = true;
      }
    }
    if (doTemplateOverride) {
      templateConfigurationLoaded = templateConfigurationOverride;
    }
    return new LightingTemplate(
      templateConfigurationLoaded.playerLightingPreset,
      templateConfigurationLoaded.playerLightingOffset,
      templateConfigurationLoaded.environmentLightingArchetype,
      templateConfigurationLoaded.environmentLightingColorPreset,
      templateConfigurationLoaded.environmentLightingMotionPreset
    );
  }
}

class LightingTemplate {
  constructor(
    playerLightingColorPreset,
    playerLightingOffsetPreset,
    environmentLightingArchetype,
    environmentLightingColorPreset,
    environmentLightingMotionPreset
  ) {
    this.playerLightingColorPreset = playerLightingColorPreset;
    this.playerLightingOffsetPreset = playerLightingOffsetPreset;
    this.environmentLightingArchetype = environmentLightingArchetype;
    this.environmentLightingColorPreset = environmentLightingColorPreset;
    this.environmentLightingPositionPreset = environmentLightingMotionPreset;
  }
}
