/**
 * Constructs a new Windows/Linux Transaction.
 *
 * @param {Object} params - The transaction parameters.
 * @param {string} params.transactionId - A unique identifier for the transaction.
 * @param {string} params.productId - The identifier for the purchased product.
 * @param {number} params.amount - The transaction amount.
 * @param {string} params.currency - The currency code (e.g., "USD").
 * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
 *
 * // Extra Windows/Linux-specific parameters:
 * @param {string} params.paymentProvider - Payment provider, e.g., "stripe" or "paypal".
 * @param {string} params.orderId - The order ID from the payment gateway.
 * @param {string} params.transactionToken - A token/receipt from the payment processor.
 */
class TransactionWindowsOrLinux extends TransactionArchetype {
  constructor({
    transactionId,
    productId,
    amount,
    currency,
    timestamp,
    paymentProvider,
    orderId,
    transactionToken,
  }) {
    super({ transactionId, productId, amount, currency, timestamp });
    // The identifier for the payment provider.
    this.paymentProvider = paymentProvider;
    // Order identifier from the external payment gateway.
    this.orderId = orderId;
    // Token or receipt returned from the payment processor.
    this.transactionToken = transactionToken;
  }
}
