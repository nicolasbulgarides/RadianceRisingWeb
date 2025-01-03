// File: js/utils/logger.js

/**
 * Logger Utility Class
 * Provides simple logging functionality with the ability to enable or disable logs globally based on Config settings.
 */
class Logger {
  /**
   * Creates an instance of Logger.
   * Sets `isEnabled` based on the value of `Config.LOGGING_ENABLED`.
   */
  constructor() {
    this.isEnabled = Config.LOGGING_ENABLED;
  }

  /**
   * Enables logging.
   * Sets `isEnabled` to true and logs an enable message.
   */
  enable() {
    this.isEnabled = true;
    this.log('Logging has been enabled.');
  }

  /**
   * Disables logging.
   * Logs a disable message and then sets `isEnabled` to false.
   */
  disable() {
    this.log('Logging has been disabled.');
    this.isEnabled = false;
  }

  /**
   * Logs a message to the console if logging is enabled.
   * @param {...any} args - The messages or objects to log.
   */
  log(...args) {
    if (this.isEnabled) {
      console.log('[Logger]', ...args);
    }
  }

  /**
   * Logs an error message to the console if logging is enabled.
   * @param {...any} args - The error messages or objects to log.
   */
  error(...args) {
    if (this.isEnabled) {
      console.error('[Logger]', ...args);
    }
  }

  /**
   * Logs a warning message to the console if logging is enabled.
   * @param {...any} args - The warning messages or objects to log.
   */
  warn(...args) {
    if (this.isEnabled) {
      console.warn('[Logger]', ...args);
    }
  }
}

// Ensure that Config is loaded before instantiating Logger
if (typeof Config === 'undefined') {
  throw new Error("Config is not loaded. Make sure 'Config.js' is loaded before 'Logger.js'.");
}

// Instantiate a global Logger instance
window.Logger = new Logger();
