class TransactionManager {
  constructor() {
    this.transactionUIManager = new TransactionUIManager();

    FundamentalSystemBridge.registerTransactionManager(this);
  }

  generateTransactionUIByTransactionType(transactionType) {}

  displayMobileTransactionPageForIOS() {}
}
