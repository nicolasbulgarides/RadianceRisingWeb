class LoggerOmega {
  static logCooldowns = new Map(); // Stores last logged timestamps for error types

  static LOGGING_COOLDOWNS_DEFAULTS = {
    ModelLoading: 4,
    ModelLoader: 4,
    LightingLoader: 0,
    LightingLoading: 0,
  };

  static importanceShortcuts = new Set([
    "importance",
    "logging_importance",
    "loggingimportance",
  ]);

  static baseSystemMarkers = new Set([
    "fundamental",
    "foundational",
    "system",
    "systemic",
    "infinity",
    "essential",
    "critical",
    "absolute",
    "absolutelyimportant",
    "absolutelycritical",
    "absolutelysystemic",
    "absolutelyfundamental",
    "absolutelyfoundational",
    "primary",
    "superdebug",
    "wtf",
    "severe",
    "core",
    "kernel",
    "os",
    "vital",
    "mandatory",
    "highpriority",
    "god",
    "infinity",
    "one",
    1,
    "zero",
    0,
  ]);

  static secondaryMarkers = new Set([
    "semicritical",
    "important",
    "moderate",
    "leveltwo",
    "secondary",
    "two",
    2,
    "medium",
    "normal",
    "warning",
    "average",
    "intermediate",
    "middle",
    "standard",
  ]);

  static auxillaryMarkers = new Set([
    "auxillary",
    "unimportant",
    "lowpriority",
    "trivial",
    "utility",
    "complementary",
    "three",
    3,
    "debug",
    "verbose",
    "extra",
    "supplementary",
    "minor",
    "optional",
    "background",
    "tertiary",
    "nonessential",
    "non-essential",
  ]);

  static standardLogLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  /**
   * Logs a message with a cooldown system.
   *
   * @param {boolean} loggingDecision - Whether logging is allowed.
   * @param {string} msg - The message to log.
   * @param {string} errorType - The category of the error (default: "GeneralError").
   */
  static SmartLoggerWithCooldown(
    loggingDecision,
    msg,
    errorType = "UnspecifiedError",
    sender = "blank-sender"
  ) {
    if (Config.LOGGING_OMEGA_DISABLED_GET_WRECKED) return;

    if (
      Config.LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE == 0 ||
      Config.LOGGING_FORCEFULLY_ENABLED
    ) {
      this.SmartLogger(loggingDecision, msg, sender);
    } else if (
      this.canLogError(errorType) ||
      Config.LOGGING_FORCEFULLY_ENABLED
    ) {
      this.SmartLogger(loggingDecision, msg, sender);
    }
  }

  /**
   * Checks whether logging should be allowed based on cooldowns.
   *
   * @param {string} errorType - The category of the error (e.g., "ModelLoadError").
   * @param {number} cooldownSeconds - The cooldown period for this error type.
   * @returns {boolean} - Whether logging should proceed.
   */
  static canLogError(errorType) {
    let currentTime = Date.now();

    if (!this.logCooldowns.has(errorType)) {
      this.logCooldowns.set(errorType, currentTime);
      return true;
    }

    let lastLogTime = this.logCooldowns.get(errorType);
    let timeSinceLastLog = (currentTime - lastLogTime) / 1000; // Convert to seconds

    let minimumCooldown = this.getLoggingCooldownByType(errorType);

    if (timeSinceLastLog >= minimumCooldown) {
      this.logCooldowns.set(errorType, currentTime);
      return true;
    }

    return false; // Cooldown not expired
  }
  /**
   * Retrieves the logging level based on its systemic importance.
   * Supports both numbers (0 / 1 (same level fo absolute importance),2,3) and "common sense" aliases (e.g., "critical", "secondary").
   *
   * @param {string | number} importance - The importance level common sense keyphrase or number or hosting object with an importance object
   * @returns {number | null} - Returns the associated logging level (0, 1, 2, 3) or `null` if not found.
   */
  static GetLoggingLevelByImportance(importance) {
    if (
      importance &&
      typeof importance === "object" &&
      !Array.isArray(importance)
    ) {
      if (
        "loggingImportance" in importance ||
        "LOGGING_IMPORTANCE" in importance
      )
        return this.GetLoggingLevelByImportance(importance.loggingImportance);
      if ("importance" in importance || "IMPORTANCE" in importance)
        return this.GetLoggingLevelByImportance(importance.importance);
    }

    // Normalize input to lowercase for case-insensitive matching
    const normalizedImportance =
      typeof importance === "string" ? importance.toLowerCase() : importance;

    // Check against defined marker lists
    if (this.baseSystemMarkers.has(normalizedImportance)) return 1; // Most critical logs
    if (this.secondaryMarkers.has(normalizedImportance)) return 2; // Medium-priority logs
    if (this.auxillaryMarkers.has(normalizedImportance)) return 3; // Lowest-priority logs

    if (this.standardLogLevels.hasOwnProperty(importance)) {
      return this.standardLogLevels[importance];
    }

    return -1; // If no match, return null (or handle gracefully)
  }

  /**
   * Determines whether logging should be enabled based on global settings,
   * caller preferences, and logging level comparison.
   *
   * **Priority Order:**
   * 1. **LOGGING_OMEGA_DISABLED_GET_WRECKED** → If `true`, all logging is disabled.
   * 2. **LOGGING_FORCEFULLY_ENABLED** → If `true`, logging is always enabled.
   * 3. **Caller Override** (`doesCallingLoggerOverrideConfig`) → If `true`, uses `callingLoggerValue`.
   * 4. **Log Level Check** → If `absoluteImportance` is **greater than or equal to** `CURRENT_LOGGING_LEVEL`,
   *    and logging is enabled, logging proceeds.
   *
   * @param {boolean} doesCallingLoggerOverrideConfig - If `true`, the caller overrides system settings and enforces `callingLoggerValue`.
   * @param {boolean} callingLoggerValue - The explicit logging decision from the calling logger (`true` = enable logging, `false` = disable).
   * @param {string | number} callingLogLevelOrImportance - The logging level (number) or importance keyphrase (string) from the caller.
   * @returns {boolean} - Returns `true` if logging should proceed, otherwise `false`.
   */
  static GetFinalizedLoggingDecision(
    doesCallingLoggerOverrideConfig = false,
    callingLoggerValue = false,
    callingLogLevelOrImportance
  ) {
    if (!callingLogLevelOrImportance) {
      callingLogLevelOrImportance = LoggerOmega.standardLogLevels["INFO"];
    }
    // Step 1: Absolute shutdown if logging is globally disabled
    if (Config.LOGGING_OMEGA_DISABLED_GET_WRECKED) return false;

    // Step 2: Forcefully enable logging if debugging mode is on
    if (Config.LOGGING_FORCEFULLY_ENABLED) return true;

    // Step 3: If the caller wants to override system settings, use their decision
    if (doesCallingLoggerOverrideConfig) return callingLoggerValue;

    // Step 4: Convert log importance string/number into an absolute log level
    let absoluteImportance = this.GetLoggingLevelByImportance(
      callingLogLevelOrImportance
    );

    // Step 5: Compare against the system-wide logging threshold
    if (
      absoluteImportance >= Config.CURRENT_LOGGING_LEVEL && // Log level check
      absoluteImportance !== -1 && // Ensure it's a valid log level
      callingLoggerValue && // Ensure the caller wants to log
      Config.LOGGING_ENABLED // Ensure logging is enabled
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   @param {boolean} loggingDecision - The explicit logging decision from the calling logger (`true` = enable logging, `false` = disable).
   @param {string} msg -  the total msg to be displayed by the SmartLogger
  @param {string} sender - Help specify where something is messing you up 
   * Note the "LOGGING_OMEGA_DISABLED_GET_WRECKED" ALWAYS, ALWAYS overrwrites all logging decisions, and such allows for logging code
   * to be in deployment without risking comment output performance issues
  */
  static SmartLogger(loggingDecision, msg, sender = "-sender-blank-") {
    if (!Config.LOGGING_OMEGA_DISABLED_GET_WRECKED) {
      if (loggingDecision || Config.LOGGING_FORCEFULLY_ENABLED) {
        console.log("Sender: " + sender + ", msg: " + msg);
      }
    }
  }

  /**
   * Finds and adjusts the most severe importance level inside an object.
   * - Searches case-insensitive importance keys (`importance`, `logging_importance`, `loggingimportance`).
   * - If multiple numeric values exist, it synchronizes them to the lowest.
   * - Logs the process using the LoggerOmega system.
   *
   * @param {object} obj - The object to check and update.
   * @param {string} loggingMsg - Message to include in logs (default: `"no-msg-for-object-importance-check-"`).
   * @param {boolean} loggingOverride - Whether logging rules should be overridden (default: `false`).
   * @param {boolean} loggingEnabled - Whether logging is enabled (default: `false`).
   * @param {number} loggingImportance - Logging priority (default: `2`).
   * @param {boolean} adjustImportanceCriticality - Whether to adjust importance values to the lowest found (default: `false`).
   * @returns {number | null} - The lowest numeric importance level found, or `null` if none are found.
   */
  static getMostSevereImportanceLevelConsiderAdjustment(
    obj,
    loggingMsg = "no-msg-for-object-importance-check-",
    loggingOverride = false,
    loggingEnabled = false,
    loggingImportance = 2,
    adjustImportanceCriticality = false,
    errorType
  ) {
    if (!obj || typeof obj !== "object") {
      let msg = `The object checked for consistency was not an object! ${loggingMsg}`;
      let finalDecision = this.GetFinalizedLoggingDecision(
        loggingOverride,
        loggingEnabled,
        loggingImportance
      );
      this.SmartLoggerWithCooldown(finalDecision, msg, errorType);
      return null;
    }

    let lowestNumericValue = Infinity;
    let foundImportances = {};
    let minimumImportanceMsg = "-no-minimum-importance-found";

    // Loop through object keys and match against importanceShortcuts
    for (const key of Object.keys(obj)) {
      let normalizedKey = key.toLowerCase();
      if (this.importanceShortcuts.includes(normalizedKey)) {
        let value = obj[key];

        // Check if value is an integer
        if (typeof value === "number" && Number.isInteger(value)) {
          lowestNumericValue = Math.min(lowestNumericValue, value);
          minimumImportanceMsg = `minimum-importance-successfully-found: ${lowestNumericValue}`;
        }

        foundImportances[key] = value;

        // Adjust importance values if required
        if (adjustImportanceCriticality) {
          obj[key] = lowestNumericValue;
        }
      }
    }

    let combinedLog = `${loggingMsg} ${minimumImportanceMsg}`;
    let finalLoggingDecision = LoggerOmega.GetFinalizedLoggingDecision(
      loggingOverride,
      loggingEnabled,
      loggingImportance
    );
    LoggerOmega.SmartLoggerWithCooldown(
      finalLoggingDecision,
      combinedLog,
      errorType
    );

    return lowestNumericValue === Infinity ? null : lowestNumericValue;
  }

  static getLoggingCooldownByType(loggingType) {
    if (Config.LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE_ACTIVE) {
      return Config.LOGGING_COOLDOWNS_ABSOLUTE_OVERRIDE;
    }

    return (
      this.LOGGING_COOLDOWNS[loggingType] ??
      Config.LOGGING_COOLDOWNS_FALLBACK_DEFAULT
    );
  }
}
