/**
 * Constructs a new Facebook Transaction.
 *
 * @param {string} params.transactionId - A unique identifier for the transaction.
 * @param {string} params.productId - The product being purchased.
 * @param {number} params.amount - The transaction amount.
 * @param {string} params.currency - The currency (e.g., "USD").
 * @param {string} [params.timestamp] - ISO 8601 timestamp (optional; defaults to now).
 * @param {string} params.fbPaymentToken - The Facebook payment token.
 * @param {string} params.fbUserId - The Facebook user ID.
 * @param {string} params.signedRequest - The signed request from Facebook.
 */
class TransactionFacebook extends TransactionArchetype {
  constructor({
    transactionId,
    productId,
    amount,
    currency,
    timestamp,
    fbPaymentToken,
    fbUserId,
    signedRequest,
  }) {
    super({ transactionId, productId, amount, currency, timestamp });
    // Token provided by Facebook to validate the payment.
    this.fbPaymentToken = fbPaymentToken;
    // Unique identifier for the Facebook user.
    this.fbUserId = fbUserId;
    // Signed request payload from Facebook ensuring payment integrity.
    this.signedRequest = signedRequest;
  }
}
