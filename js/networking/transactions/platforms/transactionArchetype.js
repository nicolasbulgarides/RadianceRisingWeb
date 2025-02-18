/**
 * TransactionArchetype
 * ---------------------
 * A base class for all transaction types.
 *
 * Properties:
 *  - transactionId: A unique identifier for the transaction.
 *  - productId: The product being purchased.
 *  - amount: The transaction amount.
 *  - currency: The currency (e.g., "USD").
 *  - timestamp: ISO 8601 timestamp (optional; defaults to now).
 */

class TransactionArchetype {
  /**
   * Constructs a new TransactionArchetype.
   *
   * @param {string} params.transactionId - A unique identifier for the transaction.
   * @param {string} params.productId - The product being purchased.
   * @param {number} params.amount - The transaction amount.
   * @param {string} params.currency - The currency (e.g., "USD").
   * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
   */
  constructor({ transactionId, productId, amount, currency, timestamp }) {
    // Unique identifier for the transaction.
    this.transactionId = transactionId;
    // Identifier for the purchased product.
    this.productId = productId;
    // The transaction amount.
    this.amount = amount;
    // The transaction currency.
    this.currency = currency;
    // Timestamp of the transaction; defaults to the current time if not provided.
    this.timestamp = timestamp || Timestamp;
  }
}
