/**
 * TimestampGenie
 * -------------
 * A utility class for generating timestamps and simplified date representations used for diagnostics.
 *
 * Methods:
 *  - getStandardTimeStampISO8601: Returns the current date/time in ISO 8601 string format.
 *  - getConvenientDate: Returns a ConvenientDate instance with a full month name, numeric day, weekday name, and year.
 *
 * Example:
 *   const isoTimestamp = TimestampGenie.getStandardTimeStampISO8601();
 *   const simpleDate = TimestampGenie.getConvenientDate();
 */
class TimestampGenie {
  // Static array with full month names. Note: getMonth() returns 0-based indices.
  static MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Static array with full weekday names. Note: getDay() returns values in the range 0 (Sunday) to 6 (Saturday).
  static DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  /**
   * Converts human-friendly margin units to milliseconds.
   * @param {number} threshold - The value of the threshold.
   * @param {string} unit - The unit of time ("ms", "s", "m", "h").
   * @returns {number} The converted threshold in milliseconds.
   */
  static convertToMilliseconds(threshold, unit) {
    const conversionFactors = {
      ms: 1, // Milliseconds
      s: 1000, // Seconds
      m: 60000, // Minutes
      h: 3600000, // Hours
    };

    return threshold * (conversionFactors[unit] || 1);
  }

  /**
   * Determines which batch is older based on ISO 8601 timestamps.
   * @param {Object} batchA - First batch object (must have a timestamp property).
   * @param {Object} batchB - Second batch object (must have a timestamp property).
   * @param {boolean} considerErrorMargin - If true, treats timestamps within error margin as equal.
   * @param {number} errorMarginThreshold - The margin value.
   * @param {string} marginUnit - The unit of margin ("ms", "s", "m", "h").
   * @returns {Object|null} The older batch, or null if within the error margin.
   */
  static determineOlderBatch(
    batchA,
    batchB,
    considerErrorMargin = false,
    errorMarginThreshold = 0,
    marginUnit = "ms"
  ) {
    const timestampA = new Date(batchA.timestamp).getTime();
    const timestampB = new Date(batchB.timestamp).getTime();
    const thresholdMs = this.convertToMilliseconds(
      errorMarginThreshold,
      marginUnit
    );

    if (
      considerErrorMargin &&
      Math.abs(timestampA - timestampB) <= thresholdMs
    ) {
      return null; // Both timestamps are effectively the same.
    }

    return timestampA < timestampB ? batchA : batchB;
  }

  /**
   * Determines which batch is younger based on ISO 8601 timestamps.
   * @param {Object} batchA - First batch object (must have a timestamp property).
   * @param {Object} batchB - Second batch object (must have a timestamp property).
   * @param {boolean} considerErrorMargin - If true, treats timestamps within error margin as equal.
   * @param {number} errorMarginThreshold - The margin value.
   * @param {string} marginUnit - The unit of margin ("ms", "s", "m", "h").
   * @returns {Object|null} The younger batch, or null if within the error margin.
   */
  static determineYoungerBatch(
    batchA,
    batchB,
    considerErrorMargin = false,
    errorMarginThreshold = 0,
    marginUnit = "ms"
  ) {
    const timestampA = new Date(batchA.timestamp).getTime();
    const timestampB = new Date(batchB.timestamp).getTime();
    const thresholdMs = this.convertToMilliseconds(
      errorMarginThreshold,
      marginUnit
    );

    if (
      considerErrorMargin &&
      Math.abs(timestampA - timestampB) <= thresholdMs
    ) {
      return null; // Both timestamps are effectively the same.
    }

    return timestampA > timestampB ? batchA : batchB;
  }
  /*
   * Returns the current timestamp as an ISO 8601 string.
   * @returns {string} The current timestamp in ISO 8601 format.
   */
  static getStandardTimeStampISO8601() {
    return new Date().toISOString();
  }

  /**
   * Returns a ConvenientDate object containing the current Month, Date, Day, and Year.
   *
   * - Month: Full month name (e.g., "February")
   * - Date: Numeric day of the month (e.g., 10)
   * - Day: Full weekday name (e.g., "Monday")
   * - Year: Four-digit year (e.g., 2023)
   *
   * @returns {ConvenientDate} An instance of ConvenientDate.
   */
  static getConvenientDate() {
    const now = new Date();
    return new ConvenientDate(
      this.MONTH_NAMES[now.getMonth()], // Map numeric month to full month name.
      now.getDate(), // Numeric day of the month.
      this.DAY_NAMES[now.getDay()], // Map weekday index to full weekday name.
      now.getFullYear() // Four-digit year.
    );
  }

  /**
   * Returns the current timestamp as an ISO 8601 string.
   * Convenient shortcut for getStandardTimeStampISO8601() because who can
   * remember that name lol
   * @returns {string} The current timestamp in ISO 8601 format.
   */
  static getTimestamp() {
    return this.getStandardTimeStampISO8601();
  }
}

/**
 * ConvenientDate
 * ---------------
 * Represents a simplified date object with descriptive keys.
 * Contains:
 *  - month: Full month name.
 *  - date: Day of the month (numeric).
 *  - day: Full name of the weekday.
 *  - year: Four-digit year.
 */
class ConvenientDate {
  /**
   * Constructs a ConvenientDate instance.
   *
   * @param {string} month - Full name of the month (e.g., "February").
   * @param {number} date - Day of the month.
   * @param {string} day - Full name of the weekday (e.g., "Monday").
   * @param {number} year - Full year (e.g., 2023).
   */
  constructor(month, date, day, year) {
    this.month = month;
    this.date = date;
    this.day = day;
    this.year = year;
  }
}
