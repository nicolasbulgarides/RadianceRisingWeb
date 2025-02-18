class AccountPreferences {
  constructor(country = "COUNTRY-PLACEHOLDER", language = "EN-PLACEHOLDER") {
    this.country = country;
    this.language = language;
    this.dataCollectionLegallyForbidden = true;
    this.isPersonallyTolerantOfAnalytics = false;
  }

  manuallyAffirmPlayerIsTolerantOfAnalytics(
    timestampOfOriginalVerification,
    toleranceIsVerified
  ) {
    this.isPersonallyTolerantOfAnalytics = true;
  }
}
