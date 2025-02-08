class ChadUtilities {
  static describeVector(msg, vector, sender) {
    if (!vector instanceof BABYLON.Vector3) {
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

  static SmartLogger(loggingDecision, msg) {
    LoggerOmega.SmartLogger(loggingDecision, msg);
  }

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
  static displayObjectContents(
    obj,
    errorType = "ObjectContentsDisplay",
    enforceCooldown = false, // Object to be displayed
    depth = 2,
    loggingMsg = "-default-object-contents-logging-msg", // Tracks recursion depth for indentation
    loggingOverride = false, // Force logging override (true/false)
    loggingImportance = 2, // Importance level for logging decision
    loggingEnabled = true, // Global logging flag (true/false),
    sender = "-blank-sender-"
  ) {
    // Stores the formatted object properties as a single string
    let loggingOutput =
      "Sender: " +
      sender +
      " , " +
      "Logging msg: " +
      loggingMsg +
      ", logging properties of error of type: " +
      errorType +
      ", cooldown enabled: " +
      enforceCooldown +
      " , ";

    // Determine whether logging should be performed based on the logging decision system
    let absoluteDecision = LoggerOmega.GetFinalizedLoggingDecision(
      loggingOverride,
      loggingEnabled,
      loggingImportance
    );

    LoggerOmega.SmartLogger(
      true,
      "ABsolute decision is: " + absoluteDecision,
      "Sent decision"
    );

    let outputFormatted = ChadUtilities.buildObjectString(obj, depth);
    loggingOutput += outputFormatted;

    if (enforceCooldown) {
      LoggerOmega.SmartLoggerWithCooldown(
        absoluteDecision,
        loggingOutput,
        errorType
      );
    } else {
      LoggerOmega.SmartLogger(absoluteDecision, loggingOutput, sender);
    }
  }

  /**
   * Recursive helper function to construct the formatted object string.
   * @param {Object} obj - The object being processed.
   * @param {Number} depth - The current depth level for indentation.
   * @returns {String} - Formatted string representation of the object.
   */
  static buildObjectString(obj, depth) {
    const indent = "  ".repeat(depth); // Create indentation for readability
    let result = "";
    // Iterate through all properties of the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Ensure it's an object's own property
        const value = obj[key];

        // If the value is an object (but not null), recursively format it
        if (typeof value === "object" && value !== null) {
          result += `${indent}${key}: {\n`; // Start object block
          result += ChadUtilities.buildObjectString(value, depth + 1); // Recursively process nested objects
          result += `${indent}}\n`; // End object block
        } else {
          // Otherwise, format the key-value pair as a simple string
          result += `${indent}${key}: ${value}\n`;
        }
      }
    }
    return result;
  }

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
