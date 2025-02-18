class NetworkingManager {
  constructor() {
    this.networkingApiRequestRouter = new NetworkingApiRequestRouter();
    this.networkingPlayerSaveRetrieval = new NetworkingPlayerSaveRetrieval();
    this.networkingProgressSubmission = new NetworkingProgressSubmission();
  }

  attemptToLoadPlayerSaveComposite() {
    let playerSaveComposite =
      this.playerSaveManager.attemptToRetrievePlayerSaveComposite();
    if (playerSaveComposite) {
      return playerSaveComposite;
    }
  }

  storeProgressUpdate(progressUpdate) {
    this.networkingProgressSubmission.addUnsavedProgressSnippet(progressUpdate);
  }

  periodicPokeOfProgressSubmission() {
    this.networkingProgressSubmission.submitAllUnsavedProgressSnippets();
  }

  submitProgressSubmissionRequest(progressSubmissionRequest) {
    this.networkingSaveSubmitter.submitSaveRequest(progressSubmissionRequest);
  }

  processRequestViaAPIRequestRouter(request, requestType, sender) {
    if (request instanceof NetworkingAPIRequest) {
      this.networkingApiRequestRouter.processAPIRequest(
        request,
        requestType,
        sender
      );
    } else {
      NetworkingLogger.informOfNetworkEvent(
        "API Request invalid object shape: ",
        sender,
        0,
        false,
        "api-request-invalid-object-shape-" + requestType
      );
    }
  }
}
