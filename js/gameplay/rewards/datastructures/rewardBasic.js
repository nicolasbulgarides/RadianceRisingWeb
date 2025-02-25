/**
 * RewardBasic represents the fundamental reward types that can be awarded to players.
 * This class handles the core reward elements including experience points, in-game currency,
 * and item-based rewards, forming the foundation of the reward system.
 */
class RewardBasic {
  /**
   * Creates a new RewardBasic instance.
   * @param {number} exp - Amount of experience points to be awarded
   * @param {number} currency - Amount of in-game currency to be awarded
   * @param {Object} item - Single item reward (if applicable)
   * @param {Array} itemBundle - Collection of items to be awarded together
   */
  constructor(exp, currency, item, itemBundle) {
    this.rewardedExperience = exp;
    this.rewardedCurrency = currency;
    this.rewardedItem = item;
    this.rewardedItemBundle = itemBundle;
  }
}
