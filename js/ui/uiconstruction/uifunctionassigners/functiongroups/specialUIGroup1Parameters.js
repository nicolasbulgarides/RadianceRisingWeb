class SpecialUIGroup1Parameters {
  static getSpecialParameterByParameterID(parameterID) {
    switch (parameterID) {
      case 1:
        return this.demoParameter1();
      default:
        return this.invalidParameterDefault();
    }
  }

  static invalidParameterDefault() {
    if (
      Config.STATUS_ENVIRONMENT === "DEVELOPMENT" &&
      Config.STATUS_IN_DEVELOPMENT &&
      !Config.STATUS_IN_DEPLOYMENT
    ) {
      let demoMsg = "Invalid parameter ID!";
      LoggerOmega.SmartLogger(true, demoMsg, sender);
    }
    return -1;
  }

  static demoParameter1() {
    return 1;
  }
}
