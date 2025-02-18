class UILoadRequestManager {
  constructor() {
    FundamentalSystemBridge.registerUILoadRequestManager(this);
  }

  async processUILoadRequest(
    requestingScene,
    uiLoadRequestArray,
    passedInOnSuccessFunction,
    onSuccessParameter,
    passedInOnFailureFunction
  ) {
    let assetFailures = [];

    // Validate scene before running async code
    if (!requestingScene || !requestingScene.uiTexture) {
      console.error("Invalid scene or UI texture");
      if (typeof passedInOnFailureFunction === "function") {
        passedInOnFailureFunction(["Invalid scene or UI texture"]);
      }
      return;
    }

    let promises = uiLoadRequestArray.map((currentRequest) => {
      if (!currentRequest) return null;
      return currentRequest
        .execute(requestingScene.uiTexture)
        .catch((error) => {
          assetFailures.push(currentRequest.uiElementNickname);
          console.error(
            `Failed to load asset: ${currentRequest.uiElementNickname}`,
            error
          );
          return null; // Ensures Promise.all still resolves
        });
    });

    // Wait for all requests to complete
    const results = await Promise.all(promises);

    // Handle success
    if (assetFailures.length === 0) {
      if (typeof passedInOnSuccessFunction === "function") {
        passedInOnSuccessFunction(onSuccessParameter);
      }
    }
    // Handle failure
    else {
      if (typeof passedInOnFailureFunction === "function") {
        passedInOnFailureFunction(assetFailures);
      }
      // Log errors
      this.loadRequestErrorTrigger(requestingScene.sceneName, assetFailures);
    }
  }

  static loadRequestErrorTrigger(
    sceneName = "-scene-name-not-set-",
    failedAssets
  ) {
    let failureMessage =
      `Failed Scene Load: ${sceneName}, Failed Assets: ` +
      UIErrorLogger.convertAssetFailuresToErrorMsg(failedAssets);

    // Log the error
    UIErrorLogger.informOfUIErrorEvent(
      failureMessage,
      "UILoadRequestManager-Failed Asset Load",
      0,
      UIErrorLogger.UI_ERROR_LOGGER_COOLDOWN_ENABLED,
      "FailedAssetLoadError"
    );
  }
}
