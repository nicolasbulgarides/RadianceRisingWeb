/**
 * JSONTemplatePresets class
 * Acts as a central registry for JSONTemplates.
 * Preset templates are stored and can be retrieved by their presetId.
 */
class JSONTemplatePresets {
  // Static property to hold registered templates.
  static presets = new Map();

  /**
   * Registers a new preset template.
   * @param {string} presetId - Unique identifier for the template.
   * @param {JSONTemplate} template - An instance of JSONTemplate.
   */
  static registerPreset(presetId, template) {
    this.presets.set(presetId, template);
  }

  /**
   * Retrieves a preset template by its presetId.
   * @param {string} presetId - The identifier of the template.
   * @returns {JSONTemplate|null} The JSONTemplate if found, or null.
   */
  static getPreset(presetId) {
    return this.presets.get(presetId) || null;
  }
}
