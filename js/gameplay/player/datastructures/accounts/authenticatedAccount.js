//Upon a successful login, the Networking Manager  - via the "Networking Account Retrieval" class - will create a PlayerAccount instance.

class AuthenticatedAccount extends AbstractAccount {
  constructor(
    accountId,
    currentLoginProfile,
    accountPreferences,
    playerSaveComposite
  ) {
    super(accountId, false, currentLoginProfile);
    this.accountPreferences = accountPreferences;
    this.playerSaveComposite = playerSaveComposite;
  }
}
