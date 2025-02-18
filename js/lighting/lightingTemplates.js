/**
 * LightingTemplateStorage Class
 *
 * Retrieves and builds lighting configuration templates based on a template identifier.
 * Each template defines the number of lights, their archetypes, color presets,
 * and motion presets.
 */
class LightingTemplateStorage {
  /**
   * Retrieves the environment lighting configuration based on a given template.
   *
   * @param {string} configurationTemplate - The template name defining the lighting configuration.
   * @returns {EnvironmentLightingTemplateBag} - An object containing lighting configurations such as archetypes, color presets, and motion presets.
   */
  getEnvironmentLightingConfigurationBagFromTemplate(configurationTemplate) {
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
        break;
      }
    }
    if (doTemplateOverride) {
      templateConfigurationLoaded = templateConfigurationOverride;
    }
    return new EnvironmentLightingTemplateBag(
      templateConfigurationLoaded.environmentLightingCount,
      templateConfigurationLoaded.environmentLightingArchetypes,
      templateConfigurationLoaded.environmentLightingColorPresets,
      templateConfigurationLoaded.environmentLightingMotionPresets
    );
  }

  getPlayerLightingConfigurationFromTemplate(configurationTemplate) {
    let templateConfigurationDefault = {
      playerLightingCount: 1,

      playerLightingArchetypes: ["position"],
      playerLightingColorPresets: ["standard"],
      playerLightingMotionPresets: ["standard"],
    };

    let doTemplateOverride = false;
    let templateConfigurationLoaded = templateConfigurationDefault;
    let templateConfigurationOverride = null;

    switch (configurationTemplate) {
      case "CURRENT_EXPERIMENT": {
        templateConfigurationOverride = {
          playerLightingCount: 1,
          playerLightingArchetypes: ["CURRENT_EXPERIMENT"],
          playerLightingColorPresets: ["CURRENT_EXPERIMENT"],
          playerLightingMotionPresets: ["CURRENT_EXPERIMENT"],
        };
        doTemplateOverride = true;
        break;
      }
    }
    if (doTemplateOverride) {
      templateConfigurationLoaded = templateConfigurationOverride;
    }
    return new PlayerLightingTemplateBag(
      templateConfigurationLoaded.playerLightingCount,
      templateConfigurationLoaded.playerLightingArchetypes,
      templateConfigurationLoaded.playerLightingColorPresets,
      templateConfigurationLoaded.playerLightingMotionPresets
    );
  }
}

/**
 * EnvironmentLightingTemplateBag Class
 *
 * Represents a composite container for environment lighting configuration.
 */
class EnvironmentLightingTemplateBag {
  /**
   * Creates an instance of EnvironmentLightingTemplateBag.
   *
   * @param {number} environmentLightingCount - Number of environment lights.
   * @param {string[]} environmentLightingArchetypes - List of light archetypes (directional or positional).
   * @param {string[]} environmentLightingColorPresets - List of color profiles for lights.
   * @param {Object[]} environmentLightingMotionPresets - List of motion configurations for lights.
   */
  constructor(
    environmentLightingCount,
    environmentLightingArchetypes,
    environmentLightingColorPresets,
    environmentLightingMotionPresets
  ) {
    this.environmentLightingCount = environmentLightingCount;
    this.environmentLightingArchetypes = environmentLightingArchetypes;
    this.environmentLightingColorPresets = environmentLightingColorPresets;
    this.environmentLightingMotionPresets = environmentLightingMotionPresets;
  }
  /**
   * Encapsulates the preset arrays into a single structure.
   *
   * @returns {Array[]} - Array containing archetypes, color presets, and motion presets.
   */
  encapsulatePresetArrays() {
    let bagArray = [
      this.environmentLightingArchetypes,
      this.environmentLightingColorPresets,
      this.environmentLightingMotionPresets,
    ];
    return bagArray;
  }

  /**
   * Converts the preset arrays into valid lighting templates if verification conditions are met.
   *
   * @param {boolean} verified - Determines if validation should be performed.
   * @returns {EnvironmentLightingTemplate[]} - An array of valid lighting templates or an empty array if validation fails.
   */
  convertLightingTemplateBagToIndividualValidTemplates(verified) {
    let templatesObtained = [];

    if (
      verified &&
      this.environmentLightingCount ==
        this.environmentLightingArchetypes.length &&
      this.environmentLightingCount ==
        this.environmentLightingColorPresets.length &&
      this.environmentLightingCount ==
        this.environmentLightingMotionPresets.length
    ) {
      let templateGenerationCounter = 0;
      while (templateGenerationCounter < this.environmentLightingCount) {
        let archetype =
          this.environmentLightingArchetypes[templateGenerationCounter];
        let colorPreset =
          this.environmentLightingColorPresets[templateGenerationCounter];
        let motionPreset =
          this.environmentLightingMotionPresets[templateGenerationCounter];

        let generatedTemplate = new EnvironmentLightingTemplate(
          archetype,
          colorPreset,
          motionPreset
        );
        templatesObtained.push(generatedTemplate);
        templateGenerationCounter += 1;
      }
    } else {
      let finalizedDecision = LoggerOmega.GetFinalizedLoggingDecision(
        LightingLogger.forcefullyOverrideLoggingConfig,
        LightingLogger.lightingLoggingEnabled,
        "secondary"
      );

      if (finalizedDecision) {
        LoggerOmega.SmartLogger(
          finalizedDecision,
          "Attempt to convert a template configuration to a set of preset individual templates was unsuccessful! Returning a blank array, expect darkness somewhere / everywhere.",
          "LightingTemplates-B"
        );
      }
    }
    return templatesObtained;
  }
}

