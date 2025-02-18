/**
 * LoggerCooldownRegistry
 *
 * This class defines the default logging cooldown durations for various diagnostic
 * events throughout your puzzle game. The registry is organized into categories based
 * on thematically related events. Instead of directly embedding numeric cooldown values,
 * we now use class-level properties to improve configurability:
 *
 * - this.nonessential_or_obnoxious_cooldown replaces all 4s (used for high-frequency, low-criticality logs).
 * - this.critical_non_cooldown replaces all 1s (used for important events requiring precision).
 *
 * Categories:
 * - Diagnostics and Performance: (e.g., CPU/GPU usage) use nonessential_or_obnoxious_cooldown.
 * - Payments: Financial transactions use critical_non_cooldown.
 * - Level Loading: Lifecycle events of level management use critical_non_cooldown.
 * - Model Loading: Model asset events use critical_non_cooldown.
 * - Login: Authentication related events use critical_non_cooldown.
 * - Audio: Audio system events use critical_non_cooldown.
 * - DataSync: Data consistency events use critical_non_cooldown.
 * - Lighting: Loader/setup events use critical_non_cooldown while frequent adjustments use nonessential_or_obnoxious_cooldown.
 */
class LoggerCooldownRegistry {

    //baseline set ups for cooldowns - 0 as in no cooldown, 4 as in 4 seconds cooldown
    //specific sub-categories can be set to 0 or 4 to override the baseline to either a specific cooldown or simply "nonessential_or_obnoxious_cooldown" (4 seconds)
  static critical_non_cooldown = 0;
  static nonessential_or_obnoxious_cooldown = 4;

  // Static properties for configurable cooldowns:
  static data_sync_audit_cooldown = this.critical_non_cooldown;
  static level_loading_audit_cooldown = this.critical_non_cooldown;
  static model_loading_audit_cooldown = this.critical_non_cooldown;
  static gameplay_event_audit_cooldown = this.critical_non_cooldown;

  static audio_audit_cooldown = this.nonessential_or_obnoxious_cooldown;
  static lighting_audit_cooldown = this.nonessential_or_obnoxious_cooldown;
  static diagnostics_and_performance_cooldown = this.nonessential_or_obnoxious_cooldown;
  // The registry is built by combining all individual categories.
  static LOGGING_COOLDOWNS_DEFAULTS = LoggerCooldownRegistry.initializeDefaults();

  /**
   * Diagnostics and Performance Events:
   * Events related to system performance and resource usage.
   * These events are high-frequency and are assigned a cooldown set to nonessential_or_obnoxious_cooldown.
   *
   * @return {object} Mapping of diagnostics/performance event names to a cooldown value.
   */
  static populateDiagnosticsAndPerformanceEvents() {
    return {
      CPUUsageHigh: this.diagnostics_and_performance_cooldown,               // High CPU usage detected.
      GPUUsageHigh: this.diagnostics_and_performance_cooldown,               // High GPU usage detected.
      ResourceLoadTimeHigh: this.diagnostics_and_performance_cooldown,       // Resource load times exceed acceptable thresholds.
      DrawCallCountHigh: this.diagnostics_and_performance_cooldown,          // Excessive draw calls may indicate performance issues.
      GarbageCollectionTriggered: this.diagnostics_and_performance_cooldown, // GC events, monitor performance impact.
      PhysicsCalculationDelay: this.diagnostics_and_performance_cooldown,    // Delays in physics calculations.
    };
  }

  /**
   * Payments Events:
   * Events related to financial transactions.
   * These events are critical for the game economy and use a cooldown set to critical_non_cooldown.
   *
   * @return {object} Mapping of payment event names to a cooldown value.
   */
  static populatePaymentsEvents() {
    return {
      PaymentTransactionInitiated: this.critical_non_cooldown,         // Transaction process started.
      PaymentTransactionSuccess: this.critical_non_cooldown,           // Transaction processed successfully.
      PaymentTransactionFailure: this.critical_non_cooldown,           // Transaction failed.
      FinancialTransactionValidationError: this.critical_non_cooldown, // Validation errors during a transaction.
      FinancialFraudDetected: this.critical_non_cooldown,              // Fraudulent activity detected.
      FinancialCreditApplied: this.critical_non_cooldown,              // Credit operation succeeded.
      FinancialDebitProcessed: this.critical_non_cooldown,             // Debit operation completed.
    };
  }

  /**
   * Level Loading Events:
   * Events related to loading, restarting, or exiting game levels.
   * These events have a cooldown set to critical_non_cooldown.
   *
   * @return {object} Mapping of level loading event names to a cooldown value.
   */
  static populateLevelLoadingEvents() {
    return {
      LevelLoadingStarted: this.level_loading_audit_cooldown,    // Level loading commences.
      LevelLoaded: this.level_loading_audit_cooldown,            // Level successfully loaded.
      LevelLoadFailure: this.level_loading_audit_cooldown,       // Error occurred while loading a level.
      LevelRestarted: this.level_loading_audit_cooldown,         // The level was restarted.
      LevelExit: this.level_loading_audit_cooldown,              // Exiting the level.
      LevelCheckpointReached: this.level_loading_audit_cooldown, // Player reached a checkpoint.
    };
  }

