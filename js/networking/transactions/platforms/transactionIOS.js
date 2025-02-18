/**
 * Constructs a new iOS Transaction.
 *
 * @param {string} params.transactionId - A unique identifier for the transaction.
 * @param {string} params.productId - The product being purchased.
 * @param {number} params.amount - The transaction amount.
 * @param {string} params.currency - The currency (e.g., "USD").
 * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
 * @param {string} params.receiptData - The receipt data from StoreKit.
 * @param {string} params.bundleId - The app's bundle identifier.
 * @param {string} params.environment - Either 'sandbox' or 'production'.
 */
class TransactionIOS extends TransactionArchetype {
  constructor({
    transactionId,
    productId,
    amount,
    currency,
    timestamp,
    receiptData,
    bundleId,
    environment,
  }) {
    super({ transactionId, productId, amount, currency, timestamp });
    // Receipt data obtained from StoreKit.
    this.receiptData = receiptData;
    // The application's bundle identifier.
    this.bundleId = bundleId;
    // The operational environment; e.g., 'sandbox' or 'production'.
    this.environment = environment;
  }
}
