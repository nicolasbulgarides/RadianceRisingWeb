class ChadUtilities {
  static describeVector(msg, vector) {
    console.log(
      "MSG: " +
        msg +
        " , Vector: X: " +
        vector.x +
        " , y: " +
        vector.y +
        " , Z: " +
        vector.z
    );
  }

  static SmartLogger(loggingDecision, msg) {
    LoggerOmega.SmartLogger(loggingDecision, msg);
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
