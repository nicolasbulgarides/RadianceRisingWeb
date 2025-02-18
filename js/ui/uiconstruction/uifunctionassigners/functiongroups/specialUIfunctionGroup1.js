class SpecialUIFunctionGroup1 {
  static getFunctionByFunctionID(functionID) {
    switch (functionID) {
      case 1:
        return this.demoFunction1("A-SpecialUIMsg", "DEMO-MSG", "UI-MSG-FUNC");
      default:
        return this.invalidFunctionDefault();
    }
  }

  static invalidFunctionDefault() {
    if (
      Config.STATUS_ENVIRONMENT === "DEVELOPMENT" &&
      Config.STATUS_IN_DEVELOPMENT &&
      !Config.STATUS_IN_DEPLOYMENT
    ) {
      let demoMsg = "Invalid function ID!";
      LoggerOmega.SmartLogger(
        true,
        demoMsg,
        "function-group-1-invalid-function-default"
      );
    }
  }

  static demoFunction1(demoMsg, sender) {
    if (
      Config.STATUS_ENVIRONMENT === "DEVELOPMENT" &&
      Config.STATUS_IN_DEVELOPMENT &&
      !Config.STATUS_IN_DEPLOYMENT
    ) {
      LoggerOmega.SmartLogger(true, demoMsg, sender);
    }
  }
}
