class NetworkingProgressSubmission {
  constructor() {
    this.unsavedProgressSnipperBackupBuffer = [];
    this.allUnsavedProgressSnippetsPrimaryBuffer = [];
    this.submittedButUnverifiedProgressSnippets = [];
    this.awaitingSaveConfirmation = false;
    this.expectedSaveConfirmationCode = "[confirmed]";
  }

  addUnsavedProgressSnippet(unsavedProgressSnippet) {
    if (this.submitAllUnsavedProgressSnippets.length > 0) {
      this.unsavedProgressSnipperBackupBuffer.push(unsavedProgressSnippet);
    } else {
      this.allUnsavedProgressSnippetsPrimaryBuffer.push(unsavedProgressSnippet);
    }
  }

  processAttemptToConfirmSuccessfulSaveConfirmation(confirmationCode) {
    if (confirmationCode === this.expectedSaveConfirmationCode) {
      this.awaitingSaveConfirmation = false;
      this.submittedButUnverifiedProgressSnippets = [];
      this.allUnsavedProgressSnippetsPrimaryBuffer =
        this.unsavedProgressSnipperBackupBuffer;
      this.unsavedProgressSnipperBackupBuffer = [];
    } else {
    }
  }

  submitAllUnsavedProgressSnippets() {
    if (
      this.submittedButUnverifiedProgressSnippets.length == 0 &&
      this.awaitingSaveConfirmation == false
    ) {
      let compositeProgressSubmissionRequest =
        this.formCompositeProgressSubmissionRequestAndClear();

      let networkingManager = FundamentalSystemBridge[networkingManager];

      if (networkingManager instanceof NetworkingManager) {
        networkingManager.processRequestViaAPIRequestRouter(
          compositeProgressSubmissionRequest,
          "progress-save-submission",
          "API Request sent by NetworkingProgressSubmission for progress save submission"
        );
      }
    }
  }

  formCompositeProgressSubmissionRequestAndClear() {
    let submmissionRequest = this.wrapSubmissionRequest(
      this.allUnsavedProgressSnippetsPrimaryBuffer
    );

    this.submittedButUnverifiedProgressSnippets =
      this.allUnsavedProgressSnippetsPrimaryBuffer;
    this.allUnsavedProgressSnippetsPrimaryBuffer = [];

    this.awaitingSaveConfirmation = true;

    return submmissionRequest;
  }

  wrapSubmissionRequest(bufferToWrap) {
    let bufferShaped =
      "-placeholder-progress-submission-request-composite-object-wrrapped-";
    let timestamp = "timestamp-placeholder";
    let validationCode = "validation-code-placeholder";

    return new NetworkingAPIRequest(
      timestamp,
      validationCode,
      "progress-save-submission",
      bufferShaped
    );
  }
  assembleProgressSubmsisionRequestForAPIIngestion(progressSubmissionRequest) {
    let timestamp = "timestamp-placeholder";
    let validationCode = progressSubmissionRequest.validationCode;
    let assembledRequest = new NetworkingAPIRequest(
      timestamp,
      validationCode,
      "progress-save-submission",
      progressSubmissionRequest
    );

    return assembledRequest;
  }
}