  /**
   * Model Loading Events:
   * Events tracking the lifecycle of 3D model assets.
   * A cooldown of critical_non_cooldown is applied to these events.
   *
   * @return {object} Mapping of model loading event names to a cooldown value.
   */
  static populateModelLoadingEvents() {
    return {
      ModelLoadingStarted: this.model_loading_audit_cooldown, // Model loading started.
      ModelLoaded: this.model_loading_audit_cooldown,         // Model loaded successfully.
      ModelLoadFailure: this.model_loading_audit_cooldown,    // Error during model loading.
      ModelUnloaded: this.model_loading_audit_cooldown,       // Model removed from memory.
      ModelAnimationStart: this.model_loading_audit_cooldown, // Model animation commenced.
      ModelAnimationEnd: this.critical_non_cooldown,   // Model animation ended.
      ModelRenderError: this.critical_non_cooldown,    // Error during model rendering.
    };
  }

  /**
   * Login Events:
   * Events concerning player authentication activities.
   * A cooldown of critical_non_cooldown is used.
   *
   * @return {object} Mapping of login event names to a cooldown value.
   */
  static populateLoginEvents() {
    return {
      PlayerLoginAttempt: this.critical_non_cooldown,  // Login attempt made.
      PlayerLoginSuccess: this.critical_non_cooldown,  // Login succeeded.
      PlayerLoginFailure: this.critical_non_cooldown,  // Login failed.
      PlayerLogout: this.critical_non_cooldown,        // Player logged out.
      AuthenticationTimeout: this.critical_non_cooldown, // Authentication timed out.
    };
  }

  /**
   * Audio Events:
   * Events related to audio system issues or asset loading.
   * A cooldown of critical_non_cooldown is applied.
   *
   * @return {object} Mapping of audio event names to a cooldown value.
   */
  static populateAudioEvents() {
    return {
      AudioDeviceError: this.audio_audit_cooldown,     // Error with the audio device.
      AudioLoading: this.audio_audit_cooldown,         // Audio asset is loading.
      AudioBufferUnderflow: this.audio_audit_cooldown,   // Audio buffer underflow detected.
      AudioCodecError: this.audio_audit_cooldown,        // Error related to audio codecs.
    };
  }

  /**
   * Data Synchronization Events:
   * Events ensuring data consistency and synchronization.
   * Uses a cooldown of critical_non_cooldown.
   *
   * @return {object} Mapping of datasync event names to a cooldown value.
   */
  static populateDataSyncEvents() {
    return {
      DataConsistencyCheckFailure: this.critical_non_cooldown, // Data consistency checks failed.
      DataSynchronizationStarted: this.critical_non_cooldown,  // Data sync process started.
      DataSynchronizationCompleted: this.critical_non_cooldown,// Data sync completed.
      DatabaseUpdateError: this.critical_non_cooldown,         // Error during database update.
    };
  }

  /**
   * Lighting Events:
   * Handles events for the game's lighting system.
   * - Loader/Setup events (less frequent) use critical_non_cooldown.
   * - High-frequency adjustment events use nonessential_or_obnoxious_cooldown to prevent flooding.
   *
   * @return {object} Mapping of lighting event names to their corresponding cooldown values.
   */
  static populateLightingEvents() {
    return {
      // Loader and setup events (less frequent)
      LightingLoader: this.critical_non_cooldown,   // Lighting loader initialization.
      LightingLoading: this.critical_non_cooldown,  // Lighting assets are loading.
      LightingSetupError: this.critical_non_cooldown, // Error during lighting setup.

      // High-frequency adjustment events
      LightingFrameUpdate: this.lighting_audit_cooldown,    // Frame-by-frame lighting updates.
      LightingAdjustment: this.lighting_audit_cooldown,      // Changes in lighting configuration.
      LightingIntensityChange: this.lighting_audit_cooldown, // Variations in lighting intensity.
      LightingColorChange: this.lighting_audit_cooldown,     // Changes in lighting color.
      LightingAmbientUpdate: this.lighting_audit_cooldown,   // Updates to ambient lighting.
      LightingShadowUpdate: this.lighting_audit_cooldown,    // Changes in shadow settings.
    };
  }

  /**
   * Combines all event categories into a single logging cooldown defaults registry.
   *
   * @return {object} A combined object mapping each event to its cooldown duration.
   */
  static initializeDefaults() {
    return {
      ...LoggerCooldownRegistry.populateDiagnosticsAndPerformanceEvents(),
      ...LoggerCooldownRegistry.populatePaymentsEvents(),
      ...LoggerCooldownRegistry.populateLevelLoadingEvents(),
      ...LoggerCooldownRegistry.populateModelLoadingEvents(),
      ...LoggerCooldownRegistry.populateLoginEvents(),
      ...LoggerCooldownRegistry.populateAudioEvents(),
      ...LoggerCooldownRegistry.populateDataSyncEvents(),
      ...LoggerCooldownRegistry.populateLightingEvents(),
    };
  }
}
