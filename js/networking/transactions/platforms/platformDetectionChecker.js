/**
 * Class PlatformDetectionChecker
 *
 * This class is responsible for detecting the operating system platform
 * using multiple methods. It checks for native embedding values, analyzes
 * the user-agent string, and falls back to the Platform.js library if available.
 * It also marks whether the game is running on Facebook Instant Games or Steam.
 */
class PlatformDetectionChecker {
  /**
   * Attempts to detect the platform using several fallback methods.
   *
   * It performs the following checks sequentially:
   * 1. Basic embedding detection from native apps.
   * 2. Detection based on the user-agent string.
   * 3. Fallback detection via the Platform.js library.
   *
   * If none succeeds, it returns a wrapped detection object indicating failure.
   *
   * @returns {SuccessfulPlatformDetection} A detection object containing the status, platform, and flags.
   */
  static getPlatformRobust() {
    // Retrieve flags indicating if the game is running within Facebook or Steam.
    const runningOnFacebook = this.getIfOnFacebook();
    const runningOnSteam = this.getIsOnSteam();

    // 1. Attempt basic detection via an embedded platform variable.
    let detection = this.attemptBasicEmbeddingDetection(
      runningOnFacebook,
      runningOnSteam
    );
    if (detection.detectionSuccess) return detection;

    // 2. Attempt detection based on the user-agent string.
    detection = this.detectFromUserAgent(runningOnFacebook, runningOnSteam);
    if (detection.detectionSuccess) return detection;

    // 3. Fallback: Use Platform.js library for detection if available.
    detection = this.attemptPlatformJSMinFallback(
      runningOnFacebook,
      runningOnSteam
    );
    if (detection.detectionSuccess) return detection;

    // If all detection methods have failed, wrap and return the failure outcome.
    return this.wrapDetectionObject(
      false,
      "-os-detection-failed-all-methods-",
      "-unknown-",
      runningOnFacebook,
      runningOnSteam
    );
  }

  //to do - facebook flag detection
  static getIfRunningOnFacebook() {
    return false;
  }

  // to do - steamm flag detection
  static getIfRunningOnSteam() {
    return false;
  }

  // to do - separate player detection of Facebook / Steam from OS detection with extra methods - the OS + platform is useful for transaction routing
  // But just checking the facebook / steam flags is useful for other things (tracking logins)
  /**
   * Fallback detection using the Platform.js library.
   *
   * Checks if the global window.platform object is available.
   * If so, it parses its OS family string to deduce the platform.
   *
   * @param {string} runningOnFacebook - The Facebook flag.
   * @param {string} runningOnSteam - The Steam flag.
   * @returns {SuccessfulPlatformDetection} A wrapped detection object.
   */
  static attemptPlatformJSMinFallback(runningOnFacebook, runningOnSteam) {
    let detectedSuccess = false;
    let status = "-os-confirmation-pending-";
    let detectedPlatform = "-unknown-";

    // Verify that the Platform.js object exists and contains OS info.
    if (window.platform && window.platform.os) {
      const osFamily = window.platform.os.family.toLowerCase();

      // Detect Android OS.
      if (osFamily.includes("android")) {
        detectedPlatform = "-android-";
        detectedSuccess = true;
      }
      // Detect iOS devices.
      else if (
        osFamily.includes("ios") ||
        osFamily.includes("iphone") ||
        osFamily.includes("ipad")
      ) {
        detectedPlatform = "-ios-";
        detectedSuccess = true;
      }
      // Detect Windows or Linux.
      else if (osFamily.includes("windows") || osFamily.includes("linux")) {
        detectedPlatform = "-windows-or-linux-";
        detectedSuccess = true;
      }
      // Detect macOS devices.
      else if (osFamily.includes("os x") || osFamily.includes("mac")) {
        detectedPlatform = "-macos-";
        detectedSuccess = true;
      }

      // Set status based on whether detection succeeded.
      status = detectedSuccess
        ? "-os-detected-success-"
        : "-js-min-fallback-occurred-detection-failed-";
    } else {
      status = "-js-min-fallback-failed-everything-failed-";
    }

    return this.wrapDetectionObject(
      detectedSuccess,
      status,
      detectedPlatform,
      runningOnFacebook,
      runningOnSteam
    );
  }

