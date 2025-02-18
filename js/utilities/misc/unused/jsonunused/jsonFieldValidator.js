/**
 * JSONFieldValidator Class
 *
 * Validates a JSON field based on a validation category. If the validation category
 * is considered "none", "blank", or "skip", validation is bypassed and a log entry is generated.
 */
class JSONFieldValidator {
  // Predefined values representing a "none" or "blank" validation category.
  static skippedValidationCategories = new Set([
    "",
    "null",
    "blank",
    "skip",
    "none",
    "bypass",
    "ignore",
    "disabled",
    "off",
    "-1",
    -1,
    "0",
  ]);

  static definedCustomValidationCategories = new Set([
    PLAYER_SETTINGS,
    PLAYER_ACHIEVEMENTS,
    PLAYER_ACHIEVEMENT,
    PLAYER_UNLOCKED_CONSTELLATIONS_AND_LEVELS,
    PLAYER_UNLOCKED_ABILITIES,
    PLAYER_UNLOCKED_ARTIFACTS,
    PLAYER_STATUS,
    PLAYER_CURRENT_INVENTORY,
    PLAYER_,
  ]);

  /**
   * Validates the JSON field based on the provided validation category.

   *
   * @param {any} jsonValueToValidate - The JSON field value to validate.
   * @param {string|null|undefined} validationCategory - The category for JSON validation.
   * @returns {boolean} Returns true if validation is skipped or considered valid.
   */
  static validateJSONField(jsonValueToValidate, validationCategory) {
    let validationResult = false;

    // Check for null/undefined first, then for any skipped value.

    if (this.definedCustomValidationCategories)
      if (
        validationCategory == null ||
        JSONFieldValidator.skippedValidationCategories.has(validationCategory)
      ) {
        // Report that JSON validation was skipped via the JSON logger.

        JSONLogger.logJsonValidationSkipped(
          jsonValueToValidate,
          validationCategory,
          1, // specificJsonImportanceLevel; adjust as needed.
          "jsonFieldValidator" // jsonErrorCooldownId; adjust as needed.
        );
        validationResult = true;
      } else {
      }

    return validationResult;
  }
}
