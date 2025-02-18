/**
 * JSONTemplate class
 * This class encapsulates a schema-like template that defines:
 * - A unique presetId for routing.
 * - An array of fields with associated validation.
 */
class JSONTemplate {
  /**
   * @param {string} presetId - Unique identifier for this template.
   * @param {Array<Object>} fields - Array of field definitions.
   *        Each field should be an object with:
   *          - name: {string} the property name
   *          - type: {string} expected JavaScript type (e.g., "string", "number", "boolean")
   *          - required: {boolean} whether the field must be provided
   *          - defaultValue: {*} optional default value if field is missing
   *          - validator: {function} (optional) custom function that returns true if valid
   */
  constructor(presetId, fields = []) {
    this.presetId = presetId;
    this.fields = fields;
  }

  /**
   * Validates a data object against this template.
   * It checks that required fields exist, that types match, and that
   * any custom validators pass. Missing non-required fields are set to their default.
   *
   * @param {Object} data - The input data object (parsed JSON) to validate.
   * @returns {Object} A new object with the validated (and possibly defaulted) values.
   * @throws {Error} If a required field is missing or any field fails validation.
   */
  validate(data) {
    // Create a new object to hold validated data.
    const result = {};

    // Loop through each field defined in this template.
    for (const field of this.fields) {
      const { name, type, required, defaultValue, validator } = field;
      let value = data[name];

      // Check if the value is missing.
      if (value === undefined || value === null) {
        if (required) {
          // If required, check if we have a default. Otherwise, throw an error.
          if (defaultValue !== undefined) {
            value = defaultValue;
          } else {
            //to do - handle JSON template error - - PAY ATTENTION TO THIS
            throw new Error(`Missing required field: ${name}`);
          }
        } else {
          // If not required, use the default if provided.
          value = defaultValue;
        }
      }

      // If a custom validator is provided, use it.
      if (validator && typeof validator === "function") {
        if (!validator(value)) {
          throw new Error(
            `Custom validation failed for field "${name}" with value: ${value}`
          );
        }
      } else if (type && typeof value !== type) {
        // Otherwise, perform a basic type check.
        throw new Error(
          `Type mismatch for field "${name}". Expected type "${type}" but got "${typeof value}".`
        );
      }

      // Assign the validated value.
      result[name] = value;
    }

    return result;
  }
}
