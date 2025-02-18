class GuestAccount extends AbstractAccount {
  constructor(accountId, currentLoginProfile) {
    super(accountId, true, currentLoginProfile);
  }
}
