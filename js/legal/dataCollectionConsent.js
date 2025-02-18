/**
 * DataCollectionConsent represents a player's legal consent record.
 * It stores crucial details including the time of consent, age as provided at that time,
 * unique account or guest identifier, and individual consent flags (e.g., reading the company statement,
 * accepting terms, authorizing data collection, and accepting bonus incentives).
 *
 * NOTE: This record serves as a legal checkpoint rather than persistent storage.
 * Ensure that its usage is strictly limited to verifying that prerequisites for data collection have been met.
 */
class DataCollectionConsent {
  constructor(
    timestampOfConsentProfile,
    ageAsSubmittedAtTimestamp,
    accountIdOrGuestId,
    didReadCompanyStatement,
    didReadAndAcceptTerms,
    didAuthorizeDataCollection,
    didAcceptOfferOfDataBonusIncentive
  ) {
    this.timestampOfConsentProfile = timestampOfConsentProfile;
    this.accountIdOrGuestId = accountIdOrGuestId;
    this.ageAsSubmittedAtTimestamp = ageAsSubmittedAtTimestamp;
    this.didReadCompanyStatement = didReadCompanyStatement;
    this.didReadAndAcceptTerms = didReadAndAcceptTerms;
    this.didAuthorizeDataCollection = didAuthorizeDataCollection;
    this.didAcceptOfferOfDataBonusIncentive =
      didAcceptOfferOfDataBonusIncentive;
  }
}
