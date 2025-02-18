class CurrentLoginProfile {
  constructor(accountId, isGuestAccount) {
    {
      this.accountId = accountId;
      this.isGuestAccount = isGuestAccount;
      this.isOnSteam = false;
      this.isOnFacebook = false;

      this.detectIfOnSteamOrFacebook();
    }
  }

  detectIfOnSteamOrFacebook() {
    this.isOnSteam = PlatformDetectionChecker.getIfRunningOnSteam();
    this.isOnFacebook = PlatformDetectionChecker.getIfRunningOnFacebook();

    if (this.isOnSteam && this.isOnFacebook) {
      NetworkingLogger.logErrorShortcut(
        "Player is on both Steam and Facebook - wtf did you do?",
        "CurrentLoginProfile FB or Steam detection"
      );
    }
  }
}