/**
 * EnvironmentLightingTemplate Class
 *
 * Represents an environment lighting template.
 */
class EnvironmentLightingTemplate {
  /**
   * Represents an environment lighting template.
   *
   * @param {string} archetype - The type of light (directional or positional).
   * @param {string} colorPreset - The color profile of the light.
   * @param {Object} motionPreset - Motion settings including speed, distance, orbit, etc.
   */
  constructor(archetype, colorPreset, motionPreset) {
    this.environmentLightingArchetype = archetype;
    this.environmentLightingColorPreset = colorPreset;
    this.environmentLightingMotionPreset = motionPreset;
  }
}

/**
 * PlayerLightingTemplateBag Class
 *
 * Encapsulates configuration specific to player lighting.
 */
class PlayerLightingTemplateBag {
  /**
   * Represents a lighting template for a player character.
   *
   * @param {number} playerLightingCount - The number of lights assigned to the player.
   * @param {string[]} playerLightingArchetypes - The archetypes defining player lights.
   * @param {string[]} playerLightingColorPresets - The color profiles of player lights.
   * @param {Object} playerLightingMotionPreset - The motion settings for player lights.
   */
  constructor(
    playerLightingCount,
    playerLightingArchetypes,
    playerLightingColorPresets,
    playerLightingMotionPresets
  ) {
    this.playerLightingCount = playerLightingCount;
    this.playerLightingArchetypes = playerLightingArchetypes;
    this.playerLightingColorPresets = playerLightingColorPresets;
    this.playerLightingMotionPreset = playerLightingMotionPresets;
  }
  encapsulatePresetArrays() {
    let bagArray = [
      this.playerLightingArchetypes,
      this.playerLightingColorPresets,
      this.playerLightingMotionPresets,
    ];
    return bagArray;
  }
  /**
   * Converts the preset arrays into valid lighting templates if verification conditions are met.
   *
   * @param {boolean} verified - Determines if validation should be performed.
   * @returns {EnvironmentLightingTemplate[]} - An array of valid lighting templates or an empty array if validation fails.
   */
  convertLightingTemplateBagToIndividualValidTemplates(verified) {
    let templatesObtained = [];

    if (
      verified &&
      this.playerLightingCount == this.playerLightingArchetypes.length &&
      this.playerLightingCount == this.playerLightingColorPresets.length &&
      this.playerLightingCount == this.playerLightingMotionPresets.length
    ) {
      let templateGenerationCounter = 0;
      while (templateGenerationCounter < this.playerLightingCount) {
        let archetype =
          this.playerLightingArchetypes[templateGenerationCounter];
        let colorPreset =
          this.playerLightingColorPresets[templateGenerationCounter];
        let motionPreset =
          this.playerLightingMotionPresets[templateGenerationCounter];

        let generatedTemplate = new PlayerLightingTemplate(
          archetype,
          colorPreset,
          motionPreset
        );
        templatesObtained.push(generatedTemplate);
        templateGenerationCounter += 1;
      }
    } else {
      let finalizedDecision = LoggerOmega.GetFinalizedLoggingDecision(
        LightingLogger.forcefullyOverrideLoggingConfig,
        LightingLogger.lightingLoggingEnabled,
        "secondary"
      );

      if (finalizedDecision) {
        LoggerOmega.SmartLogger(
          finalizedDecision,
          "Attempt to convert a template configuration to a set of preset individual player templates was unsuccessful! Returning a blank array, expect darkness somewhere / everywhere.",
          "LightingTemplates-A"
        );
      }
    }
    return templatesObtained;
  }
}

/**
 * PlayerLightingTemplate Class
 *
 * Represents a lighting template for a player character.
 */
class PlayerLightingTemplate {
  /**
   * Represents a lighting template for a player character.
   *
   * @param {string[]} playerLightingArchetype - The archetypes defining player lights.
   * @param {string[]} playerLightingColorPreset - The color profiles of player lights.
   * @param {Object} playerLightingMotionPrese - The motion settings for player lights.
   */
  constructor(
    playerLightingArchetype,
    playerLightingColorPreset,
    playerLightingMotionPreset
  ) {
    this.playerLightingArchetype = playerLightingArchetype;
    this.playerLightingColorPreset = playerLightingColorPreset;
    this.playerLightingMotionPreset = playerLightingMotionPreset;
  }
}
