//note that this is a class for a successful transaction event that is used to inform the  client that a transaction has been successful
//and thus based off of the transaction type and the corresponding transaction entitlement, the player will be "rewarded" accordingly
class SuccessfulTransactionEvent {
  constructor(
    playerAccount,
    transactionId,
    transactionType,
    transactionEntitlement,
    transactionInformedTimestamp
  ) {
    this.playerAccount = playerAccount;
    this.transactionId = transactionId;
    this.transactionType = transactionType;
    this.transactionInformedTimestamp = transactionInformedTimestamp;
    this.transactionEntitlement = transactionEntitlement;
  }
}