  /**
   * Basic embedding detection.
   *
   * Checks if a native embedding app has injected a platform variable.
   * If the global window.embeddedPlatform is a valid string for a known platform,
   * it returns a successful detection.
   *
   * @param {string} runningOnFacebook - The Facebook flag.
   * @param {string} runningOnSteam - The Steam flag.
   * @returns {SuccessfulPlatformDetection} A wrapped detection object.
   */
  static attemptBasicEmbeddingDetection(runningOnFacebook, runningOnSteam) {
    let detectedSuccess = false;
    let status = "-os-confirmation-pending-";
    let detectedEmbeddedPlatform = "-unknown-";

    // Check if a native embedding has provided a valid platform string.
    if (
      window.embeddedPlatform &&
      typeof window.embeddedPlatform === "string"
    ) {
      detectedEmbeddedPlatform = window.embeddedPlatform.toLowerCase();
      if (
        detectedEmbeddedPlatform === "ios" ||
        detectedEmbeddedPlatform === "android" ||
        detectedEmbeddedPlatform === "windows" ||
        detectedEmbeddedPlatform === "linux" ||
        detectedEmbeddedPlatform === "macos"
      ) {
        // Format the platform string consistently.
        detectedEmbeddedPlatform = `-${detectedEmbeddedPlatform}-`;
        detectedSuccess = true;
      }
      status = detectedSuccess
        ? "-os-detected-success-"
        : "-os-detection-failed-basic-embedding-detection-";
    }

    return this.wrapDetectionObject(
      detectedSuccess,
      status,
      detectedEmbeddedPlatform,
      runningOnFacebook,
      runningOnSteam
    );
  }

  /**
   * Wraps the detection results in a SuccessfulPlatformDetection object.
   *
   * @param {boolean} successOutcome - Indicates whether detection was successful.
   * @param {string} compositeConfirmation - A status message with combined detection info.
   * @param {string} detectedPlatform - The detected platform string.
   * @param {string} runningOnFacebook - Flag indicating Facebook Instant Games.
   * @param {string} runningOnSteam - Flag indicating Steam environment.
   * @returns {SuccessfulPlatformDetection} The constructed detection object.
   */
  static wrapDetectionObject(
    successOutcome,
    compositeConfirmation,
    detectedPlatform,
    runningOnFacebook,
    runningOnSteam
  ) {
    // Create and return a new SuccessfulPlatformDetection instance.
    return new SuccessfulPlatformDetection(
      successOutcome,
      compositeConfirmation,
      detectedPlatform,
      runningOnFacebook,
      runningOnSteam
    );
  }

  /**
   * Checks if the game is running on Facebook Instant Games.
   *
   * It determines this by checking if the global FBInstant object exists.
   *
   * @returns {string} A flag indicating Facebook status: "-facebookyes-" or "-facebookno-".
   */
  static getIfOnFacebook() {
    return typeof FBInstant !== "undefined" ? "-facebookyes-" : "-facebookno-";
  }

  /**
   * Checks if the game is likely running in a Steam environment.
   *
   * Uses a combination of strategies:
   * - Examining the user-agent for Steam or Valve identifiers.
   * - Checking the document referrer for Steam-related domains.
   * - Detecting global objects provided by Steam wrappers.
   * - Optionally inspecting query parameters.
   *
   * @returns {string} A flag indicating Steam status: "-steamyes-" or "-steamno-".
   */
  static getIsOnSteam() {
    // Check the user agent.
    const ua = navigator.userAgent || "";
    if (/Steam/i.test(ua) || /Valve/i.test(ua)) return "-steamyes-";

    // Check the document referrer.
    const referrer = document.referrer || "";
    if (
      /steampowered\.com/i.test(referrer) ||
      /steamcommunity\.com/i.test(referrer)
    )
      return "-steamyes-";

    // Check for a global Steam API wrapper.
    if (
      typeof window.SteamAPI !== "undefined" ||
      typeof window.steamworks !== "undefined"
    )
      return "-steamyes-";

    // Check for a custom query parameter specifying a Steam platform.
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("platform") &&
      urlParams.get("platform").toLowerCase() === "steam"
    )
      return "-steamyes-";

    // Default: No Steam environment detected.
    return "-steamno-";
  }

  /**
   * User agent–based platform detection.
   *
   * Analyzes the user agent string to deduce the operating system.
   *
   * @param {string} runningOnFacebook - The Facebook flag.
   * @param {string} runningOnSteam - The Steam flag.
   * @returns {SuccessfulPlatformDetection} A wrapped detection object.
   */
  static detectFromUserAgent(runningOnFacebook, runningOnSteam) {
    const ua = navigator.userAgent;
    let detectedPlatform = "-unknown-";
    let detectedSuccess = false;
    let status = "-os-confirmation-pending-";

    // Detect Android OS.
    if (/android/i.test(ua)) {
      detectedPlatform = "-android-";
      detectedSuccess = true;
    }
    // Detect iOS devices.
    else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      detectedPlatform = "-ios-";
      detectedSuccess = true;
    }
    // Detect Windows OS.
    else if (/Windows NT/i.test(ua)) {
      detectedPlatform = "-windows-or-linux-";
      detectedSuccess = true;
    }
    // Detect macOS.
    else if (/Macintosh/i.test(ua)) {
      detectedPlatform = "-macos-";
      detectedSuccess = true;
    }
    // Detect Linux if not already classified as Windows.
    else if (/Linux/i.test(ua)) {
      detectedPlatform = "-windows-or-linux-";
      detectedSuccess = true;
    }

    status = detectedSuccess ? "-os-detected-success-" : status;

    return this.wrapDetectionObject(
      detectedSuccess,
      status,
      detectedPlatform,
      runningOnFacebook,
      runningOnSteam
    );
  }
}
