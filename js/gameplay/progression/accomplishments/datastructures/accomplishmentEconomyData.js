/**
 * Data structure for tracking economy-related accomplishments.
 * Used to record economic activities such as currency milestones, valuable transactions,
 * marketplace activities, trading milestones, and acquisition of rare currencies.
 * Supports tracking of different currency types, transaction values, and trading partners.
 */
class AccomplishmentEconomyData {
  /**
   * Creates a new economy accomplishment data instance
   * @param {string} currencyType - Type of currency involved (gold, premium, etc.)
   * @param {number} currencyAmount - Amount of currency involved in the transaction
   * @param {number} previousMilestone - Previous milestone amount (for milestone tracking)
   * @param {boolean} isFirstMilestone - Whether this is the first milestone of this type
   * @param {string} economyActivityType - Type of economic activity (accumulation, transaction, etc.)
   * @param {string} tradingPartner - Identifier of the trading partner (if applicable)
   * @param {string} marketplaceId - Identifier of the marketplace (if applicable)
   * @param {string} itemId - Identifier of the item involved (if applicable)
   * @param {number} itemValue - Value of the item involved (if applicable)
   * @param {string} transactionType - Type of transaction (purchase, sale, trade, etc.)
   * @param {number} totalTradesCompleted - Total number of trades completed (for milestones)
   * @param {number} tradeMilestoneThreshold - Threshold for trading milestone (if applicable)
   * @param {string} acquisitionMethod - Method of currency acquisition (reward, purchase, etc.)
   */
  constructor(
    currencyType,
    currencyAmount,
    previousMilestone,
    isFirstMilestone,
    economyActivityType,
    tradingPartner,
    marketplaceId,
    itemId,
    itemValue,
    transactionType,
    totalTradesCompleted,
    tradeMilestoneThreshold,
    acquisitionMethod
  ) {
    this.currencyType = currencyType;
    this.currencyAmount = currencyAmount;
    this.previousMilestone = previousMilestone;
    this.isFirstMilestone = isFirstMilestone;
    this.economyActivityType = economyActivityType;
    this.tradingPartner = tradingPartner;
    this.marketplaceId = marketplaceId;
    this.itemId = itemId;
    this.itemValue = itemValue;
    this.transactionType = transactionType;
    this.totalTradesCompleted = totalTradesCompleted;
    this.tradeMilestoneThreshold = tradeMilestoneThreshold;
    this.acquisitionMethod = acquisitionMethod;
  }
}
