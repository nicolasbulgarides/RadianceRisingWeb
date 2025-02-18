/**
 * Constructs a new Steam Transaction.
 *
 * @param {string} params.transactionId - A unique identifier for the transaction.
 * @param {string} params.productId - The product being purchased.
 * @param {number} params.amount - The transaction amount.
 * @param {string} params.currency - The currency (e.g., "USD").
 * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
 * @param {string} params.steamOrderId - The Steam order ID.
 * @param {string} params.steamId - The Steam ID.
 * @param {string} params.receiptData - The receipt data from Steam.
 */

class TransactionSteam extends TransactionArchetype {
  constructor({
    transactionId,
    productId,
    amount,
    currency,
    timestamp,
    steamOrderId,
    steamId,
    receiptData,
  }) {
    super({ transactionId, productId, amount, currency, timestamp });
    // Order ID provided by Steam.
    this.steamOrderId = steamOrderId;
    // Unique identifier for the Steam user.
    this.steamId = steamId;
    // Receipt data validating the Steam transaction.
    this.receiptData = receiptData;
  }
}
