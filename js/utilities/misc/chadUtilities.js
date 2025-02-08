/**
 * ChadUtilities provides helper functions for vector logging and object inspection.
 * It integrates with LoggerOmega for standardized logging.
 */
class ChadUtilities {
  /**
   * Logs a detailed description of a BABYLON.Vector3 instance.
   * @param {string} msg - Custom message to include.
   * @param {BABYLON.Vector3} vector - The vector to describe.
   * @param {string} sender - Identifier for the log origin.
   * @returns {string} - Formatted string describing the vector.
   */
  static describeVector(msg, vector, sender) {
    if (!(vector instanceof BABYLON.Vector3)) {
      LoggerOmega.SmartLogger(true, sender);
    } else if (vector instanceof BABYLON.Vector3) {
      LoggerOmega.SmartLogger(true, "Vector!!! " + typeof vector, sender);
    } else {
      LoggerOmega.SmartLogger(true, "WEIRD " + typeof vector, sender);
    }
    msg =
      "MSG: " +
      msg +
      " , Vector: X: " +
      vector.x +
      " , y: " +
      vector.y +
      " , Z: " +
      vector.z;
    return msg;
  }

  /**
   * Wrapper for LoggerOmega's SmartLogger.
   * @param {boolean} loggingDecision - Whether logging should occur.
   * @param {string} msg - The message to log.
   */
  static SmartLogger(loggingDecision, msg) {
    LoggerOmega.SmartLogger(loggingDecision, msg);
  }

  /**
   * Initiates display of object contents using a standardized format.
   * @param {Object} obj - The object to display.
   * @param {string} sender - Identifier for the source of the log.
   */
  static displayContents(obj, sender) {
    ChadUtilities.displayObjectContents(
      obj,
      "blank-error",
      false,
      2,
      "-forced-display-object-contents-",
      false,
      2,
      true,
      sender
    );
  }

  /**
   * Recursively displays the contents of an object in a formatted string.
   * @param {Object} obj - The object to display.
   * @param {number} depth - Current recursion depth.
   * @returns {string} - The formatted string representation.
   */
  static buildObjectString(obj, depth) {
    const indent = "  ".repeat(depth);
    let result = "";
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          result += `${indent}${key}: {\n`;
          result += ChadUtilities.buildObjectString(value, depth + 1);
          result += `${indent}}\n`;
        } else {
          result += `${indent}${key}: ${value}\n`;
        }
      }
    }
    return result;
  }

  /**
   * Validates the structure of an array and logs any discrepancies.
   * @param {Array} arrayHolderArray - The array to audit.
   * @param {number} expectedArrayLength - The expected length for child arrays.
   * @param {string} arrayNickname - A nickname for identifying the array in logs.
   * @param {string} loggingMessage - Additional logging context message.
   * @param {boolean} loggingOverride - Whether to override default logging.
   * @param {boolean} loggingValue - Explicit logging decision flag.
   * @param {string|number} loggingImportance - Importance level for logging.
   * @returns {boolean} - True if the array is valid, false otherwise.
   */
  static arrayLengthAudit(
    arrayHolderArray,
    expectedArrayLength,
    arrayNickname = "blank-array-nickname",
    loggingMessage = "blank-logging-msg",
    loggingOverride,
    loggingValue = true,
    loggingImportance = "2"
  ) {
    let arrayStatusMsg = "";
    let validArrays = false;
    let foundInvalidArrayByLength = false;
    let foundInvalidArrayByType = false;
    let arrayNull = true;
    let arrayIsArray = false;
    let arrayLength = -1;
    let invalidArraysByLengthFound = 0;
    let invalidArraysByTypeFound = 0;
    if (arrayHolderArray !== null) {
      arrayNull = false;
    }
    if (!arrayNull && Array.isArray(arrayHolderArray)) {
      arrayIsArray = true;
      arrayLength = arrayHolderArray.length;
    }
    if (arrayNull) {
      arrayStatusMsg =
        "The 'array' with the nickname: " +
        arrayNickname +
        " and the logging msg " +
        loggingMessage +
        " is null!";
    } else if (!arrayNull && !arrayIsArray) {
      arrayStatusMsg =
        "The 'array' with the nickname: " +
        arrayNickname +
        " and the logging msg" +
        loggingMessage +
        " isn't an array!";
    } else if (!arrayNull && arrayLength == 0) {
      arrayStatusMsg +=
        "The array with the nickname: " +
        arrayNickname +
        " and the logging msg " +
        loggingMessage +
        " has a length of 0";
    } else if (arrayIsArray && !arrayNull && arrayLength > 0) {
      arrayHolderArray.forEach((item) => {
        if (Array.isArray(item)) {
          if (item.length != expectedArrayLength) {
            invalidArraysByLengthFound += 1;
            if (!foundInvalidArrayByLength) {
              arrayStatusMsg +=
                " The array with a nickname: " +
                arrayNickname +
                " with an expected length of: " +
                expectedArrayLength +
                " has one or more invalid child arrays compared to expected length.";
              foundInvalidArrayByLength = true;
            }
          }
        } else {
          invalidArraysByTypeFound += 1;
          if (!foundInvalidArrayByType) {
            arrayStatusMsg +=
              " The array with a nickname: " +
              arrayNickname +
              " with an expected length of: " +
              expectedArrayLength +
              " has one or more invalid objects inside of it which are not arrays as expected: ";
            foundInvalidArrayByType = true;
          }
        }
      });
    }
    if (
      foundInvalidArrayByLength ||
      foundInvalidArrayByType ||
      invalidArraysByTypeFound > 0 ||
      invalidArraysByLengthFound > 0
    ) {
      arrayStatusMsg +=
        " Total invalid arrays: Length Errors: " +
        invalidArraysByLengthFound +
        ", type errors: " +
        invalidArraysByTypeFound;
    } else {
      validArrays = true;
    }
    let loggingDecision = LoggerOmega.GetFinalizedLoggingDecision(
      loggingOverride,
      loggingValue,
      loggingImportance
    );
    LoggerOmega.SmartLogger(loggingDecision, arrayStatusMsg);
    return validArrays;
  }
}
