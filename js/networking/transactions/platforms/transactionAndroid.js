// transactionAndroid.js

/**
 * Constructs a new TransactionArchetype for Android transactions.
 * Child classes are used for specific platforms rather than using this class directly.
 *
 * @param {string} params.transactionId - A unique identifier for the transaction.
 * @param {string} params.productId - The product being purchased.
 * @param {number} params.amount - The transaction amount.
 * @param {string} params.currency - The currency (e.g., "USD").
 * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
 * @param {string} params.purchaseToken - The purchase token from the Play Store.
 * @param {string} params.orderId - The order ID from the Play Store.
 * @param {string} params.signature - The signature from the Play Store.
 * @param {number} params.purchaseTime - The purchase time from the Play Store.
 */

class TransactionAndroid extends TransactionArchetype {
  constructor({
    transactionId,
    productId,
    amount,
    currency,
    timestamp,
    purchaseToken,
    orderId,
    signature,
    purchaseTime,
  }) {
    super({ transactionId, productId, amount, currency, timestamp });
    // Token provided by the Play Store for validating the purchase.
    this.purchaseToken = purchaseToken;
    // Order identifier from the Play Store.
    this.orderId = orderId;
    // Digital signature from the purchase.
    this.signature = signature;
    // Timestamp for the purchase (e.g., in milliseconds or epoch format).
    this.purchaseTime = purchaseTime;
  }
}
