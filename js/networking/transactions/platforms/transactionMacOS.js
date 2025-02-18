/**
 * Constructs a new MacOS Transaction.
 *
 * @param {string} params.transactionId - A unique identifier for the transaction.
 * @param {string} params.productId - The product being purchased.
 * @param {number} params.amount - The transaction amount.
 * @param {string} params.currency - The currency (e.g., "USD").
 * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
 * @param {string} params.receiptData - The receipt data from the App Store.
 * @param {string} params.appIdentifier - The app's bundle identifier.
 * @param {string} params.environment - Either 'sandbox' or 'production'.
 */
class TransactionMacOS extends TransactionArchetype {
  constructor({
    transactionId,
    productId,
    amount,
    currency,
    timestamp,
    receiptData,
    appIdentifier,
    environment,
  }) {
    super({ transactionId, productId, amount, currency, timestamp });
    // Receipt data from the App Store transaction.
    this.receiptData = receiptData;
    // Unique identifier for the app; typically the bundle identifier.
    this.appIdentifier = appIdentifier;
    // Specifies whether the transaction was in 'sandbox' or 'production' mode.
    this.environment = environment;
  }
}
