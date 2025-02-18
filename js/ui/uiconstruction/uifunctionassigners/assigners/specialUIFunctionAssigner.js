/**
 * SpecialUIFunctionAssigner.js
 *
 * This module provides assigns special function assignments depending on the specific function organization group and specific function value ID
 * When a UILoadRequest specifies that it has a special function value,
 * a switch statement directs the function to the correct function organization group for organized retrieval
 */
class SpecialUIFunctionAssigner {
  /**
   * Retrieves a specialized event handler function based on the provided ID.
   * @param {string} specialFunctionOrganizationGroup - The organization group used to select the specialized function.
   * @param {string} specialFunctionValueID - The ID used to select the specialized function.
   * @returns {function} A function to be used as an event handler.
   */
  static getSpecialUIFunction(
    specialFunctionOrganizationGroup,
    specialFunctionValueID
  ) {
    let specialValueFormatted = null;
    let isNumber = typeof specialFunctionValueID === Number;

    if (isNumber) {
      specialValueFormatted = String(specialFunctionValueID);
      specialValueFormatted = specialValueFormatted.toUpperCase();
    }
    switch (specialFunctionOrganizationGroup) {
      case "-1":
        return this.genericFakeFunction();
      case "0":
        return this.genericFakeFunction();
      case "DEFAULT":
        return this.genericFakeFunction();
      case "NONE":
        return this.genericFakeFunction();
      case "GROUP1":
        return;

      default:
        return this.genericFakeFunction();
    }
  }

  static genericFakeFunction() {
    return this.genericFakeFunctionActuallyTransferred();
  }

  static genericFakeFunctionActuallyTransferred() {
    return -1;
  }
  static specialFunctionDemo() {
    return this.functionActuallyTransferred();
  }

  static functionActuallyTransferred(exampleParameter) {
    if (typeof exampleParameter === Number) return exampleParameter * 5;
    return -1;
  }

  static retrieveFunctionFromGroup1(specialFunctionValueID) {
    return FunctionGroup1.getFunctionByFunctionID(specialFunctionValueID);
  }
}
