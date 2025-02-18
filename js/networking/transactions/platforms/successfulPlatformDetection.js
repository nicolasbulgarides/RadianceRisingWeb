/**
 * Class SuccessfulPlatformDetection
 *
 * This class encapsulates the outcome of an operating system detection attempt,
 * including whether the detection was successful, a status message, the detected
 * platform string, and flags for Facebook and Steam environments.
 */
class SuccessfulPlatformDetection {
  constructor(
    detectionSuccess = false,
    confirmationMsg,
    platformDetected,
    facebookDetected,
    steamDetected
  ) {
    // Indicates whether platform detection succeeded.
    this.detectionSuccess = detectionSuccess;
    // Contains a status message or code from the detection process.
    this.confirmationMsg = confirmationMsg;
    // The detected platform string (e.g., "-ios-", "-android-").
    this.platformDetected = platformDetected;
    // Flag indicating if the game is running on Facebook Instant Games.
    this.facebookDetected = facebookDetected;
    // Flag indicating if the game is running in a Steam environment.
    this.steamDetected = steamDetected;
  }
}
