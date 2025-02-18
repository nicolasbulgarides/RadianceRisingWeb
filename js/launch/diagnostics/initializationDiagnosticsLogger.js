/**
 * InitializationDiagnosticsLogger Class
 *
 * This class provides static methods to track and log the progression of the initialization composite sequence.
 * Each diagnostic method logs a message using LoggerOmega.SmartLoggerWithCooldown with a designated error type
 * (e.g., "InitializationPhaseProgress" for normal progress and "InitializationPhaseError" for errors).
 * All diagnostic messages are appended to the LoggerOmega.initializationSequenceTracker array for later review.
 *
 * Usage recommendations:
 * - In ScriptInitializer.js:
 *   • At the beginning of loadScriptManifest, call:
 *       InitializationDiagnosticsLogger.logPhaseStart("ScriptManifestLoad")
 *   • Inside manifest.onload (after successful ScriptManifest loading), call:
 *       InitializationDiagnosticsLogger.logPhaseSuccess("ScriptManifestLoad")
 *   • In manifest.onerror, if the ScriptManifest fails to load, call:
 *       InitializationDiagnosticsLogger.logPhaseError("ScriptManifestLoad", "Failed to load ScriptManifest")
 *
 * - In EngineInitialization.js:
 *   • Before loading the engine initialization script, call:
 *       InitializationDiagnosticsLogger.logPhaseStart("EngineInitializationLoad")
 *   • Inside the engine script onload, after creating the Babylon engine, call:
 *       InitializationDiagnosticsLogger.logPhaseSuccess("EngineInitialization")
 *   • On error conditions (e.g., BABYLON is undefined), call:
 *       InitializationDiagnosticsLogger.logPhaseError("EngineInitialization", errorMessage)
 *
 * - In GameInitialization.js:
 *   • At the start of initialize(), call:
 *       InitializationDiagnosticsLogger.logPhaseStart("GameInitialization")
 *   • After successful gameplay and asset loading, call:
 *       InitializationDiagnosticsLogger.logPhaseSuccess("GameInitialization")
 *   • If gameplay initialization encounters an error, call:
 *       InitializationDiagnosticsLogger.logPhaseError("GameInitialization", error.message)
 */
class InitializationDiagnosticsLogger {
  /**
   * Ensure the initializationSequenceTracker array is created on LoggerOmega.
   */
  static initializeTracker() {
    if (!LoggerOmega.initializationSequenceTracker) {
      LoggerOmega.initializationSequenceTracker = [];
    }
  }

  /**
   * Logs the start of an initialization phase.
   *
   * @param {string} phase - The name of the initialization phase.
   */
  static logPhaseStart(phase) {
    this.initializeTracker();
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] INIT START: ${phase}`;
    // Use a specific error type for phase progression
    const errorType = "InitializationPhaseProgress";
    LoggerOmega.SmartLoggerWithCooldown(true, message, errorType, "InitializationDiagnosticsLogger");
    LoggerOmega.initializationSequenceTracker.push({
      phase,
      status: "start",
      timestamp: Date.now(),
      message,
    });
  }

  /**
   * Logs the successful completion of an initialization phase.
   *
   * @param {string} phase - The name of the initialization phase.
   */
  static logPhaseSuccess(phase) {
    this.initializeTracker();
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] INIT SUCCESS: ${phase}`;
    const errorType = "InitializationPhaseProgress";
    LoggerOmega.SmartLoggerWithCooldown(true, message, errorType, "InitializationDiagnosticsLogger");
    LoggerOmega.initializationSequenceTracker.push({
      phase,
      status: "success",
      timestamp: Date.now(),
      message,
    });
  }

  /**
   * Logs an error that occurs during an initialization phase.
   *
   * @param {string} phase - The name of the initialization phase.
   * @param {string} errorMsg - A message describing the error.
   */
  static logPhaseError(phase, errorMsg) {
    this.initializeTracker();
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] INIT ERROR: ${phase} - ${errorMsg}`;
    // Use a specific error type for initialization errors
    const errorType = "InitializationPhaseError";
    LoggerOmega.SmartLoggerWithCooldown(true, message, errorType, "InitializationDiagnosticsLogger");
    LoggerOmega.initializationSequenceTracker.push({
      phase,
      status: "error",
      timestamp: Date.now(),
      message,
    });
  }

  /**
   * Logs a custom diagnostic message related to the initialization sequence.
   *
   * @param {string} phase - The current phase name.
   * @param {string} customMsg - A custom diagnostic message.
   */
  static logCustomMessage(phase, customMsg) {
    this.initializeTracker();
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] INIT CUSTOM: ${phase} - ${customMsg}`;
    const errorType = "InitializationPhaseProgress";
    LoggerOmega.SmartLoggerWithCooldown(true, message, errorType, "InitializationDiagnosticsLogger");
    LoggerOmega.initializationSequenceTracker.push({
      phase,
      status: "custom",
      timestamp: Date.now(),
      message,
    });
  }
}