/**
 * Emitter for economy-related accomplishments.
 *
 * This class provides presets for common economy accomplishments such as
 * currency milestones, trading achievements, and economic activities.
 */
class EconomyEmitter extends AccomplishmentEmitterBase {
  /**
   * Gets a preset configuration by name.
   *
   * @param {string} presetName - The name of the preset to retrieve
   * @returns {Object|null} - The preset configuration or null if not found
   */
  getPreset(presetName) {
    const presets = {
      currencyMilestone: {
        category: "economy",
        subCategory: "currency",
        metaData: {
          nickName: "Currency Milestone",
          description: "Player has reached a currency milestone",
        },
        defaultData: {
          currencyType: "gold",
          currencyAmount: 1000,
          previousMilestone: 0,
          isFirstMilestone: true,
          economyActivityType: "accumulation",
          tradingPartner: "",
          marketplaceId: "",
          itemId: "",
          itemValue: 0,
          transactionType: "none",
        },
      },
      valuableTransaction: {
        category: "economy",
        subCategory: "transaction",
        metaData: {
          nickName: "Valuable Transaction",
          description: "Player has completed a valuable transaction",
        },
        defaultData: {
          currencyType: "gold",
          currencyAmount: 5000,
          previousMilestone: 0,
          isFirstMilestone: false,
          economyActivityType: "transaction",
          tradingPartner: "",
          marketplaceId: "",
          itemId: "",
          itemValue: 5000,
          transactionType: "purchase",
        },
      },
      marketplaceActivity: {
        category: "economy",
        subCategory: "marketplace",
        metaData: {
          nickName: "Marketplace Activity",
          description: "Player has engaged in marketplace activity",
        },
        defaultData: {
          currencyType: "gold",
          currencyAmount: 0,
          previousMilestone: 0,
          isFirstMilestone: false,
          economyActivityType: "marketplace",
          tradingPartner: "",
          marketplaceId: "",
          itemId: "",
          itemValue: 0,
          transactionType: "listing",
        },
      },
      tradingMilestone: {
        category: "economy",
        subCategory: "trading",
        metaData: {
          nickName: "Trading Milestone",
          description: "Player has reached a trading milestone",
        },
        defaultData: {
          currencyType: "gold",
          currencyAmount: 0,
          previousMilestone: 0,
          isFirstMilestone: false,
          economyActivityType: "trading",
          tradingPartner: "",
          marketplaceId: "",
          itemId: "",
          itemValue: 0,
          transactionType: "trade",
          totalTradesCompleted: 10,
          tradeMilestoneThreshold: 10,
        },
      },
      rareCurrencyAcquired: {
        category: "economy",
        subCategory: "rare-currency",
        metaData: {
          nickName: "Rare Currency Acquired",
          description: "Player has acquired rare or premium currency",
        },
        defaultData: {
          currencyType: "premium",
          currencyAmount: 100,
          previousMilestone: 0,
          isFirstMilestone: true,
          economyActivityType: "acquisition",
          tradingPartner: "",
          marketplaceId: "",
          itemId: "",
          itemValue: 0,
          transactionType: "none",
          acquisitionMethod: "reward",
        },
      },
    };

    return presets[presetName] || null;
  }
}
