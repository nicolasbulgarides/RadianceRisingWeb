class AbstractAccount {
  constructor(accountId, isGuestAccount, currentLoginProfile) {
    this.accountId = accountId;
    this.isGuestAccount = isGuestAccount;
    this.currentLoginProfile = currentLoginProfile;
  }
}
